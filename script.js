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

    // --- 2. CUSTOM CURSOR (Elegant Circle) ---
    // Tambahkan <div class="cursor"></div> di html jika ingin visual kursor custom
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Efek kursor membesar saat hover link/button
    const interactiveElements = document.querySelectorAll('a, button, .work-card, .tool-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-active'));
    });

    // --- 3. SMART NAVBAR & SCROLL MONITOR ---
    let lastScroll = 0;
    const nav = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        
        // Hide/Show Nav on Scroll
        if (current > lastScroll && current > 150) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        // Background blur effect
        if (current > 50) {
            nav.style.background = 'rgba(5, 5, 5, 0.95)';
        } else {
            nav.style.background = 'rgba(5, 5, 5, 0.8)';
        }

        // Active Link Indicator (Berdasarkan posisi scroll)
        let currentSection = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(currentSection)) {
                link.classList.add("active");
            }
        });

        lastScroll = current;
    });

    // --- 4. UNIVERSAL SCROLL REVEAL (Intersection Observer) ---
    const observerOptions = { threshold: 0.15 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll(
        '.reveal-text, .work-card, .tool-item, .service-item, .exp-item, .section-title'
    );

    elementsToReveal.forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    // --- 5. SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 6. 3D MODEL INTERACTION (Optimized) ---
    // Saya tetap simpan ini, tapi pastikan ID canvas-3d-container ada di Hero kamu.
    const init3D = () => {
        const container = document.getElementById('canvas-3d-container');
        if (!container || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 7;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        scene.add(ambientLight);

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
                model.rotation.y += 0.002;
                model.rotation.y += (tX - model.rotation.y) * 0.05;
                model.rotation.x += (tY - model.rotation.x) * 0.05;
            }
            renderer.render(scene, camera);
        };
        animate();
    };
    init3D();
});

// --- 7. BACK TO TOP LOGIC ---
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- 8. DARK/LIGHT MODE TOGGLE ---
const themeToggle = document.getElementById('themeToggle');
const modeText = themeToggle.querySelector('.mode-text');

// Cek preferensi user di LocalStorage
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        modeText.textContent = 'DARK';
    }
}

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        modeText.textContent = 'LIGHT';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        modeText.textContent = 'DARK';
    }
});
