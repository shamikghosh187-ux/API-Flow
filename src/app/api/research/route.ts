import { NextResponse } from "next/server";

const configs: Record<string, { url: string; model: string }> = {
  openai: { url: "https://api.openai.com/v1/chat/completions", model: "gpt-4o-mini" },
  groq: { url: "https://api.groq.com/openai/v1/chat/completions", model: "llama-3.3-70b-versatile" },
  deepseek: { url: "https://api.deepseek.com/chat/completions", model: "deepseek-chat" },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const provider = String(body.provider ?? "").toLowerCase();
    const question = typeof body.question === "string" ? body.question.trim() : "";
    const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";

    if (!question || question.length > 12000) {
      return NextResponse.json({ error: "Enter a question under 12,000 characters." }, { status: 400 });
    }
    if (!apiKey) return NextResponse.json({ error: "Add your provider API key in Settings first." }, { status: 400 });

    let url = "";
    let model = "";
    let headers: Record<string, string> = { "Content-Type": "application/json" };
    let payload: unknown;

    if (provider === "openai" || provider === "groq" || provider === "deepseek") {
      const config = configs[provider];
      url = config.url;
      model = config.model;
      headers.Authorization = `Bearer ${apiKey}`;
      payload = { model, messages: [{ role: "system", content: "You are AXES AI, a careful research assistant. Give a structured, evidence-conscious answer. Do not invent citations or claim to have browsed the web." }, { role: "user", content: question }], temperature: 0.3 };
    } else if (provider === "anthropic") {
      url = "https://api.anthropic.com/v1/messages";
      headers["x-api-key"] = apiKey;
      headers["anthropic-version"] = "2023-06-01";
      payload = { model: "claude-3-7-sonnet-20250219", max_tokens: 1800, system: "You are AXES AI, a careful research assistant. Give a structured, evidence-conscious answer. Do not invent citations or claim to have browsed the web.", messages: [{ role: "user", content: question }] };
    } else if (provider === "google gemini") {
      url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
      payload = { contents: [{ parts: [{ text: `You are AXES AI, a careful research assistant. Do not invent citations or claim to have browsed the web. Answer this research question clearly:\n\n${question}` }] }] };
    } else {
      return NextResponse.json({ error: "Unsupported provider. Choose OpenAI, Anthropic, Google Gemini, DeepSeek, or Groq." }, { status: 400 });
    }

    const upstream = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload), signal: AbortSignal.timeout(45000) });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = typeof data?.error?.message === "string" ? data.error.message : typeof data?.message === "string" ? data.message : "Provider rejected the request. Check your key and account access.";
      return NextResponse.json({ error: message }, { status: upstream.status === 401 ? 401 : 502 });
    }

    let answer = "";
    if (provider === "anthropic") answer = data?.content?.map((part: { text?: string }) => part.text ?? "").join("\n").trim();
    else if (provider === "google gemini") answer = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("\n").trim();
    else answer = data?.choices?.[0]?.message?.content?.trim();

    if (!answer) return NextResponse.json({ error: "The provider returned an empty answer. Try again." }, { status: 502 });
    return NextResponse.json({ answer });
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError" ? "The AI provider took too long. Please try again." : "Could not reach the AI provider. Check your connection and try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
