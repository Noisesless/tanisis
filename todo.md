# TODO: SISPERTANI — Data Readiness & Audit Dashboard

## Status: 100% Selesai (Bantuan Uang/Barang, 17 Domain Unifikasi, Uji Upload 1-Sheet, & Optimasi Peta Selesai)
- [x] Pemisahan Bantuan Uang vs Barang (Paket): Penambahan kolom `jenis_bantuan` (Uang/Barang), `jumlah_barang`, `satuan_barang` di tabel `bantuan_program`, dukungan nilai_rupiah 0/NULL, serta sinkronisasi template impor/ekspor Excel
- [x] Normalisasi & Unifikasi 17 Domain Admin: Eliminasi redundansi domain (ST2023 desa diserap ke Kelembagaan, 3 kartu Bantuan disatukan, 3 kartu Tanaman Pangan disatukan) dengan backward compatibility alias
- [x] Uji Faktual Upload 17 Domain & Toleransi 1-Sheet: 17 dari 17 domain lulus uji impor 100%, konfirmasi faktual bahwa upload 1 sheet pada domain multi-sheet tetap tersimpan ke database tanpa error
- [x] Optimasi Performa Peta Eksekutif & Resolusi HTTP/2 Protocol Error: Gzip compression di server Express (pangkas 81.2% GeoJSON), browser caching 1 hari, salin dashboard.png, fetch timeout 30s, dan rendering layer resilient
- [x] Skrip Patch Produksi Otomatis: Integrasi `database/patch_bantuan_dan_domain_2026.sql` ke `scripts/apply_production_patch.js` (`npm run db:patch`) dengan proteksi idempotensi dan filter komoditas unggulan
- [x] Analisis 5 berkas Excel validasi FSVA Bapanas 2024 (278 desa se-Banjarnegara)
- [x] Buat tabel MariaDB `fsva_desa_indikator` (16 variabel data fisik, demografi, rasio, IKP, komposit, ranking)
- [x] Buat skrip ETL parser `scripts/import_fsva_desa.js` (`npm run db:import-fsva`) yang dinamis untuk tahun berikutnya
- [x] Integrasikan runner impor FSVA ke `scripts/apply_production_patch.js` (`npm run db:patch`)
- [x] Tambahkan endpoint API `/api/v1/ketahanan/fsva-desa` & `/api/v1/ketahanan/fsva-desa/ringkasan` di `src/routes/ketahanan.js`
- [x] Integrasikan konteks data desa ke RAG Chatbot Si Pertani di `src/routes/ai.js`
- [x] Hapus tab 2 dummy/karangan AI di antarmuka web `/fsva` dan satukan menjadi dashboard 16-indikator lengkap
- [x] Pulihkan integritas native chunk bundler tanpa error `removeChild` / React error #321 di seluruh halaman
- [x] Unifikasi Kelembagaan KWT: eliminasi tabel kosong `kwt_kelompok_wanita_tani` dan domain redundan `kwt`, satukan 232 KWT ke master `kelembagaan_pertanian` (total 2.687 kelompok binaan)
- [x] Normalisasi Relasional Kecamatan-Desa-FSVA: drop tabel usang `fsva_indikator_kabupaten`, arahkan domain Admin ke `fsva-desa` (278 desa), tambahkan kolom kode BPS pada kecamatan & desa serta Foreign Key `kecamatan_id` & `desa_id` pada `fsva_desa_indikator` (100% matched)
- [x] Paginasi & Dual-Tab Log Dasbor Admin: integrasikan tabel `activity_logs` (log aktivitas pengguna) dan `sync_log` (riwayat pembaruan), terapkan paginasi server-side 10 entri/halaman agar load halaman ringan
- [x] Pelacakan ISSUE-034 & ISSUE-035: dokumentasikan investigasi caching browser/Nginx pada dasbor admin produksi, terapkan normalisasi URL aset JS anti-duplikasi React singleton (Error #321), serta proteksi notranslate DOM
- [x] Self-Healing Activity Logs & 25 Domain Admin: implementasi auto-creation tabel activity_logs di produksi, penambahan domain komoditas-unggulan & harga-produsen di /admin
- [x] Sinkronisasi seluruh dokumentasi utama (`.docs/database.md`, `.docs/routes.md`, `.docs/deployment.md`, `.docs/issues.md`, `app-context.md`, `README.md`)

### Fase 1: Backend Audit Kesiapan Data (/api/v1/admin/readiness)
- [x] Buat fungsi audit `getReadinessAudit()` di `src/lib/domains.js` yang menghitung baris tabel-tabel di `DOMAINS` secara batch via `COUNT(*)` dan mendeteksi ketersediaan fallback disk
- [x] Daftarkan endpoint `GET /api/v1/admin/readiness` di `src/routes/admin.js` dengan guard `requireAdmin` + `requireAdminRole`
- [x] Lakukan verifikasi faktual respon JSON endpoint via script/curl (memastikan response time < 50ms, aktual 38ms)

### Fase 2: Antarmuka Dasbor Super Admin (scripts/build_admin_view.js)
- [x] Tambahkan pemanggilan `fetch('/api/v1/admin/readiness')` saat sesi `isAdmin === true`
- [x] Rancang 4 kartu ringkasan kesiapan (Persentase Kesiapan Publik, Sektor Mandiri, Sektor Penyangga/Fallback, Sektor Belum Ada Data)
- [x] Rancang tabel matriks status sektor yang memetakan menu frontend, status data (🟢 Mandiri / 🟡 Penyangga / 🔴 Belum Ada), jumlah baris, tombol filter katalog, dan tombol salin format tagihan data ke clipboard
- [x] Kompilasi ulang aset admin ke `dist/assets/admin-C9Dakcgq.js` via `node scripts/build_admin_view.js`

### Fase 3: Verifikasi Faktual & Sinkronisasi Dokumentasi
- [x] Uji fungsionalitas dan tampilan dasbor di `http://127.0.0.1:5173/admin`
- [x] Verifikasi kepatuhan anti-slop (bahasa lugas, tanpa jargon berlebihan, responsif 1366x768 & mobile)
- [x] Perbarui dokumentasi `.docs/routes.md`, `.docs/api-spec.md`, `.docs/architecture.md`, dan `app-context.md`
- [x] Git commit dan push ke repositori GitHub

### Fase 4: Rekonstruksi Kesesuaian Lahan Multi-Sektor (/suitability & ADR-050)
- [x] Rancang dan bangun modul evaluasi `src/lib/kesesuaian.js` mengagregasi 5 tabel MariaDB (padi, palawija, horti, perkebunan, lahan_desa)
- [x] Daftarkan endpoint `GET /api/v1/lahan/kesesuaian` di `src/routes/lahan.js`
- [x] Rekonstruksi antarmuka `/suitability` (4 Tab Sektor, selektor kecamatan/tahun simetris, 4 KPI cards border-l-4, radar karakteristik, bar chart komparasi, dan matriks interaktif)
- [x] Resolusi issue Recharts bundle export `Ne` (ISSUE-036) via `scripts/build_suitability_view.js` dan verifikasi import 100% via `scripts/verify_imports.js`
- [x] Sinkronisasi dokumentasi utama (`.docs/api-spec.md`, `.docs/routes.md`, `.docs/database.md`, `.docs/dependency-graph.md`, `.docs/issues.md`, `app-context.md`, `todo.md`)
- [x] Git commit dan push ke repositori GitHub

### Fase 5: Pembaruan Halaman Panduan Penggunaan (/manual)
- [x] Perbarui tabel daftar menu lengkap (24 menu aktif aplikasi) dengan fungsi faktual tanpa buzzwords
- [x] Perbarui panduan fitur per halaman utama (Dashboard, Kesesuaian Lahan multi-sektor, FSVA 16-indikator desa, Komoditas Unggulan, Tanaman Pangan, Hortikultura, Peternakan, Perikanan, Kelembagaan, Profil Kecamatan, dan Portal Admin)
- [x] Susun skrip build deterministik `scripts/build_manual_view.js` dan verifikasi seluruh modul import via `scripts/verify_imports.js` (100% valid)
- [x] Validasi sintaks AST dan pengujian serving HTTP 200 OK pada dev server lokal (port 5173)
- [x] Git commit dan push ke repositori GitHub

---

### Fase 6: Optimasi Berkas GeoJSON & True-Lazy Loading Peta Dashboard Eksekutif (ADR-051)
- [x] **Audit Ukuran Berkas GeoJSON Aktif:** Analisis ukuran berkas GeoJSON di `dist/` (`peta_desa_v3.geojson`, `peta_kecamatan.geojson`, `jalan.geojson`, `sungai.geojson`, `sawah.geojson`, `kebun.geojson`, `ladang.geojson`) yang dimuat oleh dashboard utama dan peta sebaran. Mengidentifikasi pemborosan koordinat 14 desimal, elevasi Z nol, dan ketiadaan kompresi gzip akibat bypass Nginx HTTP/2.
- [x] **Penyederhanaan Geometri & Presisi Koordinat:** Pangkas presisi angka koordinat floating-point menjadi 6 desimal (~11 cm akurasi), 2D flattening (hapus elevasi Z `0`), serta pembersihan metadata shapefile mentah melalui skrip deterministik `scripts/optimize_geojson.js` (`npm run geojson:optimize`). Total ukuran berkas terpangkas dari 23,30 MB menjadi 13,72 MB (-41,1% / hemat 9,57 MB) dan batas desa 100% presisi.
- [x] **Optimasi Strategi Pemuatan (True-Lazy Layer Loading):** Refaktorisasi `dist/assets/pages-BdW-ZTL4.js` via `scripts/patch_pages_lazy_layers.js` dengan mengeliminasi bulk download latar belakang `setTimeout 2,2s` (18 MB). Layer berat (`jalan`, `sawah`, `kebun`, `ladang`) kini hanya diunduh secara on-demand saat pengguna mencentang toggle layer bersangkutan di Leaflet LayersControl.
- [x] **Uji Performa Pemuatan & Integritas:** Beban awal transfer peta terpangkas drastis dari 23,3 MB menjadi ~3,3 MB (-85,8%), `peta_desa_v3.geojson` (2,48 MB) muat aman dalam kuota 5 MB `localStorage`, integritas 278 desa & 20 kecamatan 100% valid, dan respons HTTP serving 200 OK dengan browser caching 1 hari.

---

### Fase 7: Resolusi GeometryCollection Leaflet & Restorasi Peta Dashboard Eksekutif (ADR-053)
- [x] **Investigasi Akar Galat Leaflet:** Mendeteksi `TypeError: can't access property "length", n.geometries is undefined` pada `pages-BdW-ZTL4.js` akibat pemangkas koordinat `scripts/optimize_geojson.js` hanya memproses `coordinates` dan mengabaikan `geometries` pada desa bertipe `GeometryCollection` (Gemuruh, Gumelemkulon, Petambakan).
- [x] **Perbaikan Skrip Optimasi & Restorasi Peta Desa:** Memperbarui `scripts/optimize_geojson.js` untuk merekursi seluruh poligon dalam `geometries` dengan presisi 6 desimal, serta memulihkan data 3 desa pada `dist/peta_desa_v3.geojson`.
- [x] **Defensive Guard Leaflet:** Menambahkan proteksi fail-safe `(n.geometries ? n.geometries.length : 0)` di `dist/assets/pages-BdW-ZTL4.js`.
- [x] **Validasi & Verifikasi:** 278 fitur desa lulus uji struktur GeoJSON 100%, peta dashboard eksekutif ter-render normal tanpa modal galat.

---

### Fase 8: Penyelarasan Judul Navbar vs Halaman & Unifikasi Tab Baku (ADR-054)
- [x] **Audit Faktual 36 Rute Navigasi:** Mengidentifikasi 12 ketidaksinkronan nama menu sidebar vs judul `<h1>` halaman, 5 variasi bentuk tab terfragmentasi, dan sisa pembungkus kartu ilustrasi domain.
- [x] **Generasi Favicon Resmi Terpadu:** Membangun multi-resolusi `.ico` (16x16 s/d 256x256) dan `.png` langsung dari master resmi `dist/logo.png`, menggantikan ikon default Vite SVG di `dist/index.html`.
- [x] **Unboxing Ilustrasi Global `Ft`:** Menghilangkan kotak kartu artifisial (`rounded-xl shadow-sm border w-28 h-20`) pada komponen `Ft` (`index-CI1XYnwk.js`) menjadi unboxed illustration murni (`h-14 sm:h-16 w-auto object-contain max-h-[60px]`).
- [x] **Penyelarasan 36 Judul Kanonikal:** Menyinkronkan seluruh menu di `dist/assets/site-B5h-x_N5.js` dengan judul `<h1>` pada masing-masing chunk halaman terkait.
- [x] **Standardisasi Heading Semantic `<h1>`:** Mengubah elemen `<h2>` non-standar menjadi `<h1>` pada rute analitik (`/supply-chain`, `/price-volatility`, `/fisheries`, `/food-security`, `/government-assistance`).
- [x] **Unifikasi Tab ke Executive Segmented Pill:** Mengubah seluruh tab di `/food-crops`, `/ltt-katam`, `/sebaran/bidang`, `/farmers`, `/peternakan/susu-kulit`, `/livestock-flow`, dan `/sensus` ke standar baku `flex flex-wrap items-center gap-1.5 p-1 rounded-lg border border-slate-200 bg-slate-100/90 shadow-sm w-fit` dengan item aktif putih bersinar dan inaktif lembut.
- [x] **Harmonisasi `/livestock-flow` & `/sensus`:** Menghubungkan PageHeader berilustrasi domain dan menata ulang tab data dari form input berbingkai menjadi tab navigasi utama.

---

### Fase 9: Standardisasi Filter Card Sektoral & Eliminasi Dummy Data (ADR-066 s/d ADR-070)
- [x] **Metrik Penuh Hortikultura Buah (ADR-066):** Membuka kunci 3 metrik penuh sub-sektor buah (`Luas Ha`, `Produksi Ton`, `T/Ha`), menghubungkan estimasi agronomis dinamis, dan menambahkan endpoint `GET /api/v1/hortikultura/buah-luas`.
- [x] **Standardisasi Filter Card Tanaman Pangan (ADR-067):** Menata ulang filter card `/food-crops` ke format baku 4-kolom sejajar dengan tema warna `bg-emerald-700 text-white shadow-xs` dan eliminasi footer filter redundan.
- [x] **Standardisasi Filter Card Perikanan (ADR-068):** Menata ulang filter card `/fisheries` ke layout 4-kolom sejajar dengan rentang 2-kolom untuk 5 kategori dalam tipografi Title Case dan warna tema hijau institusional.
- [x] **Eliminasi Tab Redundan & Optimasi Font Food Crops (ADR-069):** Menghapus tab switcher redundan di atas filter card dan menyingkat label komoditas (`Padi`, `Jagung & Umbi`, `Kacang-kacangan`) dengan font `text-[11px] xl:text-xs` serta atribut tooltip `title` agar tidak terpotong.
- [x] **Eliminasi Data Tiruan & Empty State LTT Katam (ADR-070):** Menghapus 15 baris dummy mockup `F=[]`, banner disclaimer oranye, dan tab switcher di `/ltt-katam`. Mengimplementasikan Empty State resmi berjarak bantalan lega (`py-16 px-6`, padding 64px 32px), serta menambahkan endpoint backend kueri riil `GET /api/v1/ltt-katam`.

---

### Fase 10: Integrasi Renstra Dual-Periode, Pembersihan AI Slop & Resolusi Error React 321 / removeChild (ADR-072 & ADR-073)
- [x] **Integrasi Renstra Dual-Periode Faktual (ADR-072):** Menambahkan selektor periode interaktif (`Renstra 2025–2029` dan `Renstra 2019–2022`). Mengintegrasikan 9 Indikator Sasaran (IKU Tabel 4.5) dan 18 Indikator Program (IKK Tabel 4.7) hasil ekstraksi faktual salinan PDF 77 halaman resmi DISTANKANKP Banjarnegara.
- [x] **Pembersihan Teks Lebai & AI Slop:** Mengeliminasi seluruh kata-kata lebai ("tahun berjalan", "periode berjalan", "Tabel 4.5", "Tabel 4.7") serta merestrukturisasi 3 KPI cards menjadi metrik ringkas: 9 Indikator Sasaran, 18 Indikator Program, dan Periode 2025–2029 (5 tahun).
- [x] **Harmonisasi 5-Slot Layout & Unduh PDF Dinamis:** Menyelaraskan layout kedua periode (Header & Dropdown, 3 Kartu Metrik, 4 Sasaran Strategis 01-04, Tabel Kinerja, Catatan Sumber). Tautan unduh PDF secara dinamis mengarah ke `/renstra-2025-2029.pdf` dan `/renstra.pdf`.
- [x] **Resolusi Minified React Error #321 & Reconciler removeChild (ADR-073):** Menetapkan kembali `index-CI1XYnwk.js` sebagai root bundle kanonikal yang diimpor 76 chunk dan disajikan langsung (HTTP 200 OK) di `dist/index.html` dan `src/server.js`, menjamin 100% singleton instance React tanpa duplikasi modul atau kegagalan hook.
- [x] **Stabilitas DOM Reconciler:** Memisahkan kedua view ke sub-komponen ber-key stabil (`<Renstra2025View key="view-2025" />` & `<Renstra2019View key="view-2019" />`) serta memberikan key unik pada seluruh tabel dan baris data.
- [x] **Sinkronisasi Seluruh Dokumentasi Utama:** Memperbarui 9 berkas blueprint `.docs/` (`routes.md`, `architecture.md`, `dependency-graph.md`, `quality_review.md`, `issues.md`, dll), `app-context.md`, `todo.md`, dan `README.md`.

