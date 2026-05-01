/**
 * PORTFOLIO ENGINE v3.5 - NEEDNAP OPTIMIZED
 * Developed for: Teguh Perwira Putra
 * Features: Smooth Cursor LERP, Smart Navigation, Mobile Detection
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
        
        console.log("%c SYSTEM READY — TEGUH.P V3.5 ", "background: #ff3e3e; color: white; padding: 5px; font-weight: bold;");
    }

    // 1. THEME ENGINE: Sinkronisasi Light & Dark Mode
    initTheme() {
        const btn = document.getElementById('themeToggle');
        const update = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('portfolio-theme', theme);
            if(btn) {
                const text = btn.querySelector('.mode-text');
                if(text) text.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
            }
        };

        const current = localStorage.getItem('portfolio-theme') || 'dark';
        update(current);

        btn?.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            update(next);
        });
    }

    // 2. SMART CURSOR: Halus di Desktop, Mati di Mobile
    initSmartCursor() {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) return;

        // Cek jika device adalah layar sentuh
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            cursor.style.display = 'none';
            document.body.style.cursor = 'default';
            return;
        }

        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        // Animasi LERP agar kursor terasa "mengikuti" dengan halus
        const render = () => {
            this.cursorPos.x += (this.mousePos.x - this.cursorPos.x) * 0.15;
            this.cursorPos.y += (this.mousePos.y - this.cursorPos.y) * 0.15;
            
            cursor.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(render);
        };
        render();

        // Efek Hover pada elemen interaktif
        document.querySelectorAll('a, button, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.background = 'rgba(255, 62, 62, 0.2)';
                cursor.style.border = '1px solid var(--accent)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '8px';
                cursor.style.height = '8px';
                cursor.style.background = 'var(--accent)';
                cursor.style.border = 'none';
            });
        });
    }

    // 3. NAVIGATION: Efek Scroll & Hilang Saat Scroll Bawah
    initNavigation() {
        const nav = document.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Efek background saat scroll
            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Sembunyikan navbar saat scroll ke bawah, munculkan saat ke atas
            if (currentScroll > lastScroll && currentScroll > 200) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // 4. REVEAL: Animasi Muncul Saat Scroll (Intersection Observer)
    initReveal() {
        const options = { threshold: 0.15 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Matikan observer setelah elemen muncul (hemat performa)
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Tambahkan elemen-elemen yang ingin di-reveal di sini
        document.querySelectorAll('.reveal-init, .project-card, .side-title').forEach(el => {
            observer.observe(el);
        });
    }

    // 5. CLOCK: Real-time Malang Time
    initClock() {
        const clockEl = document.getElementById('local-time');
        const update = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-GB', { 
                timeZone: 'Asia/Jakarta', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: false 
            });
            if(clockEl) clockEl.textContent = `${time} MALANG, IDN`;
        };
        setInterval(update, 1000);
        update();
    }

    // 6. MAGNETIC EFFECT: Sedikit tarikan magnet pada logo & tombol
    initMagneticLinks() {
        const magnets = document.querySelectorAll('.logo, .theme-toggle-nav');
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

// Inisialisasi saat halaman siap
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioEngine();
});
