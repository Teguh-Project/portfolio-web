document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INISIALISASI 3D HERO ---
    const init3DHero = () => {
        const container = document.getElementById('canvas-3d-container');
        if (!container) return;

        const scene = new THREE.Scene();
        
        // Alpha: true wajib ada agar background canvas transparan
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0); // Angka 0 berarti transparansi 100%
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Pencahayaan
        scene.add(new THREE.AmbientLight(0xffffff, 1.5));
        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        const loader = new THREE.GLTFLoader();
        let model;

        loader.load('./assets/images/abstract_aquarium.glb', (gltf) => {
            model = gltf.scene;
            model.scale.set(1.5, 1.5, 1.5);
            scene.add(model);
            console.log("3D Berhasil Muncul!");
        }, undefined, (err) => console.error(err));

        // Interaksi Mouse
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.0003;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.0003;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            if (model) {
                model.rotation.y += 0.002;
                model.rotation.y += (mouseX - model.rotation.y) * 0.1;
                model.rotation.x += (mouseY - model.rotation.x) * 0.1;
            }
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    // Jalankan 3D
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

        // Parallax Effect
        projectImages.forEach(img => {
            const rect = img.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const shift = (rect.top - window.innerHeight / 2) * 0.15;
                img.style.transform = `scale(1.1) translateY(${shift}px)`;
            }
        });

        // Navbar Logic
        if (currentScroll <= 0) {
            navbar.style.transform = 'translateY(0)';
        } else if (currentScroll > lastScroll) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });
});
