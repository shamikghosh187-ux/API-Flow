"use client";

import { useState } from "react";
import {
  Atom, ArrowUp, ChevronDown, Plus, Search, BookOpen, FileText,
  Settings2, Sparkles, Globe2, Paperclip, BrainCircuit, Microscope, FlaskConical,
  History, PanelLeftClose, Command, Telescope, Orbit, Library, SlidersHorizontal,
  MoreHorizontal, Check, Menu
} from "lucide-react";

const models = [
  { provider: "OpenAI", model: "GPT-4o", mark: "◎", tone: "openai" },
  { provider: "Anthropic", model: "Claude 3.7 Sonnet", mark: "✳", tone: "anthropic" },
  { provider: "Google", model: "Gemini 2.5 Pro", mark: "G", tone: "google" },
  { provider: "DeepSeek", model: "DeepSeek R1", mark: "◈", tone: "deepseek" },
  { provider: "Groq", model: "Llama 3.3 70B", mark: "ϟ", tone: "groq" },
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
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [mode, setMode] = useState("Deep research");
  const [prompt, setPrompt] = useState("");
  const [activeNav, setActiveNav] = useState("New research");
  const [messages, setMessages] = useState<string[]>([]);
  const [researching, setResearching] = useState(false);

  function startResearch(value = prompt) {
    const question = value.trim();
    if (!question || researching) return;
    setPrompt("");
    setMessages((old) => [...old, question]);
    setResearching(true);
    window.setTimeout(() => setResearching(false), 900);
  }

  return <main className="axes-app">
    {sidebarOpen && <aside className="axes-sidebar">
      <div className="sidebar-top">
        <Brand />
        <button className="icon-button sidebar-collapse" aria-label="Collapse sidebar" onClick={() => setSidebarOpen(false)}><PanelLeftClose size={17}/></button>
      </div>
      <button className="new-research" onClick={() => { setActiveNav("New research"); setMessages([]); }}><Plus size={16}/> <span>New research</span><span className="shortcut">⌘ K</span></button>
      <div className="sidebar-section-label">WORKSPACE</div>
      <nav className="sidebar-nav">
        {navItems.map(({label,icon:Icon}) => <button key={label} className={activeNav === label ? "nav-item active" : "nav-item"} onClick={() => setActiveNav(label)}><Icon size={16}/><span>{label}</span></button>)}
      </nav>
      <div className="sidebar-section-label recent-label"><span>RECENT</span><button aria-label="More recent options"><MoreHorizontal size={15}/></button></div>
      <div className="recent-list">
        {["Could magnetic fields power satellites?","Exoplanet atmospheres","Quantum gravity: open problems"].map((item,i)=><button key={item} onClick={() => {setActiveNav("Research history");setMessages([item]);}}><History size={14}/><span>{item}</span></button>)}
      </div>
      <div className="sidebar-bottom">
        <button className="sidebar-bottom-item" onClick={() => setActiveNav("Models")}><BrainCircuit size={16}/><span>Models</span><span className="tiny-count">5</span></button>
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
          {messages.length === 0 ? <>
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
              <div className="composer-footnote">AI-generated responses may be inaccurate. Check important claims against primary sources.</div>
            </div>
            <div className="suggestion-heading"><span>START WITH A QUESTION</span><span>Suggested research directions</span></div>
            <div className="suggestion-grid">{suggestions.map(({icon:Icon,title,prompt:sample})=><button key={title} className="suggestion-card" onClick={() => setPrompt(sample)}><span className="suggestion-icon"><Icon size={17}/></span><span><b>{title}</b><small>{sample}</small></span><ArrowUp size={14} className="suggestion-arrow"/></button>)}</div>
            <div className="workspace-footer"><span><span className="footer-dot"/> Ready to explore</span><span>Research, made more deliberate <b>·</b> AXES AI</span></div>
          </> : <div className="research-session">
            <div className="session-title"><span className="session-icon"><Microscope size={17}/></span><div><small>RESEARCH QUESTION</small><h1>{messages[messages.length-1]}</h1></div></div>
            <div className="session-status"><span className="status-dot"/> {researching ? "Preparing your workspace..." : "Project created"} <span>·</span> {selectedModel.model}</div>
            <div className="session-placeholder"><div className="placeholder-icon"><Atom size={24}/></div><h2>{researching ? "Setting up your research" : "A question is the beginning"}</h2><p>This project is ready for the research workflow. AXES AI's research engine, source retrieval, and citation generation still need to be connected before it can produce findings.</p><button onClick={() => {setMessages([]);setActiveNav("New research");}}>New research project <Plus size={14}/></button></div>
            <div className="session-composer"><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Add a follow-up question..." rows={2}/><button disabled={!prompt.trim()} onClick={()=>startResearch()}><ArrowUp size={16}/></button></div>
          </div>}
        </div>
      </div>
    </section>
  </main>;
}
