// Regenerate sitemap.xml from data/services.json plus the static pages.
// Runs as the last step of generate_all_pages.js, after the service and
// category pages exist. Policy PDFs are deliberately excluded.

const fs = require('fs');
const path = require('path');

const SITE = 'https://newts.uk';

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'data', 'services.json');

if (!fs.existsSync(dataPath)) {
  console.error('data/services.json not found');
  process.exit(1);
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function xmlEscape(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const { categories = [], services = [] } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const lastmod = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/contact.html', changefreq: 'yearly', priority: '0.5' },
  ...categories.map(c => ({
    loc: `/services/categories/${slugify(c.title)}.html`,
    changefreq: 'monthly',
    priority: '0.9',
  })),
  ...services.map(s => ({
    loc: `/services/${s.id || slugify(s.title)}.html`,
    changefreq: 'monthly',
    priority: '0.8',
  })),
];

const missing = urls.filter(u => u.loc !== '/' && !fs.existsSync(path.join(root, u.loc.slice(1))));
missing.forEach(u => console.warn(`warning: sitemap entry has no file: ${u.loc}`));

const body = urls
  .map(
    u => `  <url>
    <loc>${xmlEscape(SITE + u.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n');

fs.writeFileSync(
  path.join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
  'utf8'
);

console.log(`sitemap.xml updated with ${urls.length} urls`);
