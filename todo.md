# TODO: SISPERTANI — Data Readiness & Audit Dashboard

## Status: 100% Selesai (FSVA Desa 16 Indikator Bapanas & Integritas Native Web Selesai)
- [x] Analisis 5 berkas Excel validasi FSVA Bapanas 2024 (278 desa se-Banjarnegara)
- [x] Buat tabel MariaDB `fsva_desa_indikator` (16 variabel data fisik, demografi, rasio, IKP, komposit, ranking)
- [x] Buat skrip ETL parser `scripts/import_fsva_desa.js` (`npm run db:import-fsva`) yang dinamis untuk tahun berikutnya
- [x] Integrasikan runner impor FSVA ke `scripts/apply_production_patch.js` (`npm run db:patch`)
- [x] Tambahkan endpoint API `/api/v1/ketahanan/fsva-desa` & `/api/v1/ketahanan/fsva-desa/ringkasan` di `src/routes/ketahanan.js`
- [x] Integrasikan konteks data desa ke RAG Chatbot Si Pertani di `src/routes/ai.js`
- [x] Hapus tab 2 dummy/karangan AI di antarmuka web `/fsva` dan satukan menjadi dashboard 16-indikator lengkap
- [x] Pulihkan integritas native chunk bundler tanpa error `removeChild` / React error #321 di seluruh halaman
- [x] Unifikasi Kelembagaan KWT: eliminasi tabel kosong `kwt_kelompok_wanita_tani` dan domain redundan `kwt`, satukan 232 KWT ke master `kelembagaan_pertanian` (total 2.687 kelompok binaan)
- [x] Sinkronisasi seluruh dokumentasi utama (`.docs/database.md`, `.docs/routes.md`, `app-context.md`, `README.md`)

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
