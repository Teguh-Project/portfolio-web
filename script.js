document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. 3D ENGINE ---
    const init3D = () => {
        const container = document.getElementById('canvas-3d-container');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 7;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
        const mainLight = new THREE.DirectionalLight(0xffffff, 2);
        mainLight.position.set(5, 10, 7);
        scene.add(mainLight);

        const loader = new THREE.GLTFLoader();
        let model;

        loader.load('./assets/images/abstract_aquarium.glb', (gltf) => {
            model = gltf.scene;
            model.scale.set(0.35, 0.35, 0.35); 
            if(window.innerWidth > 768) {
                model.position.x = 2; 
            }
            scene.add(model);
        }, undefined, (error) => {
            console.error('Model 3D gagal dimuat:', error);
        });

        let targetX = 0, targetY = 0;
        document.addEventListener('mousemove', (e) => {
            targetX = (e.clientX - window.innerWidth / 2) * 0.0006;
            targetY = (e.clientY - window.innerHeight / 2) * 0.0006;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            if (model) {
                model.rotation.y += 0.003;
                model.rotation.y += (targetX - model.rotation.y) * 0.05;
                model.rotation.x += (targetY - model.rotation.x) * 0.05;
            }
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            if (model) {
                model.position.x = window.innerWidth > 768 ? 2 : 0;
            }
        });
    };

    init3D();

    // --- 2. UNIVERSAL SCROLL REVEAL ---
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll(
        '.reveal-text, .work-card, .tool-item, .exp-item, .section-title, .about-desc, .footer h2'
    );

    elementsToReveal.forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    // --- 3. SMART NAVBAR & SMOOTH SCROLL ---
    let lastScroll = 0;
    const nav = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        if (current > lastScroll && current > 150) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        if (current > 50) {
            nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            nav.style.background = 'rgba(5, 5, 5, 0.9)';
        } else {
            nav.style.borderBottom = '1px solid transparent';
            nav.style.background = 'rgba(5, 5, 5, 0.8)';
        }
        lastScroll = current;
    });

    // Smooth Scroll - BAGIAN YANG SUDAH DIPERBAIKI:
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Perbaikan validasi agar tidak error querySelector
            if (targetId === '#' || !targetId.startsWith('#')) return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault(); // Pindah ke sini agar default link tetap jalan jika targetId bukan ID
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
