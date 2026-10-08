<!-- app-context.md v2.1 — MACHINE-OPTIMIZED CONTEXT SNAPSHOT -->
<!-- Last: 2026-10-08T19:30:00+07:00 | Phase: Security Hardening & Documentation | Build: OK -->

## [APP]
name=SISPERTANI slug=pertanian_main type=web stack=node|express|mysql|vanilla-js
pkg=npm port=5173 url=http://127.0.0.1:5173

## [PALETTE] IMMUTABLE
bg=#ffffff surface=#f8fafc text=#0f172a accent1=#16a34a accent2=#0284c7
font_head=Inter font_body=Inter radius=8px nav=topbar theme=light

## [STATE]
phase=Security Hardening & Documentation done=ALL last=Hardening keamanan endpoint API (SP-001 s/d SP-026), proteksi autentikasi Bearer rute tulis, mitigasi kebocoran database NaN/500, security headers, dan perampingan footer non-slop (ADR-032)
build=OK issues=0

## [VISUAL_GATE]
icon_lib=lucide
🔴 SVG mentah→icon_lib | border logo→as-is | hardcode hex→var(--vibe-*)
🔴 font tunggal→2 font | bg:white hardcode→var(--vibe-background)
🔴 spacing acak→8pt grid | campur icon lib→ONE family
🔴 emoji / simbol mentah (🐄, 🌾, ▲, ▼, dll) = FORBIDDEN (Anti-AI-Slop Law) — gunakan Lucide resmi & pill badge
🔴 [Design Read]+Three Dials sebelum halaman baru
🔴 kontras text vs bg ≥ 4.5:1 | baca taste-skill sebelum visual
🔴 scratchpad_dom=FORBIDDEN | browser_gate=STRICT

## [FLOWS]
[API-Health]=GET /api/health→db check→status JSON
[Sektor-Ringkasan]=GET /api/v1/ekonomi/sektor-ringkasan?sektor=&tahun=→komoditas ranking + nilai ekonomi riil (Zero Dummy Data)
[Komoditas-Unggulan]=GET /api/v1/komoditas-unggulan→kalkulasi dinamis real-time multi-sektor dari tabel operasional MySQL (ternak_populasi, ternak_daging, ikan_produksi_jenis, padi, horti, perkebunan) dengan tahun & satuan adaptif (Zero Hardcode, Zero Dummy Law)
[Komoditas-Per-Kecamatan]=GET /api/v1/komoditas-unggulan/per-kecamatan?tahun=→top per kecamatan dinamis dari tabel produksi
[Nilai-Ekonomi]=GET /api/v1/ekonomi/nilai-ekonomi?bidang=→valuasi riil per bidang dari MySQL nilai_ekonomi_tahunan
[AI-Chat]=POST /api/v1/ai/chat→Rate limit→Dynamic RAG Query (MySQL + CKAN)→Gemini stream proxy→Direct Factual SSE
[Frontend]=GET /→express.static(dist)→SPA fallback index.html

## [PAGES] BUILT
/=SISPERTANI Banjarnegara=public=STABLE
/recommendations=Rekomendasi & Chatbot Si Pertani=public=STABLE
/komoditas-unggulan/:bidang=Komoditas Unggulan Dinamis per Bidang=public=STABLE
/nilai-ekonomi/:bidang=Valuasi Nilai Ekonomi Dinamis per Bidang=public=STABLE
/nilai-ekonomi/peternakan=4 Tab Ekosistem Usaha (Valuasi, UMKM Pakan, Poultry Shop Maps, Usaha Ber-NKV)=public=STABLE
/peternakan/susu-kulit=Produksi Utama & Hasil Ikutan per Spesies + Simulasi Lahan HPT=public=STABLE
/peternakan/populasi=Populasi Ternak Murni + Domba Batur + Ternak Dijual Hidup=public=STABLE
/ltt-katam=LTT & Kalender Tanam (Pangan)=public=STABLE

## [SCHEMA]
pertasis(bantuan,ekonomi,hortikultura,kelembagaan,lahan,padi,palawija,perikanan,ikan_produksi_jenis,perkebunan,peternakan,st2023,komoditas_unggulan,nilai_ekonomi_tahunan,kwt_kelompok_wanita_tani,ltt_katam,psat_pduk,harga_pasar_banjarnegara,fsva_indikator_kabupaten,neraca_pangan_komposit)

## [ADR]
[ADR-001] Express static + API dual mount: /api dan /sispertani-api dilayani oleh single server di port 5173
[ADR-002] Zero Dummy Data Law: komoditas/tahun tanpa data mengembalikan status empty tanpa mock array
[ADR-003] Sector Economic Widget: Komoditas utama & nilai ekonomi terpadu per sektor dinamis 100% dari MySQL/OpenData
[ADR-004] Dual Submenus Per Sektor: Setiap bidang memiliki 2 submenu mandiri di sidebar
[ADR-005] AI Gateway Security & Dynamic RAG: API key murni di .env, RAG mengambil live data MySQL pertasis & CKAN OpenData secara dinamis di dev dan production, tanpa template penolakan generik
[ADR-006] Zero Dummy Fish Species: Menghapus data sintetis jenis ikan di komoditas_unggulan & nilai_ekonomi_tahunan karena pendataan resmi Distankan KP hanya mencatat metode budidaya & alat tangkap
[ADR-007] Development View Architecture: Menggunakan build development rapi dengan Avatar Dropdown menu (default-CAKe9ffW.js), header ringkas 72px, 86 bundle aktif, serta pemindahan submenu LTT & Kalender Tanam ke Tanaman Pangan.
[ADR-008] Strict Zero-Empty Filter: Kategori, alat, atau kecamatan dengan data 0/kosong disembunyikan otomatis; modul Ikan Hias menampilkan status jujur menunggu upload data dinas tanpa angka tiruan.
[ADR-009] Single Source of Truth for Flagship Commodities (Anti-Over-Engineering Law): Komoditas Unggulan BUKAN form upload terpisah untuk klien/dinas, melainkan HASIL KALKULASI OTOMATIS aplikasi dari data produksi mentah (padi, palawija, horti, kebun, ternak, 10 jenis ikan). Form upload komoditas-unggulan di Admin resmi dihapus untuk mengeliminasi redundansi beban kerja dinas, risiko data ganda, dan inkonsistensi.
[ADR-010] Pragmatic Regional Scope & Sparse Data Tolerance: Lingkup data dibatasi pragmatis pada tingkat perkecamatan dan rekapitulasi kabupaten (anti-over-engineering). Data kosong/belum diunggah dinas ditampilkan jujur sebagai empty state tanpa angka fiktif.
[ADR-011] Production-Ready Reactive Session Sync & Header Avatar: Token dan sesi auth admin disimpan secara dual (localStorage & sessionStorage) dengan broadcast event 'sispertani:auth-change'. Layout master publik (default-CAKe9ffW.js) secara reaktif merender profil admin yang sedang login (nama bidang, role, status online sesi aktif, tombol dasbor admin, dan tombol logout instan), serta fallback aman ke Guest/Pengunjung saat belum login.
[ADR-012] Species-Centric Livestock Refactoring, Zero-Empty Law & Admin Entry:
- Pemisahan tegas data Populasi vs Produksi (halaman populasi murni ternak hidup).
- Submenu Produksi Utama & Hasil Ikutan dipilah per jenis hewan definitif: Daging (Sapi, Kerbau, Kambing, Domba Lokal, Ayam Kampung, Ayam Broiler, Itik, Puyuh, Kelinci), Telur (Ayam Layer, Ayam Kampung, Itik, Puyuh), Susu (Sapi Segar, Susu Kambing), dan Hasil Ikutan (Kulit Sapi, Kulit Kerbau, Kulit Kambing, Kulit Domba, Kulit Kelinci, Wol Domba Batur, Tulang & Tanduk). Domba Batur secara eksklusif diposisikan pada Populasi Ekor (sebagai ternak hias & bibit unggul yang dipasarkan per ekor hidup, bukan komoditas daging potong). Kulit Sapi dan Kerbau dipisah tegas tanpa kategori gabungan.
- Strict Zero-Empty Law: Baris data produksi bernilai 0 atau kosong difilter out dan tidak ditampilkan di tabel antarmuka publik.
- Anti-Bloat & Anti-AI-Slop Law: Menghilangkan seluruh kata lebay, buzzwords, dan emoji mentah dari seluruh halaman dan layer GIS.
- Nilai Ekonomi Peternakan & Ekosistem Usaha (4 Tab Mandiri): 1. Nilai Ekonomi Ternak, 2. UMKM Pakan Ternak, 3. Toko Peternakan & Poultry Shop, 4. Unit Usaha Ber-NKV dengan Zero Dummy Data (placeholder bersih yang siap menerima data riil).
- Admin Entry & 10-Sheet Excel Template: Menambahkan endpoint POST /api/v1/peternakan/entry dan 10 sheet template Excel di Dasbor Admin (/admin) yang memfasilitasi isian jumlah, banyaknya, wilayah kecamatan, tahun/bulan untuk seluruh komponen peternakan yang kosong.

[ADR-013] Laptop-First (1366x768) Responsive Scaling, Sector Tab Isolation & Horti Matrix:
- Tab Nilai Ekonomi Bidang: Halaman /nilai-ekonomi/hortikultura hanya menampilkan tab Hortikultura; /nilai-ekonomi/perkebunan hanya menampilkan tab Perkebunan.
- Responsivitas Layar 1366×768: Font scale dinamis html { font-size: 13.5px !important; } pada @media (max-width: 1440px) memastikan seluruh elemen rem mengecil proporsional (-15.6%) dan tidak saling berhimpitan pada laptop. Padding utama .print-main dirampingkan ke 1rem 1.25rem, tinggi header/brand disesuaikan ke 60px, dan padding sel tabel dibuat kompak.
- Tata Letak Filter Hortikultura: Grid tombol Sub-Sektor ditata menjadi matriks 2×2 (grid-cols-2 2xl:grid-cols-4 gap-1.5) dengan tombol selebar ~115px dan whitespace-nowrap, menjamin tombol "Tanaman Hias" & "Biofarmaka" muat rapi dalam satu baris tanpa terpotong atau tumpang tindih dengan ikon.
- Modul Hortikultura Sinkron: Integrasi Biofarmaka (m², kg) & Tanaman Hias (m², tangkai) terhubung ke API backend riil, dan sinkronisasi tahun agregat kabupaten mengikuti filter tahun utama.
[ADR-014] Dynamic Sub-Sector Economic Synchronization & Pure Sector Breadcrumb Isolation:
- Endpoint /api/v1/ekonomi/sektor-ringkasan mendukung parameter query subsektor (sayuran, buah, biofarmaka, tanaman_hias) untuk memfilter ranking #1 dan nilai ekonomi secara reaktif mengikuti tombol filter sub-sektor di /horticulture.
- Pemisahan tegas sektor Hortikultura dan Perkebunan di breadcrumb header bar ('HORTIKULTURA / Produksi Sayuran & Buah' vs 'PERKEBUNAN / Produksi Perkebunan') menggantikan label generik 'SEKTOR KOMODITAS', serta sanitasi teks usang gabungan.

[ADR-015] Unified Core Business Data Architecture & Production DB Harmonization:
- Klarifikasi Alur Data: MySQL/MariaDB adalah Single Source of Truth (SSOT). Data eksternal (CKAN OpenData, Bapanas) diakses on-demand/proxy untuk widget & AI RAG tanpa cron ingestion berlebih (Zero Bloat). Data operasional murni bersumber dari upload/import Excel Admin dan master statistik MariaDB.
- Harmonisasi DB Prod vs Dev: Sinkronisasi dua arah berhasil dilakukan. Data riil 2025 lahan_penggunaan dan ternak_telur (Itik) dari dump production berhasil dimerge ke basis data lokal; skema baru dev (14 tabel: RBAC users/roles, komoditas, harga_produsen, 10 jenis ikan, ekosistem peternakan) dibungkus ke dalam 'dist/production_migration_patch.sql' (patch non-destruktif) dan 'dist/dump_production_pertanian_updated.sql' (dump penuh terpadu 1,24 MB).

[ADR-016] Universal Kecamatan Filter on Nilai Ekonomi (Hortikultura & Perkebunan):
- Dropdown Kecamatan kini selalu aktif dan dapat diakses di submenu Nilai Ekonomi (/nilai-ekonomi/:bidang), menghapus penyembunyian selektor saat data resmi dinas terdeteksi.
- Dual-Scope Rendering: Pilihan 'Semua Kecamatan' menampilkan agregat resmi kabupaten dari dinas (disertai grafik sebaran 20 kecamatan); sementara pemilihan kecamatan spesifik (misal Batur, Kalibening, Banjarmangu, Pejawaran) menampilkan estimasi rincian nilai ekonomi komoditas kecamatan tersebut (volume produksi BPS Distankan × harga referensi pasar/petani).
- Multi-Year Horizon: Dropdown tahun menggabungkan seluruh horizon tahun yang tersedia dari dataset produksi BPS (2017–2024) dan tabel dinas.

[ADR-017] Universal Kecamatan Filter & Ecosystem Synchronization on Nilai Ekonomi Peternakan:
- Dropdown Kecamatan & Tahun diposisikan universal di atas seluruh 4 subtab Peternakan & Keswan (/nilai-ekonomi/peternakan), selalu tampak dan aktif (memuat 20 kecamatan resmi Banjarnegara + Semua Kecamatan tanpa terkunci/disabled).
- Multi-Subtab Reactive Synchronization:
  * Subtab 1 (Valuasi): Menyaring valuasi populasi ternak (BPS × bobot × harga pasar) per kecamatan terpilih vs agregat resmi kabupaten.
  * Subtab 2 (UMKM Pakan): Menyaring direktori pelaku usaha pakan ternak mandiri per kecamatan terpilih dengan badge counter unit.
  * Subtab 3 (Poultry Shop): Menyaring sebaran toko sapronak & obat hewan per kecamatan terpilih dengan badge counter unit.
  * Subtab 4 (Usaha Ber-NKV): Menyaring register unit usaha ber-NKV per kecamatan terpilih dengan badge counter unit.
- Friendly Empty State: Menyediakan pemberitahuan yang jelas jika suatu kecamatan belum memiliki pelaku usaha tertentu disertai tombol pintas [Lihat Semua] untuk kembali ke cakupan kabupaten.

[ADR-018] Pure Sector Tab Isolation & Pragmatic Source Attribution (Anti-Buzzword Law):
- Sector Tab Isolation: Di setiap submenu Nilai Ekonomi (/nilai-ekonomi/:bidang), navigasi tab kini 100% terisolasi hanya menampilkan sektor yang sedang dibuka (Pangan hanya menampilkan tab Pangan, menyembunyikan tab Horti/Perkebunan/Peternakan/Perikanan).
- Pragmatic Source Attribution: Menghapus label hiperbolis dan buzzword ("Resmi · Dinas", "data resmi Dinas", "input Dinas") dari seluruh kartu metrik, filter bar, dan tabel.
  * Jika bersumber dari basis data internal MariaDB: ditulis lugas "Aplikasi SISPERTANI" (database MariaDB tabel nilai_ekonomi_tahunan).
  * Jika bersumber dari data eksternal: secara eksplisit menyebutkan situs web rujukan resmi asalnya, yaitu "BPS Banjarnegara (banjarnegarakab.bps.go.id)", "Bappebti (bappebti.go.id)", atau "Satu Data Banjarnegara (opendata.banjarnegarakab.go.id)".

[ADR-019] Tanaman Pangan Restructuring (Komoditas, Produktivitas & LTT-Katam Sub-Navigation):
- Pengelompokan Komoditas: Mengganti 4 pasangan kaku lama menjadi 3 kelompok komoditas terpadu:
  1. Padi Sawah & Padi Ladang (tetap)
  2. Jagung & Umbi-umbian: Jagung, Ubi Kayu, Ubi Jalar, Talas, Porang (5 komoditas)
  3. Kacang-kacangan: Kacang Tanah, Kedelai, Kacang Hijau (3 komoditas)
- Endpoint Backend Dinamis: /api/v1/palawija/jagung-ubi dan /api/v1/palawija/kacang mendukung komoditas jamak dengan penjaminan ketersediaan properti tiap komoditas tanpa crash.
- Nomenklatur Produktivitas: Mengganti istilah 'Rata-rata Produksi' menjadi 'Produktivitas' dan 'Produktivitas (Ku/Ha)' sesuai standar Ditjen Tanaman Pangan Kementan.
- Navigasi Sub-Tab LTT & Katam: Menambahkan tab navigasi terpadu di bagian atas halaman Produksi Pangan (/food-crops) dan LTT & Kalender Tanam (/ltt-katam) untuk peralihan 1-klik tanpa overengineering.
[ADR-020] Ketahanan Pangan Enhancement & Keamanan Pangan Segar (PSAT-PDUK):
- Submenu Keamanan Pangan (/psat-pduk): Terhubung ke basis data MariaDB tabel psat_pduk dan Express API /v1/psat-pduk. Mengakomodasi 2 pilar pengawasan OKKPD: (1) Uji petik acak pasar/pedagang (rapid test residu pestisida, pemutih, formalin), dan (2) Akreditasi/registrasi izin edar pangan segar asal tumbuhan usaha kecil (PSAT-PDUK).
- FSVA 12 Indikator Bapanas (/fsva): Sub-tab switcher antara Peta FSVA Desa (6 Indikator) dan 12 Indikator Kabupaten Standar Bapanas (3 Pilar: Ketersediaan, Keterjangkauan, Pemanfaatan Pangan) berstatus transparan "Menunggu Data Integrasi Bapanas / OPD" (Zero Dummy Data Law).
- Data Harga Banjarnegara (/price-volatility): Tab switcher Pasar Lokal Banjarnegara (4 pasar pantauan: Banjarnegara, Karangkobar, Mandiraja, Klampok) berstatus "Menunggu Input Petugas Pasar" vs Referensi Bapanas Jateng.
- Rantai Pasok (/supply-chain): Banner status pemetaan koridor awal menunggu survei volume tonase logistik lapangan dinas.
- Ketersediaan Pangan Daerah (/food-security): Sub-tab Neraca Bahan Makanan (NBM) komposit 8 komoditas non-beras berstatus dinamis menunggu data dinas.

[ADR-022] Overhaul Kontainer, Grid Filter 12-Kolom & Tipografi Halaman Kelembagaan (/farmers):
- Eliminasi Monospace: Menghapus seluruh font-mono pada nomor register SIMLUHTAN, KUSUKA, BPPSDMP, dan sertifikat halal JULEHA, digantikan tipografi Inter dengan atribut tabular-nums dan badge kontur bersih.
- Grid Filter 12-Kolom Simetris: Penyelarasan form filter di seluruh tab (Pertanian, Perikanan, Pendukung, JULEHA, Rekap) sehingga sejajar rapi dalam 1 baris tanpa pergeseran elemen antartab.
- Filter Selektif Lembaga Pendukung & JULEHA: Penambahan dropdown kategori Lembaga Pendukung (Semua / P4S / UPJA) dan Status Sertifikasi JULEHA (Semua / Tersertifikasi / Dalam Pelatihan).
- KPI Cards Mandiri: 4 kartu statistik baru untuk Lembaga Pendukung (P4S Swadaya, Akreditasi BPPSDMP, UPJA Alsintan, Total Alsintan) dan 4 kartu untuk JULEHA (Total Personel, Tersertifikasi BNSP, Unit Tugas RPH/RPU, Cakupan Domisili).
- Desain Laptop-First (1366x768): Header halaman dirampingkan dengan badge metadata resmi, grafik dengan tick Inter tabular-nums, dan tabel ber-header sticky backdrop-blur dengan scrollbar kustom.

[ADR-023] Integrasi Basis Data Kelembagaan Tani Distankan KP & Dynamic Admin Excel Pipeline:
- Data Valid Primer Dinas: Mengintegrasikan seluruh data resmi kabupaten (2.409 Poktan termasuk 232 KWT, 278 Gapoktan, 137 KEP, 36 Posluhdes, dan 156 PPS) ke MariaDB pertasis via skrip ekstraksi ETL (scripts/extract_clean_kelembagaan.py & scripts/seed_kelembagaan_distankan.js) dengan penyaringan 299 baris subtotal.
- Patch Skema Database Non-Destruktif: Memperkaya kelembagaan_pertanian (+gapoktan_induk, +luas_lahan_ha, +penyuluh_pendamping, +penyuluh_hp) serta membuat tabel baru kelembagaan_kep, kelembagaan_posluhdes, dan kelembagaan_pps.
- Placeholder Semantik & Anti-Buzzword: Field kontak tanpa nomor telepon diberi badge resmi "Belum terdata", luas lahan kosong ditampilkan "-", kelompok tanpa angka anggota diberi badge "Dalam pemutakhiran" tanpa kata-kata lebay atau angka fiktif.
- Arsitektur Admin Dinamis: Domain kelembagaan-pertanian dan kelembagaan-pendukung di src/lib/domains.js mencakup seluruh tabel baru, memungkinkan admin Distankan KP mengunduh data terbaru, menyunting kontak/luasan di Excel, dan mengimpor ulang kapan saja secara mandiri.
- Perapian Navigasi Sidebar & Paginasi Tabel (/farmers):
  * Konsolidasi Submenu: Menghapus submenu redundan 'Kewirausahaan KWT' (yang sebelumnya hanya berisi 19 mock data contoh usang) dan menyatukannya ke dalam 'Direktori Kelembagaan Tani' (/farmers) yang memuat 2.409 kelompok terverifikasi (termasuk 232 KWT resmi). URL lawas /kewirausahaan/kwt secara otomatis diarahkan ke /farmers.
  * Paginasi Ringan & Dinamis: Menambahkan kontrol paginasi client-side di tabel register (25, 50, 100 baris per halaman) dengan penghitungan indeks 'Menampilkan X–Y dari Z data' serta tombol navigasi Sebelum/Berikutnya, mencegah lag render DOM dan menjaga antarmuka tetap responsif di laptop 1366px.

[ADR-024] Rekonstruksi Layout Navigasi 3 Klaster Kelembagaan Kabupaten (/farmers):
- Penyelesaian Tab Overload: Menata 8 entitas kelembagaan menjadi sistem navigasi terstruktur 2 tingkat:
  * Klaster 1: Tani & Gapoktan (SIMLUHTAN) -> Sub-tab: Poktan/KWT/Gapoktan (2.687 data), Rekapitulasi Validasi SK Kadistan (20 Kecamatan), dan Statistik Historis Desa.
  * Klaster 2: Ekonomi & Penyuluhan (Bina Usaha & Ketenagaan) -> Sub-tab: Kelompok Ekonomi Petani/KEP (137 unit), Pos Penyuluhan Desa/Posluhdes (36 unit), dan Penyuluh Pertanian Swadaya/PPS (156 orang).
  * Klaster 3: Sektoral & Pendukung -> Sub-tab: Kelembagaan Perikanan/Pokdakan (4 data placeholder), Lembaga Pendukung UPJA & P4S (4 data placeholder), dan Petugas JULEHA (4 data placeholder).
- Integrasi Penuh Berkas Dinas: Menambahkan tabel `kelembagaan_rekap_kecamatan` dan endpoint API `/v1/kelembagaan/rekap-validasi` untuk 20 kecamatan SK Kadistan (2.398 Poktan, 277 Gapoktan, kelas Pemula, Lanjut, Madya, Utama).
- Filter Selektif & Paginasi Terpadu: Penambahan dropdown bentuk badan usaha KEP, sinkronisasi penghitungan paginasi dinamis di semua tab, serta perapian dropdown kecamatan tanpa ikon tumpang-tindih.
- Konsistensi Permintaan Dinas: Mempertahankan seluruh skema dan view sektoral perikanan, UPJA/P4S, dan Juleha sesuai arahan Dispertan KP.

[ADR-025] Isolasi Tampilan Submenu Kelembagaan Navbar (/farmers):
- Eliminasi Penukaran 3-Tombol di Halaman: Menghilangkan kontainer tombol pengalih 3 klaster horizontal pada tampilan halaman view (/farmers) sesuai arahan pengguna.
- Akses Terisolasi Melalui Navbar: Pemilihan modul kelembagaan dilakukan eksklusif dari sidebar navigasi ('Tani, Gapoktan & KWT', 'Ekonomi & Penyuluhan', 'Sektoral & Pendukung').
- Sinkronisasi Header & Subtab Adaptif: Halaman secara otomatis mengenali query `?klaster=` untuk menampilkan judul modul, badge resmi, subtab Level 2 (misal KEP/Posluhdes/PPS pada Ekonomi, atau Poktan/Rekap SK/Statistik pada Tani), dan tabel yang relevan secara eksklusif.

[ADR-026] Harmonisasi Layout & Bentuk View Renstra & Rekomendasi Kebijakan (/renstra & /recommendations):
- Eliminasi Batasan Sempit: Menghapus pembatas kolom sempit `max-w-5xl mx-auto` sehingga halaman memanfaatkan ruang tata letak penuh (`w-full`) di dalam wadah master `.print-main` secara konsisten dengan halaman dashboard dan sektoral lainnya.
- Penyelarasan Geometri & Radius: Menerapkan standar `--radius-md: 8px` (`rounded-lg`) pada seluruh kartu metrik, panel ringkasan eksekutif, tabel evaluasi, dan kotak callout. Menghilangkan bentuk kotak bersudut tajam tanpa rounded.
- Kartu KPI Berstandar Border-Left-4: Menggantikan latar blok pastel pekat dengan kartu putih beraksen garis sisi kiri (`border-l-4 border-l-emerald-600`, `border-l-amber-500`, `border-l-blue-800`) dan tipografi berbobot resmi sesuai `design-system.md §3C`.
- Integrasi Tabel Seri Tahunan: Menyatukan kontainer tabel tren tahunan ke dalam alur kontainer utama (mengeliminasi perpecahan lebar layar ganda pada halaman rekomendasi).
- Tipografi Elegan & Bebas Harsh Uppercase: Merapikan hierarki tipografi teks menjadi gaya Executive Agritech yang natural dan mudah dibaca.

[ADR-027] Eliminasi AI Slop Eyebrow Badge & Pulsing Dot (/renstra, /recommendations, /farmers):
- Penghapusan Total Indikator Slop: Menghapus elemen tag eyebrow huruf kapital disertai pulsing dot hijau (`● PERENCANAAN & EVALUASI KINERJA DAERAH`, `● KEBIJAKAN & ANALITIKA PERTANIAN`, `● BIDANG SEKTORAL & LEMBAGA PENDUKUNG`) di atas judul <h1> pada halaman /renstra, /recommendations, dan /farmers.
- Penyelarasan Hierarki Header: Judul <h1> kini langsung menempati posisi teratas header kolom secara bersih, tenang, dan selaras dengan standar tata letak halaman lainnya (seperti /food-crops, /livestock, /plantation, /dashboard).

[ADR-028] Redesign Login Admin Portal (/admin) — Asymmetrical Layout & Agritech Photographic Identity:
- Komposisi Asimetris Seimbang: Mengubah tata letak form login `/admin` menjadi arsitektur split 2 kolom di mana sisi kiri lebih dominan (~55%) menyajikan identitas visual dan konteks institusional, sedangkan sisi kanan (~45%) menyediakan antarmuka formulir yang kompak, bersih, dan fokus.
- Citra Fotografi Pertanian Lokal: Menggantikan latar gandum/stok foto generic dengan fotografi persawahan Banjarnegara (`dist/img/sawah-login.jpg`) yang dipadukan dengan overlay gradien emerald-slate elegan serta kartu informasi kredensial yang rapi.
- Quick Role Selector & Form Interaktif: Menyediakan pemilih peran cepat (Administrator, Tanaman Pangan, Hortikultura & Perkebunan, Peternakan, Perikanan), toggle sembunyikan/tampilkan kata sandi, indikator keamanan SSL terenkripsi, dan feedback status login yang jernih.
- Kepatuhan Anti-AI-Slop & Responsivitas Layar: Mengeliminasi teks hiperbolis dan buzzword, menerapkan tipografi Inter tabular-nums, serta adaptif mulus mulai dari layar laptop 1366×768 hingga smartphone Android 3M (360/393/412px).

[ADR-029] React Router v6 Path Scoring & Client-Side Redirect Elimination (/kecamatan):
- Root Cause: Di file bundle 'dist/assets/index-CI1XYnwk.js', terdapat rute redirect '<Route path="/kecamatan/" element={<Navigate to="/kecamatan" replace />} />' tepat sebelum '<Route path="/kecamatan" element={<KecamatanPage />} />'. Dalam algoritma scoring React Router v6, rute bertrailing slash mendapat skor lebih tinggi (15 vs 13) dan dicocokkan lebih awal dengan regex yang sama, memicu infinite client-side redirect loop pada dirinya sendiri saat pengguna mengakses /kecamatan (menjadikan container #root kosong 0 byte).
- Solusi: Menghapus rute redirect redundan /kecamatan/ di sisi React Router. Normalisasi trailing-slash (/kecamatan/ -> /kecamatan) secara aman dan definitif telah ditangani di layer Express HTTP server (src/server.js: 302 redirect), sehingga halaman profil 20 kecamatan beserta peta spasial MapLibre kini ter-render sempurna tanpa blocking.

[ADR-030] Login Asymmetric Cross-Resolution Stabilization, Variable Shadowing Immunity & Dev DB Snapshot:
- Variable Shadowing Immunity: Me-refactor seluruh penamaan variabel state komponen admin ('dist/assets/admin-C9Dakcgq.js' & 'scripts/build_admin_view.js') ke identifier deskriptif ('token', 'sessionUser', 'isAdmin', 'loginUser', 'loginPass', 'loginErr', 'domsData', 'healthData', 'bantuanData', 'syncData', 'paketData', 'busyAction', 'actionErr', 'importResult'). Menghilangkan bentrok variabel 'f' (password vs icon users) dan 'd' (user setter vs icon clipboard) yang memicu galat 'createElement("")' saat pengguna login dengan akun bidang teknis non-admin.
- Cross-Resolution Layout Hardening: Menurunkan breakpoint panel visual kiri (latar foto sawah Banjarnegara) dari ≥1024px ke ≥768px (50:50 pada mode split window/tablet, 60:40 pada laptop 1366px+). Mengisolasi wadah formulir dalam kelas CSS khusus '.sispertani-form-card' ('max-width: 380px'), mencegah form merenggang 100% pada resolusi layar/jendela di bawah 1024px tanpa ketergantungan pada arbitrary classes Tailwind yang tidak terkompilasi.
- Database Dev Snapshot: Menghasilkan dump skema dan data MySQL/MariaDB dev 'pertasis' mutakhir dalam format UTF-8 standar ('database/dump_production_pertanian_updated.sql', 1.89 MB) mencakup seluruh 57 tabel terintegrasi.

[ADR-031] SQL Patch Portability & Unprivileged User Compatibility:
- Eliminasi Error 1227 (SET USER privilege): Menghapus klausa DEFINER=`root`@`localhost` dari VIEW log_aktivitas pada berkas patch dan dump basis data sehingga user standar cPanel/hosting ('pertalit') dapat mengimpor basis data tanpa membutuhkan privilege SUPER / root.
- Eliminasi Error 1292 (Incorrect datetime value): Mengonversi 653 kemunculan string format JavaScript 'Date().toString()' ('Wed Sep 23 2026...') menjadi format standar SQL datetime 'YYYY-MM-DD HH:MM:SS'.
- Eliminasi Error 1906 (Generated column value rejected): Mengeluarkan kolom kalkulasi otomatis 'nilai_rp' ('GENERATED ALWAYS AS (volume * harga_produsen) STORED') dari klausul INSERT tabel 'nilai_ekonomi_tahunan' agar dihitung secara otomatis oleh MariaDB tanpa pelanggaran strict SQL mode, serta menambahkan proteksi 'SQL_MODE=NO_AUTO_VALUE_ON_ZERO'.
- Verifikasi Produksi: Patch basis data berhasil diuji dan dieksekusi 100% tuntas di server produksi nargaroth ('pertanian.sistemdata.id').

[ADR-032] API Security Hardening, Write Protection & Clean Minimalist Footer:
- Proteksi Autentikasi Rute Tulis: Menambahkan guard `requireAdmin` (Bearer token) pada rute `POST /api/v1/peternakan/entry` dan `POST /api/v1/psat-pduk` serta verifikasi peran (SP-006 & SP-024) sehingga operasi tulis tidak dapat diakses anonim.
- Sanitasi Input & Eliminasi Kebocoran Database: Mengganti parsing nilai `Number()` dengan helper `toIntOrNull()` pada parameter `tahun` dan `kecamatan_id` di modul peternakan, ekonomi, dan ketahanan untuk mencegah nilai `NaN` diteruskan ke SQL driver (SP-026). Standardisasi wrapper `route()` agar galat status 500 mengembalikan pesan internal generik tanpa membocorkan pesan/struktur SQL ke client (SP-019).
- Browser Security Headers: Mengaktifkan middleware proteksi global `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, dan `Permissions-Policy` (SP-011, SP-023).
- Isolasi Host Proksi CKAN (Anti-SSRF): Memvalidasi target URL proksi CKAN `/3/*` agar strictly terkunci pada host resmi `opendata.banjarnegarakab.go.id` (SP-020).
- Koreksi Resolusi Path Paket Ekspor: Memperbaiki kalkulasi path traversal `PAKET_ROOT` di `routes/admin.js` agar tepat mengarah ke direktori `./database/template-import-export/`.
- Perampingan Footer Anti-AI-Slop: Menghilangkan tumpukan informasi berlebih dan tautan institusional verbose pada footer publik (`default-CAKe9ffW.js`), menggantinya dengan komposisi ringkas elegan: `© 2026 SISPERTANI Kab. Banjarnegara` | `v2.4.0`.

## [CREDS] DEV
admin=admin=C9145qbSjR
mysql=root=

## [NEXT]
[x] Analisis core bisnis sumber data & alur pengambilan data
[x] Komparasi mendalam dump_production_pertanian.sql vs MariaDB lokal
[x] Sinkronisasi data riil unggul dari production ke lokal (lahan 2025, telur Itik, presisi horti)
[x] Pembuatan production_migration_patch.sql & dump_production_pertanian_updated.sql (teruji 100% lulus uji)
[x] Penambahan dropdown kecamatan dan kalkulasi per kecamatan pada Nilai Ekonomi Hortikultura & Perkebunan
[x] Penambahan dropdown kecamatan universal dan sinkronisasi ekosistem usaha pada Nilai Ekonomi Peternakan & Keswan (4 Subtab)
[x] Isolasi tab sektor tunggal Pangan & pembersihan label sumber data (Aplikasi SISPERTANI / URL website resmi eksternal)
[x] Restrukturisasi kelompok komoditas pangan (Padi, Jagung & Umbi-umbian, Kacang-kacangan)
[x] Penyesuaian nomenklatur 'Produktivitas' dan integrasi sub-navigasi LTT & Kalender Tanam
[x] Submenu Keamanan Pangan (PSAT-PDUK): skema uji petik acak pasar & registrasi izin edar (DB + API + UI)
[x] FSVA: 12 Indikator Bapanas dengan status placeholder dinamis & rumus teknis lugas
[x] Fluktuasi Harga: Pemisahan data harga 4 pasar lokal Banjarnegara vs Bapanas Jateng
[x] Rantai Pasok & Ketersediaan: Integrasi status survei logistik lapangan & neraca pangan komposit
[x] Kelembagaan Tani & Perikanan: Pemisahan Pertanian (Poktan/Gapoktan/KWT) vs Perikanan (Pokdakan/Poklahsar/Pokmaswas)
[x] Juru Sembelih Halal (JULEHA): Registrasi tersertifikasi kompetensi halal RPH/RPU di MariaDB & UI
[x] Lembaga Pendukung: Integrasi data P4S (akreditasi BPPSDMP) & UPJA (inventaris alsintan)
[x] Placeholder Dinamis & Admin Excel Template: 3 domain admin, form upload dinamis, YAGNI, zero buzzword
[x] Redesign View Dasbor Admin (/admin): Layout responsif & role-aware, Quick Role selector pada form login, Tab Kategori & Live Search untuk 20 domain, Ruang Kerja Bidang tanpa alert sempit, YAGNI, zero buzzword
[x] Perbaikan Font & Kontainer Kelembagaan (/farmers): Poktan, Gapoktan, KWT, Juleha, P4S, UPJA, Perikanan (Anti-AI-Slop, no-mono, 12-col grid, laptop-first)
[x] Integrasi Data Kelembagaan Valid Distankan KP: 2.409 Poktan, 278 Gapoktan, 137 KEP, 36 Posluhdes, 156 PPS (ETL Seeder, DB Patch, API Endpoint, Placeholder Resmi, Admin Excel Sync)
[x] Pemisahan 3 Submenu Kelembagaan Tani di Navbar & Sinkronisasi URL Dua Arah (/farmers?klaster=tani, /farmers?klaster=ekonomi, /farmers?klaster=sektoral)
[x] Perbaikan Peta Blank /sebaran/ & /kecamatan/ (Penyediaan Web Worker maplibre-gl, Seeding Padi 2025 & Palawija, Peta Spasial 20 Kecamatan)
[x] Isolasi Tampilan View Kelembagaan Sesuai Submenu Navbar Terpilih (Penghapusan Switcher 3-Tombol di Halaman)
[x] Harmonisasi Layout, Lebar & Geometri Halaman /renstra & /recommendations Sesuai design-system.md
[x] Eliminasi AI Slop Eyebrow Badge & Pulsing Dot pada Header /renstra, /recommendations, dan /farmers
[x] Redesign Halaman Login Admin (/admin) Asimetris dengan Latar Foto Sawah Banjarnegara & Form Ringkas Resmi (ADR-028)
[x] Eliminasi Infinite Client-Side Redirect Loop /kecamatan/ pada React Router v6 Bundle (ADR-029)
[x] Resolusi Variable Shadowing Role Dashboard & Layout Asimetris Login Responsif Cross-Resolution (ADR-030)
[x] Pembaruan Dump Database Development MariaDB pertasis UTF-8 (dump_production_pertanian_updated.sql)
[x] Eksekusi & Validasi Migrasi Basis Data di Server Produksi (ADR-031: Status 100% Aman & Terverifikasi)
[x] Audit Keamanan & Hardening Endpoint API (SP Compliance 100% Lolos Uji)
[x] Perampingan Footer Non-Slop (Minimalis, Elegan, Versi 2.4.0)
[x] Penyusunan Dokumentasi Keamanan Sistem (.docs/security-audit.md)






