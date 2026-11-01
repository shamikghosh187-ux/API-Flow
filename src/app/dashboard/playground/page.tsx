"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {Activity,ArrowLeft,ArrowUpRight,Copy,LoaderCircle,Play,RotateCcw,Terminal,Zap} from "lucide-react";

type Message={role:"user"|"assistant";content:string};
const models=[
 {label:"Groq · Llama 3.3 70B",value:"groq/llama-3.3-70b-versatile"},
 {label:"OpenRouter · GPT-4o mini",value:"openrouter/openai/gpt-4o-mini"},
 {label:"OpenAI · GPT-4o mini",value:"openai/gpt-4o-mini"},
 {label:"DeepSeek · Chat",value:"deepseek/deepseek-chat"},
 {label:"Mistral · Small",value:"mistral/mistral-small-latest"},
 {label:"Anthropic · Claude Haiku",value:"anthropic/claude-3-5-haiku-latest"},
 {label:"Google · Gemini Flash",value:"google/gemini-2.5-flash"}
];
export default function PlaygroundPage(){
 const [apiKey,setApiKey]=useState("");const [model,setModel]=useState(models[0].value);const [prompt,setPrompt]=useState("");
 const [messages,setMessages]=useState<Message[]>([]);const [busy,setBusy]=useState(false);const [streaming,setStreaming]=useState(true);
 const [error,setError]=useState("");const [provider,setProvider]=useState("");const [latency,setLatency]=useState("");const [attempts,setAttempts]=useState("");
 const bottom=useRef<HTMLDivElement>(null);
 useEffect(()=>{bottom.current?.scrollIntoView({behavior:"smooth"})},[messages]);
 async function send(e:React.FormEvent){e.preventDefault();if(!apiKey.trim()||!prompt.trim()||busy)return;
  const question=prompt.trim();const next=[...messages,{role:"user" as const,content:question}];setMessages([...next,{role:"assistant",content:""}]);setPrompt("");setBusy(true);setError("");setProvider("");setLatency("");setAttempts("");
  try{
   const response=await fetch("/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+apiKey.trim()},body:JSON.stringify({model,messages:next,stream:streaming})});
   setProvider(response.headers.get("x-api-flow-provider")||"");setLatency(response.headers.get("x-api-flow-latency-ms")||"");setAttempts(response.headers.get("x-api-flow-attempts")||"");
   if(!response.ok){const data=await response.json().catch(()=>null);throw new Error(data?.error?.message||data?.error||"Request failed ("+response.status+")")}
   if(!response.body)throw new Error("The server returned an empty response stream.");
   if(!streaming){const data=await response.json();const answer=data.choices?.[0]?.message?.content??JSON.stringify(data,null,2);setMessages([...next,{role:"assistant",content:String(answer)}]);}
   else{
    const reader=response.body.getReader();const decoder=new TextDecoder();let buffer="";let answer="";
    while(true){const {value,done}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});const lines=buffer.split("\n");buffer=lines.pop()||"";
     for(const line of lines){if(!line.startsWith("data:"))continue;const payload=line.slice(5).trim();if(!payload||payload==="[DONE]")continue;try{const data=JSON.parse(payload);const delta=data.choices?.[0]?.delta?.content;if(typeof delta==="string"){answer+=delta;setMessages([...next,{role:"assistant",content:answer}]);}}catch{}}
    }
   }
  }catch(err){setError(err instanceof Error?err.message:"Something went wrong.");setMessages(current=>current.at(-1)?.content?current:[...next]);}
  finally{setBusy(false)}
 }
 function clear(){if(busy)return;setMessages([]);setError("");setProvider("");setLatency("");}
 return <main className="console-shell"><aside className="console-sidebar"><Link href="/" className="console-brand"><span className="auth-brand-mark">A</span> API-<b>FLOW</b></Link><div className="console-nav-label">WORKSPACE</div><Link className="console-nav" href="/dashboard"><Activity size={17}/> Overview</Link><Link className="console-nav" href="/dashboard/providers">Providers</Link><Link className="console-nav" href="/dashboard/keys">Virtual API keys</Link><Link className="console-nav active" href="/dashboard/playground"><Terminal size={17}/> Playground</Link><div className="console-sidebar-bottom"><Zap size={16}/> Live API testing</div></aside>
 <section className="console-main playground-main"><header className="console-topbar"><div><span className="console-eyebrow">WORKSPACE / PLAYGROUND</span><h1>API Playground</h1></div><Link className="console-signout" href="/dashboard"><ArrowLeft size={14}/> Overview</Link></header>
 <div className="console-welcome"><div><span className="console-eyebrow">TEST YOUR CONFIGURATION</span><h2>Talk to your models.</h2><p>Send a real request through your API-FLOW gateway. Your virtual key stays in this browser tab and is never saved by the playground.</p></div><span className="plan-chip">LIVE REQUESTS</span></div>
 <section className="playground-config"><label>API-FLOW virtual key<input type="password" autoComplete="off" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="af_live_…"/></label><label>Model / preferred provider<select value={model} onChange={e=>setModel(e.target.value)}>{models.map(m=><option value={m.value} key={m.value}>{m.label}</option>)}</select></label><label className="stream-toggle"><input type="checkbox" checked={streaming} onChange={e=>setStreaming(e.target.checked)}/> Stream response</label></section>
 <section className="playground-chat"><div className="playground-chat-head"><div><span className="console-eyebrow">CONVERSATION</span><b><i/> Gateway ready</b></div><button className="icon-button" onClick={clear} disabled={busy}><RotateCcw size={14}/> Clear</button></div>
 {messages.length===0?<div className="playground-empty"><span><Terminal size={24}/></span><h3>Ready when you are.</h3><p>Ask a question below. API-FLOW will route it to your selected provider and stream the answer back.</p><div className="playground-suggestions"><button onClick={()=>setPrompt("Explain how a black hole's event horizon works.")}>Explain black holes <ArrowUpRight size={13}/></button><button onClick={()=>setPrompt("Write a concise TypeScript function to debounce an input.")}>Write TypeScript <ArrowUpRight size={13}/></button></div></div>:<div className="playground-messages">{messages.map((m,i)=><article className={"playground-message "+m.role} key={i}><span>{m.role==="user"?"YOU":"API-FLOW"}</span><p>{m.content|| (busy?"Thinking…":"")}</p></article>)}<div ref={bottom}/></div>}
 {error&&<div className="auth-error">{error}</div>}
 <form className="playground-prompt" onSubmit={send}><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Send a message to your model…" rows={3} disabled={busy}/><div><small>Requests are sent to your configured provider using your virtual key.</small><button className="auth-submit" disabled={busy||!apiKey.trim()||!prompt.trim()}>{busy?<><LoaderCircle size={15} className="spin"/> Running</>:<><Play size={14}/> Send request</>}</button></div></form>
 </section>
 {(provider||latency||attempts)&&<div className="playground-meta"><span><i/> Provider <b>{provider||"reported in response"}</b></span>{latency&&<span>Latency <b>{latency} ms</b></span>}{attempts&&<span>Attempts <b>{attempts}</b></span>}</div>}
 <section className="endpoint-card"><b>Gateway endpoint</b><code>{typeof window!=="undefined"?window.location.origin:"https://your-api-flow-domain"}/api/v1/chat/completions</code><small>Authorization: Bearer YOUR_API_FLOW_KEY · Content-Type: application/json</small></section>
 </section></main>;
}
