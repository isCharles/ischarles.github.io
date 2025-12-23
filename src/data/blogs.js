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

function parseFrontmatter(raw) {
  const text = String(raw || "");
  if (!text.startsWith("---")) return { data: {}, content: text };

  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return { data: {}, content: text };

  const yaml = match[1];
  const content = text.slice(match[0].length);

  const data = {};
  const lines = yaml.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || /^\s*#/.test(line)) continue;

    const kv = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$/);
    if (!kv) continue;

    const key = kv[1];
    const rest = kv[2] ?? "";

    // YAML list (we only need tags: - X - Y)
    if (rest === "") {
      const list = [];
      while (i + 1 < lines.length) {
        const next = lines[i + 1];
        const m = next.match(/^\s*-\s*(.+?)\s*$/);
        if (!m) break;
        list.push(m[1]);
        i++;
      }
      data[key] = list;
      continue;
    }

    let value = rest;
    // strip surrounding quotes
    value = value.replace(/^["'](.*)["']$/, "$1").trim();
    // parse number-ish
    if (/^\d+$/.test(value)) data[key] = Number(value);
    else data[key] = value;
  }

  return { data, content };
}

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
    const { data, content } = parseFrontmatter(raw);
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

