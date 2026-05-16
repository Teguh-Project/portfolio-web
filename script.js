/**
 * TEGUH P.P | Portfolio Engine 2026
 * Core functionality for theme, cursor, clock, and intelligent scroll effects.
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
        this.initNavigation();
        this.initScrollEffects();
        this.initMenuOverlay(); // Memanggil inisialisasi menu tirai
    }

    initTheme() {
        const btn = document.getElementById('themeToggle');
        const root = document.documentElement; 
        
        const savedTheme = localStorage.getItem('theme') || 'dark';
        root.setAttribute('data-theme', savedTheme);
        
        const updateBtnText = (theme) => {
            if (btn) btn.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
        };
        
        updateBtnText(savedTheme);

        btn?.addEventListener('click', () => {
            const isDark = root.getAttribute('data-theme') === 'dark';
            const nextTheme = isDark ? 'light' : 'dark';
            
            root.setAttribute('data-theme', nextTheme);
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
            this.cursorPos.x += (this.mousePos.x - this.cursorPos.x) * 0.15;
            this.cursorPos.y += (this.mousePos.y - this.cursorPos.y) * 0.15;
            
            cursor.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(render);
        };
        render();

        const hoverElements = document.querySelectorAll('a, button, .project-card, .logo-img, .cell-links a');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '60px';
                cursor.style.height = '60px';
                cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                cursor.style.mixBlendMode = 'difference';
                cursor.style.border = 'none';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '16px'; 
                cursor.style.height = '16px';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.mixBlendMode = 'normal';
                cursor.style.border = '1px solid var(--text-color)';
            });
        });
    }

    initClock() {
        const clockEl = document.getElementById('liveClock');
        if (!clockEl) return;

        const update = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-GB', { 
                timeZone: 'Asia/Jakarta', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            clockEl.textContent = time;
        };
        setInterval(update, 1000);
        update(); 
    }

    initNavigation() {
        const btnUp = document.getElementById('backToTop');
        const footerElement = document.querySelector('.footer');
        
        window.addEventListener('scroll', () => {
            if (!btnUp) return;

            if (window.scrollY > 400) {
                btnUp.classList.add('show');
            } else {
                btnUp.classList.remove('show');
            }

            if (footerElement) {
                const footerRect = footerElement.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (footerRect.top < windowHeight) {
                    const overlapDistance = windowHeight - footerRect.top;
                    btnUp.style.position = 'absolute';
                    btnUp.style.bottom = `${overlapDistance + 40}px`; 
                } else {
                    btnUp.style.position = 'fixed';
                    btnUp.style.bottom = '40px';
                }
            }
        });

        btnUp?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    initScrollEffects() {
        const observerOptions = {
            threshold: 0.05,
            rootMargin: "0px 0px -40px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        document.querySelectorAll('.project-card, .side-title, .hero-bottom, .footer-cell').forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
            observer.observe(el);
        });
    } // Kurung kurawal penutup fungsi initScrollEffects() tetap di sini

    initMenuOverlay() { // Fungsi ini sekarang berada di dalam kelas dengan benar
        const openBtn = document.getElementById('openMenu');
        const closeBtn = document.getElementById('closeMenu');
        const overlay = document.querySelector('.menu-overlay');
        const overlayLinks = document.querySelectorAll('.overlay-menu-link');

        openBtn?.addEventListener('click', () => {
            overlay?.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });

        const closeMenuAction = () => {
            overlay?.classList.remove('active');
            document.body.style.overflow = 'auto'; 
        };

        closeBtn?.addEventListener('click', closeMenuAction);

        overlayLinks.forEach(link => {
            link.addEventListener('click', closeMenuAction);
        });
    }
} // Kurung kurawal penutup akhir kelas PortfolioEngine

// Booting engine utama begitu seluruh elemen DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioEngine();
});
