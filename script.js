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
    }

    initTheme() {
        const btn = document.getElementById('themeToggle');
        const root = document.documentElement; // Mengontrol atribut di tingkat HTML root
        
        // Memuat preferensi tersimpan atau gunakan dark mode sebagai setelan bawaan
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
            // LERP (Linear Interpolation) untuk menghasilkan pergerakan kursor yang smooth/halus
            this.cursorPos.x += (this.mousePos.x - this.cursorPos.x) * 0.15;
            this.cursorPos.y += (this.mousePos.y - this.cursorPos.y) * 0.15;
            
            cursor.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(render);
        };
        render();

        // Mengamati interaksi hover pada elemen-elemen interaktif
        // Menambahkan selector .cell-links a agar tautan di dalam footer ikut merespon kursor
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
                cursor.style.width = '16px'; // Disesuaikan dengan diameter CSS baru (16px)
                cursor.style.height = '16px';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.mixBlendMode = 'normal';
                cursor.style.border = '1px solid var(--text-color)';
            });
        });
    }

    initClock() {
        // Disinkronkan dengan ID 'liveClock' dari struktur komponen HTML yang baru
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
        update(); // Eksekusi langsung tanpa menunggu delay interval pertama
    }

    initNavigation() {
        const btnUp = document.getElementById('backToTop');
        const footerElement = document.querySelector('.footer');
        
        window.addEventListener('scroll', () => {
            if (!btnUp) return;

            // A. Kontrol Visibilitas Tombol Berdasarkan Jarak Scroll Jauh Halaman
            if (window.scrollY > 400) {
                btnUp.classList.add('show');
            } else {
                btnUp.classList.remove('show');
            }

            // B. Perhitungan Batas Tabrakan Grid Footer (Stop & Lock Position)
            if (footerElement) {
                const footerRect = footerElement.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Jika batas atas kontainer footer mulai menembus dasar batas layar browser
                if (footerRect.top < windowHeight) {
                    const overlapDistance = windowHeight - footerRect.top;
                    btnUp.style.position = 'absolute';
                    // Tombol dikunci presisi di atas garis batas grid footer (ditambah offset space 40px)
                    btnUp.style.bottom = `${overlapDistance + 40}px`; 
                } else {
                    // Kembalikan ke posisi fixed melayang reguler jika posisi footer masih di bawah jauh
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
                    observer.unobserve(entry.target); // Mematikan pengamatan pasca elemen sukses direveal
                }
            });
        }, observerOptions);

        // Menambahkan .footer-cell agar blok modular menu bawah memudar halus saat discroll masuk
        document.querySelectorAll('.project-card, .side-title, .hero-bottom, .footer-cell').forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
            observer.observe(el);
        });
    }
}

// Booting engine utama begitu seluruh elemen DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioEngine();
});
