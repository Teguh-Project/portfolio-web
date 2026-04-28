/**
 * DETROIT & SSSCRIPT ENGINE v2.5 (2026 Optimized)
 * Multi-Platform Creative Engine for Teguh Perwira Putra
 * Features: Adaptive LERP, Smart Observer, Kinetic Parallax
 */

class PortfolioEngine {
    constructor() {
        // Core states
        this.lastScroll = 0;
        this.isTicking = false;
        
        // Motion settings (LERP: 0.1 is smooth, 0.2 is snappy)
        this.cursor = { targetX: 0, targetY: 0, curX: 0, curY: 0, speed: 0.15 };
        this.parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };
        
        this.init();
    }

    init() {
        // Core Modules
        this.initClock();
        this.initTheme();
        this.initCustomCursor();
        this.initSmartScroll();
        this.initIntersectionObserver();
        this.initMagneticEffect();
        this.initHeroParallax();
        this.initEasterEgg();
        
        // Window Listeners
        window.addEventListener('resize', () => this.onResize(), { passive: true });
        
        // Success Terminal Output
        console.log(
            "%c DETROIT ENGINE v2.5 %c System Online: Teguh P.P ",
            "background: #ff3e3e; color: white; font-weight: bold; padding: 4px 10px; border-radius: 4px 0 0 4px;",
            "background: #222; color: #00ff00; font-family: monospace; padding: 4px 10px; border-radius: 0 4px 4px 0;"
        );
    }

    // 1. DYNAMIC REAL-TIME CLOCK
    initClock() {
        const timeElement = document.getElementById('local-time');
        if (!timeElement) return;

        const updateClock = () => {
            const now = new Date();
            const options = {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            };
            const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
            timeElement.textContent = `${timeString} MALANG, IDN`;
        };

        setInterval(updateClock, 1000);
        updateClock();
    }

    // 2. KINETIC CUSTOM CURSOR (LERP OPTIMIZED)
    initCustomCursor() {
        const cursorEl = document.querySelector('.custom-cursor');
        if (!cursorEl || window.innerWidth < 1024) return; // Disable on touch devices

        window.addEventListener('mousemove', (e) => {
            this.cursor.targetX = e.clientX;
            this.cursor.targetY = e.clientY;
        }, { passive: true });

        const animateCursor = () => {
            // Formula: Current + (Target - Current) * Speed
            this.cursor.curX += (this.cursor.targetX - this.cursor.curX) * this.cursor.speed;
            this.cursor.curY += (this.cursor.targetY - this.cursor.curY) * this.cursor.speed;
            
            cursorEl.style.transform = `translate3d(${this.cursor.curX}px, ${this.cursor.curY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);

        // Advanced Hover Detection
        const interactiveElements = 'a, button, .project-card, .theme-toggle-nav, .giant-email-link';
        document.querySelectorAll(interactiveElements).forEach(el => {
            el.addEventListener('mouseenter', () => cursorEl.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorEl.classList.remove('cursor-hover'));
        });
    }

    // 3. SMART THEME ENGINE
    initTheme() {
        const btn = document.getElementById('themeToggle');
        const root = document.documentElement;

        const setTheme = (theme) => {
            root.setAttribute('data-theme', theme);
            localStorage.setItem('tp-portfolio-theme', theme);
            
            if (btn) {
                const text = btn.querySelector('.mode-text');
                if (text) text.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
            }
        };

        const savedTheme = localStorage.getItem('tp-portfolio-theme') || 'dark';
        setTheme(savedTheme);

        btn?.addEventListener('click', () => {
            const current = root.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // 4. ULTRA-SMOOTH NAVBAR (HARDWARE ACCELERATED)
    initSmartScroll() {
        const nav = document.querySelector('.navbar');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            if (!this.isTicking) {
                window.requestAnimationFrame(() => {
                    const st = window.pageYOffset;

                    // Hide/Show Logic
                    if (st > this.lastScroll && st > 150) {
                        nav.style.transform = 'translate3d(0, -100%, 0)'; // Smooth slide up
                    } else {
                        nav.style.transform = 'translate3d(0, 0, 0)'; // Smooth slide down
                    }

                    // Scrolled Background State
                    st > 50 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled');

                    this.lastScroll = Math.max(0, st); // Fix iOS bounce
                    this.isTicking = false;
                });
                this.isTicking = true;
            }
        }, { passive: true });
    }

    // 5. STAGGERED REVEAL OBSERVER
    initIntersectionObserver() {
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger effect using setTimeout
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, index * 100); 
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        const itemsToReveal = '.project-card, .section-title, .hero-text-side, .service-item, .large-text';
        document.querySelectorAll(itemsToReveal).forEach(el => {
            el.classList.add('reveal-init');
            observer.observe(el);
        });
    }

    // 6. MAGNETIC COMPONENT EFFECT
    initMagneticEffect() {
        const magElements = document.querySelectorAll('.nav-link, .theme-toggle-nav, .back-to-top, .logo');
        
        magElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = el.getBoundingClientRect();
                const x = (e.clientX - (left + width / 2)) * 0.35;
                const y = (e.clientY - (top + height / 2)) * 0.35;
                
                el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                el.style.transition = 'transform 0.1s ease-out'; // Snappy follow
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = `translate3d(0, 0, 0)`;
                el.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'; // Smooth return
            });
        });
    }

    // 7. CINEMATIC HERO PARALLAX
    initHeroParallax() {
        const heroWrapper = document.querySelector('.hero-bg-wrapper');
        const heroImg = document.querySelector('.hero-gif');
        if (!heroWrapper || !heroImg) return;

        window.addEventListener('mousemove', (e) => {
            this.parallax.targetX = (e.clientX / window.innerWidth - 0.5) * 30;
            this.parallax.targetY = (e.clientY / window.innerHeight - 0.5) * 30;
        }, { passive: true });

        const animateParallax = () => {
            this.parallax.x += (this.parallax.targetX - this.parallax.x) * 0.05;
            this.parallax.y += (this.parallax.targetY - this.parallax.y) * 0.05;

            heroImg.style.transform = `scale(1.15) translate3d(${this.parallax.x}px, ${this.parallax.y}px, 0)`;
            requestAnimationFrame(animateParallax);
        };
        requestAnimationFrame(animateParallax);
    }

    // 8. EXPERT EASTER EGG (COMMAND SYSTEM)
    initEasterEgg() {
        let inputString = "";
        const secretCode = "TEGUH";

        window.addEventListener('keydown', (e) => {
            inputString += e.key.toUpperCase();
            inputString = inputString.slice(-10); // Keep last 10 chars

            if (inputString.includes(secretCode)) {
                this.triggerFlashEffect();
                inputString = "";
            }
        });
    }

    triggerFlashEffect() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; inset: 0; background: white; z-index: 99999;
            mix-blend-mode: difference; pointer-events: none;
            transition: opacity 1s ease;
        `;
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 1000);
        }, 100);

        console.log("%c SYSTEM OVERRIDE: DETROIT MODE ACTIVATED ", "color: #ff3e3e; font-weight: bold;");
    }

    onResize() {
        // Re-check for mobile to disable custom cursor if needed
        if (window.innerWidth < 1024) {
            document.querySelector('.custom-cursor').style.display = 'none';
        } else {
            document.querySelector('.custom-cursor').style.display = 'block';
        }
    }
}

// Initialize on Load
window.addEventListener('load', () => {
    new PortfolioEngine();
});
