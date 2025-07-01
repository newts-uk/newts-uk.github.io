document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('#nav-links');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');
    const header = document.querySelector('header');

    // Load services and team from JSON files
    loadServices();
    loadTeam();

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

    async function loadServices() {
        try {
            const response = await fetch('data/services.json');
            const data = await response.json();
            renderServices(data.services);
        } catch (error) {
            console.error('Error loading services:', error);
            // Fallback content if JSON fails to load
            document.getElementById('services-container').innerHTML = '<p>Services information is currently unavailable.</p>';
        }
    }

    function renderServices(services) {
        const container = document.getElementById('services-container');
        
        services.forEach(service => {
            const servicePanel = createServicePanel(service);
            container.appendChild(servicePanel);
        });

        // Re-attach event listeners for the clickable panels
        attachServicePanelListeners();
    }

    function createServicePanel(service) {
        const servicePanel = document.createElement('div');
        // Only add clickable class if service has details
        servicePanel.className = service.details ? 'service-panel clickable' : 'service-panel';
        servicePanel.innerHTML = `
            <h3>${service.title}</h3>
            <p>${service.summary}</p>
            ${service.details ? `<div class="extra-content"><p>${service.details}</p></div>` : ''}
        `;
        return servicePanel;
    }

    function attachServicePanelListeners() {
        const servicePanels = document.querySelectorAll('.service-panel.clickable');
        servicePanels.forEach(panel => {
            panel.addEventListener('click', event => {
                event.preventDefault();
                const panelContent = panel.cloneNode(true);
                panelContent.classList.remove('clickable'); // Remove the clickable class for modal

                modalBody.innerHTML = '';
                modalBody.appendChild(panelContent);
                modal.classList.add('modal-visible');
            });
        });
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

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.classList.remove('modal-visible');
        });
    }

    window.addEventListener('click', event => {
        if (event.target == modal) {
            modal.classList.remove('modal-visible');
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
});
