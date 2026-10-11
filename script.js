/* =========================================================
   SCRIPT.JS  -  logika interaksi situs.
   Isi konten (proyek, email, sosial) diedit di data.js, bukan di sini.
   Bagian: 1 Helper | 2 Render konten | 3 Tema | 4 Menu |
           5 Kursor | 6 Parallax | 7 Reveal | 8 Jam | 9 Back-to-top
   ========================================================= */
(() => {
  'use strict';

  /* ---------- 1. HELPER ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const root = document.documentElement;
  const safeStore = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  // Cegah karakter berbahaya masuk ke HTML dari data.js
  const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- 7. REVEAL (didefinisikan awal karena dipakai render) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  const observeReveals = () => $$('[data-reveal]:not(.in)').forEach((el) => io.observe(el));

  /* ---------- 2. RENDER KONTEN DARI data.js ---------- */
  const renderMarquee = () => {
    const words = SITE.marquee.join(' ■ ') + ' ■ ';
    // Diduplikasi 2x agar animasi berputar mulus (-50%)
    $('#marqueeTrack').innerHTML = `<span>${esc(words)}</span><span>${esc(words)}</span>`;
  };

  const renderSocials = () => {
    $('#socialLinks').innerHTML = SITE.socials
      .map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('');
  };

  const applyEmail = () => $$('[data-mail]').forEach((a) => { a.href = `mailto:${SITE.email}`; });

  const renderProjects = (tag = 'All') => {
    const list = tag === 'All' ? PROJECTS : PROJECTS.filter((p) => p.tag === tag);
    $('#workGrid').innerHTML = list.map((p) => `
      <a href="${esc(p.link)}" class="project-card" data-reveal>
        <div class="work-img-wrapper"><img src="${esc(p.img)}" alt="${esc(p.title)}" loading="lazy" onerror="this.remove()"></div>
        <div class="project-meta">
          <span class="label-mono">${esc(p.cat)}</span>
          <h3>${esc(p.title)}</h3>
        </div>
      </a>`).join('');
    observeReveals();
  };

  const renderFilters = () => {
    const tags = ['All', ...new Set(PROJECTS.map((p) => p.tag).filter(Boolean))];
    const bar = $('#filterBar');
    if (tags.length <= 2) return;               // 1 kategori saja -> filter disembunyikan
    bar.innerHTML = tags.map((t, i) => `<button class="filter-btn${i ? '' : ' active'}" data-tag="${esc(t)}">${esc(t)}</button>`).join('');
    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      $$('.filter-btn', bar).forEach((b) => b.classList.toggle('active', b === btn));
      renderProjects(btn.dataset.tag);
    });
  };

  /* ---------- 3. TEMA (gelap/terang, tersimpan) ---------- */
  const themeBtn = $('#themeToggle');
  const setTheme = (t) => {
    root.dataset.theme = t;
    themeBtn.textContent = t === 'dark' ? 'LIGHT' : 'DARK';
    safeStore.set('theme', t);
  };
  themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  /* ---------- 4. MENU FULLSCREEN ---------- */
  const overlay = $('#menuOverlay');
  const toggleMenu = (open) => {
    overlay.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  $('#openMenu').addEventListener('click', () => toggleMenu(true));
  $('#closeMenu').addEventListener('click', () => toggleMenu(false));
  $$('a', overlay).forEach((a) => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });

  /* ---------- 5. KURSOR KUSTOM (hanya perangkat dengan mouse) ---------- */
  const initCursor = () => {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const cursor = $('.custom-cursor');
    const EASE = 0.2;                           // 0-1: makin kecil makin "licin"
    let mx = 0, my = 0, cx = 0, cy = 0;
    addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    (function loop() {
      cx += (mx - cx) * EASE; cy += (my - cy) * EASE;
      cursor.style.transform = `translate(${cx}px,${cy}px)`;
      requestAnimationFrame(loop);
    })();
    // Event delegation: tetap jalan walau kartu dirender ulang
    const grid = $('#workGrid');
    grid.addEventListener('mouseover', (e) => { if (e.target.closest('.project-card')) cursor.classList.add('is-view'); });
    grid.addEventListener('mouseout',  (e) => { if (e.target.closest('.project-card')) cursor.classList.remove('is-view'); });
  };

  /* ---------- 6. PARALLAX GIF HERO ---------- */
  const initParallax = () => {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const gif = $('.hero-gif-media');
    const STRENGTH = 16;                        // px pergeseran maksimum
    addEventListener('mousemove', (e) => {
      const x = (e.clientX / innerWidth - 0.5) * STRENGTH;
      const y = (e.clientY / innerHeight - 0.5) * STRENGTH;
      gif.style.transform = `scale(1.06) translate(${x}px,${y}px)`;
    });
  };

  /* ---------- 8. JAM LOKAL ---------- */
  const initClock = () => {
    const el = $('#liveClock');
    const tick = () => {
      el.textContent = new Date()
        .toLocaleTimeString('id-ID', { timeZone: SITE.timezone, hour12: false })
        .replace(/\./g, ':');
    };
    tick(); setInterval(tick, 1000);
  };

  /* ---------- 9. BACK TO TOP ---------- */
  const initBackToTop = () => {
    const btn = $('#backToTop');
    const SHOW_AFTER = 600;                     // px scroll sebelum tombol muncul
    addEventListener('scroll', () => btn.classList.toggle('show', scrollY > SHOW_AFTER), { passive: true });
    btn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  };

  /* ---------- INIT ---------- */
  setTheme(safeStore.get('theme') || 'dark');
  renderMarquee();
  renderSocials();
  applyEmail();
  renderFilters();
  renderProjects();
  observeReveals();
  initCursor();
  initParallax();
  initClock();
  initBackToTop();
})();
