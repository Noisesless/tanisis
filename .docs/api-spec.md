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
  Populasi ternak kecil: Domba Batur (plasma nutfah khas Banjarnegara), domba lokal, dan kambing.
- **`GET /api/v1/peternakan/besar`**  
  Populasi ternak besar: Sapi potong, sapi perah, dan kerbau.
- **`GET /api/v1/peternakan/unggas`**  
  Populasi unggas: Ayam buras/kampung, ayam petelur (layer), ayam pedaging (broiler), itik, dan puyuh.
- **`GET /api/v1/peternakan/pemasukan`** & **`/peternakan/pengeluaran`**  
  Arus lalu lintas ternak yang masuk ke dan keluar dari wilayah Kabupaten Banjarnegara.
- **`GET /api/v1/peternakan/luar-rph`** & **`/peternakan/rph-pemerintah`**  
  Pemotongan hewan di Rumah Potong Hewan (RPH) pemerintah vs luar RPH.
- **`GET /api/v1/peternakan/daging`** & **`/peternakan/daging-unggas`**  
  Produksi daging ternak besar & kecil (sapi, kerbau, kambing, domba, kelinci) serta karkas unggas (ayam broiler, kampung, itik, puyuh) dalam satuan kg.
- **`GET /api/v1/peternakan/telur`**  
  Produksi telur terpilah per jenis unggas (ayam ras layer, ayam kampung, itik, burung puyuh) dalam satuan butir/kg.
- **`GET /api/v1/peternakan/susu-kulit`**  
  Produksi susu segar (sapi perah, susu kambing) dan kulit terpilah per jenis hewan (Kulit Sapi, Kulit Kerbau, Kulit Kambing, Kulit Domba, Kulit Kelinci, Wol Domba Batur, Tulang & Tanduk) dalam satuan lembar/liter/kg.
- **`GET /api/v1/peternakan/hpt`**  
  Data lahan penanaman Hijauan Pakan Ternak (Odot, Gajah, Pakchong, Indigofera), luasan (Ha), dan estimasi kapasitas daya tampung Satuan Ternak (ST).
- **`GET /api/v1/peternakan/umkm-pakan`**  
  Direktori pelaku usaha dan kelompok tani produsen pakan ternak mandiri (silase tebon jagung, konsentrat, pakan fermentasi).
- **`GET /api/v1/peternakan/poultry-shop`**  
  Sebaran kios sapronak, penyedia obat hewan, vitamin, dan poultry shop per kecamatan.
- **`GET /api/v1/peternakan/nkv`**  
  Register unit usaha produk asal hewan bersertifikat Nomor Kontrol Veteriner (NKV).
- **`GET /api/v1/peternakan/domba-batur`**  
  Data sebaran populasi Domba Batur (ternak hias & bibit unggul per ekor) di sentra Dataran Tinggi Dieng (Batur, Pejawaran, Wanayasa, Kalibening, Karangkobar) per tahun dalam satuan ekor.
- **`POST /api/v1/peternakan/entry`**  
  Endpoint entry data manual bagian peternakan yang kosong (kategori: `populasi`, `hpt`, `umkm_pakan`, `poultry_shop`, `nkv`, `susu_kulit`, `daging`, `telur`).
  - **Autentikasi:** Wajib `Authorization: Bearer <token>` (Peran: `admin` atau `peternakan`).
  - **Parameter:** `kecamatan`, `tahun`, `bulan`, `jenis/nama`, `jumlah/nilai`, `satuan`, `catatan/alamat/kontak`.

### D. Perikanan
- **`GET /api/v1/perikanan/jenis-ikan`**  
  Data definitif 10 spesies ikan budidaya Kabupaten Banjarnegara tahun 2020–2025 (Lele, Nila, Gurami, Bawal, Nilem, Mujair, Mas, Tawes, Patin, Tambakan) bersumber dari berkas dinas `Data produksi 2020-2025.xlsx`.
- **`GET /api/v1/perikanan/budidaya-luasan`**  
  Data budidaya perikanan per kecamatan mencakup luasan (Ha/m²), volume produksi (Kg), dan produktivitas (Ton/Ha).
- **`GET /api/v1/perikanan/hias`**  
  Statistik budidaya ikan hias menurut varietas dan kecamatan.
- **`GET /api/v1/perikanan/budidaya`**  
  Produksi perikanan budidaya air tawar (kolam air tenang, kolam air deras, mina padi).
- **`GET /api/v1/perikanan/tangkap`**  
  Hasil tangkap perairan umum daratan (Waduk PB Soedirman / Mrica, Sungai Serayu), mencakup kategori alat tangkap **Bubu** (`ALAT_MAP`).
- **`GET /api/v1/perikanan/benih`**  
  Produksi dan penyaluran benih ikan (ekor dan luas Ha) menurut Balai Benih Ikan & pembenih rakyat.
- **`GET /api/v1/perikanan/nilai-budidaya`** & **`/perikanan/nilai-tangkap`**  
  Nilai ekonomi produksi perikanan (ribu rupiah).

### E. Ekonomi, Logistik, Kelembagaan & Bantuan
- **`GET /api/v1/ekonomi/sektor-ringkasan?sektor=[pangan|hortikultura|perkebunan|peternakan|perikanan]&tahun=[YYYY]`**  
  Agregasi dinamis komoditas utama (ranking #1 berdasarkan volume produksi) dan total nilai ekonomi sektor untuk tahun tertentu.  
  - *Single Source of Truth (ADR-009)*: Komoditas unggulan dikalkulasi otomatis dari tabel transaksi produksi lapangan (misal sektor perikanan langsung dari `ikan_produksi_jenis`). Tidak ada form upload terpisah.
  - *Zero Dummy Data Policy*: Hanya mencakup komoditas dengan data riil (`total_produksi > 0`). Jika data belum diunggah / belum tersedia di database, mengembalikan status `empty` dan `totalNilaiEkonomiRp: 0` tanpa merekayasa data dummy.
  - **Query Params:** `sektor` (wajib: string), `tahun` (wajib: number/string).
  - **Response 200 OK:**
    ```json
    {
      "status": "success",
      "sektor": "perikanan",
      "tahun": 2025,
      "top1": {
        "komoditas": "Nila",
        "satuan": "Ton",
        "kecamatanSentra": "Kabupaten Banjarnegara",
        "volumeProduksi": 20250.13,
        "nilaiEkonomiRp": 0,
        "tahun": 2025
      },
      "items": [ ... ],
      "totalNilaiEkonomiRp": 0,
      "jumlahKomoditas": 10
    }
    ```
- **`GET /api/v1/ekonomi/inflasi`** — Tingkat inflasi bahan pangan tahunan & bulanan.
- **`GET /api/v1/ekonomi/pasar`** — Profil pasar tradisional & pusat perdagangan komoditas.
- **`GET /api/v1/ekonomi/nilai-ekonomi?bidang={bidang}`** — Valuasi nilai ekonomi tahunan resmi per bidang dari MySQL `nilai_ekonomi_tahunan`.
- **`GET /api/v1/komoditas-unggulan`** — Daftar komoditas unggulan dinamis per bidang (pangan, hortikultura, perkebunan, peternakan, perikanan) dengan kalkulasi otomatis dari tabel produksi riil (termasuk 10 jenis ikan).
- **`GET /api/v1/komoditas-unggulan/per-kecamatan?tahun={tahun}`** — Komoditas unggulan teratas (ranking #1) per kecamatan untuk 5 bidang utama, dihitung server-side dari tabel produksi riil.
- **`GET /api/v1/lumbung`** — Data sebaran, kapasitas unit lumbung pangan dan gudang cadangan beras.
- **`GET /api/v1/kelembagaan/kelompok-tani`** — Direktori Kelompok Tani (Poktan) & Gapoktan per desa.
- **`GET /api/v1/kelembagaan/kth`** — Kelompok Tani Hutan (KTH) dan kelas kemampuannya.
- **`GET /api/v1/kelembagaan/pertanian`** — Register Poktan, Gapoktan, dan KWT dengan nomor registrasi SIMLUHTAN dan SK pengukuhan.
- **`GET /api/v1/kelembagaan/perikanan`** — Register Pokdakan, Poklahsar, dan Pokmaswas dengan ID KUSUKA KKP dan izin usaha.
- **`GET /api/v1/kelembagaan/juleha`** — Data Juru Sembelih Halal (JULEHA) tersertifikasi kompetensi di RPH/RPU Banjarnegara.
- **`GET /api/v1/kelembagaan/pendukung`** — Data kelembagaan pendukung mencakup akreditasi P4S dan inventaris alsintan UPJA.
- **`GET /api/v1/psat-pduk/sampel`** — Hasil uji petik acak residu pestisida, formalin, dan cemaran kimia pada pasar tradisional.
- **`GET /api/v1/psat-pduk/izin-edar`** — Register izin edar Pangan Segar Asal Tumbuhan Produksi Dalam Negeri Usaha Kecil (PSAT-PDUK).
- **`GET /api/v1/ketahanan/fsva`** — Data 12 Indikator Peta Ketahanan dan Kerentanan Pangan (FSVA Bapanas) per kecamatan.
- **`GET /api/v1/ketahanan/neraca`** — Neraca pangan komposit ketersediaan, kebutuhan, dan surplus/defisit komoditas pangan pokok.
- **`GET /api/v1/ketahanan/logistik`** — Hasil survei kapasitas gilingan padi (RMU) dan rantai pasok beras antar-wilayah.
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

### `POST /api/v1/admin/logout`
Melakukan terminasi sesi admin, mencabut token dari memori, dan mencatat aksi log aktivitas.
- **Headers:** `Authorization: Bearer <token>`
- **Response 200 OK:** `{"ok": true, "message": "Berhasil keluar dari sesi dasbor admin."}`

### `GET /api/v1/admin/domains`
Mengambil daftar domain (total 23 domain lengkap) yang dapat dikelola oleh akun yang sedang masuk berdasarkan peran RBAC (`bantuan-program`, `bantuan-alokasi`, `bantuan-korelasi`, `padi`, `palawija`, `hortikultura`, `perkebunan`, `peternakan`, `perikanan`, `lahan`, `lumbung`, `ekonomi`, `kelembagaan`, `st2023`, `renstra`, `ltt-katam`, `kelembagaan-pertanian`, `kelembagaan-perikanan`, `kelembagaan-pendukung`, `harga-pasar`, `fsva-desa`, `neraca-pangan`, `psat-pduk`).
- **Headers:** `Authorization: Bearer <token>`
- **Response 200 OK:** Array konfigurasi domain beserta skema sheet, natural key, dan dropdown enum.

### `GET /api/v1/admin/template/:domain`
Mengunduh formulir template berkas Microsoft Excel (`.xlsx`) kosong untuk domain tertentu. Berkas dilengkapi sheet petunjuk tata cara pengisian, sheet data berformat resmi, dan sheet data contoh. Kolom teknis `desa_id` di-skip secara otomatis agar tidak membingungkan pengguna.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Berkas binary stream file `.xlsx`.

### `GET /api/v1/admin/export/:domain`
Mengekspor seluruh data aktif yang tersimpan pada tabel basis data untuk domain terkait ke dalam format workbook Excel multi-sheet. Pada tabel yang memiliki flag `hasSumber`, otomatis disuntikkan kolom `Sumber Data` untuk audit traceability. Aksi tercatat otomatis di `activity_logs`.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Berkas binary stream file `.xlsx`.

### `POST /api/v1/admin/import/:domain`
Mengunggah berkas Excel (`.xlsx`) hasil input untuk diintegrasikan secara langsung ke dalam basis data MySQL.
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Form Data Field:** `file` (berkas .xlsx, batas maksimum 15 MB)
- **Logika Proses:**
  1. Validasi struktur sheet dan nama kolom.
  2. Resolusi otomatis `desa_id` dari `kode_desa` atau pasangan `(kecamatan_id + nama_desa)`.
  3. Resolusi otomatis `kode_kec` dari tabel master `kecamatan`.
  4. Eksekusi `INSERT ... ON DUPLICATE KEY UPDATE` berbasis *natural key*.
  5. Pencatatan audit ke tabel `sync_log` dan `activity_logs`.
- **Response 200 OK:**
  ```json
  {
    "domain": "fsva-desa",
    "sheets": [
      {
        "name": "FSVA Desa",
        "table": "fsva_desa_indikator",
        "inserted": 0,
        "updated": 278,
        "skipped": 0,
        "errors": []
      }
    ],
    "inserted": 0,
    "updated": 278,
    "skipped": 0,
    "errors": []
  }
  ```

### `GET /api/v1/admin/sync-log`
Menampilkan riwayat audit sinkronisasi dan impor data dengan paginasi server-side (`?page=N&limit=N`, default page=1, limit=10).
- **Headers:** `Authorization: Bearer <token>` (Khusus Peran Administrator)
- **Response 200 OK:** `{"total": 119, "page": 1, "limit": 10, "totalPages": 12, "data": [...]}`

### `GET /api/v1/admin/activity-log`
Menampilkan riwayat audit aktivitas pengguna (login, logout, import, export) dengan paginasi server-side (`?page=N&limit=N`, default page=1, limit=10).
- **Headers:** `Authorization: Bearer <token>` (Khusus Peran Administrator)
- **Response 200 OK:** `{"total": 76, "page": 1, "limit": 10, "totalPages": 8, "data": [...]}`

### `GET /api/v1/admin/paket`
Menampilkan indeks paket arsip data template dan ekspor siap unduh (format Excel dan CSV) yang tersimpan di server.
- **Headers:** `Authorization: Bearer <token>` (Khusus Peran Administrator)

### `GET /api/v1/admin/readiness`
Audit otomatis kesiapan data publik per bidang/menu frontend, tahun data terakhir (`latestYear`), dan pelacakan status tabel basis data vs penyangga fallback disk/CKAN.
- **Headers:** `Authorization: Bearer <token>` (Khusus Peran Administrator)
- **Response 200 OK:**
  ```json
  {
    "score": 62,
    "summary": {
      "totalDomains": 24,
      "totalTables": 42,
      "readyTables": 26,
      "fallbackTables": 3,
      "emptyTables": 13,
      "readySectors": 3,
      "fallbackSectors": 3,
      "emptySectors": 1
    },
    "sectors": [
      {
        "id": "perkebunan",
        "label": "Bidang Perkebunan",
        "route": "/plantation",
        "status": "empty",
        "tables": [{ "table": "perkebunan_areal", "rows": 0, "status": "empty" }],
        "requestMemo": "Permintaan Data Bidang Perkebunan: Membutuhkan data Areal & Produksi Perkebunan per Kecamatan."
      }
    ]
  }
  ```

---

## 4. Endpoint Asisten Analis AI (Si Pertani)

### `POST /api/v1/ai/chat`
Endpoint proksi streaming berbasis Server-Sent Events (SSE) yang melayani Chatbot Si Pertani dengan integrasi Google Gemini API, proteksi keamanan, dan Dynamic RAG (Retrieval-Augmented Generation) langsung dari basis data.

- **Autentikasi & Keamanan:**
  - Token rahasia `GEMINI_API_KEY` terisolasi di sisi server (`.env`), tidak pernah dibocorkan ke klien.
  - **In-Memory Sliding Rate Limiter:** Maksimal 30 request/menit per IP klien (mencegah eksploitasi dan kuota drain).
  - **Payload Sanitization:** Pembatasan histori chat (maks. 30 pesan terakhir), validasi array pesan, dan pembatasan `max_tokens` (maks. 4096-8192).
- **Dynamic Live RAG Retrieval:**
  - Server secara otomatis mendeteksi kata kunci dari pesan pengguna.
  - Melakukan query paralel langsung ke MySQL `pertasis` (`komoditas_unggulan`, `perkebunan_produksi`, `padi_produksi`, `palawija_produksi`, `horti_produksi`, `ternak_populasi`, `ikan_budidaya`).
  - Melakukan query langsung ke portal CKAN Open Data Banjarnegara (`opendata.banjarnegarakab.go.id/api/3/action/package_search`) untuk pencarian katalog dataset terkait.
  - Menyuntikkan hasil query angka riil ke prompt sistem sebelum diteruskan ke model LLM.
- **Model Fallback Orchestration:**
  - Mengutamakan model berkinerja tinggi dan stabil: `gemini-flash-lite-latest`.
  - Jika upstream mengembalikan error beban tinggi (503 / 429), server otomatis mencoba model cadangan: `gemini-3.5-flash-lite`, `gemini-3.6-flash`, atau `gemini-3.8-flash`.
- **Request Body (JSON):**
  ```json
  {
    "model": "gemini-flash-lite-latest",
    "messages": [
      { "role": "user", "content": "Analisa produksi kopi Banjarnegara" }
    ],
    "stream": true,
    "temperature": 0.6
  }
  ```
- **Response 200 OK (Stream):**
  - **Headers:** `Content-Type: text/event-stream`, `Cache-Control: no-cache, no-transform`, `Connection: keep-alive`
  - **Format Body:** Server-Sent Events (SSE) data chunks:
    ```
    data: {"choices":[{"delta":{"content":"Berdasarkan data..."}}]}
    data: [DONE]
    ```
- **Error Responses:**
  - `400 Bad Request`: `{"error": "invalid_payload", "message": "..."}`
  - `429 Too Many Requests`: `{"error": "rate_limit_exceeded", "message": "Terlalu banyak permintaan chat..."}`
  - `503 Service Unavailable`: `{"error": "service_unavailable", "message": "..."}`

---

## 5. Kebijakan Zero Dummy Data Sektoral (Perikanan)

Sesuai prinsip kepatuhan **ADR-002 (Zero Dummy Data Law)** dan **ADR-006 (Zero Dummy Fish Species)**:
1. Pendataan resmi Distankan KP Kabupaten Banjarnegara hanya mencatat sektor perikanan menurut **metode budidaya** (kolam pembesaran, karamba, minapadi) dan **alat tangkap perairan umum** (jala tebar, pancing, jaring insang).
2. Tidak ada pencatatan resmi per spesies ikan (Nila, Lele, Mas, Gurame, Koi, dll.) dalam berkas dinas. Seluruh data sintetis spesies ikan telah **dibersihkan total** dari basis data.
3. Dampak respons API perikanan:
   - `GET /api/v1/komoditas-unggulan?sektor=perikanan`: Mengembalikan `[]` (kosong).
   - `GET /api/v1/ekonomi/nilai-ekonomi?bidang=perikanan`: Mengembalikan `{ bidang: "perikanan", sumber: "kosong", jumlah: 0, rows: [] }`.
   - `GET /api/v1/ekonomi/sektor-ringkasan?sektor=perikanan`: Mengembalikan `{ status: "empty", sektor: "perikanan", ... }`.

---

## 6. Endpoint Direktori Kelembagaan Pertanian Terpadu

### `GET /api/v1/kelembagaan/pertanian`
Mengembalikan register resmi kelompok tani, kelompok wanita tani (KWT), dan gabungan kelompok tani (Gapoktan) Kabupaten Banjarnegara (2.687 kelompok).
- **Query Parameters:**
  - `kecamatan` (opsional): Filter nama kecamatan (e.g. `Susukan`, `Bawang`, `Purwareja Klampok`)
  - `jenis` (opsional): Filter jenis kelembagaan (`Poktan`, `KWT`, `Gapoktan`)
  - `q` (opsional): Pencarian teks nama kelompok, desa, nama ketua, atau nomor SIMLUHTAN
- **Response 200 OK:**
  ```json
  {
    "status": "success",
    "total": 2687,
    "rows": [
      {
        "id": 1,
        "id_simluhtan": "330401001",
        "nama_kelompok": "SRI REJEKI",
        "jenis_lembaga": "Poktan",
        "desa": "Gumelem Kulon",
        "kecamatan": "Susukan",
        "nama_ketua": "SUTARNO",
        "jumlah_anggota": 35,
        "luas_lahan_ha": 12.5,
        "kelas_kemampuan": "Madya",
        "subsektor_utama": "Tanaman Pangan",
        "penyuluh_pendamping": "BAMBANG S., S.P."
      }
    ]
  }
  ```

### `GET /api/v1/kelembagaan/kep`
Mengembalikan master data Kelembagaan Ekonomi Petani (137 unit KEP resmi binaan BPP).
- **Query Parameters:** `kecamatan`, `bentuk` (Koperasi, BUMDes, PT, CV, Kelompok), `q`
- **Response 200 OK:**
  ```json
  {
    "status": "success",
    "total": 137,
    "rows": [
      {
        "id": 1,
        "nama_kep": "KOPERASI PRODUSEN TANI MAKMUR",
        "bentuk_kep": "Koperasi",
        "komoditas": "Kopi Arabika",
        "jenis_usaha": "Pengolahan & Pemasaran",
        "kecamatan": "Batur",
        "modal_usaha_aset": 150000000,
        "penyuluh_pendamping": "SURATNO, S.P.",
        "status_aktif": "Aktif"
      }
    ]
  }
  ```

### `GET /api/v1/kelembagaan/posluhdes`
Mengembalikan daftar Pos Penyuluhan Desa / Kelurahan (36 unit Posluhdes).
- **Query Parameters:** `kecamatan` (filter BPP), `q`
- **Response 200 OK:**
  ```json
  {
    "status": "success",
    "total": 36,
    "rows": [
      {
        "id": 1,
        "nama_posluhdes": "POSLUHDES KARYA TANI",
        "desa": "Gumelem Wetan",
        "bpp": "Susukan",
        "nama_pimpinan": "H. AHMAD",
        "penyuluh_swadaya": "SUKIRMAN",
        "kontak_hp": "-"
      }
    ]
  }
  ```

### `GET /api/v1/kelembagaan/pps`
Mengembalikan direktori profil Penyuluh Pertanian Swadaya (156 PPS Kabupaten Banjarnegara).
- **Query Parameters:** `q` (nama penyuluh, unit kerja BPP, wilayah kerja)
- **Response 200 OK:**
  ```json
  {
    "status": "success",
    "total": 156,
    "rows": [
      {
        "id": 1,
        "nama_penyuluh": "AGUS PRIYONO",
        "unit_kerja": "BPP Klampok",
        "wilayah_kerja": "Klampok, Kaliwinasuh",
        "keahlian_tp": true,
        "keahlian_horti": false,
        "keahlian_nak": true,
        "keahlian_bun": false,
        "pendidikan": "SLTA",
        "kontak_hp": "-"
      }
    ]
  }
  ```

### `GET /api/v1/kelembagaan/rekap-validasi`
Mengembalikan rekapitulasi penetapan validasi kemampuan kelas kelompok tani per kecamatan berdasarkan SK resmi Kepala Dinas Pertanian, Perikanan dan Ketahanan Pangan (20 kecamatan).
- **Response 200 OK:**
  ```json
  {
    "status": "success",
    "total": 20,
    "rows": [
      {
        "no": 1,
        "kecamatan": "Susukan",
        "jumlah_desa": 15,
        "jumlah_gapoktan": 15,
        "jumlah_poktan": 129,
        "kelas_pemula": 38,
        "kelas_lanjut": 58,
        "kelas_madya": 29,
        "kelas_utama": 4
      }
    ]
  }
  ```

### `GET /api/v1/kelembagaan/summary`
Mengembalikan indikator performa utama ringkas kelembagaan kabupaten untuk kartu metrik dan dasbor.
- **Response 200 OK:**
  ```json
  {
    "status": "success",
    "pertanian": [
      { "jenis_lembaga": "Poktan", "count": 2177, "anggota": 87080, "luas": 32655 },
      { "jenis_lembaga": "Gapoktan", "count": 278, "anggota": 0, "luas": 0 },
      { "jenis_lembaga": "KWT", "count": 232, "anggota": 6960, "luas": 116 }
    ],
    "kep": { "count": 137, "total_modal": 2209735848, "total_anggota": 3425, "total_poktan": 411 },
    "posluhdes": { "count": 36, "total_bpp": 17, "total_desa": 35 },
    "pps": { "count": 156 }
  }
  ```

---

## 4. Endpoint Asisten AI & Live RAG Engine (Si Pertani)

### `POST /api/v1/ai/chat` (juga tersedia di `/sispertani-api/v1/ai/chat`)
Menyediakan asisten analitik cerdas Si Pertani dengan grounding faktual live database MySQL `pertasis` dan fallback multi-model Google Gemini.
- **Rate Limit:** 30 request / menit per IP (HTTP 429 jika terlampaui).
- **Request Body (JSON):**
  ```json
  {
    "messages": [
      { "role": "user", "content": "kalau 2023 salak paling banyak dari mana?" }
    ],
    "stream": true
  }
  ```
- **Fitur Live RAG Engine:**
  - **Dynamic Year Extraction:** Mengurai tahun spesifik (2023, 2024, 2025) secara dinamis via regex `\b(201\d|202\d)\b`.
  - **Filter Faktual Bebas Dummy:** Menyaring `total_produksi > 0 AND is_unggulan = 1` pada `komoditas_unggulan`.
  - **Spesialisasi Sektoral:** Menarik data faktual kelompok tanaman hias, ikan hias, perkebunan (kopi robusta vs arabika), sayuran dataran tinggi (wortel Dieng), dan direktori kelembagaan KWT per kecamatan/desa.
- **Response Modes:**
  - `stream: true`: `text/event-stream` (Server-Sent Events) OpenAI-compatible format `data: {"choices":[{"delta":{"content":"..."}}]}`.
  - `stream: false`: `application/json` format `{"choices":[{"message":{"content":"..."}}]}`.



