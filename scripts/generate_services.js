// Simple build script to pre-render services JSON into index.html
// Usage: from project root run: node scripts/generate_services.js

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'data', 'services.json');
const indexPath = path.join(root, 'index.html');

function safeHtmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function main() {
  if (!fs.existsSync(dataPath)) {
    console.error('data/services.json not found');
    process.exit(1);
  }
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found');
    process.exit(1);
  }

  const raw = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(raw);
  const services = data.services || data;

  const panels = services.map(s => {
    const title = safeHtmlEscape(s.title || s.name || 'Service');
    const short = safeHtmlEscape(s.short || s.description || '');
    const id = safeHtmlEscape(s.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

    return `    <article class="service-panel" id="service-${id}" aria-labelledby="service-${id}-title">
      <h3 id="service-${id}-title">${title}</h3>
      <p>${short}</p>
    </article>`;
  }).join('\n');

  const htmlFragment = `\n<div class="service-panels">\n${panels}\n</div>\n`;

  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  // Replace content between the services container opening tag and its closing tag
  const startMarker = /<div[^>]*id=["']services-container["'][^>]*>/i;
  const endMarker = /<\/div>\s*<\/section>\s*<section id=.?gallery.?/i; // fall back to next section

  if (!startMarker.test(indexHtml)) {
    console.error('Could not find services container in index.html');
    process.exit(1);
  }

  // Find the exact start index
  const startMatch = indexHtml.match(startMarker);
  const startIndex = startMatch.index + startMatch[0].length;

  // Find the closing </div> that corresponds to the services container
  // Naive approach: search forward for the next '</div>' followed by optional whitespace and either '</section>' or next section id
  // We'll search for the closing '</div>' that ends that container by locating the next '</div>' that occurs before the next '<div' at the same nesting

  // Simpler robust approach: split on the opening tag and then replace the first closing </div> within the remainder
  const parts = indexHtml.split(startMatch[0]);
  const afterStart = parts.slice(1).join(startMatch[0]); // everything after the first opening tag

  // Find the first closing </div>
  const closeTagIndex = afterStart.indexOf('</div>');
  if (closeTagIndex === -1) {
    console.error('Could not find closing </div> for services container. Aborting.');
    process.exit(1);
  }

  const before = indexHtml.slice(0, startMatch.index + startMatch[0].length);
  const after = afterStart.slice(closeTagIndex + '</div>'.length);

  const newIndex = before + '\n' + htmlFragment + '\n' + '</div>' + after;

  // Backup original
  fs.writeFileSync(indexPath + '.bak', indexHtml, 'utf8');
  fs.writeFileSync(indexPath, newIndex, 'utf8');

  console.log('index.html updated with pre-rendered services (backup written to index.html.bak)');
}

main().catch(err => { console.error(err); process.exit(1); });
