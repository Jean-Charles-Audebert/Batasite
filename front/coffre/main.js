// Gestion de la modal de contact
const btnContactModal = document.querySelector('.btn-contact-modal');
const contactModal = document.getElementById('contact-modal');
const closeContactModal = document.querySelector('.close-contact-modal');
const contactForm = document.getElementById('contact-form');

// Ouvrir la modal
if (btnContactModal) {
    btnContactModal.addEventListener('click', function() {
        contactModal.style.display = 'flex';
        contactModal.setAttribute('aria-hidden', 'false');
    });
}

// Fermer la modal
if (closeContactModal) {
    closeContactModal.addEventListener('click', function() {
        contactModal.style.display = 'none';
        contactModal.setAttribute('aria-hidden', 'true');
    });
}

// Fermer la modal en cliquant en dehors
window.addEventListener('click', function(event) {
    if (event.target === contactModal) {
        contactModal.style.display = 'none';
        contactModal.setAttribute('aria-hidden', 'true');
    }
});

// Gestion du formulaire de contact
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Afficher un message de confirmation
        alert('Merci pour votre message ! Nous vous recontacterons bientôt.');
        
        // Réinitialiser le formulaire
        contactForm.reset();
        
        // Fermer la modal
        contactModal.style.display = 'none';
        contactModal.setAttribute('aria-hidden', 'true');
    });
}
