import React, { useEffect } from "react";

/**
 * Lightweight modal overlay (no external deps).
 * - ESC closes
 * - clicking the backdrop closes
 */
export function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Dialog"}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 cursor-none"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div className="relative z-10 w-full max-w-3xl border-2 border-[#222] bg-[#0a0a0a]">
        <div className="flex items-start justify-between gap-4 border-b border-[#222] p-6">
          <div>
            {title ? (
              <div className="text-2xl md:text-3xl font-black">{title}</div>
            ) : null}
            <div className="mt-1 text-xs font-mono text-gray-500">
              Press ESC to close
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border-2 border-white px-3 py-2 font-bold hover:bg-white hover:text-black transition-colors"
          >
            CLOSE
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
}


