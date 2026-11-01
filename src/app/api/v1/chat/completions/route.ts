import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getFallbackProviders, resolveProvider } from "@/lib/providers";

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
    return error("Streaming is not available in this initial gateway release. Send stream:false or omit stream.", 400, "unsupported_feature");
  }

  const selected = resolveProvider(parsed.data.model);
  if (!selected) return error("No configured provider matches this model. Check the model prefix and server-side provider keys.", 503, "provider_unavailable");

  const attempts = [selected.provider, ...getFallbackProviders(selected.provider.id)];
  let lastStatus = 502;
  let lastMessage = "All configured providers failed.";

  for (const provider of attempts) {
    const model = provider.id === selected.provider.id ? selected.model : provider.defaultModel;
    try {
      const upstream = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...parsed.data, model, stream: false }),
        cache: "no-store",
        signal: AbortSignal.timeout(55000),
      });

      if (upstream.ok) {
        const payload = await upstream.json();
        return NextResponse.json(payload, {
          headers: {
            "x-api-flow-provider": provider.id,
            "x-api-flow-fallback": provider.id === selected.provider.id ? "false" : "true",
          },
        });
      }

      lastStatus = upstream.status;
      lastMessage = `${provider.id} returned HTTP ${upstream.status}.`;
      if (upstream.status < 500 && upstream.status !== 429) {
        return error(lastMessage, upstream.status, "provider_error");
      }
    } catch {
      lastStatus = 502;
      lastMessage = `${provider.id} could not be reached.`;
    }
  }

  return error(lastMessage, lastStatus >= 500 ? 502 : lastStatus, "upstream_error");
}