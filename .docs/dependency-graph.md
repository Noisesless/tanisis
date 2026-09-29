# Graf Ketergantungan Modul SISPERTANI (`dependency-graph.md`)

Dokumen ini memetakan derajat ketergantungan antar-berkas kode di dalam sistem, mengidentifikasi berkas kritis (*critical core*), berkas berdampak tinggi (*high impact*), serta berkas daun (*leaf files*).

---

## 🔴 Critical Files (Paling Banyak Di-import — JANGAN Ubah Tanpa Review)

| File | Imported By (Count) | Tipe | Alasan Kritis |
|---|---|---|---|
| [`src/db.js`](file:///e:/Project/pertanian_main/src/db.js) | 12 berkas (semua routes & lib) | Database Core | Mengelola pool koneksi MySQL, konfigurasi decimalNumbers, dan helper kueri `q()`. Kerusakan di sini melumpuhkan seluruh API. |
| [`src/server.js`](file:///e:/Project/pertanian_main/src/server.js) | Entrypoint (Root) | Server Core | Inisialisasi Express, CORS, dual-mount API router, static handler, dan SPA fallback. |
| [`src/lib/domains.js`](file:///e:/Project/pertanian_main/src/lib/domains.js) | 3 berkas (`admin.js`, `excel.js`, tests) | Schema & Registry | Mengatur 15 domain, kunci upsert, pemetaan tabel-sheet, normalisasi nama kecamatan & desa, serta alias geografi. |

---

## 🟡 High-Impact Files (Ubah = Efek Luas)

| File | Depends On | Used By | Impact Level | Catatan Risiko |
|---|---|---|---|---|
| [`src/lib/excel.js`](file:///e:/Project/pertanian_main/src/lib/excel.js) | `exceljs`, `domains.js`, `db.js` | `src/routes/admin.js` | High | Mengatur parsing dan formatting seluruh berkas Excel input/output dinas. Perubahan logika dapat merusak impor massal. |
| [`src/lib/users.js`](file:///e:/Project/pertanian_main/src/lib/users.js) | `.env` variables | `src/routes/admin.js` | High | Mengatur model RBAC, pemetaan akun dinas ke domain, dan fungsi validasi `roleAllowsDomain`. |
| [`src/routes/admin.js`](file:///e:/Project/pertanian_main/src/routes/admin.js) | `db.js`, `domains.js`, `users.js`, `excel.js`, `multer` | `src/server.js` | High | Gerbang mutasi data dan autentikasi. Kegagalan di sini mempengaruhi integritas data dan hak akses pengguna. |
| [`.env`](file:///e:/Project/pertanian_main/.env) | Sistem & OS | Seluruh proses Node.js | Critical | Menyimpan kredensial basis data, port dev/prod, CORS, dan kata sandi RBAC. |

---

## 🟢 Leaf Files (Aman Diubah — Minimal Dependency)

| File | Purpose | Tingkat Isolasi |
|---|---|---|
| [`src/routes/padi.js`](file:///e:/Project/pertanian_main/src/routes/padi.js) | Endpoint kueri data komoditas padi dan palawija | Terisolasi pada domain Tanaman Pangan |
| [`src/routes/hortikultura.js`](file:///e:/Project/pertanian_main/src/routes/hortikultura.js) | Endpoint kueri sayuran dan buah-buahan | Terisolasi pada domain Hortikultura |
| [`src/routes/perkebunan.js`](file:///e:/Project/pertanian_main/src/routes/perkebunan.js) | Endpoint kueri komoditas perkebunan | Terisolasi pada domain Perkebunan |
| [`src/routes/peternakan.js`](file:///e:/Project/pertanian_main/src/routes/peternakan.js) | Endpoint kueri populasi ternak, RPH, dan produk hewani | Terisolasi pada domain Peternakan |
| [`src/routes/perikanan.js`](file:///e:/Project/pertanian_main/src/routes/perikanan.js) | Endpoint kueri budidaya, tangkap, dan benih ikan | Terisolasi pada domain Perikanan |
| [`src/routes/ekonomi.js`](file:///e:/Project/pertanian_main/src/routes/ekonomi.js) | Endpoint kueri inflasi, pasar daerah, dan lumbung pangan | Terisolasi pada domain Ekonomi & Logistik |
| [`src/routes/kelembagaan.js`](file:///e:/Project/pertanian_main/src/routes/kelembagaan.js) | Endpoint kueri Poktan, Gapoktan, dan KTH | Terisolasi pada domain Kelembagaan |
| [`src/routes/st2023.js`](file:///e:/Project/pertanian_main/src/routes/st2023.js) | Endpoint kueri data sensus ST2023 tingkat desa | Terisolasi pada domain Sensus |
| [`src/routes/bantuan.js`](file:///e:/Project/pertanian_main/src/routes/bantuan.js) | Endpoint kueri program dan sebaran bantuan pemerintah | Terisolasi pada domain Bantuan |
| [`src/routes/lahan.js`](file:///e:/Project/pertanian_main/src/routes/lahan.js) | Endpoint kueri penggunaan dan tutupan lahan | Terisolasi pada domain Lahan |
| [`src/routes/ai.js`](file:///e:/Project/pertanian_main/src/routes/ai.js) | Proksi streaming Chatbot Si Pertani + Dynamic Live RAG (MySQL & CKAN) | Terisolasi pada modul AI & RAG Gateway |
| [`src/lib/helpers.js`](file:///e:/Project/pertanian_main/src/lib/helpers.js) | Utilitas pembungkus rute `wrapRoute()` dan respon standar | Utility murni |

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
  ├── src/routes/padi.js ────────> src/db.js
  ├── src/routes/hortikultura.js ─> src/db.js
  ├── src/routes/perkebunan.js ──> src/db.js
  ├── src/routes/peternakan.js ──> src/db.js
  ├── src/routes/perikanan.js ───> src/db.js
  ├── src/routes/ekonomi.js ─────> src/db.js
  ├── src/routes/kelembagaan.js ─> src/db.js
  ├── src/routes/st2023.js ──────> src/db.js
  ├── src/routes/bantuan.js ─────> src/db.js
  ├── src/routes/lahan.js ───────> src/db.js
  ├── src/routes/ai.js ──────────> src/db.js & Google Gemini API
  └── /api/v1/komoditas-unggulan ─> src/db.js (Tabel komoditas_unggulan)
```

---

## 🖥️ Frontend Shared Component Dependencies

```text
dist/assets/sektor-ringkasan-widget.js (SectorEconomicWidget)
  ├── dist/assets/index-CI1XYnwk.js (React & JSX Runtime)
  └── Di-import oleh 5 Halaman Sektor:
        ├── food-crops-BebUD7KU.js (/food-crops)
        ├── horticulture-CCLLXyU1.js (/horticulture)
        ├── plantation-DQwd-omc.js (/plantation)
        ├── livestock-D6KAVcvO.js (/livestock)
        └── fisheries-5_2RapTI.js (/fisheries)

dist/assets/site-B5h-x_N5.js (Sidebar Navigation)
  └── Memetakan Navigasi Dinamis ke Halaman:
        ├── /komoditas-unggulan/:bidang -> komoditas-unggulan-BhWh4UVQ.js
        └── /nilai-ekonomi/:bidang -> nilai-ekonomi-uFV4-6ig.js
```
