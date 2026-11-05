import { NextResponse } from "next/server";

const providers = {
  openai: { name: "OpenAI", base: "https://api.openai.com/v1", format: "openai" },
  groq: { name: "Groq", base: "https://api.groq.com/openai/v1", format: "openai" },
  deepseek: { name: "DeepSeek", base: "https://api.deepseek.com/v1", format: "openai" },
  openrouter: { name: "OpenRouter", base: "https://openrouter.ai/api/v1", format: "openai" },
  meshapi: { name: "MeshAPI", base: "https://api.meshapi.ai/v1", format: "openai" },
  anthropic: { name: "Anthropic", base: "https://api.anthropic.com/v1", format: "anthropic" },
  gemini: { name: "Google Gemini", base: "https://generativelanguage.googleapis.com/v1beta", format: "gemini" },
} as const;

type Provider = keyof typeof providers;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const provider = String(body.provider || "openai").toLowerCase() as Provider;
    const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
    const config = providers[provider];
    if (!config) return NextResponse.json({ error: "Unsupported AI provider." }, { status: 400 });
    if (!apiKey) return NextResponse.json({ error: "Enter an API key for this provider." }, { status: 400 });

    let url = config.format === "gemini" ? `${config.base}/models?key=${encodeURIComponent(apiKey)}` : `${config.base}/models`;
    const headers: Record<string, string> = config.format === "anthropic"
      ? { "x-api-key": apiKey, "anthropic-version": "2023-06-01" }
      : config.format === "gemini" ? {} : { Authorization: `Bearer ${apiKey}` };
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(20000) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.error?.message || data?.error?.status || data?.message || `${config.name} rejected the key (HTTP ${response.status}).`;
      return NextResponse.json({ error: String(message) }, { status: response.status === 401 || response.status === 403 ? response.status : 502 });
    }
    let models: string[] = [];
    if (config.format === "gemini") models = Array.isArray(data.models) ? data.models.filter((m: any) => typeof m.name === "string" && m.supportedGenerationMethods?.includes("generateContent")).map((m: any) => m.name.replace(/^models\//, "")) : [];
    else if (config.format === "anthropic") models = Array.isArray(data.data) ? data.data.map((m: any) => m.id).filter((id: unknown): id is string => typeof id === "string") : [];
    else models = Array.isArray(data.data) ? data.data.map((m: any) => m.id).filter((id: unknown): id is string => typeof id === "string") : [];
    if (!models.length) return NextResponse.json({ error: `${config.name} returned no models. Check key permissions or account access.` }, { status: 502 });
    return NextResponse.json({ models });
  } catch {
    return NextResponse.json({ error: "Could not reach provider. Check your connection and try again." }, { status: 500 });
  }
}
