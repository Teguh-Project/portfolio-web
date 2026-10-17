/* =========================================================
   DATA.JS  -  SEMUA ISI YANG SERING DIUBAH ADA DI SINI
   Edit file ini saja untuk menambah proyek, ganti email, dll.
   Pastikan file ini dimuat SEBELUM script.js (lihat index.html)
   ========================================================= */

const SITE = {
  name: 'Teguh Perwira Putra',
  email: 'teguhperwira.p@gmail.com',          // ganti dengan email asli
  timezone: 'Asia/Jakarta',         // zona waktu untuk jam di footer

  // Teks berjalan (marquee). Tambah/hapus kata sesuka hati.
  marquee: ['BRANDING', 'MOTION', 'INTERFACE', 'EDITORIAL', 'CREATIVE DEV','VIDEO EDITOR'],

  // Tautan sosial di footer. Tambah baris baru untuk platform lain.
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/teguhperwiraputra/' },
    { label: 'GitHub',   url: 'https://teguh-project.github.io/portfolio-web/' },
    // { label: 'Instagram', url: 'https://instagram.com/username' },
  ],
};

/* ---------------------------------------------------------
   PROYEK  -  1 objek = 1 kartu.
   cat   : label kecil di atas judul
   tag   : kategori untuk tombol filter (huruf bebas, tulis konsisten)
   title : judul proyek
   img   : path gambar (taruh di assets/images/)
   link  : halaman/URL detail proyek ('#' kalau belum ada)
   --------------------------------------------------------- */
const PROJECTS = [
  {
    cat: 'CREATIVE DIRECTION / 2026',
    tag: 'Branding',
    title: 'Automotive Branding & Digital System',
    img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200',
    link: '#',
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
    tag: 'Branding',
    title: 'Judul Proyek Keempat',
    img: 'assets/images/project-4.jpg',
    link: '#',
  },
{
    cat: 'Video Content Sosial Media / 2025',
    tag: 'Video Editor',
    title: 'Judul Proyek Keempat',
    img: 'assets/images/project-4.jpg',
    link: '#',
  },
];
