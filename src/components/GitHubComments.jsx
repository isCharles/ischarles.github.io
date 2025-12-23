import React, { useEffect, useMemo, useRef } from "react";

/**
 * GitHub-powered comments via Utterances (GitHub Issues).
 * Requires installing the Utterances GitHub App on your repo.
 */
export function GitHubComments({
  repo,
  issueTerm = "title",
  theme = "github-dark",
  label,
}) {
  const containerRef = useRef(null);

  const config = useMemo(
    () => ({
      repo,
      "issue-term": issueTerm,
      theme,
      label,
    }),
    [repo, issueTerm, theme, label],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // clear previous script/iframe on route change
    el.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    Object.entries(config).forEach(([k, v]) => {
      if (v == null || v === "") return;
      script.setAttribute(k, String(v));
    });

    el.appendChild(script);
  }, [config]);

  return <div ref={containerRef} />;
}


