import { NextResponse } from "next/server";

const config = {
  openai: { name: "OpenAI", base: "https://api.openai.com/v1" },
  groq: { name: "Groq", base: "https://api.groq.com/openai/v1" },
  deepseek: { name: "DeepSeek", base: "https://api.deepseek.com/v1" },
  openrouter: { name: "OpenRouter", base: "https://openrouter.ai/api/v1" },
  meshapi: { name: "MeshAPI", base: "https://api.meshapi.ai/v1" },
} as const;

type CompatibleProvider = keyof typeof config;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const provider = String(body.provider || "openai").toLowerCase() as CompatibleProvider | "anthropic" | "gemini";
    const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
    const model = typeof body.model === "string" ? body.model.trim() : "";
    const question = typeof body.question === "string" ? body.question.trim() : "";
    if (!apiKey) return NextResponse.json({ error: "Add this provider's API key in Settings first." }, { status: 400 });
    if (!model) return NextResponse.json({ error: "Select an available model first." }, { status: 400 });
    if (!question || question.length > 12000) return NextResponse.json({ error: "Enter a question under 12,000 characters." }, { status: 400 });

    let response: Response;
    if (provider === "gemini") {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(60000),
        body: JSON.stringify({ systemInstruction: { parts: [{ text: "You are AXES AI, a careful research assistant. Structure your answer, distinguish evidence from uncertainty, and never invent sources or claim to browse." }] }, contents: [{ role: "user", parts: [{ text: question }] }] }),
      });
    } else if (provider === "anthropic") {
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" }, signal: AbortSignal.timeout(60000),
        body: JSON.stringify({ model, max_tokens: 4096, system: "You are AXES AI, a careful research assistant. Structure your answer, distinguish evidence from uncertainty, and never invent sources or claim to browse.", messages: [{ role: "user", content: question }] }),
      });
    } else {
      const providerConfig = config[provider as CompatibleProvider];
      if (!providerConfig) return NextResponse.json({ error: "Unsupported provider." }, { status: 400 });
      response = await fetch(`${providerConfig.base}/chat/completions`, {
        method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, signal: AbortSignal.timeout(60000),
        body: JSON.stringify({ model, messages: [{ role: "system", content: "You are AXES AI, a careful research assistant. Structure your answer, distinguish evidence from uncertainty, and never invent sources or claim to browse." }, { role: "user", content: question }], temperature: 0.3 }),
      });
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.error?.message || data?.error?.message || data?.message || `Provider request failed (HTTP ${response.status}). Check the selected model and key.`;
      return NextResponse.json({ error: String(message) }, { status: response.status === 401 || response.status === 403 ? response.status : 502 });
    }
    type TextPart = { text?: unknown };
    const answer = provider === "gemini"
      ? data?.candidates?.[0]?.content?.parts?.map((part: TextPart) => typeof part.text === "string" ? part.text : "").join("\n").trim()
      : provider === "anthropic"
        ? data?.content?.map((part: TextPart) => typeof part.text === "string" ? part.text : "").join("\n").trim()
        : data?.choices?.[0]?.message?.content?.trim();
    if (!answer) return NextResponse.json({ error: "The provider returned an empty response. Try another model." }, { status: 502 });
    return NextResponse.json({ answer, model, provider });
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError" ? "The provider took too long. Please try again." : "Could not reach the selected provider. Check your connection and try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
