# Panduan Deployment SISPERTANI (`deployment.md`)

Dokumen ini memuat prosedur resmi dan tunggal (*Single Source of Truth*) untuk deployment aplikasi SISPERTANI, pemetaan variabel lingkungan, panduan rilis via SSH/Git maupun cPanel File Manager, sinkronisasi basis data, serta prosedur pemulihan cepat (*rollback*).

---

## 1. Deployment Targets

| Target | Tipe Lingkungan | Port Internal / Protocol | Pengelola Proses |
|---|---|---|---|
| **Lokal (Dev)** | Workstation Windows (XAMPP) | `5173` (HTTP) | Node.js native (`--watch --env-file=.env`) |
| **Produksi (`pertanian.sistemdata.id`)** | VPS Linux / cPanel Cloud (Nargaroth) | `5173` / Reverse Proxy HTTPS | PM2 (`ecosystem.config.cjs`) |

---

## 2. Pemetaan Variabel Lingkungan (`.env`)

| Variabel | Development (Lokal) | Production (Server) | Keterangan & Catatan |
|---|---|---|---|
| `PORT` | `5173` | `5173` | Port listening Express server |
| `BIND_HOST` | `127.0.0.1` | `127.0.0.1` | IP bind server lokal |
| `DB_HOST` | `127.0.0.1` | `localhost` / `127.0.0.1` | Host MySQL/MariaDB |
| `DB_PORT` | `3306` | `3306` | Port MySQL |
| `DB_USER` | `root` | `pertalit` | Akun database terdedikasi |
| `DB_PASS` | *(kosong)* | `w1x4pYxx7u3WYNqVX4g4` | Kata sandi database produksi |
| `DB_NAME` | `pertasis` | `pertasis` | Nama database |
| `CORS_ORIGIN` | `*` | `https://pertanian.sistemdata.id` | Domain yang diizinkan untuk CORS |
| `DIST_DIR` | `./dist` | `./dist` | Direktori berkas statis frontend SPA |
| `CKAN_PROXY` | `1` | `1` | Aktifkan proksi CKAN Open Data Banjarnegara |
| `ADMIN_PASS` | `C9145qbSjR` | `[secure_password]` | Kata sandi super-admin |
| `GEMINI_API_KEY`| `[api_key]` | `[api_key]` | API Key Google Gemini (Wajib untuk mode generatif; otomatis fallback ke DB jika kosong) |

---

## 3. Prosedur Deployment di Server Produksi

### Opsi A: Pembaruan via Terminal SSH / Git (Metode Rekomendasi Utama)

Metode ini adalah alur standar di server `pertanian.sistemdata.id`:

```bash
# 1. Masuk ke direktori webroot
cd ~/htdocs/pertanian.sistemdata.id

# 2. Tarik pembaruan kode dan bundel terbaru dari GitHub
git pull origin main

# 3. Jalankan patch normalisasi relasional database (drop fsva lama, tambah kode BPS, relasi 278 desa, activity_logs)
npm run db:normalize
# Atau jika menggunakan SQL native secara langsung:
# mysql -u pertalit -pw1x4pYxx7u3WYNqVX4g4 pertasis < database/patch_production_normalization_2026.sql

# 4. Pasang dependensi jika terdapat pembaruan package.json
npm ci --omit=dev

# 5. Restart proses aplikasi via PM2
pm2 reload ecosystem.config.cjs || pm2 restart pertanian-api

# 6. Verifikasi status aplikasi & kesiapan domain
pm2 status
curl -s http://127.0.0.1:5173/api/health
```

---

### Opsi B: Deploy Bersih via cPanel File Manager (Unggah Arsip Zip)

Gunakan metode ini jika melakukan instalasi bersih atau memindahkan hosting:

1. Masuk ke **cPanel** > **File Manager**.
2. Masuk ke direktori webroot aplikasi (misalnya `/home/sistnian/htdocs/pertanian.sistemdata.id`).
3. Cadangkan folder yang sedang berjalan:
   - Ganti nama folder `pertanian.sistemdata.id` menjadi `pertanian.sistemdata.id_backup_[tanggal]`.
4. Buat folder baru dengan nama `pertanian.sistemdata.id`.
5. Unggah berkas arsip rilis bersih (`.zip`), lalu klik kanan > **Extract**.
6. Salin berkas `.env` dari folder cadangan ke dalam folder baru.
7. Jalankan patch SQL `database/patch_production_normalization_2026.sql` via cPanel **phpMyAdmin** pada basis data `pertasis`.
8. Masuk ke cPanel > **Setup Node.js App** > klik tombol **Restart** pada aplikasi SISPERTANI.
9. Lakukan pembersihan cache peramban (*Hard Refresh* / `Ctrl + F5`) saat membuka situs.

---

## 4. Sinkronisasi Basis Data Produksi (71 Tabel Lengkap)

Terdapat tiga metode sinkronisasi basis data yang didukung penuh:

### Opsi 1: Patch Normalisasi Relasional & Eliminasi Artefak Usang (Rekomendasi Utama Update Ini)
Gunakan opsi ini untuk memperbarui database production yang sedang aktif:
1. **Drop Tabel Usang:** Menghapus `fsva_indikator_kabupaten`.
2. **Kolom Kode BPS & Tipe:** Menambahkan `kode` pada `kecamatan` dan `desa`, serta `tipe` pada `desa`.
3. **Integritas Relasional:** Menghubungkan 278 desa di `fsva_desa_indikator` dengan `kecamatan_id` dan `desa_id` (FK `NOT NULL`).
4. **Audit Logging:** Membentuk tabel `activity_logs` untuk audit aktivitas login, logout, impor, dan ekspor.

```bash
# Masuk ke direktori webroot
cd ~/htdocs/pertanian.sistemdata.id

# Jalankan runner normalisasi terdedikasi
npm run db:normalize

# ATAU eksekusi langsung via mysql CLI:
# mysql -u pertalit -pw1x4pYxx7u3WYNqVX4g4 pertasis < database/patch_production_normalization_2026.sql
```

### Opsi 2: Migrasi Patch Menyeluruh (Full Pipeline)
Menjalankan seluruh siklus migrasi patch: DDL tabel pendukung, import BPS Distankan, patch komoditas unggulan, import FSVA desa, dan normalisasi relasional:

```bash
npm run db:patch
```

### Opsi 3: Impor Dump Master Penuh (Setup Awal / Full Reset)
Jika melakukan setup awal atau migrasi menyeluruh dari awal:

```bash
mysql -u pertalit -pw1x4pYxx7u3WYNqVX4g4 pertasis < database/dump_production_pertanian_updated.sql
```

> **Catatan Keamanan & Kompatibilitas:**  
> Berkas `database/dump_production_pertanian_updated.sql` dan `database/production_migration_patch.sql` telah dioptimasi khusus untuk user unprivileged cPanel (`pertalit`):
> - Tidak mengandung klausa `DEFINER=root` (mencegah `ERROR 1227`).
> - Menggunakan format datetime ISO standar `YYYY-MM-DD HH:MM:SS` (mencegah `ERROR 1292`).
> - Kolom kalkulasi `nilai_rp` tidak menggunakan `GENERATED STORED` kaku saat dump (mencegah `ERROR 1906`).

---

## 5. Verifikasi Pasca Rilis (*Post-Deploy Verification*)

Setelah kode dan basis data diperbarui, lakukan pemeriksaan berikut:

1. **Uji Kesehatan Backend:**
   ```bash
   curl -I https://pertanian.sistemdata.id/api/health
   # Respons wajib: HTTP/2 200 OK dengan {"ok":true,"db":"up"}
   ```
2. **Uji Endpoint Statistik Utama & Patch Baru:**
   ```bash
   curl -s https://pertanian.sistemdata.id/api/v1/komoditas-unggulan | head -c 100
   curl -s https://pertanian.sistemdata.id/api/v1/kelembagaan/summary | head -c 100
   curl -s https://pertanian.sistemdata.id/api/v1/ketahanan/harga-pasar | head -c 100
   # Seluruhnya wajib mengembalikan status "success" / array data JSON tanpa galat 500
   ```
3. **Uji Chatbot & Gateway AI Si Pertani (Dynamic Live RAG):**
   ```bash
   # Uji endpoint API online
   curl -s -X POST https://pertanian.sistemdata.id/sispertani-api/v1/ai/chat \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"Berapa total produksi padi tahun 2025 di Banjarnegara?"}],"stream":false}'
   # Jawaban wajib menyebutkan produksi 178.610 Ton dan sentra Kecamatan Mandiraja

   # Uji Asisten RAG Mandiri via Python CLI:
   python scripts/offline_rag.py "kalau 2023 salak paling banyak dari mana?"
   # Jawaban wajib menyebutkan Kalibening (83.181 Ton) dari total 203.208 Ton
   ```
4. **Uji Antarmuka Web (Frontend SPA):**
   - Buka `https://pertanian.sistemdata.id/` di browser.
   - Tekan `Ctrl + F5` untuk memastikan file JS/CSS lama terhapus dari cache browser.
   - Buka rute `/recommendations`, pastikan metrik Capaian Pertanian 2025 menampilkan data riil (178.610 Ton, 25.871 Ha, Mandiraja).
   - Buka rute `/kecamatan`, pastikan profil 20 kecamatan dan peta MapLibre ter-render tanpa blank screen.
   - Buka rute `/admin`, pastikan form login asimetris dengan foto persawahan Banjarnegara tampil rapi dan login multi-role dapat diakses tanpa crash. Lakukan login Super Admin (`admin`), pastikan komponen "Audit Kesiapan Data Sektoral (Readiness Matrix)", dual-tab log aktivitas & sinkronisasi, serta kolom "Tahun Data Terakhir" termuat rapi. Jika peramban masih menampilkan antarmuka lama (2 kolom katalog), lakukan pengosongan cache peramban (DevTools F12 > Network > centang Disable cache, atau buka via jendela Incognito/Penyamaran).

---

## 6. Prosedur Rollback Cepat (< 1 Menit)

Jika ditemukan anomali atau galat fatal setelah rilis, pulihkan layanan dalam hitungan detik:

### Skenario A: Rollback via Git (SSH)
```bash
# Kembalikan ke commit stabil sebelumnya
git reset --hard HEAD~1
pm2 restart ecosystem.config.cjs
```

### Skenario B: Rollback via Folder Cadangan (cPanel)
```bash
mv pertanian.sistemdata.id pertanian.sistemdata.id_failed
mv pertanian.sistemdata.id_backup_[tanggal] pertanian.sistemdata.id
pm2 restart ecosystem.config.cjs
```

Layanan akan seketika pulih normal ke kondisi stabil sebelumnya tanpa *downtime*.
