document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INISIALISASI 3D HERO ---
    const init3DHero = () => {
        const container = document.getElementById('canvas-3d-container');
        if (!container) return;

        // Inisialisasi Dasar
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Alpha: true agar background transparan dan gambar hero.jpg terlihat
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0); // Transparansi penuh
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Posisi Kamera (Mundur sedikit agar objek tidak terlalu besar)
        camera.position.z = 6;

        // Pencahayaan
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        // Memuat Model GLTF
        const loader = new THREE.GLTFLoader();
        let model;

        loader.load('./assets/images/abstract_aquarium.glb', (gltf) => {
            model = gltf.scene;
            
            // --- PENGATURAN UKURAN (SCALE) ---
            // Ubah angka ini (0.4) jika ingin lebih kecil lagi atau lebih besar
            model.scale.set(0.4, 0.4, 0.4); 
            
            model.position.set(0, 0, 0);
            scene.add(model);
            console.log("3D Berhasil Muncul!");
        }, undefined, (err) => {
            console.error("Gagal memuat file 3D. Cek path file kamu.", err);
        });

        // Logika Mouse Movement
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.0005;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.0005;
        });

        // Loop Animasi
        const animate = () => {
            requestAnimationFrame(animate);
            if (model) {
                // Rotasi otomatis pelan
                model.rotation.y += 0.002;
                
                // Efek mengikuti mouse (smoothing)
                model.rotation.y += (mouseX - model.rotation.y) * 0.05;
                model.rotation.x += (mouseY - model.rotation.x) * 0.05;
            }
            renderer.render(scene, camera);
        };
        animate();

        // Handle Resize Layar
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    // Jalankan Fungsi 3D
    init3DHero();

    // --- 2. REVEAL ANIMATION ON SCROLL ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.project-item, .about-text, .reveal-text, .footer h2').forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    // --- 3. NAVBAR & PARALLAX ---
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    const projectImages = document.querySelectorAll('.image-container img');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Efek Parallax pada gambar di Work Section
        projectImages.forEach(img => {
            const rect = img.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const shift = (rect.top - window.innerHeight / 2) * 0.12;
                img.style.transform = `scale(1.1) translateY(${shift}px)`;
            }
        });

        // Logic Navbar Hide/Show
        if (currentScroll <= 10) {
            navbar.style.transform = 'translateY(0)';
        } else if (currentScroll > lastScroll) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });
});
