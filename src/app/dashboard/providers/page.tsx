"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Activity, ArrowRight, Check, ChevronDown, CircleHelp, Copy, Eye, EyeOff,
  KeyRound, Layers3, LoaderCircle, LockKeyhole, Plus, Power, RefreshCw,
  ShieldCheck, Trash2, Zap
} from "lucide-react";

type Credential = {
  id: string;
  provider: string;
  label: string;
  enabled: boolean;
  last_four: string | null;
};
type VirtualKey = { id: string; name: string; key_prefix: string; revoked_at: string | null };

const providers = [
  { id: "groq", name: "Groq", detail: "Fast inference", mark: "G" },
  { id: "openrouter", name: "OpenRouter", detail: "Multi-model access", mark: "O" },
  { id: "openai", name: "OpenAI", detail: "GPT models", mark: "◎" },
  { id: "google", name: "Google AI", detail: "Gemini models", mark: "G" },
  { id: "deepseek", name: "DeepSeek", detail: "DeepSeek models", mark: "D" },
  { id: "mistral", name: "Mistral", detail: "Mistral models", mark: "M" },
];

export default function ProvidersPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [provider, setProvider] = useState("groq");
  const [label, setLabel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [virtualSecret, setVirtualSecret] = useState("");
  const [copied, setCopied] = useState(false);

  async function loadCredentials() {
    setLoading(true);
    try {
      const response = await fetch("/api/provider-credentials");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load provider keys.");
      setCredentials(data.credentials || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load provider keys.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadCredentials(); }, []);

  async function addCredential(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    setVirtualSecret("");
    try {
      const response = await fetch("/api/provider-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, label: label.trim() || providers.find(p => p.id === provider)?.name || provider, apiKey: apiKey.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save provider key.");

      setApiKey("");
      setLabel("");
      await loadCredentials();

      const keyResponse = await fetch("/api/virtual-keys");
      const keyData = await keyResponse.json();
      const activeKeys = (keyData.keys || []).filter((key: VirtualKey) => !key.revoked_at);
      if (activeKeys.length === 0) {
        const createResponse = await fetch("/api/virtual-keys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "API-FLOW Master Key" }),
        });
        const created = await createResponse.json();
        if (!createResponse.ok) throw new Error(created.error || "Provider key saved, but virtual key creation failed. Create one in Virtual API keys.");
        setVirtualSecret(created.secret);
        setNotice("Your provider key is saved and your first API-FLOW virtual key has been created.");
      } else {
        setNotice("Provider key added to your routing pool. Your existing API-FLOW virtual key can use it.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function setCredentialEnabled(item: Credential) {
    setError("");
    const response = await fetch("/api/provider-credentials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, enabled: !item.enabled }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) setError(data.error || "Could not update this key.");
    else await loadCredentials();
  }

  async function deleteCredential(id: string) {
    if (!window.confirm("Remove this provider key from your API-FLOW routing pool?")) return;
    setError("");
    const response = await fetch("/api/provider-credentials?id=" + encodeURIComponent(id), { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) setError(data.error || "Could not delete this key.");
    else await loadCredentials();
  }

  async function copyVirtualKey() {
    await navigator.clipboard.writeText(virtualSecret);
    setCopied(true);
  }

  const enabledCount = credentials.filter(item => item.enabled).length;
  const providerName = (id: string) => providers.find(item => item.id === id)?.name || id;

  return (
    <main className="console-shell">
      <aside className="console-sidebar">
        <Link href="/" className="console-brand">API-<b>FLOW</b></Link>
        <div className="console-nav-label">WORKSPACE</div>
        <Link className="console-nav" href="/dashboard"><Activity size={17}/> Overview</Link>
        <Link className="console-nav active" href="/dashboard/providers"><Layers3 size={17}/> Provider keys</Link>
        <Link className="console-nav" href="/dashboard/keys"><KeyRound size={17}/> Virtual API keys</Link>
        <Link className="console-nav" href="/dashboard/usage"><Activity size={17}/> Usage &amp; analytics</Link>
        <Link className="console-nav" href="/dashboard/playground"><Zap size={17}/> Playground</Link>
        <div className="console-sidebar-bottom"><ShieldCheck size={16}/> Encrypted credential vault</div>
      </aside>

      <section className="console-main provider-page">
        <header className="console-topbar">
          <div><span className="console-eyebrow">WORKSPACE / PROVIDER KEYS</span><h1>Connect your AI providers</h1></div>
          <Link className="console-signout" href="/dashboard/keys">Virtual keys <ArrowRight size={14}/></Link>
        </header>

        <section className="provider-hero">
          <div className="provider-hero-copy">
            <span className="provider-kicker"><Zap size={13}/> ONE GATEWAY. ALL YOUR KEYS.</span>
            <h2>Add your provider keys.<br/><em>API-FLOW does the routing.</em></h2>
            <p>Connect two, three, or more provider credentials. API-FLOW keeps them in your private routing pool and gives your applications one API key to use.</p>
            <div className="provider-stats">
              <div><b>{credentials.length}</b><span>Saved keys</span></div>
              <div><b>{enabledCount}</b><span>Enabled for routing</span></div>
              <div><b>1</b><span>Unified API</span></div>
            </div>
          </div>
          <div className="provider-flow-card">
            <div className="provider-flow-row"><span className="provider-flow-icon"><KeyRound size={17}/></span><div><b>Your provider keys</b><small>Groq · OpenAI · Gemini · more</small></div><Check size={17}/></div>
            <div className="provider-flow-connector"><i/><i/><i/></div>
            <div className="provider-flow-engine"><Layers3 size={24}/><b>API-FLOW ROUTER</b><small>One endpoint · fallback routing</small></div>
            <div className="provider-flow-connector"><i/><i/><i/></div>
            <div className="provider-flow-row virtual"><span className="provider-flow-icon"><LockKeyhole size={17}/></span><div><b>One virtual API key</b><small>Use it in all your applications</small></div><Check size={17}/></div>
          </div>
        </section>

        <div className="provider-section-heading"><div><span className="console-eyebrow">STEP 01</span><h2>Add provider credentials</h2><p>Add one key at a time. You can add multiple keys from the same provider too.</p></div><span className="provider-secure"><LockKeyhole size={14}/> Encrypted storage</span></div>

        <div className="provider-workspace">
          <form className="provider-add-card" onSubmit={addCredential}>
            <div className="provider-card-title"><span><Plus size={17}/></span><div><b>Connect a provider</b><small>Your secret key stays on the server.</small></div></div>
            <label htmlFor="provider-select">Choose provider</label>
            <div className="provider-select-wrap"><select id="provider-select" value={provider} onChange={event => setProvider(event.target.value)}>{providers.map(item => <option key={item.id} value={item.id}>{item.name} — {item.detail}</option>)}</select><ChevronDown size={16}/></div>
            <label htmlFor="provider-label">Key label <small>(optional)</small></label>
            <input id="provider-label" value={label} onChange={event => setLabel(event.target.value)} placeholder="e.g. Groq backup key"/>
            <label htmlFor="provider-secret">Provider API key</label>
            <div className="provider-secret-wrap"><input id="provider-secret" type={showSecret ? "text" : "password"} autoComplete="off" spellCheck={false} value={apiKey} onChange={event => setApiKey(event.target.value)} placeholder="Paste your provider secret key"/><button type="button" aria-label={showSecret ? "Hide API key" : "Show API key"} onClick={() => setShowSecret(value => !value)}>{showSecret ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div>
            <button className="provider-add-button" type="submit" disabled={busy || apiKey.trim().length < 12}>{busy ? <><LoaderCircle className="spin" size={17}/> Saving key...</> : <><Plus size={17}/> Add key to API-FLOW</>}</button>
            <p className="provider-encryption-note"><ShieldCheck size={14}/> Credentials are encrypted before storage and never displayed again.</p>
          </form>

          <section className="provider-list-card">
            <div className="provider-list-heading"><div><b>Your routing pool</b><small>Manage which credentials API-FLOW can use.</small></div><button type="button" onClick={() => void loadCredentials()} aria-label="Refresh provider keys"><RefreshCw size={15}/></button></div>
            {loading ? <div className="provider-list-empty"><LoaderCircle className="spin" size={22}/> Loading your keys...</div> :
              credentials.length === 0 ? <div className="provider-list-empty"><span><KeyRound size={23}/></span><b>No provider keys yet</b><p>Add your first provider key. API-FLOW will automatically create your first virtual key if you do not already have one.</p></div> :
              <div className="provider-credential-list">{credentials.map(item => <article className="provider-credential" key={item.id}><span className="provider-credential-mark">{providers.find(p => p.id === item.provider)?.mark || "K"}</span><div className="provider-credential-info"><b>{item.label}</b><small>{providerName(item.provider)} · •••• {item.last_four || "hidden"}</small></div><span className={item.enabled ? "provider-enabled" : "provider-paused"}><i/>{item.enabled ? "Enabled" : "Paused"}</span><button type="button" className="provider-icon-action" title={item.enabled ? "Pause key" : "Enable key"} onClick={() => void setCredentialEnabled(item)}><Power size={15}/></button><button type="button" className="provider-icon-action remove" title="Remove key" onClick={() => void deleteCredential(item.id)}><Trash2 size={15}/></button></article>)}</div>}
            <div className="provider-list-foot"><CircleHelp size={14}/> Paused keys are excluded from routing. Removing a key is permanent.</div>
          </section>
        </div>

        {error && <p className="auth-error">{error}</p>}
        {notice && <p className="auth-notice"><Check size={15}/>{notice}</p>}

        {virtualSecret && <section className="provider-created-key"><div><span className="provider-kicker"><Check size={13}/> VIRTUAL KEY CREATED</span><h3>Your one API-FLOW key is ready.</h3><p>Copy it now. You will use this same key even when you add more provider credentials.</p></div><code>{virtualSecret}</code><button type="button" onClick={copyVirtualKey}><Copy size={15}/>{copied ? "Copied" : "Copy virtual key"}</button><Link href="/dashboard/playground">Test your key <ArrowRight size={14}/></Link></section>}

        <section className="provider-next-step"><div><span className="provider-step-number">02</span><div><b>Use one API-FLOW virtual key</b><small>Your app never needs to know which provider key is selected.</small></div></div><Link href="/dashboard/keys">Manage virtual keys <ArrowRight size={15}/></Link></section>
        <p className="usage-disclaimer">Routing currently supports retryable-error fallback across enabled credentials. Provider health checks, quota-aware selection, and cost/latency-optimized load balancing are future upgrades.</p>
      </section>
    </main>
  );
}
