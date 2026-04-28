/**
 * DETROIT & SSSCRIPT ENGINE v2.0
 * Developed for: Teguh Perwira Putra
 * Theme: Modern Editorial & Urban Cinematic
 */

class PortfolioEngine {
    constructor() {
        this.lastScroll = 0;
        this.cursor = { targetX: 0, targetY: 0, curX: 0, curY: 0 };
        this.init();
    }

    init() {
        this.initClock();
        this.initTheme();
        this.initCustomCursor();
        this.initSmartScroll();
        this.initIntersectionObserver();
        this.initMagneticEffect();
        this.initHeroParallax();
        this.initEasterEgg();
        
        // Handle Resize
        window.addEventListener('resize', () => this.onResize());
        console.log("%c DETROIT ENGINE ACTIVATED ", "background: #ff3e3e; color: white; font-weight: bold; padding: 4px 8px;");
    }

    // --- 1. REAL-TIME CLOCK (OPTIMIZED) ---
    initClock() {
        const timeElement = document.getElementById('local-time');
        if (!timeElement) return;

        const tick = () => {
            const now = new Date();
            const options = {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            };
            const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
            timeElement.textContent = `${timeString} MALANG, ID`;
        };
        setInterval(tick, 1000);
        tick();
    }

    // --- 2. CUSTOM CURSOR (LERP + INTERACTION) ---
    initCustomCursor() {
        const cursorEl = document.querySelector('.custom-cursor');
        if (!cursorEl) return;

        window.addEventListener('mousemove', (e) => {
            this.cursor.targetX = e.clientX;
            this.cursor.targetY = e.clientY;
        });

        const render = () => {
            this.cursor.curX += (this.cursor.targetX - this.cursor.curX) * 0.12;
            this.cursor.curY += (this.cursor.targetY - this.cursor.curY) * 0.12;
            cursorEl.style.transform = `translate3d(${this.cursor.curX}px, ${this.cursor.curY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(render);
        };
        render();

        // Cursor Hover States
        document.querySelectorAll('a, button, .project-card, .theme-toggle-nav').forEach(el => {
            el.addEventListener('mouseenter', () => cursorEl.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorEl.classList.remove('cursor-hover'));
        });
    }

    // --- 3. THEME LOGIC (PULL TO LIGHT/DARK) ---
    initTheme() {
        const btn = document.getElementById('themeToggle');
        const update = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('portfolio-theme', theme);
            if (btn) {
                const text = btn.querySelector('.mode-text');
                if (text) text.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
            }
        };

        const current = localStorage.getItem('portfolio-theme') || 'dark';
        update(current);

        btn?.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            update(next);
        });
    }

    // --- 4. SMART SCROLL (ULTRA-SMOOTH VERSION) ---
initSmartScroll() {
    const nav = document.querySelector('.navbar');
    let isTicking = false; // Flag untuk optimasi performa

    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                const st = window.pageYOffset;

                // 1. Cegah angka negatif (iOS bounce)
                if (st < 0) {
                    isTicking = false;
                    return;
                }

                // 2. Logika Sembunyikan/Tampilkan dengan Buffer
                // Kita beri jarak minimal 10px agar tidak terlalu sensitif terhadap getaran scroll
                if (Math.abs(this.lastScroll - st) <= 10) {
                    isTicking = false;
                    return;
                }

                if (st > this.lastScroll && st > 150) {
                    // Scroll Down: Sembunyikan nav
                    nav.style.transform = 'translate3d(0, -100%, 0)';
                } else {
                    // Scroll Up: Munculkan nav
                    nav.style.transform = 'translate3d(0, 0, 0)';
                }

                // 3. Logika Scrolled State (Efek Kaca)
                // Threshold 50 agar transisinya terasa lebih awal dan halus
                if (st > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }

                this.lastScroll = st;
                isTicking = false;
            });

            isTicking = true;
        }
    }, { passive: true });
}

    // --- 5. REVEAL ANIMATION (BLUR + SLIDE) ---
    initIntersectionObserver() {
        const options = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('.project-card, .section-title, .hero-text-side').forEach(el => {
            el.classList.add('reveal-init');
            observer.observe(el);
        });
    }

    // --- 6. MAGNETIC & TEXT TILT EFFECT ---
    initMagneticEffect() {
        const targets = document.querySelectorAll('.nav-link, .theme-toggle-nav, .back-to-top');
        
        targets.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = el.getBoundingClientRect();
                const x = (e.clientX - (left + width / 2)) * 0.4;
                const y = (e.clientY - (top + height / 2)) * 0.4;
                el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = `translate3d(0, 0, 0)`;
            });
        });
    }

    // --- 7. HERO GIF PARALLAX (KEJUTAN 1) ---
    initHeroParallax() {
        const heroGif = document.querySelector('.hero-gif');
        if (!heroGif) return;

        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20; // Gerak 20px
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroGif.style.transform = `scale(1.1) translate3d(${x}px, ${y}px, 0)`;
        });
    }

    // --- 8. EASTER EGG (KEJUTAN 2) ---
    initEasterEgg() {
        // Jika user mengetik 'TEGUH' di keyboard
        let keys = "";
        window.addEventListener('keydown', (e) => {
            keys += e.key.toUpperCase();
            if (keys.includes("TEGUH")) {
                document.body.style.filter = "invert(1) hue-rotate(180deg)";
                setTimeout(() => document.body.style.filter = "none", 2000);
                keys = "";
                console.log("SURPRISE! MODE INVERT AKTIF.");
            }
            if (keys.length > 10) keys = "";
        });
    }

    onResize() {
        // Logic tambahan saat layar berubah ukuran jika diperlukan
    }
}

// Boot up
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioEngine();
});
