# Graf Ketergantungan Modul SISPERTANI (`dependency-graph.md`)

Dokumen ini memetakan derajat ketergantungan antar-berkas kode di dalam sistem, mengidentifikasi berkas kritis (*critical core*), berkas berdampak tinggi (*high impact*), serta berkas daun (*leaf files*).

---

## 🔴 Critical Files (Paling Banyak Di-import — JANGAN Ubah Tanpa Review)

| File | Imported By (Count) | Tipe | Alasan Kritis |
|---|---|---|---|
| [`src/db.js`](file:///d:/Project/pertanian_main/src/db.js) | 12 berkas (semua routes & lib) | Database Core | Mengelola pool koneksi MySQL, konfigurasi decimalNumbers, dan helper kueri `q()`. Kerusakan di sini melumpuhkan seluruh API. |
| [`src/server.js`](file:///d:/Project/pertanian_main/src/server.js) | Entrypoint (Root) | Server Core | Inisialisasi Express, CORS, dual-mount API router, static handler, dan SPA fallback. |
| [`src/lib/domains.js`](file:///d:/Project/pertanian_main/src/lib/domains.js) | 3 berkas (`admin.js`, `excel.js`, tests) | Schema & Registry | Mengatur 16 domain operasional (ADR-009), kunci upsert, pemetaan tabel-sheet, normalisasi nama kecamatan & desa, serta alias geografi. |
| [`dist/assets/index-CI1XYnwk.js`](file:///d:/Project/pertanian_main/dist/assets/index-CI1XYnwk.js) | 76 chunk modul frontend | Frontend Core Bundle | Entry point React 19, router SPA, dan shared dispatcher. Wajib tetap sebagai modul kanonikal tanpa redirect 301 untuk mencegah duplikasi instance React. |

---

## 🟡 High-Impact Files (Ubah = Efek Luas)

| File | Depends On | Used By | Impact Level | Catatan Risiko |
|---|---|---|---|---|
| [`src/lib/excel.js`](file:///e:/Project/pertanian_main/src/lib/excel.js) | `exceljs`, `domains.js`, `db.js` | `src/routes/admin.js` | High | Mengatur parsing dan formatting seluruh berkas Excel input/output dinas (termasuk kolom `Sumber Data`). Perubahan logika dapat merusak impor massal. |
| [`src/lib/users.js`](file:///e:/Project/pertanian_main/src/lib/users.js) | `.env` variables | `src/routes/admin.js` | High | Mengatur model RBAC, pemetaan akun dinas ke domain, dan fungsi validasi `roleAllowsDomain`. |
| [`src/routes/admin.js`](file:///e:/Project/pertanian_main/src/routes/admin.js) | `db.js`, `domains.js`, `users.js`, `excel.js`, `multer` | `src/server.js` | High | Gerbang mutasi data dan autentikasi. Kegagalan di sini mempengaruhi integritas data dan hak akses pengguna. |
| [`.env`](file:///e:/Project/pertanian_main/.env) | Sistem & OS | Seluruh proses Node.js | Critical | Menyimpan kredensial basis data, port dev/prod, CORS, `GEMINI_API_KEY`, dan kata sandi RBAC. |

---

## 🟢 Leaf Files (Aman Diubah — Minimal Dependency)

| File | Purpose | Tingkat Isolasi |
|---|---|---|
| [`src/routes/komoditas-unggulan.js`](file:///e:/Project/pertanian_main/src/routes/komoditas-unggulan.js) | Endpoint kueri komoditas unggulan per kecamatan x 5 bidang | Terisolasi pada domain Komoditas |
| [`src/routes/padi.js`](file:///e:/Project/pertanian_main/src/routes/padi.js) | Endpoint kueri data komoditas padi dan palawija | Terisolasi pada domain Tanaman Pangan |
| [`src/routes/hortikultura.js`](file:///e:/Project/pertanian_main/src/routes/hortikultura.js) | Endpoint kueri sayuran dan buah-buahan | Terisolasi pada domain Hortikultura |
| [`src/routes/perkebunan.js`](file:///e:/Project/pertanian_main/src/routes/perkebunan.js) | Endpoint kueri komoditas perkebunan | Terisolasi pada domain Perkebunan |
| [`src/routes/peternakan.js`](file:///e:/Project/pertanian_main/src/routes/peternakan.js) | Endpoint kueri populasi ternak, RPH, dan produk hewani | Terisolasi pada domain Peternakan |
| [`src/routes/perikanan.js`](file:///e:/Project/pertanian_main/src/routes/perikanan.js) | Endpoint kueri budidaya, tangkap, dan benih ikan | Terisolasi pada domain Perikanan |
| [`src/routes/ekonomi.js`](file:///e:/Project/pertanian_main/src/routes/ekonomi.js) | Endpoint kueri inflasi, pasar daerah, nilai ekonomi, dan lumbung pangan | Terisolasi pada domain Ekonomi & Logistik |
| [`src/routes/kelembagaan.js`](file:///e:/Project/pertanian_main/src/routes/kelembagaan.js) | Endpoint kueri Poktan, Gapoktan, dan KTH | Terisolasi pada domain Kelembagaan |
| [`src/routes/st2023.js`](file:///e:/Project/pertanian_main/src/routes/st2023.js) | Endpoint kueri data sensus ST2023 tingkat desa | Terisolasi pada domain Sensus |
| [`src/routes/bantuan.js`](file:///e:/Project/pertanian_main/src/routes/bantuan.js) | Endpoint kueri program dan sebaran bantuan pemerintah | Terisolasi pada domain Bantuan |
| [`src/routes/lahan.js`](file:///e:/Project/pertanian_main/src/routes/lahan.js) | Endpoint kueri penggunaan lahan, tutupan lahan & evaluasi kesesuaian | Mengimpor `src/lib/kesesuaian.js` |
| [`src/lib/kesesuaian.js`](file:///e:/Project/pertanian_main/src/lib/kesesuaian.js) | Modul evaluasi kesesuaian lahan multi-sektor & korelasi tutupan lahan fisik | Digunakan oleh `src/routes/lahan.js` |
| [`src/routes/ai.js`](file:///d:/Project/pertanian_main/src/routes/ai.js) | Proksi streaming Chatbot Si Pertani + Dynamic Live RAG (MySQL, Offline NLG, dan KB) | Mengimpor `src/lib/ai-nlg.js` & `src/lib/ai-offline-kb.js` |
| [`src/lib/ai-nlg.js`](file:///d:/Project/pertanian_main/src/lib/ai-nlg.js) | Rule-Based Natural Language Generator untuk sintesis narasi ramah & terstruktur | Digunakan oleh `src/routes/ai.js` (ADR-060) |
| [`src/lib/ai-offline-kb.js`](file:///d:/Project/pertanian_main/src/lib/ai-offline-kb.js) | Pustaka pengetahuan offline komoditas Banjarnegara, SOP hama, & panduan SIMLUHTAN | Digunakan oleh `src/routes/ai.js` (ADR-060) |
| [`scripts/seed_ketahanan_pangan.js`](file:///d:/Project/pertanian_main/scripts/seed_ketahanan_pangan.js) | Skrip seed idempoten akun ketahanan-pangan ke database users | Skrip CLI pemeliharaan DB (ADR-061) |
| [`tests/ai-fallback.test.js`](file:///d:/Project/pertanian_main/tests/ai-fallback.test.js) | Unit test otomatis modul AI Offline KB dan Natural Language Generator | Test runner |
| [`tests/endpoint.test.js`](file:///d:/Project/pertanian_main/tests/endpoint.test.js) | Integration test endpoint streaming SSE `/api/v1/ai/chat` | Test runner |
| [`src/lib/data-sources.js`](file:///d:/Project/pertanian_main/src/lib/data-sources.js) | Katalog pemetaan sumber data publik vs rujukan luar per domain | Digunakan oleh `src/routes/admin.js` (ADR-063) |
| [`src/lib/helpers.js`](file:///d:/Project/pertanian_main/src/lib/helpers.js) | Utilitas pembungkus rute `wrapRoute()` dan respon standar | Utility murni |
| [`src/routes/renstra.js`](file:///d:/Project/pertanian_main/src/routes/renstra.js) | Endpoint kueri target indikator kinerja Renstra dinamis (`/target`, `/summary`) | Terisolasi pada domain Renstra & RKPD (ADR-075) |
| [`scripts/migrate_renstra_schema.js`](file:///d:/Project/pertanian_main/scripts/migrate_renstra_schema.js) | Skrip migrasi DDL multi-tahun tabel `renstra_target` MySQL | Skrip CLI pemeliharaan DB (ADR-075) |
| [`scripts/seed_renstra_target.js`](file:///d:/Project/pertanian_main/scripts/seed_renstra_target.js) | Skrip seeding 87 data faktual resmi Renstra 2019–2022 & 2025–2029 | Skrip CLI pemeliharaan DB (ADR-075) |

---

## 🔗 Diagram Rantai Impor Kritis

```text
src/server.js
  ├── src/db.js
  ├── src/routes/admin.js
  │     ├── src/db.js
  │     ├── src/lib/users.js
  │     ├── src/lib/domains.js
  │     │     └── src/db.js
  │     └── src/lib/excel.js
  │           ├── src/db.js
  │           └── src/lib/domains.js
  ├── src/routes/komoditas-unggulan.js ──> src/db.js
  ├── src/routes/padi.js ───────────────> src/db.js
  ├── src/routes/hortikultura.js ────────> src/db.js
  ├── src/routes/perkebunan.js ──────────> src/db.js
  ├── src/routes/peternakan.js ──────────> src/db.js
  ├── src/routes/perikanan.js ───────────> src/db.js
  ├── src/routes/ekonomi.js ─────────────> src/db.js
  ├── src/routes/kelembagaan.js ─────────> src/db.js
  ├── src/routes/st2023.js ──────────────> src/db.js
  ├── src/routes/bantuan.js ─────────────> src/db.js
  ├── src/routes/lahan.js ───────────────> src/db.js & src/lib/kesesuaian.js
  ├── src/routes/ai.js ──────────────────> src/db.js, src/lib/ai-nlg.js, src/lib/ai-offline-kb.js & Google Gemini API
  └── /api/v1/komoditas-unggulan ─> src/db.js (Tabel komoditas_unggulan & ikan_produksi_jenis)
```

---

## 🖥️ Frontend Shared Component Dependencies (86 Active Clean Assets)

```text
dist/index.html (Entry Point)
  ├── dist/assets/index-CI1XYnwk.js (React 19 Root & SPA Router)
  │     ├── dist/assets/default-CAKe9ffW.js (Layout Master & Interactive Avatar Dropdown Header)
  │     │     ├── dist/assets/site-B5h-x_N5.js (Sidebar Navigation Structure)
  │     │     └── Shared Utility Icons & User Menu Logic
  │     ├── dist/assets/pages-BdW-ZTL4.js (/ -> Dashboard Eksekutif: Decoupled Fetching, Peta Choropleth, Top 15 Desa, Analisa Lahan Kritis [ADR-074])
  │     ├── dist/assets/api-BxFGoia1.js (Client API Gateway & Anti-Empty localStorage Cache Guard [ADR-074])
  │     └── Route Splitting to 35+ Active Views
  │
  ├── dist/assets/sektor-ringkasan-widget.js (SectorEconomicWidget)
  │     └── Di-import oleh 5 Halaman Sektor:
  │           ├── food-crops-BebUD7KU.js (/food-crops)
  │           ├── horticulture-CCLLXyU1.js (/horticulture)
  │           ├── plantation-DQwd-omc.js (/plantation)
  │           ├── livestock-D6KAVcvO.js (/livestock)
  │           └── fisheries-5_2RapTI.js (/fisheries)
  │
  └── dist/assets/site-B5h-x_N5.js (Sidebar Navigation)
        └── Memetakan Navigasi Dinamis ke Halaman:
              ├── /komoditas-unggulan/:bidang -> komoditas-unggulan-BhWh4UVQ.js
              ├── /nilai-ekonomi/:bidang -> nilai-ekonomi-uFV4-6ig.js (Khusus peternakan: 4 tab mandiri live API)
              ├── /livestock -> livestock-D6KAVcvO.js (Populasi Ternak Murni & Domba Batur)
              ├── /peternakan/susu-kulit -> peternakan-susu-kulit-B1vV3OM5.js (Produksi Utama, Hasil Ikutan Spesies-Centric & Simulasi HPT)
              └── /renstra -> renstra-v242.js (Dual Periode Renstra 2025–2029 [9 IKU, 18 IKK] & 2019–2022)
```
