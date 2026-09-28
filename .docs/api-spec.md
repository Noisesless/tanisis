# Spesifikasi REST API SISPERTANI

Dokumen ini mendokumentasikan spesifikasi lengkap antarmuka pemrograman aplikasi (REST API) pada backend SISPERTANI.

> **Catatan Jalur:** Seluruh endpoint API dapat diakses melalui prefix `/api/v1` maupun `/sispertani-api/v1`. Jalur kesehatan berada pada `/api/health` dan `/sispertani-api/health`.

---

## 1. Endpoint Sistem & Diagnostik

### `GET /api/health`
Mengecek status ketersediaan server Node.js dan konektivitas pool MySQL.
- **Autentikasi:** Tidak ada (Publik)
- **Response 200 OK:**
  ```json
  {
    "ok": true,
    "db": "up",
    "time": "2026-09-28T04:03:55.578Z"
  }
  ```
- **Response 503 Service Unavailable:**
  ```json
  {
    "ok": false,
    "db": "down",
    "message": "connect ECONNREFUSED 127.0.0.1:3306"
  }
  ```

### `GET /api/v1`
Menyediakan ringkasan metadata API, versi rilis, dan daftar indeks rute publik.
- **Response 200 OK:**
  ```json
  {
    "name": "SISPERTANI API",
    "version": 1,
    "readonly": false,
    "write": "admin-only (Bearer token — routes/admin.js)",
    "endpoints": ["..."]
  }
  ```

### `GET /api/3/*`
Gerbang proksi CKAN menuju repositori Open Data Kabupaten Banjarnegara (`opendata.banjarnegarakab.go.id`).
- **Response:** Data JSON dari portal data atau error `502 ckan_unreachable`.

---

## 2. Endpoint Data Statistik Publik (Read-Only)

### A. Tanaman Pangan & Lahan
- **`GET /api/v1/lahan/desa`**  
  Mengembalikan data luas penggunaan lahan per desa/kelurahan di Banjarnegara.
  - Parameter Query: `kecamatan` (opsional), `desa` (opsional), `tahun` (opsional).
- **`GET /api/v1/lahan/kabupaten`**  
  Data luas penggunaan lahan agregat tingkat kabupaten.
- **`GET /api/v1/padi/production`**  
  Statistik produksi padi tahunan per kecamatan.
- **`GET /api/v1/padi/history`**  
  Tren historis luas tanam, luas panen, dan produksi padi 2018–2024.
- **`GET /api/v1/padi/sawah-ladang`**  
  Perbandingan komparatif produksi padi sawah vs padi ladang/gogo.
- **`GET /api/v1/palawija/jagung-ubi-kayu`**  
  Data produksi komoditas jagung dan ubi kayu.
- **`GET /api/v1/palawija/kacang-kedelai`**  
  Data produksi kacang tanah dan kedelai lokal.
- **`GET /api/v1/palawija/ubi-kacang-hijau`**  
  Data produksi ubi jalar dan kacang hijau.

### B. Hortikultura & Perkebunan
- **`GET /api/v1/hortikultura/sayuran-produksi`**  
  Produksi komoditas sayuran (kentang Dieng, kubis, wortel, tomat, cabai rawit, cabai merah).
- **`GET /api/v1/hortikultura/sayuran-luas`**  
  Luas panen komoditas sayuran menurut kecamatan.
- **`GET /api/v1/hortikultura/buah-produksi`**  
  Produksi buah-buahan semusim dan tahunan (salak pondoh Banjarnegara, durian, alpukat).
- **`GET /api/v1/hortikultura/produksi-tahunan`**  
  Agregat produksi hortikultura kabupaten per tahun.
- **`GET /api/v1/perkebunan/areal`**  
  Luas areal tanaman perkebunan (kopi robusta/arabika, cengkeh, kelapa deres, kapulaga).
- **`GET /api/v1/perkebunan/produksi`**  
  Hasil produksi tanaman perkebunan per kecamatan.

### C. Peternakan & Kesehatan Hewan
- **`GET /api/v1/peternakan/kecil`**  
  Populasi ternak kecil: Domba Batur (plasma nutfah khas), domba lokal, dan kambing.
- **`GET /api/v1/peternakan/besar`**  
  Populasi ternak besar: Sapi potong, sapi perah, dan kerbau.
- **`GET /api/v1/peternakan/unggas`**  
  Populasi unggas: Ayam buras/kampung, ayam petelur, ayam pedaging (broiler), itik, puyuh.
- **`GET /api/v1/peternakan/pemasukan`** & **`/peternakan/pengeluaran`**  
  Arus lalu lintas ternak yang masuk ke dan keluar dari wilayah Kabupaten Banjarnegara.
- **`GET /api/v1/peternakan/luar-rph`**  
  Estimasi pemotongan hewan di luar Rumah Potong Hewan (RPH).
- **`GET /api/v1/peternakan/daging-unggas`**  
  Produksi daging ternak dan karkas unggas.
- **`GET /api/v1/peternakan/susu-kulit`**  
  Produksi susu segar (liter) dan pengolahan kulit mentah/samak.

### D. Perikanan
- **`GET /api/v1/perikanan/budidaya`**  
  Produksi perikanan budidaya air tawar (kolam air tenang, kolam air deras, mina padi).
- **`GET /api/v1/perikanan/tangkap`**  
  Hasil tangkap perairan umum daratan (Waduk PB Soedirman / Mrica, Sungai Serayu).
- **`GET /api/v1/perikanan/benih`**  
  Produksi dan penyaluran benih ikan (ekor) menurut Balai Benih Ikan & pembenih rakyat.
- **`GET /api/v1/perikanan/nilai-budidaya`** & **`/perikanan/nilai-tangkap`**  
  Nilai ekonomi produksi perikanan (ribu rupiah).

### E. Ekonomi, Logistik, Kelembagaan & Bantuan
- **`GET /api/v1/ekonomi/sektor-ringkasan?sektor=[pangan|hortikultura|perkebunan|peternakan|perikanan]&tahun=[YYYY]`**  
  Agregasi dinamis komoditas utama (ranking #1 berdasarkan volume produksi) dan total nilai ekonomi sektor untuk tahun tertentu.  
  - *Zero Dummy Data Policy*: Hanya mencakup komoditas dengan data riil (`total_produksi > 0`). Jika data belum diunggah / belum tersedia di database, mengembalikan status `empty` dan `totalNilaiEkonomiRp: 0` tanpa merekayasa data dummy.
  - **Query Params:** `sektor` (wajib: string), `tahun` (wajib: number/string).
  - **Response 200 OK:**
    ```json
    {
      "status": "success",
      "sektor": "hortikultura",
      "tahun": 2024,
      "top1": {
        "komoditas": "Salak",
        "satuan": "Ton",
        "kecamatanSentra": "Kalibening",
        "volumeProduksi": 199676,
        "nilaiEkonomiRp": 1198056000000,
        "tahun": 2024
      },
      "items": [ ... ],
      "totalNilaiEkonomiRp": 4069280500000,
      "jumlahKomoditas": 9
    }
    ```
- **`GET /api/v1/ekonomi/inflasi`** — Tingkat inflasi bahan pangan tahunan & bulanan.
- **`GET /api/v1/ekonomi/pasar`** — Profil pasar tradisional & pusat perdagangan komoditas.
- **`GET /api/v1/lumbung`** — Data sebaran, kapasitas unit lumbung pangan dan gudang cadangan beras.
- **`GET /api/v1/kelembagaan/kelompok-tani`** — Direktori Kelompok Tani (Poktan) & Gapoktan per desa.
- **`GET /api/v1/kelembagaan/kth`** — Kelompok Tani Hutan (KTH) dan kelas kemampuannya.
- **`GET /api/v1/st2023/desa`** — Data profil rumah tangga tani (RTUP) berdasarkan Sensus Pertanian 2023.
- **`GET /api/v1/bantuan`** — Rekapitulasi program bantuan sarana prasarana, alsintan, dan benih.

---

## 3. Endpoint Dasbor Administrasi (Admin & RBAC)

### `POST /api/v1/admin/login`
Autentikasi pengguna berdasarkan peran bidang atau super-admin.
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "user": "tanaman-pangan",
    "pass": "TanamanPangan.2026"
  }
  ```
- **Response 200 OK:**
  ```json
  {
    "token": "a4f89d...",
    "expiresAt": 1759092000000,
    "user": "tanaman-pangan",
    "role": "tanaman-pangan",
    "label": "Bidang Tanaman Pangan"
  }
  ```
- **Response 401 Unauthorized:** Kredensial tidak valid.
- **Response 429 Too Many Requests:** Diblokir karena melebihi 5 percobaan gagal per 15 menit.

### `GET /api/v1/admin/domains`
Mengambil daftar domain yang dapat dikelola oleh akun yang sedang masuk.
- **Headers:** `Authorization: Bearer <token>`
- **Response 200 OK:**
  ```json
  [
    {
      "key": "padi",
      "label": "Padi",
      "desc": "Produksi padi (sawah & ladang) per kecamatan per tahun.",
      "sheets": [
        {
          "table": "padi_produksi",
          "name": "Padi",
          "kecamatan": true,
          "key": ["kecamatan", "tahun", "jenis"]
        }
      ]
    }
  ]
  ```

### `GET /api/v1/admin/template/:domain`
Mengunduh formulir template berkas Microsoft Excel (`.xlsx`) kosong untuk domain tertentu. Berkas dilengkapi sheet petunjuk tata cara pengisian, sheet data berformat resmi, dan sheet data contoh.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Berkas binary stream file `.xlsx`.

### `GET /api/v1/admin/export/:domain`
Mengekspor seluruh data aktif yang tersimpan pada tabel basis data untuk domain terkait ke dalam format workbook Excel multi-sheet.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Berkas binary stream file `.xlsx`.

### `POST /api/v1/admin/import/:domain`
Mengunggah berkas Excel (`.xlsx`) hasil input untuk diintegrasikan secara langsung ke dalam basis data MySQL.
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Form Data Field:** `file` (berkas .xlsx, batas maksimum 15 MB)
- **Logika Proses:**
  1. Validasi struktur sheet dan nama kolom.
  2. Normalisasi nama kecamatan dan desa berdasarkan tabel referensi resmi.
  3. Eksekusi `INSERT ... ON DUPLICATE KEY UPDATE` berbasis *natural key*.
  4. Pencatatan audit ke tabel `sync_log`.
- **Response 200 OK:**
  ```json
  {
    "ok": true,
    "domain": "padi",
    "results": [
      {
        "table": "padi_produksi",
        "sheet": "Padi",
        "rowsRead": 40,
        "rowsInserted": 5,
        "rowsUpdated": 35,
        "errors": []
      }
    ]
  }
  ```

### `GET /api/v1/admin/sync-log`
Menampilkan 50 entri riwayat audit sinkronisasi dan impor data terakhir.
- **Headers:** `Authorization: Bearer <token>` (Khusus Peran Administrator)

### `GET /api/v1/admin/paket`
Menampilkan indeks paket arsip data template dan ekspor siap unduh (format Excel dan CSV) yang tersimpan di server.
- **Headers:** `Authorization: Bearer <token>` (Khusus Peran Administrator)
