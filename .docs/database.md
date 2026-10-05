# Skema Basis Data SISPERTANI (`pertasis`)

Dokumentasi lengkap struktur basis data MySQL/MariaDB `pertasis`, relasi master data, pengelompokan domain, dan aturan *natural key* untuk operasi pembaruan (upsert).

---

## 1. Ringkasan Basis Data

- **Database Engine:** MySQL / MariaDB (InnoDB)
- **Collation:** `utf8mb4_unicode_ci`
- **Total Tabel:** 54 Tabel
- **Prinsip Upsert:** Seluruh tabel data statistik memiliki kunci unik natural (`UNIQUE KEY` pada kombinasi dimensi wilayah, tahun, dan komoditas) untuk mendukung operasi penggabungan `INSERT INTO ... ON DUPLICATE KEY UPDATE` saat impor Excel dilakukan.

---

## 2. Tabel Master Geografi & Referensi

### `kecamatan`
Menyimpan 20 wilayah kecamatan resmi di Kabupaten Banjarnegara.
- `id` (INT, Primary Key)
- `nama` (VARCHAR(100), Unique — e.g. Banjarnegara, Batur, Purwareja Klampok, Wanadadi)
- `kode_bps` (VARCHAR(10))
- `latitude`, `longitude` (DECIMAL)

### `desa`
Menyimpan seluruh desa dan kelurahan di Kabupaten Banjarnegara.
- `id` (INT, Primary Key)
- `kecamatan_id` (INT, FK → `kecamatan.id`)
- `nama` (VARCHAR(100))
- `desa_norm` (VARCHAR(100), Index — format uppercase tanpa spasi berlebih)
- `kode_kemendagri` (VARCHAR(20))

### `komoditas` & `varietas`
Katalog komoditas unggulan dan varietas spesifik (Padi Pandanwangi, Kentang Granola, Salak Pondoh, Kopi Arabika Dieng).

---

## 3. Matriks Domain Data Statistik & Kunci Natural (Upsert)

| Kelompok / Domain | Tabel MySQL | Kolom Natural Key (Kombinasi Unik) | Deskripsi Data |
|---|---|---|---|
| **Padi** | `padi_produksi` | `(kecamatan_id, tahun, jenis)` | Produksi, luas panen, dan produktivitas padi sawah vs ladang |
| **Palawija** | `palawija_produksi` | `(kecamatan_id, tahun, komoditas)` | Jagung, kedelai, kacang tanah, ubi kayu, ubi jalar, kacang hijau |
| **Lahan** | `lahan_penggunaan` | `(kategori, tahun)` | Luas sawah irigasi, tadah hujan, tegalan, perkebunan, pemukiman |
| **Lahan** | `lahan_desa` | `(desa_id, tahun)` | Rincian luas lahan tingkat desa/kelurahan |
| **Hortikultura** | `horti_luas` | `(kecamatan_id, kelompok, komoditas, tahun)` | Luas panen sayuran & buah per kecamatan |
| **Hortikultura** | `horti_produksi` | `(kecamatan_id, kelompok, komoditas, tahun)` | Produksi sayuran & buah per kecamatan |
| **Hortikultura** | `horti_luas_kabupaten` | `(kelompok, komoditas, tahun)` | Agregat luas hortikultura kabupaten |
| **Hortikultura** | `horti_produksi_kabupaten` | `(kelompok, komoditas, tahun)` | Agregat produksi hortikultura kabupaten |
| **Perkebunan** | `perkebunan_areal` | `(kecamatan_id, tanaman, tahun)` | Luas areal tanaman perkebunan (TM, TBM, TR) |
| **Perkebunan** | `perkebunan_produksi` | `(kecamatan_id, tanaman, tahun)` | Produksi komoditas perkebunan per kecamatan |
| **Perkebunan** | `perkebunan_produksi_kabupaten` | `(tanaman, tahun)` | Produksi perkebunan tingkat kabupaten |
| **Peternakan** | `ternak_populasi` | `(kecamatan_id, kelompok, jenis, tahun)` | Populasi ternak hidup per ekor (besar, kecil, unggas, inc. Domba Batur sebagai ternak hias & bibit ekor) |
| **Peternakan** | `ternak_daging` | `(kecamatan_id, kelompok, jenis, tahun)` | Produksi daging ternak potong (Sapi, Kerbau, Kambing, Domba, Kelinci, Unggas — tidak mencakup Domba Batur) |
| **Peternakan** | `ternak_telur` | `(kecamatan_id, jenis, tahun)` | Produksi telur (ayam ras layer, ayam kampung, itik, puyuh) |
| **Peternakan** | `ternak_susu_kulit` | `(kecamatan_id, jenis, tahun)` | Produksi susu (sapi, kambing) & kulit terpilah per jenis hewan (Kulit Sapi, Kerbau, Kambing, Domba, Kelinci, Wol Batur, Tulang & Tanduk) |
| **Peternakan** | `ternak_hpt` | `(kecamatan_id, jenis_hijauan, tahun)` | Lahan Hijauan Pakan Ternak (Odot, Gajah, Pakchong, Indigofera) & kapasitas ST |
| **Peternakan** | `ternak_umkm_pakan` | `(kecamatan_id, nama_usaha, tahun)` | Direktori UMKM & kelompok tani pakan ternak mandiri |
| **Peternakan** | `ternak_poultry_shop` | `(kecamatan_id, nama_toko, tahun)` | Sebaran kios sapronak, obat hewan, dan poultry shop |
| **Peternakan** | `ternak_nkv` | `(kecamatan_id, nama_unit_usaha, tahun)`| Register sertifikasi Nomor Kontrol Veteriner produk hewan |
| **Peternakan** | `ternak_flow` | `(kecamatan_id, arah, jenis, tahun)` | Arus keluar/masuk ternak lintas wilayah |
| **Peternakan** | `ternak_pemotongan` | `(kecamatan_id, lokasi, jenis, tahun)` | Pemotongan hewan RPH pemerintah vs non-RPH |
| **Perikanan** | `ikan_produksi_jenis` | `(tahun, jenis_ikan)` | Data definitif 10 spesies ikan budidaya (Lele, Nila, Gurami, Bawal, Nilem, Mujair, Mas, Tawes, Patin, Tambakan) 2020–2025 |
| **Perikanan** | `ikan_budidaya` | `(kecamatan_id, jenis_budidaya, tahun)` | Produksi budidaya kolam air tenang, deras, minapadi |
| **Perikanan** | `ikan_tangkap` | `(kecamatan_id, jenis_alat, tahun)` | Produksi tangkap perairan umum per jenis alat (termasuk Bubu) |
| **Perikanan** | `ikan_tangkap_perairan_umum`| `(kecamatan_id, tahun)` | Tangkap ikan di waduk Mrica & sungai Serayu |
| **Perikanan** | `ikan_benih` | `(kecamatan_id, arah, tahun)` | Produksi & distribusi benih ikan (ekor dan luas Ha) |
| **Perikanan** | `ikan_kolam`, `ikan_waduk`, `ikan_minapadi` | `(kecamatan_id, tahun)` | Luas bidang pemeliharaan perikanan (ha/m²) |
| **Perikanan** | `ikan_pemeliharaan` | `(kecamatan_id, tempat, tahun)` | Rincian tempat pemeliharaan ikan |
| **Perikanan** | `ikan_obyek_penangkapan` | `(kecamatan_id, obyek, arah, tahun)` | Pemantauan obyek penangkapan ikan |
| **Perikanan** | `ikan_hias` | `(kecamatan_id, varietas, tahun)` | Budidaya ikan hias (cupang, koi, koki, guppy, arwana, dll.) |
| **Ekonomi** | `inflasi` | `(wilayah, tahun)` | Laju inflasi komoditas pangan |
| **Ekonomi** | `pasar` | `(jenis, tahun)` | Jumlah dan kategori pasar daerah |
| **Ekonomi** | `nilai_ekonomi_tahunan` | `(bidang, komoditas, tahun, triwulan)`| Valuasi rupiah (Volume × Harga Produsen) |
| **Ekonomi / Komoditas** | `komoditas_unggulan` | `(sektor, nama_komoditas, tahun)` | Agregasi dinamis komoditas unggulan ranking #1, volume, sentra, dan valuasi estimasi (ADR-009: auto-calculated dari tabel produksi) |
| **Ekonomi** | `lumbung_pangan` | `(kecamatan_id, tahun)` | Jumlah unit & kapasitas lumbung/gudang |
| **Kelembagaan**| `kelompok_tani` | `(desa_id, tahun)` | Jumlah Poktan, Gapoktan, dan anggota per desa |
| **Kelembagaan**| `kelompok_tani_hutan` | `(desa_id, tahun)` | KTH tingkat Pemula, Madya, Utama |
| **Kelembagaan (KWT)**| `kwt_kelompok_wanita_tani` | `(kecamatan, nama_kelompok)` | Profil KWT, Pokdakan, Poklahsar, Pokmamas per kecamatan |
| **Tanaman Pangan**| `ltt_katam` | `(kecamatan, komoditas, jenis, tahun)` | Luas Tambah Tanam (LTT) & Kalender Tanam (Katam) |
| **Bantuan** | `bantuan_program` | `(nama, sumber_dana, tahun_anggaran)`| Nama kegiatan, alokasi nilai, dan penerima |
| **Bantuan** | `bantuan_alokasi` | `(tahun)` | Pagu tahunan dana APBD & APBN |
| **Bantuan** | `bantuan_korelasi` | `(sektor)` | Korelasi bantuan vs kenaikan produksi |
| **Sensus** | `st2023_desa` | `(desa_id)` | Rumah tangga petani/nelayan hasil sensus ST2023 |
| **Kebijakan** | `renstra_target` | `(indikator, tahun_target)` | Target indikator kinerja Renstra Distankan |

> **Catatan Kepatuhan ADR-006 (Zero Dummy Fish Species):**  
> Tabel `komoditas_unggulan` dan `nilai_ekonomi_tahunan` dikosongkan untuk sektor perikanan karena data primer dinas (Distankan KP) hanya mencatat metode budidaya dan alat tangkap perairan umum tanpa rincian spesies ikan. Sesuai prinsip *Zero Dummy Data*, sistem tidak mentolerir adanya data sintetis jenis ikan.

---

## 4. Tabel Audit & Keamanan

### `sync_log`
Merekam seluruh aktivitas impor data via Excel oleh administrator bidang:
- `id` (BIGINT, Auto Increment)
- `dataset` (VARCHAR(100) — misal: `padi`, `hortikultura`)
- `sumber` (VARCHAR(100) — misal: `excel-upload:padi_2026.xlsx`)
- `aksi` (VARCHAR(50) — `import`, `export`, `sync`)
- `baris` (INT — jumlah baris yang berhasil diolah)
- `status` (VARCHAR(20) — `success`, `partial`, `failed`)
- `pesan` (TEXT — rincian pesan atau catatan error)
- `created_at` (TIMESTAMP)

### `activity_logs` / `log_aktivitas`
Pencatatan riwayat sesi dan interaksi administratif.
