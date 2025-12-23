import React, { useState, useEffect } from 'react';
import { 
  Code, Terminal, Cpu, Zap, Globe, 
  ArrowUpRight, Github, Twitter, Mail, 
  Layers, Box, Activity, Eye, Moon, Sun,
  MessageSquare, Hash, ExternalLink, Command
} from 'lucide-react';
import { blogs } from './data/blogs.js';
import { Modal } from './components/Modal.jsx';
import { BlogPage } from './pages/BlogPage.jsx';

// --- Custom CSS for Advanced Animations ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');

  :root {
    --color-bg: #050505;
    --color-text: #ffffff;
    --color-primary: #ccff00; /* Acid Lime */
    --color-secondary: #ff00ff; /* Hot Pink */
    --color-accent: #00ffff; /* Cyan */
    --color-surface: #111111;
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
    cursor: none; /* Custom cursor */
  }

  .font-mono {
    font-family: 'JetBrains Mono', monospace;
  }

  /* Custom Cursor */
  .custom-cursor {
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-primary);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, background-color 0.2s;
    mix-blend-mode: difference;
  }
  .custom-cursor.hovered {
    width: 50px;
    height: 50px;
    background-color: var(--color-primary);
    opacity: 0.5;
    border-color: transparent;
  }

  /* Glitch Effect */
  .glitch-text {
    position: relative;
  }
  .glitch-text::before, .glitch-text::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-bg);
  }
  .glitch-text::before {
    left: 2px;
    text-shadow: -1px 0 var(--color-secondary);
    clip: rect(24px, 550px, 90px, 0);
    animation: glitch-anim-2 3s infinite linear alternate-reverse;
  }
  .glitch-text::after {
    left: -2px;
    text-shadow: -1px 0 var(--color-accent);
    clip: rect(85px, 550px, 140px, 0);
    animation: glitch-anim 2.5s infinite linear alternate-reverse;
  }

  @keyframes glitch-anim {
    0% { clip: rect(14px, 9999px, 127px, 0); }
    20% { clip: rect(85px, 9999px, 36px, 0); }
    40% { clip: rect(46px, 9999px, 8px, 0); }
    60% { clip: rect(123px, 9999px, 5px, 0); }
    80% { clip: rect(62px, 9999px, 93px, 0); }
    100% { clip: rect(23px, 9999px, 109px, 0); }
  }
  @keyframes glitch-anim-2 {
    0% { clip: rect(69px, 9999px, 11px, 0); }
    20% { clip: rect(123px, 9999px, 12px, 0); }
    40% { clip: rect(2px, 9999px, 136px, 0); }
    60% { clip: rect(76px, 9999px, 3px, 0); }
    80% { clip: rect(118px, 9999px, 56px, 0); }
    100% { clip: rect(19px, 9999px, 89px, 0); }
  }

  /* Marquee Animation */
  .marquee-container {
    overflow: hidden;
    white-space: nowrap;
  }
  .marquee-content {
    display: inline-block;
    animation: marquee 20s linear infinite;
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* Brutalist Card Hover */
  .neo-card {
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 5px 5px 0px 0px var(--color-primary);
  }
  .neo-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0px 0px var(--color-secondary);
  }
  .neo-card:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--color-primary);
  }

  /* Grainy Background Overlay */
  .grain {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 50;
    opacity: 0.05;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }
`;

const App = () => {
  const X_HANDLE = "ischarlesyang";
  const X_URL = `https://x.com/${X_HANDLE}`;
  const EMAIL = "ischarlesyang@gmail.com";
  const EMAIL_URL = `mailto:${EMAIL}`;
  const COMMENTS_REPO = "isCharles/ischarles.github.io";

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrolled, setScrolled] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  const parseRoute = () => {
    const hash = window.location.hash || "";
    // Blog route: #/blog/<slugOrId>
    if (hash.startsWith("#/blog/")) {
      const key = decodeURIComponent(hash.slice("#/blog/".length)).trim();
      return { name: "blog", key };
    }
    // Section anchors: #home/#work/#thoughts/#contact
    const section = hash.replace(/^#/, "");
    if (["home", "work", "thoughts", "contact", "about"].includes(section)) {
      return { name: "home", section };
    }
    return { name: "home", section: null };
  };

  const [route, setRoute] = useState(parseRoute);
  
  // --- Custom Cursor Logic ---
  useEffect(() => {
    const updateCursor = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateCursor);
    
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getBlogPath = (blog) => `#/blog/${encodeURIComponent(blog.slug || String(blog.id))}`;

  const findBlogByKey = (key) => {
    if (!key) return null;
    const normalized = String(key).trim().toLowerCase();
    return (
      blogs.find((b) => String(b.id) === normalized) ||
      blogs.find((b) => String(b.slug || "").toLowerCase() === normalized) ||
      null
    );
  };

  const activeBlog = route.name === "blog" ? findBlogByKey(route.key) : null;

  useEffect(() => {
    if (route.name === "home" && route.section) {
      // allow layout to paint before scrolling
      setTimeout(() => scrollToId(route.section), 0);
    }
  }, [route.name, route.section]);

  // NOTE: Blog page is rendered via src/pages/BlogPage.jsx (keeps hooks lint happy)

  // --- Data Mocks ---
  const techStack = [
    { name: 'React', icon: <Code size={20} />, color: 'text-cyan-400' },
    { name: 'Node.js', icon: <Terminal size={20} />, color: 'text-green-400' },
    { name: 'Three.js', icon: <Box size={20} />, color: 'text-pink-400' },
    { name: 'Next.js', icon: <Zap size={20} />, color: 'text-yellow-400' },
    { name: 'Rust', icon: <Cpu size={20} />, color: 'text-orange-400' },
    { name: 'GraphQL', icon: <Globe size={20} />, color: 'text-purple-400' },
  ];

  const projects = [
    {
      id: 1,
      title: "SYNTH_WAVE_GENERATOR",
      desc: "基于 Web Audio API 的模块化合成器，支持 MIDI 输入。",
      tech: "Vue3 / WebAudio / Canvas",
      status: "LIVE",
      color: "border-lime-400"
    },
    {
      id: 2,
      title: "GHOST_PROTOCOL_CLI",
      desc: "用于自动化渗透测试的 Rust 命令行工具。",
      tech: "Rust / Clap / Tokio",
      status: "BETA",
      color: "border-cyan-400"
    }
  ];

  if (route.name === "blog") {
    return (
      <BlogPage
        blog={activeBlog}
        xUrl={X_URL}
        xHandle={X_HANDLE}
        emailUrl={EMAIL_URL}
        commentsRepo={COMMENTS_REPO}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ff00ff] selection:text-white overflow-hidden relative">
      {/* Inject Styles */}
      <style>{customStyles}</style>

      {/* Noise Overlay */}
      <div className="grain"></div>

      {/* Custom Cursor */}
      <div 
        className={`custom-cursor ${isHovering ? 'hovered' : ''}`}
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-[#ccff00] z-[100]" style={{ width: `${scrolled}%` }}></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 p-6 flex justify-between items-center mix-blend-difference">
        <div className="font-black text-2xl tracking-tighter flex items-center gap-2" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Command size={24} className="text-[#ccff00]" />
          DEV_LOG<span className="text-[#ff00ff]">.v2</span>
        </div>
        <div className="hidden md:flex gap-8 font-mono text-sm">
          {['HOME', 'WORK', 'THOUGHTS', 'CONTACT'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="relative group hover:text-[#ccff00] transition-colors"
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#ccff00] transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>
        <button 
          className="md:hidden text-[#ccff00]"
          type="button"
          onClick={() => setMobileNavOpen((v) => !v)}
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
        >
          <Layers size={28} />
        </button>
      </nav>

      {/* Mobile Nav */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-[150] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/80 cursor-none"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          />
          <div className="relative z-10 m-6 border-2 border-[#222] bg-[#0a0a0a] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="font-black text-xl">
                MENU<span className="text-[#ff00ff]">.v2</span>
              </div>
              <button
                type="button"
                className="border-2 border-white px-3 py-2 font-bold hover:bg-white hover:text-black transition-colors"
                onClick={() => setMobileNavOpen(false)}
              >
                CLOSE
              </button>
            </div>
            <div className="flex flex-col gap-4 font-mono text-sm">
              {[
                { label: "HOME", id: "home" },
                { label: "WORK", id: "work" },
                { label: "THOUGHTS", id: "thoughts" },
                { label: "CONTACT", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="text-left border-b border-[#222] pb-3 hover:text-[#ccff00] transition-colors"
                  onClick={() => {
                    setMobileNavOpen(false);
                    scrollToId(item.id);
                  }}
                >
                  {item.label}
                </button>
              ))}
              <a
                href={X_URL}
                target="_blank"
                rel="noreferrer"
                className="text-left border-b border-[#222] pb-3 hover:text-[#00ffff] transition-colors"
              >
                X / @{X_HANDLE}
              </a>
              <a
                href={EMAIL_URL}
                className="text-left border-b border-[#222] pb-3 hover:text-[#ff00ff] transition-colors"
              >
                EMAIL / {EMAIL}
              </a>
            </div>
          </div>
        </div>
      ) : null}

      {/* Hero Section */}
      <header id="home" className="relative min-h-screen flex flex-col justify-center px-6 pt-20 overflow-hidden">
        {/* Decorative Grids */}
        <div className="absolute top-0 right-0 w-1/2 h-full border-l border-[#222] opacity-50 hidden lg:block"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 border border-[#333] rounded-full animate-spin-slow hidden lg:block"></div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="mb-4 flex items-center gap-4 text-[#ccff00] font-mono text-sm">
            <span className="w-3 h-3 bg-[#ccff00] animate-pulse"></span>
            AVAILABLE FOR HIRE
          </div>
          
          <h1 
            className="glitch-text text-6xl md:text-9xl font-black leading-none tracking-tighter mb-8"
            data-text="CREATIVE ENGINEER"
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            CREATIVE<br/>
            <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '2px #fff' }}>ENGINEER</span>
          </h1>
          
          <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between">
            <p className="font-mono text-gray-400 max-w-md leading-relaxed border-l-2 border-[#ff00ff] pl-4">
              Building digital experiences that merge <span className="text-white">artistic chaos</span> with <span className="text-white">code precision</span>. Currently obsessed with WebGL and Micro-frontends.
            </p>
            
            <div className="flex gap-4">
              <button 
                className="bg-[#ccff00] text-black font-bold px-8 py-4 text-lg hover:bg-[#ff00ff] hover:text-white transition-colors neo-card"
                type="button"
                onClick={() => scrollToId('work')}
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
              >
                VIEW PROJECTS
              </button>
              <a 
                href="https://github.com/isCharles"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white font-bold px-8 py-4 text-lg hover:bg-white hover:text-black transition-colors flex items-center"
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
              >
                GITHUB
              </a>
            </div>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute right-10 bottom-40 md:right-40 opacity-20 animate-bounce">
          <Cpu size={200} strokeWidth={0.5} />
        </div>
      </header>

      {/* Infinite Marquee */}
      <div className="bg-[#ccff00] text-black font-black py-4 border-y-4 border-black marquee-container transform -rotate-1 scale-105 z-20">
        <div className="marquee-content flex gap-12 text-4xl md:text-6xl uppercase italic">
          <span>React • Vue • Angular • Svelte • Node • Python • Go • Rust •</span>
          <span>React • Vue • Angular • Svelte • Node • Python • Go • Rust •</span>
          <span>React • Vue • Angular • Svelte • Node • Python • Go • Rust •</span>
          <span>React • Vue • Angular • Svelte • Node • Python • Go • Rust •</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        
        {/* Bento Grid Section */}
        <section id="about">
          <div className="flex items-end justify-between mb-12 border-b border-[#333] pb-4">
            <h2 className="text-4xl font-bold font-mono flex items-center gap-3">
              <span className="text-[#ff00ff]">01.</span> INTEL
            </h2>
            <ArrowUpRight className="text-[#333]" size={40} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
            
            {/* Bio Card */}
            <div className="col-span-1 md:col-span-2 row-span-2 bg-[#111] border border-[#333] p-8 relative overflow-hidden group hover:border-[#ccff00] transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity size={100} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-200">About Me</h3>
              <p className="text-gray-400 font-mono leading-relaxed mb-6">
                I am Charles Yang (杨志), a full-stack developer based in Beijing (BUPT). I don't just write code; I craft resilient systems and immersive interfaces. When not debugging, I'm exploring generative art or brewing dark roast coffee.
              </p>
              <div className="flex gap-2 mt-auto">
                <span className="bg-[#222] text-xs px-3 py-1 font-mono rounded-full text-[#ccff00]">Strategy</span>
                <span className="bg-[#222] text-xs px-3 py-1 font-mono rounded-full text-[#00ffff]">Development</span>
              </div>
            </div>

            {/* Stats Card */}
            <div className="col-span-1 md:col-span-1 bg-[#ccff00] text-black p-6 flex flex-col justify-between neo-card cursor-none"
                 onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <Eye size={32} />
              <div>
                <div className="text-5xl font-black mb-1">42</div>
                <div className="font-mono text-sm font-bold">PROJECTS SHIPPED</div>
              </div>
            </div>

             {/* Social Card */}
             <div className="col-span-1 md:col-span-1 bg-[#00ffff] text-black p-6 flex flex-col justify-between neo-card group"
                  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <a href={X_URL} target="_blank" rel="noreferrer" className="inline-block">
                <Twitter size={32} className="group-hover:rotate-12 transition-transform" />
              </a>
              <div>
                <a href={X_URL} target="_blank" rel="noreferrer" className="text-2xl font-black mb-1 inline-block hover:underline">
                  @{X_HANDLE}
                </a>
                <div className="font-mono text-xs font-bold">FOLLOW UPDATES</div>
              </div>
            </div>

            {/* Tech Stack Grid */}
            <div className="col-span-1 md:col-span-2 bg-[#111] border border-[#333] p-8">
              <h3 className="text-sm font-mono text-gray-500 mb-6 uppercase tracking-widest">Weapon of Choice</h3>
              <div className="grid grid-cols-3 gap-4">
                {techStack.map((tech) => (
                  <div key={tech.name} className="flex flex-col items-center justify-center p-4 bg-[#1a1a1a] hover:bg-[#222] transition-colors rounded-sm group">
                    <div className={`${tech.color} mb-2 group-hover:scale-110 transition-transform`}>{tech.icon}</div>
                    <span className="font-mono text-xs text-gray-400">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Location Card */}
            <a
              href="https://www.bupt.edu.cn/"
              target="_blank"
              rel="noreferrer"
              className="col-span-1 md:col-span-2 bg-[#ff00ff] text-white p-8 flex items-center justify-center relative overflow-hidden group neo-card"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label="Open BUPT official website"
            >
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center mix-blend-multiply opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
               <div className="relative z-10 text-center">
                 <Globe size={48} className="mx-auto mb-2" />
                 <h3 className="text-2xl font-black">BEIJING, CN</h3>
                 <p className="font-mono text-sm">BUPT, HAIDIAN • {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</p>
               </div>
            </a>

          </div>
        </section>

        {/* Blog Feed */}
        <section id="thoughts">
          <div className="flex items-end justify-between mb-12 border-b border-[#333] pb-4">
            <h2 className="text-4xl font-bold font-mono flex items-center gap-3">
              <span className="text-[#ccff00]">02.</span> LOGS
            </h2>
            <MessageSquare className="text-[#333]" size={40} />
          </div>

          <div className="space-y-8">
            {blogs.map((blog) => (
              <a
                key={blog.id}
                className="group relative block w-full text-left bg-[#0a0a0a] border-2 border-[#222] hover:border-[#ccff00] p-8 transition-all duration-300 neo-card"
                href={getBlogPath(blog)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                  <div className="flex gap-3 items-center">
                    <span className="bg-[#222] text-[#ccff00] text-xs px-2 py-1 font-mono font-bold">{blog.category}</span>
                    <span className="text-gray-500 text-sm font-mono">{blog.date}</span>
                  </div>
                  <ArrowUpRight className="text-[#222] group-hover:text-[#ccff00] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={28} />
                </div>
                
                <h3 className="text-2xl md:text-4xl font-bold mb-3 group-hover:text-[#ccff00] transition-colors">{blog.title}</h3>
                <p className="text-gray-400 font-mono mb-6 max-w-2xl">{blog.preview}</p>
                
                <div className="flex gap-4 font-mono text-xs text-gray-600">
                  {blog.tags.map(tag => <span key={tag}>{tag}</span>)}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Projects Grid */}
        <section id="work">
          <div className="flex items-end justify-between mb-12 border-b border-[#333] pb-4">
            <h2 className="text-4xl font-bold font-mono flex items-center gap-3">
              <span className="text-[#00ffff]">03.</span> PROJECTS
            </h2>
            <Layers className="text-[#333]" size={40} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div key={project.id} className={`border-4 ${project.color} bg-[#050505] p-1 relative min-h-[300px] flex flex-col group`}>
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>

                <div className="flex-1 p-8 flex flex-col justify-center items-center border border-[#222] bg-[#0a0a0a] group-hover:bg-[#111] transition-colors">
                  <div className={`text-xs font-mono mb-2 px-2 py-1 border ${project.color} text-white inline-block`}>
                    {project.status}
                  </div>
                  <h3 className="text-3xl font-black text-center mb-2">{project.title}</h3>
                  <p className="text-center text-gray-400 font-mono mb-6">{project.desc}</p>
                  <span className="text-xs font-mono text-gray-500">{project.tech}</span>
                </div>
                
                <button
                  type="button"
                  className={`w-full py-3 font-bold text-black text-lg uppercase transition-all hover:tracking-widest`}
                  style={{ backgroundColor: project.color.replace('border-', '').replace('text-', '').replace('-400', '') === 'lime' ? '#ccff00' : '#00ffff' }}
                  onClick={() => setActiveProject(project)}
                  onMouseEnter={handleMouseEnter} 
                  onMouseLeave={handleMouseLeave}
                >
                  Initialize &gt;
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <span className="text-[20vw] font-black stroke-text-thick text-[#111]">HELLO</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 relative z-10">Let's Build The Future</h2>
          <p className="text-xl font-mono text-gray-400 mb-12 max-w-lg mx-auto">
            Have a crazy idea? I'm currently open to freelance projects and open-source collaborations.
          </p>
          
          <a 
            href={EMAIL_URL}
            className="inline-block bg-white text-black font-black text-2xl px-12 py-6 neo-card hover:bg-[#ccff00] transition-colors"
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            SEND_TRANSMISSION
          </a>

          <div className="mt-20 flex justify-center gap-8">
             <a href="https://github.com/isCharles" target="_blank" rel="noreferrer">
               <Github size={32} className="hover:text-[#ccff00] cursor-pointer transition-colors" />
             </a>
             <a href={X_URL} target="_blank" rel="noreferrer" aria-label={`X / @${X_HANDLE}`}>
               <Twitter size={32} className="hover:text-[#00ffff] cursor-pointer transition-colors" />
             </a>
             <a href={EMAIL_URL} aria-label={`Email ${EMAIL}`}>
               <Mail size={32} className="hover:text-[#ff00ff] cursor-pointer transition-colors" />
             </a>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#222] py-12 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-end">
          <div>
             <div className="font-black text-2xl mb-2">DEV_LOG<span className="text-[#ff00ff]">.v2</span></div>
             <p className="text-gray-600 font-mono text-sm">
               &copy; 2025 Designed & Coded by Charles Yang.<br/>
               Powered by React & Tailwind.
             </p>
          </div>
          <div className="text-right mt-8 md:mt-0">
            <p className="font-mono text-[#ccff00] text-xs mb-2">SYSTEM STATUS: ONLINE</p>
            <div className="flex gap-1 justify-end">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-4 bg-[#ccff00] animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Project Modal */}
      <Modal
        open={!!activeProject}
        title={activeProject?.title}
        onClose={() => setActiveProject(null)}
      >
        {activeProject ? (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-[#222] text-[#00ffff] text-xs px-2 py-1 font-mono font-bold">
                {activeProject.status}
              </span>
              <span className="text-gray-500 text-sm font-mono">{activeProject.tech}</span>
            </div>
            <p className="font-mono text-gray-300 leading-relaxed mb-6">
              {activeProject.desc}
            </p>
            <p className="font-mono text-gray-500 text-sm mb-8">
              Demo / repo links are not configured yet. Add them to the project
              data when ready, and this modal can show real buttons.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                type="button"
                className="bg-[#ccff00] text-black font-bold px-6 py-3 hover:bg-[#ff00ff] hover:text-white transition-colors"
                onClick={() => {
                  setActiveProject(null);
                  scrollToId("contact");
                }}
              >
                CONTACT ME
              </button>
              <a
                href="https://github.com/isCharles"
                target="_blank"
                rel="noreferrer"
                className="border-2 border-white text-white font-bold px-6 py-3 hover:bg-white hover:text-black transition-colors inline-flex items-center justify-center"
              >
                SEE GITHUB
              </a>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default App;