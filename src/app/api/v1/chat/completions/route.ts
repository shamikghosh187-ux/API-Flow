import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getFallbackProviders, resolveProvider, type ProviderConfig } from "@/lib/providers";

export const runtime = "nodejs";
export const maxDuration = 60;

const requestSchema = z.object({
  model: z.string().min(1),
  messages: z.array(z.object({
    role: z.enum(["system", "user", "assistant", "tool"]),
    content: z.union([z.string(), z.array(z.unknown())]),
  })).min(1),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().optional(),
  stream: z.boolean().optional(),
}).passthrough();

function error(message: string, status: number, type = "api_error") {
  return NextResponse.json({ error: { message, type } }, { status });
}

function shouldRetry(status: number) {
  return status === 401 || status === 402 || status === 403 || status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
}

type Attempt = { provider: ProviderConfig; model: string; key: string; keyIndex: number };

export async function POST(request: NextRequest) {
  const gatewayKey = process.env.API_FLOW_MASTER_KEY;
  if (!gatewayKey) return error("Gateway authentication is not configured.", 503, "configuration_error");

  const authorization = request.headers.get("authorization");
  if (authorization !== `Bearer ${gatewayKey}`) return error("Invalid API key.", 401, "authentication_error");

  let raw: unknown;
  try { raw = await request.json(); } catch { return error("Request body must be valid JSON.", 400, "invalid_request_error"); }
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) return error("Invalid chat completion request.", 400, "invalid_request_error");

  if (parsed.data.stream) {
    return error("Streaming is not available yet. Send stream:false or omit stream.", 400, "unsupported_feature");
  }

  const selected = resolveProvider(parsed.data.model);
  if (!selected) return error("No configured provider matches this model. Check the model prefix and server-side provider keys.", 503, "provider_unavailable");

  const providers = [selected.provider, ...getFallbackProviders(selected.provider.id)];
  const attempts: Attempt[] = providers.flatMap((provider) =>
    provider.apiKeys.map((key, index) => ({
      provider,
      model: provider.id === selected.provider.id ? selected.model : provider.defaultModel,
      key,
      keyIndex: index + 1,
    })),
  );

  let lastStatus = 502;
  let lastMessage = "All configured provider keys failed.";
  let attemptsMade = 0;
  const deadline = Date.now() + 50000;

  for (const attempt of attempts) {
    const remaining = deadline - Date.now();
    if (remaining <= 1000) {
      lastMessage = "Failover time budget reached before all keys could be tried.";
      break;
    }
    attemptsMade += 1;
    const { provider, model, key, keyIndex } = attempt;
    try {
      const upstream = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...parsed.data, model, stream: false }),
        cache: "no-store",
        signal: AbortSignal.timeout(Math.min(12000, remaining - 250)),
      });

      if (upstream.ok) {
        const payload = await upstream.json();
        return NextResponse.json(payload, {
          headers: {
            "x-api-flow-provider": provider.id,
            "x-api-flow-fallback": provider.id === selected.provider.id && keyIndex === 1 ? "false" : "true",
            "x-api-flow-key-index": String(keyIndex),
            "x-api-flow-attempts": String(attemptsMade),
          },
        });
      }

      lastStatus = upstream.status;
      lastMessage = `${provider.id} key ${keyIndex} returned HTTP ${upstream.status}.`;
      if (!shouldRetry(upstream.status)) {
        return error(lastMessage, upstream.status, "provider_error");
      }
    } catch {
      lastStatus = 502;
      lastMessage = `${provider.id} key ${keyIndex} could not be reached or timed out.`;
    }
  }

  return error(
    `All ${attemptsMade} configured key attempt(s) failed. Last issue: ${lastMessage}`,
    lastStatus >= 500 || shouldRetry(lastStatus) ? 502 : lastStatus,
    "upstream_error",
  );
}
