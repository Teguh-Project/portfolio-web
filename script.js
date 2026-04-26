document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INISIALISASI 3D HERO ---
    // --- DI DALAM FUNGSI init3DHero() ---

const loader = new THREE.GLTFLoader();
let model;

loader.load('./assets/images/abstract_aquarium.glb', (gltf) => {
    model = gltf.scene;
    
    // 1. MEMPERKECIL UKURAN (SCALE)
    // Sebelumnya (mungkin): model.scale.set(1.5, 1.5, 1.5);
    // Ubah menjadi lebih kecil, misalnya 0.5 (atau 50% dari ukuran asli)
    model.scale.set(0.5, 0.5, 0.5); 
    
    // 2. MENGATUR POSISI (Optional)
    // Jika objeknya dirasa terlalu tinggi, turunkan sedikit (posisi Y negatif)
    // model.position.y = -0.5; 

    // Pastikan objek berada di tengah sumbu X dan Z
    model.position.x = 0;
    model.position.z = 0;

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
