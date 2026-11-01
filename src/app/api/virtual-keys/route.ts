import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashToken } from "@/lib/crypto";

export const runtime="nodejs";

export async function GET() {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Unauthorized"},{status:401});
  const admin=createAdminClient();
  const {data,error}=await admin.from("api_keys").select("id,name,key_prefix,last_used_at,expires_at,revoked_at,created_at").eq("user_id",user.id).order("created_at",{ascending:false});
  if(error) return NextResponse.json({error:"Could not load API keys"},{status:500});
  return NextResponse.json({keys:data??[]});
}

export async function POST(request:NextRequest) {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json().catch(()=>({})) as {name?:string};
  const name=body.name?.trim()||"Default key";
  if(name.length>80) return NextResponse.json({error:"Name must be 80 characters or fewer"},{status:400});
  const token="af_live_"+randomBytes(32).toString("base64url");
  const admin=createAdminClient();
  const {data,error}=await admin.from("api_keys").insert({
    user_id:user.id,name,key_prefix:token.slice(0,15),key_hash:hashToken(token),
  }).select("id,name,key_prefix,created_at").single();
  if(error) return NextResponse.json({error:"Could not create virtual API key"},{status:500});
  return NextResponse.json({key:data,secret:token},{status:201});
}

export async function DELETE(request:NextRequest) {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Unauthorized"},{status:401});
  const id=request.nextUrl.searchParams.get("id");
  if(!id) return NextResponse.json({error:"Key id required"},{status:400});
  const admin=createAdminClient();
  const {error}=await admin.from("api_keys").update({revoked_at:new Date().toISOString()}).eq("id",id).eq("user_id",user.id).is("revoked_at",null);
  if(error) return NextResponse.json({error:"Could not revoke API key"},{status:500});
  return NextResponse.json({ok:true});
}
