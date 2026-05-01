/**
 * PORTFOLIO ENGINE v3.5 - OPTIMIZED FOR TEGUH P.P
 * Menggabungkan fitur canggih dengan perbaikan bug navigasi & theme.
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
        this.initNavigation();
        this.initReveal();
        this.initClock();
        this.initMagneticLinks();
        
        console.log("%c SYSTEM READY — TEGUH.P V3.5 ", "background: #000; color: #00ff00; padding: 5px; font-weight: bold;");
    }

    // 1. THEME ENGINE: Dengan fitur simpan pilihan di Browser (LocalStorage)
    initTheme() {
        const btn = document.getElementById('themeToggle');
        const body = document.body;

        const update = (theme) => {
            body.setAttribute('data-theme', theme);
            localStorage.setItem('portfolio-theme', theme);
            if(btn) btn.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
        };

        // Cek tema terakhir atau default ke dark
        const current = localStorage.getItem('portfolio-theme') || 'dark';
        update(current);

        btn?.addEventListener('click', () => {
            const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            update(next);
        });
    }

    // 2. SMART CURSOR: Halus (LERP) & Support Mobile
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
            // LERP: Semakin kecil angka (0.1), semakin "lemot" dan halus gerakannya
            this.cursorPos.x += (this.mousePos.x - this.cursorPos.x) * 0.15;
            this.cursorPos.y += (this.mousePos.y - this.cursorPos.y) * 0.15;
            
            cursor.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(render);
        };
        render();

        // Hover effect pada tombol & link
        document.querySelectorAll('a, button, .project-card').forEach(el => {
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

    // 3. NAVIGATION: Auto-hide & Back to Top
    initNavigation() {
        const nav = document.querySelector('.navbar');
        const btnUp = document.getElementById('backToTop');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Munculkan/Sembunyikan Nav saat scroll
            if (currentScroll > lastScroll && currentScroll > 500) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }

            // Back to Top Button
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

    // 4. REVEAL: Muncul pelan-pelan saat di-scroll
    initReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.project-card, .side-title, .section-header').forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "all 0.8s ease-out";
            observer.observe(el);
        });
    }

    // 5. CLOCK: Malang Time (Gunakan ID 'local-time' di HTML kalau ada)
    initClock() {
        const clockEl = document.getElementById('local-time');
        if (!clockEl) return;
        
        const update = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-GB', { 
                timeZone: 'Asia/Jakarta', 
                hour: '2-digit', 
                minute: '2-digit'
            });
            clockEl.textContent = `${time} MALANG, IDN`;
        };
        setInterval(update, 1000);
        update();
    }

    // 6. MAGNETIC EFFECT: Tarikan magnet pada elemen tertentu
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

// Jalankan Mesin
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioEngine();
});
