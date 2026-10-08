# Panduan Deploy Bersih SISPERTANI (Clean Release 2026-10-05)

Paket rilis bersih: `deploy_pertanian_clean_20261005.zip` (35.2 MB)

Paket ini sudah disinkronkan sepenuhnya antara:
1. **Frontend Vite Produksi Terbaru** (layout responsif, tabel komoditas per kecamatan, KWT, LTT & Katam).
2. **Pembersihan Total Dead Code** (2.714 file aset usang, 22 CSS mati, dan 39 folder `_tmp` dibuang).
3. **Chatbot Si Pertani Aman**: Dialihkan dari API key eksternal yang bocor ke proxy backend lokal `/api/v1/ai/chat` (Dynamic RAG ke MySQL `pertasis` + Google Gemini).
4. **Backend Lengkap**: Seluruh 18 domain admin, export/import Excel dengan `hasSumber`, ringkasan ekonomi sektor, dan komoditas dinamis per-kecamatan + per-bidang.

---

## Opsi A: Deploy via cPanel File Manager (Paling Mudah)

1. Masuk ke **cPanel** > **File Manager**.
2. Masuk ke folder root aplikasi (misalnya `/home/username/pertanian.sistemdata.id` atau `public_html`).
3. Ganti nama folder lama untuk backup:
   - Rename `pertanian.sistemdata.id` menjadi `pertanian.sistemdata.id_backup_20261005`.
4. Buat folder baru dengan nama `pertanian.sistemdata.id`.
5. Upload berkas `deploy_pertanian_clean_20261005.zip` ke dalam folder baru tersebut, lalu klik kanan > **Extract**.
6. Salin berkas `.env` dari folder backup ke dalam folder baru.
7. Buka `.env` di folder baru via cPanel Code Editor, pastikan baris ini ada:
   ```env
   GEMINI_API_KEY=[masukkan_gemini_api_key_dari_env_lama]
   ```
8. Masuk ke cPanel > **Setup Node.js App** > klik tombol **Restart** pada aplikasi SISPERTANI.
9. Tes buka web di browser (lakukan Ctrl + F5 untuk membersihkan cache browser).

---

## Opsi B: Deploy via SSH / Terminal VPS

```bash
# 1. Masuk ke direktori web di server
cd /var/www   # atau direktori tempat domain berada

# 2. Backup folder lama
mv pertanian.sistemdata.id pertanian.sistemdata.id_backup_20261005

# 3. Buat folder baru dan ekstrak zip
mkdir pertanian.sistemdata.id
cd pertanian.sistemdata.id
unzip /path/ke/deploy_pertanian_clean_20261005.zip

# 4. Ambil .env dari backup
cp ../pertanian.sistemdata.id_backup_20261005/.env .env

# 5. Pastikan GEMINI_API_KEY terisi di .env
grep -q "GEMINI_API_KEY" .env || echo "GEMINI_API_KEY=[masukkan_gemini_api_key_dari_env_lama]" >> .env

# 6. Install dependensi (jika diperlukan) & restart PM2
npm ci --omit=dev
pm2 reload ecosystem.config.cjs || pm2 restart pertanian-api

# 7. Cek status
pm2 status
curl -s http://127.0.0.1:5173/api/health
```

---

## Sinkronisasi Basis Data Lengkap (57 Tabel)

Untuk menyinkronkan seluruh struktur dan data termutakhir (Padi 2025, 2.409 Poktan, 278 Gapoktan, 137 KEP, 36 Posluhdes, 156 PPS, Ternak, Horti, dsb.):
```bash
mysql -u pertalit -pw1x4pYxx7u3WYNqVX4g4 pertasis < database/dump_production_pertanian_updated.sql
```

---

## Prosedur Rollback Cepat (< 1 Menit)

Jika ada kendala yang tidak diinginkan di server:
```bash
mv pertanian.sistemdata.id pertanian.sistemdata.id_failed
mv pertanian.sistemdata.id_backup_20261005 pertanian.sistemdata.id
pm2 restart ecosystem.config.cjs
```
Aplikasi langsung kembali normal ke kondisi semula tanpa downtime.
