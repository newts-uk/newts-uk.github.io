document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('#nav-links');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');
    const moreInfoLinks = document.querySelectorAll('.more-info');
    const teamInfoLinks = document.querySelectorAll('.team-info-link');
    const header = document.querySelector('header');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });

    moreInfoLinks.forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();
            const panel = item.closest('.service-panel');
            const panelContent = panel.cloneNode(true);
            panelContent.querySelector('.more-info').remove();

            modalBody.innerHTML = '';
            modalBody.appendChild(panelContent);
            modal.classList.add('modal-visible');
        });
    });

    teamInfoLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();

            const teamMember = link.closest('.team-member');
            const imgSrc = teamMember.querySelector('img').src;
            const name = link.dataset.name;
            const fullName = link.dataset.fullname;
            const title = link.dataset.title;
            const bio = teamMember.querySelector('.team-bio').innerHTML;

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
