document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('#nav-links');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');
    const header = document.querySelector('header');

    // Load team and gallery from JSON files (only on main page)
    // Categories are now pre-rendered in index.html for better SEO
    if (document.getElementById('team-container')) {
        loadTeam();
    }
    if (document.getElementById('gallery-carousel')) {
        loadGallery();
    }

    // Google Form modal functionality
    const googleFormLink = document.getElementById('google-form-link');
    if (googleFormLink) {
        googleFormLink.addEventListener('click', (e) => {
            e.preventDefault();
            openGoogleFormModal();
        });
    }

    // Hamburger menu functionality
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });

    // Smooth scrolling for navigation links
    const navigationLinks = document.querySelectorAll('#nav-links a[href^="#"]');
    navigationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile menu if open
            navLinks.classList.remove('nav-active');
            
            // Get target section
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset to account for sticky header
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    function slugify(text) {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    async function loadTeam() {
        try {
            const response = await fetch('data/team.json');
            const data = await response.json();
            renderTeam(data.team);
        } catch (error) {
            console.error('Error loading team:', error);
            // Fallback content if JSON fails to load
            document.getElementById('team-container').innerHTML = '<p>Team information is currently unavailable.</p>';
        }
    }

    function renderTeam(team) {
        const container = document.getElementById('team-container');
        
        team.forEach(member => {
            const teamMember = createTeamMember(member);
            container.appendChild(teamMember);
        });

        // Re-attach event listeners for the team links
        attachTeamMemberListeners();
    }

    function createTeamMember(member) {
        const teamMember = document.createElement('div');
        teamMember.className = 'team-member';
        teamMember.innerHTML = `
            <a href="#" class="team-info-link" data-name="${member.name}" data-fullname="${member.fullName}" data-title="${member.title}" data-image="${member.image}" data-bio="${encodeURIComponent(member.bio)}">
                <div class="image-wrapper">
                    <img src="${member.image}" alt="${member.fullName}">
                </div>
                <div class="team-name">${member.name}</div>
            </a>
            <div class="team-bio" style="display: none;">
                ${member.bio}
            </div>
        `;
        return teamMember;
    }

    function attachTeamMemberListeners() {
        const teamInfoLinks = document.querySelectorAll('.team-info-link');
        teamInfoLinks.forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();

                const modalContent = modal.querySelector('.modal-content');
                modalContent.classList.add('team-modal');

                const imgSrc = link.dataset.image;
                const name = link.dataset.name;
                const fullName = link.dataset.fullname;
                const title = link.dataset.title;
                const bio = decodeURIComponent(link.dataset.bio);

                modalBody.innerHTML = `
                    <div class="team-modal-content">
                        <img src="${imgSrc}" alt="${fullName}" class="team-modal-img">
                        <div class="team-modal-text">
                            <h3>${fullName}</h3>
                            <h4>${title}</h4>
                            ${bio}
                        </div>
                    </div>
                `;

                modal.classList.add('modal-visible');
            });
        });
    }

    function openGoogleFormModal() {
        if (!modal) return;
        const modalContent = modal.querySelector('.modal-content');
        if (!modalContent) return;
        modalContent.classList.add('large-modal');
        
        modalBody.innerHTML = `
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSd-QKApTw1rERnWs0Pw-GLfxRhkpabuSlJUlhN6rbaiEVED0g/viewform?embedded=true" 
                    width="100%" 
                    height="100%" 
                    frameborder="0" 
                    marginheight="0" 
                    marginwidth="0">
                Loading…
            </iframe>
        `;
        
        modal.classList.add('modal-visible');
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.classList.remove('modal-visible');
            // Reset modal size when closing
            const modalContent = modal.querySelector('.modal-content');
            modalContent.classList.remove('large-modal');
            modalContent.classList.remove('team-modal');
        });
    }

    window.addEventListener('click', event => {
        if (event.target == modal) {
            modal.classList.remove('modal-visible');
            // Reset modal size when closing
            const modalContent = modal.querySelector('.modal-content');
            modalContent.classList.remove('large-modal');
            modalContent.classList.remove('team-modal');
        }
    });

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
    });

    // Gallery Carousel (dynamic from JSON)
    async function loadGallery() {
        const carousel = document.getElementById('gallery-carousel');
        const track = document.getElementById('gallery-carousel-track');
        const titleDiv = document.getElementById('gallery-title');
        if (!carousel || !track || !titleDiv) return;
        try {
            const res = await fetch('data/gallery.json');
            const data = await res.json();
            track.innerHTML = '';
            data.gallery.forEach((img, i) => {
                const el = document.createElement('img');
                el.src = img.src;
                el.alt = img.alt || '';
                el.className = 'carousel-image' + (i === 0 ? ' active' : '');
                el.setAttribute('data-title', img.title || '');
                track.appendChild(el);
            });
            setupGalleryCarousel(data.gallery.map(img => img.title || ''));
        } catch (e) {
            track.innerHTML = '<p>Could not load gallery.</p>';
        }
    }

    function setupGalleryCarousel(titles) {
        const carousel = document.getElementById('gallery-carousel');
        const images = carousel.querySelectorAll('.carousel-image');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const titleDiv = document.getElementById('gallery-title');
        let current = 0;
        function showImage(idx) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === idx);
            });
            if (titles && titles[idx]) {
                titleDiv.textContent = titles[idx];
            } else {
                titleDiv.textContent = '';
            }
        }
        function prevImage() {
            current = (current - 1 + images.length) % images.length;
            showImage(current);
        }
        function nextImage() {
            current = (current + 1) % images.length;
            showImage(current);
        }
        prevBtn.addEventListener('click', prevImage);
        nextBtn.addEventListener('click', nextImage);
        // Optional: swipe support for mobile
        let startX = null;
        carousel.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
        });
        carousel.addEventListener('touchend', e => {
            if (startX === null) return;
            let endX = e.changedTouches[0].clientX;
            if (endX - startX > 40) prevImage();
            else if (startX - endX > 40) nextImage();
            startX = null;
        });
        // Show initial title
        showImage(current);
    }

    loadGallery();
});
