document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. 3D ENGINE (Optimized for Right Side) ---
    const init3D = () => {
        const container = document.getElementById('canvas-3d-container');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Kamera sedikit lebih jauh agar objek pas di ruang kanan
        camera.position.z = 7;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Lighting yang lebih tajam untuk kesan industrial/clean
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
        
        const mainLight = new THREE.DirectionalLight(0xffffff, 2);
        mainLight.position.set(5, 10, 7);
        scene.add(mainLight);

        const loader = new THREE.GLTFLoader();
        let model;

        loader.load('./assets/images/abstract_aquarium.glb', (gltf) => {
            model = gltf.scene;
            
            // Mengatur skala agar tidak raksasa
            model.scale.set(0.35, 0.35, 0.35); 
            
            // Geser model ke kanan agar tidak menabrak teks Hero di kiri
            if(window.innerWidth > 768) {
                model.position.x = 2; 
            }
            
            scene.add(model);
        }, undefined, (error) => {
            console.error('Model 3D gagal dimuat:', error);
        });

        // Mouse Interactivity (Smoothing)
        let targetX = 0;
        let targetY = 0;
        
        document.addEventListener('mousemove', (e) => {
            targetX = (e.clientX - window.innerWidth / 2) * 0.0006;
            targetY = (e.clientY - window.innerHeight / 2) * 0.0006;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            if (model) {
                // Rotasi otomatis konstan
                model.rotation.y += 0.003;
                
                // Lerp/Smoothing untuk pergerakan mouse
                model.rotation.y += (targetX - model.rotation.y) * 0.05;
                model.rotation.x += (targetY - model.rotation.x) * 0.05;
            }
            renderer.render(scene, camera);
        };
        animate();

        // Responsive Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            
            // Sesuaikan posisi model saat layar mengecil
            if (model) {
                model.position.x = window.innerWidth > 768 ? 2 : 0;
            }
        });
    };

    init3D();

    // --- 2. UNIVERSAL SCROLL REVEAL ---
    // Menangani semua elemen reveal termasuk section baru (Tools, Experience, dll)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // Selektor diperluas untuk mencakup bento cards dan list pengalaman
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
        
        // Efek sembunyi navbar saat scroll ke bawah, muncul saat ke atas
        if (current > lastScroll && current > 150) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        // Tambahkan border saat scroll menjauh dari paling atas
        if (current > 50) {
            nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            nav.style.background = 'rgba(5, 5, 5, 0.9)';
        } else {
            nav.style.borderBottom = '1px solid transparent';
            nav.style.background = 'rgba(5, 5, 5, 0.8)';
        }
        
        lastScroll = current;
    });

    // Smooth Scroll untuk anchor links (Navigasi internal)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Offset untuk tinggi navbar
                    behavior: 'smooth'
                });
            }
        });
    });
});
