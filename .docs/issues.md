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

### [ISSUE-006] Galat Koneksi Chatbot AI & Eksploitasi Kredensial Pihak Luar
- **Status:** RESOLVED
- **Tanggal:** 2026-09-29
- **Deskripsi:** Chatbot Si Pertani mengembalikan pesan *"Maaf, terjadi kesalahan koneksi"* dan pada konsol backend terjadi `stream reading error ... An existing connection was forcibly closed by the remote host`.
- **Akar Masalah:**
  1. Klien memanggil model `gemini-3.8-flash` yang sedang mengalami beban tinggi (HTTP 503) di Google Generative Language API.
  2. Header `content-encoding: gzip` dari upstream diteruskan langsung ke klien padahal body `fetch` Node.js sudah terdekompresi, menyebabkan tabrakan format stream zlib (`Z_DATA_ERROR`) dan pemutusan koneksi TCP mendadak.
  3. API key sebelumnya berada di frontend bundle sehingga rentan dieksploitasi pihak luar.
- **Solusi:**
  1. Mengisolasi API key murni di backend (`.env`) dan mengarahkan panggilan frontend ke proksi lokal `/api/v1/ai/chat`.
  2. Menerapkan in-memory sliding rate limiter (maks 30 req/menit per IP) dan validasi ukuran payload.
  3. Mengimplementasikan **Model Fallback Orchestration** (`gemini-flash-lite-latest` -> `gemini-3.5-flash-lite` -> `gemini-3.6-flash` -> `gemini-3.8-flash`) sehingga saat satu model sibuk, server otomatis beralih tanpa menimbulkan galat ke pengguna.
  4. Menggunakan stream piping native Node.js (`Readable.fromWeb(upstream.body).pipe(res)`) tanpa meneruskan header hop-by-hop.

### [ISSUE-007] Template Penolakan Chatbot pada Komoditas yang Belum Terangkum di Frontend
- **Status:** RESOLVED
- **Tanggal:** 2026-09-29
- **Deskripsi:** Saat ditanya mengenai komoditas perkebunan (seperti kopi), bot tidak menyajikan data statistik dan malah mengeluarkan template penolakan generik *"dataset tersebut saat ini belum cukup dalam sistem. Anda dapat merujuk ke Katalog Data Terbuka..."*.
- **Akar Masalah:** Konteks awal yang dikirim frontend hanya memuat rangkuman sebagian sektor (padi, sapi, ikan) tanpa angka statistik perkebunan, dan prompt menginstruksikan bot menolak jika data tidak tertera. Padahal data kopi ada lengkap di database MySQL (`perkebunan_produksi` dan `komoditas_unggulan`).
- **Solusi:**
  1. Membangun **Dynamic Live RAG Engine** pada `src/routes/ai.js` yang secara otomatis mengekstrak kata kunci pesan pengguna dan melakukan query real-time ke MySQL `pertasis` dan CKAN OpenData Banjarnegara.
  2. Menyuntikkan hasil query angka riil ke prompt sistem dan mewajibkan bot menjawab secara langsung, spesifik, dan melarang template penolakan jika data ada di database.

### [ISSUE-008] Data Sintetis Jenis Ikan pada Tabel Komoditas Unggulan & Nilai Ekonomi
- **Status:** RESOLVED
- **Tanggal:** 2026-09-29
- **Deskripsi:** Sistem memunculkan nama-nama spesies ikan sintetis (Ikan Nila, Lele, Mas, Gurame, Koi, Mas Koki, Cupang, Komet) yang tidak bersumber dari data primer dinas.
- **Akar Masalah:** Berkas resmi Distankan KP Banjarnegara hanya mencatat data perikanan berdasarkan metode budidaya (*kolam pembesaran, karamba, minapadi*) dan alat tangkap (*jala tebar, pancing, jaring insang*), tanpa rincian spesies. Spesies ikan tersebut merupakan data tiruan yang sempat diinput ke tabel agregasi.
- **Solusi:**
  1. Menghapus bersih seluruh 10 baris sintetis jenis ikan di tabel `komoditas_unggulan` dan `nilai_ekonomi_tahunan`.
  2. Menyelaraskan endpoint `/api/v1/komoditas-unggulan?sektor=perikanan` dan `/api/v1/ekonomi/nilai-ekonomi?bidang=perikanan` agar mengembalikan status kosong (*empty*) sesuai prinsip *Zero Dummy Data Law*.
  3. Memperbarui instruksi bot AI agar jujur menjelaskan dasar pencatatan resmi perikanan Banjarnegara dan menyajikan data riil volume per kecamatan tanpa mengarang jenis ikan.

---

## 🟡 Isu Terbuka / Rencana Peningkatan (OPEN)

1. **Sinkronisasi Koreksi Anomali Salak 2024 Dinas:** Berkoordinasi dengan admin dinas untuk mengoreksi angka input 2024 pada file mentah CSV dinas di mana baris Kalibening tertulis 80.880 Ton dan Banjarmangu 9.230 Ton.
2. **Monitoring Latensi AI Upstream:** Pemantauan berkala terhadap response time endpoint Google Generative Language API.

*(Saat ini seluruh isu fungsional kritis telah diselesaikan. Sistem siap untuk pengujian operasional dinas dan pengembangan modul lanjutan).*
