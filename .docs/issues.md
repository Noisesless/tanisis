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

### [ISSUE-009] Penumpukan 1.885 Berkas Aset Duplikat di dist/assets & Inkonsistensi View Produksi vs Development (Normalisasi Avatar Header)
- **Status:** RESOLVED
- **Tanggal:** 2026-09-30
- **Deskripsi:** Tampilan aplikasi di lingkungan produksi (`https://pertanian.sistemdata.id`) berbeda total dengan development. Hasil normalisasi header (meringkas navigasi berserakan menjadi Avatar Dropdown interaktif) tidak muncul di produksi karena server produksi masih melayani bundel HTML/JS lama (`index-C7-MA-gB.js` dan `default-PIMY9oy9.js`). Selain itu, folder `dist/assets/` mengalami penumpukan masif sebanyak 1.971 file akibat artefak build Vite usang yang tidak pernah dibersihkan.
- **Akar Masalah:**
  1. Build berulang tanpa opsi pembersihan direktori output (`emptyOutDir: false`) menyebabkan ratusan berkas dengan hash usang tetap tertimbun.
  2. Server produksi belum mengeksekusi `git pull` terbaru dari remote repositori, sehingga masih merujuk ke entry point lawas.
  3. Ketiadaan sanitasi dependensi pohon aset aktif menyebabkan sulitnya membedakan berkas yang benar-benar aktif vs berkas sampah.
- **Solusi:**
  1. Menjalankan penelusuran graf dependensi rekursif (*dependency graph traversal*) mulai dari `dist/index.html` dan `index-CI1XYnwk.js`.
  2. Menghapus secara aman **1.885 berkas duplikat/usang** di `dist/assets/` dan menyisakan **86 berkas aktif murni** (termasuk layout `default-CAKe9ffW.js` dengan Avatar Dropdown).
  3. Memvalidasi bahwa server lokal merespons `200 OK` tanpa berkas 404, lalu melakukan commit dan push ke remote `origin/main` agar siap di-pull di VPS produksi.

### [ISSUE-010] Divergensi Produksi vs Dev, Pembocoran Key AI Eksternal, 2.714 Dead Assets, dan Harmonisasi Dua Arah Tanpa Kolaborator GitHub
- **Status:** RESOLVED
- **Tanggal:** 2026-10-05
- **Deskripsi:** Programmer utama sakit sehingga pembaruan lewat GitHub tertahan approval. Analisis berkas produksi (`pertanian_prod.zip`) mendeteksi perbedaan dua arah: produksi memiliki 3 domain admin baru (KWT, Komoditas Unggulan, LTT-Katam), router `komoditas-unggulan/per-kecamatan`, dan kolom ekspor `hasSumber` yang tidak ada di dev/GitHub. Di sisi lain, produksi tidak memiliki gateway RAG AI, nilai ekonomi sektor ringkasan, serta menimbun 2.714 berkas aset mati (96%), 22 file CSS ganda, 39 folder `_tmp`, dan membocorkan API key eksternal (`sk_live_...`) pada bundel rekomendasi.
- **Akar Masalah:** Pembaruan sebelumnya diunggah manual ke server tanpa commit ke GitHub, sementara build Vite baru ditimpa di atas bundel lama tanpa pembersihan direktori output (`emptyOutDir: false`).
- **Solusi:**
  1. Menjalankan audit hash SHA1 deterministik dua arah untuk memetakan seluruh perbedaan berkas secara faktual.
  2. Menyelaraskan basis data dengan migrasi tabel `kwt_kelompok_wanita_tani` dan `ltt_katam`.
  3. Menggabungkan backend (`src/server.js`, `src/lib/domains.js` 18 domain, `src/lib/excel.js`, dan `src/routes/komoditas-unggulan.js`).
  4. Menyaring tepat 106 berkas bundel aktif dan memangkas 2.714 berkas usang dan 39 folder `_tmp`.
  5. Mem-patch bundel frontend rekomendasi agar memanggil endpoint lokal `/api/v1/ai/chat` (Google Gemini RAG) yang terproteksi.
  6. Mengompilasi paket rilis bersih `deploy_pertanian_clean_20261005.zip` (35.2 MB) dan menyusun panduan rilis mandiri via folder-swap di `README_DEPLOY.md` serta meng-commit ke branch `release/2026-10-05-clean`.

### [ISSUE-011] Redundansi Form Upload Komoditas Unggulan & Refaktorisasi Perikanan Pragmatis (Single Source of Truth / ADR-009)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-05
- **Deskripsi:** 
  1. Komoditas Unggulan sempat dijadikan sheet upload terpisah (`komoditas-unggulan` di 18 domain admin), padahal secara arsitektural komoditas unggulan adalah hasil kalkulasi agregasi otomatis dari data transaksi lapangan (padi, palawija, sayur/buah hortikultura, perkebunan, peternakan, perikanan). Hal ini menimbulkan beban kerja input ganda untuk dinas dan risiko divergensi data (*data drift*).
  2. Data perikanan sempat rancu dan kosong karena format pendataan awal dinas compang-camping dan belum mengakomodasi 10 spesies ikan budidaya definitif, alat tangkap Bubu, placeholder benih, serta varietas ikan hias.
- **Akar Masalah:**
  1. Over-engineering pada arsitektur domain admin yang menduplikasi tabel turunan/agregasi sebagai form upload terpisah.
  2. Ketiadaan skema definitif untuk mencatat 10 spesies ikan budidaya air tawar Banjarnegara (Lele, Nila, Gurami, Bawal, Nilem, Mujair, Mas, Tawes, Patin, Tambakan).
- **Solusi & Aturan Baku (Anti-Over-Engineering Law & ADR-009/010):**
  1. Menghapus sheet upload `komoditas-unggulan` dari `src/lib/domains.js`. Domain admin distandardisasi menjadi **17 domain operasional murni**.
  2. Mengotomatisasi kalkulasi komoditas unggulan perikanan di server-side (`GET /v1/komoditas-unggulan` dan `GET /v1/ekonomi/sektor-ringkasan`) dengan merangking Top-1 (2025: Nila 20.250 Ton; 2024: Lele 17.842 Ton) langsung dari tabel transaksi `ikan_produksi_jenis`.
  3. Membatasi ruang lingkup data perikanan secara pragmatis: hanya wilayah perkecamatan dan rekapitulasi kabupaten (menolak over-engineering ke level kolam/desa mikro yang tidak dimiliki dinas).
  4. Menerapkan toleransi data compang-camping: data yang kosong atau belum diunggah dinas disajikan secara elegan dengan *empty state* jujur ("Menunggu pembaruan data dinas") tanpa memunculkan angka buatan/fiktif.
  5. Menyelaraskan template Excel perikanan (dropdown Bubu, 10 spesies ikan, varietas ikan hias, luas benih Ha) dengan skema MySQL.

### [ISSUE-012] Divergensi Sesi Login Admin & Pembaruan Header Profil Dinamis (Reaktivitas Multi-Tab & Dropdown Logout)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-05
- **Deskripsi:** Status login admin di dasbor admin tidak tersinkronisasi secara reaktif dengan layout publik (`default-CAKe9ffW.js`), sehingga saat admin login, header publik tetap menampilkan 'Guest / Pengunjung'. Selain itu, logout di satu tab tidak membersihkan sesi di tab lain.
- **Akar Masalah:** Penyimpanan token auth hanya berada di memori/satu storage tanpa mekanisme sinkronisasi event broadcast lintas-komponen.
- **Solusi:**
  1. Menerapkan dual-storage sync (`localStorage` dan `sessionStorage`) dengan event dispatcher `sispertani:auth-change`.
  2. Memperbarui `default-CAKe9ffW.js` agar secara reaktif membaca profil admin yang aktif (username, nama bidang, peran, indikator status online, tombol pintas Dasbor Admin, dan tombol Logout instan).
  3. Menyediakan fallback mulus ke avatar Guest Pengunjung ketika sesi berakhir atau pengguna logout.

### [ISSUE-013] Pemisahan Spesies Peternakan & Keswan, Eliminasi Data Campuran, Penegakan Strict Zero-Empty Law, Pembersihan Simbol Mentah Anti-AI-Slop, serta Dasbor Admin Entry & 10-Sheet Template
- **Status:** RESOLVED
- **Tanggal:** 2026-10-05
- **Deskripsi:** Berdasarkan notulensi perbaikan dari klien Distankan KP:
  1. Data populasi dan produksi ternak tercampur sehingga data terkesan rancu.
  2. Data kulit masih menggabungkan 'Sapi/Kerbau' dan 'Kambing/Domba', padahal dinas meminta pemisahan tegas per jenis hewan.
  3. Munculnya data bernilai 0 / kosong yang mengotori tabel antarmuka publik.
  4. Penggunaan emoji mentah (`🐄`, `🥛`, `🌾`, `▲`, `▼`) dan kata buzzword berlebihan yang bertentangan dengan prinsip anti-AI-slop dan standar kedinasan.
  5. Submenu nilai ekonomi masih mencantumkan tab sektor lain (pangan, horti, dll.), yang diminta diubah menjadi 4 tab ekosistem usaha peternakan: Nilai Ekonomi Ternak, UMKM Pakan Ternak, Toko Peternakan / Poultry Shop, dan Unit Usaha Ber-NKV (dengan Zero Dummy Data, hanya placeholder bersih).
  6. Permintaan penambahan komoditas hewani: Susu Kambing, Telur Burung Puyuh, Telur Itik, Daging Kelinci, Domba Batur sebagai rumpun spesifik, serta estimasi ternak dijual hidup dan modul simulasi lahan HPT (Hijauan Pakan Ternak).
  7. Ketiadaan antarmuka dan template bagi dinas untuk meng-entry data yang masih kosong.
- **Akar Masalah:**
  1. Skema lama `ternak_susu_kulit` mencatat komoditas gabungan 'Sapi/Kerbau' dan 'Kambing/Domba'.
  2. Ketiadaan tabel khusus untuk ekosistem peternakan (HPT, UMKM Pakan, Poultry Shop, NKV).
  3. Filter frontend tidak menyaring record bernilai 0.
  4. Domain admin peternakan lama hanya mencakup 6 sheet tanpa kolom pakan, toko, dan NKV.
- **Solusi (ADR-012):**
  1. Memisahkan data kulit di database `pertasis`: memetakan 'Kulit Sapi' (120 baris), 'Kulit Kambing' (120 baris), dan menyinkronkan data pemotongan riil ke 'Kulit Domba' (89 baris riil).
  2. Membuat 4 tabel MySQL baru: `ternak_hpt`, `ternak_umkm_pakan`, `ternak_poultry_shop`, dan `ternak_nkv`.
  3. Memperbarui backend `src/routes/peternakan.js` dengan endpoint: `/susu-kulit`, `/hpt`, `/umkm-pakan`, `/poultry-shop`, `/nkv`, serta endpoint input manual `POST /api/v1/peternakan/entry`.
  4. Mengembangkan template Excel 10 sheet lengkap di `src/lib/domains.js` yang memfasilitasi isian wilayah kecamatan, tahun/bulan, komoditas, jumlah/banyaknya, dan status.
  5. Menegakkan *Strict Zero-Empty Law* di frontend: seluruh record bernilai 0 otomatis tidak ditampilkan di tabel publik.
  6. Menghapus 100% emoji mentah dan simbol segitiga dari seluruh bundel peternakan dan layer peta, menggantinya dengan badge enterprise dan tipografi lugas.
  7. Membangun 4 tab tertata pada rute `/nilai-ekonomi/peternakan` dengan placeholder bersih tanpa data tiruan/fiktif.
  8. Menetapkan Domba Batur secara tunggal dan eksklusif pada Populasi Ekor (sebagai ternak hias dan bibit unggul yang dipasarkan per ekor hidup), menghapusnya dari komoditas daging karkas, menyatukan nama entri tunggal di `POPULASI_MAPS.kecil`, serta menyajikan tabel populasi ekor sentra Dataran Tinggi Dieng di antarmuka Populasi.

### [ISSUE-014] Optimasi Responsivitas Layar Laptop 1366×768, Tombol Sub-Sektor Hortikultura & Isolasi Tab Nilai Ekonomi Bidang
- **Status:** RESOLVED
- **Tanggal:** 2026-10-05
- **Deskripsi:**
  1. Pada halaman `/nilai-ekonomi/hortikultura`, pengguna meminta hanya menampilkan tab Hortikultura saja; pada `/nilai-ekonomi/perkebunan`, hanya menampilkan tab Perkebunan saja.
  2. Pada resolusi layar laptop standar 1366×768 (tinggi viewport efektif ~640px), font dan jarak elemen tampak terlalu besar sehingga saling berhimpitan; tombol Sub-Sektor Hortikultura memaksakan 4 tombol dalam satu baris sempit 240px sehingga tombol "Tanaman Hias" patah menjadi 2 baris dan bertabrakan dengan ikon.
- **Akar Masalah:**
  1. Tab navigasi nilai ekonomi sebelumnya memetakan array global `ge` tanpa penyaringan kondisi bidang aktif.
  2. Root font browser default (16px) dengan padding default Tailwind (`p-6`, `gap-8`) tidak diskalakan untuk batas vertikal/horizontal layar laptop 1366×768.
  3. Tata letak grid tombol Sub-Sektor Hortikultura menggunakan `grid-cols-2 sm:grid-cols-4`, yang pada breakpoint laptop memaksa 4 tombol berjejer dalam kolom kontainer selebar ~240px (lebar efektif tiap tombol hanya ~54px).
- **Solusi (ADR-013):**
  1. Menambahkan filter kondisional pada navigasi tab nilai ekonomi (`o==="hortikultura"?ge.filter(e=>e.key==="hortikultura"):o==="perkebunan"?ge.filter(e=>e.key==="perkebunan"):ge`).
  2. Menerapkan media query responsif laptop-first pada `dist/assets/index-DmHYJUQI.css`:
     - Skala font dasar `html { font-size: 13.5px !important; }` pada `@media (max-width: 1440px)` sehingga seluruh komponen berbasis `rem` proporsional dan tidak berhimpitan.
     - Mengurangi padding kontainer utama `.print-main` menjadi `1rem 1.25rem`.
     - Mengatur padding sel tabel menjadi lebih kompak (`0.45rem 0.65rem`).
  3. Mengubah grid tombol Sub-Sektor Hortikultura menjadi `grid-cols-2 2xl:grid-cols-4 gap-1.5` dengan tombol `py-1.5 px-2 text-[11px] whitespace-nowrap`, sehingga membentuk matriks 2×2 yang rapi, tombol selebar ~115px, dan teks "Tanaman Hias" muat sempurna dalam satu baris.

### [ISSUE-015] Sinkronisasi Dinamis Sub-Sektor Hortikultura & Isolasi Breadcrumb Antar-Sektor
- **Status:** RESOLVED
- **Tanggal:** 2026-10-06
- **Deskripsi:** Widget 3 kartu ringkasan ekonomi sektor di `/horticulture` tidak berubah saat memilih sub-sektor (Sayuran, Buah, Biofarmaka, Tanaman Hias), dan judul breadcrumb menampilkan teks gabungan usang `SEKTOR KOMODITAS / Produksi Sayuran & Buah`.
- **Akar Masalah:** Endpoint `/api/v1/ekonomi/sektor-ringkasan` belum memfilter berdasarkan parameter query `subsektor`, dan header bar `default-CAKe9ffW.js` belum mengisolasi nama sektor murni.
- **Solusi (ADR-014):**
  1. Menambahkan dukungan parameter `subsektor` pada `src/routes/ekonomi.js` untuk memfilter ranking #1 volume panen dan total nilai ekonomi secara reaktif.
  2. Memperbarui `sektor-ringkasan-widget.js` agar memantau tombol sub-sektor yang aktif dan mengirimkan parameter `subsektor` ke API.
  3. Mengisolasi label breadcrumb menjadi `HORTIKULTURA / Produksi Sayuran & Buah` dan `PERKEBUNAN / Produksi Perkebunan` serta membersihkan dead code teks lama.

### [ISSUE-016] Harmonisasi Data Production vs Dev & Pengamanan Berkas SQL Database
- **Status:** RESOLVED
- **Tanggal:** 2026-10-06
- **Deskripsi:** Ditemukan perbedaan antara dump production dan database development lokal (data lahan 2025 dan telur itik ada di prod tapi sempat terlewat di lokal, sedangkan skema 14 tabel baru dan RBAC ada di lokal tapi belum ada di prod). Selain itu, berkas dump `.sql` sempat tersimpan di `dist/` yang diekspos sebagai berkas web publik.
- **Akar Masalah:** Sinkronisasi dua arah belum dilakukan, dan file SQL dump ditempatkan di folder `dist/` yang disajikan oleh `express.static`.
- **Solusi (ADR-015):**
  1. Memindahkan seluruh berkas dump SQL (`dump_production_pertanian.sql`, `dump_production_pertanian_updated.sql`, `production_migration_patch.sql`) ke direktori aman di luar web root: `database/`.
  2. Menambahkan middleware security guard di `src/server.js` untuk memblokir akses publik (403 Forbidden) ke ekstensi sensitif (`.sql`, `.env`, `.bak`, `.sh`, dll).
  3. Mengimpor data unggul production (lahan 2025, 120 baris telur Itik, presisi desimal asli hortikultura) ke database lokal `pertasis`.
  4. Menghasilkan skrip migrasi non-destruktif `database/production_migration_patch.sql` dan dump terpadu `database/dump_production_pertanian_updated.sql` (100% lulus uji di sandbox DB).

### [ISSUE-017] Ketiadaan Filter Dropdown Kecamatan pada Submenu Nilai Ekonomi Hortikultura & Perkebunan
- **Status:** RESOLVED
- **Tanggal:** 2026-10-06
- **Deskripsi:** Pada submenu Nilai Ekonomi Hortikultura (`/nilai-ekonomi/hortikultura`) dan Perkebunan (`/nilai-ekonomi/perkebunan`), dropdown pilihan kecamatan tidak muncul dan hanya menampilkan teks statis cakupan kabupaten (`Kabupaten · data resmi Dinas`), sehingga pengguna tidak dapat melihat rincian nilai ekonomi per kecamatan.
- **Akar Masalah:** Logika UI sebelumnya mendeteksi keberadaan data resmi dinas di `nilai_ekonomi_tahunan` (variabel `P = j != null && j.length > 0`). Karena data dinas ada di tingkat kabupaten, komponen langsung menyembunyikan elemen dropdown `<select>` kecamatan dan memblokir render tabel estimasi komoditas per kecamatan.
- **Solusi (ADR-016):**
  1. Memodifikasi `dist/assets/nilai-ekonomi-uFV4-6ig.js` agar dropdown Kecamatan selalu dirender aktif untuk seluruh 20 kecamatan Banjarnegara (`Banjarmangu` s.d. `Wanayasa`) plus opsi `Semua Kecamatan`.
  2. Menerapkan pengondisian dinamis `isResmi = P && z.length > 0 && A === E`:
     - Jika pengguna memilih `Semua Kecamatan` pada tahun yang memiliki data resmi (2024), aplikasi menampilkan data agregat resmi dinas kabupaten beserta diagram batang peringkat sebaran nilai ekonomi 20 kecamatan di bawahnya.
     - Jika pengguna memilih kecamatan spesifik (misal `Batur`, `Kalibening`, `Banjarmangu`, `Pejawaran`), aplikasi langsung menampilkan kalkulasi estimasi nilai ekonomi komoditas kecamatan tersebut (volume panen BPS Distankan × harga referensi pasar/petani).
  3. Memperluas pemilih tahun (`I`) agar menggabungkan seluruh horizon tahun yang tersedia dari dataset produksi BPS (2017–2024) dan data dinas.

### [ISSUE-018] Ketiadaan Filter Dropdown Kecamatan pada Submenu Nilai Ekonomi & Ekosistem Usaha Peternakan
- **Status:** RESOLVED
- **Tanggal:** 2026-10-06
- **Deskripsi:** Pada submenu Nilai Ekonomi Peternakan & Keswan (`/nilai-ekonomi/peternakan`), filter dropdown kecamatan tidak muncul saat beralih ke subtab 2 (*UMKM Pakan Ternak*), subtab 3 (*Toko Peternakan & Poultry Shop*), atau subtab 4 (*Unit Usaha Ber-NKV*), dan pada subtab 1 (*Nilai Ekonomi Ternak*) selektor kecamatan sempat terkunci (*disabled*) jika dataset awal belum siap.
- **Akar Masalah:**
  1. Blok filter bar (`fe`) sebelumnya dibungkus di dalam percabangan `else` dari `o==='peternakan' && peternakanSubTab !== 'valuasi'`, sehingga saat memilih subtab 2, 3, atau 4, filter bar lenyap total dari layar.
  2. Daftar kecamatan `L` hanya mengandalkan data estimasi async tanpa daftar baku 20 kecamatan, sehingga berisiko `disabled` saat dataset kosong.
  3. Data pelaku usaha di subtab 2, 3, dan 4 belum memiliki efek `fetch` aktif ke API backend dan tabelnya belum menyaring data per kecamatan.
- **Solusi (ADR-017):**
  1. Memindahkan filter bar (`fe`) ke atas seluruh subtab konten sehingga selalu tampak dan aktif di keempat subtab peternakan.
  2. Menginjeksi daftar baku 20 kecamatan resmi Kabupaten Banjarnegara (`KEC_BANJARNEGARA`) ke pembentukan memo `L` sehingga dropdown tidak pernah terkunci/disabled.
  3. Menambahkan `useEffect` untuk memuat data live dari endpoint `/api/v1/peternakan/umkm-pakan`, `/api/v1/peternakan/poultry-shop`, dan `/api/v1/peternakan/nkv`.
  4. Menerapkan penyaringan reaktif tabel ekosistem usaha (`filteredUmkm`, `filteredPoultry`, `filteredNkv`) berdasarkan kecamatan terpilih disertai badge counter unit dan empty state ramah yang dilengkapi tombol pintas `[Lihat Semua]`.

### [ISSUE-019] Tampilan Tab Multi-Sektor di Tanaman Pangan & Diksi Hiperbolis Sumber Data
- **Status:** RESOLVED
- **Tanggal:** 2026-10-06
- **Deskripsi:**
  1. Pada submenu Nilai Ekonomi Tanaman Pangan (`/nilai-ekonomi/pangan`), tab di atas filter bar masih memunculkan seluruh 5 bidang (Pangan, Hortikultura, Perkebunan, Peternakan, Perikanan), padahal pengguna menginginkan isolasi sektor murni (hanya tab Pangan).
  2. Diksi pada badge cakupan dan kartu metrik sumber data menggunakan frasa hiperbolis/buzzword (*"Resmi · Dinas"*, *"data resmi Dinas"*, *"input Dinas"*).
- **Akar Masalah:**
  1. Percabangan filter tab hanya mengecek `hortikultura` dan `perkebunan`, sehingga `pangan` jatuh ke daftar seluruh sektor `ge`.
  2. Label teks sumber data di-hardcode dengan frasa administratif dinas yang kaku dan terkesan hiperbolis.
- **Solusi (ADR-018):**
  1. Mengubah penyaringan tab navigasi menjadi `ge.filter(e => e.key === o)`, sehingga setiap halaman nilai ekonomi hanya menampilkan tab sektor yang sedang dibuka (Pangan hanya Pangan, Hortikultura hanya Hortikultura, Perkebunan hanya Perkebunan).
  2. Membersihkan seluruh teks hiperbolis sesuai kaidah pragmatis:
     - Jika data berasal dari MariaDB: ditulis lugas `Aplikasi SISPERTANI` (pada badge cakupan, kartu Sumber Data, dan tabel rincian).
     - Jika data berasal dari eksternal: secara spesifik menyebutkan nama institusi dan situs web asalnya: `BPS Banjarnegara (banjarnegarakab.bps.go.id)`, `Bappebti (bappebti.go.id)`, atau `Satu Data Banjarnegara (opendata.banjarnegarakab.go.id)`.

---

## 🟡 Isu Terbuka / Rencana Peningkatan (OPEN)

1. **Pengerjaan PR / Revisi Lanjutan dari Klien di DEV:** Menuntaskan daftar revisi dan fitur baru dari klien di lingkungan lokal sebelum merilis ke server produksi.
2. **Sinkronisasi Koreksi Anomali Salak 2024 Dinas:** Berkoordinasi dengan admin dinas untuk mengoreksi angka input 2024 pada file mentah CSV dinas di mana baris Kalibening tertulis 80.880 Ton dan Banjarmangu 9.230 Ton.
3. **Eksekusi Migrasi di Server Produksi (Saat Rilis):** Menjalankan `database/production_migration_patch.sql` di server saat seluruh PR klien telah selesai dan disetujui.

*(Saat ini seluruh sinkronisasi kode, skema basis data, sanitasi aset visual, dan pembaruan dokumentasi telah tuntas 100%).*

