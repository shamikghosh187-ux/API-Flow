import Link from "next/link";
import { ArrowRight, Boxes, CheckCircle2, Info } from "lucide-react";

const providers = [
  { id:"groq", name:"Groq", model:"llama-3.3-70b-versatile", note:"OpenAI-compatible chat completions" },
  { id:"openrouter", name:"OpenRouter", model:"openai/gpt-4o-mini", note:"OpenAI-compatible chat completions" },
  { id:"openai", name:"OpenAI", model:"gpt-4o-mini", note:"OpenAI-compatible chat completions" },
  { id:"deepseek", name:"DeepSeek", model:"deepseek-chat", note:"OpenAI-compatible chat completions" },
  { id:"mistral", name:"Mistral", model:"mistral-small-latest", note:"OpenAI-compatible chat completions" },
  { id:"anthropic", name:"Anthropic", model:"claude-3-5-haiku-latest", note:"Adapter availability depends on provider API compatibility" },
  { id:"google", name:"Google AI", model:"gemini-2.5-flash", note:"OpenAI-compatible endpoint" },
];

export default function ModelsPage(){return <main className="public-page"><header className="public-header"><Link className="public-brand" href="/">△ API-<b>FLOW</b></Link><nav><Link href="/models" aria-current="page">Models</Link><Link href="/pricing">Pricing</Link><Link href="/docs">Docs</Link><Link href="/dashboard/playground">Playground</Link></nav><Link className="public-cta" href="/dashboard">Open console <ArrowRight size={15}/></Link></header><section className="public-hero"><span className="public-kicker"><Boxes size={14}/> PROVIDER SUPPORT</span><h1>One gateway.<br/><em>Seven provider adapters.</em></h1><p>Connect your own provider credentials and send chat-completion requests through one API-FLOW endpoint.</p></section><section className="provider-catalog">{providers.map(p=><article className="catalog-card" key={p.id}><div className="catalog-card-top"><span className="catalog-icon">{p.name.slice(0,1)}</span><span className="catalog-state"><CheckCircle2 size={13}/> Adapter in gateway</span></div><h2>{p.name}</h2><p>{p.note}</p><code>{p.model}</code><small>Default model configured in the current gateway adapter. You may request a provider-specific model ID.</small></article>)}</section><aside className="public-notice"><Info size={18}/><p><b>Important:</b> This is the provider adapter list in the current codebase, not a live model catalogue. API-FLOW does not currently verify model availability, context windows, pricing, or account entitlements with each provider. Your provider account and API key determine what actually works.</p></aside><div className="public-bottom-cta"><div><h2>Connect your first provider</h2><p>Add a provider key in your private workspace. Secrets are encrypted before storage.</p></div><Link className="public-cta" href="/dashboard/providers">Manage providers <ArrowRight size={15}/></Link></div></main>}
