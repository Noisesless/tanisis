# Tinjauan Kualitas & Keamanan Kode SISPERTANI (`quality_review.md`)

Dokumen ini memuat analisis kualitas kode, evaluasi keamanan (OWASP compliance), efisiensi arsitektur, dan rekomendasi perbaikan berkala.

---

## 1. Ringkasan Evaluasi Kualitas Kode

| Aspek | Penilaian | Status | Catatan Teknis |
|---|---|---|---|
| **Pemisahan Modul (Modularity)** | Sangat Baik | ✅ PASSED | Routing domain terpisah bersih di `src/routes/`, konfigurasi domain terpusat di `src/lib/domains.js`. |
| **Keamanan Kueri (SQL Injection)** | Sangat Baik | ✅ PASSED | Seluruh kueri SQL menggunakan *parameterized queries* (`?` placeholders) melalui `mysql2/promise`. Tidak ditemukan konkatenasi string SQL mentah. |
| **Keamanan Autentikasi** | Baik | ✅ PASSED | Login admin dilengkapi *rate limiter* (5 gagal / 15 menit), perbandingan string `timingSafeEqual`, dan token Bearer bertenggat waktu 12 jam. |
| **Efisiensi Memori & I/O** | Baik | ✅ PASSED | Multer `memoryStorage` dengan batas wajar 15 MB, streaming respons Excel, dan Express static cache header (`max-age=1h`). |
| **Normalisasi Data** | Sangat Baik | ✅ PASSED | Algoritma normalisasi nama kecamatan (`normKey`) dan alias geografi mencegah duplikasi data akibat variasi ejaan lokal (e.g. Klampok vs Purwareja Klampok). |
| **Integritas Data & Zero Dummy** | Sangat Baik | ✅ PASSED | Penegakan *Zero Dummy Data Law*: eliminasi mock array dan komoditas produksi 0, mengembalikan status empty transparan saat data belum terunggah. |
| **Single Source of Truth & Anti-Over-Engineering (ADR-009/010)** | Sangat Baik | ✅ PASSED | Komoditas Unggulan dihitung otomatis dari tabel transaksi produksi primer (10 jenis ikan, padi, palawija, horti, kebun, ternak). Menghapus form upload duplikat dan membatasi data pragmatis pada level perkecamatan & kabupaten. |
| **Higienitas Bundel Aset (Asset Hygiene)** | Sangat Baik | ✅ PASSED | Eliminasi 2.714 berkas artefak build usang (96%) dan 22 file CSS mati di `dist/assets/`, menyisakan tepat 106 berkas aktif bersih (efisiensi ukuran zip dari 84.4 MB menjadi 35.2 MB / reduksi 58%). |
| **Keamanan Kredensial AI Gateway** | Sangat Baik | ✅ PASSED | Eliminasi kebocoran API key eksternal di bundel JavaScript klien; seluruh kueri RAG dan streaming Gemini dialihkan ke gateway internal `/api/v1/ai/chat` dengan proteksi rate limit. |
| **Kepatuhan Visual Enterprise & Anti-AI-Slop Law** | Sangat Baik | ✅ PASSED | Pembersihan total emoji mentah (🐄, 🥛, 🌾, 🐑, dll.) dan simbol segitiga (▲, ▼); digantikan pill badge tipografi enterprise dan indikator numerik formal. |
| **Kepatuhan Zero-Empty & Spesies Definitif (ADR-012)** | Sangat Baik | ✅ PASSED | Pemisahan tegas Kulit Sapi vs Kerbau vs Kambing vs Domba vs Kelinci; penambahan Susu Kambing & Telur Puyuh; eliminasi baris bernilai 0/kosong dari tabel publik; penyiapan placeholder bersih untuk UMKM Pakan, Poultry Shop, dan NKV tanpa mock dummy data. |
| **Harmonisasi Layout & Geometri (ADR-026)** | Sangat Baik | ✅ PASSED | Eliminasi batas sempit `max-w-5xl` pada `/renstra` dan `/recommendations`, penerapan token `--radius-md: 8px`, border-left-4 pada kartu metrik, dan integrasi tabel seri tahunan ke dalam kontainer utama. |
| **Eliminasi AI Slop & Pulsing Dot Header (ADR-027)** | Sangat Baik | ✅ PASSED | Penghapusan capsule/eyebrow kapital dan indikator pulsing dot pada header `/renstra`, `/recommendations`, dan `/farmers` demi kepatuhan mutlak pada Anti-AI-Slop Law. |
| **Redesign Portal Login Asimetris & Anti-AI-Slop (ADR-028)** | Sangat Baik | ✅ PASSED | Rekonstruksi layout split 2-kolom asimetris (55:45), citra latar sawah lokal Banjarnegara, eliminasi buzzword/hiperbola, quick role selector, dan input password interaktif berstandar WCAG AA. |
| **Stabilitas Routing SPA & Anti-Redirect-Loop (ADR-029)** | Sangat Baik | ✅ PASSED | Eliminasi *infinite client-side redirect loop* pada rute `/kecamatan` akibat anomali scoring trailing-slash React Router v6; normalisasi rute didelegasikan secara terpusat ke layer Express HTTP redirect. |

---

## 2. Analisis Keamanan & Pola Pertahanan (Secure Patterns)

1. **Anti-Timing Attack pada Login Admin:**
   - Modul `src/routes/admin.js` mengimplementasikan fungsi `timingSafeEq` menggunakan `crypto.timingSafeEqual(ba, bb)`. Hal ini mencegah penyerang mengukur perbedaan waktu komparasi string kata sandi.

2. **Perlindungan Terhadap Brute Force:**
   - Peta in-memory `fails` mencatat kegagalan per IP dan mengembalikan status `429 Too Many Requests` ketika ambang batas terlampaui.

3. **Injeksi Parameter Aman pada Impor Excel:**
   - Saat file Excel dibaca, nilai baris di-sanitize dan dicocokkan dengan metadata kolom resmi dari `information_schema.columns`. Kolom berbahaya dan tipe data kompleks (seperti `json` mentah) dilewati (`SKIP_COLS` dan `SKIP_TYPES`).

4. **Pembatasan Ukuran Muatan (Payload Limits):**
   - Payload JSON dibatasi maksimum 256 KB (`express.json({ limit: "256kb" })`).
   - Berkas unggahan dibatasi maksimum 15 MB pada instance Multer.

5. **Penyamaran Jejak Server:**
   - Header `x-powered-by` dimatikan (`app.disable("x-powered-by")`) untuk meminimalisasi deteksi teknologi otomatis oleh bot penyerang.

6. **Isolasi Kredensial & Dynamic RAG Gateway:**
   - Kredensial `GEMINI_API_KEY` terisolasi 100% pada variabel lingkungan server (`.env`).
   - Klien hanya berkomunikasi dengan `/api/v1/ai/chat` yang menerapkan pembatasan sliding window (30 req/menit per IP) dan mengambil fakta riil dari MySQL `pertasis`.

7. **Prinsip Single Source of Truth & Data Minimization (ADR-009 & ADR-010):**
   - Menghapus form unggahan manual `komoditas-unggulan` dari Dasbor Admin mengeliminasi risiko *data drift* (divergensi antara data yang diinput manual dengan data kalkulasi produksi riil).
   - Seluruh pemeringkatan komoditas unggulan dan nilai ekonomi sektor dikalkulasi otomatis oleh mesin backend secara dinamis.
   - Pembatasan skema pada tingkat perkecamatan dan rekapitulasi kabupaten mencegah kompleksitas sistem (*over-engineering*) yang tidak didukung kesiapan data primer dinas.

---

## 3. Rekomendasi Peningkatan (Future Enhancements)

1. **Persistensi Token Sesi ke Redis / Database:**
   - *Kondisi saat ini:* Sesi login admin disimpan di in-memory `Map` pada instance Node.js.
   - *Rekomendasi:* Jika di masa mendatang aplikasi dijalankan dalam mode cluster PM2 (multi-worker), token sesi disarankan dipindahkan ke Redis atau tabel `user_sessions` MySQL agar sesi tidak hilang saat worker me-restart.

2. **Ekstraksi Sanitasi Input Excel:**
   - Tambahkan validasi eksplisit anti-formula injection (CSV/Excel Formula Injection) jika terdapat entri teks yang diawali karakter `=`, `+`, `-`, atau `@`.

3. **Penyempurnaan Logging Terpusat:**
   - Pertahankan pencatatan audit log `sync_log` yang sudah berjalan dengan baik, dan tambahkan rotasi berkas otomatis pada direktori `logs-pm2/`.
