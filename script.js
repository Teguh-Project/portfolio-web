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

    // --- 2. ADVANCED CUSTOM CURSOR (LERP EFFECT) ---
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        let targetX = 0, targetY = 0;
        let curX = 0, curY = 0;

        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        const animateCursor = () => {
            curX += (targetX - curX) * 0.15;
            curY += (targetY - curY) * 0.15;
            cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover Detection (Gunakan event delegation agar lebih ringan)
        const interactables = document.querySelectorAll('a, button, .project-card, .service-item');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '60px';
                cursor.style.height = '60px';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.border = '1px solid var(--accent)';
                cursor.style.mixBlendMode = 'normal';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '8px';
                cursor.style.height = '8px';
                cursor.style.backgroundColor = 'var(--accent)';
                cursor.style.border = 'none';
                cursor.style.mixBlendMode = 'difference';
            });
        });
    }

    // --- 3. THEME LOGIC ---
    const themeToggle = document.getElementById('themeToggle');
    const updateTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        if (themeToggle) {
            const modeText = themeToggle.querySelector('.mode-text');
            if (modeText) modeText.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
        }
    };

    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    updateTheme(savedTheme);

    themeToggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        updateTheme(current === 'dark' ? 'light' : 'dark');
    });

    // --- 4. SMART SCROLL & NAVBAR LOGIC ---
    let lastScroll = 0;
    const nav = document.querySelector('.navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Sticky & Hide Navbar on Scroll
        if (currentScroll > lastScroll && currentScroll > 150) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        // Glassmorphism effect on scroll
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Back to Top Button visibility
        if (backToTop) {
            if (currentScroll > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }

        lastScroll = currentScroll;
    });

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 5. BLUR REVEAL ANIMATION ---
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.filter = "blur(0px)";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card, .service-item, .section-title').forEach(el => {
        el.style.opacity = "0";
        el.style.filter = "blur(10px)"; 
        el.style.transform = "translateY(40px)";
        el.style.transition = "all 1s cubic-bezier(0.16, 1, 0.3, 1)";
        observer.observe(el);
    });

    // --- 6. MAGNETIC EFFECT ---
    const magneticElements = document.querySelectorAll('.nav-link, .theme-toggle, .btn-primary, .logo, .back-to-top');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = e.clientX - (left + width / 2);
            const y = e.clientY - (top + height / 2);
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0, 0)`;
        });
    });

    // --- 7. THREE.JS INTEGRATION ---
    if (typeof THREE !== 'undefined' && document.getElementById('canvas-3d-container')) {
        const container = document.getElementById('canvas-3d-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        camera.position.z = 5;
        const light = new THREE.DirectionalLight(0xffffff, 1.5); // Boost light sedikit
        light.position.set(1, 1, 2);
        scene.add(light, new THREE.AmbientLight(0xffffff, 0.7));

        let model;
        const loader = new THREE.GLTFLoader();
        loader.load('./assets/images/abstract_aquarium.glb', (gltf) => {
            model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5); 
            scene.add(model);
        }, undefined, (error) => {
            console.error('Error loading GLB:', error);
        });

        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            if (model) {
                model.rotation.y += 0.002;
                // Smooth follow mouse
                model.rotation.x += (mouseY * 0.2 - model.rotation.x) * 0.05;
                model.rotation.y += (mouseX * 0.2 - model.rotation.y) * 0.05;
            }
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
});
