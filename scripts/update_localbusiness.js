// Update the ProfessionalService JSON-LD in index.html to include services from data/services.json
// Usage: node scripts/update_ProfessionalService.js

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'data', 'services.json');
const indexPath = path.join(root, 'index.html');

if (!fs.existsSync(dataPath)) {
  console.error('data/services.json not found');
  process.exit(1);
}
if (!fs.existsSync(indexPath)) {
  console.error('index.html not found');
  process.exit(1);
}

const servicesRaw = fs.readFileSync(dataPath, 'utf8');
const servicesData = JSON.parse(servicesRaw).services || [];

// Build the ProfessionalService object (keep consistent with current site's info)
const ProfessionalService = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  'name': 'NEWTS',
  'description': 'NEWTS - Dyslexia assessment, teaching and wellbeing services in Northamptonshire.',
  'url': 'https://www.newts.org.uk',
  'telephone': '01933 255061',
  'email': 'info@newts.uk',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': '9 Strixton Manor Business Centre',
    'addressLocality': 'Strixton',
    'addressRegion': 'Northamptonshire',
    'postalCode': 'NN29 7PA',
    'addressCountry': 'GB'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 52.24330416338389,
    'longitude': -0.6864831077065526
  },
  'openingHours': ['Mo-Fr 09:00-17:00'],
  'sameAs': [
    'https://www.facebook.com/NEWTS',
    'https://www.linkedin.com/company/newts'
  ]
};

// Convert services into OfferCatalog -> itemListElement of Offers with Service itemOffered
const itemList = servicesData.map(s => {
  return {
    '@type': 'Offer',
    'itemOffered': {
      '@type': 'Service',
      'name': s.title || s.name || '',
      'description': s.summary || ''
    }
  };
});

if (itemList.length > 0) {
  ProfessionalService.hasOfferCatalog = {
    '@type': 'OfferCatalog',
    'name': 'NEWTS Services',
    'itemListElement': itemList
  };
}

const jsonld = JSON.stringify(ProfessionalService, null, 2);

// Read index.html and replace the existing ProfessionalService script block
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// More robust: find any <script type="application/ld+json">...</script> that contains the text "ProfessionalService"
const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?ProfessionalService[\s\S]*?<\/script>/i;

if (!scriptRegex.test(indexHtml)) {
  console.error('Could not find existing ProfessionalService JSON-LD block in index.html');
  process.exit(1);
}

const newScript = `<!-- ProfessionalService structured data (helps local search & rich results) -->\n<script type="application/ld+json">\n${jsonld}\n</script>`;

const newIndex = indexHtml.replace(scriptRegex, newScript);

fs.writeFileSync(indexPath + '.bak-ProfessionalService', indexHtml, 'utf8');
fs.writeFileSync(indexPath, newIndex, 'utf8');

console.log('index.html ProfessionalService JSON-LD updated (backup saved as index.html.bak-ProfessionalService)');
