# Skema Basis Data SISPERTANI (`pertasis`)

Dokumentasi lengkap struktur basis data MySQL/MariaDB `pertasis`, relasi master data, pengelompokan domain, dan aturan *natural key* untuk operasi pembaruan (upsert).

---

## 1. Ringkasan Basis Data

- **Database Engine:** MySQL / MariaDB (InnoDB)
- **Collation:** `utf8mb4_unicode_ci`
- **Total Tabel:** 71 Tabel (mencakup master geografi, 23 domain statistik operasional yang memetakan 55 tabel sheet, sistem RBAC, komoditas, varietas, tabel audit sync_log dan activity_logs)
- **Prinsip Upsert:** Seluruh tabel data statistik memiliki kunci unik natural (`UNIQUE KEY` pada kombinasi dimensi wilayah, tahun, dan komoditas) untuk mendukung operasi penggabungan `INSERT INTO ... ON DUPLICATE KEY UPDATE` saat impor Excel dilakukan. Kolom relasi teknis `desa_id` dan `kode_kec` di-resolve otomatis dari master geografi saat proses impor.
- **Harmonisasi Baseline & Patch Runner:** Sinkronisasi dua arah telah dilakukan antara data riil production dan skema termutakhir development. Skrip migrasi non-destruktif tersimpan di `database/production_migration_patch.sql` dan `database/patch_production_normalization_2026.sql` yang dapat dieksekusi via `npm run db:patch` atau `npm run db:normalize`.

### 1.1 Portabilitas Eksekusi & Normalisasi Relasional (ADR-039, ADR-040, ADR-041)

1. **Eliminasi Tabel Usang:** Tabel `fsva_indikator_kabupaten` (artefak agregat lama tanpa data desa) resmi di-drop. Seluruh ketahanan pangan desa dikelola secara tunggal di `fsva_desa_indikator`.
2. **Normalisasi Relasional Geografis:** Tabel master `kecamatan` dan `desa` dilengkapi kolom `kode` (kode BPS resmi, misal `3304160` dan `3304160005`) serta kolom `tipe` (`Desa` / `Kelurahan`).
3. **Integritas Foreign Key:** Tabel `fsva_desa_indikator` (278 desa) telah dinormalisasi dengan menambahkan `kecamatan_id` (FK $\rightarrow$ `kecamatan.id`) dan `desa_id` (FK $\rightarrow$ `desa.id`) berstatus `NOT NULL` serta cascade indexing.
4. **Auto-Resolving Saat Impor Excel:** Prosesor Excel (`src/lib/excel.js`) secara otomatis mencari `desa_id` dari `kode_desa` atau pasangan `(kecamatan_id, nama_desa)` dan mencari `kode_kec` dari `kecamatan_id`, sehingga admin pengguna tidak perlu menginput ID teknis di file Excel.
5. **Audit Logging Terintegrasi:** Seluruh aksi login, logout, impor, dan ekspor tercatat di tabel `activity_logs` dengan dukungan paginasi server-side di dasbor admin.

---

## 2. Tabel Master Geografi & Referensi

### `kecamatan`
Menyimpan 20 wilayah kecamatan resmi di Kabupaten Banjarnegara.
- `id` (TINYINT UNSIGNED, Primary Key)
- `kode` (VARCHAR(20), Kode BPS resmi kecamatan, mis. 3304160)
- `nama` (VARCHAR(50), Unique — e.g. Banjarnegara, Batur, Purwareja Klampok, Wanadadi)
- `nama_norm` (VARCHAR(50), Format UPPERCASE untuk join)
- `varian` (JSON, Daftar alias ejaan)

### `desa`
Menyimpan seluruh 278 desa dan kelurahan di Kabupaten Banjarnegara.
- `id` (SMALLINT UNSIGNED, Primary Key)
- `kode` (VARCHAR(20), Kode BPS resmi desa, mis. 3304160005)
- `kecamatan_id` (TINYINT UNSIGNED, FK → `kecamatan.id`)
- `nama` (VARCHAR(80))
- `tipe` (ENUM('Desa', 'Kelurahan'))
- `nama_norm` (VARCHAR(80), Index — format uppercase tanpa spasi berlebih)

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
| **Kelembagaan Pertanian**| `kelembagaan_pertanian` | `(kecamatan, desa, jenis_lembaga, nama_kelompok)` | Register resmi Poktan, Gapoktan, dan KWT (ID Simluhtan, Gapoktan Induk, Luas Lahan Ha, PPL Pendamping — 2.177 Poktan, 232 KWT, 278 Gapoktan — Total 2.687 kelompok) |
| **Kelembagaan Ekonomi**| `kelembagaan_kep` | `(kecamatan, nama_kep)` | Kelembagaan Ekonomi Petani (137 KEP: LKM, LKMA, Koperasi Tani, modal usaha/aset Rp 2,21 Miliar) |
| **Penyuluhan Desa**| `kelembagaan_posluhdes` | `(desa, nama_posluhdes)` | Pos Penyuluhan Desa/Kelurahan (36 unit, SK pengukuhan, penyuluh swadaya) |
| **Penyuluh Swadaya**| `kelembagaan_pps` | `(nama_penyuluh, unit_kerja)` | Penyuluh Pertanian Swadaya (156 PPS: keahlian TP, Horti, Ternak, Kebun, kontak) |
| **Rekapitulasi Validasi**| `kelembagaan_rekap_kecamatan` | `(kecamatan)` | Rekapitulasi penetapan validasi kelas kemampuan kelompok tani (20 kecamatan SK Kadistan: 2.398 Poktan, 277 Gapoktan, kelas Pemula, Lanjut, Madya, Utama) |
| **Kelembagaan Perikanan**| `kelembagaan_perikanan` | `(kecamatan, nama_kelompok)` | Register resmi Pokdakan, Poklahsar, Pokmaswas dengan ID KUSUKA |
| **Kelembagaan Halal**| `kelembagaan_juleha` | `(kecamatan, nama_lengkap)` | Register Juru Sembelih Halal (JULEHA) tersertifikasi RPH/RPU |
| **Kelembagaan Pendukung**| `kelembagaan_p4s` | `(kecamatan, nama_p4s)` | Pusat Pelatihan Pertanian dan Perdesaan Swadaya (P4S) |
| **Kelembagaan Alsintan**| `kelembagaan_upja` | `(kecamatan, nama_upja)` | Usaha Pelayanan Jasa Alsintan (UPJA) & armada kelolaan |
| **Keamanan Pangan**| `psat_pduk` | `(id)` | Register izin edar & hasil uji petik residu pestisida pangan segar pasar (5 entitas aktif) |
| **Keamanan Pangan**| `psat_sampel_uji` | `(kecamatan_id, pasar, tanggal_uji, jenis_pangan)` | Uji petik acak residu pestisida & cemaran bahan pangan |
| **Keamanan Pangan**| `psat_izin_edar` | `(nomor_izin_pduk)` | Register sertifikasi izin edar PSAT-PDUK pelaku usaha |
| **Ketahanan Pangan**| `fsva_desa_indikator` | `(kode_desa, tahun)` [FK: `kecamatan_id`, `desa_id`] | Validasi 16 indikator FSVA-Desa Bapanas & Distankan KP (10 fisik & demografi: lahan Ha, sarpras unit, miskin DTKS jiwa, air bersih RT, nakes orang, luas desa Ha, penduduk jiwa, RT, kepadatan; 5 rasio; IKP 0–100, komposit prioritas 1–6, ranking) untuk 278 desa se-Banjarnegara |
| **Ketahanan Pangan**| `harga_pasar_banjarnegara` | `(id)` | Pemantauan harga harian komoditas pangan di pasar tradisional Banjarnegara (16 komoditas terpantau) |
| **Ketahanan Pangan**| `neraca_pangan_komposit` | `(tahun, komoditas)` | Neraca ketersediaan vs kebutuhan komoditas pokok strategis (8 komoditas utama) |
| **Ketahanan Pangan**| `survei_logistik_beras` | `(kecamatan_id, nama_rmu, tahun)` | Kapasitas penggilingan beras (RMU) & arus distribusi pangan |
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

### `activity_logs`
Merekam seluruh jejak audit tindakan pengguna/admin (autentikasi dan transaksi data) secara persisten:
- `id` (BIGINT UNSIGNED, Primary Key, Auto Increment)
- `user_id` (INT UNSIGNED NULL — referensi ID user jika ada)
- `username` (VARCHAR(50) — identitas pengguna atau `guest`)
- `nama_lengkap` (VARCHAR(100) NULL)
- `role` (VARCHAR(50) — mis. `admin`, `tanaman-pangan`, dll.)
- `action` (VARCHAR(50) — `LOGIN`, `LOGOUT`, `IMPORT`, `EXPORT`, dll.)
- `entity` (VARCHAR(100) — mis. `auth`, `domain:fsva-desa`)
- `description` (TEXT — rincian tindakan dan volume baris yang diproses)
- `ip_address` (VARCHAR(45) — alamat IP klien)
- `user_agent` (TEXT — identifikasi klien/browser)
- `status` (ENUM('success', 'failed', 'warning'))
- `metadata` (LONGTEXT NULL — data pelengkap JSON)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
- **Index:** `idx_created_at`, `idx_username`, `idx_action`, `idx_role`, `idx_status`
