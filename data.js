/* =========================================================
   DATA.JS  -  SEMUA ISI YANG SERING DIUBAH ADA DI SINI
   Edit file ini saja untuk menambah proyek, ganti email, dll.
   Pastikan file ini dimuat SEBELUM script.js (lihat index.html)
   ========================================================= */

const SITE = {
  name: 'Teguh Perwira Putra',
  email: 'teguhperwira.p@gmail.com',
  timezone: 'Asia/Jakarta',         // zona waktu untuk jam di footer

  // Teks berjalan (marquee). Tambah/hapus kata sesuka hati.
  marquee: ['BRANDING', 'MOTION', 'INTERFACE', 'EDITORIAL', 'CREATIVE DEV', 'VIDEO EDITOR'],

  // Tautan sosial di footer. Tambah baris baru untuk platform lain.
  socials: [
    { label: 'LinkedIn',  url: 'https://www.linkedin.com/in/teguhperwiraputra/' },
    { label: 'GitHub',    url: 'https://github.com/teguh-project' },   // cek: ganti ke profil GitHub Anda
    { label: 'Instagram', url: 'https://www.instagram.com/teguh.tghh/' },
  ],
};

/* ---------------------------------------------------------
   PROYEK  -  1 objek = 1 kartu.  PENTING: setiap objek diakhiri
   koma, dan seluruh daftar ditutup dengan  ];  di paling bawah.

   cat    : label kecil di atas judul
   tag    : kategori untuk tombol filter (tulis konsisten, huruf sama)
   title  : judul proyek
   desc   : (opsional) deskripsi singkat
   img    : gambar sampul (taruh di assets/images/)
   slug   : (opsional) jika diisi -> kartu membuka halaman detail project.html
   link   : dipakai jika TIDAK ada slug ('#' kalau belum ada)
   year, role, client, tools[], gallery[], url : (opsional) isi halaman detail
   --------------------------------------------------------- */
const PROJECTS = [
  {
    slug: 'automotive-branding',      // huruf kecil, tanpa spasi, unik
    cat: 'CREATIVE DIRECTION / 2026',
    tag: 'Branding',
    title: 'Automotive Branding & Digital System',
    desc: 'Sistem identitas visual dan antarmuka digital untuk merek otomotif, dari logo sampai panduan motion.',
    img: 'assets/images/project-1.jpg',
    year: '2026',
    role: 'Creative Direction, UI Design',
    client: 'Nama Klien',
    tools: ['Figma', 'After Effects', 'Illustrator'],
    gallery: [
      'assets/images/p1-detail-1.jpg',
      'assets/images/p1-detail-2.jpg',
    ],
    url: 'https://www.instagram.com/teguh.tghh/',   // tombol "VISIT LIVE PROJECT"
  },
  {
    cat: 'MOTION EDITORIAL / 2026',
    tag: 'Motion',
    title: 'Judul Proyek Kedua',
    img: 'assets/images/project-2.jpg',
    link: '#',
  },
  {
    cat: 'INTERFACE DESIGN / 2025',
    tag: 'Interface',
    title: 'Judul Proyek Ketiga',
    img: 'assets/images/project-3.jpg',
    link: '#',
  },
  {
    cat: 'LAYOUT ARCHITECTURE / 2025',
    tag: 'Layout',
    title: 'Judul Proyek Keempat',
    img: 'assets/images/project-4.jpg',
    link: '#',
  },
  {
    cat: 'VIDEO CONTENT SOSIAL MEDIA / 2025',
    tag: 'Video Editor',
    title: 'Judul Proyek Kelima',
    img: 'assets/images/project-5.jpg',
    link: '#',
  },
];
