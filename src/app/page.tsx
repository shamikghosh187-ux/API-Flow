import { ArrowRight, BookOpen, ChartNoAxesColumnIncreasing, Layers3, LockKeyhole, LogIn, ShieldCheck, Zap } from "lucide-react";

const benefits = [
  { icon: Zap, title: <>Ultra Fast<br/>Response</> },
  { icon: ShieldCheck, title: <>99.9%<br/>Uptime</> },
  { icon: Layers3, title: <>Smart<br/>Routing</> },
  { icon: ChartNoAxesColumnIncreasing, title: <>Real-time<br/>Analytics</> },
];

function ScienceBackdrop() {
  return (
    <div className="science-backdrop" aria-hidden="true">
      <div className="science-red-haze"/>
      <svg className="science-svg" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <linearGradient id="helix" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffb1bd"/><stop offset=".3" stopColor="#ff244d"/><stop offset=".72" stopColor="#9b092b"/><stop offset="1" stopColor="#ff647e"/></linearGradient>
          <linearGradient id="brain" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffc0c8"/><stop offset=".42" stopColor="#ed234b"/><stop offset="1" stopColor="#65091e"/></linearGradient>
          <radialGradient id="node"><stop stopColor="#fff1f3"/><stop offset=".24" stopColor="#ff385d"/><stop offset="1" stopColor="#d10d39" stopOpacity="0"/></radialGradient>
          <filter id="glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="15"/></filter>
        </defs>
        <g className="helix-motion" filter="url(#glow)" stroke="url(#helix)" strokeLinecap="round">
          <path d="M-80 -30 C250 95 470 120 365 260 C255 405 20 370 75 535 C120 670 400 690 340 845 C310 925 180 990 110 1030" strokeWidth="7"/>
          <path d="M300 -70 C75 85 210 190 350 255 C500 330 410 455 205 530 C-5 610 60 735 210 825 C340 900 390 970 460 1030" strokeWidth="7"/>
          <path d="M-80 -30 C250 95 470 120 365 260 C255 405 20 370 75 535 C120 670 400 690 340 845 C310 925 180 990 110 1030" strokeWidth="2" opacity=".65"/>
          {Array.from({length:28},(_,i)=>{const y=-10+i*37;const x1=40+Math.sin(i*.34)*300;const x2=270+Math.cos(i*.34)*170;return <g key={i}><path d={`M${x1} ${y} Q${(x1+x2)/2+25} ${y+30} ${x2} ${y+52}`} strokeWidth="2.2" opacity=".85"/><circle cx={x1} cy={y} r="4.5" fill="#ff4c6a"/><circle cx={x2} cy={y+52} r="4" fill="#ff8799"/></g>})}
        </g>
        <g className="brain-motion" filter="url(#glow)" stroke="url(#brain)" strokeLinecap="round" strokeLinejoin="round">
          <path className="brain-outline" d="M1286 255 C1245 210 1185 229 1170 281 C1120 278 1095 331 1118 372 C1075 411 1102 475 1150 485 C1138 541 1194 581 1240 552 C1270 599 1333 592 1354 548 C1404 570 1456 533 1444 481 C1495 451 1480 385 1437 365 C1442 310 1394 274 1348 292 C1337 253 1308 239 1286 255Z" strokeWidth="5" fill="#d20c35" fillOpacity=".035"/>
          <path d="M1285 260 C1252 291 1260 327 1290 343 C1251 367 1256 413 1293 431 C1263 466 1282 505 1317 515 M1195 292 C1165 328 1183 358 1215 372 C1181 409 1198 445 1230 455 M1362 286 C1395 321 1380 357 1350 374 C1388 403 1380 438 1350 453 M1420 387 C1389 399 1387 433 1412 453 M1170 423 C1206 414 1223 441 1212 472" strokeWidth="3.2" opacity=".88"/>
          <path d="M1316 273 C1300 307 1321 326 1346 340 C1320 374 1339 400 1364 413 C1341 449 1361 476 1390 489" strokeWidth="2.4" opacity=".65"/>
          {[[1170,337],[1215,372],[1290,343],[1350,374],[1420,387],[1230,455],[1293,431],[1350,453],[1412,453],[1317,515],[1240,552],[1390,489],[1346,340]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="17" fill="url(#node)"/><circle cx={x} cy={y} r="3.5" fill="#ffb4c0"/></g>)}
          <path d="M1317 515 C1332 573 1357 628 1387 698" strokeWidth="4" opacity=".75"/>
        </g>
        <g className="orbit-motion" stroke="#e91b45" strokeWidth="1.2" opacity=".48">
          <ellipse cx="1330" cy="405" rx="330" ry="115" transform="rotate(-15 1330 405)"/>
          <ellipse cx="170" cy="480" rx="390" ry="135" transform="rotate(20 170 480)"/>
          <path d="M0 820 C300 700 460 960 820 900 S1400 790 1672 720" strokeWidth="2"/>
        </g>
        {Array.from({length:100},(_,i)=><circle key={i} className="science-particle" cx={(i*149+37)%1672} cy={(i*83+19)%941} r={i%9===0?2.6:1.2} fill="#ff345b" style={{animationDelay:`${(i%17)*-.53}s`}}/>)}
      </svg>
      <div className="science-shade"/>
    </div>
  );
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span/><i/></span>;
}

export default function Home() {
  return (
    <main className="api-home">
      <ScienceBackdrop/>
      <header className="site-header">
        <a href="#" className="brand"><BrandMark/><span>API-<b>FLOW</b></span></a>
        <nav className="main-nav" aria-label="Main navigation">
          {[["Home","#"],["Models","#models"],["Pricing","#pricing"],["Docs","#docs"],["Playground","#playground"]].map(([label,href],i)=><a key={label} href={href} className={i===0?"active":""}>{label}</a>)}
        </nav>
        <a className="login-link" href="#login"><LogIn size={16}/> Login</a>
      </header>

      <section className="hero">
        <div className="hero-badge"><span/>OpenAI-Compatible API Gateway</div>
        <h1>Every AI model.<br/><span>One</span> powerful API<span className="period">.</span></h1>
        <p className="hero-copy">Access <strong>Groq, OpenRouter, OpenAI, DeepSeek</strong> and more<br className="desktop-break"/> through a single, fast and reliable endpoint.</p>
        <div className="hero-actions">
          <a className="primary-action" href="#login">Get free API key <ArrowRight size={19}/></a>
          <a className="secondary-action" href="#docs">Explore Docs <BookOpen size={17}/></a>
        </div>
        <div className="hero-benefits">{benefits.map(({icon:Icon,title},i)=><div className="benefit" key={i}><Icon/><span>{title}</span></div>)}</div>
      </section>
      <a className="scroll-cue" href="#models"><span>↓</span>Scroll to explore</a>
    </main>
  );
}