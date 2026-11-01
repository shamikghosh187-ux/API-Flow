import {NextResponse} from "next/server";
export const runtime="nodejs";
export async function GET(){return NextResponse.json({status:"ok",service:"api-flow",gateway:"openai-compatible",authentication:"per-user-virtual-key",routing:"tenant-isolated-byok",timestamp:new Date().toISOString()});}
