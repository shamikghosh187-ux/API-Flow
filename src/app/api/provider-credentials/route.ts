import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { encryptSecret, hashToken } from "@/lib/crypto";

export const runtime = "nodejs";
const allowed = new Set(["groq","openrouter","openai","deepseek","mistral","anthropic","google"]);

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("provider_credentials")
      .select("id,provider,label,priority,enabled,last_four,last_used_at,last_error_at,last_error_code,created_at")
      .eq("user_id", user.id).order("priority").order("created_at");
    if (error) throw error;
    return NextResponse.json({ credentials: data ?? [] });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not load provider keys" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as {provider?:string;label?:string;apiKey?:string}|null;
  const provider = body?.provider ?? "";
  const apiKey = body?.apiKey?.trim() ?? "";
  const label = body?.label?.trim() || "Default key";
  if (!allowed.has(provider)) return NextResponse.json({error:"Unsupported provider"},{status:400});
  if (apiKey.length < 12 || apiKey.length > 500) return NextResponse.json({error:"Enter a valid provider API key"},{status:400});
  if (label.length > 80) return NextResponse.json({error:"Label must be 80 characters or fewer"},{status:400});
  try {
    const admin = createAdminClient();
    const fingerprint = hashToken(provider + ":" + apiKey);
    const { data: existing } = await admin.from("provider_credentials").select("id").eq("user_id",user.id).eq("key_fingerprint",fingerprint).maybeSingle();
    if (existing) return NextResponse.json({error:"This key is already saved in your account"},{status:409});
    const { data, error } = await admin.from("provider_credentials").insert({
      user_id:user.id,provider,label,encrypted_secret:encryptSecret(apiKey),
      key_fingerprint:fingerprint,last_four:apiKey.slice(-4),priority:Date.now(),
    }).select("id,provider,label,last_four,enabled,priority,created_at").single();
    if (error) throw error;
    return NextResponse.json({credential:data},{status:201});
  } catch (e) {
    return NextResponse.json({error:e instanceof Error?e.message:"Could not save provider key"},{status:500});
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({error:"Unauthorized"},{status:401});
  const body = await request.json().catch(()=>null) as {id?:string;enabled?:boolean;label?:string}|null;
  if (!body?.id) return NextResponse.json({error:"Credential id required"},{status:400});
  const updates:Record<string,unknown>={updated_at:new Date().toISOString()};
  if (typeof body.enabled==="boolean") updates.enabled=body.enabled;
  if (typeof body.label==="string" && body.label.trim().length>0 && body.label.trim().length<=80) updates.label=body.label.trim();
  try {
    const admin=createAdminClient();
    const {data,error}=await admin.from("provider_credentials").update(updates).eq("id",body.id).eq("user_id",user.id).select("id,provider,label,enabled,last_four,priority").single();
    if(error) throw error;
    return NextResponse.json({credential:data});
  } catch(e) { return NextResponse.json({error:e instanceof Error?e.message:"Update failed"},{status:500}); }
}

export async function DELETE(request: NextRequest) {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Unauthorized"},{status:401});
  const id=request.nextUrl.searchParams.get("id");
  if(!id) return NextResponse.json({error:"Credential id required"},{status:400});
  const admin=createAdminClient();
  const {error}=await admin.from("provider_credentials").delete().eq("id",id).eq("user_id",user.id);
  if(error) return NextResponse.json({error:"Could not delete provider key"},{status:500});
  return NextResponse.json({ok:true});
}
