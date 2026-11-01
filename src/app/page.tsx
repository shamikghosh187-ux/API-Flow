import { ArrowDownRight, ArrowRight, Activity, Boxes, Braces, Check, ChevronRight, CircleDot, Cpu, GitBranch, Gauge, Layers3, LockKeyhole, Radio, ShieldCheck, Workflow, Zap } from "lucide-react";

const features = [
  { icon: Workflow, title: "Intelligent routing", text: "Send each request to the provider and model that best fits your configured priorities." },
  { icon: Radio, title: "Resilient failover", text: "Recover from provider errors with controlled retries and fallback policies." },
  { icon: Gauge, title: "Usage visibility", text: "Understand latency, token usage, request outcomes and provider performance." },
  { icon: ShieldCheck, title: "Keys stay server-side", text: "Keep upstream credentials out of browser code and customer-facing responses." },
];

const providers = ["Groq", "OpenRouter", "OpenAI", "DeepSeek", "Mistral"];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-[#f4f2f2]">
      <div className="pointer-events-none fixed inset-0 -z-0 opacity-30" style={{background:"radial-gradient(ellipse at 50% 18%, rgba(213,29,67,.15), transparent 34%), radial-gradient(ellipse at 8% 48%, rgba(255,255,255,.06), transparent 28%), radial-gradient(ellipse at 90% 72%, rgba(213,29,67,.08), transparent 25%)"}} />
      <div className="relative z-10">
        <div className="border-b border-[#d51d43]/25 bg-[#17090d] px-4 py-2 text-center text-[11px] font-medium tracking-[.16em] text-[#f0a4b3]">
          API-FLOW // THE ROUTING LAYER FOR YOUR AI STACK
        </div>
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
          <a href="#" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d51d43] shadow-[0_0_28px_rgba(213,29,67,.24)]"><Braces size={19}/></span>
            <span className="text-[15px] font-semibold tracking-[-.04em]">API<span className="text-[#ed3154]">-</span>FLOW</span>
          </a>
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[.045] p-1 md:flex">
            {["Platform","Providers","How it works","Docs"].map((item,i)=><a key={item} href={["#platform","#providers","#workflow","#docs"][i]} className={`rounded-full px-5 py-2.5 text-[12px] font-medium transition ${i===0?"bg-white text-black":"text-white/65 hover:bg-white/10 hover:text-white"}`}>{item}</a>)}
          </nav>
          <a href="#platform" className="rounded-full border border-white/15 px-5 py-2.5 text-[12px] font-medium transition hover:border-[#d51d43] hover:bg-[#d51d43]/10">Explore platform <ArrowRight className="ml-2 inline" size={14}/></a>
        </header>

        <section className="mx-auto flex min-h-[690px] max-w-6xl flex-col items-center px-5 pb-24 pt-20 text-center md:pt-28">
          <div className="mb-9 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.045] px-4 py-2 text-[11px] text-white/65 shadow-[0_8px_40px_rgba(0,0,0,.25)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ed3154] shadow-[0_0_12px_#ed3154]"/> ONE GATEWAY. MULTIPLE PROVIDERS. ZERO LOCK-IN.
          </div>
          <h1 className="max-w-5xl text-5xl font-medium leading-[1.06] tracking-[-.065em] sm:text-7xl md:text-[88px]">
            One API.<br/><span className="bg-gradient-to-r from-white via-white to-[#a9a0a3] bg-clip-text text-transparent">The right model.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-[#a3a0a3] md:text-lg">
            Route AI requests across providers through one OpenAI-compatible gateway. Choose your strategy, define fallbacks, and see what happens on every request.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <a href="#platform" className="group rounded-xl bg-[#d51d43] px-7 py-4 text-sm font-semibold text-white shadow-[0_8px_36px_rgba(213,29,67,.24)] transition hover:-translate-y-0.5 hover:bg-[#ed3154]">Explore API-FLOW <ArrowRight className="ml-3 inline transition group-hover:translate-x-1" size={16}/></a>
            <a href="#workflow" className="rounded-xl border border-white/12 bg-white/[.035] px-7 py-4 text-sm font-medium text-white/80 transition hover:bg-white/[.08]">See how it works</a>
          </div>
          <div className="mt-8 flex items-center gap-2 text-[11px] text-white/35"><LockKeyhole size={13}/> Provider credentials remain on the server. Always.</div>

          <div className="mt-20 w-full max-w-4xl rounded-2xl border border-white/10 bg-[#101012]/90 p-2 text-left shadow-[0_30px_100px_rgba(0,0,0,.55)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[.07] px-4 py-3">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#d51d43]"/><span className="text-xs font-medium text-white/75">Gateway overview</span></div>
              <span className="rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] text-white/40">PREVIEW UI</span>
            </div>
            <div className="grid gap-2 p-2 sm:grid-cols-3">
              {[["ROUTING MODE","Policy-based"],["PROVIDERS","5 integrations"],["COMPATIBILITY","OpenAI format"]].map(([k,v])=><div key={k} className="rounded-xl border border-white/[.07] bg-white/[.025] p-4"><div className="text-[9px] tracking-[.16em] text-white/35">{k}</div><div className="mt-2 text-sm font-medium text-white/85">{v}</div></div>)}
            </div>
            <div className="mx-2 mb-2 rounded-xl border border-white/[.07] bg-black/35 p-4">
              <div className="mb-3 flex items-center justify-between"><span className="text-[11px] text-white/55">Request flow</span><span className="text-[10px] text-[#ed3154]">Illustrative architecture</span></div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
                {["Your app","API-FLOW","Routing policy","Provider"].map((x,i)=><div key={x} className="flex items-center gap-2"><span className={`rounded-lg border px-3 py-2 ${i===1?"border-[#d51d43]/50 bg-[#d51d43]/10 text-[#ff9aad]":"border-white/10 bg-white/[.035] text-white/65"}`}>{x}</span>{i!==3&&<ChevronRight size={13} className="text-white/25"/>}</div>)}
              </div>
            </div>
          </div>
        </section>

        <section id="providers" className="border-y border-white/[.07] bg-white/[.018]">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-9 md:flex-row md:justify-between">
            <p className="text-[10px] font-semibold tracking-[.2em] text-white/35">DESIGNED TO CONNECT YOUR AI STACK</p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">{providers.map(p=><span key={p} className="text-sm font-medium text-white/55">{p}</span>)}</div>
          </div>
        </section>

        <section id="platform" className="mx-auto max-w-6xl px-5 py-28">
          <div className="max-w-2xl"><p className="mb-4 text-[10px] font-semibold tracking-[.22em] text-[#ed3154]">CONTROL THE FLOW</p><h2 className="text-4xl font-medium tracking-[-.05em] md:text-6xl">Infrastructure that<br/>stays out of your way.</h2><p className="mt-6 leading-7 text-[#969198]">A single integration point for model access, routing decisions and operational visibility. Built to make provider complexity manageable.</p></div>
          <div className="mt-14 grid gap-3 sm:grid-cols-2">
            {features.map(({icon:Icon,title,text},i)=><article key={title} className="group rounded-2xl border border-white/[.09] bg-gradient-to-br from-white/[.045] to-transparent p-7 transition hover:border-[#d51d43]/40"><div className="mb-8 grid h-10 w-10 place-items-center rounded-xl border border-[#d51d43]/25 bg-[#d51d43]/10 text-[#ed3154]"><Icon size={18}/></div><h3 className="text-lg font-semibold tracking-tight">{title}</h3><p className="mt-3 max-w-md text-sm leading-6 text-[#969198]">{text}</p></article>)}
          </div>
        </section>

        <section id="workflow" className="border-y border-white/[.07] bg-[#0d0d0f]">
          <div className="mx-auto grid max-w-6xl gap-14 px-5 py-24 md:grid-cols-[.8fr_1.2fr]">
            <div><p className="mb-4 text-[10px] font-semibold tracking-[.22em] text-[#ed3154]">SIMPLE BY DESIGN</p><h2 className="text-4xl font-medium tracking-[-.05em] md:text-5xl">One request.<br/>A smarter path.</h2><p className="mt-6 text-sm leading-7 text-[#969198]">Keep your application integration stable while API-FLOW handles the provider selection and execution policy behind the endpoint.</p></div>
            <div className="space-y-3">{[{n:"01",t:"Connect providers",d:"Configure upstream credentials securely on the server."},{n:"02",t:"Define routing policy",d:"Choose priorities, allowed models and fallback behavior."},{n:"03",t:"Send one API request",d:"Use a familiar OpenAI-compatible request format."},{n:"04",t:"Inspect the outcome",d:"Track provider, latency, usage and request status."}].map(x=><div key={x.n} className="flex gap-5 rounded-xl border border-white/[.08] bg-white/[.025] p-5"><span className="font-mono text-xs text-[#ed3154]">{x.n}</span><div><h3 className="text-sm font-semibold">{x.t}</h3><p className="mt-1 text-xs leading-5 text-white/45">{x.d}</p></div></div>)}</div>
          </div>
        </section>

        <section id="docs" className="mx-auto max-w-6xl px-5 py-24 text-center">
          <div className="mx-auto max-w-2xl rounded-3xl border border-[#d51d43]/25 bg-[radial-gradient(ellipse_at_top,rgba(213,29,67,.13),transparent_65%)] px-7 py-16">
            <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-[#d51d43]/30 bg-[#d51d43]/10 text-[#ed3154]"><Zap size={21}/></div>
            <p className="text-[10px] font-semibold tracking-[.22em] text-[#ed3154]">API-FLOW</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-.05em] md:text-5xl">Build with more control.</h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-[#969198]">The foundation is taking shape. The next milestones are the working gateway, secure provider configuration and real usage telemetry.</p>
            <a href="https://github.com/shamikghosh187-ux/API-Flow" className="mt-8 inline-flex items-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#f4dce2]">View source on GitHub <ArrowDownRight className="ml-2" size={16}/></a>
          </div>
        </section>
        <footer className="border-t border-white/[.07] px-5 py-8"><div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-[11px] text-white/35 sm:flex-row"><span>© 2026 API-FLOW. Built for model freedom.</span><span>CRIMSON / BLACK / ENGINEERED FOR CLARITY</span></div></footer>
      </div>
    </main>
  );
}