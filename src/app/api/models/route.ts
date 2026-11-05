import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
    if (!apiKey) return NextResponse.json({ error: "MeshAPI key is required." }, { status: 400 });
    const response = await fetch("https://api.meshapi.ai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(20000),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = typeof data?.error?.message === "string" ? data.error.message : "Could not load MeshAPI models. Check the key and try again.";
      return NextResponse.json({ error: message }, { status: response.status === 401 ? 401 : 502 });
    }
    const models = Array.isArray(data?.data) ? data.data.filter((item: { id?: unknown }) => typeof item?.id === "string").map((item: { id: string }) => item.id) : [];
    if (!models.length) return NextResponse.json({ error: "MeshAPI returned no available models for this key." }, { status: 502 });
    return NextResponse.json({ models });
  } catch {
    return NextResponse.json({ error: "Could not reach MeshAPI to load models." }, { status: 500 });
  }
}
