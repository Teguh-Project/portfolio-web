document.addEventListener('DOMContentLoaded', () => {
    
    // 1. REVEAL ANIMATION (Muncul saat scroll)
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Berhenti mengamati setelah elemen muncul agar performa tetap terjaga
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15 // Elemen muncul setelah 15% bagian masuk ke layar
    });

    // Pilih elemen yang ingin diberi efek muncul
    const elementsToReveal = document.querySelectorAll('.project-item, .about-text, .reveal-text, .footer h2');
    elementsToReveal.forEach(el => {
        el.classList.add('reveal-hidden'); // Siapkan state awal tersembunyi
        revealObserver.observe(el);
    });

    // 2. PARALLAX EFFECT PADA GAMBAR
    // Membuat gambar bergerak sedikit lebih lambat dari scroll untuk efek kedalaman
    window.addEventListener('scroll', () => {
        const images = document.querySelectorAll('.image-container img');
        images.forEach(img => {
            const speed = 0.15;
            const rect = img.parentElement.getBoundingClientRect();
            const visible = rect.top < window.innerHeight && rect.bottom > 0;

            if (visible) {
                const shift = (rect.top - window.innerHeight / 2) * speed;
                img.style.transform = `scale(1.1) translateY(${shift}px)`;
            }
        });
    });

    // 3. NAVBAR HIDE/SHOW ON SCROLL
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.style.transform = 'translateY(0)';
            return;
        }

        if (currentScroll > lastScroll) {
            // Scroll ke bawah - Sembunyikan navbar
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scroll ke atas - Munculkan navbar
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });
});
// --- KONFIGURASI 3D HERO (GLTF) ---

function init3DHero() {
    const container = document.getElementById('canvas-3d-container');
    if (!container) return; // Jika elemen tidak ada, jangan jalankan

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Alpha: true membuat background canvas transparan (agar gambar JPG terlihat)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Agar tajam di layar Retina
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Atur posisi kamera agar objek terlihat
    camera.position.z = 4; 
    camera.position.y = 1;

    // 2. Pencahayaan (Lighting) - Sangat penting untuk GLTF
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Cahaya merata
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Cahaya fokus
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);

    // 3. Load Model GLTF
    const loader = new THREE.GLTFLoader();
    let model3d;

    loader.load(
        // DI SINI KAMU MEMANGGIL FILE GLTF/GLB-MU
        'assets/images/abstract_aquarium.glb', 
        
        function (gltf) {
            model3d = gltf.scene;
            
            // Atur skala dan posisi agar pas di tengah layar
            model3d.scale.set(1.5, 1.5, 1.5); 
            model3d.position.y = 0;
            
            scene.add(model3d);
            console.log("Model 3D berhasil dimuat");
        },
        // Fungsi saat loading proses (opsional)
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // Fungsi jika terjadi error
        function (error) {
            console.error('Terjadi kesalahan saat memuat model 3D', error);
        }
    );

    // 4. Animasi & Interaksi Mouse
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        // Tangkap posisi mouse relatif terhadap tengah layar
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    function animate() {
        requestAnimationFrame(animate);

        // Membuat gerakan mengikuti mouse menjadi halus (smoothing)
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        if (model3d) {
            // Animasi rotasi otomatis pelan
            model3d.rotation.y += 0.002;

            // Rotasi tambahan berdasarkan gerakan mouse (interaktif)
            model3d.rotation.y += 0.5 * (targetX - model3d.rotation.y);
            model3d.rotation.x += 0.5 * (targetY - model3d.rotation.x);
        }

        renderer.render(scene, camera);
    }

    animate();

    // 5. Menangani Perubahan Ukuran Layar (Responsive)
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Jalankan fungsi setelah halaman dimuat
document.addEventListener('DOMContentLoaded', init3DHero);
