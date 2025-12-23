import React, { useEffect, useState } from "react";
import { ArrowUp, Command } from "lucide-react";

export function FloatingDock({
  onScrollTop,
  onGoWork,
  onGoThoughts,
  onGoContact,
  githubUrl,
  onHoverStart,
  onHoverEnd,
}) {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setShowTop(y > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[120]">
      {/* Panel */}
      {open ? (
        <div className="mb-4 w-[260px] border-2 border-[#222] bg-[#0a0a0a] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-black tracking-tight">
              QUICK<span className="text-[#ff00ff]">.ACTIONS</span>
            </div>
            <button
              type="button"
              className="text-xs font-mono text-gray-400 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
            >
              CLOSE
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="border border-[#222] bg-black/20 px-3 py-2 text-xs font-mono hover:border-[#ccff00] hover:text-[#ccff00] transition-colors text-left"
              onClick={() => {
                setOpen(false);
                onGoWork?.();
              }}
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
            >
              WORK
            </button>
            <button
              type="button"
              className="border border-[#222] bg-black/20 px-3 py-2 text-xs font-mono hover:border-[#ccff00] hover:text-[#ccff00] transition-colors text-left"
              onClick={() => {
                setOpen(false);
                onGoThoughts?.();
              }}
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
            >
              BLOG
            </button>
            <button
              type="button"
              className="border border-[#222] bg-black/20 px-3 py-2 text-xs font-mono hover:border-[#ccff00] hover:text-[#ccff00] transition-colors text-left"
              onClick={() => {
                setOpen(false);
                onGoContact?.();
              }}
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
            >
              CONTACT
            </button>
            <a
              className="border border-[#222] bg-black/20 px-3 py-2 text-xs font-mono hover:border-white hover:text-white transition-colors text-left"
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
            >
              GITHUB
            </a>
          </div>

          {showTop ? (
            <button
              type="button"
              className="mt-3 w-full flex items-center justify-center gap-2 bg-[#ccff00] text-black font-bold px-3 py-2 hover:bg-[#ff00ff] hover:text-white transition-colors"
              onClick={() => {
                setOpen(false);
                onScrollTop?.();
              }}
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
            >
              <ArrowUp size={18} /> TOP
            </button>
          ) : null}
        </div>
      ) : null}

      {/* Floating button */}
      <button
        type="button"
        className="neo-card border-2 border-white bg-[#050505] text-white w-14 h-14 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-none"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        aria-label="Open quick actions"
      >
        {showTop && !open ? <ArrowUp size={22} /> : <Command size={22} />}
      </button>
    </div>
  );
}


