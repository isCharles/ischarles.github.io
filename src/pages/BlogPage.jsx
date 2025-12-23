import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GitHubComments } from "../components/GitHubComments.jsx";

export function BlogPage({ blog, xUrl, xHandle, emailUrl, commentsRepo }) {
  useEffect(() => {
    if (!blog) return;
    document.title = `Blog | ${blog.title}`;
  }, [blog]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#050505] text-white px-6 pt-24 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="font-black text-4xl mb-4">404</div>
          <p className="font-mono text-gray-400 mb-8">
            This post does not exist (or the link is wrong).
          </p>
          <a
            href="#thoughts"
            className="border-2 border-white text-white font-bold px-6 py-3 hover:bg-white hover:text-black transition-colors inline-flex items-center justify-center"
          >
            BACK TO HOME
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ff00ff] selection:text-white">
      <nav className="fixed top-0 w-full z-40 p-6 flex justify-between items-center bg-black/30 backdrop-blur border-b border-[#111]">
        <a
          href="#thoughts"
          className="font-black text-xl tracking-tighter flex items-center gap-2 hover:text-[#ccff00] transition-colors"
        >
          <span className="text-[#ccff00]">&lt;</span> BACK
        </a>
        <div className="flex items-center gap-4 font-mono text-xs text-gray-400">
          <a
            href={xUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#00ffff] transition-colors"
          >
            X / @{xHandle}
          </a>
          <a href={emailUrl} className="hover:text-[#ff00ff] transition-colors">
            EMAIL
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="bg-[#222] text-[#ccff00] text-xs px-2 py-1 font-mono font-bold">
            {blog.category}
          </span>
          <span className="text-gray-500 text-sm font-mono">{blog.date}</span>
          <div className="flex gap-3 font-mono text-xs text-gray-500">
            {blog.tags?.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tighter mb-10">
          {blog.title}
        </h1>

        <div className="border-l-2 border-[#ff00ff] pl-4 mb-10">
          <p className="font-mono text-gray-400 leading-relaxed">{blog.preview}</p>
        </div>

        <article className="mb-16 prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.body}</ReactMarkdown>
        </article>

        <div className="border-2 border-[#222] bg-[#0a0a0a] p-6 mb-16">
          <div className="font-black text-2xl mb-2">Talk to me</div>
          <div className="font-mono text-gray-400 mb-6">
            Short questions → X. Serious stuff → email.
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <a
              href={xUrl}
              target="_blank"
              rel="noreferrer"
              className="border-2 border-white text-white font-bold px-6 py-3 hover:bg-white hover:text-black transition-colors inline-flex items-center justify-center"
            >
              DISCUSS ON X
            </a>
            <a
              href={emailUrl}
              className="bg-[#ccff00] text-black font-bold px-6 py-3 hover:bg-[#ff00ff] hover:text-white transition-colors inline-flex items-center justify-center"
            >
              EMAIL ME
            </a>
          </div>
        </div>

        <div className="border-t border-[#222] pt-10">
          <div className="font-black text-2xl mb-4">Comments</div>
          <div className="font-mono text-gray-500 text-sm mb-6">
            Powered by GitHub Issues (Utterances).
          </div>
          <GitHubComments
            repo={commentsRepo}
            // hash routing: url includes the hash, so each post gets a unique thread
            issueTerm="url"
            theme="github-dark"
            label="blog-comment"
          />
        </div>
      </main>
    </div>
  );
}


