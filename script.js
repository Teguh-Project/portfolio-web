/**
 * PORTFOLIO ENGINE v3.0 - NEEDNAP EDITION
 */

class PortfolioEngine {
    constructor() {
        this.init();
    }

    init() {
        this.initTheme();
        this.initCursor();
        this.initScrollEffects();
        this.initReveal();
        this.initClock();
    }

    initTheme() {
        const btn = document.getElementById('themeToggle');
        const update = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            if(btn) btn.querySelector('.mode-text').textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
        };

        btn?.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            update(current === 'dark' ? 'light' : 'dark');
        });
    }

    initCursor() {
        const cursor = document.querySelector('.custom-cursor');
        window.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }

    initScrollEffects() {
        const nav = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        });
    }

    initReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal-init').forEach(el => observer.observe(el));
    }

    initClock() {
        const clockEl = document.getElementById('local-time');
        const update = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Jakarta', hour12: false });
            if(clockEl) clockEl.textContent = `${time} MALANG, IDN`;
        };
        setInterval(update, 1000);
        update();
    }
}

document.addEventListener('DOMContentLoaded', () => new PortfolioEngine());
