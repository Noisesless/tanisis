# Pelacakan Isu & Perbaikan SISPERTANI (`issues.md`)

Dokumen ini mencatat daftar isu, kendala teknis, status penyelesaian (*FIFO buffer*), dan mitigasi yang diterapkan.

---

## 🟢 Riwayat Isu Selesai (RESOLVED)

### [ISSUE-001] Galat Akses Kredensial Database Lokal XAMPP
- **Status:** RESOLVED
- **Tanggal:** 2026-09-28
- **Deskripsi:** Backend gagal terhubung ke basis data saat startup lokal (`status code 503` pada `/api/health` dengan pesan `Access denied for user 'pertalit'@'localhost'`).
- **Akar Masalah:** Berkas `.env` awal memuat kredensial produksi server (`pertalit`), sedangkan lingkungan lokal menggunakan XAMPP MariaDB/MySQL dengan user default `root` tanpa kata sandi.
- **Solusi:** Memperbarui parameter `DB_USER=root` dan `DB_PASS=` pada `.env` lokal untuk basis data `pertasis`. Layanan restart normal dan status pool menjadi `{"ok":true,"db":"up"}`.

### [ISSUE-002] Ketiadaan Snapshot Dokumentasi & Mesin AI
- **Status:** RESOLVED
- **Tanggal:** 2026-09-28
- **Deskripsi:** Proyek belum memiliki berkas snapshot `app-context.md` dan dokumentasi arsitektur terstandar di direktori root.
- **Akar Masalah:** Setup repositori awal berfokus pada implementasi backend tanpa bootstrap file dokumentasi Vibes Coding Workflow.
- **Solusi:** Menginisialisasi `app-context.md`, `README.md`, dan blueprint 9 berkas di direktori `.docs/` (`architecture.md`, `api-spec.md`, `database.md`, `routes.md`, `dependency-graph.md`, `deployment.md`, `design-system.md`, `issues.md`, `quality_review.md`).

### [ISSUE-004] Menu Aktif Accordion Kurang Kontras & Redesign Footer Sidebar Login
- **Status:** RESOLVED
- **Tanggal:** 2026-09-28
- **Deskripsi:** Submenu yang sedang aktif di dalam accordion terbuka memiliki kontras warna yang redup dan hampir menyatu dengan warna gelap latar belakang sidebar (`bg-emerald-950/40`), serta area login bawah terkesan kaku dengan garis pembatas mentah dan tombol neon tidak profesional.
- **Akar Masalah:** Kurangnya diferensiasi warna kontras tinggi pada state aktif submenu dan ketiadaan wadah kartu institusional pada area utilitas bawah.
- **Solusi:** 
  1. Mengubah gaya submenu aktif menjadi solid **Emerald-600 (`bg-emerald-600 text-white font-semibold shadow-md`)** disertai titik peluru putih cerah (`w-1.5 h-1.5 bg-white`).
  2. Menambahkan indikator sorotan pada tombol induk accordion yang menaungi submenu aktif (`border border-emerald-500/40 bg-slate-800/90 text-white`).
  3. Mengganti area bawah dengan **Floating Executive Card** (`bg-slate-950/80 border border-slate-800/90 rounded-xl`) berlabel *"Portal Data Dinas — Distankan KP Banjarnegara"*, indikator *"● Basis Data Terhubung"*, dan tombol solid *"Masuk Dasbor Admin"*.

---

### [ISSUE-003] Penyelarasan Submenu Baru Sesuai Feedback Paparan Klien Distankan KP
- **Status:** RESOLVED
- **Tanggal:** 2026-09-28
- **Deskripsi:** Berdasarkan notulensi paparan klien Distankan KP (21 Sep 2026):
  1. Standardisasi submenu baku simetris pada 5 bidang komoditas:
     - Submenu 1: Produksi & Luas Tanam / Populasi
     - Submenu 2: Komoditas Unggulan Bidang (`/komoditas-unggulan/:bidang`)
     - Submenu 3: Nilai Ekonomi (`/nilai-ekonomi/:bidang` & `/economic-value`)
  2. Implementasi data dinamis murni berbasis database `pertasis` / Open Data / input admin Sistertan.
- **Solusi:** Telah diintegrasikan submenu "Komoditas Unggulan" dan "Nilai Ekonomi" di setiap kelompok bidang pada navigasi sidebar, dilengkapi dengan endpoint dinamis `/api/v1/komoditas-unggulan` dan widget terpadu `SectorEconomicWidget`.

### [ISSUE-005] Ketiadaan Submenu Komoditas Unggulan & Nilai Ekonomi di Sidebar Serta Eliminasi Data Dummy
- **Status:** RESOLVED
- **Tanggal:** 2026-09-28
- **Deskripsi:** Submenu komoditas unggulan dan nilai ekonomi tidak muncul di submenu bidang pada navigasi sidebar, serta kebutuhan sistem untuk 100% dinamis tanpa data tiruan (*Zero Dummy Data Law*).
- **Akar Masalah:**
  1. Menu sebelumnya hanya terpasang di Tanaman Pangan dan belum merata ke 4 sektor lainnya.
  2. Ketiadaan endpoint backend `/api/v1/komoditas-unggulan` yang menyebabkan frontend jatuh ke fallback data tiruan statis.
- **Solusi:**
  1. Membangun endpoint `GET /api/v1/komoditas-unggulan` di `src/server.js` yang terhubung langsung ke tabel MySQL `komoditas_unggulan` dengan filter `total_produksi > 0`.
  2. Menambahkan 2 submenu terpisah secara simetris di setiap bidang pada berkas navigasi `dist/assets/site-B5h-x_N5.js`.
  3. Memastikan semua endpoint dan widget menampilkan status *empty* secara jujur saat data belum diunggah, tanpa merekayasa angka atau varietas dummy fiktif.

---

## 🟡 Isu Terbuka / Rencana Peningkatan (OPEN)

*(Saat ini seluruh isu fungsional kritis telah diselesaikan. Sistem siap untuk pengujian operasional dinas dan pengembangan modul lanjutan).*
