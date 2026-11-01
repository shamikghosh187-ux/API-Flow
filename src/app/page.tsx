import { ArrowDownRight, ArrowRight, Braces, ChevronRight, Gauge, LockKeyhole, Radio, ShieldCheck, Workflow, Zap } from "lucide-react";

const features = [
  { icon: Workflow, title: "Intelligent routing", text: "Send each request to the provider and model that best fits your configured priorities." },
  { icon: Radio, title: "Resilient failover", text: "Recover from provider errors with controlled retries and fallback policies." },
  { icon: Gauge, title: "Usage visibility", text: "Understand latency, token usage, request outcomes and provider performance." },
  { icon: ShieldCheck, title: "Keys stay server-side", text: "Keep upstream credentials out of browser code and customer-facing responses." },
];
const providers = ["Groq", "OpenRouter", "OpenAI", "DeepSeek", "Mistral"];

function AnimatedBioBackground() {
  return (
    <div className="bio-scene" aria-hidden="true">
      <div className="bio-glow bio-glow-left" />
      <div className="bio-glow bio-glow-right" />
      <svg className="bio-art" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <linearGradient id="dnaLine" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff7189"/><stop offset=".5" stopColor="#ed1744"/><stop offset="1" stopColor="#710b25"/></linearGradient>
          <linearGradient id="brainLine" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff9baa"/><stop offset=".55" stopColor="#e51c46"/><stop offset="1" stopColor="#790d2a"/></linearGradient>
          <filter id="redGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <g className="dna-drift" stroke="url(#dnaLine)" strokeWidth="2.1" opacity=".76" filter="url(#redGlow)">
          <path d="M-80 80 C220 150 250 300 30 420 S-50 690 170 850" strokeWidth="5"/>
          <path d="M170 40 C-60 170 -20 290 170 420 S390 690 150 880" strokeWidth="5"/>
          {Array.from({length:19},(_,i)=>{const y=70+i*43;const x1=42+Math.sin(i*.62)*105;const x2=90+Math.cos(i*.62)*105;return <g key={i}><path d={`M${x1} ${y} Q${(x1+x2)/2+30} ${y+18} ${x2} ${y+38}`} opacity=".8"/><circle cx={x1} cy={y} r="3.2" fill="#ff8297"/><circle cx={x2} cy={y+38} r="3.2" fill="#ef244e"/></g>})}
        </g>
        <g className="brain-drift" stroke="url(#brainLine)" strokeWidth="2" opacity=".66" filter="url(#redGlow)">
          <path d="M1260 225 C1190 165 1125 218 1138 278 C1075 300 1080 380 1138 400 C1110 465 1175 510 1222 480 C1255 535 1325 520 1340 470 C1400 500 1460 450 1430 395 C1495 355 1460 285 1400 278 C1395 215 1325 195 1290 235 C1280 215 1270 215 1260 225Z" strokeWidth="4"/>
          <path d="M1285 235 C1245 270 1265 305 1295 318 C1250 350 1260 395 1300 405 C1265 440 1290 470 1320 475 M1220 245 C1190 280 1210 315 1245 325 C1205 355 1218 395 1255 405 M1360 235 C1390 270 1370 310 1340 325 C1385 350 1370 390 1340 405 M1395 300 C1365 320 1375 355 1410 370 M1170 370 C1205 365 1220 390 1210 420" />
          <path d="M1320 250 C1305 290 1330 300 1350 315 C1320 350 1340 380 1370 390 C1345 425 1360 450 1390 455" opacity=".8"/>
          {[[1195,275],[1245,325],[1295,318],[1340,325],[1395,300],[1255,405],[1300,405],[1340,405],[1410,370],[1320,475],[1222,480],[1370,450]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%3===0?5:3.2} fill="#ff4a6d"/>)}
          <path d="M1320 475 C1340 540 1370 575 1385 655" strokeWidth="4"/>
        </g>
        <g className="orbit-lines" stroke="#e91d48" strokeWidth="1" opacity=".3"><ellipse cx="1285" cy="370" rx="300" ry="95" transform="rotate(-17 1285 370)"/><ellipse cx="150" cy="440" rx="300" ry="115" transform="rotate(22 150 440)"/></g>
        {Array.from({length:48},(_,i)=><circle key={i} className="bio-particle" cx={(i*137+83)%1600} cy={(i*83+41)%900} r={i%5===0?2.4:1.2} fill="#ff3159" style={{animationDelay:`${(i%12)*-.7}s`}}/>)}
      </svg>
      <div className="bio-vignette" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050506] text-[#f4f2f2]">
      <AnimatedBioBackground />
      <div className="relative z-10">
        <div className="border-b border-[#d51d43]/25 bg-black/50 px-4 py-2 text-center text-[10px] font-medium tracking-[.18em] text-[#f0a4b3] backdrop-blur-sm">API-FLOW // THE ROUTING LAYER FOR YOUR AI STACK</div>
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
          <a href="#" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl border border-[#ff4568]/30 bg-[#d51d43]/15 text-[#ff3159] shadow-[0_0_28px_rgba(213,29,67,.24)]"><Braces size={19}/></span><span className="text-[15px] font-semibold tracking-[-.04em]">API<span className="text-[#ed3154]">-</span>FLOW</span></a>
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/45 p-1 backdrop-blur-xl md:flex">{["Platform","Providers","How it works","Docs"].map((item,i)=><a key={item} href={["#platform","#providers","#workflow","#docs"][i]} className={`rounded-full px-5 py-2.5 text-[12px] font-medium transition ${i===0?"border border-[#d51d43]/50 bg-[#d51d43]/15 text-white shadow-[0_0_24px_rgba(213,29,67,.15)]":"text-white/65 hover:bg-white/10 hover:text-white"}`}>{item}</a>)}</nav>
          <a href="#platform" className="rounded-full border border-[#d51d43]/55 bg-black/40 px-5 py-2.5 text-[12px] font-medium transition hover:bg-[#d51d43]/15">Explore platform <ArrowRight className="ml-2 inline" size={14}/></a>
        </header>

        <section className="mx-auto flex min-h-[730px] max-w-6xl flex-col items-center px-5 pb-24 pt-20 text-center md:pt-24">
          <div className="mb-9 inline-flex items-center gap-2 rounded-full border border-[#d51d43]/30 bg-black/55 px-4 py-2 text-[11px] text-white/75 shadow-[0_8px_40px_rgba(0,0,0,.25)] backdrop-blur-md"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff3159] shadow-[0_0_12px_#ed1744]"/> OPENAI-COMPATIBLE API GATEWAY</div>
          <h1 className="max-w-5xl text-5xl font-medium leading-[1.04] tracking-[-.065em] sm:text-7xl md:text-[86px]">Every AI model.<br/><span className="bg-gradient-to-r from-[#ff345d] via-[#ff6b83] to-[#f4eeee] bg-clip-text text-transparent">One powerful API.</span></h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-[#c0b9bd] md:text-lg">Access <strong className="font-semibold text-white">Groq, OpenRouter, OpenAI, DeepSeek</strong> and more through a single, fast and reliable endpoint.</p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row"><a href="#platform" className="group rounded-full bg-[#e91542] px-8 py-4 text-sm font-semibold text-white shadow-[0_8px_42px_rgba(233,21,66,.3)] transition hover:-translate-y-0.5 hover:bg-[#ff2854]">Get started <ArrowRight className="ml-3 inline transition group-hover:translate-x-1" size={16}/></a><a href="#docs" className="rounded-full border border-white/20 bg-black/40 px-8 py-4 text-sm font-medium text-white/85 backdrop-blur transition hover:border-[#ed3154]/60 hover:bg-white/[.07]">Explore Docs <ArrowDownRight className="ml-2 inline" size={15}/></a></div>
          <div className="mt-8 flex items-center gap-2 text-[11px] text-white/45"><LockKeyhole size={13} className="text-[#ff3159]"/> Provider credentials remain on the server.</div>
          <div className="mt-20 grid w-full max-w-3xl grid-cols-2 gap-y-6 rounded-2xl border border-white/10 bg-black/45 p-6 text-left backdrop-blur-xl sm:grid-cols-4">
            {[[Zap,"Fast responses"],[ShieldCheck,"Reliable execution"],[Workflow,"Smart routing"],[Gauge,"Usage visibility"]].map(([Icon,label],i)=>{const I=Icon as typeof Zap;return <div key={String(label)} className="flex items-center justify-center gap-3 border-white/10 sm:border-r sm:last:border-0"><I size={21} className="shrink-0 text-[#ff3159]"/><span className="text-xs text-white/75">{String(label)}</span></div>})}
          </div>
        </section>

        <section id="providers" className="border-y border-white/[.08] bg-black/55 backdrop-blur-md"><div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-9 md:flex-row md:justify-between"><p className="text-[10px] font-semibold tracking-[.2em] text-white/40">DESIGNED TO CONNECT YOUR AI STACK</p><div className="flex flex-wrap justify-center gap-x-8 gap-y-3">{providers.map(p=><span key={p} className="text-sm font-medium text-white/65">{p}</span>)}</div></div></section>
        <section id="platform" className="mx-auto max-w-6xl px-5 py-28"><div className="max-w-2xl"><p className="mb-4 text-[10px] font-semibold tracking-[.22em] text-[#ff4568]">CONTROL THE FLOW</p><h2 className="text-4xl font-medium tracking-[-.05em] md:text-6xl">Infrastructure that<br/>stays out of your way.</h2><p className="mt-6 leading-7 text-[#aaa1a5]">A single integration point for model access, routing decisions and operational visibility. Built to make provider complexity manageable.</p></div><div className="mt-14 grid gap-3 sm:grid-cols-2">{features.map(({icon:Icon,title,text})=><article key={title} className="group rounded-2xl border border-white/[.09] bg-[#10090c]/80 p-7 backdrop-blur-lg transition hover:border-[#d51d43]/50"><div className="mb-8 grid h-10 w-10 place-items-center rounded-xl border border-[#d51d43]/25 bg-[#d51d43]/10 text-[#ff4568]"><Icon size={18}/></div><h3 className="text-lg font-semibold tracking-tight">{title}</h3><p className="mt-3 max-w-md text-sm leading-6 text-[#aaa1a5]">{text}</p></article>)}</div></section>
        <section id="workflow" className="border-y border-white/[.07] bg-black/65 backdrop-blur-md"><div className="mx-auto grid max-w-6xl gap-14 px-5 py-24 md:grid-cols-[.8fr_1.2fr]"><div><p className="mb-4 text-[10px] font-semibold tracking-[.22em] text-[#ff4568]">SIMPLE BY DESIGN</p><h2 className="text-4xl font-medium tracking-[-.05em] md:text-5xl">One request.<br/>A smarter path.</h2><p className="mt-6 text-sm leading-7 text-[#aaa1a5]">Keep your application integration stable while API-FLOW handles the provider selection and execution policy behind the endpoint.</p></div><div className="space-y-3">{[{n:"01",t:"Connect providers",d:"Configure upstream credentials securely on the server."},{n:"02",t:"Define routing policy",d:"Choose priorities, allowed models and fallback behavior."},{n:"03",t:"Send one API request",d:"Use a familiar OpenAI-compatible request format."},{n:"04",t:"Inspect the outcome",d:"Track provider, latency, usage and request status."}].map(x=><div key={x.n} className="flex gap-5 rounded-xl border border-white/[.08] bg-white/[.035] p-5 backdrop-blur"><span className="font-mono text-xs text-[#ff4568]">{x.n}</span><div><h3 className="text-sm font-semibold">{x.t}</h3><p className="mt-1 text-xs leading-5 text-white/50">{x.d}</p></div></div>)}</div></div></section>
        <section id="docs" className="mx-auto max-w-6xl px-5 py-24 text-center"><div className="mx-auto max-w-2xl rounded-3xl border border-[#d51d43]/30 bg-[radial-gradient(ellipse_at_top,rgba(213,29,67,.16),rgba(10,5,7,.92)_70%)] px-7 py-16 backdrop-blur-xl"><div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-[#d51d43]/30 bg-[#d51d43]/10 text-[#ff4568]"><Zap size={21}/></div><p className="text-[10px] font-semibold tracking-[.22em] text-[#ff4568]">API-FLOW</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] md:text-5xl">Build with more control.</h2><p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-[#aaa1a5]">A unified gateway for model access, provider resilience and operational clarity.</p><a href="https://github.com/shamikghosh187-ux/API-Flow" className="mt-8 inline-flex items-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#f4dce2]">View source on GitHub <ArrowDownRight className="ml-2" size={16}/></a></div></section>
        <footer className="border-t border-white/[.07] bg-black/60 px-5 py-8"><div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-[11px] text-white/40 sm:flex-row"><span>© 2026 API-FLOW. Built for model freedom.</span><span>CRIMSON / BLACK / ENGINEERED FOR CLARITY</span></div></footer>
      </div>
    </main>
  );
}