const fs = require('fs');
const path = require('path');

const data = require('../data/services.json');
const categories = data.categores; // Note: there's a typo in the JSON "categores" instead of "categories"
const services = data.services;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const categoryTemplate = (category, categoryServices) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NEWTS - ${category.title}</title>
  <meta name="description" content="${category.title} services at NEWTS - Northamptonshire Education, Wellbeing and Teaching Services">
  <meta name="keywords" content="${category.title}, NEWTS, Dyslexia Assessment, Northampton, Wellingborough, Northamptonshire, Education, Wellbeing">
  <link rel="canonical" href="https://newts.uk/services/categories/${slugify(category.title)}.html">
  
  <meta property="og:title" content="${category.title} | NEWTS">
  <meta property="og:description" content="${category.title} services at NEWTS">
  <meta property="og:url" content="https://newts.uk/services/categories/${slugify(category.title)}.html">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://newts.uk/images/logo.png">
  
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${category.title} | NEWTS">
  <meta name="twitter:description" content="${category.title} services at NEWTS">
  <meta name="twitter:image" content="https://newts.uk/images/logo.png">
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="../../css/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">
  
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-R3K7MH2PHJ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-R3K7MH2PHJ');
  </script>
</head>
<body>
  <header>
    <div class="container">
      <div class="contact-info">
        <a href="tel:01933255061" class="contact-link">
          <i class="fas fa-phone-alt icon"></i>
          <span class="text">01933 255061</span>
        </a>
        <a href="mailto:info@newts.uk" class="contact-link">
          <i class="fas fa-envelope icon"></i>
          <span class="text">info@newts.uk</span>
        </a>
      </div>
    </div>
  </header>
  <nav>
    <div class="container">
      <div class="hamburger">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <ul id="nav-links">
        <li><a href="../../index.html#home">Home</a></li>
        <li><a href="../../index.html#about">About</a></li>
        <li><a href="../../index.html#services">Services</a></li>
        <li><a href="../../index.html#gallery">Gallery</a></li>
        <li><a href="../../index.html#contact">Contact</a></li>
        <li><a href="#" id="google-form-link">EOTAS Referral Form</a></li>
      </ul>
    </div>
  </nav>

  <main class="category-page">
    <section class="hero-section category-hero">
      <div class="container">
        <h1>${category.title}</h1>
        <nav class="breadcrumb">
          <a href="../../index.html">Home</a> / <a href="../../index.html#services">Services</a> / <span>${category.title}</span>
        </nav>
      </div>
    </section>

    <section class="category-services-section">
      <div class="container">
        <div class="services-grid">
          ${categoryServices.map(service => `
            <div class="service-card">
              <h3><a href="../${slugify(service.title)}.html">${service.title}</a></h3>
              ${service.summary ? `<p class="service-summary">${service.summary}</p>` : ''}
            </div>
          `).join('')}
        </div>
        
        <div class="category-cta">
          <h3>Need help choosing a service?</h3>
          <p>Contact us today to discuss which service would be best for your needs.</p>
          <a href="../../index.html#contact" class="cta-button">Get in Touch</a>
          <a href="../../index.html#services" class="cta-button secondary">View All Categories</a>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-about">
          <h3>About NEWTS</h3>
          <p>NEWTS is a leading provider of educational, wellbeing, and teaching services in Northamptonshire. Our mission is to support schools, families, and individuals to achieve their full potential. We are a team of dedicated professionals with a passion for education and a commitment to making a positive impact in our community.</p>
        </div>
        <div class="footer-policies">
          <h3>Policies & Information</h3>
          <ul>
            <li><a href="../../index.html#">Code of Ethics</a></li>
            <li><a href="../../index.html#">Complaints</a></li>
            <li><a href="../../index.html#">Equality and Diversity</a></li>
            <li><a href="../../index.html#">Health and Safety</a></li>
            <li><a href="../../index.html#">Lone Working</a></li>
            <li><a href="../../index.html#">Privacy</a></li>
            <li><a href="../../index.html#">Professional Boundaries</a></li>
            <li><a href="../../index.html#">Safeguarding and Child Protection</a></li>
          </ul>
        </div>
        <div class="footer-navigation">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="../../index.html#home">Home</a></li>
            <li><a href="../../index.html#about">About Us</a></li>
            <li><a href="../../index.html#services">Services</a></li>
            <li><a href="../../index.html#contact">Contact</a></li>
            <li><a href="#" id="google-form-link">EOTAS Referral Form</a></li>
          </ul>
        </div>
      </div>
      <div class="copyright">
        <p>&copy; ${new Date().getFullYear()} NEWTS. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <div id="modal" class="modal">
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <div id="modal-body"></div>
    </div>
  </div>

  <script src="../../js/main.js"></script>
</body>
</html>`;

// Create categories directory
const categoriesDir = path.join(__dirname, '..', 'services', 'categories');
if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir, { recursive: true });
}

// Generate category pages
categories.forEach(category => {
  const categoryServices = services.filter(service => service.category === category.id);
  
  if (categoryServices.length > 0) {
    const slug = slugify(category.title);
    const html = categoryTemplate(category, categoryServices);
    const filePath = path.join(categoriesDir, `${slug}.html`);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Generated: services/categories/${slug}.html (${categoryServices.length} services)`);
  }
});

console.log('Category page generation complete!');