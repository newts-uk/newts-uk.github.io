// Pre-render the footer "Policies & Information" links in index.html
// from data/policies.json.

const fs = require('fs');
const path = require('path');
const { policyLinks } = require('./policy_links.js');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');

const blockRegex = /(<div class="footer-policies">[\s\S]*?<ul>)[\s\S]*?(<\/ul>)/;

if (!blockRegex.test(indexHtml)) {
  console.error('Could not find footer-policies list in index.html');
  process.exit(1);
}

const links = policyLinks('');
const newIndex = indexHtml.replace(
  blockRegex,
  `$1\n                        ${links}\n                    $2`
);

fs.writeFileSync(indexPath, newIndex, 'utf8');
console.log('index.html footer policies updated');
