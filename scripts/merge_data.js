// Rebuild data/services.json, data/team.json and data/testimonials.json from
// the per-entry files that the CMS edits under data/.
// Runs as step 0 of generate_all_pages.js — the combined files are build
// artifacts consumed by the other generators and by js/main.js.

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const root = path.resolve(__dirname, '..');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readDir(dir) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) {
    console.error(`${dir} not found`);
    process.exit(1);
  }
  return fs
    .readdirSync(full)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(full, f), 'utf8')));
}

function byOrder(a, b) {
  const ao = a.order ?? Number.MAX_SAFE_INTEGER;
  const bo = b.order ?? Number.MAX_SAFE_INTEGER;
  if (ao !== bo) return ao - bo;
  return (a.title || a.fullName || '').localeCompare(b.title || b.fullName || '');
}

const categories = readDir('data/categories')
  .sort(byOrder)
  .map(c => ({ id: c.id, title: c.title, summary: c.summary }));

const categoryIds = new Set(categories.map(c => c.id));

const services = readDir('data/services')
  .sort(byOrder)
  .map(s => {
    if (!categoryIds.has(s.category)) {
      console.warn(`warning: service "${s.title}" has unknown category "${s.category}"`);
    }
    // details is markdown (bullet list) in the CMS; the generators receive
    // rendered HTML and insert it verbatim.
    const details =
      typeof s.details === 'string'
        ? marked.parse(s.details, { async: false }).trim()
        : s.details || [];
    return {
      id: slugify(s.title),
      title: s.title,
      category: s.category,
      summary: s.summary,
      details,
    };
  });

const team = readDir('data/team')
  .sort(byOrder)
  .map(m => ({
    id: m.id || slugify(m.fullName || m.name),
    name: m.name,
    fullName: m.fullName,
    title: m.title,
    image: m.image,
    bio: marked.parse(m.bio || '', { async: false }).trim(),
  }));

const testimonials = readDir('data/testimonials')
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  .map(t => ({
    statement: t.statement,
    from: t.from,
    enabled: t.enabled !== false,
    date: t.date,
  }));

fs.writeFileSync(
  path.join(root, 'data/services.json'),
  JSON.stringify({ categories, services }, null, 2) + '\n'
);
fs.writeFileSync(
  path.join(root, 'data/team.json'),
  JSON.stringify({ team }, null, 2) + '\n'
);

fs.writeFileSync(
  path.join(root, 'data/testimonials.json'),
  JSON.stringify({ testimonials }, null, 2) + '\n'
);

console.log(
  `Merged ${categories.length} categories, ${services.length} services, ${team.length} team members, ${testimonials.length} testimonials.`
);
