/* =========================================================
   PROJECT.JS - membangun halaman detail dari data.js
   URL: project.html?p=<slug>   (slug = field "slug" di PROJECTS)
   ========================================================= */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const root = document.documentElement;
  const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ----- Tema (sama dengan halaman utama) ----- */
  const btn = $('#themeToggle');
  const setTheme = (t) => { root.dataset.theme = t; btn.textContent = t === 'dark' ? 'LIGHT' : 'DARK'; store.set('theme', t); };
  btn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  setTheme(store.get('theme') || 'dark');

  /* ----- Cari proyek berdasarkan ?p=slug ----- */
  const slug = new URLSearchParams(location.search).get('p');
  const list = PROJECTS.filter((p) => p.slug);
  const i = list.findIndex((p) => p.slug === slug);
  const main = $('#project');

  if (i < 0) {
    main.innerHTML = `<section class="project-hero"><span class="label-mono">404</span>
      <h1 class="project-title">Proyek tidak ditemukan</h1>
      <a class="project-cta" href="index.html#work">← KEMBALI KE WORK</a></section>`;
    return;
  }

  const p = list[i];
  const next = list[(i + 1) % list.length];
  document.title = `${p.title} | ${SITE.name}`;

  /* ----- Fakta singkat: hanya field yang diisi yang tampil ----- */
  const facts = [
    ['YEAR', p.year], ['ROLE', p.role], ['CLIENT', p.client],
    ['TOOLS', Array.isArray(p.tools) ? p.tools.join(', ') : p.tools],
  ].filter(([, v]) => v);

  main.innerHTML = `
    <section class="project-hero">
      <span class="label-mono">${esc(p.cat)}</span>
      <h1 class="project-title">${esc(p.title)}</h1>
    </section>
    ${facts.length ? `<div class="project-facts">${facts.map(([k, v]) =>
      `<div><span class="label-mono">${k}</span><p>${esc(v)}</p></div>`).join('')}</div>` : ''}
    <div class="project-cover"><img src="${esc(p.img)}" alt="${esc(p.title)}" onerror="this.remove()"></div>
    ${p.desc ? `<section class="project-body"><p class="about-bold-text in">${esc(p.desc)}</p>
      ${p.url ? `<a class="project-cta" href="${esc(p.url)}" target="_blank" rel="noopener">VISIT LIVE PROJECT ↗</a>` : ''}</section>` : ''}
    ${(p.gallery || []).map((g) => `<div class="gallery-item" data-reveal><img src="${esc(g)}" alt="${esc(p.title)}" loading="lazy" onerror="this.parentNode.remove()"></div>`).join('')}
    <a class="project-next" href="project.html?p=${encodeURIComponent(next.slug)}">
      <span class="label-mono">NEXT PROJECT</span>
      <span class="project-next-title">${esc(next.title)} →</span>
    </a>`;

  /* ----- Reveal galeri saat di-scroll ----- */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
})();
