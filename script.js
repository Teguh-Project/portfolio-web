document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Jalankan 3D Hero
    init3DHero();

    // 2. REVEAL ANIMATION
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, { threshold: 0.15 });

    const elementsToReveal = document.querySelectorAll('.project-item, .about-text, .reveal-text, .footer h2');
    elementsToReveal.forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    // 3. PARALLAX & NAVBAR (Logika scroll digabung agar performa maksimal)
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    const images = document.querySelectorAll('.image-container img');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Parallax
        images.forEach(img => {
            const rect = img.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const shift = (rect.top - window.innerHeight / 2) * 0.15;
                img.style.transform = `scale(1.1) translateY(${shift}px)`;
            }
        });

        // Navbar hide/show
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

// --- FUNGSI 3D HERO ---
function init3DHero() {
    const container = document.getElementById('canvas-3d-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Batasi pixel ratio agar tidak berat
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5); // Mundurkan kamera sedikit agar objek terlihat penuh

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    const loader = new THREE.GLTFLoader();
    let model3d;

    // Pastikan Path ini benar sesuai struktur folder di GitHub
    loader.load(
        'assets/images/abstract_aquarium.glb', 
        (gltf) => {
            model3d = gltf.scene;
            model3d.scale.set(1.5, 1.5, 1.5);
            scene.add(model3d);
            console.log("Model 3D Loaded!");
        },
        undefined,
        (error) => { console.error('Error load model:', error); }
    );

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.0005;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.0005;
    });

    function animate() {
        requestAnimationFrame(animate);
        if (model3d) {
            model3d.rotation.y += 0.002;
            model3d.rotation.y += (mouseX - model3d.rotation.y) * 0.1;
            model3d.rotation.x += (mouseY - model3d.rotation.x) * 0.1;
        }
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
