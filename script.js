document.addEventListener('DOMContentLoaded', () => {
    
    // --- 3D ENGINE ---
    const init3D = () => {
        const container = document.getElementById('canvas-3d-container');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 3);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const loader = new THREE.GLTFLoader();
        let model;

        loader.load('./assets/images/abstract_aquarium.glb', (gltf) => {
            model = gltf.scene;
            // Skala disesuaikan agar tidak menutupi teks
            model.scale.set(0.3, 0.3, 0.3); 
            model.position.y = -0.5;
            scene.add(model);
        });

        // Mouse Interactivity
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.0005;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.0005;
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

    init3D();

    // --- SCROLL REVEAL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-item, .about-text, .reveal-text, .footer h2').forEach(el => {
        el.classList.add('reveal-hidden');
        observer.observe(el);
    });

    // --- NAVBAR HIDE/SHOW ---
    let lastScroll = 0;
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        if (current > lastScroll && current > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScroll = current;
    });
});
