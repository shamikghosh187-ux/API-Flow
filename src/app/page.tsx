"use client";

import { useEffect, useState } from "react";
import {
  Atom, ArrowUp, ChevronDown, Plus, Search, BookOpen, FileText,
  Settings2, Sparkles, Globe2, Paperclip, BrainCircuit, Microscope, FlaskConical,
  PanelLeftClose, Command, Telescope, Orbit, Library, SlidersHorizontal,
  MoreHorizontal, Check, Menu, Eye, EyeOff, KeyRound, ShieldCheck, Trash2
} from "lucide-react";

type ResearchProject = { id: string; title: string; questions: string[]; answer: string; model: string; updatedAt: number };\n\nconst defaultModels = [
  { provider: "MeshAPI", model: "mistral/mistral-7b-instruct-v0", mark: "✳", tone: "mesh" },
];

const navItems = [
  { label: "Start a research project", icon: Plus },
  { label: "Discover", icon: Search },
  { label: "Research library", icon: Library },
  { label: "Reports", icon: FileText },
];

const suggestions = [
  { icon: Telescope, title: "Map the frontier of astrophysics", prompt: "What are the most important unresolved questions in astrophysics, and what evidence is shaping current research?" },
  { icon: BookOpen, title: "Unpack a research paper", prompt: "Explain a recent black-hole research paper: its question, methods, findings, limitations, and significance." },
  { icon: FlaskConical, title: "Shape a testable research idea", prompt: "Help me formulate a testable exoplanet research question, identify relevant evidence, and outline a feasible approach." },
  { icon: Globe2, title: "Trace the evidence on dark matter", prompt: "Review recent dark-matter research, compare key findings, and identify the original sources behind the evidence." },
];

function Brand() {
  return <div className="axes-brand">
    <span className="axes-symbol"><Atom size={22}/><i/></span>
    <span>axes<span className="brand-ai">.ai</span></span>
  </div>;
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modelOpen, setModelOpen] = useState(false);
  const [models, setModels] = useState(defaultModels);\n  const [selectedModel, setSelectedModel] = useState(defaultModels[0]);\n  const [modelsLoading, setModelsLoading] = useState(false);\n  const [modelsError, setModelsError] = useState("");
  const [mode, setMode] = useState("Deep research");
  const [prompt, setPrompt] = useState("");
  const [activeNav, setActiveNav] = useState("New research");
  const [messages, setMessages] = useState<string[]>([]);
  const [researching, setResearching] = useState(false);
  const [apiProvider, setApiProvider] = useState("OpenAI");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [researchAnswer, setResearchAnswer] = useState("");
  const [researchError, setResearchError] = useState("");\n  const [projects, setProjects] = useState<ResearchProject[]>([]);\n  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);\n  const [projectsReady, setProjectsReady] = useState(false);\n\n  useEffect(() => {\n    try { const saved = window.localStorage.getItem("axes:research-projects"); if (saved) setProjects(JSON.parse(saved)); } catch { /* Ignore invalid local project data. */ }\n    setProjectsReady(true);\n  }, []);\n\n  useEffect(() => {\n    if (projectsReady) window.localStorage.setItem("axes:research-projects", JSON.stringify(projects));\n  }, [projects, projectsReady]);

  function saveApiKey() {
    if (!apiKey.trim()) return;
    window.sessionStorage.setItem("axes:meshapi:api-key", apiKey.trim());
    setApiKeySaved(true);
  }

  function removeApiKey() {
    window.sessionStorage.removeItem("axes:meshapi:api-key");
    setApiKey("");
    setApiKeySaved(false);
  }

  async function startResearch(value = prompt) {
    const question = value.trim();
    if (!question || researching) return;
    const key = window.sessionStorage.getItem("axes:meshapi:api-key");
    if (!key) {
      setApiProvider("MeshAPI");
      setActiveNav("Settings");
      setResearchError("Add and save this provider's API key in Settings to start researching.");
      return;
    }
    setPrompt("");
    setResearchAnswer("");
    setResearchError("");
    setMessages((old) => [...old, question]);
    setResearching(true);
    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "meshapi", model: selectedModel.model, apiKey: key, question }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Research request failed.");
      setResearchAnswer(data.answer);\n      setProjects((old) => old.map((project) => project.id === projectId ? { ...project, answer: data.answer, model: selectedModel.model, updatedAt: Date.now() } : project));
    } catch (error) {
      setResearchError(error instanceof Error ? error.message : "Research request failed.");
    } finally {
      setResearching(false);
    }
  }

  return <main className="axes-app">
    {sidebarOpen && <aside className="axes-sidebar">
      <div className="sidebar-top">
        <Brand />
        <button className="icon-button sidebar-collapse" aria-label="Collapse sidebar" onClick={() => setSidebarOpen(false)}><PanelLeftClose size={17}/></button>
      </div>
      <button className="new-research" onClick={() => { setActiveNav("New research"); setMessages([]); setResearchAnswer(""); setResearchError(""); setCurrentProjectId(null); }}><Plus size={16}/> <span>New research</span><span className="shortcut">⌘ K</span></button>\n      {projects.length > 0 && <><div className="sidebar-section-label">RECENT PROJECTS</div><nav className="sidebar-nav">{projects.slice(0, 8).map((project) => <button key={project.id} className={currentProjectId === project.id ? "nav-item active" : "nav-item"} onClick={() => { setCurrentProjectId(project.id); setMessages(project.questions); setResearchAnswer(project.answer); setResearchError(""); setActiveNav("Research project"); }}><FileText size={15}/><span>{project.title}</span></button>)}</nav></>}
      <div className="sidebar-section-label">WORKSPACE</div>
      <nav className="sidebar-nav">
        {navItems.map(({label,icon:Icon}) => <button key={label} className={activeNav === label ? "nav-item active" : "nav-item"} onClick={() => setActiveNav(label)}><Icon size={16}/><span>{label}</span></button>)}
      </nav>
      <div className="sidebar-bottom">
        <button className="sidebar-bottom-item" onClick={() => setActiveNav("Models")}><BrainCircuit size={16}/><span>Models</span><span className="tiny-count">{models.length}</span></button>
        <button className="sidebar-bottom-item" onClick={() => setActiveNav("Settings")}><Settings2 size={16}/><span>Settings</span></button>
        <div className="profile-row"><div className="profile-avatar">V</div><div><b>Research workspace</b><small>Personal account</small></div><MoreHorizontal size={16}/></div>
      </div>
    </aside>}
    <section className="axes-main">
      <header className="axes-topbar">
        <div className="topbar-left">
          {!sidebarOpen && <button className="icon-button" aria-label="Open sidebar" onClick={() => setSidebarOpen(true)}><Menu size={17}/></button>}
          <span className="breadcrumb">Workspace</span><span className="crumb-separator">/</span><span className="breadcrumb-current">{activeNav}</span>
        </div>
        <div className="topbar-actions"><button className="topbar-help"><Command size={14}/> <span>Shortcuts</span></button><button className="upgrade-button"><Sparkles size={14}/> Upgrade</button><div className="top-avatar">V</div></div>
      </header>

      <div className="research-scroll">
        <div className="research-content">
          {activeNav === "Settings" ? <div className="settings-page">
            <div className="settings-heading"><span className="settings-kicker">WORKSPACE PREFERENCES</span><h1>Settings</h1><p>Connect an AI provider to prepare your research workspace.</p></div>
            <section className="settings-card"><div className="settings-card-title"><span className="settings-card-icon"><KeyRound size={17}/></span><div><h2>AI provider API key</h2><p>Add your MeshAPI key to connect the workspace.</p></div></div>
              <label className="settings-label">Provider</label><select className="settings-select" value={apiProvider} onChange={(e)=>{setApiProvider(e.target.value);setApiKey("");setApiKeySaved(false);}}><option>MeshAPI</option></select>
              <label className="settings-label" htmlFor="provider-key">API key</label><div className="api-key-field"><input id="provider-key" type={showApiKey ? "text" : "password"} value={apiKey} onChange={(e)=>{setApiKey(e.target.value);setApiKeySaved(false);}} placeholder={`Paste your ${apiProvider} API key`} autoComplete="off"/><button type="button" aria-label={showApiKey ? "Hide API key" : "Show API key"} onClick={()=>setShowApiKey(!showApiKey)}>{showApiKey ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div>
              <div className="settings-security"><ShieldCheck size={15}/><span>Your MeshAPI key stays in this browser tab session. AXES uses it to discover models and send research requests. Never share your key.</span></div>{modelsLoading && <p>Loading available models from MeshAPI…</p>}{modelsError && <p className="research-error">{modelsError}</p>}{apiKeySaved && !modelsLoading && !modelsError && <p>{models.length} models loaded. The first model is selected automatically.</p>}
              <div className="settings-actions"><button className="settings-save" disabled={!apiKey.trim() || modelsLoading} onClick={saveApiKey}>{modelsLoading ? "Loading models…" : apiKeySaved ? <><Check size={15}/> Key saved · models loaded</> : "Save key"}</button><button className="settings-remove" onClick={removeApiKey}><Trash2 size={14}/> Remove</button></div>
            </section><div className="settings-note">Keys are session-only and are not saved to your AXES account or committed to GitHub.</div>
          </div> : messages.length === 0 ? <>
            <div className="welcome-eyebrow"><span className="status-dot"/> YOUR SPACE FOR RESEARCH</div>
            <div className="welcome-title"><h1>Turn questions into<br/><em>understanding.</em></h1><p>Investigate the unknown. Examine the evidence. Build a clearer picture.</p></div>
            <div className="research-composer">
              <div className="composer-top"><span className="composer-label"><Sparkles size={14}/> New research</span><span className="private-label"><span/> Your workspace</span></div>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => {if(e.key === "Enter" && !e.shiftKey){e.preventDefault();startResearch();}}} placeholder="What would you like to investigate?" rows={3}/>
              <div className="composer-bottom">
                <div className="composer-tools"><button title="Attach files"><Paperclip size={16}/></button><button title="Search the web"><Globe2 size={16}/><span>Web</span></button><button title="Research settings"><SlidersHorizontal size={15}/></button></div>
                <div className="composer-controls">
                  <button className="mode-select" onClick={() => setMode(mode === "Deep research" ? "Quick answer" : "Deep research")}><Orbit size={14}/>{mode}<ChevronDown size={13}/></button>
                  <div className="model-wrap"><button className="model-select" onClick={() => setModelOpen(!modelOpen)}><span className={"model-mark "+selectedModel.tone}>{selectedModel.mark}</span><span>{selectedModel.model}</span><ChevronDown size={13}/></button>
                    {modelOpen && <div className="model-menu">{models.map((m) => <button key={m.model} onClick={() => {setSelectedModel(m);setModelOpen(false);}}><span className={"model-mark "+m.tone}>{m.mark}</span><span><b>{m.model}</b><small>{m.provider}</small></span>{selectedModel.model === m.model && <Check size={14}/>}</button>)}</div>}
                  </div>
                  <button className="send-button" disabled={!prompt.trim()} aria-label="Start research" onClick={() => startResearch()}><ArrowUp size={17}/></button>
                </div>
              </div>
              <div className="composer-footnote">AI-generated responses may be inaccurate. Check important claims against primary sources. Research projects are saved in this browser.</div>
            </div>
            <div className="suggestion-heading"><span>START WITH A QUESTION</span><span>Suggested research directions</span></div>
            <div className="suggestion-grid">{suggestions.map(({icon:Icon,title,prompt:sample})=><button key={title} className="suggestion-card" onClick={() => setPrompt(sample)}><span className="suggestion-icon"><Icon size={17}/></span><span><b>{title}</b><small>{sample}</small></span><ArrowUp size={14} className="suggestion-arrow"/></button>)}</div>
            <div className="workspace-footer"><span><span className="footer-dot"/> Ready to explore</span><span>Research, made more deliberate <b>·</b> AXES AI</span></div>
          </> : <div className="research-session">
            <div className="session-title"><span className="session-icon"><Microscope size={17}/></span><div><small>RESEARCH QUESTION</small><h1>{messages[messages.length-1]}</h1></div></div>
            <div className="session-status"><span className="status-dot"/> {researching ? "Preparing your workspace..." : "Project created"} <span>·</span> {selectedModel.model}</div>
            <div className="session-placeholder"><div className="placeholder-icon"><Atom size={24}/></div><h2>{researching ? "Researching your question…" : researchError ? "Research could not complete" : researchAnswer ? "Research response" : "A question is the beginning"}</h2>{researching ? <p>Sending your question to {selectedModel.provider}. Please wait…</p> : researchError ? <p className="research-error">{researchError}</p> : researchAnswer ? <div className="research-answer">{researchAnswer}</div> : <p>Enter a question to begin. Add your MeshAPI key in Settings first.</p>}<button onClick={() => {setMessages([]);setResearchAnswer("");setResearchError("");setCurrentProjectId(null);setActiveNav("New research");}}>New research project <Plus size={14}/></button></div>
            <div className="session-composer"><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Add a follow-up question..." rows={2}/><button disabled={!prompt.trim()} onClick={()=>startResearch()}><ArrowUp size={16}/></button></div>
          </div>}
        </div>
      </div>
    </section>
  </main>;
}
