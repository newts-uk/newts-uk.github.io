// Simple build script to pre-render categories JSON into index.html
// Usage: from project root run: node scripts/generate_categories.js

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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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
  const categories = data.categores || []; // Note: there's a typo in the JSON "categores"
  const services = data.services || [];

  const panels = categories.map(category => {
    const title = safeHtmlEscape(category.title || 'Category');
    const id = safeHtmlEscape(category.id);
    const slug = slugify(category.title);
    
    // Count services in this category
    const serviceCount = services.filter(service => service.category === category.id).length;
    
    if (serviceCount === 0) {
      return null; // Skip categories with no services
    }

    return `    <article class="service-panel clickable category-panel" id="category-${id}" aria-labelledby="${id}-title">
      <a href="services/categories/${slug}.html" class="category-link" data-category-id="${id}">
        <h3 id="${id}-title">${title}</h3>
        ${category.summary ? `<p class="category-summary">${safeHtmlEscape(category.summary)}</p>` : ''}
        <p class="service-count">${serviceCount} service${serviceCount !== 1 ? 's' : ''}</p>
      </a>
    </article>`;
  }).filter(Boolean).join('\n'); // Remove null entries

  const htmlFragment = `\n${panels}\n`;

  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  // Replace content between the services container opening tag and its closing tag
  const startMarker = /<div[^>]*id=["']services-container["'][^>]*>/i;

  if (!startMarker.test(indexHtml)) {
    console.error('Could not find services container in index.html');
    process.exit(1);
  }

  // Find the exact start index
  const startMatch = indexHtml.match(startMarker);
  const startIndex = startMatch.index + startMatch[0].length;

  // Find the closing </div> that corresponds to the services container
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

  console.log('index.html updated with pre-rendered categories (backup written to index.html.bak)');
  console.log(`Generated ${categories.length} categories with services`);
}

main().catch(err => { console.error(err); process.exit(1); });