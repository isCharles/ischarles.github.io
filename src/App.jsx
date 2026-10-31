import React, { lazy, Suspense, useEffect, useState } from 'react';
import { blogs } from './data/blogs.js';
import { HomePage } from './pages/HomePage.jsx';
import { siteConfig } from './siteConfig.js';
import './portfolio.css';

const BlogPage = lazy(() => import('./pages/BlogPage.jsx').then(module => ({ default: module.BlogPage })));

function parseRoute() {
  const hash = window.location.hash;
  if (hash.startsWith('#/blog/')) {
    return { name: 'blog', key: decodeURIComponent(hash.slice(7)).trim() };
  }
  return { name: 'home', section: hash.slice(1) };
}

export default function App() {
  const [route, setRoute] = useState(parseRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (route.name !== 'home') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    document.title = siteConfig.meta.title;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(route.section);
      if (target) target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [route.name, route.section, route.key]);

  if (route.name === 'blog') {
    const key = route.key.toLowerCase();
    const blog = blogs.find(item => String(item.id) === key || item.slug.toLowerCase() === key);
    return (
      <Suspense fallback={<div role="status" className="folio-loading">Opening this note…</div>}>
        <BlogPage blog={blog} commentsRepo="isCharles/ischarles.github.io" />
      </Suspense>
    );
  }

  return <HomePage />;
}
