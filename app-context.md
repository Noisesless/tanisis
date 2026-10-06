<!-- app-context.md v2.1 — MACHINE-OPTIMIZED CONTEXT SNAPSHOT -->
<!-- Last: 2026-10-05T11:26:00+07:00 | Phase: Clean Release | Build: OK -->

## [APP]
name=SISPERTANI slug=pertanian_main type=web stack=node|express|mysql|vanilla-js
pkg=npm port=5173 url=http://127.0.0.1:5173

## [PALETTE] IMMUTABLE
bg=#ffffff surface=#f8fafc text=#0f172a accent1=#16a34a accent2=#0284c7
font_head=Inter font_body=Inter radius=8px nav=topbar theme=light

## [STATE]
phase=Clean Release done=ALL last=Pembersihan total leftover code, dead assets, arsip zip, file scraper _tmp, dan file analisa usang (206 MB dibebaskan)
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

[ADR-021] Kelembagaan Tani, Perikanan, Lembaga Pendukung & JULEHA (Dynamic Placeholders & Admin Uploads):
- Pemisahan Kelembagaan Pertanian & Perikanan: Memisahkan kelembagaan pertanian (Poktan, Gapoktan, KWT dengan ID Simluhtan & SK Pengukuhan) dan kelembagaan perikanan (Pokdakan, Poklahsar, Pokmaswas dengan ID KUSUKA KKP & komoditas budidaya/olahan) secara tegas ke tabel mandiri 'kelembagaan_pertanian' dan 'kelembagaan_perikanan'.
- Juru Sembelih Halal (JULEHA): Registrasi petugas potong bersertifikasi BNSP/MUI/BPJPH pada RPH/RPU Banjarnegara di tabel 'kelembagaan_juleha'.
- Lembaga Pendukung (P4S & UPJA): Pencatatan Pusat Pelatihan Pertanian dan Perdesaan Swadaya (P4S) terakreditasi BPPSDMP di 'kelembagaan_p4s' serta Usaha Pelayanan Jasa Alsintan (UPJA) beserta inventaris traktor/combine/transplanter di 'kelembagaan_upja'.
- Dynamic Placeholders & Zero Buzzword Law: Status data transparan 'Menunggu Finalisasi List Resmi Dinas' dengan banner dinamis dan tautan langsung ke Dasbor Admin (/admin) untuk unduh template .xlsx dan unggah data massal. Seluruh deskripsi antarmuka lugas tanpa bahasa lebay.
- Integrasi Admin Excel & DB Harmonisasi: 3 domain baru didaftarkan di lib/domains.js ('kelembagaan-pertanian', 'kelembagaan-perikanan', 'kelembagaan-pendukung'), skema DDL diintegrasikan ke production_migration_patch.sql, dan dump MariaDB dimutakhirkan di dump_production_pertanian_updated.sql (2,65 MB).

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


