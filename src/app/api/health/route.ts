import { NextResponse } from "next/server";
import { getConfiguredProviders } from "@/lib/providers";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "api-flow",
    configuredProviders: getConfiguredProviders().map(({ id }) => id),
    timestamp: new Date().toISOString(),
  });
}