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
  1. Menghapus sheet upload `komoditas-unggulan` dari `src/lib/domains.js`. Domain admin distandardisasi menjadi **16 domain operasional murni**.
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

### [ISSUE-020] Redesign View Dasbor Admin (/admin), Autentikasi Role-Aware & Integrasi Kelembagaan Baru
- **Status:** RESOLVED
- **Tanggal:** 2026-10-06
- **Deskripsi:** Pengguna mengalami kendala login saat memasukkan kredensial admin karena kebingungan nama pengguna (username) dan potensi terkunci proteksi brute-force in-memory. Selain itu, tata letak dasbor admin membutuhkan pembaruan agar konsisten antar peran (RBAC), memfasilitasi seluruh 20 domain termasuk kelembagaan baru (JULEHA, P4S, UPJA, KWT, Kelembagaan Pertanian & Perikanan), serta bebas dari gaya bahasa hiperbolis/buzzword.
- **Akar Masalah:**
  1. Form login tidak menyajikan indikator peran yang jelas sehingga rawan salah ketik username.
  2. Tata letak untuk peran bidang teknis sebelumnya hanya menampilkan banner alert pembatasan sempit, dan panel ringkasan bantuan bolong.
  3. 5 domain baru belum terdaftar di peta ikon visual admin dan belum dipetakan ke wewenang RBAC bidang teknis di `src/lib/users.js`.
- **Solusi:**
  1. Mengimplementasikan **Quick Role Selector** pada form login `/admin` (Administrator, Tanaman Pangan, Horti & Kebun, Peternakan, Perikanan) yang otomatis mengisi username dan memberikan petunjuk akun yang benar.
  2. Merombak layout dasbor admin menjadi **Role-Aware Architecture**:
     - Super Admin mendapatkan **Tab Kategori & Live Search** untuk memfilter 20 domain data secara instan.
     - Akun Bidang Teknis mendapatkan header elegan **Ruang Kerja Bidang** dan panduan alur kerja 3 langkah impor tanpa alert sempit.
  3. Melengkapi pemetaan tema warna dan ikon resmi untuk seluruh 20 domain data di `dist/assets/admin-C9Dakcgq.js`.
  4. Memperbarui wewenang RBAC di `src/lib/users.js` sehingga akun Tanaman Pangan, Peternakan, dan Perikanan otomatis berhak mengelola domain kelembagaannya.

### [ISSUE-021] Blank Map Rendering pada Halaman WebGIS /sebaran/ dan Profil /kecamatan/
- **Status:** RESOLVED
- **Tanggal:** 2026-10-07
- **Deskripsi:** Peta interaktif pada rute `/sebaran/` dan `/kecamatan/` tampil kosong (blank canvas) tanpa poligon kecamatan maupun raster basemap.
- **Akar Masalah:**
  1. MapLibre GL membutuhkan berkas Web Worker `maplibre-gl-worker.mjs` di direktori aset publik saat berjalan di browser, yang sebelumnya belum tersedia di root `./dist`.
  2. Rute `/sebaran` dan `/sebaran/` belum dinormalisasi otomatis ke subrute WebGIS utama `/sebaran/pangan`.
- **Solusi (ADR-024):**
  1. Memasang `maplibre-gl-worker.mjs` dan `maplibre-gl-shared.mjs` di direktori `./dist`.
  2. Menambahkan redirect normalisasi di `src/server.js` untuk mengarahkan `/sebaran/` ke `/sebaran/pangan` dan `/kecamatan/` ke `/kecamatan`.
  3. Memperbaiki inisialisasi worker URL pada komponen peta `kecamatan-DQw1gkYq.js` sehingga peta spasial 20 kecamatan interaktif berfungsi sempurna.

### [ISSUE-022] Pemisahan 3 Submenu Kelembagaan Tani di Navbar & Eliminasi Switcher 3-Tombol
- **Status:** RESOLVED
- **Tanggal:** 2026-10-07
- **Deskripsi:** Tampilan kelembagaan menampilkan switcher 3-tombol horizontal yang membingungkan dan tidak terpisah per kebutuhan di navigasi navbar.
- **Akar Masalah:** Navigasi sidebar hanya memiliki satu link direktori generik `/farmers`, sehingga pengguna harus berpindah klaster secara manual di dalam badan halaman.
- **Solusi (ADR-025):**
  1. Memisahkan 3 sub-item di navigasi sidebar (`dist/assets/site-B5h-x_N5.js`):
     - `Tani, Gapoktan & KWT` (`/farmers?klaster=tani`)
     - `Ekonomi & Penyuluhan` (`/farmers?klaster=ekonomi`)
     - `Sektoral & Pendukung` (`/farmers?klaster=sektoral`)
  2. Menghapus switcher 3-tombol pada tampilan halaman view (`dist/assets/farmers-RBAkXoyn.js`), sehingga view langsung terisolasi sesuai klaster yang dipilih di navigasi.

### [ISSUE-023] Inkonsistensi Layout, Lebar Layar & Geometri Halaman /renstra & /recommendations
- **Status:** RESOLVED
- **Tanggal:** 2026-10-07
- **Deskripsi:** Halaman `/renstra` dan `/recommendations` memiliki tata letak sempit (`max-w-5xl mx-auto`), sudut kotak tanpa rounded yang tidak seragam, warna latar pastel pekat, dan pemisahan kontainer tabel yang tidak rapi.
- **Akar Masalah:** Kode halaman membawa legacy styling terisolasi yang belum diselaraskan dengan standar token `design-system.md`.
- **Solusi (ADR-026):**
  1. Menghapus batas sempit `max-w-5xl mx-auto` sehingga halaman memanfaatkan lebar penuh kontainer aplikasi secara elegan.
  2. Menerapkan token `--radius-md: 8px` (`rounded-lg`) pada seluruh kartu metrik, callout, panel, dan tabel.
  3. Mengganti styling kartu metrik menjadi kartu putih bergaris sisi kiri (`border-l-4 border-l-blue-800`, `border-l-amber-600`, `border-l-teal-700`) dan tipografi Executive Agritech yang jernih.

### [ISSUE-024] Eliminasi Tag Eyebrow dan Pulsing Dot (AI Slop) pada Header Halaman
- **Status:** RESOLVED
- **Tanggal:** 2026-10-07
- **Deskripsi:** Ditemukan elemen capsule/eyebrow huruf kapital dengan titik hijau berkedip (`● PERENCANAAN & EVALUASI KINERJA DAERAH`, `● KEBIJAKAN & ANALITIKA PERTANIAN`, `● BIDANG SEKTORAL & LEMBAGA PENDUKUNG`) di atas heading judul pada halaman `/renstra`, `/recommendations`, dan `/farmers`. Elemen ini dinilai tidak konsisten dan bertentangan dengan kaidah desain profesional (melanggar Anti-AI-Slop Law).
- **Akar Masalah:** Komponen header membawa elemen visual generic AI template yang tidak ada pada halaman standar lainnya.
- **Solusi (ADR-027):**
  1. Menghapus total tag eyebrow dan animasi pulsing dot di atas judul `<h1>` pada ketiga halaman.
  2. Menempatkan `<h1>` langsung di posisi teratas header kolom, menciptakan hierarki visual yang tenang, resmi, dan konsisten di seluruh aplikasi.

### [ISSUE-025] Redesign Halaman Login Admin Portal SISPERTANI (/admin) Anti-AI-Slop & Citra Pertanian Sawah
- **Status:** RESOLVED
- **Tanggal:** 2026-10-08
- **Deskripsi:** Tampilan formulir login `/admin` sebelumnya terkesan kaku, membawa teks deskripsi dan buzzword berlebihan, proporsi kartu kurang seimbang antara panel visual dan panel input, serta latar belakang visual tidak mencerminkan identitas persawahan Banjarnegara.
- **Akar Masalah:** Komponen login membawa template bawaan yang belum menerapkan prinsip tata letak asimetris UUPM dan Taste-Skill, serta menggunakan citra latar gandum generik.
- **Solusi (ADR-028):**
  1. Menerapkan tata letak split 2 kolom asimetris: sisi kiri lebih dominan (~55%) dengan citra fotografi persawahan Banjarnegara (`dist/img/sawah-login.jpg`), logo resmi Pemkab, identitas institusional Distankan KP, dan kartu informasi kredensial yang elegan.
  2. Merancang form login sisi kanan (~45%) yang ringkas, bersih, dan berwibawa: Quick Role selector (Administrator, Tanaman Pangan, Hortikultura & Perkebunan, Peternakan, Perikanan), toggle visibilitas kata sandi, dan enkripsi status koneksi aman.
  3. Mengeliminasi seluruh teks hiperbolis/buzzword sesuai kaidah Anti-AI-Slop Law dan memastikan tampilan sepenuhnya responsif pada laptop 1366×768 maupun layar smartphone.

### [ISSUE-026] Halaman Profil Kecamatan (/kecamatan) Mengalami Blank Page Akibat Infinite Client-Side Redirect Loop
- **Status:** RESOLVED
- **Tanggal:** 2026-10-08
- **Deskripsi:** Membuka URL `http://localhost:5173/kecamatan` menghasilkan tampilan layar kosong putih (*blank page* total), di mana container `#root` tidak merender elemen DOM apapun (0 byte).
- **Akar Masalah:** Pada file bundel `dist/assets/index-CI1XYnwk.js`, terdaftar rute `<Route path="/kecamatan/" element={<Navigate to="/kecamatan" replace />} />` persis sebelum `<Route path="/kecamatan" element={<KecamatanPage />} />`. Dalam algoritma scoring React Router v6, rute dengan trailing slash (`/kecamatan/`) memperoleh skor lebih tinggi (15) dibanding tanpa trailing slash (13) dan dievaluasi lebih awal menggunakan regex identik `/^\/kecamatan\/*$/i`. Akibatnya, setiap kali browser membuka `/kecamatan`, rute `/kecamatan/` terpicu dan mengeksekusi `<Navigate to="/kecamatan" replace={true} />`, menghasilkan infinite loop pada dirinya sendiri sehingga komponen halaman kecamatan tidak pernah termuat.
- **Solusi (ADR-029):**
### [ISSUE-027] Galat createElement('') Akibat Variable Shadowing Icon & State Form Login Pada Dasbor Bidang Teknis (/admin)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-08
- **Deskripsi:** Pengguna mendapati galat `[ErrorBoundary] Failed to execute 'createElement' on 'Document': The tag name provided ('') is not a valid name.` saat login menggunakan akun peran teknis non-admin (`tanaman-pangan`, `horti-perkebunan`, `peternakan`, `perikanan`).
- **Akar Masalah:** Di fungsi komponen `V()` pada `dist/assets/admin-C9Dakcgq.js` dan `scripts/build_admin_view.js`, variabel `f` di-import sebagai icon `users` dari modul luar, namun di-shadow oleh state form login `let [f, p] = useState('')` (penampung nilai awal password berupa string kosong `""`). Selain itu variabel `d` (icon clipboard) di-shadow oleh setter username `setLoginUser`. Saat akun bidang teknis login, banner ruang kerja mengeksekusi `(0, P.jsx)(f, { className: 'h-6 w-6' })` yang memanggil `(0, P.jsx)("", ...)`. React mengeksekusi `document.createElement('')` yang memicu browser melempar `InvalidCharacterError`.
- **Solusi (ADR-030):**
  1. Me-refactor seluruh deklarasi variabel state di `admin-C9Dakcgq.js` dan `build_admin_view.js` menjadi nama deskriptif (`token`, `sessionUser`, `isAdmin`, `loginUser`, `loginPass`, `loginErr`, `domsData`, `healthData`, `bantuanData`, `syncData`, `paketData`, `busyAction`, `actionErr`, `importResult`).
  2. Mengeliminasi bentrok identifier lama (`f`, `d`, `c`, `K_sync`, `J_busy`) dan memverifikasi kelima peran (`admin` dan 4 bidang) berhasil me-render dasbor tanpa galat (Errors: 0).

### [ISSUE-028] Keruntuhan Layout Asimetris Login & Form Merenggang Akibat Uncompiled Arbitrary CSS Classes
- **Status:** RESOLVED
- **Tanggal:** 2026-10-08
- **Deskripsi:** Pada jendela peramban atau layar dengan lebar di bawah 1024px (termasuk jendela pengguna pada resolusi ~948px), panel visual kiri (latar foto sawah) hilang total, formulir input merenggang 100% ke tepi layar tanpa batas kartu, dan logo mobile muncul ganda.
- **Akar Masalah:**
  1. Breakpoint panel visual sebelumnya disetel kaku pada `@media (min-width: 1024px)`, sehingga jendela berukuran 948px otomatis menyembunyikan panel foto sawah (`display: none`).
  2. Form login mengandalkan arbitrary class Tailwind `max-w-[340px]` dan `lg:hidden` yang tidak ada di berkas CSS pre-built `dist/assets/index-DmHYJUQI.css`. Karena kelas tersebut tidak dievaluasi oleh engine CSS, wadah formulir jatuh ke `width: 100%` tanpa batas maksimal.
- **Solusi (ADR-030):**
  1. Memindahkan dan mendefinisikan aturan CSS baku di `dist/assets/index-DmHYJUQI.css` tanpa ketergantungan pada arbitrary classes.
  2. Menurunkan breakpoint panel visual kiri ke `≥ 768px` (50:50 pada mode jendela 948px / tablet, 60:40 pada desktop 1366px+) dengan gambar persawahan Banjarnegara dan gradien gelap resmi.
  3. Membungkus formulir dalam kelas CSS `.sispertani-form-card` (`max-width: 380px`), menyembunyikan header mobile pada `≥ 768px`, dan menyematkan cache buster `?v=2` pada referensi CSS di `dist/index.html`. Pengujian visual headless Edge mengonfirmasi tata letak kini simetris, berwibawa, dan responsif.

### [ISSUE-029] Galat Impor Skema Basis Data di Server Produksi (DEFINER 1227, Datetime JS 1292, Generated Column 1906)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-08
- **Deskripsi:** Saat administrator mengeksekusi `database/production_migration_patch.sql` di terminal SSH server produksi menggunakan akun standar database (`pertalit`), muncul 3 kendala beruntun yang menghentikan proses eksekusi:
  1. `ERROR 1227 (42000): Access denied; you need (at least one of) the SET USER privilege(s) for this operation` pada pembuatan VIEW `log_aktivitas`.
  2. `ERROR 1292 (22007): Incorrect datetime value 'Wed Sep 23 2026 12:25:25 GMT+0700...' for column created_at`.
  3. `ERROR 1906 (HY000): The value specified for generated column 'nilai_rp' in table 'nilai_ekonomi_tahunan' has been ignored`.
- **Akar Masalah:**
  1. DDL `CREATE VIEW log_aktivitas` membawa klausa `DEFINER=\`root\`@\`localhost\``. Pengguna non-root MySQL/MariaDB (`pertalit`) tidak memiliki wewenang `SUPER` / `SET_USER_ID`.
  2. Data awal hasil dump skrip Node memuat representasi string JavaScript `Date().toString()` pada kolom `created_at` sebanyak 653 baris alih-alih standar SQL `YYYY-MM-DD HH:MM:SS`.
  3. Kolom `nilai_rp` pada tabel `nilai_ekonomi_tahunan` didefinisikan sebagai `GENERATED ALWAYS AS (volume * harga_produsen) STORED`. Pada mode strict MariaDB, penyisipan nilai eksplisit manual selain `DEFAULT` ditolak.
- **Solusi (ADR-031):**
  1. Menghapus klausa `DEFINER=\`root\`@\`localhost\` SQL SECURITY DEFINER` pada patch dan dump, menggantikannya dengan `CREATE OR REPLACE VIEW \`log_aktivitas\` AS select...` yang portabel.
  2. Menjalankan konversi otomatis seluruh 653 format tanggal ke standar SQL datetime `YYYY-MM-DD HH:MM:SS`.
  3. Mengeluarkan kolom `nilai_rp` dari klausul `INSERT INTO nilai_ekonomi_tahunan` (sehingga dihitung otomatis oleh MariaDB) dan menambahkan konfigurasi proteksi `SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO'`.
  4. Eksekusi ulang di terminal server SSH terkonfirmasi berhasil 100% tanpa galat dan status endpoint `/api/health` mengembalikan `{"ok":true,"db":"up"}`.

### [ISSUE-030] Chatbot Si Pertani Mengalami 'Kesalahan Koneksi' Akibat Placeholder GEMINI_API_KEY & Kolom RAG Mismatch
- **Status:** RESOLVED
- **Tanggal:** 2026-10-08
- **Deskripsi:** Pengguna mendapati pesan *"Maaf, terjadi kesalahan koneksi. Pastikan jaringan internet tersedia dan coba lagi. Jika masalah berlanjut, hubungi administrator sistem."* saat mengirimkan pertanyaan pada chatbot "Si Pertani" di halaman rekomendasi (`/recommendations`).
- **Akar Masalah:**
  1. Parameter `GEMINI_API_KEY` pada file `.env` awalnya bernilai placeholder dummy (`AIzaSyYourGeminiApiKeyHere`, panjang 26 karakter). Google Generative Language mengembalikan penolakan `HTTP 400: Please pass a valid API key (INVALID_ARGUMENT)`.
  2. Frontend menangani segala HTTP status non-OK (400, 500, 503) dengan melempar exception generik ke blok `catch` dan menampilkan teks *"kesalahan koneksi"*.
  3. Query live RAG pada `src/routes/ai.js` dan `src/lib/komoditas-dinamis.js` memanggil kolom yang tidak ada (`kecamatan_sentra`, `total_produksi`, `satuan` pada `horti_produksi`), memicu database warning `ER_BAD_FIELD_ERROR 1054`.
  4. Ketiadaan mode fallback lokal jika upstream Google AI mengalami throttling atau offline.
- **Solusi (ADR-033):**
  1. Memasang API Key resmi Google Gemini yang valid pada file konfigurasi `.env`.
  2. Menyelaraskan query tabel `komoditas_unggulan` (`kecamatan`, `produksi`, `nilai_ekonomi`) dan tabel `horti_produksi` (`COALESCE(produksi_ton, nilai) AS nilai`) pada `src/routes/ai.js` dan `src/lib/komoditas-dinamis.js`.
  3. Memperbarui daftar model resmi Google Gemini (`gemini-flash-lite-latest`, `gemini-3.5-flash-lite`, `gemini-flash-latest`, `gemini-3.5-flash`).
  4. Mengimplementasikan fitur **Smart Local/Offline RAG Streaming Fallback**: Jika koneksi upstream ke Google API mengalami beban tinggi atau terputus, backend secara otomatis merangkum data riil dari basis data MySQL `pertasis` dan mengalirkannya via SSE stream langsung ke antarmuka chatbot.
### [ISSUE-031] Ketiadaan Kunci GEMINI_API_KEY pada .env Produksi & Resolusi Zero-Downtime Fallback AI Gateway
- **Status:** RESOLVED
- **Tanggal:** 2026-10-09
- **Deskripsi:** Chatbot Si Pertani di server produksi (`pertanian.sistemdata.id`) memunculkan pesan *"Maaf, terjadi kesalahan koneksi. Pastikan jaringan internet tersedia dan coba lagi. Jika masalah berlanjut, hubungi administrator sistem."* saat merespons pertanyaan rekomendasi dan komoditas unggulan.
- **Akar Masalah:**
  1. Berkas `.env` di server produksi tidak memiliki baris konfigurasi `GEMINI_API_KEY` (karena `.env` diabaikan oleh `.gitignore` demi keamanan), sehingga pemanggilan ke `/api/v1/ai/chat` mengembalikan galat HTTP 500 (`config_error: GEMINI_API_KEY belum dikonfigurasi di server`).
  2. Frontend menangkap status HTTP 500 dan menampilkan pesan kegagalan koneksi generik.
- **Solusi (ADR-036):**
  1. Pengguna memasukkan `GEMINI_API_KEY` ke dalam file `.env` di server produksi dan me-restart proses PM2.
  2. Memperbaiki logika backend di `src/routes/ai.js` agar memvalidasi payload dan mengekstrak konteks live RAG database sebelum memeriksa API key.
  3. Mengimplementasikan **Zero-Downtime Resilience Fallback**: Jika `GEMINI_API_KEY` tidak terpasang atau upstream gagal, server tidak lagi mengembalikan status HTTP 500, melainkan secara anggun mengalirkan jawaban faktual langsung dari MariaDB `pertasis` via SSE (HTTP 200) dengan catatan transparan, mencegah tampilan error di antarmuka pengguna.

### [ISSUE-032] Normalisasi Relasional Kecamatan-Desa-FSVA & Eliminasi fsva_indikator_kabupaten
- **Status:** RESOLVED
- **Tanggal:** 2026-10-09
- **Deskripsi:** Tabel `fsva_indikator_kabupaten` hanya artefak agregat 12 baris dengan nilai kosong yang membingungkan klien, sementara data 278 desa di `fsva_desa_indikator` belum memiliki foreign key `kecamatan_id` dan `desa_id`.
- **Akar Masalah:** Skema awal belum menerapkan normalisasi relasional tingkat desa secara ketat.
- **Solusi (ADR-039):**
  1. Mengeksekusi drop tabel `fsva_indikator_kabupaten`.
  2. Menambahkan kolom `kode` BPS pada tabel `kecamatan` (20 kecamatan) dan `desa` (278 desa), serta kolom `tipe` pada `desa`.
  3. Menambahkan kolom `kecamatan_id` dan `desa_id` berstatus `NOT NULL` serta constraint foreign key cascade pada `fsva_desa_indikator`.
  4. Menyelaraskan seluruh 278 desa via mapping fonetik dan kode BPS resmi.

### [ISSUE-033] Paginasi Log Dasbor Admin, Pencatatan Log Aktivitas Pengguna & Auto-Resolve Relasi Impor Excel
- **Status:** RESOLVED
- **Tanggal:** 2026-10-09
- **Deskripsi:** Halaman `/admin` mengalami potensi beban rendering berat jika data sync_log menumpuk, aktivitas login/logout belum tercatat di database, kolom "Aksi Administrasi" pada tabel readiness matrix perlu diganti menjadi tahun data terakhir, dan proses impor Excel sempat menolak baris jika `desa_id` diwajibkan sebagai input manual.
- **Akar Masalah:** Ketiadaan endpoint terdedikasi `POST /api/v1/admin/logout`, handler login in-memory tanpa query INSERT `activity_logs`, ketiadaan paginasi server-side, dan template Excel membaca skema kolom `desa_id` secara mentah.
- **Solusi (ADR-040 & ADR-041):**
  1. Membangun endpoint `GET /api/v1/admin/activity-log` dan menambahkan paginasi `?page=N&limit=N` pada `sync-log` serta `activity-log`.
  2. Mengimplementasikan dual-tab log riwayat pembaruan & log aktivitas pengguna dengan tombol navigasi paginasi.
  3. Mencatat aksi `LOGIN`, `LOGOUT`, `IMPORT`, dan `EXPORT` secara persisten ke tabel `activity_logs`.
  4. Menambahkan auto-resolver pada `src/lib/excel.js` untuk memetakan `kode_desa`/`nama_desa` ke `desa_id` secara otomatis dan mengecualikan `desa_id` dari kolom template input manual (`SKIP_COLS`).
  5. Mengganti kolom "Aksi Administrasi" dengan "Tahun Data Terakhir" yang dihitung dinamis dari kolom tahun/tanggal tabel, serta menjadikan default readiness matrix berstatus collapse.

---

### [ISSUE-034] Matriks Kesiapan Data Sektoral & Pembaruan UI Dasbor Belum Muncul di Produksi (/admin)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-10
- **Komponen:** Antarmuka Web `/admin`, Bundel Vite SPA (`dist/assets/admin-C9Dakcgq.js`), Caching Aset HTTP Nginx & Browser.
- **Deskripsi:** 
  Meskipun pengguna telah berhasil login sebagai Administrator utama (`user: admin`, hak akses Super Administrator), halaman `/admin` di server produksi (`https://pertanian.sistemdata.id/admin`) sempat menampilkan layout antarmuka lama pada tab peramban biasa. Komponen baru **Audit Kesiapan Data Sektoral (Readiness Matrix)**, dual-tab log riwayat pembaruan & log aktivitas pengguna, serta kolom dinamis **Tahun Data Terakhir** belum termuat di peramban reguler klien.
- **Akar Masalah:**
  1. Berkas di server produksi (`dist/assets/admin-C9Dakcgq.js`) dan API backend `/v1/admin/readiness` sudah mutakhir dan berstatus 200 OK (23 domain, 78% kesiapan publik).
  2. Tab reguler peramban klien menahan salinan lama pada *HTTP Disk Cache* lokal karena sebelumnya telah mengakses halaman sebelum rilis terbaru.
- **Solusi & Verifikasi:**
  1. Melakukan verifikasi langsung pada mode Incognito / Hard Reload (`Ctrl + Shift + R`), terkonfirmasi komponen **Audit Kesiapan Data Sektoral (Readiness Matrix)**, 4 kartu metrik KPI kesiapan, dan dual-tab log aktivitas muncul dengan sempurna tanpa galat runtime.
  2. Memastikan konfigurasi server Express tetap menyajikan `Cache-Control: no-cache, no-store, must-revalidate` pada seluruh file dist statis untuk menjamin siklus pembaruan bersih di masa mendatang.

---

### [ISSUE-035] Minified React Error #321 & Galat DOM removeChild Akibat Duplikasi Modul React dari Query Parameter
- **Status:** RESOLVED
- **Tanggal:** 2026-10-10
- **Komponen:** `dist/index.html`, `dist/assets/index-CI1XYnwk.js`, `src/server.js`, React Runtime Reconciler.
- **Deskripsi:** 
  Halaman web (termasuk `/sebaran/:bidang` dan seluruh halaman SPA) mengalami *crash* global yang ditangkap oleh ErrorBoundary dengan pesan: `Minified React error #321` dan `Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node`.
- **Akar Masalah:**
  1. Percobaan cache-busting menggunakan query parameter pada entry point script (`<script src="/assets/index-CI1XYnwk.js?v=...">`) menyebabkan browser memuat berkas inti tersebut sebagai instance terpisah dari modul turunan yang mengimpor `./index-CI1XYnwk.js` secara relatif tanpa query parameter.
  2. Adanya dua salinan React di memori browser melanggar aturan Hooks dan memicu *React Error #321 (Multiple copies of React)* saat komponen memanggil `useContext`/`useState`.
  3. Intervensi fitur Chrome Auto-Translate yang memodifikasi node teks DOM menjadi elemen `<font>` memperparah proses unmounting React dan memicu pengecualian `removeChild`.
- **Solusi & Verifikasi:**
  1. Mengembalikan entry point `dist/index.html` ke nama modul kanonikal tanpa query string.
  2. Menambahkan middleware normalisasi di `src/server.js` yang secara otomatis mengalihkan (HTTP 302) permintaan aset JS ber-query string ke path kanonikal bersih.
  3. Menambahkan atribut `class="notranslate" translate="no"` dan `<meta name="google" content="notranslate" />` pada `dist/index.html` untuk memproteksi pohon DOM dari mutasi eksternal penerjemah browser.
  4. Pengujian verifikasi lokal mengonfirmasi pengalihan 302 berhasil dan seluruh halaman SPA berjalan stabil tanpa galat.

---

### [ISSUE-036] SyntaxError: The requested module './BarChart-CCPNsfhB.js' does not provide an export named 'Ne' pada /suitability
- **Status:** RESOLVED
- **Tanggal:** 2026-10-12
- **Komponen:** `dist/assets/suitability-BoKTpxZD.js`, `dist/assets/BarChart-CCPNsfhB.js`, Recharts ESM Bundling.
- **Deskripsi:** 
  Pemuatan halaman `/suitability` terhenti dan menampilkan pesan error boundary:
  `SyntaxError: The requested module './BarChart-CCPNsfhB.js' does not provide an export named 'Ne' (at suitability-BoKTpxZD.js:6:3)`.
- **Akar Masalah:**
  1. Berkas minified chunk `BarChart-CCPNsfhB.js` tidak mengekspor nama `Ne`. Komponen `Bar` diekspor sebagai alias minified `f` (`f as Ne` pada chunk referensi).
  2. Komponen radar Recharts (`RadarChart`, `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis`, `Radar`) awalnya dikompilasi langsung di preamble chunk `suitability-BoKTpxZD.js` dan tidak diekspor oleh `BarChart-CCPNsfhB.js`.
  3. Saat penulisan ulang antarmuka, terjadi asumsi bahwa komponen radar dan nama-nama alias diimpor langsung dari `BarChart-CCPNsfhB.js`.
- **Solusi & Verifikasi:**
  1. Membuat skrip build deterministik [`scripts/build_suitability_view.js`](file:///e:/Project/pertanian_main/scripts/build_suitability_view.js) yang memadukan preamble radar charts dan memetakan bridge alias ke ekspor sah (`f as Ne` untuk Bar, `t as it` untuk BarChart, `in as Re` untuk ResponsiveContainer, dll).
  2. Membuat skrip [`scripts/verify_imports.js`](file:///e:/Project/pertanian_main/scripts/verify_imports.js) untuk memvalidasi 100% impor terhadap tabel ekspor ESM seluruh 7 berkas chunk target.
  3. Menguji via HTTP curl dan peramban: berkas mengembalikan HTTP 200 OK dan antarmuka `/suitability` berjalan normal menampilkan 4 tab sektor, 4 KPI cards, radar chart, bar chart, dan matriks kesesuaian.

---

### [ISSUE-037] SyntaxError Unexpected Token & Eliminasi Total Pembungkus Card AI-Slop pada Gambar Domain Header
- **Status:** RESOLVED
- **Tanggal:** 2026-10-13
- **Komponen:** `dist/assets/index-CI1XYnwk.js`, `dist/assets/suitability-BoKTpxZD.js`, `dist/assets/farmers-RBAkXoyn.js`, `dist/img/domain/*`.
- **Deskripsi:** 
  1. Terjadi galat runtime `SyntaxError: Unexpected identifier 'bg'` pada `index-CI1XYnwk.js` dan `SyntaxError: Unexpected token ')'` pada `farmers-RBAkXoyn.js` pasca penyesuaian chunk.
  2. Gambar ilustrasi header sempat dibungkus dengan kartu kotak putih bersudut melengkung (`bg-white border border-slate-200 rounded-xl shadow-sm`) yang menciptakan visual AI-slop dan memakan ruang vertikal.
  3. Aset gambar domain dipindahkan ke folder khusus `dist/img/domain/` dan sempat tidak terlayani akibat ketidaksesuaian path URL.
- **Akar Masalah:**
  1. Penulisan template literal dengan backtick melalui perintah shell PowerShell meng-escape karakter backtick sehingga string CSS dievaluasi sebagai identifier JavaScript mentah.
  2. Penataan regex penggantian string menyisakan penutup tanda kurung duplikat.
  3. Penggunaan pembungkus kartu kaku melanggar prinsip desain anti-slop Rule 14 & Rule 18 (unboxed illustration).
- **Solusi & Verifikasi:**
  1. Mengimplementasikan skrip terstandar [`scripts/fix_index_ft.js`](file:///e:/Project/pertanian_main/scripts/fix_index_ft.js) dan [`scripts/remove_card_wrappers.js`](file:///e:/Project/pertanian_main/scripts/remove_card_wrappers.js) dengan string aman tanpa ketergantungan escape shell.
  2. Menghapus 100% pembungkus kartu/border/shadow di seluruh 13 halaman sektor domain, menggantinya dengan ilustrasi murni (*unboxed illustration*) berukuran `h-14 sm:h-16 w-auto object-contain` (`maxHeight: 60px`).
  3. Memetakan seluruh rute gambar secara eksklusif ke `/img/domain/<file>.png`.
  4. Menjalankan verifikasi parser Node.js terhadap seluruh 84 berkas bundle JS di `dist/assets/` (`Checked 84 JS bundles. Custom errors: 0`) dan memvalidasi seluruh 13 URL gambar domain mengembalikan HTTP 200 OK.

### [ISSUE-038] TypeError: can't access property "length", n.geometries is undefined pada Leaflet Map Dashboard
- **Status:** RESOLVED
- **Tanggal:** 2026-10-13
- **Komponen:** `scripts/optimize_geojson.js`, `dist/peta_desa_v3.geojson`, `dist/assets/pages-BdW-ZTL4.js`.
- **Deskripsi:** 
  Pemuatan halaman utama dashboard (`/`) terhenti dan menampilkan modal merah Error Boundary:
  `TypeError: can't access property "length", n.geometries is undefined dr http://127.0.0.1:5173/assets/pages-BdW-ZTL4.js:1`.
- **Akar Masalah:**
  1. Skrip pemangkas presisi koordinat [`scripts/optimize_geojson.js`](file:///home/gbc/Projects/pertanian-main/scripts/optimize_geojson.js) awalnya hanya memetakan properti `coordinates` dan tidak menyalin array `geometries`.
  2. Tiga entitas desa di [`dist/peta_desa_v3.geojson`](file:///home/gbc/Projects/pertanian-main/dist/peta_desa_v3.geojson) (Desa Gemuruh OBJECTID 68, Desa Gumelemkulon OBJECTID 201, Desa Petambakan OBJECTID 239) memiliki tipe geometri `GeometryCollection` yang menyimpan poligon di `geometries` (bukan `coordinates`).
  3. Skrip optimasi menghapus atribut `geometries`, meninggalkan `"geometry": {"type": "GeometryCollection"}` tanpa array elemen sehingga Leaflet crash saat mengevaluasi `n.geometries.length`.
- **Solusi & Verifikasi:**
  1. Memperbaiki [`scripts/optimize_geojson.js`](file:///home/gbc/Projects/pertanian-main/scripts/optimize_geojson.js) agar mengenali `GeometryCollection` dan memetakan setiap elemen `geometries` dengan pembulatan 6 desimal.
  2. Memulihkan struktur geometri 3 desa terdampak pada [`dist/peta_desa_v3.geojson`](file:///home/gbc/Projects/pertanian-main/dist/peta_desa_v3.geojson) dari data historis dengan koordinat 6 desimal.
  3. Menambahkan defensive guard pada handler `GeometryCollection` Leaflet di [`dist/assets/pages-BdW-ZTL4.js`](file:///home/gbc/Projects/pertanian-main/dist/assets/pages-BdW-ZTL4.js): `for(l=0,u=(n.geometries?n.geometries.length:0);l<u;l++)` untuk proteksi fail-safe ganda.
  4. Pengujian verifikasi: Memvalidasi 278 fitur desa (3 `GeometryCollection` non-kosong, 275 `Polygon`) lulus verifikasi integritas 100% dan berkas GeoJSON terlayani HTTP 200 OK.

### [ISSUE-039] Fragmentasi Bentuk Tab, Inkonsistensi Judul Navbar vs Halaman, & Favicon Browser Non-Standar (ADR-054)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-13
- **Komponen:** `dist/index.html`, `dist/favicon.ico`, `dist/assets/site-B5h-x_N5.js`, `dist/assets/index-CI1XYnwk.js`, `dist/assets/food-crops-BebUD7KU.js`, `dist/assets/livestock-flow-BDdzRa_Y.js`, `dist/assets/sensus-BWFI5HVu.js`, `dist/assets/farmers-RBAkXoyn.js`, `dist/assets/peternakan-susu-kulit-B1vV3OM5.js`.
- **Deskripsi:** 
  1. Ditemukan 12 rute navigasi dengan judul di sidebar/navbar tidak sinkron dengan judul `<h1>` halaman aplikasi (misal: "Tanaman Pangan" vs "Produksi Padi & Palawija", "Sebaran Pangan" vs "Peta Geospasial Sektoral").
  2. Fragmentasi bentuk tab di seluruh halaman menjadi 5 variasi berbeda (underline tab, plain button, square boxed input ber-border kaku dengan `bg-blue-800`, inline hex hardcoded `#047857`, dan pill).
  3. Komponen PageHeader global `Ft` di `index-CI1XYnwk.js` masih menyisakan pembungkus kartu (`rounded-xl shadow-sm border w-28 h-20 overflow-hidden`) yang menyebabkan layout shift dan melanggar aturan unboxed illustration.
  4. Halaman `/livestock-flow` dan `/sensus` belum terhubung ke `PageHeader` resmi berilustrasi unboxed, dan tab datanya terjebak di dalam formulir filter grid.
  5. Favicon browser pada peramban masih menggunakan default Vite SVG oranye/ungu dan belum mencerminkan logo master resmi aplikasi.
- **Akar Masalah:**
  1. Inkonsistensi penamaan antara katalog rute sidebar dan komponen halaman frontend akibat pengerjaan fase yang berbeda-beda.
  2. Belum adanya unifikasi baku komponen tab di level token design system sebelum ADR-054.
  3. Komponen `Ft` belum dibersihkan saat migrasi aset gambar unboxed ke `dist/img/domain/`.
- **Solusi & Verifikasi:**
  1. **Penyelarasan 36 Judul Rute (100% Sinkron):** Menyeragamkan seluruh judul sidebar (`site-B5h-x_N5.js`) dan tag `<h1>` halaman ke nama kanonikal baku.
  2. **Unifikasi Tab Baku (Executive Segmented Pill):** Menstandarkan seluruh tab ke kontainer `flex flex-wrap items-center gap-1.5 p-1 rounded-lg border border-slate-200 bg-slate-100/90 shadow-sm w-fit` dengan item aktif `rounded-md px-3.5 py-1.5 text-xs font-bold bg-white text-slate-900 shadow-sm` dan inaktif `text-slate-600 hover:text-slate-900 hover:bg-slate-200/60`, serta menghapus seluruh inline hex styling.
  3. **Pembersihan Kartu `Ft`:** Mengubah komponen `Ft` di `index-CI1XYnwk.js` menjadi unboxed murni (`h-14 sm:h-16 w-auto object-contain select-none max-h-[60px]`) dan spacing `border-b border-slate-200 pb-5 mb-6`.
  4. **Harmonisasi `/livestock-flow` & `/sensus`:** Menghubungkan PageHeader `Ft` dengan ilustrasi unboxed `livestock.png` dan `farmers.png`, serta mengelevasi tab Jenis Data dan Aspek Data ke posisi navigasi utama.
  5. **Favicon Resmi Terpadu:** Meng-generate multi-resolusi `.ico` dan `.png` langsung dari master `dist/logo.png` (2480×2480 RGBA) dan menghubungkannya di `dist/index.html`.
  6. Pengujian verifikasi: Seluruh endpoint terlayani HTTP 200 OK, validasi AST 0 galat, dan keselarasan visual 100% tervalidasi.

### [ISSUE-040] Galat Koneksi Chatbot AI Si Pertani (Undefined kecamatanParam, Model Deprecated 404, & Upstream 503 Crash)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-14
- **Komponen:** `src/routes/ai.js`, `dist/assets/recommendations-BSYcyuDe.js`.
- **Deskripsi:** 
  Pengguna mendapati galat saat mengirim pesan di Chatbot Si Pertani:
  *"Maaf, terjadi kesalahan koneksi. Pastikan jaringan internet tersedia dan coba lagi. Jika masalah berlanjut, hubungi administrator sistem."*
- **Akar Masalah:**
  1. **ReferenceError `kecamatanParam`:** Pada `src/routes/ai.js` (baris 514), query FSVA/Ketahanan Pangan merujuk `if (kecamatanParam)` padahal variabel yang dideklarasikan di scope fungsi adalah `matchedKec`. Galat ini menginterupsi proses RAG retrieval.
  2. **Model Deprecated (HTTP 404):** Daftar model `gemini-2.0-flash` dan `gemini-2.0-flash-lite` telah dinonaktifkan oleh Google API (mengembalikan HTTP 404 NOT_FOUND). Google merekomendasikan `gemini-3.5-flash-lite` dan `gemini-3.8-flash`.
  3. **Lonjakan Beban Upstream (HTTP 503) & Pemutusan Koneksi Frontend:** Saat upstream Gemini mengalami lonjakan beban temporer (HTTP 503) dan `dynamicContext` kosong (misal query umum atau terputus oleh bug A), backend mengembalikan respons `res.status(503).json(...)`. Frontend React mendeteksi `!response.ok`, melempar `Error: API error: 503`, dan blok `catch` menampilkan pesan kesalahan koneksi.
- **Solusi & Verifikasi:**
  1. Mengoreksi `kecamatanParam` menjadi `matchedKec` pada blok RAG FSVA di `src/routes/ai.js`, sehingga filter kecamatan pada 278 desa berjalan tanpa galat.
  2. Memperbarui `SUPPORTED_MODELS` dengan model aktif yang terbukti 200 OK (`gemini-3.5-flash-lite`, `gemini-flash-lite-latest`, `gemini-flash-latest`, `gemini-3.5-flash`, `gemini-3.8-flash`) dan menghapus model 2.0 yang telah 404.
  3. Memperkuat mekanisme fallback lokal di `src/routes/ai.js` agar selalu mengalirkan Server-Sent Events (SSE HTTP 200) yang informatif dan ramah (baik dengan data statistik lokal maupun pesan panduan) saat upstream mengalami kendala atau query umum, sehingga frontend tidak pernah mengalami galat koneksi.
  4. Pengujian verifikasi: Query live chat streaming dengan kata kunci FSVA dan pertanyaan umum sukses 100% menggunakan model `gemini-3.5-flash-lite` dengan latency cepat dan 0 error di log server.

### [ISSUE-041] Redesign Header Dasbor Admin & Penegakan 16 Domain Murni (ADR-057, ADR-058, ADR-059)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-15
- **Komponen:** `src/lib/domains.js`, `src/lib/users.js`, `scripts/build_admin_view.js`, `dist/assets/admin-C9Dakcgq.js`.
- **Deskripsi:** Dasbor admin memuat elemen visual AI-slop (kartu status internal dev ber-pulse dot, teks klise "100% Siap Publik", tombol ganda redundan, dan kartu rekapitulasi otomatis ADR-009). Domain `komoditas-unggulan` juga masih terdaftar di katalog upload admin padahal dihitung secara otomatis dari produksi lapangan.
- **Akar Masalah:** Sisa kartu purwarupa arsitektur internal dan belum selarasnya registry domain dengan prinsip Single Source of Truth ADR-009.
- **Solusi & Verifikasi:** 
  1. Menghapus domain `komoditas-unggulan` dari `DOMAINS` dan peran bidang teknis (16 domain operasional murni).
  2. Merestrukturisasi header dasbor admin menjadi Flat Open Header institusional berlatar bersih dengan logo Pemkab Banjarnegara.
  3. Membangun ulang bundel `dist/assets/admin-C9Dakcgq.js` via `node scripts/build_admin_view.js` dan memvalidasi sintaks AST 0 error.

### [ISSUE-042] Refinement RAG Graceful Local Fallback dengan Rule-Based NLG & Offline Agricultural KB (ADR-060)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-15
- **Komponen:** `src/lib/ai-nlg.js`, `src/lib/ai-offline-kb.js`, `src/routes/ai.js`, `tests/ai-fallback.test.js`, `tests/endpoint.test.js`.
- **Deskripsi:** Respons fallback lokal saat upstream AI offline atau tanpa API key sebelumnya masih berupa cetak teks mentah (*raw database dump*) yang kaku seperti log database serta tidak dapat menjawab pertanyaan kualitatif/SOP lapangan.
- **Akar Masalah:** Belum tersedianya lapisan sintesis kalimat bahasa alami (*natural language generation*) dan modul pustaka agrikultur lokal offline.
- **Solusi & Verifikasi:**
  1. Membangun modul `src/lib/ai-offline-kb.js` berisi profil komoditas khas Banjarnegara (Salak Pondoh, Kopi Robusta Karangkobar, Domba Batur, Sayuran Dieng) dan SOP teknis penanganan hama (WBC padi, patek cabai, tikus).
  2. Membangun modul `src/lib/ai-nlg.js` untuk merangkai angka statistik riil menjadi paragraf narasi percakapan yang ramah, sopan, dan terstruktur.
  3. Mengimplementasikan generator *micro-chunk pacing* SSE untuk simulasi pengetikan alami (*smooth typing*) saat fallback lokal aktif.
  4. Pengujian verifikasi: 100% lolos uji pada 5 suite unit test dan integrasi endpoint streaming live.

### [ISSUE-043] Registrasi Akun Bidang Ketahanan Pangan ke Basis Data & Konfigurasi RBAC (ADR-061)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-15
- **Komponen:** `src/lib/users.js`, `database/production_migration_patch.sql`, `scripts/seed_ketahanan_pangan.js`, `.env`, `.env.example`.
- **Deskripsi:** Pengguna mendapati bahwa akun `ketahanan-pangan` belum terdaftar di tabel `users` MySQL dan variabel kata sandinya belum ada di konfigurasi `.env`.
- **Akar Masalah:** Skrip migrasi awal hanya memuat `admin_ketahanan`, sementara sistem RBAC admin merujuk nama pengguna `ketahanan-pangan` dengan variabel `PASS_KETAHANAN_PANGAN`.
- **Solusi & Verifikasi:**
  1. Menjalankan seeder idempoten `scripts/seed_ketahanan_pangan.js` untuk meregistrasi `ketahanan-pangan` (id: 8, role: `admin_ketahanan_pangan`) dengan password hash SHA-256 ke tabel `users`.
  2. Menambahkan `PASS_KETAHANAN_PANGAN=KetahananPangan.2026` ke `.env` dan `.env.example`.
  3. Mendaftarkan alias `admin_ketahanan` di `src/lib/users.js` untuk kompatibilitas login ganda.
### [ISSUE-044] Inkonsistensi Status Kesiapan Data Multi-Role & Teks Kunci PSAT Terpotong (ADR-062)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-16
- **Komponen:** `src/routes/admin.js`, `scripts/build_admin_view.js`, `dist/assets/admin-C9Dakcgq.js`.
- **Deskripsi:** Saat akun administrator masuk, kartu domain menampilkan tahun data dan status mutakhir, namun saat akun bidang teknis (seperti `ketahanan-pangan`) masuk, seluruh kartu tertulis "Belum Ada Data" berwarna merah. Selain itu, pada kartu Keamanan Pangan (PSAT-PDUK), teks nama sheet tertekan hilang dan hanya tersisa teks kunci natural yang panjang.
- **Akar Masalah:**
  1. Endpoint `/api/v1/admin/readiness` dikunci oleh middleware `requireAdminRole` sehingga akun bidang teknis menerima 403 Forbidden.
  2. Komponen admin frontend memblokir pemanggilan readiness dengan `if (!n) return;` saat login sebagai non-admin sehingga `readinessData` selalu `null`.
  3. Rentang kunci natural `psat_pduk` (52 karakter) menggunakan `shrink-0` tanpa batas lebar sehingga memampatkan elemen nama sheet di sebelahnya hingga 0px.
  4. Domain `harga-produsen` belum terdaftar pada pemetaan styling warna `B` dan array kategori.
- **Solusi & Verifikasi:**
  1. Mengubah guard `/readiness` di `src/routes/admin.js` menjadi `requireAdmin` (terotentikasi).
  2. Memindahkan pemanggilan readiness di `build_admin_view.js` sebelum `if (!n) return;` sehingga seluruh akun multi-role menerima data keterisian riil.
  3. Menambahkan `flex-1` pada nama sheet dan `max-w-[140px] truncate` pada teks kunci tabel.
  4. Mendaftarkan `harga-produsen` ke objek `B` dan kategori navigasi.
### [ISSUE-045] Panel Pemetaan Status Sumber Data Halaman Publik & Pintasan Akses Portal di Dasbor Admin (ADR-063)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-16
- **Komponen:** `src/lib/data-sources.js`, `src/routes/admin.js`, `scripts/build_admin_view.js`, `dist/assets/admin-C9Dakcgq.js`.
- **Deskripsi:** Administrator dan staf bidang teknis membutuhkan kejelasan faktual mengenai data yang tampil di portal publik: halaman mana yang menggunakan data unggahan Distankan KP Banjarnegara (dengan status tahun dan jumlah baris), mana yang didampingi data rujukan/pembanding luar (BAPANAS, BPS, Kementan), serta tautan langsung untuk melihat halaman publik yang bersangkutan dari dasbor admin tanpa jargon teknis backend rumit.
- **Solusi & Verifikasi:**
  1. Membangun modul `src/lib/data-sources.js` yang memetakan 16 domain sektor ke rute publik, data unggahan lokal, dan sumber pembanding eksternal dengan bahasa lugas dan anti-AI-slop.
  2. Mendaftarkan endpoint `GET /api/v1/admin/sumber-data` di `src/routes/admin.js` yang terintegrasi RBAC (administrator melihat seluruh 16 domain, akun bidang hanya melihat domain tanggung jawabnya).
  3. Menambahkan tombol `[Lihat di Publik ↗]` di setiap kartu domain katalog berkas agar staf dinas dapat langsung memverifikasi tampilan data di portal publik.
  4. Menambahkan tab switcher `[Katalog Berkas & Unggahan]` dan `[Sumber Data Halaman Publik]` di dasbor admin dengan tabel 5 kolom informatif: Halaman Publik, Data Distankan KP (Unggahan), Data Pembanding / Rujukan Luar, Status Tayang di Publik, dan Aksi Buka Halaman.
### [ISSUE-046] Redesign Filter Card Hortikultura, Kontekstualisasi Ikon Sektoral & Eliminasi AI-Slop (ADR-064)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-16
- **Komponen:** `dist/assets/horticulture-CCLLXyU1.js`.
- **Deskripsi:** Filter card pada halaman hortikultura (`/horticulture`) memiliki ketimpangan visual vertikal parah di mana kolom sub-sektor memuat 4 tombol dalam grid 2x2 yang memakan 2 baris, sementara 3 kolom lainnya (Metrik Analisis, Tahun Data, Pilih Kecamatan) hanya 1 baris sehingga menyisakan ruang kosong besar di bawahnya. Selain itu, ikon Buah dan Tanaman Hias menggunakan ikon potongan pizza (`pizza`), Sayuran dan Biofarmaka memakai tunas generik (`sprout`), tombol aktif memakai warna biru pekat generik (`bg-blue-800`), dan seluruh teks tombol berhuruf kapital penuh (ALL CAPS).
- **Akar Masalah:**
  1. Definisi ikon `ue` pada bundle menggunakan path Lucide `pizza` alih-alih ikon hortikultura yang representatif.
  2. Penempatan Sub-Sektor (kategori tingkat teratas) sejajar dalam grid 4-kolom yang sempit bersama parameter filter, menyebabkan pembengkakan tinggi secara asimetris.
  3. Penggunaan warna default `bg-blue-800` dan kapitalisasi kaku yang tidak selaras dengan tema institusional SISPERTANI.
- **Solusi & Verifikasi:**
  1. Menstandarkan tata letak filter card ke format baku 4-kolom sejajar (`grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4 rounded-lg bg-white border border-slate-200 shadow-sm`) yang 100% konsisten dengan halaman lain (`food-crops`, `plantation`, `livestock`).
  2. Mengeliminasi total kapsul redundant "● Aktif: Sayuran" (AI slop) dan menghapus baris footer status yang membuat card tidak konsisten.
  3. Menerapkan ikon Lucide representatif: Wortel (`Carrot`) untuk Sayuran, Apel (`Apple`) untuk Buah, Tunas (`Sprout`) untuk Biofarmaka, dan Bunga (`Flower-2`) untuk Tanaman Hias.
  4. Kartu ringkasan metrik total di bawah filter diperbarui agar ikonnya dinamis mengikuti komoditas yang aktif.
  5. Mengganti warna aktif dari `bg-blue-800` menjadi `bg-emerald-700 text-white font-semibold shadow-xs` dengan tipografi Title Case rapi.
  6. Pengujian sintaks via `node -c` (exit code 0) dan verifikasi respon HTTP pada `http://127.0.0.1:5173/assets/horticulture-CCLLXyU1.js` (200 OK).
### [ISSUE-047] Transformasi Dinamis Neraca Pangan Komposit (Non-Beras) & Integrasi Panen Lokal (ADR-065)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-16
- **Komponen:** `src/routes/ketahanan.js`, `dist/assets/food-security-Dw2-7ErS.js`.
- **Deskripsi:** Tab "Neraca Pangan Komposit (Non-Beras)" pada `/food-security` sebelumnya menggunakan konstanta array statis di memori frontend (`KOMPOSIT_DATA`) dan belum terhubung ke API backend, sehingga bila admin mengunggah berkas Excel NBM melalui dasbor admin, halaman publik belum dapat memperbarui data secara dinamis. Selain itu, belum ada pilihan tahun data dan data panen lokal Distankan KP yang sebenarnya sudah ada di database belum terhubung sebagai pembanding.
- **Akar Masalah:**
  1. Frontend meng-hardcode 8 baris kartu komoditas dengan placeholder statis tanpa pemanggilan `fetch('/api/v1/ketahanan/neraca-komposit')`.
  2. Endpoint backend `/api/v1/ketahanan/neraca-komposit` belum menyediakan deteksi tahun otomatis (`MAX(tahun)`), daftar tahun (`availableYears`), dan metadata referensi panen lokal.
- **Solusi & Verifikasi:**
  1. Backend `src/routes/ketahanan.js`:
     - Menambahkan deteksi tahun aktif dinamis dan array `availableYears` dari `neraca_pangan_komposit`.
     - Mengagregasi data panen riil petani Banjarnegara tahun berjalan dari tabel `palawija_produksi` (Jagung: 51.146 Ton, Ubi Kayu: 78.886 Ton, Kedelai: 19 Ton) serta data peternakan (`ternak_daging` & `ternak_telur`) sebagai field `produksiLokalTon`.
     - Menyediakan penentuan satuan otomatis (Liter untuk Minyak Goreng, Ton untuk komoditas lainnya).
  2. Frontend `dist/assets/food-security-Dw2-7ErS.js`:
     - Menambahkan state reaktif `kompositData`, `kompositTahun`, `kompositTahunList`, dan `loadingKomposit`.
     - Mengintegrasikan pemanggilan API dinamis `fetch('/api/v1/ketahanan/neraca-komposit?tahun=' + kompositTahun)`.
     - Menambahkan toolbar pemilih tahun data (`select`) yang responsif di atas grid kartu.
     - Menyajikan badge status reaktif (Surplus: emerald, Seimbang: amber, Defisit: rose, Menunggu Data: netral amber) dan baris pembanding faktual *"Panen Lokal Banjarnegara: X Ton (Distankan KP)"*.
  3. Verifikasi: `node -c dist/assets/food-security-Dw2-7ErS.js` lolos (exit code 0), query API mengembalikan 8 komoditas dengan tahun 2024 (200 OK), dan asset HTTP terverifikasi utuh.

### [ISSUE-048] Penyelarasan Matriks Metrik Sub-Sektor Buah (Luas, Produksi, Produktivitas) (ADR-066)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-16
- **Komponen:** `dist/assets/horticulture-CCLLXyU1.js`, `src/routes/hortikultura.js`.
- **Deskripsi:** Saat pengguna memilih sub-sektor "Buah" pada halaman Hortikultura (`/horticulture`), tombol pilihan metrik analisis di Kolom 2 sebelumnya dikunci/dihilangkan dan digantikan oleh badge banner kaku *"Volume Produksi (Ton)"*. Sementara sub-sektor lain (Sayuran, Biofarmaka, Tanaman Hias) memiliki 3 metrik penuh (`Luas`, `Produksi`, `Produktivitas / T / Ha`).
- **Akar Masalah:**
  1. Frontend meng-hardcode seleksi metrik `U = A === "buah" ? "produksi" : j`, mengunci pilihan metrik buah hanya pada produksi.
  2. Objek dataset buah `Ee` hanya mengisi `produksi` dan membiarkan `luas: {}` kosong tanpa properti komoditas.
  3. Satuan `unitLuas` dan `unitProduktivitas` pada buah belum didefinisikan sebagai "Ha" dan "Ton/Ha".
  4. Backend `/rekap-global` meng-hardcode nilai `luas: 0` untuk buah dan belum menyediakan endpoint `/buah-luas`.
- **Solusi & Verifikasi:**
  1. Backend `src/routes/hortikultura.js`:
     - Menambahkan endpoint `GET /api/v1/hortikultura/buah-luas` yang menghitung luas panen (Ha) berdasarkan rasio agronomis standar BPS Distankan KP: Salak (22 T/Ha), Pisang (25 T/Ha), Durian (10 T/Ha), Mangga (12 T/Ha), Pepaya (40 T/Ha), Jeruk Besar (16 T/Ha), Jeruk Siam (18 T/Ha).
     - Memperbarui `/rekap-global` agar menghitung total estimasi luas panen buah (11.229,72 Ha pada 2024) secara dinamis.
  2. Frontend `dist/assets/horticulture-CCLLXyU1.js`:
     - Memperbarui mapping `Ee` sehingga setiap komoditas buah memiliki properti `luas` (Ha) dan `produksi` (Ton) lengkap.
     - Membuka kunci metrik: `U = j`, sehingga pengguna bebas beralih antara `Luas (Ha)`, `Produksi (Ton)`, dan `T / Ha` pada sub-sektor Buah.
     - Menyamakan Kolom 2 Metrik Analisis untuk seluruh 4 sub-sektor menjadi 3 tombol baku: `Luas (${unitLuas})`, `Produksi`, dan `(A === "sayuran" || A === "buah") ? "T / Ha" : "Hasil/m²"`.
     - Memperbarui satuan `unitLuas` ("Ha") dan `unitProduktivitas` ("Ton/Ha") untuk sub-sektor buah.
     - Kartu statistik total, kecamatan tertinggi, komposisi komoditas, dan grafik tren/batang kini menampilkan data luas dan produktivitas buah secara konsisten tanpa NaN.
  3. Verifikasi:
     - `node -c dist/assets/horticulture-CCLLXyU1.js` (exit code 0).
     - `node -c src/routes/hortikultura.js` (exit code 0).
     - Query headless mengonfirmasi metrik buah 2024: Luas 11.229,69 Ha, Produksi 249.318,35 Ton, Produktivitas rata-rata 22,20 Ton/Ha.
     - Pengujian HTTP fetch pada `/assets/horticulture-CCLLXyU1.js` berstatus 200 OK.

### [ISSUE-049] Standardisasi Desain Filter Card Padi & Palawija (/food-crops) Seragam dengan Hortikultura (ADR-067)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-16
- **Komponen:** `dist/assets/food-crops-BebUD7KU.js`.
- **Deskripsi:** Filter card pada `/food-crops` memiliki ketidakkonsistenan visual dengan halaman hortikultura: tombol Kelompok Komoditas dan Indikator dibungkus dalam wadah kapsul abu-abu (`bg-slate-100 border border-slate-200 p-1 rounded-lg w-fit`) dengan perilaku `flex-wrap` yang menyebabkan tombol ketiga ("Kacang-kacangan") turun ke baris kedua dan membuat tinggi Kolom 1 tidak simetris dengan kolom lainnya. Selain itu, tombol aktif berwarna putih pucat (`bg-white text-slate-900`) alih-alih warna standar aplikasi (`bg-emerald-700 text-white`), dan terdapat baris teks footer redundan (*"Menampilkan: Padi Sawah & Padi Ladang · Produksi (Ton) · 2024 · Semua"*).
- **Akar Masalah:** Format segmented-control kapsul lokal yang tidak mengadopsi standar baku 4-kolom sejajar SISPERTANI.
- **Solusi & Verifikasi:**
  1. Menstandarkan tata letak filter card ke format baku 4-kolom sejajar (`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-left`) yang identik 100% dengan hortikultura.
  2. Mengubah tombol Kelompok Komoditas dan Indikator menjadi grid 3-kolom rapi (`grid grid-cols-3 gap-1.5`) dengan state aktif baku **`bg-emerald-700 text-white shadow-xs`** dan state inaktif `bg-white text-slate-800 hover:bg-slate-100 shadow-xs`.
  3. Mempertahankan seluruh opsi indikator dan metrik komoditas tanpa perubahan fungsi (`Luas Panen`, `Produksi`, `Produktivitas`, serta `Padi Sawah·Ladang`, `Jagung & Umbi-umbian`, `Kacang-kacangan`).
  4. Menyelaraskan dropdown pemilih Tahun Data dan Pilih Kecamatan dengan ikon kalender/lokasi abu-abu (`text-slate-500`) dan fokus cincin `focus:ring-emerald-600`.
  5. Menghilangkan baris teks footer redundan di bawah kartu filter.
  6. Verifikasi: `node -c dist/assets/food-crops-BebUD7KU.js` lolos (exit code 0), dan pengujian fetch HTTP berstatus 200 OK.

### [ISSUE-050] Standardisasi Desain Filter Card Perikanan (/fisheries) Seragam dengan Hortikultura (ADR-068)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-16
- **Komponen:** `dist/assets/fisheries-5_2RapTI.js`.
- **Deskripsi:** Filter card pada `/fisheries` memiliki tampilan kaku dan asimetris: 5 tombol Kategori Perikanan (`Budidaya`, `Tangkap`, `Benih`, `Jenis Ikan`, `Ikan Hias`) dipaksa masuk ke dalam kolom 1 yang hanya berbobot 33% lebar card (`grid-cols-3 gap-6 p-6`), menyebabkan tombol sangat sempit, teks terpotong 2 baris, huruf kapital kaku (ALL CAPS), dan warna aktif menggunakan biru elektrik (`bg-blue-600`) yang menyimpang dari tema SISPERTANI.
- **Akar Masalah:** Format layout `grid-cols-3` kaku dengan pembagian kolom sama rata serta tombol persegi berteks huruf kapital.
- **Solusi & Verifikasi:**
  1. Menstandarkan tata letak filter card ke format baku 4-kolom sejajar (`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-left`) yang identik dengan hortikultura.
  2. Kategori Perikanan diberi rentang 2 kolom (`md:col-span-2 xl:col-span-2`) dengan `grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-1.5` sehingga ke-5 tombol memiliki ruang cukup luas untuk menampilkan nama kategori dalam 1 baris utuh.
  3. Mengubah tipografi tombol menjadi Title Case rapi dengan state aktif baku **`bg-emerald-700 text-white shadow-xs`** dan state inaktif `bg-white text-slate-800 hover:bg-slate-100 shadow-xs border border-slate-200 rounded-md`.
  4. Menyelaraskan kontras warna ikon di dalam tombol (aktif: `text-emerald-100`, inaktif: `text-emerald-600`).
  5. Menstandarkan dropdown Tahun Data dan Pilih Kecamatan dengan label `text-slate-500 font-semibold uppercase`, ikon abu-abu vertikal-tengah, dan fokus cincin `focus:ring-emerald-600`.
  6. Verifikasi: `node -c dist/assets/fisheries-5_2RapTI.js` lolos (exit code 0), dan pengujian fetch HTTP berstatus 200 OK.

### [ISSUE-051] Eliminasi Tab Redundan & Optimasi Font Tombol Komoditas Padi & Palawija (/food-crops) (ADR-069)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-16
- **Komponen:** `dist/assets/food-crops-BebUD7KU.js`.
- **Deskripsi:** Pada halaman `/food-crops`:
  1. Terdapat 2 tab navigasi atas (*"Produksi & Luas Panen"* dan *"LTT & Kalender Tanam"*) yang redundan karena kedua halaman sudah tersedia secara mandiri pada sidebar navigasi.
  2. Tombol kelompok komoditas di Kolom 1 mengalami teks terpotong (*"agung & Umbi-umbia"*) akibat panjang string 20 karakter yang melebihi kapasitas lebar kolom kartu.
- **Akar Masalah:**
  1. Keberadaan wadah tab switcher redundan sebelum kartu filter.
  2. String panjang `Jagung & Umbi-umbian` dan `Padi Sawah·Ladang` dalam grid 3-kolom kartu filter tanpa penyesuaian ukuran font atau pemendekan label yang ergonomis.
- **Solusi & Verifikasi:**
  1. Menghapus penuh elemen tab switcher 2-tombol di atas filter card sehingga kartu filter langsung berada di bawah header halaman secara rapi dan simetris (margin `mb-6`).
  2. Menyesuaikan label tampilan tombol komoditas: **`Padi`**, **`Jagung & Umbi`**, dan **`Kacang-kacangan`** yang ringkas dan bebas terpotong.
  3. Menambahkan atribut tooltip `title={w[e].label}` sehingga nama resmi lengkap komoditas (*"Padi Sawah & Padi Ladang"*, *"Jagung & Umbi-umbian"*, *"Kacang-kacangan"*) tetap muncul saat di-hover.
  4. Menyelaraskan ukuran font ke `text-[11px] xl:text-xs font-semibold` pada tombol komoditas dan indikator.
  5. Verifikasi: `node -c dist/assets/food-crops-BebUD7KU.js` lolos (exit code 0), dan pengujian fetch HTTP berstatus 200 OK.

### [ISSUE-052] Eliminasi Data Tiruan (Dummy) & Penerapan Empty State Murni LTT & Kalender Tanam (/ltt-katam) (ADR-070)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-16
- **Komponen:** `dist/assets/ltt-katam-DHFMKiIG.js`, `src/server.js`.
- **Deskripsi:** 
  1. Halaman `/ltt-katam` menampilkan tab switcher redundan 2-tombol (*"Produksi & Luas Panen"* dan *"LTT & Kalender Tanam"*) yang menumpuk di atas konten halaman.
  2. Karena tabel basis data `ltt_katam` di MySQL `pertasis` saat ini masih berstatus 0 baris (belum diunggah oleh Dinas), halaman sebelumnya menggunakan fallback ke 15 baris data contoh fiktif (`F = [...]`), menampilkan banner peringatan oranye (*"Pratinjau dengan data contoh... Data resmi LTT & kalender tanam dijadwalkan tersedia 23 September 2026..."*), serta merender grafik batang, 4 kartu KPI, dan tabel tiruan yang melanggar prinsip *Zero Dummy Data*.
- **Akar Masalah:**
  1. Keberadaan wadah tab switcher redundan yang menumpuk di atas konten.
  2. Mekanisme fallback `H ? F : l` yang menginjeksi mockup array fiktif saat data database kosong atau belum diisi dinas.
  3. Ketiadaan rute API backend `GET /api/v1/ltt-katam` yang langsung menanyai tabel `ltt_katam`.
- **Solusi & Verifikasi:**
  1. **Backend:** Menambahkan endpoint `GET /api/v1/ltt-katam` dan `/sispertani-api/v1/ltt-katam` di `src/server.js` yang mengeksekusi kueri langsung `SELECT id, komoditas, kecamatan, jenis, luas_rencana, luas_tanam, luas_panen, produksi_rencana, produksi_aktual, bulan_mulai, bulan_panen, tahun FROM ltt_katam ORDER BY tahun DESC, kecamatan ASC`.
  2. **Frontend Zero Dummy Data:**
     - Mengosongkan konstanta mockup `F = []`.
     - Menghapus elemen tab switcher redundan di atas halaman.
     - Menghapus banner peringatan oranye data contoh placeholder.
     - Mengimplementasikan **Empty State murni** (`if (!l || l.length === 0)`): menyajikan kartu status institusional bersih dengan ikon kalender lembut (`text-slate-400`), judul *"Data LTT & Kalender Tanam Belum Tersedia"*, deskripsi resmi bahwa data belum diunggah oleh dinas, dan tombol aksi *"← Kembali ke Tanaman Pangan"*.
     - Jika data resmi telah diunggah di masa mendatang (`l && l.length > 0`), tampilan tabel, kartu KPI, dan grafik otomatis aktif menggunakan data riil database tanpa sisa teks dummy.
  3. **Verifikasi:**
     - `node -c dist/assets/ltt-katam-DHFMKiIG.js` lolos tanpa galat sintaks (exit code 0).
     - Permintaan HTTP ke `/sispertani-api/v1/ltt-katam` mengembalikan array kosong riil `[]` (status 200 OK).
     - Pengujian `read_url_content` pada `http://127.0.0.1:5173/ltt-katam` berjalan lancar tanpa rendering visual palsu.

### [ISSUE-053] Integrasi Renstra Dual-Periode (2025–2029 & 2019–2022) Faktual & Pembersihan Teks Lebai / AI Slop (ADR-072)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-19
- **Komponen:** `dist/assets/renstra-v242.js`, `dist/renstra-2025-2029.pdf`, `dist/renstra.pdf`.
- **Deskripsi:** 
  1. Halaman `/renstra` sebelumnya memuat data historis tahun 2019–2022 namun dilabeli rancu sebagai 2022–2024.
  2. Data resmi Rencana Strategis (Renstra) 2025–2029 Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara (77 halaman PDF) belum terintegrasi ke antarmuka.
  3. Terdapat kata-kata lebai/AI slop ("tahun berjalan", "periode berjalan", "Tabel 4.5", "Tabel 4.7") dan kartu metrik nonsens ("Tahun 2025" / "Target tahun 2025").
- **Akar Masalah:** Ketiadaan selektor periode resmi dan penggunaan teks template AI generik yang melanggar Anti-AI-Slop Law (COPY_RULES.md).
- **Solusi & Verifikasi:**
  1. **Dual-Periode Selector:** Menyediakan dropdown periode interaktif pada header: `Renstra 2025–2029` dan `Renstra 2019–2022`.
  2. **Integrasi Data Faktual 2025–2029:**
     - 9 Indikator Sasaran (IKU): Nilai SAKIP, IPP, IKP, PDRB Pertanian, PPH, Produksi Pangan, Hortikultura/Perkebunan, Populasi Ternak, Produksi Perikanan.
     - 18 Indikator Program (IKK): AKE, AKP, Penanganan Desa Rentan, PSAT, Ketersediaan Energi, Produktivitas Pangan, Luas Panen, Bencana Lahan, Pembinaan Poktan, Produktivitas Horti/Kebun, Luas Panen Horti/Kebun, Populasi Kambing/Domba, Vaksinasi Zoonosis, Produksi Budidaya Ikan, Benih Ikan, Tangkap, Pokmaswas, dan Pengolahan Ikan.
  3. **Pembersihan Teks Lebai & Harmonisasi Visual:**
     - Menghapus total kata "tahun berjalan", "periode berjalan", "Tabel 4.5", "Tabel 4.7".
     - Merestrukturisasi 3 Kartu Ringkasan: Card 1 (9 Indikator Sasaran), Card 2 (18 Indikator Program), Card 3 (2025–2029 Periode Perencanaan).
     - Subjudul tabel dinamis: "Indikator Sasaran (IKU) tahun 2025 sampai 2030" vs "Indikator Program (IKK) tahun 2025 sampai 2030".
     - Tautan unduh PDF dinamis: `/renstra-2025-2029.pdf` dan `/renstra.pdf`.
  4. **Verifikasi:** `node --check dist/assets/renstra-v242.js` lolos (exit code 0).

### [ISSUE-054] Resolusi Minified React Error #321 & Reconciler DOM removeChild pada Halaman Renstra (ADR-073)
- **Status:** RESOLVED
- **Tanggal:** 2026-10-19
- **Komponen:** `dist/index.html`, `dist/assets/index-CI1XYnwk.js`, `src/server.js`, `dist/assets/renstra-v242.js`.
- **Deskripsi:** 
  Navigasi ke halaman `/renstra` memicu fatal error di peramban: `Minified React error #321 (Invalid Hook Call)` pada `e.useState` di `RenstraPage`, diikuti error sekunder DOM reconciler: `NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.`
- **Akar Masalah:**
  1. Seluruh 76 berkas chunk di `dist/assets/` mengimpor React menggunakan specifier `./index-CI1XYnwk.js`.
  2. Saat berkas utama diubah menjadi `index-v241.js` dan server memberikan respon *HTTP 301 Redirect* ke `v241`, peramban (Chromium/V8) menganggapnya sebagai modul berbeda sehingga menginstansiasi salinan kedua modul React.
  3. Pada instansiasi kedua, `ReactCurrentDispatcher.current` bernilai null (`Vs` dengan fungsi `z()`), sehingga pemanggilan `useState` melempar React Error #321.
  4. Saat `ErrorBoundary` mencoba meng-unmount subtree `<Suspense>` fallback di tengah error, DOM melempar `removeChild` exception.
- **Solusi & Verifikasi:**
  1. Menetapkan kembali `dist/assets/index-CI1XYnwk.js` sebagai root bundle kanonikal pada `dist/index.html` dan menyajikannya langsung (HTTP 200 OK) tanpa redirect 301 di `src/server.js`.
  2. Memastikan seluruh chunk (termasuk `renstra-v242.js`) mengimpor langsung dari `./index-CI1XYnwk.js`, menjamin 100% singleton instance React tunggal di seluruh aplikasi.
  3. Memisahkan kedua view ke sub-komponen ber-key stabil (`<Renstra2025View key="view-2025" />` & `<Renstra2019View key="view-2019" />`) serta memberikan key unik pada seluruh tabel dan baris data.
  4. **Verifikasi:**
     - `curl.exe -I "http://127.0.0.1:5173/assets/index-CI1XYnwk.js"` mengembalikan status 200 OK langsung.
     - `read_url_content` pada `http://127.0.0.1:5173/renstra` memuat HTML bersih tanpa redirect loop.
     - Pengujian sintaks AST `node --check` pada seluruh berkas lolos tanpa galat.

### [ISSUE-056] Resolusi Kegagalan Pemuatan Peta Choropleth & Deadlock 'Memuat Data Lahan' pada Dashboard Eksekutif Produksi
- **Status:** RESOLVED
- **Tanggal:** 2026-10-20
- **Komponen:** `dist/assets/pages-BdW-ZTL4.js`, `dist/assets/api-BxFGoia1.js`, `src/server.js`.
- **Deskripsi:** 
  Pada lingkungan produksi (`https://pertanian.sistemdata.id`), layer Area & Choropleth pada peta dashboard eksekutif tidak terwarnai (poligon abu-abu), sementara komponen *Top 15 Desa* dan *Analisa Lahan Kritis* macet permanen pada status *"Memuat data lahan..."* dan *"Memuat analisa lahan..."*. Di lingkungan dev, dashboard terbuka normal.
- **Akar Masalah:**
  1. **Head-of-Line Blocking `Promise.all`:** `Promise.all([b(), C(), w()])` mengikat data desa dengan pemanggilan CKAN OpenData (`/api/3/action/package_search?q=pertanian`). Upstream CKAN Pemkab kerap timeout (>10s) sehingga `setLahanDesa(t)` tidak pernah dieksekusi, menahan state desa pada array kosong `[]`.
  2. **Deadlock Cache Poisoning `localStorage`:** Key cache `api__v1_lahan_desa?regen=t410` tidak memvalidasi array kosong. Klien yang pernah menerima `[]` menyimpannya di `localStorage` dan pola stale cache mengembalikan `[]` secara instan ke React tanpa memicu re-render saat background fetch selesai.
  3. **QuotaExceeded & Stale GeoJSON Cache:** File `peta_desa_v3.geojson` (2,63 MB) disimpan di `localStorage` (`geojson_desa_cache`) yang melampaui limit 5 MB DOMStorage browser. Selain itu, cache tidak berversi sehingga klien lama tetap memuat poligon lama yang cacat.
- **Solusi & Verifikasi:**
  1. **Decoupled Data Fetching:** Memisahkan pemanggilan data lahan desa `C()` agar langsung mengeksekusi `setLahanDesa` (selesai dalam 46 ms) dengan proteksi fallback instan ke `/data/lahan-fallback.json` jika data kosong atau network gagal. Pemanggilan CKAN `b()` dan kabupaten `w()` dipisahkan secara mandiri.
  2. **Anti-Empty Array Cache Guard:** Menambahkan validasi di `api-BxFGoia1.js`: data dengan `Array.isArray(data) && data.length < 50` otomatis dibuang dari `localStorage` (`removeItem`), memaksa browser mengambil data segar dari API/fallback.
  3. **Auto-Purge Quota GeoJSON:** Menghapus `geojson_desa_cache` dari `localStorage` klien saat inisialisasi dan mendelegasikan caching 2,63 MB GeoJSON sepenuhnya ke HTTP Cache browser resmi (`Cache-Control: public, max-age=86400`).
  4. **Proksi CKAN Fallback di Backend:** Memangkas timeout proksi CKAN di `src/server.js` dari 15s menjadi 4s dengan graceful fallback ke snapshot lokal [dist/data/snapshots/ckan-catalog.json](file:///d:/Project/pertanian_main/dist/data/snapshots/ckan-catalog.json) (170 dataset) saat upstream Pemkab timeout atau offline.
  5. **Verifikasi:** 
     - Seluruh berkas lolos `node --check` (exit code 0).
     - Pengujian unit logic memverifikasi pembersihan poisoned key dan fallback 278 desa.
     - Pengujian server lokal memvalidasi respons HTTP 200 OK untuk seluruh endpoint API, GeoJSON, dan CKAN proksi.

---

## 🟡 Isu Terbuka / Rencana Peningkatan (OPEN)

### [ISSUE-055] Sinkronisasi & Migrasi Data Renstra Faktual ke Basis Data MySQL (Tabel renstra_target) dan Integrasi API Live
- **Status:** OPEN
- **Tanggal Dicatat:** 2026-10-19
- **Komponen:** `database/`, `src/routes/`, `src/lib/domains.js`, `dist/assets/renstra-v242.js`, `dist/renstra.pdf`, `dist/renstra-2025-2029.pdf`.
- **Deskripsi & Analisis Faktual:** 
  1. **Disparitas Data Periode 2025–2029 vs 2019–2022:**
     - Data Renstra 2025–2029 sudah terpetakan lengkap (27 indikator: 9 IKU Tabel 4.5 dan 18 IKK Tabel 4.7) dari berkas resmi 77 halaman.
     - Sebaliknya, data Renstra 2019–2022 pada antarmuka saat ini **sangat tereduksi (hanya 4 baris ringkas: Padi, Sapi, Kambing/Domba, Perikanan Budidaya)**.
  2. **Temuan Faktual Dokumen Resmi Renstra 2019–2022 (`dist/renstra.pdf` — 123 Halaman):**
     Setelah dilakukan pembacaan mendalam (*deep parse*) terhadap berkas resmi 123 halaman `dist/renstra.pdf`, ditemukan bahwa dokumen historis sebenarnya memiliki data yang jauh lebih kaya dan strategis:
     - **Tabel 4.1 (Halaman 60–63):** Memuat **42 Indikator Tujuan dan Sasaran** periode 2017–2022 lengkap dengan target tahunan beruntun (2017, 2018, 2019, 2020, 2021, 2022). Indikator ini mencakup komoditas unggulan dan ikonik khas Banjarnegara yang saat ini hilang dari antarmuka:
       - *Tanaman Pangan:* Padi (162.069 ton), Jagung (68.468 ton), Kedelai (381 ton), Ubi Kayu (222.919 ton).
       - *Hortikultura Unggulan Dieng & Dataran Rendah:* Kentang (148.543 ton), Salak Pondoh (275.300 ton), Pisang (11.757 ton), Durian (5.323 ton), Cabai (24.274 ton).
       - *Perkebunan:* Kopi (1.368 ton), Kelapa Dalam (9.125 ton), Kelapa Deres/Gula (10.392 ton), Teh (2.024 ton), Tembakau (135,6 ton), Lada (121,5 ton).
       - *Peternakan & Zoonosis:* Sapi (32.269 ekor), Kambing/Domba (263.925 ekor), **Domba Batur khas Dataran Tinggi Dieng (9.500 ekor)**, Status Bebas 4 Zoonosis (0 kejadian), Penurunan Kematian AI Unggas, Produksi Daging (4.785 ton), Unit Usaha Pra-NKV (3 unit).
       - *Perikanan:* Budidaya Ikan (41.901 ton), Benih Ikan (2,76 miliar ekor), Perikanan Tangkap (1.250 ton), Konsumsi Ikan (22,50 kg/kapita/tahun).
       - *Ketahanan & Cadangan Pangan:* Ketersediaan Pangan Utama (162.069 ton), Skor PPH (95), Cadangan Pangan (23%), Stabilitas Harga Pangan Pokok (10%), Cakupan Keamanan Pangan (85%), Pengawasan Pupuk & Pestisida.
       - *Ekonomi Makro & Kesejahteraan:* Pertumbuhan Sektor Pertanian (3% s.d. 4%), RTM Terfasilitasi (20 RTM), dan Lahan Tidur Tertanami (5 ha).
     - **Tabel 7.1 & 7.2 (Halaman 117–121):** Indikator Kinerja Sasaran Daerah & Program yang selaras dengan RPJMD 2017–2022.
  3. **Kekosongan Tabel Basis Data MySQL (`renstra_target`):**
     Tabel `renstra_target` di database `pertasis` saat ini hanya berisi 1 baris dummy (`Test indikator`, 100.00, tahun 2026) dan belum menyimpan baik data 2025–2029 maupun data 2019–2022.

- **Rencana Tindakan Komprehensif (Diagendakan Besok):**
  1. **Penyusunan Skema Database Fleksibel & Terstruktur:**
     Menyesuaikan skema tabel MySQL `renstra_target` (atau relasional) agar mendukung:
     - `periode`: `'2025-2029'` vs `'2019-2022'`
     - `kategori_sektor`: Tata Kelola, Pangan, Pertanian, Perkebunan, Peternakan, Perikanan
     - `jenis_tabel`: `'IKU'` (Sasaran/Makro), `'IKK'` (Program), `'KOMODITAS'` (Target Produksi Unggulan)
     - `no_urut`, `indikator`, `satuan`, `baseline`
     - Kolom target tahunan multi-tahun: `t1` s/d `t6` (dinamis sesuai periode tahun).
  2. **Ekstraksi & Migrasi Seeder Lengkap (`scripts/seed_renstra_target.js`):**
     - Memasukkan 27 Indikator resmi 2025–2029 (Tabel 4.5 & 4.7).
     - Memasukkan 42 Indikator komprehensif 2019–2022 (Tabel 4.1 dari PDF 123 halaman) termasuk komoditas Kentang, Salak, Domba Batur, Kopi, Teh, dan Ikan.
  3. **Penyediaan REST API Backend (`GET /api/v1/renstra/target`):**
     Menyajikan filter `?periode=2025-2029` dan `?periode=2019-2022` beserta filter kategori secara efisien dari MySQL.
  4. **Peningkatan Tampilan Antarmuka Renstra 2019–2022 di Frontend:**
     Menyejajarkan kualitas tab 2019–2022 agar menyajikan tabel komoditas unggulan dan program strategis lengkap tanpa reduksi berlebihan, tetap mematuhi kaidah anti-slop microcopy.

---

### Rencana Peningkatan Lainnya:
1. **Sinkronisasi Koreksi Anomali Salak 2024 Dinas:** Berkoordinasi dengan admin dinas untuk mengoreksi angka input 2024 pada file mentah CSV dinas di mana baris Kalibening tertulis 80.880 Ton dan Banjarmangu 9.230 Ton.
2. **Monitoring Log Berkala di Produksi:** Memantau berkas log aktivitas dan rotasi audit di server cPanel nargaroth setelah perilisan multi-role dasbor admin aktif.





