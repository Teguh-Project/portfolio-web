document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. REAL-TIME CLOCK (OPTIMIZED) ---
    const updateTime = () => {
        const timeElement = document.getElementById('local-time');
        if (!timeElement) return;
        const options = { 
            timeZone: 'Asia/Jakarta', 
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false 
        };
        const now = new Intl.DateTimeFormat('en-GB', options).format(new Date());
        // Style 2026: Menggunakan pemisah titik dua yang konsisten
        timeElement.textContent = `${now} MALANG, ID`;
    };
    setInterval(updateTime, 1000);
    updateTime();

    // --- 2. ADVANCED CUSTOM CURSOR ---
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        // Posisi target kursor
        let targetX = 0, targetY = 0;
        // Posisi kursor saat ini (untuk efek lerp/smooth)
        let curX = 0, curY = 0;

        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        const animateCursor = () => {
            // Lerp (Linear Interpolation) untuk gerakan organik
            curX += (targetX - curX) * 0.15;
            curY += (targetY - curY) * 0.15;
            
            cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover Detection
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

    // --- 3. THEME LOGIC (REDSTONE VIBE) ---
    const themeToggle = document.getElementById('themeToggle');
    const updateTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        if (themeToggle) {
            themeToggle.querySelector('.mode-text').textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
        }
    };

    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    updateTheme(savedTheme);

    themeToggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        updateTheme(current === 'dark' ? 'light' : 'dark');
    });

    // --- 4. SMART SCROLL (NAVBAR & REVEAL) ---
    let lastScroll = 0;
    const nav = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Hide/Show Nav
        if (currentScroll > lastScroll && currentScroll > 150) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Intersection Observer untuk animasi masuk
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Menerapkan reveal ke elemen baru
    document.querySelectorAll('.project-card, .service-item, .section-title').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
        observer.observe(el);
    });

    // --- 5. THREE.JS (MODERN INTEGRATION) ---
    if (typeof THREE !== 'undefined' && document.getElementById('canvas-3d-container')) {
        const container = document.getElementById('canvas-3d-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        camera.position.z = 5;
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 2);
        scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

        let model;
        const loader = new THREE.GLTFLoader();
        loader.load('./assets/images/abstract_aquarium.glb', (gltf) => {
            model = gltf.scene;
            // Penyesuaian skala agar pas dengan layout editorial baru
            model.scale.set(0.5, 0.5, 0.5); 
            scene.add(model);
        });

        // Mouse Parallax Logic
        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            if (model) {
                // Rotasi otomatis yang sangat lambat & elegan
                model.rotation.y += 0.002;
                // Respon halus terhadap gerakan mouse
                model.rotation.x += (mouseY * 0.5 - model.rotation.x) * 0.05;
                model.rotation.y += (mouseX * 0.5 - model.rotation.y) * 0.05;
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
