import matter from "gray-matter";

/**
 * Blog posts are stored as individual Markdown files under:
 *   src/content/blogs/*.md
 *
 * Each file uses YAML frontmatter, e.g.
 *   ---
 *   id: 1
 *   slug: my-post
 *   category: ENGINEERING
 *   date: 2025-12-23
 *   title: Hello
 *   preview: short excerpt
 *   tags: [REACT, DX]
 *   ---
 *   markdown body...
 */

const files = import.meta.glob("../content/blogs/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(String(iso));
  if (Number.isNaN(d.getTime())) return String(iso);
  const s = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  return s.toUpperCase();
}

function getFilenameSlug(path) {
  const name = String(path).split("/").pop() || "";
  return name.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function normalizeTags(tags) {
  if (!tags) return [];
  const arr = Array.isArray(tags) ? tags : String(tags).split(/[,\s]+/);
  return arr
    .map((t) => String(t).trim())
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : `#${t.toUpperCase()}`));
}

export const blogs = Object.entries(files)
  .map(([path, raw]) => {
    const { data, content } = matter(raw);
    const id = Number(data.id);
    const slug = data.slug || getFilenameSlug(path);
    const dateIso = data.date;
    return {
      id: Number.isFinite(id) ? id : undefined,
      slug: String(slug),
      category: String(data.category || "THOUGHTS"),
      date: formatDate(dateIso),
      dateIso: dateIso ? String(dateIso) : "",
      title: String(data.title || slug),
      preview: String(data.preview || "").trim(),
      tags: normalizeTags(data.tags),
      body: String(content || "").trim(),
    };
  })
  // newest first (falls back to id if no date)
  .sort((a, b) => {
    const at = a.dateIso ? new Date(a.dateIso).getTime() : 0;
    const bt = b.dateIso ? new Date(b.dateIso).getTime() : 0;
    if (bt !== at) return bt - at;
    return (b.id || 0) - (a.id || 0);
  });

