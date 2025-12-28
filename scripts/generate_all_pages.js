const fs = require('fs');
const path = require('path');

console.log('Regenerating all service and category pages...');

// Generate categories in index.html
console.log('\n1. Generating categories in index.html...');
require('./generate_categories.js');

// Generate service pages
console.log('\n2. Generating service pages...');
require('./generate_service_pages.js');

// Generate category pages
console.log('\n3. Generating category pages...');
require('./generate_category_pages.js');

// Update LocalBusiness structured data
console.log('\n4. Updating LocalBusiness structured data...');
require('./update_localbusiness.js');

console.log('\nAll pages and structured data generated successfully!');