# Panduan Deployment SISPERTANI (`deployment.md`)

Dokumen ini memuat prosedur deployment aplikasi, pemetaan variabel lingkungan, daftar periksa sebelum/setelah rilis, serta rencana mitigasi (*rollback plan*).

---

## 1. Deployment Targets

| Target | Tipe Lingkungan | Port | Stack & Pengelola Proses |
|---|---|---|---|
| **Lokal (Dev)** | Workstation Windows (XAMPP) | `5173` | Node.js native (`--watch --env-file=.env`) |
| **Produksi (CloudPanel)** | VPS Linux (Ubuntu / Debian) | `4100` / Reverse Proxy | PM2 (`ecosystem.config.cjs`) + Nginx |

---

## 2. Pemetaan Variabel Lingkungan (`.env`)

| Variabel | Development (Lokal) | Production (Server) | Keterangan & Catatan |
|---|---|---|---|
| `PORT` | `5173` | `4100` (atau port internal CloudPanel) | Port listening Express server |
| `BIND_HOST` | `127.0.0.1` | `127.0.0.1` / `0.0.0.0` | IP bind server |
| `DB_HOST` | `127.0.0.1` | `127.0.0.1` | Host MySQL/MariaDB |
| `DB_PORT` | `3306` | `3306` | Port MySQL |
| `DB_USER` | `root` | `pertalit` / user terdedikasi | Akun user MySQL |
| `DB_PASS` | *(kosong)* | `[strong_password]` | Kata sandi user MySQL |
| `DB_NAME` | `pertasis` | `pertasis` | Nama database |
| `CORS_ORIGIN` | `*` / `https://pertanian.sistemdata.id` | `https://pertanian.sistemdata.id` | Domain yang diizinkan untuk CORS |
| `DIST_DIR` | `./dist` | `./dist` | Direktori berkas statis frontend SPA |
| `CKAN_PROXY` | `1` | `1` | Aktifkan proksi CKAN Open Data |
| `ADMIN_PASS` | `C9145qbSjR` | `[hash_or_strong_pass]` | Kata sandi super-admin |
| `PASS_*` (Bidang) | `[Bidang].2026` | `[secure_random_pass]` | Kata sandi per bidang RBAC |
| `GEMINI_API_KEY` | `AIzaSy...` | `AIzaSy...` | API Key Google Gemini untuk gateway AI / Si Pertani (Wajib di server backend, aman dari client) |

---

## 3. Konfigurasi Nginx / Reverse Proxy (Produksi)

Contoh blok konfigurasi vhost Nginx pada CloudPanel / VPS:

```nginx
server {
    server_name pertanian.sistemdata.id;
    listen 80;
    listen 443 ssl http2;
    
    # SSL Certificates dikelola oleh Let's Encrypt / CloudPanel
    
    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:4100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 4. Pre-Deploy Checklist (Sebelum Rilis)

- [ ] File `.env` produksi telah dikonfigurasi dengan kata sandi kuat, kredensial MySQL, dan `GEMINI_API_KEY`.
- [ ] Folder `./dist` berisi build frontend bersih (106 berkas bundel aktif `assets/`, zero dead code, tanpa folder `_tmp`).
- [ ] Berkas paket deploy bersih telah siap: `deploy_pertanian_clean_20261005.zip` (35.2 MB).
- [ ] Dependensi `node_modules` telah terpasang bersih (`npm ci --omit=dev`).
- [ ] Database MySQL `pertasis` telah di-dump dan dicadangkan (*backup*).
- [ ] Skrip migrasi non-destruktif siap: `database/production_migration_patch.sql` (atau dump terpadu `database/dump_production_pertanian_updated.sql`).
- [ ] Port yang ditentukan pada `PORT` tidak terblokir firewall eksternal (hanya terbuka untuk Nginx lokal).
- [ ] Folder `./logs-pm2` telah tersedia dan memiliki izin tulis untuk user pengelola.
- [ ] Repositori lokal tersinkronisasi pada branch `release/2026-10-05-clean`.

---

## 5. Prosedur Rilis Produksi & Post-Deploy Verification

### A. Alur Rilis Mandiri via cPanel / SFTP (Clean Release):
1. **Cadangkan Folder Aktif:**
   Ubah nama direktori `pertanian.sistemdata.id` menjadi `pertanian.sistemdata.id_backup_20261005`.
2. **Unggah dan Ekstrak:**
   Buat folder baru `pertanian.sistemdata.id`, unggah `deploy_pertanian_clean_20261005.zip`, lalu ekstrak.
3. **Konfigurasi Lingkungan:**
   Salin `.env` dari folder cadangan, pastikan baris `GEMINI_API_KEY` terkonfigurasi.
4. **Restart Aplikasi:**
   Buka cPanel > **Setup Node.js App** > klik **Restart** (atau jalankan `pm2 restart ecosystem.config.cjs` jika menggunakan SSH).

### B. Perintah Pembaruan di VPS Produksi (CloudPanel / SSH):
```bash
# Masuk ke direktori web
cd /path/ke/webroot

# Backup direktori aktif
mv pertanian.sistemdata.id pertanian.sistemdata.id_backup_20261005

# Ekstrak paket rilis bersih
mkdir pertanian.sistemdata.id && cd pertanian.sistemdata.id
unzip /path/ke/deploy_pertanian_clean_20261005.zip

# Salin .env dan pasang dependensi
cp ../pertanian.sistemdata.id_backup_20261005/.env .env
npm ci --omit=dev

# Reload proses Express
pm2 reload ecosystem.config.cjs || pm2 restart pertanian-api

# Verifikasi log tidak memiliki error
pm2 logs sispertani-api --lines 20
```

### C. Verifikasi Pasca Rilis:
1. **Smoke Test Health Check:**
   ```bash
   curl -I https://pertanian.sistemdata.id/api/health
   # Harus menghasilkan status 200 OK dengan {"ok":true,"db":"up"}
   ```
2. **Frontend Routing & Avatar Header Check:**
   - Buka beranda `https://pertanian.sistemdata.id/`
   - Lakukan **Hard Refresh** (`Ctrl + Shift + R` atau `Cmd + Shift + R`) untuk membersihkan cache browser.
   - Pastikan header tampil rapi setinggi `72px` dengan **Avatar Dropdown Pengunjung [G]** (bukan tombol Info/Panduan/Login yang berserakan).
   - Klik avatar untuk memastikan modal dropdown membuka tautan Info, Panduan, dan Portal Admin.
3. **SPA Route Check:**
   - Buka rute dalam `https://pertanian.sistemdata.id/komoditas-unggulan/pangan` dan lakukan refresh peramban (pastikan tidak terjadi 404).
4. **GeoJSON & Map Test:**
   - Buka peta spasial, verifikasi layer GeoJSON sawah, desa, dan jalan ter-render dengan sempurna tanpa galat CORS.
5. **Admin Login & Template Test:**
   - Lakukan login pada portal admin dengan kredensial uji coba.
   - Uji unduh satu template Excel (`GET /api/v1/admin/template/padi`).

---

## 6. Rollback Plan (Rencana Pemulihan)

| Skenario Galat | Prosedur Tindakan Pemulihan |
|---|---|
| **Server Crash saat Mulai** | Periksa log PM2 (`pm2 logs sispertani-api`). Jika terdapat syntax error atau missing module, kembalikan ke commit Git sebelumnya (`git checkout <tag-sebelumnya>`) dan jalankan `pm2 restart ecosystem.config.cjs`. |
| **MySQL Galat Akses / Down** | Verifikasi status layanan MariaDB/MySQL (`systemctl status mariadb`). Cek kredensial di `.env`. Uji koneksi via CLI `mysql -u [user] -p [database]`. |
| **Frontend White Screen / 404** | Pastikan direktori `./dist` tidak terhapus. Periksa izin baca berkas `chmod -R 755 dist/`. |
| **Kerusakan Data Akibat Impor** | Pulihkan tabel yang terdampak dari snapshot backup harian `mysqldump` terakhir: `mysql -u [user] -p pertasis < backup_pertasis.sql`. |
