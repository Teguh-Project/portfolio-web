/**
 * PORTFOLIO ENGINE v3.5 - OPTIMIZED FOR TEGUH P.P
 * Fixed: Cursor visibility, BackToTop Logic, & Theme Sync.
 */

class PortfolioEngine {
    constructor() {
        this.cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.init();
    }

    init() {
        this.initTheme();
        this.initSmartCursor();
        this.initNavigation();
        this.initReveal();
        this.initClock();
        this.initMagneticLinks();
        
        console.log("%c SYSTEM READY — TEGUH.P V3.5 ", "background: #000; color: #00ff00; padding: 5px; font-weight: bold;");
    }

    // 1. THEME ENGINE
    initTheme() {
        const btn = document.getElementById('themeToggle');
        const body = document.body;

        const update = (theme) => {
            body.setAttribute('data-theme', theme);
            localStorage.setItem('portfolio-theme', theme);
            if(btn) btn.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
        };

        const current = localStorage.getItem('portfolio-theme') || 'dark';
        update(current);

        btn?.addEventListener('click', () => {
            const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            update(next);
        });
    }

    // 2. SMART CURSOR (LERP)
    initSmartCursor() {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) return;

        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        const render = () => {
            this.cursorPos.x += (this.mousePos.x - this.cursorPos.x) * 0.15;
            this.cursorPos.y += (this.mousePos.y - this.cursorPos.y) * 0.15;
            cursor.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(render);
        };
        render();

        // Hover Effect
        const interactive = document.querySelectorAll('a, button, .project-card');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '60px';
                cursor.style.height = '60px';
                cursor.style.backgroundColor = 'rgba(255,255,255,0.1)';
                cursor.style.mixBlendMode = 'difference';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.mixBlendMode = 'normal';
            });
        });
    }

    // 3. NAVIGATION & BACK TO TOP
    initNavigation() {
        const nav = document.querySelector('.navbar');
        const btnUp = document.getElementById('backToTop');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Navbar hide/show
            if (currentScroll > lastScroll && currentScroll > 150) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }

            // Back to Top visibility
            if (currentScroll > 600) {
                btnUp?.classList.add('show');
            } else {
                btnUp?.classList.remove('show');
            }
            lastScroll = currentScroll;
        }, { passive: true });

        btnUp?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. CLOCK
    initClock() {
        const clockEl = document.getElementById('local-time');
        if (!clockEl) return;
        const update = () => {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-GB', { 
                timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' 
            }) + " MALANG, IDN";
        };
        setInterval(update, 1000);
        update();
    }

    // 5. REVEAL
    initReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.project-card, .section-header, .hero-description').forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
            observer.observe(el);
        });
    }

    // 6. MAGNETIC
    initMagneticLinks() {
        const magnets = document.querySelectorAll('.logo-img, .theme-toggle-nav');
        magnets.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = el.getBoundingClientRect();
                const x = (e.clientX - (left + width / 2)) * 0.3;
                const y = (e.clientY - (top + height / 2)) * 0.3;
                el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = `translate3d(0, 0, 0)`;
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new PortfolioEngine());
