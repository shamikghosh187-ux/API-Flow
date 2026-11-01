import {NextRequest,NextResponse} from "next/server";
import {z} from "zod";
import {createAdminClient} from "@/lib/supabase/admin";
import {decryptSecret,hashToken} from "@/lib/crypto";
export const runtime="nodejs";
export const maxDuration=60;
const schema=z.object({model:z.string().min(1),messages:z.array(z.object({role:z.enum(["system","user","assistant","tool"]),content:z.union([z.string(),z.array(z.unknown())])})).min(1),temperature:z.number().min(0).max(2).optional(),max_tokens:z.number().int().positive().optional(),stream:z.boolean().optional()}).passthrough();
const bases:Record<string,{url:string;model:string}>={
 groq:{url:"https://api.groq.com/openai/v1",model:"llama-3.3-70b-versatile"},
 openrouter:{url:"https://openrouter.ai/api/v1",model:"openai/gpt-4o-mini"},
 openai:{url:"https://api.openai.com/v1",model:"gpt-4o-mini"},
 deepseek:{url:"https://api.deepseek.com/v1",model:"deepseek-chat"},
 mistral:{url:"https://api.mistral.ai/v1",model:"mistral-small-latest"},
 google:{url:"https://generativelanguage.googleapis.com/v1beta/openai",model:"gemini-2.5-flash"}
};
const retry=(s:number)=>[401,402,403,408,409,425,429].includes(s)||s>=500;
const err=(message:string,status:number,type="api_error")=>NextResponse.json({error:{message,type}},{status});
export async function POST(request:NextRequest){
 const auth=request.headers.get("authorization")||"";
 const token=auth.startsWith("Bearer ")?auth.slice(7):"";
 if(!token.startsWith("af_live_"))return err("A valid API-FLOW virtual key is required.",401,"authentication_error");
 let body:unknown;try{body=await request.json()}catch{return err("Request body must be valid JSON.",400,"invalid_request_error")}
 const parsed=schema.safeParse(body);if(!parsed.success)return err("Invalid chat completion request.",400,"invalid_request_error");
 let admin;try{admin=createAdminClient()}catch{return err("Gateway server configuration is incomplete.",503,"configuration_error")}
 const digest=hashToken(token);
 const {data:key,error:keyError}=await admin.from("api_keys").select("id,user_id").eq("key_hash",digest).is("revoked_at",null).maybeSingle();
 if(keyError||!key)return err("Invalid or revoked API-FLOW key.",401,"authentication_error");
 const started=Date.now();
 const {data:rows,error:credentialError}=await admin.from("provider_credentials").select("id,provider,encrypted_secret,priority,enabled").eq("user_id",key.user_id).eq("enabled",true).order("priority",{ascending:true});
 if(credentialError)return err("Could not load provider credentials.",503,"configuration_error");
 if(!rows?.length)return err("No enabled provider keys. Add keys in your API-FLOW dashboard.",503,"provider_unavailable");
 const requested=parsed.data.model;
 const slash=requested.indexOf("/");
 const requestedProvider=slash>0?requested.slice(0,slash).toLowerCase():"";
 const requestedModel=slash>0?requested.slice(slash+1):requested;
 const autoModel=["auto","api-flow/auto",""].includes(requested.toLowerCase());
 if(requestedProvider&&!bases[requestedProvider])return err("Unknown provider prefix. Supported: groq, openrouter, openai, deepseek, mistral, google.",400,"invalid_request_error");
 const ordered=[...rows].sort((a,b)=>{
  if(requestedProvider){const ap=a.provider===requestedProvider?0:1,bp=b.provider===requestedProvider?0:1;return ap-bp||a.priority-b.priority}
  return a.priority-b.priority;
 });
 const deadline=Date.now()+50000;let attempts=0,lastMessage="Provider keys unavailable.";let usedProvider="other";let result:unknown=null;let usedCredential:string|null=null;let streamResponse:Response|null=null;
 for(const row of ordered){
  if(Date.now()>deadline-700)break;
  const config=bases[row.provider];if(!config)continue;
  attempts++;usedProvider=row.provider;usedCredential=row.id;
  try{
   const secret=decryptSecret(row.encrypted_secret);
   const model=requestedProvider===row.provider?requestedModel:(requestedProvider||autoModel||attempts>1?config.model:requestedModel);
   const upstream=await fetch(config.url+"/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+secret,"Content-Type":"application/json"},body:JSON.stringify({...parsed.data,model,stream:parsed.data.stream===true}),cache:"no-store",signal:AbortSignal.timeout(Math.min(12000,deadline-Date.now()-250))});
   if(upstream.ok){if(parsed.data.stream){streamResponse=upstream;}else{result=await upstream.json();}break}
   lastMessage=row.provider+" returned HTTP "+upstream.status;
   if(!retry(upstream.status))return err(lastMessage,upstream.status,"provider_error");
  }catch(e){lastMessage=e instanceof Error?e.message:"Provider request failed";}
 }
 const latency=Date.now()-started;
 if(streamResponse?.body){
  await Promise.all([
   admin.from("api_keys").update({last_used_at:new Date().toISOString()}).eq("id",key.id),
   admin.from("provider_credentials").update({last_used_at:new Date().toISOString(),last_error_at:null,last_error_code:null}).eq("id",usedCredential),
   admin.from("usage_events").insert({user_id:key.user_id,api_key_id:key.id,provider:usedProvider,model:parsed.data.model,status_code:200,latency_ms:latency})
  ]);
  return new Response(streamResponse.body,{status:streamResponse.status,headers:{
   "content-type":streamResponse.headers.get("content-type")||"text/event-stream; charset=utf-8",
   "cache-control":"no-cache, no-transform",
   "x-api-flow-provider":usedProvider,
   "x-api-flow-attempts":String(attempts),
   "x-api-flow-fallback":String(attempts>1),
   "x-api-flow-latency-ms":String(latency)
  }});
 }
 if(!result){
  await admin.from("usage_events").insert({user_id:key.user_id,api_key_id:key.id,provider:["groq","openrouter"].includes(usedProvider)?usedProvider:"other",model:parsed.data.model,status_code:502,latency_ms:latency});
  return err("All "+attempts+" configured provider key attempts failed. Last issue: "+lastMessage,502,"upstream_error");
 }
 await Promise.all([
  admin.from("api_keys").update({last_used_at:new Date().toISOString()}).eq("id",key.id),
  admin.from("provider_credentials").update({last_used_at:new Date().toISOString(),last_error_at:null,last_error_code:null}).eq("id",usedCredential),
  admin.from("usage_events").insert({user_id:key.user_id,api_key_id:key.id,provider:["groq","openrouter"].includes(usedProvider)?usedProvider:"other",model:parsed.data.model,status_code:200,latency_ms:latency,input_tokens:(result as {usage?:{prompt_tokens?:number}} | null)?.usage?.prompt_tokens??null,output_tokens:(result as {usage?:{completion_tokens?:number}} | null)?.usage?.completion_tokens??null})
 ]);
 return NextResponse.json(result,{headers:{"x-api-flow-provider":usedProvider,"x-api-flow-attempts":String(attempts),"x-api-flow-fallback":String(attempts>1),"x-api-flow-latency-ms":String(latency)}});
}
