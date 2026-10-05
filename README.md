# SISPERTANI — Sistem Informasi Pertanian Kabupaten Banjarnegara

Dokumentasi Utama Sistem Informasi Pertanian, Perikanan, dan Ketahanan Pangan (SISPERTANI) Kabupaten Banjarnegara.

---

## 🌾 Ringkasan Sistem

**SISPERTANI** adalah platform terintegrasi untuk pengumpulan, pengolahan, analisis spasial, dan pelaporan statistik komoditas pertanian di lingkungan **Dinas Pertanian, Perikanan dan Ketahanan Pangan (Distankan KP) Kabupaten Banjarnegara**.

Sistem ini melayani dua antarmuka utama:
1. **Portal Publik & Analitik Spasial:** Peta interaktif GIS (tutupan sawah, ladang, kebun, sungai, jaringan jalan, dan batas wilayah administrasi desa/kecamatan), grafik tren komoditas 2018–2026, neraca pangan Bapanas, sensus pertanian ST2023, serta katalog dataset terbuka via proksi CKAN Open Data Banjarnegara.
2. **Dasbor Administrasi Data & RBAC:** Manajemen pembaruan data berkala dinas melalui unduh template Excel multi-sheet terstandar, ekspor data termutakhir, impor data dengan parser validasi natural-key (upsert), serta audit logging `sync_log`.

---

## 🧭 Struktur Navigasi & Tampilan Antarmuka (Pembaruan v2.4)

Sidebar aplikasi dirancang dengan pendekatan *Shape-First Architecture* dan prinsip anti-AI-slop yang membagi navigasi menjadi 4 pilar fungsional terurut dengan ikonografi resmi `lucide-react`:

1. **Eksekutif & Spasial:**
   - `Dashboard Eksekutif` (`/`) — Ringkasan metrik makro pangan, komoditas, dan grafik daerah.
   - `Peta Geospasial GIS` (`/sebaran/pangan`) — WebGIS interaktif tutupan sawah, ladang, sungai, jalan, dan batas wilayah.
2. **Sektor Komoditas (4 Bidang Teknis Simetris — Dual Submenus Dinamis):**
   - `Tanaman Pangan` — Produksi Padi & Palawija, Komoditas Unggulan Pangan (`/komoditas-unggulan/pangan`), Nilai Ekonomi Pangan (`/nilai-ekonomi/pangan`), LTT & Kalender Tanam (`/ltt-katam`), Prediksi Panen.
   - `Hortikultura & Perkebunan` — Produksi Sayuran & Buah, Komoditas Unggulan Hortikultura, Nilai Ekonomi Hortikultura, Analitik Perkebunan Khas, Komoditas Unggulan Perkebunan, Nilai Ekonomi Perkebunan.
   - `Peternakan & Keswan` — Populasi & Produksi Ternak, Komoditas Unggulan Peternakan, Nilai Ekonomi Peternakan, Susu & Kulit Ternak, Lalu Lintas & Pemotongan RPH.
   - `Perikanan Air Tawar` — Produksi & Budidaya Ikan, Komoditas Unggulan Perikanan, Nilai Ekonomi Perikanan (`/economic-value`).
3. **Kebijakan & Ketapang:**
   - `Ketahanan Pangan (Bapanas)` — Ketersediaan Beras, Peta FSVA, Rantai Pasok/RMU, Fluktuasi Harga Pasar.
   - `Perencanaan & Renstra` — Analisis Indikator Renstra Distankan, Rekomendasi Kebijakan, Sensus ST2023.
4. **Kelembagaan & Data:**
   - `Kelembagaan Tani` — Direktori Poktan, Gapoktan, dan Kewirausahaan KWT.
   - `Bantuan & Sarpras` — Penyaluran Bantuan Alsintan & Benih Pemerintah.
   - `Data Lahan & Geografi` — Penggunaan Lahan, Kesesuaian Lahan, dan Profil 20 Kecamatan.

> **Fitur Visual & Tata Letak Unggulan:**
> - **Unified Topbar & Avatar Dropdown:** Mengeliminasi tombol berceceran di header atas. Seluruh tautan utilitas (*Info*, *Panduan*, status profil *Guest*, dan akses *Portal Admin*) dirapikan ke dalam satu Avatar Dropdown interaktif setinggi `72px`.
> - **Higienitas Bundel Aset:** Direktori `./dist/assets` disanitasi bersih hanya memuat 106 berkas aktif terverifikasi (eliminasi 2.714 berkas artefak build usang, 22 CSS mati, dan 39 folder `_tmp`), menjamin kecepatan load tinggi dan eliminasi inkonsistensi cache.
> - **High-Contrast Active State:** Submenu aktif disorot dengan badge kontras tinggi Emerald-600 (`#059669`) dan titik putih menyala.
> - **Parent Indicator:** Kategori induk otomatis mendapatkan sorotan halus saat salah satu halamannya aktif.
> - **Floating Executive Card:** Dasar sidebar memuat kartu institusional resmi *"Portal Data Dinas — Distankan KP Banjarnegara"*, indikator koneksi `● Basis Data Terhubung`, serta tombol aksi *"Masuk Dasbor Admin"*.

## 🏛️ Arsitektur & Teknologi

| Komponen | Spesifikasi & Teknologi | Keterangan |
|---|---|---|
| **Runtime Backend** | Node.js (v20+ ES Modules) | Native `--env-file=.env` & `--watch` mode |
| **Framework HTTP** | Express.js 4.21.x | Minimalis, performa tinggi, zero-framework-bloat |
| **Basis Data** | MySQL / MariaDB (`pertasis`) | Pool koneksi `mysql2/promise`, decimalNumbers enabled |
| **Mesin Excel** | `exceljs` 4.4.x + `multer` 2.4.x | Dynamic schema generation, format styling, upsert |
| **Antarmuka Frontend** | Single Page Application (SPA) | Vite + React + MapLibre GL, disajikan dari `./dist` |
| **Peta & Spasial** | GeoJSON + MapLibre GL | Layer batas desa, kecamatan, sawah, jalan, hidrologi |
| **Proksi Open Data** | CKAN API Gateway | Terintegrasi ke `opendata.banjarnegarakab.go.id` |
| **Proses Produksi** | PM2 Process Manager | `ecosystem.config.cjs` (CloudPanel Node.js site) |

---

## 📂 Struktur Direktori Proyek

```text
pertanian_main/
├── .env                       # Variabel lingkungan & konfigurasi kredensial
├── app-context.md             # Snapshot status mesin AI & arsitektur proyek
├── ecosystem.config.cjs       # Konfigurasi deploy PM2 untuk server produksi
├── package.json               # Dependensi & script eksekusi
├── dist/                      # Bundle antarmuka frontend SPA statis & aset GIS
│   ├── assets/                # JS, CSS, dan aset terkompilasi
│   ├── index.html             # Entry point SPA publik
│   └── *.geojson              # Peta batas desa, kecamatan, sawah, jalan, sungai
├── src/                       # Sumber kode backend Node.js
│   ├── server.js              # Entrypoint server, routing ganda, static & SPA fallback
│   ├── db.js                  # Pool koneksi MySQL2 & helper query q()
│   ├── lib/
│   │   ├── domains.js         # Registri 15 domain data, pemetaan sheet, natural keys
│   │   ├── excel.js           # Engine pembaca & pembuat workbook template/export/import
│   │   ├── users.js           # Registri akun pengguna RBAC & perizinan bidang
│   │   └── helpers.js         # Wrapper error handling, validasi & format response
│   └── routes/
│       ├── admin.js           # Auth Bearer, rate limiter login, import/export/paket
│       ├── bantuan.js         # Program bantuan pemerintah, alokasi & dampak
│       ├── ekonomi.js         # Inflasi, pasar daerah, nilai ekonomi komoditas
│       ├── hortikultura.js    # Produksi & luas sayuran/buah kecamatan & kabupaten
│       ├── kelembagaan.js     # Kelompok tani (Poktan, Gapoktan) & KTH
│       ├── lahan.js           # Penggunaan lahan sawah & tutupan tanah
│       ├── padi.js            # Produksi padi sawah/ladang & palawija
│       ├── perikanan.js       # Budidaya kolam/waduk/minapadi, tangkap & benih
│       ├── perkebunan.js      # Areal & produksi komoditas perkebunan
│       ├── peternakan.js      # Populasi ternak, daging, telur, susu, RPH & aliran
│       └── st2023.js          # Sensus Pertanian 2023 tingkat desa
└── .docs/                     # Dokumentasi arsitektur standar lengkap
    ├── architecture.md        # Aliran data makro (Presentation -> Logic -> DB)
    ├── api-spec.md            # Spesifikasi seluruh endpoint REST API
    ├── database.md            # Skema tabel MySQL, natural key & relasi
    ├── routes.md              # Peta rute frontend & backend
    ├── dependency-graph.md    # Graf ketergantungan modul
    ├── deployment.md          # Panduan deployment lokal & CloudPanel
    ├── design-system.md       # Sistem desain UI & token visual
    ├── issues.md              # Catatan pelacakan isu & riwayat perbaikan
    └── quality_review.md      # Audit kualitas kode & keamanan
```

---

## ⚡ Panduan Instalasi & Menjalankan

### 1. Prasyarat Sistem
- **Node.js**: Versi 20.x atau lebih baru (direkomendasikan v22 LTS).
- **MySQL / MariaDB**: Berjalan pada port 3306 (misal melalui XAMPP atau instalasi native).
- **Database**: Database bernama `pertasis` sudah dibuat dan memiliki tabel data.

### 2. Konfigurasi Lingkungan (`.env`)
Salin atau pastikan file `.env` di root direktori memiliki konfigurasi yang valid:
```ini
PORT=5173
BIND_HOST=127.0.0.1
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=pertasis
CORS_ORIGIN=https://pertanian.sistemdata.id
DIST_DIR=./dist
PUBLIC_DIR=./dist
CKAN_PROXY=1

# Kredensial Dasbor Admin (RBAC)
ADMIN_USER=admin
ADMIN_PASS=C9145qbSjR
PASS_TANAMAN_PANGAN=TanamanPangan.2026
PASS_HORTI_PERKEBUNAN=HortiPerkebunan.2026
PASS_PETERNAKAN=Peternakan.2026
PASS_PERIKANAN=Perikanan.2026
```

### 3. Menjalankan Server Development
```bash
# Menjalankan server lokal dengan hot-reload
npm run dev

# Atau menjalankan mode standar
npm start
```
Server akan aktif di `http://127.0.0.1:5173`. Frontend dan backend dilayani secara simultan dari port yang sama.

### 4. Menjalankan di Server Produksi (PM2 / CloudPanel)
```bash
# Start service melalui PM2
pm2 start ecosystem.config.cjs

# Monitoring status dan log
pm2 status
pm2 logs sispertani-api
```

---

## 🔐 Manajemen Pengguna & Hak Akses (RBAC)

Sistem menerapkan pembatasan hak akses berbasis bidang teknis di lingkungan Distankan KP:

| Pengguna (Username) | Peran (Role) | Domain yang Dikelola |
|---|---|---|
| `admin` | **Administrator** | **Seluruh 17 Domain Operasional**, Audit Log (`sync_log`), Paket Arsip |
| `tanaman-pangan` | **Bidang Tanaman Pangan** | `padi`, `palawija`, `ltt-katam` |
| `horti-perkebunan` | **Bidang Hortikultura & Perkebunan** | `hortikultura`, `perkebunan` |
| `peternakan` | **Bidang Peternakan** | `peternakan` |
| `perikanan` | **Bidang Perikanan** | `perikanan` (11 sheet terpadu) |

Setiap sesi login menghasilkan **Bearer Token** in-memory dengan masa berlaku **12 jam** dan diamankan dengan rate limiting (maksimal 5 kali percobaan gagal per 15 menit).

---

## 📊 Registri 17 Domain Operasional & Sheet Excel

Semua domain data didefinisikan secara deklaratif di [`src/lib/domains.js`](file:///e:/Project/pertanian_main/src/lib/domains.js):

1. **bantuan-program:** Program bantuan, nominal, sumber dana (APBD/APBN), penerima, tingkat dampak.
2. **bantuan-alokasi:** Alokasi pagu bantuan APBD & APBN tahunan.
3. **bantuan-korelasi:** Korelasi nilai bantuan vs kenaikan produksi per sektor.
4. **padi:** Produksi padi sawah & ladang per kecamatan per tahun.
5. **palawija:** Jagung, kedelai, kacang tanah, ubi kayu, ubi jalar, kacang hijau.
6. **hortikultura:** Luas panen & produksi sayuran dan buah (per kecamatan & agregat kabupaten).
7. **perkebunan:** Luas areal & produksi komoditas perkebunan (kopi, teh, cengkeh, dll).
8. **peternakan:** Populasi ternak, produksi daging, telur, susu, kulit, lalu-lintas ternak, pemotongan RPH.
9. **perikanan:** 11 sheet terpadu: 10 jenis ikan budidaya definitif (Lele, Nila, Gurami, Bawal, Nilem, Mujair, Mas, Tawes, Patin, Tambakan), alat tangkap perairan umum (termasuk Bubu), produksi & luas benih ikan (Ha), pemeliharaan, waduk, kolam, minapadi, dan varietas ikan hias.
10. **lahan:** Luas penggunaan lahan kabupaten (sawah, tegal, pemukiman, hutan).
11. **lumbung:** Jumlah unit dan kapasitas lumbung pangan serta gudang per kecamatan.
12. **ekonomi:** Laju inflasi tahunan, pasar daerah, nilai ekonomi komoditas (tahunan/triwulan).
13. **kelembagaan:** Kelompok Tani (Poktan), Gapoktan, dan Kelompok Tani Hutan (KTH) per desa.
14. **st2023:** Data rumah tangga petani & perikanan hasil Sensus Pertanian 2023.
15. **renstra:** Target indikator Renstra Distankan tahun berjalan.
16. **kwt:** Data Kelompok Wanita Tani (KWT), status keaktifan, dan produk olahan.
17. **ltt-katam:** Luas Tambah Tanam (LTT) dan Kalender Tanam terpadu per kecamatan.

> ⚠️ **Aturan Arsitektur Baku — Anti-Over-Engineering Law (ADR-009 & ADR-010):**
> 1. **Komoditas Unggulan adalah Hasil Kalkulasi Otomatis (Single Source of Truth):**
>    Komoditas Unggulan **BUKAN** form input/upload manual bagi klien atau dinas. Komoditas unggulan dan pemeringkatan Top-1 dihitung secara otomatis oleh backend aplikasi dari agregasi data transaksi produksi primer (padi, palawija, hortikultura, perkebunan, peternakan, dan 10 spesies ikan budidaya). Form upload `komoditas-unggulan` di Dasbor Admin telah ditiadakan permanen untuk mencegah beban kerja ganda dinas dan risiko divergensi data (*data drift*).
> 2. **Cakupan Wilayah Pragmatis:**
>    Cakupan data distandardisasi pada tingkat **perkecamatan** dan **rekapitulasi kabupaten**. Sistem menolak *over-engineering* granularitas desa/kolam mikro jika tidak didukung pendataan primer resmi dinas.
> 3. **Toleransi Data Compang-Camping (Zero Dummy Data Law):**
>    Data transaksi yang belum diunggah atau masih kosong ditampilkan secara elegan sebagai *empty state* jujur ("Menunggu pembaruan data dinas"), tanpa pernah mengarang angka sintetis atau spesies buatan.

---

## 🌐 Ikhtisar REST API

Semua endpoint didaftarkan dengan dukungan dual-prefix:
- `/api/*` (jalur internal backend)
- `/sispertani-api/*` (jalur pemanggilan frontend SPA)

### Endpoint Publik (Read-Only)
- `GET /api/health` — Status kesehatan server & koneksi database MySQL.
- `GET /api/v1` — Informasi versi API dan daftar seluruh endpoint publik.
- `GET /api/v1/lahan/desa` & `/api/v1/lahan/kabupaten` — Statistik luas lahan.
- `GET /api/v1/padi/production`, `/padi/history`, `/padi/sawah-ladang` — Statistik padi.
- `GET /api/v1/palawija/jagung-ubi-kayu`, `/palawija/kacang-kedelai`, `/palawija/ubi-kacang-hijau` — Statistik palawija.
- `GET /api/v1/hortikultura/sayuran-produksi`, `/sayuran-luas`, `/buah-produksi` — Statistik hortikultura.
- `GET /api/v1/perkebunan/areal`, `/perkebunan/produksi` — Statistik perkebunan.
- `GET /api/v1/peternakan/populasi`, `/ternak/daging`, `/ternak/pemotongan` — Statistik peternakan & RPH.
- `GET /api/v1/perikanan/jenis-ikan` — Data definitif 10 spesies ikan budidaya 2020–2025.
- `GET /api/v1/perikanan/budidaya-luasan` — Luas bidang vs produksi & rasio produktivitas perikanan.
- `GET /api/v1/perikanan/hias` — Data varietas ikan hias per kecamatan.
- `GET /api/v1/perikanan/budidaya`, `/perikanan/tangkap`, `/perikanan/benih` — Statistik perikanan & alat tangkap (termasuk Bubu).
- `GET /api/v1/ekonomi/inflasi`, `/ekonomi/pasar`, `/lumbung` — Indikator makro ekonomi & logistik.
- `GET /api/v1/ekonomi/sektor-ringkasan` — Komoditas utama ranking #1 & nilai ekonomi sektor (kalkulasi dinamis, Zero Dummy Data).
- `GET /api/v1/ekonomi/nilai-ekonomi` — Valuasi nilai ekonomi tahunan resmi per bidang.
- `GET /api/v1/komoditas-unggulan` — Daftar dinamis komoditas unggulan per bidang (agregasi otomatis server-side).
- `GET /api/v1/komoditas-unggulan/per-kecamatan` — Top-1 komoditas per kecamatan x 5 bidang (agregasi server-side).
- `GET /api/v1/kelembagaan/kelompok-tani`, `/kelembagaan/kth` — Data kelembagaan tani.
- `GET /api/v1/st2023/desa` — Data Sensus Pertanian 2023 desa.
- `GET /api/v1/bantuan` — Data alokasi, program, dan sebaran bantuan.
- `POST /api/v1/ai/chat` — Proksi streaming Chatbot Si Pertani + Dynamic Live RAG (MySQL `pertasis` + Google Gemini).
- `GET /api/3/*` — Gateway proksi katalog CKAN Open Data Banjarnegara.

### Endpoint Dasbor Administrasi (Bearer Auth & RBAC)
- `POST /api/v1/admin/login` — Autentikasi akun admin/bidang.
- `GET /api/v1/admin/domains` — Mendapatkan daftar 17 domain operasional yang diizinkan untuk peran aktif.
- `GET /api/v1/admin/template/:domain` — Unduh workbook Excel template input kosong berpanduan (17 domain operasional).
- `GET /api/v1/admin/export/:domain` — Unduh data aktif MySQL dalam format workbook Excel (kolom Sumber Data).
- `POST /api/v1/admin/import/:domain` — Unggah file Excel untuk pembaruan data secara otomatis (upsert).
- `GET /api/v1/admin/sync-log` — Riwayat audit log aktivitas impor data.
- `GET /api/v1/admin/paket` — Indeks paket arsip data template/ekspor per bidang.

---

## 🚀 Paket Rilis Bersih (Clean Release)

Aplikasi telah disinkronkan dan disiapkan dalam paket siap deploy tanpa menunggu kolaborasi GitHub:
- **Paket Rilis:** `deploy_pertanian_clean_20261005.zip` (35.2 MB, reduksi 58% dari 84.4 MB)
- **Panduan Deploy Cepat:** [`README_DEPLOY.md`](file:///e:/Project/pertanian_main/README_DEPLOY.md) (Prosedur ganti folder cPanel / SFTP / SSH dan rollback < 1 menit)
- **Branch Rilis Git:** `release/2026-10-05-clean`

---

## 📚 Indeks Dokumentasi `.docs/`

Detail teknis mendalam tersedia pada direktori [`/.docs/`](file:///e:/Project/pertanian_main/.docs):
- [**Arsitektur Sistem**](file:///e:/Project/pertanian_main/.docs/architecture.md) — Aliran data, struktur micro-monolith, integrasi GIS dan CKAN.
- [**Spesifikasi API**](file:///e:/Project/pertanian_main/.docs/api-spec.md) — Rincian request/response, parameter query, schema JSON, dan kode error.
- [**Skema Basis Data**](file:///e:/Project/pertanian_main/.docs/database.md) — Struktur tabel, indeks, foreign key, dan aturan natural key.
- [**Peta Rute**](file:///e:/Project/pertanian_main/.docs/routes.md) — Matriks pemetaan route frontend dan endpoint backend.
- [**Graf Ketergantungan**](file:///e:/Project/pertanian_main/.docs/dependency-graph.md) — Keterkaitan antar-modul dan file beresiko tinggi.
- [**Panduan Deployment**](file:///e:/Project/pertanian_main/.docs/deployment.md) — Prosedur rilis, konfigurasi Nginx/CloudPanel, SSL, dan rollback plan.
- [**Sistem Desain Visual**](file:///e:/Project/pertanian_main/.docs/design-system.md) — Visual DNA, palet warna, tipografi, dan token UI.
- [**Catatan Isu & Pelacakan**](file:///e:/Project/pertanian_main/.docs/issues.md) — Log isu aktif dan riwayat perbaikan bug.
- [**Tinjauan Kualitas Kode**](file:///e:/Project/pertanian_main/.docs/quality_review.md) — Analisis keamanan, performa, dan standar kode.
