document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INISIALISASI 3D HERO ---
    const init3DHero = () => {
    const container = document.getElementById('canvas-3d-container');
    if (!container) return;

    const scene = new THREE.Scene();
    
    // 1. KAMERA: Mundurkan lebih jauh (z=10) agar objek tidak raksasa
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10); 

    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true, // WAJIB untuk transparansi
        preserveDrawingBuffer: true 
    });
    
    // WAJIB: Memastikan background canvas tidak punya warna (0)
    renderer.setClearColor(0x000000, 0); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. CAHAYA: Dibikin sangat terang agar objek tidak hitam (siluet)
    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Cahaya dari segala arah
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 5); // Cahaya seperti bohlam
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const loader = new THREE.GLTFLoader();
    let model;

    loader.load('./assets/images/abstract_aquarium.glb', (gltf) => {
        model = gltf.scene;
        
        // SKALA: Perkecil ke 0.2 jika objeknya aslinya besar banget
        model.scale.set(0.25, 0.25, 0.25); 
        
        model.position.set(0, -1, 0); // Turunkan sedikit agar tidak menabrak teks
        scene.add(model);
    }, undefined, (err) => console.error(err));

    // Animasi tetap sama...
    const animate = () => {
        requestAnimationFrame(animate);
        if (model) {
            model.rotation.y += 0.003;
        }
        renderer.render(scene, camera);
    };
    animate();
};

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
