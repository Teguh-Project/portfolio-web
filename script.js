/**
 * PORTFOLIO ENGINE v3.5 - OPTIMIZED FOR TEGUH P.P
 * Integrasi penuh untuk: Custom Cursor LERP, Theme Switching, 
 * Real-time Malang Clock, dan Scroll Reveal.
 */

class PortfolioEngine {
    constructor() {
        // Koordinat untuk pergerakan kursor halus (LERP)
        this.cursorPos = { x: 0, y: 0 };
        this.mousePos = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.initTheme();
        this.initSmartCursor();
        this.initNavigation();
        this.initReveal();
        this.initClock();
        this.initMagneticLinks();
        
        console.log("%c SYSTEM READY — TEGUH.P V3.5 ", "background: #000; color: #00ff00; padding: 5px; font-weight: bold; border-radius: 2px;");
    }

    // 1. THEME ENGINE: Sinkronisasi mode dengan LocalStorage
    initTheme() {
        const btn = document.getElementById('themeToggle');
        const body = document.body;

        const update = (theme) => {
            body.setAttribute('data-theme', theme);
            localStorage.setItem('portfolio-theme', theme);
            // Update teks tombol (Opsional jika tombol menggunakan teks)
            if(btn) {
                const isDark = theme === 'dark';
                btn.textContent = isDark ? 'LIGHT' : 'DARK';
            }
        };

        const current = localStorage.getItem('portfolio-theme') || 'dark';
        update(current);

        btn?.addEventListener('click', () => {
            const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            update(next);
        });
    }

    // 2. SMART CURSOR: Efek LERP (Linear Interpolation)
    initSmartCursor() {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) return;

        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            cursor.style.display = 'none';
            return;
        }

        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        const render = () => {
            // Formula LERP untuk kehalusan gerakan kursor
            this.cursorPos.x += (this.mousePos.x - this.cursorPos.x) * 0.15;
            this.cursorPos.y += (this.mousePos.y - this.cursorPos.y) * 0.15;
            
            cursor.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(render);
        };
        render();

        // Efek interaksi kursor pada elemen clickable
        const interactiveEl = document.querySelectorAll('a, button, .project-card, .theme-toggle-nav');
        interactiveEl.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '60px';
                cursor.style.height = '60px';
                cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                cursor.style.border = '1px solid var(--text-color)';
                cursor.style.mixBlendMode = 'difference';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.border = '1px solid var(--text-color)';
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

            // Auto-hide Navbar on scroll down
            if (currentScroll > lastScroll && currentScroll > 150) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }

            // Toggle Back to Top Button
            if (currentScroll > 800) {
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

    // 4. REVEAL ANIMATION: Memanfaatkan Intersection Observer
    initReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Opsional: hapus style inline jika menggunakan class CSS
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.project-card, .side-title, .section-header, .hero-description');
        revealElements.forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(40px)";
            el.style.transition = "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)";
            observer.observe(el);
        });
    }

    // 5. CLOCK: Real-time Malang Time (HH:MM:SS)
    initClock() {
        const clockEl = document.getElementById('local-time');
        if (!clockEl) return;
        
        const update = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-GB', { 
                timeZone: 'Asia/Jakarta', 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: false 
            });
            clockEl.textContent = `${timeStr} MALANG, IDN`;
        };
        
        setInterval(update, 1000);
        update();
    }

    // 6. MAGNETIC EFFECT: Tarikan halus pada logo dan toggle
    initMagneticLinks() {
        const magnets = document.querySelectorAll('.logo-img, .theme-toggle-nav, #backToTop');
        
        magnets.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = el.getBoundingClientRect();
                const centerX = left + width / 2;
                const centerY = top + height / 2;
                const moveX = (e.clientX - centerX) * 0.35;
                const moveY = (e.clientY - centerY) * 0.35;
                
                el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
                el.style.transition = 'transform 0.1s ease-out';
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = `translate3d(0, 0, 0)`;
                el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
    }
}

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioEngine();
});
