// Simple Scroll Reveal Effect
window.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const speed = 0.05;
        const rect = card.getBoundingClientRect();
        if(rect.top < window.innerHeight) {
            card.style.opacity = 1;
            card.style.transform = `translateY(0)`;
        }
    });
});
