document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. REAL-TIME CLOCK (Malang, ID) ---
    const updateTime = () => {
        const timeElement = document.getElementById('local-time');
        if (!timeElement) return;
        
        const options = { 
            timeZone: 'Asia/Jakarta', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false 
        };
        const now = new Intl.DateTimeFormat('en-GB', options).format(new Date());
        timeElement.textContent = `${now} MALANG, ID`;
    };
    setInterval(updateTime, 1000);
    updateTime();

    // --- 2. CUSTOM CURSOR LOGIC ---
    const cursor = document.querySelector('.custom-cursor');
    // Jika elemen tidak ada di HTML, kita buat otomatis agar tidak error
    const cursorEl = cursor || document.createElement('div');
    if (!cursor) {
        cursorEl.className = 'custom-cursor';
        document.body.appendChild(cursorEl);
    }

    document.addEventListener('mousemove', (e) => {
        cursorEl.style.left = `${e.clientX}px`;
        cursorEl.style.top = `${e.clientY}px`;
    });

    // Menambahkan efek hover ke semua elemen interaktif secara dinamis
    const applyCursorHover = () => {
        const targets = document.querySelectorAll('a, button, .work-card, .tool-item, .nav-item');
        targets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorEl.classList.add('cursor-active'));
            el.addEventListener('mouseleave', () => cursorEl.classList.remove('cursor-active'));
        });
    };
    applyCursorHover();

    // --- 3. SMART NAVBAR & ACTIVE LINK INDICATOR ---
    let lastScroll = 0;
    const nav = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        
        // Hide/Show Nav
        if (current > lastScroll && current > 150) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        // Background Opacity
        if (current > 50) {
            nav.style.background = document.documentElement.getAttribute('data-theme') === 'light' 
                ? 'rgba(245, 245, 245, 0.95)' 
                : 'rgba(5, 5, 5, 0.95)';
        }

        // Active Link Indicator
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (current > sectionTop && current <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        lastScroll = current;
    });

    // --- 4. THEME TOGGLE (Dark/Light) ---
    const themeToggle = document.getElementById('themeToggle');
    const modeText = themeToggle?.querySelector('.mode-text');

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (modeText) modeText.textContent = theme === 'light' ? 'DARK' : 'LIGHT';
    };

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'light' ? 'dark' : 'light');
        });
    }

    // --- 5. BACK TO TOP ---
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 600) {
            backToTopBtn?.classList.add('show');
        } else {
            backToTopBtn?.classList.remove('show');
        }
    });

    backToTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 6. SMOOTH SCROLL FOR ANCHORS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 7. SCROLL REVEAL ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-text, .work-card, .tool-item, .section-title').forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    // --- 8. 3D INITIALIZATION ---
    if (typeof THREE !== 'undefined') {
        const init3D = () => {
            const container = document.getElementById('canvas-3d-container');
            if (!container) return;

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
        };
        init3D();
    }
});
