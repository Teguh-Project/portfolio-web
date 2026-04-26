document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GLOBAL UTILITIES ---
    const body = document.body;

    // --- 2. REAL-TIME CLOCK (MALANG TIME) ---
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

    // --- 3. CUSTOM CURSOR (SMOOTH & CONTRAST) ---
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        window.addEventListener('mousemove', (e) => {
            // Gunakan requestAnimationFrame untuk performa lebih smooth
            requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            });
        });

        // Hover Effect
        const hoverTargets = document.querySelectorAll('a, button, .nav-item, .contact-item, .work-card');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(4)');
            target.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
        });
    }

    // --- 4. THEME TOGGLE (DARK/LIGHT) ---
    const themeToggle = document.getElementById('themeToggle');
    const modeText = themeToggle?.querySelector('.mode-text');

    const updateThemeUI = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (modeText) modeText.textContent = theme === 'light' ? 'DARK' : 'LIGHT';
        localStorage.setItem('portfolio-theme', theme);
    };

    // Init theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    updateThemeUI(savedTheme);

    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        updateThemeUI(currentTheme === 'light' ? 'dark' : 'light');
    });

    // --- 5. SMART NAVBAR & BACK TO TOP ---
    let lastScroll = 0;
    const nav = document.querySelector('.navbar');
    const btnUp = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Navbar Hide/Show
        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        // Back to Top Visibility
        if (currentScroll > 600) {
            btnUp?.classList.add('show');
        } else {
            btnUp?.classList.remove('show');
        }
        
        lastScroll = currentScroll;
    });

    btnUp?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 6. INTERSECTION OBSERVER (SCROLL REVEAL) ---
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target); // Berhenti observasi setelah muncul
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal-hidden').forEach(el => revealObserver.observe(el));

    // --- 7. THREE.JS (BACKGROUND MODEL) ---
    if (typeof THREE !== 'undefined') {
        const container = document.getElementById('canvas-3d-container');
        if (container) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            
            // PENTING: Alpha True dan setClearColor transparan agar tidak menutupi teks
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setClearColor(0x000000, 0); 
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            camera.position.z = 5;
            scene.add(new THREE.AmbientLight(0xffffff, 1.5));

            const loader = new THREE.GLTFLoader();
            let model;
            
            loader.load('./assets/images/abstract_aquarium.glb', (gltf) => {
                model = gltf.scene;
                model.scale.set(0.4, 0.4, 0.4);
                scene.add(model);
            });

            // Parallax Effect
            let mouseX = 0, mouseY = 0;
            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX - window.innerWidth / 2) * 0.0003;
                mouseY = (e.clientY - window.innerHeight / 2) * 0.0003;
            });

            const animate = () => {
                requestAnimationFrame(animate);
                if (model) {
                    model.rotation.y += 0.003;
                    model.rotation.y += (mouseX - model.rotation.y) * 0.05;
                    model.rotation.x += (mouseY - model.rotation.x) * 0.05;
                }
                renderer.render(scene, camera);
            };
            animate();

            // Resize Handler
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }
    }
});
