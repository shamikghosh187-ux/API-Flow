import { NextResponse } from "next/server";

const DEFAULT_MODEL = "mistral/mistral-7b-instruct-v0";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
    const model = typeof body.model === "string" && body.model.trim() ? body.model.trim() : DEFAULT_MODEL;
    const question = typeof body.question === "string" ? body.question.trim() : "";
    if (!apiKey) return NextResponse.json({ error: "Add your MeshAPI key in workspace Settings first." }, { status: 400 });
    if (!question || question.length > 12000) return NextResponse.json({ error: "Enter a question under 12,000 characters." }, { status: 400 });
    const headers: Record<string, string> = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
    const response = await fetch("https://api.meshapi.ai/v1/chat/completions", {
      method: "POST", headers, signal: AbortSignal.timeout(45000),
      body: JSON.stringify({ model, messages: [{ role: "system", content: "You are AXES AI, a careful research assistant. Give a structured, evidence-conscious answer. Do not invent citations or claim to have browsed the web." }, { role: "user", content: question }], temperature: 0.3 }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { const message = typeof data?.error?.message === "string" ? data.error.message : "MeshAPI rejected the request. Check your key, model, and account access."; return NextResponse.json({ error: message }, { status: response.status === 401 ? 401 : 502 }); }
    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) return NextResponse.json({ error: "MeshAPI returned an empty answer. Try another model." }, { status: 502 });
    return NextResponse.json({ answer, model });
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError" ? "MeshAPI took too long. Please try again." : "Could not reach MeshAPI. Check your connection and try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}