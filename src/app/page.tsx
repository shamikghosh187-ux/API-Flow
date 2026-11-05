"use client";

import { useState } from "react";
import {
  Atom, ArrowUp, ChevronDown, ChevronLeft, Plus, Search, BookOpen, FileText,
  Settings2, Sparkles, Globe2, Paperclip, BrainCircuit, Microscope, FlaskConical,
  History, PanelLeftClose, Command, Telescope, Orbit, Library, SlidersHorizontal,
  MoreHorizontal, X, Check, Zap, Menu
} from "lucide-react";

const models = [
  { provider: "OpenAI", model: "GPT-4o", mark: "◎", tone: "openai" },
  { provider: "Anthropic", model: "Claude 3.7 Sonnet", mark: "✳", tone: "anthropic" },
  { provider: "Google", model: "Gemini 2.5 Pro", mark: "G", tone: "google" },
  { provider: "DeepSeek", model: "DeepSeek R1", mark: "◈", tone: "deepseek" },
  { provider: "Groq", model: "Llama 3.3 70B", mark: "ϟ", tone: "groq" },
];

const navItems = [
  { label: "New research", icon: Plus },
  { label: "Discover", icon: Search },
  { label: "Research library", icon: Library },
  { label: "Reports", icon: FileText },
];

const suggestions = [
  { icon: Telescope, title: "Explore a scientific question", prompt: "What are the biggest open questions in astrophysics today?" },
  { icon: BookOpen, title: "Analyze a research paper", prompt: "Help me understand a recent research paper about black holes." },
  { icon: FlaskConical, title: "Develop a research idea", prompt: "Help me develop a testable research idea about exoplanets." },
  { icon: Globe2, title: "Research across the web", prompt: "Research the latest discoveries about dark matter and cite sources." },
];

function Brand() {
  return <div className="axes-brand">
    <span className="axes-symbol"><Atom size={22}/><i/></span>
    <span>AXES<span>AI</span></span>
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
            <div className="welcome-eyebrow"><span className="status-dot"/> YOUR RESEARCH WORKSPACE</div>
            <div className="welcome-title"><h1>Where curiosity<br/><em>takes you.</em></h1><p>Ask a question. Explore the evidence. Find what’s beyond the known.</p></div>
            <div className="research-composer">
              <div className="composer-top"><span className="composer-label"><Sparkles size={14}/> Start a research project</span><span className="private-label"><span/> Private workspace</span></div>
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
              <div className="composer-footnote">AXES AI can make mistakes. Verify important findings with original sources.</div>
            </div>
            <div className="suggestion-heading"><span>MAKE A DISCOVERY</span><span>Choose a starting point</span></div>
            <div className="suggestion-grid">{suggestions.map(({icon:Icon,title,prompt:sample})=><button key={title} className="suggestion-card" onClick={() => setPrompt(sample)}><span className="suggestion-icon"><Icon size={17}/></span><span><b>{title}</b><small>{sample}</small></span><ArrowUp size={14} className="suggestion-arrow"/></button>)}</div>
            <div className="workspace-footer"><span><span className="footer-dot"/> Research tools ready</span><span>Powered by AXES AI <b>·</b> API gateway</span></div>
          </> : <div className="research-session">
            <div className="session-title"><span className="session-icon"><Microscope size={17}/></span><div><small>RESEARCH PROJECT</small><h1>{messages[messages.length-1]}</h1></div></div>
            <div className="session-status"><span className="status-dot"/> {researching ? "Preparing your research..." : "Research prompt created"} <span>·</span> {selectedModel.model}</div>
            <div className="session-placeholder"><div className="placeholder-icon"><Atom size={24}/></div><h2>{researching ? "Setting up your research" : "Your research starts here"}</h2><p>The research interface is ready. Connect the AXES AI gateway and research sources to generate answers with citations.</p><button onClick={() => {setMessages([]);setActiveNav("New research");}}>Start a new project <Plus size={14}/></button></div>
            <div className="session-composer"><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Continue exploring this topic..." rows={2}/><button disabled={!prompt.trim()} onClick={()=>startResearch()}><ArrowUp size={16}/></button></div>
          </div>}
        </div>
      </div>
    </section>
  </main>;
}
