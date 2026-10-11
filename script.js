(() => {
  const $ = (s) => document.querySelector(s);
  const root = document.documentElement;

  // Tema (tersimpan di localStorage)
  const toggle = $('#themeToggle');
  const setTheme = (t) => {
    root.dataset.theme = t;
    toggle.textContent = t === 'dark' ? 'LIGHT' : 'DARK';
    try { localStorage.setItem('theme', t); } catch (e) {}
  };
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  setTheme(saved || 'dark');
  toggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  // Menu fullscreen
  const overlay = $('#menuOverlay');
  const toggleMenu = (open) => {
    overlay.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  $('#openMenu').addEventListener('click', () => toggleMenu(true));
  $('#closeMenu').addEventListener('click', () => toggleMenu(false));
  overlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && toggleMenu(false));

  // Custom cursor dengan easing + label "VIEW" di kartu proyek
  const cursor = $('.custom-cursor');
  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  (function loop() {
    cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
    cursor.style.transform = `translate(${cx}px,${cy}px)`;
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('.project-card').forEach((c) => {
    c.addEventListener('mouseenter', () => cursor.classList.add('is-view'));
    c.addEventListener('mouseleave', () => cursor.classList.remove('is-view'));
  });

  // Parallax ringan pada GIF hero
  const heroGif = $('.hero-gif-media');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / innerWidth - 0.5) * 16, y = (e.clientY / innerHeight - 0.5) * 16;
    heroGif.style.transform = `scale(1.06) translate(${x}px,${y}px)`;
  });

  // Reveal saat scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

  // Jam lokal (WIB)
  const clock = $('#liveClock');
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false }).replace(/\./g, ':');
  };
  tick(); setInterval(tick, 1000);

  // Back to top
  const up = $('#backToTop');
  window.addEventListener('scroll', () => up.classList.toggle('show', scrollY > 600), { passive: true });
  up.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
})();
