import React, { useState } from 'react';
import { ArrowUpRight, ArrowDown, ArrowUp, Plus, Minus } from 'lucide-react';
import { blogs } from '../data/blogs.js';
import { DistortedWordmark } from '../components/DistortedWordmark.jsx';
import { Modal } from '../components/Modal.jsx';
import { siteConfig } from '../siteConfig.js';

const blogPath = blog => `#/blog/${encodeURIComponent(blog.slug || String(blog.id))}`;

export function HomePage() {
  const [allNotes, setAllNotes] = useState(false);
  const [projectNotes, setProjectNotes] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notes = allNotes ? blogs : blogs.slice(0, 4);

  return (
    <div className="folio" id="home">
      <a className="folio-skip" href="#main">Skip to content</a>
      <header className="folio-nav">
        <a className="folio-brand" href="#home" aria-label="Charles Yang home">
          <span className="folio-dot" /> charles.yang<span className="folio-brand-period">.</span>
        </a>
        <button className="folio-menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="folio-menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <Minus size={21} /> : <Plus size={21} />}
        </button>
        <nav id="folio-menu" className={`folio-menu${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#thoughts" onClick={() => setMenuOpen(false)}>Notes</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Say hello <ArrowUpRight size={13} /></a>
        </nav>
      </header>

      <main id="main">
        <section className="folio-hero folio-wrap" aria-labelledby="hero-title">
          <div className="folio-hero-copy">
            <p className="folio-eyebrow">CHARLES YANG <span>/</span> 杨志</p>
            <h1 id="hero-title"><span className="folio-still">Still</span><span className="folio-curious">curious<span className="folio-title-period">.</span></span></h1>
            <p className="folio-intro">I like to know how things work.<br />I care how they feel, too.<br /><span>The rest, I’m still figuring out.</span></p>
            <div className="folio-hero-links">
              <a className="folio-link" href="#work">A few things I’m making <ArrowDown size={16} /></a>
              <a className="folio-quiet-link" href={siteConfig.links.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
            </div>
          </div>
          <figure className="folio-portrait">
            <div className="folio-photo-frame"><img src="/images/shibuya-sky.jpg" alt="Charles looking over Tokyo from Shibuya Sky at dusk" width="1200" height="1417" fetchPriority="high" decoding="async" /></div>
            <figcaption><span>Shibuya Sky, Tokyo</span><span>Away from the desk ↗</span></figcaption>
          </figure>
          <div className="folio-hero-bottom"><span><span className="folio-dot" /> Currently in Beijing</span><span>Making things. Looking around.</span><a href="#about" aria-label="Continue to about"><ArrowDown size={17} /></a></div>
        </section>

        <section className="folio-about folio-wrap" id="about" aria-labelledby="about-title">
          <div className="folio-section-label"><span>01</span> A little about me</div>
          <div className="folio-about-copy">
            <h2 id="about-title">A question worth following.<br /><em>A detail worth keeping.</em></h2>
            <div className="folio-about-body">
              <p>I’m Charles, based in Beijing. I tend to stay with a question a little longer, and spend a little too much time on the details. I like things I can rely on, with a little personality of their own.</p>
              <p>I’d like to make a few things worth keeping, and see more of the world along the way. For now, some of what I’m making ends up here.</p>
            </div>
            <div className="folio-aside-line"><span>Curious by nature.</span><span>Reliable by habit.</span></div>
          </div>
        </section>

        <section className="folio-work folio-wrap" id="work" aria-labelledby="work-title">
          <div className="folio-section-heading"><div className="folio-section-label"><span>02</span> Selected work</div><h2 id="work-title">Things taking shape.</h2></div>
          <article className="folio-ardor">
            <div className="folio-project-top">
              <div><p className="folio-eyebrow">A PERSONAL PROJECT / IN PROGRESS</p><h3><img src="/ardor/ardor-mark.svg" width="35" height="35" alt="" /> Ardor</h3></div>
              <div className="folio-project-summary"><p>An AI career workspace that remembers where you left off. Resumes, interview notes, and what to work on next, together in one place.</p><div className="folio-project-links"><a className="folio-link" href="/ardor/">Product tour <ArrowUpRight size={16} /></a><button className="folio-quiet-link" type="button" aria-label="Open Ardor project details" onClick={() => setProjectNotes(true)}>Project notes <Plus size={14} /></button></div></div>
            </div>
            <a className="folio-product-image" href="/ardor/" aria-label="Explore Ardor product tour">
              <div className="folio-image-topline"><span><span className="folio-dot" /> A closer look</span><span>Ardor / Conversation <ArrowUpRight size={14} /></span></div>
              <img src="/ardor/screenshots/conversation-en.png" alt="Ardor’s real conversation interface, connecting interview records, learning and calendar plans" width="2880" height="1920" loading="lazy" decoding="async" />
            </a>
            <div className="folio-project-caption"><span>Built with Spring Boot, Next.js & LangChain4j.</span><span>Self-hostable. Still growing.</span></div>
          </article>
          <article className="folio-secondary-project">
            <div><span className="folio-small-index">ALSO ON THE SHELF</span><h3>TimeGrocery</h3></div>
            <p>A local grocery and deals platform. A place for caching, flash sales, and the details of getting an order through.</p>
            <a className="folio-quiet-link" href="https://github.com/isCharles/TimeGrocery" target="_blank" rel="noreferrer">View source <ArrowUpRight size={16} /></a>
          </article>
          <p className="folio-tools"><span>Usually working with</span> Java · Spring Boot · React · PostgreSQL · Redis · Docker</p>
        </section>

        <section className="folio-notes folio-wrap" id="thoughts" aria-labelledby="notes-title">
          <div className="folio-section-heading"><div className="folio-section-label"><span>03</span> Notes along the way</div><h2 id="notes-title">A few things I stopped<br /><em>to write down.</em></h2></div>
          <div className="folio-note-list" id="folio-note-list">
            {notes.map(blog => <a className="folio-note" href={blogPath(blog)} key={blog.slug}>
              <div className="folio-note-meta"><time dateTime={blog.dateIso}>{blog.date}</time><span>{blog.category}</span></div>
              <div className="folio-note-copy"><h3 lang="zh-CN">{blog.title}</h3><p lang="zh-CN">{blog.preview}</p></div><ArrowUpRight className="folio-note-arrow" size={21} />
            </a>)}
          </div>
          <button type="button" className="folio-all-notes folio-quiet-link" aria-expanded={allNotes} aria-controls="folio-note-list" onClick={() => setAllNotes(!allNotes)}>{allNotes ? 'A little less' : `All ${blogs.length} notes`}{allNotes ? <Minus size={15} /> : <Plus size={15} />}</button>
        </section>

        <section className="folio-contact folio-wrap" id="contact" aria-labelledby="contact-title">
          <div><p className="folio-section-label"><span>04</span> An open door</p><h2 id="contact-title">Say hello<span>.</span></h2></div>
          <div className="folio-contact-copy"><p>A thought, a question,<br />a place I should see.<br /><span>I’d be glad to hear from you.</span></p><a className="folio-email" href={siteConfig.links.email}>ischarlesyang@gmail.com <ArrowUpRight size={21} /></a></div>
        </section>
      </main>

      <footer className="folio-footer">
        <div className="folio-footer-top folio-wrap"><a href="#home">Charles Yang / 杨志</a><div><a href={siteConfig.links.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={12} /></a><a href={siteConfig.links.x} target="_blank" rel="noreferrer">X <ArrowUpRight size={12} /></a><a href="#home" aria-label="Back to top"><ArrowUp size={16} /></a></div></div>
        <div className="folio-wordmark"><DistortedWordmark text="stay curious" background="#10110f" foreground="#cbed85" /></div>
        <div className="folio-footer-bottom folio-wrap"><span>© {new Date().getFullYear()} Charles Yang</span><span>A small corner of the internet.</span></div>
      </footer>

      <Modal open={projectNotes} title="Ardor" onClose={() => setProjectNotes(false)}>
        <div className="folio-project-modal"><p>A self-hostable AI career agent for resume analysis, interview practice, and learning plans. It remembers context across conversations.</p><p>Spring Boot / Next.js / PostgreSQL / Redis / LangChain4j</p><div><a className="folio-link" href="/ardor/">PRODUCT TOUR <ArrowUpRight size={15} /></a><a className="folio-quiet-link" href="https://github.com/isCharles/project-ardor" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a></div></div>
      </Modal>
    </div>
  );
}
