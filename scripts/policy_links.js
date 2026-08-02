// Shared helper: render the footer "Policies & Information" list items
// from the per-policy files in data/policies/. prefix is the page's path
// back to the site root ('' for index.html, '../' for services/,
// '../../' for services/categories/).

const fs = require('fs');
const path = require('path');

function safeHtmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function policyLinks(prefix) {
  const dir = path.join(__dirname, '..', 'data', 'policies');
  const policies = fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
    .sort((a, b) => {
      const ao = a.order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.order ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return (a.title || '').localeCompare(b.title || '');
    });

  return policies
    .map(p => {
      const href = prefix + String(p.file).replace(/^\//, '');
      return `<li><a href="${safeHtmlEscape(href)}" target="_blank">${safeHtmlEscape(p.title)}</a></li>`;
    })
    .join('\n            ');
}

module.exports = { policyLinks };
