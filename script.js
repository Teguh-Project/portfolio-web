document.addEventListener('DOMContentLoaded', () => {
    
    // 1. REVEAL ANIMATION (Muncul saat scroll)
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Berhenti mengamati setelah elemen muncul agar performa tetap terjaga
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15 // Elemen muncul setelah 15% bagian masuk ke layar
    });

    // Pilih elemen yang ingin diberi efek muncul
    const elementsToReveal = document.querySelectorAll('.project-item, .about-text, .reveal-text, .footer h2');
    elementsToReveal.forEach(el => {
        el.classList.add('reveal-hidden'); // Siapkan state awal tersembunyi
        revealObserver.observe(el);
    });

    // 2. PARALLAX EFFECT PADA GAMBAR
    // Membuat gambar bergerak sedikit lebih lambat dari scroll untuk efek kedalaman
    window.addEventListener('scroll', () => {
        const images = document.querySelectorAll('.image-container img');
        images.forEach(img => {
            const speed = 0.15;
            const rect = img.parentElement.getBoundingClientRect();
            const visible = rect.top < window.innerHeight && rect.bottom > 0;

            if (visible) {
                const shift = (rect.top - window.innerHeight / 2) * speed;
                img.style.transform = `scale(1.1) translateY(${shift}px)`;
            }
        });
    });

    // 3. NAVBAR HIDE/SHOW ON SCROLL
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.style.transform = 'translateY(0)';
            return;
        }

        if (currentScroll > lastScroll) {
            // Scroll ke bawah - Sembunyikan navbar
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scroll ke atas - Munculkan navbar
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });
});
