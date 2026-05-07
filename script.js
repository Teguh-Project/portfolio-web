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
        
        const currentTheme = localStorage.getItem('theme') || 'dark';
        body.setAttribute('data-theme', currentTheme);
        if(btn) btn.textContent = currentTheme === 'dark' ? 'LIGHT' : 'DARK';

        btn?.addEventListener('click', () => {
            const isDark = body.getAttribute('data-theme') === 'dark';
            const nextTheme = isDark ? 'light' : 'dark';
            body.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            btn.textContent = isDark ? 'DARK' : 'LIGHT';
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
            // LERP: Semakin kecil angka (0.1), semakin halus gerakannya
            this.cursorPos.x += (this.mousePos.x - this.cursorPos.x) * 0.15;
            this.cursorPos.y += (this.mousePos.y - this.cursorPos.y) * 0.15;
            cursor.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(render);
        };
        render();

        // Hover Effect
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

    initClock() {
        const clockEl = document.getElementById('local-time');
        const update = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-GB', { 
                timeZone: 'Asia/Jakarta', 
                hour: '2-digit', minute: '2-digit', second: '2-digit' 
            });
            if(clockEl) clockEl.textContent = `${time} MALANG, IDN`;
        };
        setInterval(update, 1000);
        update();
    }

    initNavigation() {
        const btnUp = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) btnUp?.classList.add('show');
            else btnUp?.classList.remove('show');
        });
        btnUp?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    initScrollEffects() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.project-card, .side-title').forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(40px)";
            el.style.transition = "all 1s cubic-bezier(0.16, 1, 0.3, 1)";
            observer.observe(el);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new PortfolioEngine());
