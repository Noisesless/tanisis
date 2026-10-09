# Peta Rute SISPERTANI (`routes.md`)

Dokumen ini memetakan seluruh rute antarmuka frontend (SPA) dan endpoint API backend, mencakup metode HTTP, handler, status autentikasi, dan rantai middleware.

---

## 1. Frontend Routes (Pages & Views)

| Route Path | Kategori Navigasi | Page Title | Auth | Status |
|---|---|---|---|---|
| `/` | Eksekutif & Spasial | Dashboard Eksekutif SISPERTANI | Publik | STABLE |
| `/sebaran/pangan` | Eksekutif & Spasial | Peta Geospasial WebGIS Tutupan Lahan | Publik | STABLE |
| `/prediction` | Sektor Komoditas | Prediksi Panen Padi & Palawija | Publik | STABLE |
| `/food-crops` | Sektor Komoditas | Produksi Tanaman Pangan (Padi & Palawija) | Publik | STABLE |
| `/komoditas-unggulan/:bidang` | Sektor Komoditas | Komoditas & Varietas Unggulan Dinamis per Bidang | Publik | STABLE |
| `/nilai-ekonomi/:bidang`| Sektor Komoditas | Valuasi Nilai Ekonomi Dinamis (Tab Terisolasi: /hortikultura hanya tab Hortikultura, /perkebunan hanya tab Perkebunan) | Publik | STABLE |
| `/horticulture` | Sektor Komoditas | Produksi Sayuran, Buah, Biofarmaka & Tanaman Hias (Responsive 1366x768 2x2 Matrix) | Publik | STABLE |
| `/plantation` | Sektor Komoditas | Analitik Perkebunan & Komoditas Khas | Publik | STABLE |
| `/ltt-katam` | Sektor Komoditas | Luas Tambah Tanam (LTT) & Kalender Tanam | Publik | STABLE |
| `/livestock` | Sektor Komoditas | Populasi Ternak Murni & Estimasi Ternak Dijual Hidup (inc. Domba Batur) | Publik | STABLE |
| `/peternakan/susu-kulit`| Sektor Komoditas | Produksi Utama & Hasil Ikutan per Spesies + Simulasi Lahan HPT | Publik | STABLE |
| `/livestock-flow` | Sektor Komoditas | Lalu Lintas Ternak, Pasar Hewan & Pemotongan RPH | Publik | STABLE |
| `/nilai-ekonomi/peternakan`| Sektor Komoditas | Nilai Ekonomi & Ekosistem Usaha Peternakan (4 Tab: Valuasi, UMKM Pakan, Poultry Shop Maps, Usaha Ber-NKV) | Publik | STABLE |
| `/fisheries` | Sektor Komoditas | Produksi Perikanan & Budidaya Air Tawar | Publik | STABLE |
| `/food-security` | Kebijakan & Ketapang | Ketersediaan Beras & Stok Lumbung Pangan | Publik | STABLE |
| `/fsva` | Kebijakan & Ketapang | Peta Kerawanan Pangan (FSVA Bapanas) | Publik | STABLE |
| `/supply-chain` | Kebijakan & Ketapang | Rantai Pasok & Distribusi Beras (RMU) | Publik | STABLE |
| `/price-volatility` | Kebijakan & Ketapang | Fluktuasi Harga Pasar & Inflasi Bahan Pangan | Publik | STABLE |
| `/renstra` | Kebijakan & Ketapang | Analisis Indikator Renstra Distankan & RKPD | Publik | STABLE |
| `/recommendations` | Kebijakan & Ketapang | Rekomendasi Kebijakan Pertanian Daerah | Publik | STABLE |
| `/farmers` / `/farmers?klaster=tani` | Kelembagaan & Data | Direktori Poktan, Gapoktan & KWT (2.687 lembaga binaan) | Publik | STABLE |
| `/farmers?klaster=ekonomi` | Kelembagaan & Data | Kelembagaan Ekonomi Petani (137 KEP) & Penyuluhan (36 Posluhdes, 156 PPS) | Publik | STABLE |
| `/farmers?klaster=sektoral` | Kelembagaan & Data | Kelembagaan Sektoral & Pendukung (Perikanan, UPJA, P4S, Juleha) | Publik | STABLE |
| `/government-assistance`| Kelembagaan & Data | Penyaluran Bantuan Pemerintah & Alsintan | Publik | STABLE |
| `/lahan` | Kelembagaan & Data | Statistik Luas & Penggunaan Lahan | Publik | STABLE |
| `/suitability` | Kelembagaan & Data | Analisis Kesesuaian Lahan Komoditas | Publik | STABLE |
| `/kecamatan` | Kelembagaan & Data | Profil Statistik 20 Kecamatan Banjarnegara (Peta Spasial & Rekapitulasi) | Publik | STABLE |
| `/kecamatan/:slug` | Kelembagaan & Data | Profil Statistik Komoditas & Wilayah Kecamatan Spesifik | Publik | STABLE |
| `/admin` | Portal Admin | Portal Dasbor Admin (Form Login Asimetris Sawah Banjarnegara & Kelola Excel RBAC 20 Domain) | Admin/Bidang | STABLE |
| `/info` | Bantuan & Info | Informasi Umum SISPERTANI | Publik | STABLE |
| `/manual` | Bantuan & Info | Panduan Penggunaan / Manual Book | Publik | STABLE |

---

## 2. API Routes (Endpoints)

> Catatan: Setiap rute di bawah tersedia secara otomatis pada dua jalur prefix: `/api/v1/*` dan `/sispertani-api/v1/*`.

| Method | Route Path | Handler | Auth | Purpose |
|---|---|---|---|---|
| `GET` | `/health` | `src/server.js` | Publik | Health check & verifikasi pool koneksi MySQL |
| `GET` | `/v1` | `src/server.js` | Publik | Metadata versi API & katalog rute publik |
| `GET` | `/3/*` | `src/server.js` | Publik | CKAN proxy ke Open Data Pemkab Banjarnegara |
| `GET` | `/v1/lahan/desa` | `src/routes/lahan.js` | Publik | Data penggunaan lahan tingkat desa |
| `GET` | `/v1/lahan/kabupaten` | `src/routes/lahan.js` | Publik | Data penggunaan lahan agregat kabupaten |
| `GET` | `/v1/padi/production` | `src/routes/padi.js` | Publik | Produksi dan luas panen padi per kecamatan |
| `GET` | `/v1/padi/history` | `src/routes/padi.js` | Publik | Historis tren produksi padi 2018–2024 |
| `GET` | `/v1/padi/sawah-ladang` | `src/routes/padi.js` | Publik | Komparasi produksi padi sawah vs ladang |
| `GET` | `/v1/palawija/jagung-ubi-kayu` | `src/routes/padi.js` | Publik | Produksi jagung dan ubi kayu |
| `GET` | `/v1/palawija/kacang-kedelai` | `src/routes/padi.js` | Publik | Produksi kacang tanah dan kedelai |
| `GET` | `/v1/palawija/ubi-kacang-hijau` | `src/routes/padi.js` | Publik | Produksi ubi jalar dan kacang hijau |
| `GET` | `/v1/hortikultura/sayuran-produksi` | `src/routes/hortikultura.js` | Publik | Produksi sayuran (kentang Dieng, kubis, wortel) |
| `GET` | `/v1/hortikultura/sayuran-luas` | `src/routes/hortikultura.js` | Publik | Luas panen tanaman sayuran |
| `GET` | `/v1/hortikultura/buah-produksi` | `src/routes/hortikultura.js` | Publik | Produksi tanaman buah-buahan |
| `GET` | `/v1/hortikultura/produksi-tahunan` | `src/routes/hortikultura.js` | Publik | Total produksi hortikultura tahunan |
| `GET` | `/v1/perkebunan/areal` | `src/routes/perkebunan.js` | Publik | Luas areal perkebunan per komoditas |
| `GET` | `/v1/perkebunan/produksi` | `src/routes/perkebunan.js` | Publik | Volume produksi perkebunan per kecamatan |
| `GET` | `/v1/peternakan/kecil` | `src/routes/peternakan.js` | Publik | Populasi Domba Batur, domba lokal, kambing |
| `GET` | `/v1/peternakan/besar` | `src/routes/peternakan.js` | Publik | Populasi sapi potong, perah, kerbau |
| `GET` | `/v1/peternakan/unggas` | `src/routes/peternakan.js` | Publik | Populasi ayam kampung, broiler, puyuh |
| `GET` | `/v1/peternakan/pemasukan` | `src/routes/peternakan.js` | Publik | Arus lalu lintas ternak masuk |
| `GET` | `/v1/peternakan/pengeluaran` | `src/routes/peternakan.js` | Publik | Arus lalu lintas ternak keluar |
| `GET` | `/v1/peternakan/luar-rph` | `src/routes/peternakan.js` | Publik | Pemotongan hewan di luar RPH |
| `GET` | `/v1/peternakan/daging-unggas` | `src/routes/peternakan.js` | Publik | Produksi daging ternak & karkas unggas |
| `GET` | `/v1/peternakan/susu-kulit` | `src/routes/peternakan.js` | Publik | Produksi susu segar (sapi & kambing) & kulit terpilah per jenis ternak |
| `GET` | `/v1/peternakan/hpt` | `src/routes/peternakan.js` | Publik | Data lahan hijauan pakan ternak (HPT) & kapasitas ST |
| `GET` | `/v1/peternakan/umkm-pakan` | `src/routes/peternakan.js` | Publik | Direktori pelaku usaha UMKM pakan ternak mandiri |
| `GET` | `/v1/peternakan/poultry-shop` | `src/routes/peternakan.js` | Publik | Sebaran toko peternakan & poultry shop per kecamatan |
| `GET` | `/v1/peternakan/nkv` | `src/routes/peternakan.js` | Publik | Register unit usaha bersertifikat Nomor Kontrol Veteriner |
| `GET` | `/v1/peternakan/domba-batur` | `src/routes/peternakan.js` | Publik | Populasi Domba Batur (ternak hias & bibit unggul Dieng dalam satuan ekor) |
| `POST`| `/v1/peternakan/entry` | `src/routes/peternakan.js` | Bearer (Admin/Peternakan) | Endpoint entry manual data bagian peternakan yang kosong (populasi, HPT, dll) |
| `GET` | `/v1/perikanan/jenis-ikan` | `src/routes/perikanan.js` | Publik | Data 10 jenis ikan definitif budidaya 2020–2025 (Lele, Nila, Gurami, Bawal, dll) |
| `GET` | `/v1/perikanan/budidaya-luasan` | `src/routes/perikanan.js` | Publik | Luas lahan vs produksi perikanan & rasio produktivitas per kecamatan |
| `GET` | `/v1/perikanan/hias` | `src/routes/perikanan.js` | Publik | Data perikanan ikan hias per kecamatan & varietas |
| `GET` | `/v1/perikanan/budidaya` | `src/routes/perikanan.js` | Publik | Produksi budidaya kolam, waduk, minapadi |
| `GET` | `/v1/perikanan/tangkap` | `src/routes/perikanan.js` | Publik | Hasil tangkap perairan umum Banjarnegara (mencakup alat tangkap Bubu) |
| `GET` | `/v1/perikanan/benih` | `src/routes/perikanan.js` | Publik | Produksi & penyaluran benih ikan air tawar (ekor & luas Ha) |
| `GET` | `/v1/perikanan/nilai-budidaya` | `src/routes/perikanan.js` | Publik | Valuasi nilai ekonomi budidaya ikan |
| `GET` | `/v1/perikanan/nilai-tangkap` | `src/routes/perikanan.js` | Publik | Valuasi nilai ekonomi perikanan tangkap |
| `GET` | `/v1/ekonomi/inflasi` | `src/routes/ekonomi.js` | Publik | Indeks inflasi bahan pangan |
| `GET` | `/v1/ekonomi/pasar` | `src/routes/ekonomi.js` | Publik | Direktori pasar komoditas daerah |
| `GET` | `/v1/ekonomi/sektor-ringkasan` | `src/routes/ekonomi.js` | Publik | Agregasi dinamis komoditas utama (ranking #1) & total nilai ekonomi per sektor, subsektor (sayuran, buah, biofarmaka, tanaman_hias), & tahun (Zero Dummy Data, ADR-009, ADR-014) |
| `GET` | `/v1/ekonomi/nilai-ekonomi` | `src/routes/ekonomi.js` | Publik | Valuasi nilai ekonomi tahunan resmi per bidang dari MySQL |
| `GET` | `/v1/komoditas-unggulan` | `src/server.js` | Publik | Daftar dinamis komoditas unggulan per bidang dari MySQL & tabel produksi riil (Zero Dummy Data) |
| `GET` | `/v1/komoditas-unggulan/per-kecamatan` | `src/routes/komoditas-unggulan.js` | Publik | Komoditas unggulan top-1 per kecamatan x 5 bidang (agregasi server-side mengikuti tahun) |
| `GET` | `/v1/lumbung` | `src/routes/ekonomi.js` | Publik | Fasilitas lumbung pangan dan kapasitas gudang |
| `GET` | `/v1/kelembagaan/kelompok-tani` | `src/routes/kelembagaan.js` | Publik | Sebaran kelompok tani (Poktan) per desa |
| `GET` | `/v1/kelembagaan/kth` | `src/routes/kelembagaan.js` | Publik | Data Kelompok Tani Hutan (KTH) |
| `GET` | `/v1/kelembagaan/pertanian` | `src/routes/kelembagaan.js` | Publik | Register kelembagaan pertanian resmi (2.177 Poktan, 232 KWT, 278 Gapoktan — Total 2.687 kelompok) |
| `GET` | `/v1/kelembagaan/kep` | `src/routes/kelembagaan.js` | Publik | Master data Kelembagaan Ekonomi Petani (137 KEP, modal, komoditas, badan usaha) |
| `GET` | `/v1/kelembagaan/posluhdes` | `src/routes/kelembagaan.js` | Publik | Data Pos Penyuluhan Desa (36 Posluhdes, SK pengukuhan, penyuluh swadaya) |
| `GET` | `/v1/kelembagaan/pps` | `src/routes/kelembagaan.js` | Publik | Data Penyuluh Pertanian Swadaya (156 PPS, keahlian teknis, kontak) |
| `GET` | `/v1/kelembagaan/rekap-validasi` | `src/routes/kelembagaan.js` | Publik | Rekapitulasi hasil validasi kemampuan kelas kelompok tani per kecamatan (SK Kadistan — 20 kecamatan) |
| `GET` | `/v1/kelembagaan/summary` | `src/routes/kelembagaan.js` | Publik | Ringkasan agregat statistik kelembagaan pertanian kabupaten |
| `GET` | `/v1/kelembagaan/perikanan` | `src/routes/kelembagaan.js` | Publik | Register kelembagaan perikanan resmi (Pokdakan, Poklahsar, Pokmaswas) |
| `GET` | `/v1/kelembagaan/juleha` | `src/routes/kelembagaan.js` | Publik | Data Juru Sembelih Halal (JULEHA) tersertifikasi RPH & RPU |
| `GET` | `/v1/kelembagaan/p4s` | `src/routes/kelembagaan.js` | Publik | Data Pusat Pelatihan Pertanian Perdesaan Swadaya (P4S) |
| `GET` | `/v1/kelembagaan/upja` | `src/routes/kelembagaan.js` | Publik | Data Usaha Pelayanan Jasa Alsintan (UPJA) |
| `GET` | `/v1/psat-pduk` | `src/routes/psat.js` | Publik | Hasil uji petik residu pestisida & keamanan pangan PSAT pasar |
| `POST`| `/v1/psat-pduk` | `src/routes/psat.js` | Bearer (Admin) | Input data pengawasan uji petik keamanan pangan PSAT-PDUK |
| `GET` | `/v1/ketahanan/fsva-desa` | `src/routes/ketahanan.js` | Publik | Data 16 indikator FSVA-Desa (10 data fisik/demografi, 5 rasio, IKP 0–100, komposit prioritas 1–6, ranking) 278 desa |
| `GET` | `/v1/ketahanan/fsva-desa/ringkasan` | `src/routes/ketahanan.js` | Publik | Ringkasan agregat capaian FSVA-Desa kabupaten (rata-rata IKP, total lahan, total miskin, sebaran prioritas) |
| `GET` | `/v1/ketahanan/fsva-kabupaten` | `src/routes/ketahanan.js` | Publik | Data 12 Indikator Peta Ketahanan & Kerentanan Pangan (FSVA Bapanas) |
| `GET` | `/v1/ketahanan/neraca-komposit` | `src/routes/ketahanan.js` | Publik | Neraca pangan komposit ketersediaan komoditas pokok daerah |
| `GET` | `/v1/ketahanan/harga-pasar` | `src/routes/ketahanan.js` | Publik | Data harian komoditas pasar tradisional Banjarnegara |
| `GET` | `/v1/st2023/desa` | `src/routes/st2023.js` | Publik | Rumah tangga petani/nelayan Sensus ST2023 |
| `GET` | `/v1/bantuan` | `src/routes/bantuan.js` | Publik | Alokasi dan penerima bantuan pemerintah |
| `POST`| `/v1/admin/login` | `src/routes/admin.js` | Publik (RL) | Autentikasi user admin/bidang & generate token (rate-limited) |
| `GET` | `/v1/admin/domains` | `src/routes/admin.js` | Bearer (RBAC) | 24 domain operasional terotorisasi (inc. Harga Pasar, FSVA, Neraca Pangan, PSAT PDUK, JULEHA, UPJA) |
| `GET` | `/v1/admin/template/:domain` | `src/routes/admin.js` | Bearer (RBAC) | Unduh template berkas Excel berpanduan (24 domain) |
| `GET` | `/v1/admin/export/:domain` | `src/routes/admin.js` | Bearer (RBAC) | Ekspor data MySQL aktif ke workbook Excel dengan kolom Sumber Data |
| `POST`| `/v1/admin/import/:domain` | `src/routes/admin.js` | Bearer (RBAC) | Impor berkas Excel & eksekusi upsert ke MySQL |
| `GET` | `/v1/admin/sync-log` | `src/routes/admin.js` | Bearer (Admin) | Riwayat log sinkronisasi dan impor |
| `GET` | `/v1/admin/paket` | `src/routes/admin.js` | Bearer (Admin) | Indeks berkas paket arsip template/ekspor (Excel & CSV) |
| `GET` | `/v1/admin/paket/:tipe/:file` | `src/routes/admin.js` | Bearer (Admin) | Unduh berkas paket arsip tertentu |
| `GET` | `/v1/admin/readiness` | `src/routes/admin.js` | Bearer (Admin) | Audit kesiapan data publik per bidang, status tabel database, & pelacakan fallback |
| `POST`| `/v1/ai/chat` | `src/routes/ai.js` | Publik (RL) | Proksi streaming Chatbot Si Pertani + Dynamic Year-Aware Live RAG (MySQL pertasis + Gemini, filter multi-tahun, grounding faktual tanaman hias, ikan hias, KWT) |

---

## 3. Middleware Chain

| Middleware | Diaplikasikan Pada | Tujuan & Fungsi |
|---|---|---|
| `x-powered-by disable` | Seluruh aplikasi | Menyembunyikan header `X-Powered-By: Express` untuk proteksi fingerprinting |
| `Security Headers (SP-011, SP-023)` | Seluruh permintaan HTTP | Proteksi browser: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` |
| `Sensitive File Guard (SP-007)` | Seluruh permintaan HTTP | Blokir akses langsung ke ekstensi `.sql`, `.env`, `.bak`, `.sh`, `.yml`, `.config`, dan dot-files (`403 Forbidden`) |
| `CORS Allowlist (SP-008)` | Seluruh permintaan HTTP | Memvalidasi header Origin terhadap konfigurasi `CORS_ORIGIN` atau wildcard |
| `express.json({ limit: "256kb" })` | API routes | Mem-parsing payload JSON (termasuk kredensial login admin) |
| `express.static(distRoot)` | Berkas frontend `./dist` | Melayani aset web statis (JS, CSS, ikon, GeoJSON) dengan cache header |
| `Rate Limiter Login (SP-014)` | `POST /api/v1/admin/login` | Membatasi maksimal 5 kali kegagalan login per 15 menit per IP |
| `Rate Limiter AI Chat (SP-014)`| `POST /api/v1/ai/chat` | In-memory sliding rate limiter maks. 30 request/menit per IP |
| `Bearer Auth Token (SP-006)` | Seluruh rute tulis & `/admin/*` | Memverifikasi keberadaan dan masa berlaku in-memory Bearer token |
| `RBAC Domain Guard (SP-024)` | `template`, `export`, `import`, `entry` | Memvalidasi kewenangan akun bidang terhadap domain yang diminta |
| `Multer MemoryStorage (SP-003)` | `POST /api/v1/admin/import/*` | Menangani upload berkas Excel multipart (limit 15 MB) secara efisien di memori |
| `Safe Error Masking (SP-019)` | Seluruh route API (`route()`) | Mengisolasi pesan internal error database saat HTTP 500 (mencegah kebocoran skema SQL) |
| `Trailing-Slash Normalizer` | `GET /kecamatan/`, `GET /sebaran/` | Mengalihkan rute bertrailing slash (302 redirect) ke path kanonikal untuk mencegah redirect loop di sisi klien |
| `SPA HTML Fallback` | Seluruh `GET` non-API non-ekstensi | Mengarahkan navigasi peramban ke `index.html` untuk mendukung routing klien |
