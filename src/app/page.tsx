import Link from "next/link";
import { Activity, ArrowDownUp, BarChart3, Check, CircleDot, Code2, Gauge, Network, ShieldCheck, Sparkles, Zap } from "lucide-react";

const providers = [
  { name: "OpenAI", model: "GPT-4o", mark: "◎", tone: "openai" },
  { name: "Anthropic", model: "Claude 3.5", mark: "✳", tone: "anthropic" },
  { name: "Google", model: "Gemini 2.5", mark: "G", tone: "google" },
  { name: "Groq", model: "Llama 3.3", mark: "ϟ", tone: "groq" },
  { name: "DeepSeek", model: "DeepSeek V3", mark: "◈", tone: "deepseek" },
];

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span /><i /></span>;
}

function Header() {
  return <header className="site-header">
    <Link href="/" className="brand"><BrandMark /><span>API-<b>FLOW</b></span></Link>
    <nav className="main-nav" aria-label="Main navigation">
      {[["Home", "#"], ["Models", "#models"], ["Pricing", "#pricing"], ["Docs", "#docs"], ["Playground", "#playground"]].map(([label, href], i) => <a key={label} href={href} className={i === 0 ? "active" : ""}>{label}</a>)}
    </nav>
    <a className="login-link" href="#login"><Code2 size={16} /> Console</a>
  </header>;
}

function ModelRouting() {
  return <section className="visual-panel routing-panel">
    <div className="panel-heading">
      <span className="heading-icon"><Network size={17} /></span>
      <div><strong>AI MODEL ROUTING</strong><small>Connected providers</small></div>
      <span className="live-pill"><i /> LIVE</span>
    </div>
    <div className="provider-list">
      {providers.map((p) => <div className="provider-node" key={p.name}>
        <span className={"provider-mark " + p.tone}>{p.mark}</span>
        <span className="provider-info"><b>{p.name}</b><small>{p.model}</small></span>
        <span className="provider-status"><i />Online</span>
      </div>)}
    </div>
    <div className="routing-footer"><span className="pulse-dot" /> 5 providers available <span className="route-tag">AUTO ROUTE</span></div>
  </section>;
}

function RequestFlow() {
  return <section className="flow-panel">
    <div className="flow-label"><Zap size={15} /> REAL-TIME API FLOW</div>
    <div className="flow-stage">
      <div className="flow-endpoint"><Code2 size={20} /><b>Your App</b><small>POST /v1/chat</small></div>
      <div className="flow-line"><i /><i /><i /></div>
      <div className="router-core">
        <div className="router-orbit orbit-one" /><div className="router-orbit orbit-two" />
        <div className="router-icon"><BrandMark /></div><b>SMART<br />ROUTER</b><small>API-FLOW ENGINE</small>
        <span className="router-chip"><Sparkles size={11} /> Best model selected</span>
      </div>
      <div className="flow-line reverse"><i /><i /><i /></div>
      <div className="flow-result"><span className="result-check"><Check size={17} /></span><b>Response</b><small>200 · 842ms</small></div>
    </div>
    <div className="flow-bottom">
      <span><CircleDot size={12} /> Request received</span>
      <span><ArrowDownUp size={13} /> Intelligent routing</span>
      <span><Check size={13} /> Response delivered</span>
    </div>
  </section>;
}

function DashboardPreview() {
  return <section className="visual-panel dashboard-panel">
    <div className="panel-heading">
      <span className="heading-icon"><BarChart3 size={17} /></span>
      <div><strong>DEVELOPER DASHBOARD</strong><small>Illustrative API performance</small></div>
      <span className="live-pill"><i /> PREVIEW</span>
    </div>
    <div className="metric-grid">
      <div className="metric-card"><span><Gauge size={15} /> LATENCY</span><b>842<small>ms</small></b><em>Sample</em></div>
      <div className="metric-card"><span><Activity size={15} /> REQUESTS</span><b>12.8k</b><em>Sample</em></div>
      <div className="metric-card"><span><ShieldCheck size={15} /> SUCCESS</span><b>99.9<small>%</small></b><em>Sample</em></div>
    </div>
    <div className="chart-card">
      <div className="chart-title"><b>Request activity</b><span>ILLUSTRATIVE <i /></span></div>
      <div className="chart-area">
        <div className="chart-gridlines"><i /><i /><i /><i /></div>
        <svg viewBox="0 0 420 100" preserveAspectRatio="none" aria-label="Illustrative request activity chart">
          <defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ed123d" stopOpacity=".34" /><stop offset="1" stopColor="#ed123d" stopOpacity="0" /></linearGradient></defs>
          <path d="M0 78 C24 72 34 78 54 62 S91 72 112 49 S145 59 169 42 S202 52 224 31 S255 50 281 38 S315 56 339 27 S378 42 420 10 L420 100 L0 100Z" fill="url(#chartFill)" />
          <path d="M0 78 C24 72 34 78 54 62 S91 72 112 49 S145 59 169 42 S202 52 224 31 S255 50 281 38 S315 56 339 27 S378 42 420 10" fill="none" stroke="#ff3158" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
    <div className="model-usage">
      <div className="chart-title"><b>Top models</b><span>EXAMPLE MIX</span></div>
      {[["GPT-4o", 42], ["Claude 3.5", 31], ["Gemini 2.5", 18]].map(([name, value]) => <div className="usage-row" key={name}>
        <span>{name}</span><div><i style={{ width: String(value) + "%" }} /></div><b>{value}%</b>
      </div>)}
    </div>
  </section>;
}

export default function Home() {
  return <main className="api-home">
    <div className="network-background" aria-hidden="true">
      <div className="network-grid" /><div className="ambient ambient-left" /><div className="ambient ambient-right" /><div className="ambient ambient-center" />
    </div>
    <Header />
    <section className="network-hero">
      <div className="network-intro">
        <span className="hero-badge"><i /> ONE API. EVERY MODEL.</span>
        <h1>One API. <span>Infinite</span> intelligence.</h1>
        <p>Route, monitor, and scale across the world&apos;s leading AI models — from one developer-first API.</p>
      </div>
      <div className="network-stage"><ModelRouting /><RequestFlow /><DashboardPreview /></div>
      <div className="network-caption">
        <span><span className="caption-dot" /> DESIGNED FOR RELIABLE ROUTING</span>
        <span>BUILT FOR DEVELOPERS <b>·</b> POWERED BY API-FLOW</span>
      </div>
    </section>
  </main>;
}