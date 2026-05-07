/**
 * TEGUH P.P | Portfolio Engine 2026
 * Core functionality for theme, cursor, clock, and scroll effects.
 */

class PortfolioEngine {
    constructor() {
        this.cursorPos = { x: 0, y: 0 };
        this.mousePos = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.initTheme();
        this.initSmartCursor();
        this.initClock();
        this.initScrollEffects();
        this.initNavigation();
    }

    initTheme() {
        const btn = document.getElementById('themeToggle');
        const body = document.body;
        
        // Cek preferensi tersimpan atau gunakan dark sebagai default
        const currentTheme = localStorage.getItem('theme') || 'dark';
        body.setAttribute('data-theme', currentTheme);
        
        const updateBtnText = (theme) => {
            if(btn) btn.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
        };
        
        updateBtnText(currentTheme);

        btn?.addEventListener('click', () => {
            const isDark = body.getAttribute('data-theme') === 'dark';
            const nextTheme = isDark ? 'light' : 'dark';
            
            body.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            updateBtnText(nextTheme);
        });
    }

    initSmartCursor() {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) return;

        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        const render = () => {
            // LERP (Linear Interpolation) untuk gerakan smooth
            this.cursorPos.x += (this.mousePos.x - this.cursorPos.x) * 0.15;
            this.cursorPos.y += (this.mousePos.y - this.cursorPos.y) * 0.15;
            
            cursor.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(render);
        };
        render();

        // Cursor Hover Effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .logo-img');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '60px';
                cursor.style.height = '60px';
                cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                cursor.style.mixBlendMode = 'difference';
                cursor.style.border = 'none';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.mixBlendMode = 'normal';
                cursor.style.border = '1px solid var(--text-color)';
            });
        });
    }

    initClock() {
        const clockEl = document.getElementById('local-time');
        const update = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-GB', { 
                timeZone: 'Asia/Jakarta', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            if(clockEl) clockEl.textContent = `${time} MALANG, IDN`;
        };
        setInterval(update, 1000);
        update();
    }

    initNavigation() {
        const btnUp = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                btnUp?.classList.add('show');
            } else {
                btnUp?.classList.remove('show');
            }
        });

        btnUp?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    initScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    // Berhenti mengamati setelah elemen muncul
                    observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        document.querySelectorAll('.project-card, .side-title, .hero-bottom').forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "all 1s cubic-bezier(0.16, 1, 0.3, 1)";
            observer.observe(el);
        });
    }
}

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioEngine();
});
