document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. REAL-TIME CLOCK ---
    const updateTime = () => {
        const timeElement = document.getElementById('local-time');
        if (!timeElement) return;
        const options = { 
            timeZone: 'Asia/Jakarta', 
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false 
        };
        const now = new Intl.DateTimeFormat('en-GB', options).format(new Date());
        timeElement.textContent = `${now} MALANG, ID`;
    };
    setInterval(updateTime, 1000);
    updateTime();

    // --- 2. CUSTOM CURSOR ---
    const cursorEl = document.querySelector('.custom-cursor') || document.createElement('div');
    if (!document.querySelector('.custom-cursor')) {
        cursorEl.className = 'custom-cursor';
        document.body.appendChild(cursorEl);
    }

    document.addEventListener('mousemove', (e) => {
        cursorEl.style.left = `${e.clientX}px`;
        cursorEl.style.top = `${e.clientY}px`;
    });

    const applyCursorHover = () => {
        const targets = document.querySelectorAll('a, button, .work-card, .contact-item, .nav-item');
        targets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorEl.classList.add('cursor-active'));
            el.addEventListener('mouseleave', () => cursorEl.classList.remove('cursor-active'));
        });
    };
    applyCursorHover();

    // --- 3. SMART NAVBAR ---
    let lastScroll = 0;
    const nav = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        if (current > lastScroll && current > 150) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        // Active Link
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            if (current > sectionTop && current <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
                });
            }
        });
        lastScroll = current;
    });

    // --- 4. THEME TOGGLE ---
    const themeToggle = document.getElementById('themeToggle');
    const modeText = themeToggle?.querySelector('.mode-text');
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (modeText) modeText.textContent = theme === 'light' ? 'DARK' : 'LIGHT';
    };
    setTheme(localStorage.getItem('theme') || 'dark');
    themeToggle?.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        setTheme(isLight ? 'dark' : 'light');
    });

    // --- 5. SCROLL REVEAL (THE FIX) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    // PENTING: Cari SEMUA elemen yang punya class reveal-hidden atau reveal-text
    document.querySelectorAll('.reveal-hidden, .reveal-text, .work-card, .contact-item, .footer-cta').forEach(el => {
        revealObserver.observe(el);
    });

    // --- 6. 3D INITIALIZATION ---
    if (typeof THREE !== 'undefined') {
        const container = document.getElementById('canvas-3d-container');
        if (container) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);
            camera.position.z = 7;
            scene.add(new THREE.AmbientLight(0xffffff, 2));

            const loader = new THREE.GLTFLoader();
            let model;
            loader.load('./assets/images/abstract_aquarium.glb', (gltf) => {
                model = gltf.scene;
                model.scale.set(0.35, 0.35, 0.35);
                if(window.innerWidth > 768) model.position.x = 2;
                scene.add(model);
            });

            let tX = 0, tY = 0;
            document.addEventListener('mousemove', (e) => {
                tX = (e.clientX - window.innerWidth / 2) * 0.0005;
                tY = (e.clientY - window.innerHeight / 2) * 0.0005;
            });

            const animate = () => {
                requestAnimationFrame(animate);
                if (model) {
                    model.rotation.y += 0.002 + (tX - model.rotation.y) * 0.05;
                    model.rotation.x += (tY - model.rotation.x) * 0.05;
                }
                renderer.render(scene, camera);
            };
            animate();
        }
    }
});

// --- 7. SCROLL REVEAL (ULTRA SAFE) ---
const revealElements = document.querySelectorAll('.reveal-hidden, .reveal-text, .work-card, .contact-item, .footer-cta, .section-title');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { 
    threshold: 0.05, // Hanya butuh 5% elemen masuk layar
    rootMargin: "0px 0px -50px 0px" // Trigger sedikit sebelum elemen muncul
});

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// FORCE REVEAL FALLBACK: Jika dalam 2 detik elemen masih belum muncul (mungkin JS stuck), paksa muncul.
setTimeout(() => {
    revealElements.forEach(el => {
        if (!el.classList.contains('is-visible')) {
            el.classList.add('is-visible');
        }
    });
}, 2500);
