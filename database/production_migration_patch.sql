-- =========================================================================
-- SISPERTANI PRODUCTION MIGRATION PATCH (NON-DESTRUCTIVE / IDEMPOTENT)
-- Generated: 2026-10-06T03:29:05.458Z
-- Tujuan: Menyelaraskan skema & data production dengan development tanpa merusak data lama.
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- -------------------------------------------------------------------------
-- 1. ALTER KOLOM PADA TABEL EKSIS
-- -------------------------------------------------------------------------

-- 1.1 Tambah komoditas_id pada horti_produksi & palawija_produksi (jika belum ada)
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'horti_produksi' AND COLUMN_NAME = 'komoditas_id');
SET @query := IF(@exist = 0, 'ALTER TABLE `horti_produksi` ADD COLUMN `komoditas_id` int(11) DEFAULT NULL AFTER `komoditas`', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'palawija_produksi' AND COLUMN_NAME = 'komoditas_id');
SET @query := IF(@exist = 0, 'ALTER TABLE `palawija_produksi` ADD COLUMN `komoditas_id` int(11) DEFAULT NULL AFTER `komoditas`', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 1.2 Update ENUM satuan pada horti_produksi_kabupaten agar mencakup 'kg'
ALTER TABLE `horti_produksi_kabupaten` MODIFY COLUMN `satuan` enum('ton','tangkai','kg') NOT NULL DEFAULT 'ton';

-- 1.3 Tambah luas_ha pada ikan_benih
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ikan_benih' AND COLUMN_NAME = 'luas_ha');
SET @query := IF(@exist = 0, 'ALTER TABLE `ikan_benih` ADD COLUMN `luas_ha` decimal(10,2) DEFAULT NULL AFTER `jumlah_ekor`', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 1.4 Sesuaikan kwt_kelompok_wanita_tani & ltt_katam
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'kwt_kelompok_wanita_tani' AND COLUMN_NAME = 'kecamatan');
SET @query := IF(@exist = 0, 'ALTER TABLE `kwt_kelompok_wanita_tani` ADD COLUMN `kecamatan` varchar(100) DEFAULT NULL AFTER `id`', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ltt_katam' AND COLUMN_NAME = 'kecamatan');
SET @query := IF(@exist = 0, 'ALTER TABLE `ltt_katam` ADD COLUMN `kecamatan` varchar(100) DEFAULT NULL AFTER `id`, ADD COLUMN `source` varchar(50) DEFAULT ''manual'' AFTER `sumber`, ADD COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- -------------------------------------------------------------------------
-- 2. TABEL BARU DARI PENGEMBANGAN (14 TABEL)
-- -------------------------------------------------------------------------

-- Tabel: roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` varchar(50) NOT NULL,
  `nama_role` varchar(100) NOT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `scope_bidang` varchar(100) NOT NULL,
  `can_upload` tinyint(1) DEFAULT 0,
  `can_manage_users` tinyint(1) DEFAULT 0,
  `can_switch_roles` tinyint(1) DEFAULT 0,
  `color` varchar(50) DEFAULT 'bg-slate-600 text-white',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT IGNORE INTO `roles` (`id`, `nama_role`, `deskripsi`, `scope_bidang`, `can_upload`, `can_manage_users`, `can_switch_roles`, `color`, `created_at`) VALUES
('admin_hortikultura', 'Admin Hortikultura', 'Pengelolaan data sayuran, buah-buahan, dan komoditas hortikultura.', 'Bidang Hortikultura', 1, 0, 0, 'bg-green-600 text-white', '2026-09-23 12:33:47'),
('admin_ketahanan_pangan', 'Admin Ketahanan Pangan & Penyuluhan', 'Pengelolaan neraca pangan, cadangan pangan, lumbung, dan kelembagaan tani.', 'Bidang Ketahanan Pangan', 1, 0, 0, 'bg-rose-600 text-white', '2026-09-23 12:33:47'),
('admin_perikanan', 'Admin Perikanan', 'Pengelolaan data budidaya kolam, tangkap, pembenihan, dan ikan hias.', 'Bidang Perikanan', 1, 0, 0, 'bg-blue-600 text-white', '2026-09-23 12:33:47'),
('admin_perkebunan', 'Admin Perkebunan', 'Pengelolaan data perkebunan rakyat (kopi, teh, kapulaga, kelapa deres).', 'Bidang Perkebunan', 1, 0, 0, 'bg-teal-600 text-white', '2026-09-23 12:33:47'),
('admin_peternakan', 'Admin Peternakan & Keswan', 'Pengelolaan populasi ternak, pemotongan RPH, daging, telur, susu & kulit.', 'Bidang Peternakan', 1, 0, 0, 'bg-indigo-600 text-white', '2026-09-23 12:33:47'),
('admin_tanaman_pangan', 'Admin Tanaman Pangan', 'Pengelolaan data produksi, luas panen, dan komoditas tanaman pangan.', 'Bidang Tanaman Pangan', 1, 0, 0, 'bg-amber-600 text-white', '2026-09-23 12:33:47'),
('guest', 'Guest / Publik', 'Pengunjung umum dengan akses hanya-lihat (read-only) ke dashboard analitik.', 'Publik (Read-Only)', 0, 0, 0, 'bg-slate-500 text-white', '2026-09-23 12:33:47'),
('super_admin', 'Super Admin Dinas', 'Akses penuh ke seluruh bidang, kelola data, unggah CSV, dan manajemen peran.', 'Semua Bidang', 1, 1, 1, 'bg-emerald-600 text-white', '2026-09-23 12:33:47');

-- Tabel: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `nip` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role_id` varchar(50) NOT NULL,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_role` (`role_id`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT IGNORE INTO `users` (`id`, `username`, `password_hash`, `nama_lengkap`, `nip`, `email`, `role_id`, `status`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Super Admin Dinas Pertanian', '198005122005011001', 'admin@distankan.banjarnegarakab.go.id', 'super_admin', 'aktif', '2026-09-23 16:26:41', '2026-09-23 12:33:47', '2026-09-23 16:26:41'),
(2, 'admin_pangan', '7684518f786fe2158a4b22f2e2f8027236e4489f7b2f15739e357571ca89b0f9', 'Admin Bidang Tanaman Pangan', '198207152008011004', 'pangan@distankan.banjarnegarakab.go.id', 'admin_tanaman_pangan', 'aktif', '2026-09-23 14:14:56', '2026-09-23 12:33:47', '2026-09-23 14:14:56'),
(3, 'admin_horti', 'b5bab2e97df8790ea893b9a605237a86c7c4606980d023e4ea464a46d1ac7a69', 'Admin Bidang Hortikultura', '198403212009022002', 'horti@distankan.banjarnegarakab.go.id', 'admin_hortikultura', 'aktif', '2026-09-23 14:48:12', '2026-09-23 12:33:47', '2026-09-23 14:48:12'),
(4, 'admin_perkebunan', '67a4762f8ec1c899e4c6872ed190e9bd3573ec42ab137f570bf4b3f3ec5e8dc8', 'Admin Bidang Perkebunan', '198511182010011007', 'perkebunan@distankan.banjarnegarakab.go.id', 'admin_perkebunan', 'aktif', NULL, '2026-09-23 12:33:47', '2026-09-23 12:33:47'),
(5, 'admin_peternakan', '5952365f75ebd0429d98a987758a33c905b6e7d289ec951d70db26811d877e3f', 'Admin Bidang Peternakan & Keswan', '198609042011011003', 'peternakan@distankan.banjarnegarakab.go.id', 'admin_peternakan', 'aktif', '2026-09-23 12:49:30', '2026-09-23 12:33:47', '2026-09-23 12:49:30'),
(6, 'admin_perikanan', '781fe54fb77cc386f9e2ae6a306ea45356fc05b4d10b99529465fb0bd106904b', 'Admin Bidang Perikanan', '198801262014022001', 'perikanan@distankan.banjarnegarakab.go.id', 'admin_perikanan', 'aktif', NULL, '2026-09-23 12:33:47', '2026-09-23 12:33:47'),
(7, 'admin_ketahanan', 'fbc6f253bc4973d4014981ad44d0c13faa0a63ca12244930eeae30390108b046', 'Admin Bidang Ketahanan Pangan & Penyuluhan', '198904142015031005', 'ketahanan@distankan.banjarnegarakab.go.id', 'admin_ketahanan_pangan', 'aktif', NULL, '2026-09-23 12:33:47', '2026-09-23 12:33:47');

-- Tabel: user_sessions
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` varchar(50) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_token` (`token`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT IGNORE INTO `user_sessions` (`id`, `token`, `user_id`, `role_id`, `expires_at`, `created_at`) VALUES
(1, '10e39430bb7757d0d792cace93eb09c1f192326e7de22518d56e0577ebb3bcba', 1, 'super_admin', '2026-09-30 12:34:57', '2026-09-23 12:34:57'),
(5, '2271a8b57916bb2d7a491173e8dfd5b07e1d909d2f510570132bbbed48adaca3', 2, 'admin_tanaman_pangan', '2026-09-30 12:42:30', '2026-09-23 12:42:30'),
(7, '996a9149d3eb0bf425ccee52808facc6b1992818071ba61af644367360a12071', 5, 'admin_peternakan', '2026-09-30 12:49:30', '2026-09-23 12:49:30'),
(14, 'df548138a8515d03d0be385b6d00494c43a7e70a613bbda11085a8cfa8ee93e0', 1, 'super_admin', '2026-09-30 14:58:03', '2026-09-23 14:58:03'),
(15, 'ef31ce9974f813e53e0a42b4f01504baf8194a2fb0cab526538af76414457548', 1, 'super_admin', '2026-09-30 16:24:25', '2026-09-23 16:24:25'),
(16, '66d8c9cc88c083aefecbd5f40f25a47be054a0b816aa97e4ccd5d93e8defaac1', 1, 'super_admin', '2026-09-30 16:26:41', '2026-09-23 16:26:41');

-- Tabel: activity_logs
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `username` varchar(50) NOT NULL DEFAULT 'guest',
  `nama_lengkap` varchar(100) DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'guest',
  `action` varchar(50) NOT NULL,
  `entity` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `status` enum('success','failed','warning') DEFAULT 'success',
  `metadata` longtext DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_username` (`username`),
  KEY `idx_action` (`action`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT IGNORE INTO `activity_logs` (`id`, `user_id`, `username`, `nama_lengkap`, `role`, `action`, `entity`, `description`, `ip_address`, `user_agent`, `status`, `metadata`, `created_at`) VALUES
(1, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'SYSTEM_INIT', 'database', 'Inisialisasi sistem database MariaDB pertasis dan impor 42 tabel utama.', '127.0.0.1', NULL, 'success', '{"tables_imported":42,"source":"pertasis.sql"}', '2026-09-23 12:43:41'),
(2, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'TABLE_CREATE', 'ikan_hias', 'Pembuatan tabel ikan_hias dan populasi 80 data varietas (Koi, Mas Koki, Cupang, Komet) 20 kecamatan.', '127.0.0.1', NULL, 'success', '{"rows":80,"total_volume":2575000,"total_nilai":54175000000}', '2026-09-23 12:43:41'),
(3, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'TABLE_CREATE', 'komoditas_unggulan', 'Pembuatan tabel komoditas_unggulan dan kalkulasi sentra produksi per bidang.', '127.0.0.1', NULL, 'success', '{"rows":59,"sectors":5}', '2026-09-23 12:43:41'),
(4, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'RBAC_SETUP', 'auth', 'Konfigurasi Role-Based Access Control (RBAC): 8 peran dan 7 akun administrator dinas.', '127.0.0.1', NULL, 'success', '{"roles_count":8,"users_count":7}', '2026-09-23 12:43:41'),
(5, NULL, 'guest', 'Pengunjung', 'guest', 'VIEW_PAGE', '/admin', 'Pengunjung mengakses URL /admin — sistem mengaktifkan Guest Gate penguncian akses.', '127.0.0.1', NULL, 'warning', '{"gate_triggered":true,"access_denied":true}', '2026-09-23 12:43:41'),
(6, 5, 'admin_peternakan', 'Admin Bidang Peternakan & Keswan', 'admin_peternakan', 'LOGIN', 'auth', 'Pengguna Admin Bidang Peternakan & Keswan (Admin Peternakan & Keswan) berhasil masuk ke sistem administrasi.', '127.0.0.1', NULL, 'success', NULL, '2026-09-23 12:49:30'),
(7, NULL, 'intruder', NULL, 'guest', 'LOGIN_FAILED', 'auth', 'Percobaan masuk gagal untuk nama pengguna: "intruder". Kata sandi tidak sesuai.', '127.0.0.1', NULL, 'failed', NULL, '2026-09-23 12:49:30'),
(8, 5, 'admin_peternakan', 'Admin Bidang Peternakan & Keswan', 'admin_peternakan', 'VIEW_PAGE', '/livestock', 'Pengguna membuka halaman Dasbor Analitik Peternakan & Keswan.', '127.0.0.1', NULL, 'success', NULL, '2026-09-23 12:49:30'),
(9, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_hias', 'Ekspor data tabel ikan_hias (80 baris) ke format berkas CSV.', '127.0.0.1', NULL, 'success', '{"table":"ikan_hias","rows_exported":80}', '2026-09-23 12:49:30'),
(10, 2, 'admin_pangan', 'Admin Bidang Tanaman Pangan', 'admin_tanaman_pangan', 'LOGOUT', 'auth', 'Pengguna Admin Bidang Tanaman Pangan (Admin Tanaman Pangan) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 12:50:02'),
(11, 2, 'admin_pangan', 'Admin Bidang Tanaman Pangan', 'admin_tanaman_pangan', 'LOGIN', 'auth', 'Pengguna Admin Bidang Tanaman Pangan (Admin Tanaman Pangan) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 12:50:05'),
(12, 2, 'admin_pangan', 'Admin Bidang Tanaman Pangan', 'admin_tanaman_pangan', 'LOGOUT', 'auth', 'Pengguna Admin Bidang Tanaman Pangan (Admin Tanaman Pangan) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 12:55:31'),
(13, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGIN', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 12:55:33'),
(14, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGOUT', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:14:53'),
(15, 2, 'admin_pangan', 'Admin Bidang Tanaman Pangan', 'admin_tanaman_pangan', 'LOGIN', 'auth', 'Pengguna Admin Bidang Tanaman Pangan (Admin Tanaman Pangan) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:14:56'),
(16, 2, 'admin_pangan', 'Admin Bidang Tanaman Pangan', 'admin_tanaman_pangan', 'LOGOUT', 'auth', 'Pengguna Admin Bidang Tanaman Pangan (Admin Tanaman Pangan) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:15:32'),
(17, 3, 'admin_horti', 'Admin Bidang Hortikultura', 'admin_hortikultura', 'LOGIN', 'auth', 'Pengguna Admin Bidang Hortikultura (Admin Hortikultura) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:15:33'),
(18, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (80 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":80,"saved_file":"uploads\\\\2026-09-23T07-39-55-621Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:39:56'),
(19, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (8 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":8,"saved_file":"uploads\\\\2026-09-23T07-39-56-226Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:39:56'),
(20, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (9 baris) ke tabel "horti_produksi_kabupaten" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"append","rows_inserted":9,"saved_file":"uploads\\\\2026-09-23T07-39-56-310Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 14:39:56'),
(21, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (80 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":80,"saved_file":"uploads\\\\2026-09-23T07-44-48-815Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:44:49'),
(22, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (8 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":8,"saved_file":"uploads\\\\2026-09-23T07-44-49-138Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:44:49'),
(23, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (9 baris) ke tabel "horti_produksi_kabupaten" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"append","rows_inserted":9,"saved_file":"uploads\\\\2026-09-23T07-44-49-208Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 14:44:49'),
(24, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (80 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":80,"saved_file":"uploads\\\\2026-09-23T07-45-58-456Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:45:58'),
(25, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (8 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":8,"saved_file":"uploads\\\\2026-09-23T07-45-58-774Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:45:58'),
(26, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (9 baris) ke tabel "horti_produksi_kabupaten" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"append","rows_inserted":9,"saved_file":"uploads\\\\2026-09-23T07-45-58-820Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 14:45:58'),
(27, 3, 'admin_horti', 'Admin Bidang Hortikultura', 'admin_hortikultura', 'LOGOUT', 'auth', 'Pengguna Admin Bidang Hortikultura (Admin Hortikultura) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:48:03'),
(28, 3, 'admin_horti', 'Admin Bidang Hortikultura', 'admin_hortikultura', 'LOGIN', 'auth', 'Pengguna Admin Bidang Hortikultura (Admin Hortikultura) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:48:12'),
(29, 3, 'admin_horti', 'Admin Bidang Hortikultura', 'admin_hortikultura', 'LOGOUT', 'auth', 'Pengguna Admin Bidang Hortikultura (Admin Hortikultura) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:48:55'),
(30, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGIN', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:48:57'),
(31, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (80 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":80,"saved_file":"uploads\\\\2026-09-23T07-57-34-013Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:57:34'),
(32, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (8 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":8,"saved_file":"uploads\\\\2026-09-23T07-57-34-447Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:57:34'),
(33, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (9 baris) ke tabel "horti_produksi_kabupaten" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"append","rows_inserted":9,"saved_file":"uploads\\\\2026-09-23T07-57-34-593Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 14:57:34'),
(34, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGOUT', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:58:02'),
(35, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGIN', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:58:03'),
(36, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (234 baris) ke tabel "horti_produksi_kabupaten" [mode: append].', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"append","rows_inserted":234,"saved_file":"uploads\\\\2026-09-23T08-02-03-748Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 15:02:04'),
(37, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (234 baris) ke tabel "horti_produksi_kabupaten" [mode: replace].', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"replace","rows_inserted":234,"saved_file":"uploads\\\\2026-09-23T08-04-00-688Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 15:04:01'),
(38, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (80 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":80,"saved_file":"uploads\\\\2026-09-23T08-17-28-490Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 15:17:28'),
(39, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (8 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":8,"saved_file":"uploads\\\\2026-09-23T08-17-28-797Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 15:17:28'),
(40, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (9 baris) ke tabel "horti_produksi_kabupaten" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"append","rows_inserted":9,"saved_file":"uploads\\\\2026-09-23T08-17-28-839Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 15:17:28'),
(41, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_hias', 'Ekspor data tabel ikan_hias (80 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_hias","rows_exported":80}', '2026-09-23 16:19:07'),
(42, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_hias', 'Ekspor data tabel ikan_hias (80 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_hias","rows_exported":80}', '2026-09-23 16:19:54'),
(43, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ternak_populasi', 'Ekspor data tabel ternak_populasi (1716 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ternak_populasi","rows_exported":1716}', '2026-09-23 16:20:39'),
(44, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ternak_daging', 'Ekspor data tabel ternak_daging (859 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ternak_daging","rows_exported":859}', '2026-09-23 16:20:39'),
(45, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ternak_telur', 'Ekspor data tabel ternak_telur (240 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ternak_telur","rows_exported":240}', '2026-09-23 16:20:39'),
(46, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ternak_susu_kulit', 'Ekspor data tabel ternak_susu_kulit (240 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ternak_susu_kulit","rows_exported":240}', '2026-09-23 16:20:39'),
(47, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ternak_flow', 'Ekspor data tabel ternak_flow (1058 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ternak_flow","rows_exported":1058}', '2026-09-23 16:20:39'),
(48, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_pemeliharaan', 'Ekspor data tabel ikan_pemeliharaan (185 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_pemeliharaan","rows_exported":185}', '2026-09-23 16:20:39'),
(49, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_tangkap', 'Ekspor data tabel ikan_tangkap (462 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_tangkap","rows_exported":462}', '2026-09-23 16:20:39'),
(50, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_budidaya', 'Ekspor data tabel ikan_budidaya (324 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_budidaya","rows_exported":324}', '2026-09-23 16:20:39'),
(51, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_hias', 'Ekspor data tabel ikan_hias (80 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_hias","rows_exported":80}', '2026-09-23 16:20:39'),
(52, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_benih', 'Ekspor data tabel ikan_benih (278 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_benih","rows_exported":278}', '2026-09-23 16:20:39'),
(53, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ternak_pemotongan', 'Ekspor data tabel ternak_pemotongan (572 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ternak_pemotongan","rows_exported":572}', '2026-09-23 16:20:39'),
(54, NULL, 'admin', NULL, 'guest', 'LOGIN_FAILED', 'auth', 'Percobaan masuk gagal untuk nama pengguna: "admin". Kata sandi tidak sesuai.', '::1', NULL, 'failed', NULL, '2026-09-23 16:23:55'),
(55, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGIN', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) berhasil masuk ke sistem administrasi.', '::1', NULL, 'success', NULL, '2026-09-23 16:24:25'),
(56, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'unknown', 'Gagal memproses unggahan berkas "uploaded_data.csv": CSV must contain a header row and at least one data row', '::1', NULL, 'failed', '{"error":"CSV must contain a header row and at least one data row","filename":"uploaded_data.csv"}', '2026-09-23 16:24:25'),
(57, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'unknown', 'Gagal memproses unggahan berkas "uploaded_data.csv": CSV must contain a header row and at least one data row', '::1', NULL, 'failed', '{"error":"CSV must contain a header row and at least one data row","filename":"uploaded_data.csv"}', '2026-09-23 16:24:25'),
(58, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGIN', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) berhasil masuk ke sistem administrasi.', '::1', NULL, 'success', NULL, '2026-09-23 16:26:41'),
(59, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'ternak_populasi', 'Unggah berkas "01_Ternak_Besar_Kecamatan_2025.csv" (8 baris) ke tabel "ternak_populasi" [mode: append].', '::1', NULL, 'success', '{"filename":"01_Ternak_Besar_Kecamatan_2025.csv","table":"ternak_populasi","mode":"append","rows_inserted":8,"saved_file":"uploads\\\\2026-09-23T09-26-41-160Z_01_Ternak_Besar_Kecamatan_2025.csv"}', '2026-09-23 16:26:41'),
(60, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'ikan_budidaya', 'Unggah berkas "Produksi dan Nilai Produksi Perikanan Budidaya Menurut Kecamatan dan Jenis Budidaya 2025.csv" (3 baris) ke tabel "ikan_budidaya" [mode: append].', '::1', NULL, 'success', '{"filename":"Produksi dan Nilai Produksi Perikanan Budidaya Menurut Kecamatan dan Jenis Budidaya 2025.csv","table":"ikan_budidaya","mode":"append","rows_inserted":3,"saved_file":"uploads\\\\2026-09-23T09-26-41-431Z_Produksi_dan_Nilai_Produksi_Perikanan_Budidaya_Menurut_Kecamatan_dan_Jenis_Budidaya_2025.csv"}', '2026-09-23 16:26:41'),
(61, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_hias', 'Ekspor data tabel ikan_hias (80 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_hias","rows_exported":80}', '2026-09-23 16:29:14');

-- Tabel: log_aktivitas
CREATE OR REPLACE VIEW `log_aktivitas` AS select `activity_logs`.`id` AS `id`,`activity_logs`.`user_id` AS `user_id`,`activity_logs`.`username` AS `username`,`activity_logs`.`nama_lengkap` AS `nama_lengkap`,`activity_logs`.`role` AS `role`,`activity_logs`.`action` AS `action`,`activity_logs`.`entity` AS `entity`,`activity_logs`.`description` AS `description`,`activity_logs`.`ip_address` AS `ip_address`,`activity_logs`.`user_agent` AS `user_agent`,`activity_logs`.`status` AS `status`,`activity_logs`.`metadata` AS `metadata`,`activity_logs`.`created_at` AS `created_at` from `activity_logs`;
INSERT IGNORE INTO `log_aktivitas` (`id`, `user_id`, `username`, `nama_lengkap`, `role`, `action`, `entity`, `description`, `ip_address`, `user_agent`, `status`, `metadata`, `created_at`) VALUES
(1, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'SYSTEM_INIT', 'database', 'Inisialisasi sistem database MariaDB pertasis dan impor 42 tabel utama.', '127.0.0.1', NULL, 'success', '{"tables_imported":42,"source":"pertasis.sql"}', '2026-09-23 12:43:41'),
(2, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'TABLE_CREATE', 'ikan_hias', 'Pembuatan tabel ikan_hias dan populasi 80 data varietas (Koi, Mas Koki, Cupang, Komet) 20 kecamatan.', '127.0.0.1', NULL, 'success', '{"rows":80,"total_volume":2575000,"total_nilai":54175000000}', '2026-09-23 12:43:41'),
(3, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'TABLE_CREATE', 'komoditas_unggulan', 'Pembuatan tabel komoditas_unggulan dan kalkulasi sentra produksi per bidang.', '127.0.0.1', NULL, 'success', '{"rows":59,"sectors":5}', '2026-09-23 12:43:41'),
(4, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'RBAC_SETUP', 'auth', 'Konfigurasi Role-Based Access Control (RBAC): 8 peran dan 7 akun administrator dinas.', '127.0.0.1', NULL, 'success', '{"roles_count":8,"users_count":7}', '2026-09-23 12:43:41'),
(5, NULL, 'guest', 'Pengunjung', 'guest', 'VIEW_PAGE', '/admin', 'Pengunjung mengakses URL /admin — sistem mengaktifkan Guest Gate penguncian akses.', '127.0.0.1', NULL, 'warning', '{"gate_triggered":true,"access_denied":true}', '2026-09-23 12:43:41'),
(6, 5, 'admin_peternakan', 'Admin Bidang Peternakan & Keswan', 'admin_peternakan', 'LOGIN', 'auth', 'Pengguna Admin Bidang Peternakan & Keswan (Admin Peternakan & Keswan) berhasil masuk ke sistem administrasi.', '127.0.0.1', NULL, 'success', NULL, '2026-09-23 12:49:30'),
(7, NULL, 'intruder', NULL, 'guest', 'LOGIN_FAILED', 'auth', 'Percobaan masuk gagal untuk nama pengguna: "intruder". Kata sandi tidak sesuai.', '127.0.0.1', NULL, 'failed', NULL, '2026-09-23 12:49:30'),
(8, 5, 'admin_peternakan', 'Admin Bidang Peternakan & Keswan', 'admin_peternakan', 'VIEW_PAGE', '/livestock', 'Pengguna membuka halaman Dasbor Analitik Peternakan & Keswan.', '127.0.0.1', NULL, 'success', NULL, '2026-09-23 12:49:30'),
(9, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_hias', 'Ekspor data tabel ikan_hias (80 baris) ke format berkas CSV.', '127.0.0.1', NULL, 'success', '{"table":"ikan_hias","rows_exported":80}', '2026-09-23 12:49:30'),
(10, 2, 'admin_pangan', 'Admin Bidang Tanaman Pangan', 'admin_tanaman_pangan', 'LOGOUT', 'auth', 'Pengguna Admin Bidang Tanaman Pangan (Admin Tanaman Pangan) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 12:50:02'),
(11, 2, 'admin_pangan', 'Admin Bidang Tanaman Pangan', 'admin_tanaman_pangan', 'LOGIN', 'auth', 'Pengguna Admin Bidang Tanaman Pangan (Admin Tanaman Pangan) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 12:50:05'),
(12, 2, 'admin_pangan', 'Admin Bidang Tanaman Pangan', 'admin_tanaman_pangan', 'LOGOUT', 'auth', 'Pengguna Admin Bidang Tanaman Pangan (Admin Tanaman Pangan) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 12:55:31'),
(13, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGIN', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 12:55:33'),
(14, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGOUT', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:14:53'),
(15, 2, 'admin_pangan', 'Admin Bidang Tanaman Pangan', 'admin_tanaman_pangan', 'LOGIN', 'auth', 'Pengguna Admin Bidang Tanaman Pangan (Admin Tanaman Pangan) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:14:56'),
(16, 2, 'admin_pangan', 'Admin Bidang Tanaman Pangan', 'admin_tanaman_pangan', 'LOGOUT', 'auth', 'Pengguna Admin Bidang Tanaman Pangan (Admin Tanaman Pangan) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:15:32'),
(17, 3, 'admin_horti', 'Admin Bidang Hortikultura', 'admin_hortikultura', 'LOGIN', 'auth', 'Pengguna Admin Bidang Hortikultura (Admin Hortikultura) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:15:33'),
(18, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (80 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":80,"saved_file":"uploads\\\\2026-09-23T07-39-55-621Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:39:56'),
(19, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (8 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":8,"saved_file":"uploads\\\\2026-09-23T07-39-56-226Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:39:56'),
(20, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (9 baris) ke tabel "horti_produksi_kabupaten" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"append","rows_inserted":9,"saved_file":"uploads\\\\2026-09-23T07-39-56-310Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 14:39:56'),
(21, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (80 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":80,"saved_file":"uploads\\\\2026-09-23T07-44-48-815Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:44:49'),
(22, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (8 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":8,"saved_file":"uploads\\\\2026-09-23T07-44-49-138Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:44:49'),
(23, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (9 baris) ke tabel "horti_produksi_kabupaten" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"append","rows_inserted":9,"saved_file":"uploads\\\\2026-09-23T07-44-49-208Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 14:44:49'),
(24, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (80 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":80,"saved_file":"uploads\\\\2026-09-23T07-45-58-456Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:45:58'),
(25, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (8 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":8,"saved_file":"uploads\\\\2026-09-23T07-45-58-774Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:45:58'),
(26, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (9 baris) ke tabel "horti_produksi_kabupaten" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"append","rows_inserted":9,"saved_file":"uploads\\\\2026-09-23T07-45-58-820Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 14:45:58'),
(27, 3, 'admin_horti', 'Admin Bidang Hortikultura', 'admin_hortikultura', 'LOGOUT', 'auth', 'Pengguna Admin Bidang Hortikultura (Admin Hortikultura) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:48:03'),
(28, 3, 'admin_horti', 'Admin Bidang Hortikultura', 'admin_hortikultura', 'LOGIN', 'auth', 'Pengguna Admin Bidang Hortikultura (Admin Hortikultura) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:48:12'),
(29, 3, 'admin_horti', 'Admin Bidang Hortikultura', 'admin_hortikultura', 'LOGOUT', 'auth', 'Pengguna Admin Bidang Hortikultura (Admin Hortikultura) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:48:55'),
(30, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGIN', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:48:57'),
(31, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (80 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":80,"saved_file":"uploads\\\\2026-09-23T07-57-34-013Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:57:34'),
(32, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (8 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":8,"saved_file":"uploads\\\\2026-09-23T07-57-34-447Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 14:57:34'),
(33, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (9 baris) ke tabel "horti_produksi_kabupaten" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"append","rows_inserted":9,"saved_file":"uploads\\\\2026-09-23T07-57-34-593Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 14:57:34'),
(34, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGOUT', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) keluar dari sistem.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:58:02'),
(35, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGIN', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) berhasil masuk ke sistem administrasi.', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', NULL, '2026-09-23 14:58:03'),
(36, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (234 baris) ke tabel "horti_produksi_kabupaten" [mode: append].', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"append","rows_inserted":234,"saved_file":"uploads\\\\2026-09-23T08-02-03-748Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 15:02:04'),
(37, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (234 baris) ke tabel "horti_produksi_kabupaten" [mode: replace].', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"replace","rows_inserted":234,"saved_file":"uploads\\\\2026-09-23T08-04-00-688Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 15:04:01'),
(38, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (80 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":80,"saved_file":"uploads\\\\2026-09-23T08-17-28-490Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 15:17:28'),
(39, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi', 'Unggah berkas "produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv" (8 baris) ke tabel "horti_produksi" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv","table":"horti_produksi","mode":"append","rows_inserted":8,"saved_file":"uploads\\\\2026-09-23T08-17-28-797Z_produksi-tanaman-sayuran-menurut-kecamatan-dan-jenis-tanaman-2018-2024.csv"}', '2026-09-23 15:17:28'),
(40, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'horti_produksi_kabupaten', 'Unggah berkas "produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv" (9 baris) ke tabel "horti_produksi_kabupaten" [mode: append].', '::1', NULL, 'success', '{"filename":"produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv","table":"horti_produksi_kabupaten","mode":"append","rows_inserted":9,"saved_file":"uploads\\\\2026-09-23T08-17-28-839Z_produksi-tanaman-sayuran-dan-buahbuahan-semusim-2016-2024.csv"}', '2026-09-23 15:17:28'),
(41, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_hias', 'Ekspor data tabel ikan_hias (80 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_hias","rows_exported":80}', '2026-09-23 16:19:07'),
(42, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_hias', 'Ekspor data tabel ikan_hias (80 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_hias","rows_exported":80}', '2026-09-23 16:19:54'),
(43, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ternak_populasi', 'Ekspor data tabel ternak_populasi (1716 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ternak_populasi","rows_exported":1716}', '2026-09-23 16:20:39'),
(44, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ternak_daging', 'Ekspor data tabel ternak_daging (859 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ternak_daging","rows_exported":859}', '2026-09-23 16:20:39'),
(45, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ternak_telur', 'Ekspor data tabel ternak_telur (240 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ternak_telur","rows_exported":240}', '2026-09-23 16:20:39'),
(46, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ternak_susu_kulit', 'Ekspor data tabel ternak_susu_kulit (240 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ternak_susu_kulit","rows_exported":240}', '2026-09-23 16:20:39'),
(47, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ternak_flow', 'Ekspor data tabel ternak_flow (1058 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ternak_flow","rows_exported":1058}', '2026-09-23 16:20:39'),
(48, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_pemeliharaan', 'Ekspor data tabel ikan_pemeliharaan (185 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_pemeliharaan","rows_exported":185}', '2026-09-23 16:20:39'),
(49, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_tangkap', 'Ekspor data tabel ikan_tangkap (462 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_tangkap","rows_exported":462}', '2026-09-23 16:20:39'),
(50, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_budidaya', 'Ekspor data tabel ikan_budidaya (324 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_budidaya","rows_exported":324}', '2026-09-23 16:20:39'),
(51, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_hias', 'Ekspor data tabel ikan_hias (80 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_hias","rows_exported":80}', '2026-09-23 16:20:39'),
(52, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_benih', 'Ekspor data tabel ikan_benih (278 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_benih","rows_exported":278}', '2026-09-23 16:20:39'),
(53, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ternak_pemotongan', 'Ekspor data tabel ternak_pemotongan (572 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ternak_pemotongan","rows_exported":572}', '2026-09-23 16:20:39'),
(54, NULL, 'admin', NULL, 'guest', 'LOGIN_FAILED', 'auth', 'Percobaan masuk gagal untuk nama pengguna: "admin". Kata sandi tidak sesuai.', '::1', NULL, 'failed', NULL, '2026-09-23 16:23:55'),
(55, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGIN', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) berhasil masuk ke sistem administrasi.', '::1', NULL, 'success', NULL, '2026-09-23 16:24:25'),
(56, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'unknown', 'Gagal memproses unggahan berkas "uploaded_data.csv": CSV must contain a header row and at least one data row', '::1', NULL, 'failed', '{"error":"CSV must contain a header row and at least one data row","filename":"uploaded_data.csv"}', '2026-09-23 16:24:25'),
(57, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'unknown', 'Gagal memproses unggahan berkas "uploaded_data.csv": CSV must contain a header row and at least one data row', '::1', NULL, 'failed', '{"error":"CSV must contain a header row and at least one data row","filename":"uploaded_data.csv"}', '2026-09-23 16:24:25'),
(58, 1, 'admin', 'Super Admin Dinas Pertanian', 'super_admin', 'LOGIN', 'auth', 'Pengguna Super Admin Dinas Pertanian (Super Admin Dinas) berhasil masuk ke sistem administrasi.', '::1', NULL, 'success', NULL, '2026-09-23 16:26:41'),
(59, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'ternak_populasi', 'Unggah berkas "01_Ternak_Besar_Kecamatan_2025.csv" (8 baris) ke tabel "ternak_populasi" [mode: append].', '::1', NULL, 'success', '{"filename":"01_Ternak_Besar_Kecamatan_2025.csv","table":"ternak_populasi","mode":"append","rows_inserted":8,"saved_file":"uploads\\\\2026-09-23T09-26-41-160Z_01_Ternak_Besar_Kecamatan_2025.csv"}', '2026-09-23 16:26:41'),
(60, NULL, 'guest', NULL, 'guest', 'UPLOAD_CSV', 'ikan_budidaya', 'Unggah berkas "Produksi dan Nilai Produksi Perikanan Budidaya Menurut Kecamatan dan Jenis Budidaya 2025.csv" (3 baris) ke tabel "ikan_budidaya" [mode: append].', '::1', NULL, 'success', '{"filename":"Produksi dan Nilai Produksi Perikanan Budidaya Menurut Kecamatan dan Jenis Budidaya 2025.csv","table":"ikan_budidaya","mode":"append","rows_inserted":3,"saved_file":"uploads\\\\2026-09-23T09-26-41-431Z_Produksi_dan_Nilai_Produksi_Perikanan_Budidaya_Menurut_Kecamatan_dan_Jenis_Budidaya_2025.csv"}', '2026-09-23 16:26:41'),
(61, NULL, 'guest', NULL, 'guest', 'EXPORT_CSV', 'ikan_hias', 'Ekspor data tabel ikan_hias (80 baris) ke format berkas CSV.', '::1', NULL, 'success', '{"table":"ikan_hias","rows_exported":80}', '2026-09-23 16:29:14');

-- Tabel: komoditas
CREATE TABLE IF NOT EXISTS `komoditas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sektor` varchar(30) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `kategori` varchar(50) NOT NULL,
  `satuan` varchar(20) DEFAULT 'Ton',
  `is_unggulan` tinyint(1) DEFAULT 0,
  `urutan` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sektor` (`sektor`),
  KEY `idx_kategori` (`kategori`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT IGNORE INTO `komoditas` (`id`, `sektor`, `nama`, `kategori`, `satuan`, `is_unggulan`, `urutan`, `created_at`) VALUES
(1, 'pangan', 'Padi Sawah', 'Padi', 'Ton', 1, 1, '2026-09-23 14:03:31'),
(2, 'pangan', 'Padi Ladang', 'Padi', 'Ton', 1, 2, '2026-09-23 14:03:31'),
(3, 'pangan', 'Jagung Hibrida', 'Palawija', 'Ton', 1, 3, '2026-09-23 14:03:31'),
(4, 'pangan', 'Ubi Kayu', 'Palawija', 'Ton', 1, 4, '2026-09-23 14:03:31'),
(5, 'pangan', 'Ubi Jalar', 'Palawija', 'Ton', 1, 5, '2026-09-23 14:03:31'),
(6, 'pangan', 'Kacang Tanah', 'Palawija', 'Ton', 1, 6, '2026-09-23 14:03:31'),
(7, 'pangan', 'Kedelai', 'Palawija', 'Ton', 1, 7, '2026-09-23 14:03:31'),
(8, 'pangan', 'Kacang Hijau', 'Palawija', 'Ton', 1, 8, '2026-09-23 14:03:31'),
(9, 'pangan', 'Porang', 'Palawija', 'Ton', 1, 9, '2026-09-23 14:03:31'),
(10, 'pangan', 'Talas', 'Palawija', 'Ton', 1, 10, '2026-09-23 14:03:31'),
(11, 'hortikultura', 'Kentang', 'Sayuran', 'Ton', 1, 11, '2026-09-23 14:03:31'),
(12, 'hortikultura', 'Kubis', 'Sayuran', 'Ton', 1, 12, '2026-09-23 14:03:31'),
(13, 'hortikultura', 'Wortel', 'Sayuran', 'Ton', 1, 13, '2026-09-23 14:03:31'),
(14, 'hortikultura', 'Cabai Rawit', 'Sayuran', 'Ton', 1, 14, '2026-09-23 14:03:31'),
(15, 'hortikultura', 'Cabai Besar', 'Sayuran', 'Ton', 1, 15, '2026-09-23 14:03:31'),
(16, 'hortikultura', 'Tomat', 'Sayuran', 'Ton', 1, 16, '2026-09-23 14:03:31'),
(17, 'hortikultura', 'Bawang Merah', 'Sayuran', 'Ton', 0, 17, '2026-09-23 14:03:31'),
(18, 'hortikultura', 'Bawang Putih', 'Sayuran', 'Ton', 0, 18, '2026-09-23 14:03:31'),
(19, 'hortikultura', 'Petsai / Sawi', 'Sayuran', 'Ton', 0, 19, '2026-09-23 14:03:31'),
(20, 'hortikultura', 'Bawang Daun', 'Sayuran', 'Ton', 0, 20, '2026-09-23 14:03:31'),
(21, 'hortikultura', 'Buncis', 'Sayuran', 'Ton', 0, 21, '2026-09-23 14:03:31'),
(22, 'hortikultura', 'Labu Siam', 'Sayuran', 'Ton', 0, 22, '2026-09-23 14:03:31'),
(23, 'hortikultura', 'Salak', 'Buah', 'Ton', 1, 23, '2026-09-23 14:03:31'),
(24, 'hortikultura', 'Pisang', 'Buah', 'Ton', 1, 24, '2026-09-23 14:03:31'),
(25, 'hortikultura', 'Durian', 'Buah', 'Ton', 1, 25, '2026-09-23 14:03:31'),
(26, 'hortikultura', 'Mangga', 'Buah', 'Ton', 1, 26, '2026-09-23 14:03:31'),
(27, 'hortikultura', 'Pepaya', 'Buah', 'Ton', 0, 27, '2026-09-23 14:03:31'),
(28, 'hortikultura', 'Jeruk Siam', 'Buah', 'Ton', 0, 28, '2026-09-23 14:03:31'),
(29, 'hortikultura', 'Jeruk Besar', 'Buah', 'Ton', 0, 29, '2026-09-23 14:03:31'),
(30, 'hortikultura', 'Bayam', 'Sayuran', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(31, 'hortikultura', 'Kangkung', 'Sayuran', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(32, 'hortikultura', 'Terung', 'Sayuran', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(33, 'hortikultura', 'Kembang Kol', 'Sayuran', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(34, 'hortikultura', 'Jamur', 'Sayuran', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(35, 'hortikultura', 'Kacang Merah', 'Sayuran', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(36, 'hortikultura', 'Kacang Panjang', 'Sayuran', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(37, 'hortikultura', 'Ketimun', 'Sayuran', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(38, 'hortikultura', 'Lobak', 'Sayuran', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(39, 'hortikultura', 'Blewah', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(40, 'hortikultura', 'Melon', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(41, 'hortikultura', 'Semangka', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(42, 'hortikultura', 'Alpukat', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(43, 'hortikultura', 'Belimbing', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(44, 'hortikultura', 'Duku', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(45, 'hortikultura', 'Jambu Biji', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(46, 'hortikultura', 'Nangka', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(47, 'hortikultura', 'Rambutan', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(48, 'hortikultura', 'Sirsak', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(49, 'hortikultura', 'Jahe', 'Biofarmaka', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(50, 'hortikultura', 'Kunyit', 'Biofarmaka', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(51, 'hortikultura', 'Kencur', 'Biofarmaka', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(52, 'hortikultura', 'Laos', 'Biofarmaka', 'Ton', 0, 99, '2026-09-23 14:33:07'),
(53, 'hortikultura', 'Krisan', 'Tanaman Hias', 'Tangkai', 0, 99, '2026-09-23 14:33:07'),
(54, 'hortikultura', 'Mawar', 'Tanaman Hias', 'Tangkai', 0, 99, '2026-09-23 14:33:07'),
(55, 'hortikultura', 'Agloenema', 'Tanaman Hias', 'Pohon', 0, 99, '2026-09-23 14:33:07'),
(56, 'hortikultura', 'Soka', 'Tanaman Hias', 'Pohon', 0, 99, '2026-09-23 14:33:07'),
(57, 'hortikultura', 'Jambu Air', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(58, 'hortikultura', 'Manggis', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(59, 'hortikultura', 'Nenas', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(60, 'hortikultura', 'Sawo', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(61, 'hortikultura', 'Markisa', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(62, 'hortikultura', 'Sukun', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(63, 'hortikultura', 'Melinjo', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(64, 'hortikultura', 'Petai', 'Buah', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(65, 'hortikultura', 'Anthurium Daun', 'Tanaman Hias', 'Pohon', 0, 99, '2026-09-23 14:33:55'),
(66, 'hortikultura', 'Caladium', 'Tanaman Hias', 'Pohon', 0, 99, '2026-09-23 14:33:55'),
(67, 'hortikultura', 'Pakis', 'Tanaman Hias', 'Pohon', 0, 99, '2026-09-23 14:33:55'),
(68, 'hortikultura', 'Sansievera Pedang-Pedangan', 'Tanaman Hias', 'Pohon', 0, 99, '2026-09-23 14:33:55'),
(69, 'hortikultura', 'Melati', 'Tanaman Hias', 'Tangkai', 0, 99, '2026-09-23 14:33:55'),
(70, 'hortikultura', 'Palem', 'Tanaman Hias', 'Pohon', 0, 99, '2026-09-23 14:33:55'),
(71, 'hortikultura', 'Pisang-pisangan', 'Tanaman Hias', 'Pohon', 0, 99, '2026-09-23 14:33:55'),
(72, 'hortikultura', 'Sedap Malam', 'Tanaman Hias', 'Tangkai', 0, 99, '2026-09-23 14:33:55'),
(73, 'hortikultura', 'Dringo', 'Biofarmaka', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(74, 'hortikultura', 'Kapulaga', 'Biofarmaka', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(75, 'hortikultura', 'Lempuyang', 'Biofarmaka', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(76, 'hortikultura', 'Lidah Buaya', 'Biofarmaka', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(77, 'hortikultura', 'Mengkudu', 'Biofarmaka', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(78, 'hortikultura', 'Temuireng', 'Biofarmaka', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(79, 'hortikultura', 'Temukunci', 'Biofarmaka', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(80, 'hortikultura', 'Temulawak', 'Biofarmaka', 'Ton', 0, 99, '2026-09-23 14:33:55'),
(81, 'hortikultura', 'Sambiloto', 'Biofarmaka', 'Ton', 0, 99, '2026-09-23 14:33:55');

-- Tabel: varietas
CREATE TABLE IF NOT EXISTS `varietas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `komoditas_id` int(11) NOT NULL,
  `nama` varchar(150) NOT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `komoditas_id` (`komoditas_id`),
  CONSTRAINT `varietas_ibfk_1` FOREIGN KEY (`komoditas_id`) REFERENCES `komoditas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT IGNORE INTO `varietas` (`id`, `komoditas_id`, `nama`, `keterangan`, `created_at`) VALUES
(1, 1, 'Inpari 32 HDB', 'Tahan hawar daun bakteri, tekstur pulen disukai petani sawah irigasi Serayu', '2026-09-23 14:03:31'),
(2, 1, 'Ciherang', 'Varietas populer nasional, produktivitas tinggi dan umur sedang', '2026-09-23 14:03:31'),
(3, 1, 'IR64', 'Beras pulen standar konsumsi masyarakat dan penggilingan padi lokal', '2026-09-23 14:03:31'),
(4, 1, 'Mekongga', 'Tahan rebah, adaptif di wilayah sawah dataran rendah hingga sedang', '2026-09-23 14:03:31'),
(5, 2, 'Situ Bagendit', 'Cocok lahan kering dan tadah hujan lereng selatan', '2026-09-23 14:03:31'),
(6, 2, 'Dodokan', 'Umur genjah untuk lahan gogo tegalan', '2026-09-23 14:03:31'),
(7, 3, 'Bisi 18', 'Kadar pati tinggi, bahan baku utama pakan unggas lokal', '2026-09-23 14:03:31'),
(8, 3, 'NK 212', 'Tongkol besar dan padat, tahan cuaca kering', '2026-09-23 14:03:31'),
(9, 3, 'Pioneer P35', 'Potensi panen pipilan kering tinggi', '2026-09-23 14:03:31'),
(10, 4, 'Singkong Gajah', 'Umbi besar kadar pati tinggi untuk industri tapioka dan mokaf', '2026-09-23 14:03:31'),
(11, 4, 'Manihot Mangu', 'Rasa manis pulen untuk olahan pangan lokal', '2026-09-23 14:03:31'),
(12, 4, 'Malang 4', 'Toleran kekeringan dan lahan tegalan berbatu', '2026-09-23 14:03:31'),
(13, 5, 'Ubi Madu / Cilembu', 'Manis legit saat dipanggang, nilai jual tinggi', '2026-09-23 14:03:31'),
(14, 5, 'Ubi Ungu', 'Kaya antioksidan antosianin, diminati industri olahan', '2026-09-23 14:03:31'),
(15, 5, 'Ubi Kuning Lokal', 'Konsumsi pangan alternatif harian keluarga', '2026-09-23 14:03:31'),
(16, 6, 'Kacang Tuban', 'Biji padat berisi 2-3 butir, rasa gurih renyah', '2026-09-23 14:03:31'),
(17, 6, 'Kancil', 'Umur panen genjah, fiksasi nitrogen alami penyubur sawah', '2026-09-23 14:03:31'),
(18, 7, 'Anjasmoro', 'Biji kuning besar, bahan baku utama perajin tahu tempe KOPTI', '2026-09-23 14:03:31'),
(19, 7, 'Grobogan', 'Polong lebat umur panen cepat', '2026-09-23 14:03:31'),
(20, 8, 'Vima 1', 'Kematangan polong serempak, mudah dipanen', '2026-09-23 14:03:31'),
(21, 8, 'Murai', 'Biji mengkilap kualitas konsumsi tinggi', '2026-09-23 14:03:31'),
(22, 9, 'Porang Madiun', 'Kadar glukomanan tinggi di atas 65 persen, komoditas ekspor', '2026-09-23 14:03:31'),
(23, 9, 'Lokal Serayu', 'Adaptif di bawah naungan tegakan pohon', '2026-09-23 14:03:31'),
(24, 10, 'Talas Satoimo (Jepang)', 'Umbi kecil rendah indeks glikemik, diminati pasar ekspor Jepang', '2026-09-23 14:03:31'),
(25, 10, 'Talas Pratama', 'Umbi besar pulen bahan baku keripik gurih', '2026-09-23 14:03:31'),
(26, 10, 'Talas Sutra', 'Tekstur lembut tidak gatal', '2026-09-23 14:03:31'),
(27, 11, 'Granola L', 'Sentra dataran tinggi Dieng Batur, kadar air rendah pulen', '2026-09-23 14:03:31'),
(28, 11, 'Atlantik', 'Kadar pati tinggi khusus bahan keripik kentang industri', '2026-09-23 14:03:31'),
(29, 12, 'Green Nova', 'Krop padat renyah, daya tahan simpan pasca-panen tinggi', '2026-09-23 14:03:31'),
(30, 12, 'Sehati', 'Tahan cuaca dingin dan hembusan angin pegunungan', '2026-09-23 14:03:31'),
(31, 12, 'KK Cross', 'Adaptif dataran tinggi hingga menengah', '2026-09-23 14:03:31'),
(32, 13, 'Kuroda', 'Warna oranye pekat kaya beta-karoten, rasa manis alami', '2026-09-23 14:03:31'),
(33, 13, 'New Kuroda Dieng', 'Tanpa serat kasar, diminati pasar hotel dan restoran', '2026-09-23 14:03:31'),
(34, 14, 'Ori 212', 'Buah lebat tegak, pedas tajam dan tahan patek antraknosa', '2026-09-23 14:03:31'),
(35, 14, 'Asmoro', 'Daya simpan lama untuk distribusi antar kota', '2026-09-23 14:03:31'),
(36, 15, 'Pilar', 'Buah lurus padat merah menyala', '2026-09-23 14:03:31'),
(37, 15, 'Imola', 'Kulit tebal cocok pengiriman jarak jauh', '2026-09-23 14:03:31'),
(38, 15, 'Tanjung 2', 'Tahan layu bakteri dataran menengah', '2026-09-23 14:03:31'),
(39, 16, 'Servo', 'Tahan virus kuning gemini, buah padat tidak mudah pecah', '2026-09-23 14:03:31'),
(40, 16, 'Marta', 'Ukuran buah seragam untuk pasar segar', '2026-09-23 14:03:31'),
(41, 17, 'Bima Brebes', 'Aroma tajam menyengat, anakan banyak', '2026-09-23 14:03:31'),
(42, 17, 'Bauji', 'Toleran curah hujan tinggi', '2026-09-23 14:03:31'),
(43, 18, 'Tawangmangu Baru', 'Aroma kuat khas lokal dataran tinggi', '2026-09-23 14:03:31'),
(44, 18, 'Lumbu Hijau', 'Umbi kompak dengan siung padat', '2026-09-23 14:03:31'),
(45, 19, 'Eikun', 'Krop putih padat Dieng, renyah', '2026-09-23 14:03:31'),
(46, 19, 'Shinta', 'Masa panen cepat perputaran modal harian', '2026-09-23 14:03:31'),
(47, 20, 'Fragrant', 'Batang putih panjang dan beraroma wangi segar', '2026-09-23 14:03:31'),
(48, 21, 'Lebat 3', 'Polong lurus hijau muda tanpa serat', '2026-09-23 14:03:31'),
(49, 21, 'Balitsa', 'Tahan penyakit karat daun', '2026-09-23 14:03:31'),
(50, 22, 'Labu Hijau Manisa', 'Buah lonjong hijau mulus bebas duri', '2026-09-23 14:03:31'),
(51, 23, 'Salak Pondoh Super', 'Sentra Madukara dan Sigaluh, daging manis renyah tanpa sepet', '2026-09-23 14:03:31'),
(52, 23, 'Salak Gading', 'Kulit kuning gading aroma wangi khas', '2026-09-23 14:03:31'),
(53, 23, 'Salak Lumut', 'Daging buah tebal dan berair manis', '2026-09-23 14:03:31'),
(54, 24, 'Raja Bulu', 'Aroma wangi kuat, manis legit untuk konsumsi meja', '2026-09-23 14:03:31'),
(55, 24, 'Ambon Kuning', 'Tekstur daging buah lembut dan manis', '2026-09-23 14:03:31'),
(56, 24, 'Cavendish', 'Kualitas buah standar supermarket modern', '2026-09-23 14:03:31'),
(57, 25, 'Durian Bawor', 'Daging buah oranye tebal biji kempes, manis beralkohol khas', '2026-09-23 14:03:31'),
(58, 25, 'Kromo Sigaluh', 'Plasma nutfah durian lokal legendaris Banjarnegara', '2026-09-23 14:03:31'),
(59, 25, 'Kamun', 'Tekstur mentega manis legit sedikit pahit', '2026-09-23 14:03:31'),
(60, 26, 'Arumanis 143', 'Daging berserat sangat halus, aroma harum manis', '2026-09-23 14:03:31'),
(61, 26, 'Gedong Gincu', 'Warna kulit oranye kemerahan menarik', '2026-09-23 14:03:31'),
(62, 27, 'California (Calina IPB)', 'Buah silindris manis daging merah padat', '2026-09-23 14:03:31'),
(63, 28, 'Siam Madu', 'Kadar air melimpah, rasa manis segar', '2026-09-23 14:03:31'),
(64, 29, 'Nambangan', 'Bulir merah muda tebal tidak getir', '2026-09-23 14:03:31');

-- Tabel: harga_produsen
CREATE TABLE IF NOT EXISTS `harga_produsen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sektor` varchar(50) NOT NULL,
  `komoditas` varchar(100) NOT NULL,
  `satuan` varchar(20) DEFAULT 'Kg',
  `harga_per_satuan` decimal(15,2) NOT NULL,
  `tahun` int(11) DEFAULT 2024,
  `sumber` varchar(100) DEFAULT 'Distankan Banjarnegara',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sektor_komoditas` (`sektor`,`komoditas`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT IGNORE INTO `harga_produsen` (`id`, `sektor`, `komoditas`, `satuan`, `harga_per_satuan`, `tahun`, `sumber`, `created_at`) VALUES
(1, 'pangan', 'Padi Sawah', 'Ton', '6800.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(2, 'pangan', 'Padi Ladang', 'Ton', '6500.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(3, 'pangan', 'Jagung', 'Ton', '5200.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(4, 'pangan', 'Ubi Kayu', 'Ton', '2200.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(5, 'pangan', 'Ubi Jalar', 'Ton', '3500.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(6, 'pangan', 'Kacang Tanah', 'Ton', '18000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(7, 'pangan', 'Kedelai', 'Ton', '12500.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(8, 'pangan', 'Kacang Hijau', 'Ton', '17000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(9, 'pangan', 'Porang', 'Ton', '8500.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(10, 'pangan', 'Talas', 'Ton', '4500.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(11, 'hortikultura', 'Kentang', 'Ton', '11000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(12, 'hortikultura', 'Kubis', 'Ton', '3500.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(13, 'hortikultura', 'Wortel', 'Ton', '6000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(14, 'hortikultura', 'Cabai Rawit', 'Ton', '32000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(15, 'hortikultura', 'Cabai Merah', 'Ton', '28000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(16, 'hortikultura', 'Bawang Merah', 'Ton', '25000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(17, 'hortikultura', 'Tomat', 'Ton', '5000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(18, 'hortikultura', 'Salak', 'Ton', '6000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(19, 'hortikultura', 'Pisang', 'Ton', '5000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(20, 'hortikultura', 'Durian', 'Ton', '25000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(21, 'hortikultura', 'Mangga', 'Ton', '10000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(22, 'perkebunan', 'Kelapa', 'Ton', '16000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(23, 'perkebunan', 'Kopi Arabika', 'Ton', '95000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(24, 'perkebunan', 'Kopi Robusta', 'Ton', '38000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(25, 'perkebunan', 'Teh', 'Ton', '4500.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(26, 'perkebunan', 'Kapulaga', 'Ton', '75000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(27, 'perkebunan', 'Cengkeh', 'Ton', '110000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(28, 'perkebunan', 'Tebu', 'Ton', '800.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(29, 'perkebunan', 'Tembakau', 'Ton', '45000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(30, 'perkebunan', 'Kelapa Deres (Gula Semut)', 'Ton', '18000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(31, 'perkebunan', 'Porang', 'Ton', '8500.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(32, 'perkebunan', 'Talas', 'Ton', '4500.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(33, 'peternakan', 'Sapi Potong', 'Ekor', '22000000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(34, 'peternakan', 'Sapi Perah', 'Ekor', '25000000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(35, 'peternakan', 'Kambing', 'Ekor', '2800000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(36, 'peternakan', 'Domba Batur', 'Ekor', '3500000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(37, 'peternakan', 'Kelinci', 'Ekor', '150000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(38, 'peternakan', 'Ayam Broiler', 'Ekor', '38000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(39, 'peternakan', 'Ayam Kampung', 'Ekor', '65000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(40, 'peternakan', 'Ayam Layer', 'Ekor', '85000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(41, 'peternakan', 'Itik', 'Ekor', '55000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(42, 'peternakan', 'Burung Puyuh', 'Ekor', '15000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(43, 'peternakan', 'Daging Sapi', 'Kg', '130000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(44, 'peternakan', 'Daging Kambing & Domba', 'Kg', '140000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(45, 'peternakan', 'Daging Ayam Broiler', 'Kg', '38000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(46, 'peternakan', 'Telur Ayam Layer', 'Kg', '26000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(47, 'peternakan', 'Telur Ayam Kampung', 'Kg', '45000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(48, 'peternakan', 'Susu Sapi Segar', 'Liter', '9000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(49, 'peternakan', 'Kulit Sapi & Kambing', 'Lembar', '250000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(50, 'perikanan', 'Perikanan Budidaya', 'Ton', '28000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(51, 'perikanan', 'Perikanan Tangkap', 'Ton', '20000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(52, 'perikanan', 'Ikan Nila', 'Ton', '28000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(53, 'perikanan', 'Ikan Lele', 'Ton', '22000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(54, 'perikanan', 'Ikan Mas', 'Ton', '35000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(55, 'perikanan', 'Ikan Gurame', 'Ton', '45000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(56, 'perikanan', 'Ikan Koi', 'Ekor', '45000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(57, 'perikanan', 'Ikan Mas Koki', 'Ekor', '20000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(58, 'perikanan', 'Ikan Cupang', 'Ekor', '15000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25'),
(59, 'perikanan', 'Ikan Komet', 'Ekor', '10000.00', 2024, 'Distankan Matrix 2024', '2026-09-23 12:25:25');

-- Tabel: ikan_produksi_jenis
CREATE TABLE IF NOT EXISTS `ikan_produksi_jenis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kecamatan_id` tinyint(3) unsigned DEFAULT NULL,
  `nama_kecamatan` varchar(50) DEFAULT 'Kabupaten Banjarnegara',
  `tahun` smallint(5) unsigned NOT NULL,
  `jenis_ikan` varchar(50) NOT NULL,
  `produksi_kg` double NOT NULL DEFAULT 0,
  `luas_ha` double NOT NULL DEFAULT 0,
  `nilai_ekonomi_rp` double NOT NULL DEFAULT 0,
  `sumber` varchar(60) DEFAULT 'Data produksi 2020-2025.xlsx',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_tahun` (`tahun`),
  KEY `idx_jenis` (`jenis_ikan`),
  KEY `idx_kecamatan` (`kecamatan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT IGNORE INTO `ikan_produksi_jenis` (`id`, `kecamatan_id`, `nama_kecamatan`, `tahun`, `jenis_ikan`, `produksi_kg`, `luas_ha`, `nilai_ekonomi_rp`, `sumber`, `created_at`) VALUES
(55, NULL, 'Kabupaten Banjarnegara', 2020, 'Bawal', 4098443.086056237, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(56, NULL, 'Kabupaten Banjarnegara', 2021, 'Bawal', 4227329, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(57, NULL, 'Kabupaten Banjarnegara', 2022, 'Bawal', 3251798.395226568, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(58, NULL, 'Kabupaten Banjarnegara', 2023, 'Bawal', 2357225.9574515913, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(59, NULL, 'Kabupaten Banjarnegara', 2024, 'Bawal', 2318621.3826632397, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(60, NULL, 'Kabupaten Banjarnegara', 2025, 'Bawal', 3595272.266539438, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(61, NULL, 'Kabupaten Banjarnegara', 2020, 'Gurami', 7485197.936983912, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(62, NULL, 'Kabupaten Banjarnegara', 2021, 'Gurami', 6053502, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(63, NULL, 'Kabupaten Banjarnegara', 2022, 'Gurami', 6325428.3598573925, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(64, NULL, 'Kabupaten Banjarnegara', 2023, 'Gurami', 3128511.6547141983, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(65, NULL, 'Kabupaten Banjarnegara', 2024, 'Gurami', 2968207.621229046, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(66, NULL, 'Kabupaten Banjarnegara', 2025, 'Gurami', 1576587.9553588005, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(67, NULL, 'Kabupaten Banjarnegara', 2020, 'Lele', 12829038.654289179, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(68, NULL, 'Kabupaten Banjarnegara', 2021, 'Lele', 12713427, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(69, NULL, 'Kabupaten Banjarnegara', 2022, 'Lele', 12105520.146465514, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(70, NULL, 'Kabupaten Banjarnegara', 2023, 'Lele', 18813225.413414247, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(71, NULL, 'Kabupaten Banjarnegara', 2024, 'Lele', 17685092.84071154, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(72, NULL, 'Kabupaten Banjarnegara', 2025, 'Lele', 12962616.54881261, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(73, NULL, 'Kabupaten Banjarnegara', 2020, 'Ikan Mas', 523312.25240293285, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(74, NULL, 'Kabupaten Banjarnegara', 2021, 'Ikan Mas', 351716, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(75, NULL, 'Kabupaten Banjarnegara', 2022, 'Ikan Mas', 385941.20155148, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(76, NULL, 'Kabupaten Banjarnegara', 2023, 'Ikan Mas', 412186.3190216527, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(77, NULL, 'Kabupaten Banjarnegara', 2024, 'Ikan Mas', 546460.4265696822, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(78, NULL, 'Kabupaten Banjarnegara', 2025, 'Ikan Mas', 170259.06843044548, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(79, NULL, 'Kabupaten Banjarnegara', 2020, 'Mujair', 0, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(80, NULL, 'Kabupaten Banjarnegara', 2021, 'Mujair', 725950, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(81, NULL, 'Kabupaten Banjarnegara', 2022, 'Mujair', 625685.8569813877, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(82, NULL, 'Kabupaten Banjarnegara', 2023, 'Mujair', 440963.6024857104, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(83, NULL, 'Kabupaten Banjarnegara', 2024, 'Mujair', 596361.2908951743, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(84, NULL, 'Kabupaten Banjarnegara', 2025, 'Mujair', 1863306.3607835798, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(85, NULL, 'Kabupaten Banjarnegara', 2020, 'Nila', 7697884.131104248, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(86, NULL, 'Kabupaten Banjarnegara', 2021, 'Nila', 10645127, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(87, NULL, 'Kabupaten Banjarnegara', 2022, 'Nila', 14257674.67956318, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(88, NULL, 'Kabupaten Banjarnegara', 2023, 'Nila', 14268920.705968894, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(89, NULL, 'Kabupaten Banjarnegara', 2024, 'Nila', 14805379.267892482, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(90, NULL, 'Kabupaten Banjarnegara', 2025, 'Nila', 20250125.350019403, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(91, NULL, 'Kabupaten Banjarnegara', 2020, 'Nilem', 641148.889155624, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(92, NULL, 'Kabupaten Banjarnegara', 2021, 'Nilem', 1180216, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(93, NULL, 'Kabupaten Banjarnegara', 2022, 'Nilem', 1654161.0492099503, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(94, NULL, 'Kabupaten Banjarnegara', 2023, 'Nilem', 805376.8664159721, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(95, NULL, 'Kabupaten Banjarnegara', 2024, 'Nilem', 887466.8567509826, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(96, NULL, 'Kabupaten Banjarnegara', 2025, 'Nilem', 146599.4756224048, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(97, NULL, 'Kabupaten Banjarnegara', 2020, 'Patin', 826448.4684844732, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(98, NULL, 'Kabupaten Banjarnegara', 2021, 'Patin', 1117156, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(99, NULL, 'Kabupaten Banjarnegara', 2022, 'Patin', 1205240.7262939182, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(100, NULL, 'Kabupaten Banjarnegara', 2023, 'Patin', 413507.6845312953, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(101, NULL, 'Kabupaten Banjarnegara', 2024, 'Patin', 428873.98633782915, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(102, NULL, 'Kabupaten Banjarnegara', 2025, 'Patin', 262788.14516438777, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(103, NULL, 'Kabupaten Banjarnegara', 2020, 'Tambakan', 182338.34802351875, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(104, NULL, 'Kabupaten Banjarnegara', 2021, 'Tambakan', 273167, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(105, NULL, 'Kabupaten Banjarnegara', 2022, 'Tambakan', 518394.33211447834, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(106, NULL, 'Kabupaten Banjarnegara', 2023, 'Tambakan', 193499.7330380525, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(107, NULL, 'Kabupaten Banjarnegara', 2024, 'Tambakan', 178830.268838004, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(108, NULL, 'Kabupaten Banjarnegara', 2025, 'Tambakan', 23579.04724773369, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(109, NULL, 'Kabupaten Banjarnegara', 2020, 'Tawes', 362937.52049232845, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(110, NULL, 'Kabupaten Banjarnegara', 2021, 'Tawes', 673621, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(111, NULL, 'Kabupaten Banjarnegara', 2022, 'Tawes', 590094.3151241292, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(112, NULL, 'Kabupaten Banjarnegara', 2023, 'Tawes', 399000.8131810568, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(113, NULL, 'Kabupaten Banjarnegara', 2024, 'Tawes', 489279.1836487656, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24'),
(114, NULL, 'Kabupaten Banjarnegara', 2025, 'Tawes', 169673.28018561372, 0, 0, 'Data produksi 2020-2025.xlsx', '2026-10-05 11:49:24');

-- Tabel: ikan_hias
CREATE TABLE IF NOT EXISTS `ikan_hias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kecamatan_id` int(11) DEFAULT NULL,
  `nama_kecamatan` varchar(100) NOT NULL,
  `varietas` varchar(100) NOT NULL,
  `volume_ekor` int(11) DEFAULT 0,
  `luas_m2` decimal(10,2) DEFAULT 0.00,
  `nilai_ekonomi` decimal(18,2) DEFAULT 0.00,
  `tahun` int(11) DEFAULT 2024,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ikan_hias` (`nama_kecamatan`,`varietas`,`tahun`),
  KEY `idx_kecamatan` (`nama_kecamatan`),
  KEY `idx_varietas` (`varietas`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT IGNORE INTO `ikan_hias` (`id`, `kecamatan_id`, `nama_kecamatan`, `varietas`, `volume_ekor`, `luas_m2`, `nilai_ekonomi`, `tahun`, `created_at`) VALUES
(1, NULL, 'Banjarmangu', 'Ikan Koi', 35000, '0.00', '1575000000.00', 2024, '2026-09-23 12:25:25'),
(2, NULL, 'Banjarmangu', 'Ikan Mas Koki', 45000, '0.00', '900000000.00', 2024, '2026-09-23 12:25:25'),
(3, NULL, 'Banjarmangu', 'Ikan Cupang', 25000, '0.00', '375000000.00', 2024, '2026-09-23 12:25:25'),
(4, NULL, 'Banjarmangu', 'Ikan Komet', 60000, '0.00', '600000000.00', 2024, '2026-09-23 12:25:25'),
(5, NULL, 'Banjarnegara', 'Ikan Koi', 40000, '0.00', '1800000000.00', 2024, '2026-09-23 12:25:25'),
(6, NULL, 'Banjarnegara', 'Ikan Mas Koki', 50000, '0.00', '1000000000.00', 2024, '2026-09-23 12:25:25'),
(7, NULL, 'Banjarnegara', 'Ikan Cupang', 30000, '0.00', '450000000.00', 2024, '2026-09-23 12:25:25'),
(8, NULL, 'Banjarnegara', 'Ikan Komet', 70000, '0.00', '700000000.00', 2024, '2026-09-23 12:25:25'),
(9, NULL, 'Batur', 'Ikan Koi', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(10, NULL, 'Batur', 'Ikan Mas Koki', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(11, NULL, 'Batur', 'Ikan Cupang', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(12, NULL, 'Batur', 'Ikan Komet', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(13, NULL, 'Bawang', 'Ikan Koi', 25000, '0.00', '1125000000.00', 2024, '2026-09-23 12:25:25'),
(14, NULL, 'Bawang', 'Ikan Mas Koki', 30000, '0.00', '600000000.00', 2024, '2026-09-23 12:25:25'),
(15, NULL, 'Bawang', 'Ikan Cupang', 20000, '0.00', '300000000.00', 2024, '2026-09-23 12:25:25'),
(16, NULL, 'Bawang', 'Ikan Komet', 40000, '0.00', '400000000.00', 2024, '2026-09-23 12:25:25'),
(17, NULL, 'Kalibening', 'Ikan Koi', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(18, NULL, 'Kalibening', 'Ikan Mas Koki', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(19, NULL, 'Kalibening', 'Ikan Cupang', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(20, NULL, 'Kalibening', 'Ikan Komet', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(21, NULL, 'Karangkobar', 'Ikan Koi', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(22, NULL, 'Karangkobar', 'Ikan Mas Koki', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(23, NULL, 'Karangkobar', 'Ikan Cupang', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(24, NULL, 'Karangkobar', 'Ikan Komet', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(25, NULL, 'Madukara', 'Ikan Koi', 60000, '0.00', '2700000000.00', 2024, '2026-09-23 12:25:25'),
(26, NULL, 'Madukara', 'Ikan Mas Koki', 70000, '0.00', '1400000000.00', 2024, '2026-09-23 12:25:25'),
(27, NULL, 'Madukara', 'Ikan Cupang', 35000, '0.00', '525000000.00', 2024, '2026-09-23 12:25:25'),
(28, NULL, 'Madukara', 'Ikan Komet', 95000, '0.00', '950000000.00', 2024, '2026-09-23 12:25:25'),
(29, NULL, 'Mandiraja', 'Ikan Koi', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(30, NULL, 'Mandiraja', 'Ikan Mas Koki', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(31, NULL, 'Mandiraja', 'Ikan Cupang', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(32, NULL, 'Mandiraja', 'Ikan Komet', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(33, NULL, 'Pagedongan', 'Ikan Koi', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(34, NULL, 'Pagedongan', 'Ikan Mas Koki', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(35, NULL, 'Pagedongan', 'Ikan Cupang', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(36, NULL, 'Pagedongan', 'Ikan Komet', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(37, NULL, 'Pagentan', 'Ikan Koi', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(38, NULL, 'Pagentan', 'Ikan Mas Koki', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(39, NULL, 'Pagentan', 'Ikan Cupang', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(40, NULL, 'Pagentan', 'Ikan Komet', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(41, NULL, 'Pandanarum', 'Ikan Koi', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(42, NULL, 'Pandanarum', 'Ikan Mas Koki', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(43, NULL, 'Pandanarum', 'Ikan Cupang', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(44, NULL, 'Pandanarum', 'Ikan Komet', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(45, NULL, 'Pejawaran', 'Ikan Koi', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(46, NULL, 'Pejawaran', 'Ikan Mas Koki', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(47, NULL, 'Pejawaran', 'Ikan Cupang', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(48, NULL, 'Pejawaran', 'Ikan Komet', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(49, NULL, 'Punggelan', 'Ikan Koi', 120000, '0.00', '5400000000.00', 2024, '2026-09-23 12:25:25'),
(50, NULL, 'Punggelan', 'Ikan Mas Koki', 160000, '0.00', '3200000000.00', 2024, '2026-09-23 12:25:25'),
(51, NULL, 'Punggelan', 'Ikan Cupang', 80000, '0.00', '1200000000.00', 2024, '2026-09-23 12:25:25'),
(52, NULL, 'Punggelan', 'Ikan Komet', 220000, '0.00', '2200000000.00', 2024, '2026-09-23 12:25:25'),
(53, NULL, 'Purwanegara', 'Ikan Koi', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(54, NULL, 'Purwanegara', 'Ikan Mas Koki', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(55, NULL, 'Purwanegara', 'Ikan Cupang', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(56, NULL, 'Purwanegara', 'Ikan Komet', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(57, NULL, 'Purwareja Klampok', 'Ikan Koi', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(58, NULL, 'Purwareja Klampok', 'Ikan Mas Koki', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(59, NULL, 'Purwareja Klampok', 'Ikan Cupang', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(60, NULL, 'Purwareja Klampok', 'Ikan Komet', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(61, NULL, 'Rakit', 'Ikan Koi', 185000, '0.00', '8325000000.00', 2024, '2026-09-23 12:25:25'),
(62, NULL, 'Rakit', 'Ikan Mas Koki', 240000, '0.00', '4800000000.00', 2024, '2026-09-23 12:25:25'),
(63, NULL, 'Rakit', 'Ikan Cupang', 95000, '0.00', '1425000000.00', 2024, '2026-09-23 12:25:25'),
(64, NULL, 'Rakit', 'Ikan Komet', 310000, '0.00', '3100000000.00', 2024, '2026-09-23 12:25:25'),
(65, NULL, 'Sigaluh', 'Ikan Koi', 20000, '0.00', '900000000.00', 2024, '2026-09-23 12:25:25'),
(66, NULL, 'Sigaluh', 'Ikan Mas Koki', 25000, '0.00', '500000000.00', 2024, '2026-09-23 12:25:25'),
(67, NULL, 'Sigaluh', 'Ikan Cupang', 15000, '0.00', '225000000.00', 2024, '2026-09-23 12:25:25'),
(68, NULL, 'Sigaluh', 'Ikan Komet', 35000, '0.00', '350000000.00', 2024, '2026-09-23 12:25:25'),
(69, NULL, 'Susukan', 'Ikan Koi', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(70, NULL, 'Susukan', 'Ikan Mas Koki', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(71, NULL, 'Susukan', 'Ikan Cupang', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(72, NULL, 'Susukan', 'Ikan Komet', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(73, NULL, 'Wanadadi', 'Ikan Koi', 75000, '0.00', '3375000000.00', 2024, '2026-09-23 12:25:25'),
(74, NULL, 'Wanadadi', 'Ikan Mas Koki', 90000, '0.00', '1800000000.00', 2024, '2026-09-23 12:25:25'),
(75, NULL, 'Wanadadi', 'Ikan Cupang', 45000, '0.00', '675000000.00', 2024, '2026-09-23 12:25:25'),
(76, NULL, 'Wanadadi', 'Ikan Komet', 130000, '0.00', '1300000000.00', 2024, '2026-09-23 12:25:25'),
(77, NULL, 'Wanayasa', 'Ikan Koi', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(78, NULL, 'Wanayasa', 'Ikan Mas Koki', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(79, NULL, 'Wanayasa', 'Ikan Cupang', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25'),
(80, NULL, 'Wanayasa', 'Ikan Komet', 0, '0.00', '0.00', 2024, '2026-09-23 12:25:25');

-- Tabel: ternak_hpt
CREATE TABLE IF NOT EXISTS `ternak_hpt` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kecamatan_id` tinyint(3) unsigned NOT NULL,
  `tahun` smallint(5) unsigned NOT NULL,
  `bulan` varchar(20) DEFAULT NULL,
  `jenis_hijauan` varchar(60) NOT NULL,
  `luas_ha` decimal(10,2) NOT NULL DEFAULT 0.00,
  `produksi_ton` decimal(12,2) NOT NULL DEFAULT 0.00,
  `kapasitas_st` decimal(10,2) NOT NULL DEFAULT 0.00,
  `catatan` varchar(255) DEFAULT NULL,
  `sumber` enum('csv','ckan','manual') DEFAULT 'manual',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_kec_thn` (`kecamatan_id`,`tahun`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT IGNORE INTO `ternak_hpt` (`id`, `kecamatan_id`, `tahun`, `bulan`, `jenis_hijauan`, `luas_ha`, `produksi_ton`, `kapasitas_st`, `catatan`, `sumber`, `created_at`, `updated_at`) VALUES
(1, 3, 2024, NULL, 'Rumput Odot', '3.50', '0.00', '29.17', NULL, 'manual', '2026-10-05 14:33:46', '2026-10-05 14:33:46');

-- Tabel: ternak_umkm_pakan
CREATE TABLE IF NOT EXISTS `ternak_umkm_pakan` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kecamatan_id` tinyint(3) unsigned NOT NULL,
  `tahun` smallint(5) unsigned NOT NULL,
  `bulan` varchar(20) DEFAULT NULL,
  `nama_usaha` varchar(100) NOT NULL,
  `jenis_pakan` varchar(100) NOT NULL,
  `kapasitas_ton_bulan` decimal(10,2) NOT NULL DEFAULT 0.00,
  `alamat` varchar(255) DEFAULT NULL,
  `kontak` varchar(100) DEFAULT NULL,
  `catatan` varchar(255) DEFAULT NULL,
  `sumber` enum('csv','ckan','manual') DEFAULT 'manual',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_kec_thn` (`kecamatan_id`,`tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: ternak_poultry_shop
CREATE TABLE IF NOT EXISTS `ternak_poultry_shop` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kecamatan_id` tinyint(3) unsigned NOT NULL,
  `tahun` smallint(5) unsigned NOT NULL,
  `bulan` varchar(20) DEFAULT NULL,
  `nama_toko` varchar(100) NOT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `jenis_layanan` varchar(100) DEFAULT 'Pakan, Obat & Sapronak',
  `koordinat` varchar(60) DEFAULT NULL,
  `kontak` varchar(100) DEFAULT NULL,
  `catatan` varchar(255) DEFAULT NULL,
  `sumber` enum('csv','ckan','manual') DEFAULT 'manual',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_kec_thn` (`kecamatan_id`,`tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel: ternak_nkv
CREATE TABLE IF NOT EXISTS `ternak_nkv` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kecamatan_id` tinyint(3) unsigned NOT NULL,
  `tahun` smallint(5) unsigned NOT NULL,
  `bulan` varchar(20) DEFAULT NULL,
  `nama_unit_usaha` varchar(100) NOT NULL,
  `nomor_nkv` varchar(60) DEFAULT 'Dalam Proses Registrasi',
  `kategori` varchar(80) NOT NULL,
  `status_verifikasi` varchar(60) DEFAULT 'Registrasi',
  `catatan` varchar(255) DEFAULT NULL,
  `sumber` enum('csv','ckan','manual') DEFAULT 'manual',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_kec_thn` (`kecamatan_id`,`tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -------------------------------------------------------------------------
-- 3. PEMBARUAN SKEMA & DATA: KOMODITAS UNGGULAN & NILAI EKONOMI (ADR-009)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `komoditas_unggulan`;
CREATE TABLE `komoditas_unggulan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sektor` varchar(50) NOT NULL,
  `nama_komoditas` varchar(100) NOT NULL,
  `satuan` varchar(20) DEFAULT 'Ton',
  `kecamatan_sentra` varchar(100) DEFAULT NULL,
  `total_produksi` decimal(15,2) DEFAULT 0.00,
  `nilai_ekonomi_estimasi` decimal(18,2) DEFAULT 0.00,
  `tahun` int(11) DEFAULT 2024,
  `is_unggulan` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sektor` (`sektor`),
  KEY `idx_komoditas` (`nama_komoditas`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `komoditas_unggulan` (`id`, `sektor`, `nama_komoditas`, `satuan`, `kecamatan_sentra`, `total_produksi`, `nilai_ekonomi_estimasi`, `tahun`, `is_unggulan`, `created_at`) VALUES
(1, 'pangan', 'Padi Sawah', 'Ton', 'Punggelan', '5424.00', '36883200000.00', 2024, 1, '2026-09-23 12:25:25'),
(2, 'pangan', 'Padi Ladang', 'Ton', 'Mandiraja', '686.00', '4459000000.00', 2024, 1, '2026-09-23 12:25:25'),
(3, 'pangan', 'Jagung', 'Ton', 'Banjarmangu', '0.00', '0.00', 2024, 1, '2026-09-23 12:25:25'),
(4, 'pangan', 'Ubi Kayu', 'Ton', 'Banjarmangu', '0.00', '0.00', 2024, 1, '2026-09-23 12:25:25'),
(5, 'pangan', 'Ubi Jalar', 'Ton', 'Madukara', '2719.00', '9516500000.00', 2024, 1, '2026-09-23 12:25:25'),
(6, 'pangan', 'Kacang Tanah', 'Ton', 'Purwanegara', '986.00', '17748000000.00', 2024, 1, '2026-09-23 12:25:25'),
(7, 'pangan', 'Kedelai', 'Ton', 'Banjarmangu', '0.00', '0.00', 2024, 1, '2026-09-23 12:25:25'),
(8, 'pangan', 'Kacang Hijau', 'Ton', 'Mandiraja', '8.00', '136000000.00', 2024, 1, '2026-09-23 12:25:25'),
(9, 'pangan', 'Porang', 'Ton', 'Kalibening', '1280.00', '10880000000.00', 2024, 1, '2026-09-23 12:25:25'),
(10, 'pangan', 'Talas', 'Ton', 'Madukara', '1340.00', '6030000000.00', 2024, 1, '2026-09-23 12:25:25'),
(11, 'hortikultura', 'Kentang', 'Ton', 'Batur', '139726.00', '1536986000000.00', 2024, 1, '2026-09-23 12:25:25'),
(12, 'hortikultura', 'Kubis', 'Ton', 'Batur', '31549.00', '110421500000.00', 2024, 1, '2026-09-23 12:25:25'),
(13, 'hortikultura', 'Wortel', 'Ton', 'Banjarmangu', '0.00', '0.00', 2024, 1, '2026-09-23 12:25:25'),
(14, 'hortikultura', 'Cabai Rawit', 'Ton', 'Pejawaran', '13720.00', '439040000000.00', 2024, 1, '2026-09-23 12:25:25'),
(15, 'hortikultura', 'Cabai Merah', 'Ton', 'Pagentan', '14119.00', '395332000000.00', 2024, 1, '2026-09-23 12:25:25'),
(16, 'hortikultura', 'Bawang Merah', 'Ton', 'Banjarmangu', '0.00', '0.00', 2024, 1, '2026-09-23 12:25:25'),
(17, 'hortikultura', 'Tomat', 'Ton', 'Pejawaran', '19082.00', '95410000000.00', 2024, 1, '2026-09-23 12:25:25'),
(18, 'hortikultura', 'Salak', 'Ton', 'Kalibening', '199676.00', '1198056000000.00', 2024, 1, '2026-09-23 12:25:25'),
(19, 'hortikultura', 'Pisang', 'Ton', 'Kalibening', '30593.00', '152965000000.00', 2024, 1, '2026-09-23 12:25:25'),
(20, 'hortikultura', 'Durian', 'Ton', 'Sigaluh', '5412.00', '135300000000.00', 2024, 1, '2026-09-23 12:25:25'),
(21, 'hortikultura', 'Mangga', 'Ton', 'Banjarmangu', '577.00', '5770000000.00', 2024, 1, '2026-09-23 12:25:25'),
(22, 'perkebunan', 'Kelapa', 'Ton', 'Susukan', '16921.00', '270736000000.00', 2024, 1, '2026-09-23 12:25:25'),
(23, 'perkebunan', 'Kopi Arabika', 'Ton', 'Banjarmangu', '0.00', '0.00', 2024, 1, '2026-09-23 12:25:25'),
(24, 'perkebunan', 'Kopi Robusta', 'Ton', 'Karangkobar', '2167.00', '82346000000.00', 2024, 1, '2026-09-23 12:25:25'),
(25, 'perkebunan', 'Teh', 'Ton', 'Kalibening', '3731.00', '16789500000.00', 2024, 1, '2026-09-23 12:25:25'),
(26, 'perkebunan', 'Kapulaga', 'Ton', 'Banjarmangu', '0.00', '0.00', 2024, 1, '2026-09-23 12:25:25'),
(27, 'perkebunan', 'Cengkeh', 'Ton', 'Banjarmangu', '0.00', '0.00', 2024, 1, '2026-09-23 12:25:25'),
(28, 'perkebunan', 'Tebu', 'Ton', 'Banjarmangu', '0.00', '0.00', 2024, 1, '2026-09-23 12:25:25'),
(29, 'perkebunan', 'Tembakau', 'Ton', 'Pejawaran', '431.00', '19395000000.00', 2024, 1, '2026-09-23 12:25:25'),
(30, 'perkebunan', 'Kelapa Deres (Gula Semut)', 'Ton', 'Susukan', '5923.00', '106614000000.00', 2024, 1, '2026-09-23 12:25:25'),
(31, 'perkebunan', 'Porang', 'Ton', 'Kalibening', '1280.00', '10880000000.00', 2024, 1, '2026-09-23 12:25:26'),
(32, 'perkebunan', 'Talas', 'Ton', 'Madukara', '1340.00', '6030000000.00', 2024, 1, '2026-09-23 12:25:26'),
(33, 'peternakan', 'Sapi Potong', 'Ekor', 'Pandanarum', '21052.00', '463144000000.00', 2024, 1, '2026-09-23 12:25:26'),
(34, 'peternakan', 'Sapi Perah', 'Ekor', 'Pejawaran', '76.00', '1900000000.00', 2024, 1, '2026-09-23 12:25:26'),
(35, 'peternakan', 'Kambing', 'Ekor', 'Punggelan', '205618.00', '575730400000.00', 2024, 1, '2026-09-23 12:25:26'),
(36, 'peternakan', 'Domba Batur', 'Ekor', 'Pejawaran', '52271.00', '182948500000.00', 2024, 1, '2026-09-23 12:25:26'),
(37, 'peternakan', 'Kelinci', 'Ekor', 'Bawang', '12361.00', '1854150000.00', 2024, 1, '2026-09-23 12:25:26'),
(38, 'peternakan', 'Ayam Broiler', 'Ekor', 'Punggelan', '3019269.00', '114732222000.00', 2024, 1, '2026-09-23 12:25:26'),
(39, 'peternakan', 'Ayam Kampung', 'Ekor', 'Purwanegara', '467418.00', '30382170000.00', 2024, 1, '2026-09-23 12:25:26'),
(40, 'peternakan', 'Ayam Layer', 'Ekor', 'Rakit', '474288.00', '40314480000.00', 2024, 1, '2026-09-23 12:25:26'),
(41, 'peternakan', 'Itik', 'Ekor', 'Mandiraja', '35220.00', '1937100000.00', 2024, 1, '2026-09-23 12:25:26'),
(42, 'peternakan', 'Burung Puyuh', 'Ekor', 'Rakit', '189714.00', '2845710000.00', 2024, 1, '2026-09-23 12:25:26'),
(43, 'peternakan', 'Daging Sapi', 'Kg', 'Banjarnegara', '1869481.00', '243032530000.00', 2024, 1, '2026-09-23 12:25:26'),
(44, 'peternakan', 'Daging Kambing & Domba', 'Kg', 'Kalibening', '114891.00', '16084740000.00', 2024, 1, '2026-09-23 12:25:26'),
(45, 'peternakan', 'Daging Ayam Broiler', 'Kg', 'Pagedongan', '17131382.00', '650992516000.00', 2024, 1, '2026-09-23 12:25:26'),
(46, 'peternakan', 'Telur Ayam Layer', 'Kg', 'Wanayasa', '88416596.00', '2298831496000.00', 2024, 1, '2026-09-23 12:25:26'),
(47, 'peternakan', 'Telur Ayam Kampung', 'Kg', 'Mandiraja', '24102337.00', '1084605165000.00', 2024, 1, '2026-09-23 12:25:26'),
(48, 'peternakan', 'Susu Sapi Segar', 'Liter', 'Pejawaran', '243200.00', '2188800000.00', 2024, 1, '2026-09-23 12:25:26'),
(49, 'peternakan', 'Kulit Sapi & Kambing', 'Lembar', 'Banjarnegara', '22561.00', '5640250000.00', 2024, 1, '2026-09-23 12:25:26');

-- Nilai ekonomi tahunan
DROP TABLE IF EXISTS `nilai_ekonomi_tahunan`;
CREATE TABLE `nilai_ekonomi_tahunan` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bidang` enum('pangan','hortikultura','perkebunan','peternakan','perikanan') NOT NULL,
  `komoditas` varchar(100) NOT NULL,
  `satuan` varchar(20) NOT NULL,
  `tahun` smallint(5) unsigned NOT NULL,
  `triwulan` tinyint(3) unsigned DEFAULT NULL,
  `volume` decimal(14,2) NOT NULL,
  `harga_produsen` decimal(14,2) NOT NULL,
  `nilai_rp` decimal(16,2) GENERATED ALWAYS AS (`volume` * `harga_produsen`) STORED,
  `sumber` varchar(100) NOT NULL DEFAULT 'manual',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_ekonomi_bidang` (`bidang`,`tahun`),
  KEY `idx_ekonomi_tahun` (`tahun`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Nilai ekonomi per bidang/komoditas/tahun/triwulan (input dinas; Rp = volume x harga_produsen)';
INSERT INTO `nilai_ekonomi_tahunan` (`id`, `bidang`, `komoditas`, `satuan`, `tahun`, `triwulan`, `volume`, `harga_produsen`, `nilai_rp`, `sumber`, `created_at`, `updated_at`) VALUES
(1, 'pangan', 'Padi Sawah', 'Ton', 2024, NULL, '5424.00', '6800000.00', '36883200000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(2, 'pangan', 'Padi Ladang', 'Ton', 2024, NULL, '686.00', '6500000.00', '4459000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(3, 'pangan', 'Jagung', 'Ton', 2024, NULL, '0.00', '0.00', '0.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(4, 'pangan', 'Ubi Kayu', 'Ton', 2024, NULL, '0.00', '0.00', '0.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(5, 'pangan', 'Ubi Jalar', 'Ton', 2024, NULL, '2719.00', '3500000.00', '9516500000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(6, 'pangan', 'Kacang Tanah', 'Ton', 2024, NULL, '986.00', '18000000.00', '17748000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(7, 'pangan', 'Kedelai', 'Ton', 2024, NULL, '0.00', '0.00', '0.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(8, 'pangan', 'Kacang Hijau', 'Ton', 2024, NULL, '8.00', '17000000.00', '136000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(9, 'pangan', 'Porang', 'Ton', 2024, NULL, '1280.00', '8500000.00', '10880000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(10, 'pangan', 'Talas', 'Ton', 2024, NULL, '1340.00', '4500000.00', '6030000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(11, 'hortikultura', 'Kentang', 'Ton', 2024, NULL, '139726.00', '11000000.00', '1536986000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(12, 'hortikultura', 'Kubis', 'Ton', 2024, NULL, '31549.00', '3500000.00', '110421500000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(13, 'hortikultura', 'Wortel', 'Ton', 2024, NULL, '0.00', '0.00', '0.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(14, 'hortikultura', 'Cabai Rawit', 'Ton', 2024, NULL, '13720.00', '32000000.00', '439040000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(15, 'hortikultura', 'Cabai Merah', 'Ton', 2024, NULL, '14119.00', '28000000.00', '395332000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(16, 'hortikultura', 'Bawang Merah', 'Ton', 2024, NULL, '0.00', '0.00', '0.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(17, 'hortikultura', 'Tomat', 'Ton', 2024, NULL, '19082.00', '5000000.00', '95410000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(18, 'hortikultura', 'Salak', 'Ton', 2024, NULL, '199676.00', '6000000.00', '1198056000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(19, 'hortikultura', 'Pisang', 'Ton', 2024, NULL, '30593.00', '5000000.00', '152965000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(20, 'hortikultura', 'Durian', 'Ton', 2024, NULL, '5412.00', '25000000.00', '135300000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(21, 'hortikultura', 'Mangga', 'Ton', 2024, NULL, '577.00', '10000000.00', '5770000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(22, 'perkebunan', 'Kelapa', 'Ton', 2024, NULL, '16921.00', '16000000.00', '270736000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(23, 'perkebunan', 'Kopi Arabika', 'Ton', 2024, NULL, '0.00', '0.00', '0.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(24, 'perkebunan', 'Kopi Robusta', 'Ton', 2024, NULL, '2167.00', '38000000.00', '82346000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(25, 'perkebunan', 'Teh', 'Ton', 2024, NULL, '3731.00', '4500000.00', '16789500000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(26, 'perkebunan', 'Kapulaga', 'Ton', 2024, NULL, '0.00', '0.00', '0.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(27, 'perkebunan', 'Cengkeh', 'Ton', 2024, NULL, '0.00', '0.00', '0.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(28, 'perkebunan', 'Tebu', 'Ton', 2024, NULL, '0.00', '0.00', '0.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(29, 'perkebunan', 'Tembakau', 'Ton', 2024, NULL, '431.00', '45000000.00', '19395000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(30, 'perkebunan', 'Kelapa Deres (Gula Semut)', 'Ton', 2024, NULL, '5923.00', '18000000.00', '106614000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(31, 'perkebunan', 'Porang', 'Ton', 2024, NULL, '1280.00', '8500000.00', '10880000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(32, 'perkebunan', 'Talas', 'Ton', 2024, NULL, '1340.00', '4500000.00', '6030000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(33, 'peternakan', 'Sapi Potong', 'Ekor', 2024, NULL, '21052.00', '22000000.00', '463144000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(34, 'peternakan', 'Sapi Perah', 'Ekor', 2024, NULL, '76.00', '25000000.00', '1900000000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(35, 'peternakan', 'Kambing', 'Ekor', 2024, NULL, '205618.00', '2800000.00', '575730400000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(36, 'peternakan', 'Domba Batur', 'Ekor', 2024, NULL, '52271.00', '3500000.00', '182948500000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(37, 'peternakan', 'Kelinci', 'Ekor', 2024, NULL, '12361.00', '150000.00', '1854150000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(38, 'peternakan', 'Ayam Broiler', 'Ekor', 2024, NULL, '3019269.00', '38000.00', '114732222000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(39, 'peternakan', 'Ayam Kampung', 'Ekor', 2024, NULL, '467418.00', '65000.00', '30382170000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(40, 'peternakan', 'Ayam Layer', 'Ekor', 2024, NULL, '474288.00', '85000.00', '40314480000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(41, 'peternakan', 'Itik', 'Ekor', 2024, NULL, '35220.00', '55000.00', '1937100000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(42, 'peternakan', 'Burung Puyuh', 'Ekor', 2024, NULL, '189714.00', '15000.00', '2845710000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(43, 'peternakan', 'Daging Sapi', 'Kg', 2024, NULL, '1869481.00', '130000.00', '243032530000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(44, 'peternakan', 'Daging Kambing & Domba', 'Kg', 2024, NULL, '114891.00', '140000.00', '16084740000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(45, 'peternakan', 'Daging Ayam Broiler', 'Kg', 2024, NULL, '17131382.00', '38000.00', '650992516000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(46, 'peternakan', 'Telur Ayam Layer', 'Kg', 2024, NULL, '88416596.00', '26000.00', '2298831496000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(47, 'peternakan', 'Telur Ayam Kampung', 'Kg', 2024, NULL, '24102337.00', '45000.00', '1084605165000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(48, 'peternakan', 'Susu Sapi Segar', 'Liter', 2024, NULL, '243200.00', '9000.00', '2188800000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26'),
(49, 'peternakan', 'Kulit Sapi & Kambing', 'Lembar', 2024, NULL, '22561.00', '250000.00', '5640250000.00', 'Distankan Matrix 2024', '2026-09-23 12:25:26', '2026-09-23 12:25:26');

-- -------------------------------------------------------------------------
-- 4. REFACTORING ADR-012: NORMALISASI SPESIES KULIT DI PRODUCTION
-- -------------------------------------------------------------------------
UPDATE `ternak_susu_kulit` SET `jenis` = 'Kulit Sapi' WHERE `jenis` = 'Sapi/Kerbau';
UPDATE `ternak_susu_kulit` SET `jenis` = 'Kulit Kambing' WHERE `jenis` = 'Kambing/Domba';


-- -------------------------------------------------------------------------
-- 5. TABEL KETAHANAN PANGAN & KEAMANAN PANGAN (ADR-020)
-- -------------------------------------------------------------------------

-- 5.1 Tabel psat_pduk: Pengawasan Keamanan Pangan Segar Asal Tumbuhan (Uji Petik Acak & Registrasi)
CREATE TABLE IF NOT EXISTS `psat_pduk` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tanggal_uji` date DEFAULT NULL,
  `lokasi_pasar` varchar(100) NOT NULL,
  `nama_pedagang` varchar(150) NOT NULL,
  `komoditas` varchar(100) NOT NULL,
  `kecamatan` varchar(50) NOT NULL,
  `parameter_uji` varchar(100) DEFAULT 'Residu Pestisida & Bahan Berbahaya',
  `hasil_uji` enum('Memenuhi Syarat (Aman)','Tidak Memenuhi Syarat','Dalam Pengujian') DEFAULT 'Memenuhi Syarat (Aman)',
  `no_registrasi` varchar(100) DEFAULT NULL,
  `status` enum('Terdaftar / Berizin','Uji Petik Acak','Pembinaan') DEFAULT 'Uji Petik Acak',
  `keterangan` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `psat_pduk` (`id`, `tanggal_uji`, `lokasi_pasar`, `nama_pedagang`, `komoditas`, `kecamatan`, `parameter_uji`, `hasil_uji`, `no_registrasi`, `status`, `keterangan`) VALUES
(1, '2025-02-14', 'Pasar Induk Banjarnegara', 'Kios Pangan Berkah', 'Beras Medium', 'Banjarnegara', 'Residu Pestisida & Pemutih (Klorin)', 'Memenuhi Syarat (Aman)', 'PSAT-PDUK 33.04-A.I.001-2024', 'Terdaftar / Berizin', 'Lolos uji klorin & organofosfat oleh OKKPD Banjarnegara'),
(2, '2025-02-18', 'Pasar Sayur Karangkobar', 'Kios Sayur Segar Dieng', 'Cabai Rawit Merah', 'Karangkobar', 'Rapid Test Residu Pestisida Organofosfat', 'Memenuhi Syarat (Aman)', NULL, 'Uji Petik Acak', 'Inspeksi acak rutin pasar tradisional (hasil negatif residu)'),
(3, '2025-02-20', 'Pasar Rakyat Mandiraja', 'Pengepul Buah Subur', 'Salak Pondoh', 'Mandiraja', 'Residu Pestisida & Logam Berat', 'Memenuhi Syarat (Aman)', NULL, 'Uji Petik Acak', 'Hasil rapid test kit di bawah Batas Maksimum Residu (BMR)'),
(4, '2025-02-22', 'Pasar Rakyat Klampok', 'Kios Sayur Bu Siti', 'Tomat & Kubis', 'Purwareja Klampok', 'Rapid Test Residu Pestisida', 'Dalam Pengujian', NULL, 'Uji Petik Acak', 'Sampel dikirim untuk uji konfirmasi laboratorium daerah'),
(5, '2025-02-25', 'Pasar Batur', 'Poktan Dieng Makmur', 'Kentang Granola Kemas', 'Batur', 'Residu Kimia & Jamur', 'Memenuhi Syarat (Aman)', 'PSAT-PDUK 33.04-A.I.004-2025', 'Terdaftar / Berizin', 'Registrasi kemasan izin edar usaha kecil disetujui');

-- 5.2 Tabel harga_pasar_banjarnegara: Pemantauan Harga Harian Pasar Tradisional
CREATE TABLE IF NOT EXISTS `harga_pasar_banjarnegara` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tanggal` date NOT NULL,
  `lokasi_pasar` varchar(100) NOT NULL,
  `kecamatan` varchar(50) NOT NULL,
  `komoditas` varchar(100) NOT NULL,
  `kategori` varchar(50) DEFAULT 'Pangan Pokok',
  `harga` decimal(12,2) DEFAULT NULL,
  `satuan` varchar(20) DEFAULT 'Kg',
  `perubahan_rp` decimal(10,2) DEFAULT 0.00,
  `status_pantau` enum('Tercatat','Menunggu Input','Tidak Tersedia') DEFAULT 'Menunggu Input',
  `petugas_pencatat` varchar(100) DEFAULT 'Petugas Pasar Disperindagkop/DKPP',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_lokasi` (`lokasi_pasar`),
  KEY `idx_tanggal` (`tanggal`),
  KEY `idx_komoditas` (`komoditas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `harga_pasar_banjarnegara` (`id`, `tanggal`, `lokasi_pasar`, `kecamatan`, `komoditas`, `kategori`, `harga`, `satuan`, `perubahan_rp`, `status_pantau`) VALUES
(1, '2025-02-25', 'Pasar Induk Banjarnegara', 'Banjarnegara', 'Beras Medium', 'Pangan Pokok', 13500.00, 'Kg', 0.00, 'Tercatat'),
(2, '2025-02-25', 'Pasar Induk Banjarnegara', 'Banjarnegara', 'Cabai Rawit Merah', 'Hortikultura', 48000.00, 'Kg', 2000.00, 'Tercatat'),
(3, '2025-02-25', 'Pasar Induk Banjarnegara', 'Banjarnegara', 'Bawang Merah', 'Hortikultura', 32000.00, 'Kg', -1000.00, 'Tercatat'),
(4, '2025-02-25', 'Pasar Induk Banjarnegara', 'Banjarnegara', 'Daging Ayam Ras', 'Peternakan', 36000.00, 'Kg', 0.00, 'Tercatat'),
(5, '2025-02-25', 'Pasar Sayur Karangkobar', 'Karangkobar', 'Kentang Dieng', 'Hortikultura', 16000.00, 'Kg', 0.00, 'Tercatat'),
(6, '2025-02-25', 'Pasar Sayur Karangkobar', 'Karangkobar', 'Kubis', 'Hortikultura', 6000.00, 'Kg', 500.00, 'Tercatat'),
(7, '2025-02-25', 'Pasar Sayur Karangkobar', 'Karangkobar', 'Cabai Rawit Merah', 'Hortikultura', 45000.00, 'Kg', -1000.00, 'Tercatat'),
(8, '2025-02-25', 'Pasar Sayur Karangkobar', 'Karangkobar', 'Tomat', 'Hortikultura', 12000.00, 'Kg', 0.00, 'Tercatat'),
(9, '2025-02-25', 'Pasar Rakyat Mandiraja', 'Mandiraja', 'Beras Medium', 'Pangan Pokok', 13200.00, 'Kg', 0.00, 'Tercatat'),
(10, '2025-02-25', 'Pasar Rakyat Mandiraja', 'Mandiraja', 'Minyak Goreng Curah', 'Pangan Pokok', 16500.00, 'Liter', 0.00, 'Tercatat'),
(11, '2025-02-25', 'Pasar Rakyat Mandiraja', 'Mandiraja', 'Gula Pasir', 'Pangan Pokok', 17500.00, 'Kg', 0.00, 'Tercatat'),
(12, '2025-02-25', 'Pasar Rakyat Mandiraja', 'Mandiraja', 'Telur Ayam Ras', 'Peternakan', 28000.00, 'Kg', -500.00, 'Tercatat'),
(13, '2025-02-25', 'Pasar Rakyat Klampok', 'Purwareja Klampok', 'Beras Premium', 'Pangan Pokok', 14800.00, 'Kg', 0.00, 'Tercatat'),
(14, '2025-02-25', 'Pasar Rakyat Klampok', 'Purwareja Klampok', 'Bawang Putih', 'Hortikultura', 38000.00, 'Kg', 0.00, 'Tercatat'),
(15, '2025-02-25', 'Pasar Rakyat Klampok', 'Purwareja Klampok', 'Daging Sapi', 'Peternakan', 135000.00, 'Kg', 0.00, 'Tercatat'),
(16, '2025-02-25', 'Pasar Rakyat Klampok', 'Purwareja Klampok', 'Cabai Merah Keriting', 'Hortikultura', 42000.00, 'Kg', 1000.00, 'Tercatat');

-- 5.3 Tabel fsva_indikator_kabupaten: 12 Indikator FSVA Standar Badan Pangan Nasional
CREATE TABLE IF NOT EXISTS `fsva_indikator_kabupaten` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tahun` int(11) NOT NULL,
  `pilar` enum('Ketersediaan Pangan','Keterjangkauan Pangan','Pemanfaatan Pangan') NOT NULL,
  `nomor_indikator` int(11) NOT NULL,
  `nama_indikator` varchar(200) NOT NULL,
  `satuan` varchar(50) NOT NULL,
  `standar_norma` varchar(100) NOT NULL,
  `nilai_capaian` decimal(10,2) DEFAULT NULL,
  `status_data` enum('Tersedia','Menunggu Data Integrasi Bapanas / OPD') DEFAULT 'Menunggu Data Integrasi Bapanas / OPD',
  `sumber_opd` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_tahun` (`tahun`),
  KEY `idx_pilar` (`pilar`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `fsva_indikator_kabupaten` (`id`, `tahun`, `pilar`, `nomor_indikator`, `nama_indikator`, `satuan`, `standar_norma`, `status_data`, `sumber_opd`, `deskripsi`) VALUES
(1, 2024, 'Ketersediaan Pangan', 1, 'Rasio Konsumsi Normatif thd Produksi Bersih Pangan', 'Rasio', '≥ 1.0 (Swasembada)', 'Menunggu Data Integrasi Bapanas / OPD', 'Distankan KP', 'Perbandingan produksi bersih beras & jagung terhadap kebutuhan konsumsi normatif penduduk kabupaten.'),
(2, 2024, 'Ketersediaan Pangan', 2, 'Rasio Ketersediaan Energi per Kapita / Hari', 'kkal/kap/hari', '≥ 2.100 kkal (Standar WNPG)', 'Menunggu Data Integrasi Bapanas / OPD', 'Distankan KP', 'Total ketersediaan kalori pangan dari Neraca Bahan Makanan (NBM) terhadap Angka Kecukupan Energi.'),
(3, 2024, 'Ketersediaan Pangan', 3, 'Rasio Ketersediaan Protein Hewani', 'gram/kap/hari', '≥ 14.0 gram protein', 'Menunggu Data Integrasi Bapanas / OPD', 'Distankan KP', 'Ketersediaan protein hewani (daging, telur, susu, ikan) terhadap Angka Kecukupan Gizi (AKG).'),
(4, 2024, 'Ketersediaan Pangan', 4, 'Rasio Cadangan Beras Pemerintah (CBP)', 'Ton / % Target', '100% Alokasi APBD/Bulog', 'Menunggu Data Integrasi Bapanas / OPD', 'Bagian Perekonomian Setda & Bulog', 'Realisasi fisik cadangan beras pemerintah daerah di gudang Bulog dan lumbung pangan masyarakat.'),
(5, 2024, 'Keterjangkauan Pangan', 5, 'Persentase Penduduk di Bawah Garis Kemiskinan', '%', 'Makin rendah makin baik', 'Menunggu Data Integrasi Bapanas / OPD', 'BPS & Dinsos', 'Proporsi penduduk dengan pengeluaran di bawah garis kemiskinan (data rujukan BPS Banjarnegara).'),
(6, 2024, 'Keterjangkauan Pangan', 6, 'Persentase Pengeluaran Pangan (>65% Pengeluaran)', '%', '< 65% Total Belanja RT', 'Menunggu Data Integrasi Bapanas / OPD', 'BPS Banjarnegara', 'Proporsi rumah tangga dengan porsi belanja pangan melebihi 65% dari total pengeluaran konsumsi.'),
(7, 2024, 'Keterjangkauan Pangan', 7, 'Rumah Tangga Tanpa Akses Listrik / Jalan Memadai', '%', 'Makin rendah makin baik', 'Menunggu Data Integrasi Bapanas / OPD', 'DPU PR & Bapperida', 'Indikator keterisolasian fisik wilayah yang berisiko menghambat kelancaran rantai distribusi pangan pokok.'),
(8, 2024, 'Keterjangkauan Pangan', 8, 'Koefisien Variasi Disparitas Harga Pangan Antar Pasar', 'CV (%)', '< 15% (Stabilitas Harga)', 'Menunggu Data Integrasi Bapanas / OPD', 'Disperindagkop & Distankan KP', 'Variasi perbedaan harga komoditas pangan pokok strategis antar pasar kecamatan di Banjarnegara.'),
(9, 2024, 'Pemanfaatan Pangan', 9, 'Rumah Tangga Tanpa Akses Air Minum Layak', '%', 'Makin rendah makin baik', 'Menunggu Data Integrasi Bapanas / OPD', 'Dinas Kesehatan & Bapperida', 'Persentase rumah tangga yang belum memiliki akses sumber air minum terlindungi dan higienis.'),
(10, 2024, 'Pemanfaatan Pangan', 10, 'Rasio Tenaga Kesehatan per 10.000 Penduduk', 'Nakes / 10rb', 'Standar Kemenkes', 'Menunggu Data Integrasi Bapanas / OPD', 'Dinas Kesehatan', 'Ketersediaan dokter umum, bidan, dan perawat pendamping kesehatan & gizi di tingkat puskesmas/desa.'),
(11, 2024, 'Pemanfaatan Pangan', 11, 'Prevalensi Balita Stunting (Tinggi Badan menurut Umur)', '%', '< 14% (Target Nasional)', 'Menunggu Data Integrasi Bapanas / OPD', 'Dinas Kesehatan (e-PPGBM)', 'Persentase balita sangat pendek dan pendek berdasarkan hasil penimbangan e-PPGBM Dinas Kesehatan.'),
(12, 2024, 'Pemanfaatan Pangan', 12, 'Rumah Tangga Tanpa Sanitasi Layak / Angka Harapan Hidup', '% / Tahun', 'Akses Universal', 'Menunggu Data Integrasi Bapanas / OPD', 'Dinas Kesehatan & BPS', 'Cakupan jamban sehat bersertifikasi ODF dan rata-rata angka harapan hidup saat lahir.');

-- 5.4 Tabel neraca_pangan_komposit: Neraca Bahan Makanan (NBM) Komposit Non-Beras
CREATE TABLE IF NOT EXISTS `neraca_pangan_komposit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tahun` int(11) NOT NULL,
  `komoditas` varchar(100) NOT NULL,
  `kategori` varchar(50) NOT NULL,
  `ketersediaan_bersih_ton` decimal(12,2) DEFAULT NULL,
  `kebutuhan_konsumsi_ton` decimal(12,2) DEFAULT NULL,
  `neraca_ton` decimal(12,2) DEFAULT NULL,
  `status_neraca` enum('Surplus','Seimbang','Defisit','Menunggu Data') DEFAULT 'Menunggu Data',
  `sumber_data` varchar(150) DEFAULT 'Dinas Ketahanan Pangan & Pertanian Kab. Banjarnegara',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_tahun` (`tahun`),
  KEY `idx_komoditas` (`komoditas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `neraca_pangan_komposit` (`id`, `tahun`, `komoditas`, `kategori`, `status_neraca`, `sumber_data`) VALUES
(1, 2024, 'Jagung', 'Karbohidrat / Pakan', 'Menunggu Data', 'Dinas Ketahanan Pangan & Pertanian Kab. Banjarnegara'),
(2, 2024, 'Kedelai', 'Protein Nabati', 'Menunggu Data', 'Dinas Ketahanan Pangan & Pertanian Kab. Banjarnegara'),
(3, 2024, 'Ubi Kayu (Singkong)', 'Karbohidrat Alternatif', 'Menunggu Data', 'Dinas Ketahanan Pangan & Pertanian Kab. Banjarnegara'),
(4, 2024, 'Daging Sapi', 'Protein Hewani', 'Menunggu Data', 'Dinas Ketahanan Pangan & Pertanian Kab. Banjarnegara'),
(5, 2024, 'Daging Ayam Ras', 'Protein Hewani', 'Menunggu Data', 'Dinas Ketahanan Pangan & Pertanian Kab. Banjarnegara'),
(6, 2024, 'Telur Ayam Ras', 'Protein Hewani', 'Menunggu Data', 'Dinas Ketahanan Pangan & Pertanian Kab. Banjarnegara'),
(7, 2024, 'Minyak Goreng', 'Lemak Nabati', 'Menunggu Data', 'Dinas Ketahanan Pangan & Pertanian Kab. Banjarnegara'),
(8, 2024, 'Gula Pasir', 'Pemanis Pokok', 'Menunggu Data', 'Dinas Ketahanan Pangan & Pertanian Kab. Banjarnegara');


-- =========================================================================
-- 6. KELEMBAGAAN TANI, PERIKANAN, JULEHA, P4S, DAN UPJA
-- =========================================================================

CREATE TABLE `kelembagaan_pertanian` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kecamatan` varchar(50) NOT NULL,
  `desa` varchar(100) NOT NULL,
  `jenis_lembaga` enum('Poktan','Gapoktan','KWT') NOT NULL DEFAULT 'Poktan',
  `nama_kelompok` varchar(150) NOT NULL,
  `id_simluhtan` varchar(50) DEFAULT NULL,
  `no_sk_pengukuhan` varchar(100) DEFAULT NULL,
  `nama_ketua` varchar(100) NOT NULL,
  `kontak_hp` varchar(30) DEFAULT NULL,
  `kelas_kemampuan` enum('Pemula','Lanjut','Madya','Utama','Belum Dinilai') DEFAULT 'Belum Dinilai',
  `subsektor_utama` enum('Tanaman Pangan','Hortikultura','Perkebunan','Peternakan','Campuran') DEFAULT 'Tanaman Pangan',
  `jumlah_anggota` int(11) DEFAULT 0,
  `tahun_berdiri` year(4) DEFAULT NULL,
  `status_aktif` enum('Aktif','Tidak Aktif','Menunggu Verifikasi') DEFAULT 'Aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_kecamatan` (`kecamatan`),
  KEY `idx_jenis` (`jenis_lembaga`),
  KEY `idx_nama` (`nama_kelompok`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `kelembagaan_pertanian` (`id`, `kecamatan`, `desa`, `jenis_lembaga`, `nama_kelompok`, `id_simluhtan`, `no_sk_pengukuhan`, `nama_ketua`, `kontak_hp`, `kelas_kemampuan`, `subsektor_utama`, `jumlah_anggota`, `tahun_berdiri`, `status_aktif`, `created_at`) VALUES
(1, 'Banjarnegara', 'Ampelsari', 'Poktan', 'Sri Rejeki', '33.04.01.001', 'SK-DESA/2021/04', 'Slamet Widodo', '081234567891', 'Madya', 'Tanaman Pangan', 35, 2018, 'Aktif', '2026-10-06 16:06:30'),
(2, 'Purwanegara', 'Danaraja', 'Gapoktan', 'Tani Makmur', '33.04.14.010', 'SK-BUPATI/2020/12', 'H. Sukardi', '081345678902', 'Utama', 'Tanaman Pangan', 180, 2012, 'Aktif', '2026-10-06 16:06:30'),
(3, 'Karangkobar', 'Ambal', 'KWT', 'Melati Asri', '33.04.06.005', 'SK-KADES/2022/08', 'Siti Rahayu', '081567890123', 'Lanjut', 'Hortikultura', 25, 2020, 'Aktif', '2026-10-06 16:06:30'),
(4, 'Batur', 'Dieng Kulon', 'Poktan', 'Dieng Lestari', '33.04.03.015', 'SK-DESA/2019/02', 'Bambang Sutrisno', '082134567890', 'Madya', 'Hortikultura', 42, 2015, 'Aktif', '2026-10-06 16:06:30'),
(5, 'Mandiraja', 'Kertayasa', 'Poktan', 'Sumber Pangan', '33.04.08.020', 'SK-DESA/2021/11', 'Sugeng Wardoyo', '085234567811', 'Lanjut', 'Tanaman Pangan', 30, 2019, 'Aktif', '2026-10-06 16:06:30');

CREATE TABLE `kelembagaan_perikanan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kecamatan` varchar(50) NOT NULL,
  `desa` varchar(100) NOT NULL,
  `jenis_lembaga` enum('Pokdakan','Poklahsar','Pokmaswas') NOT NULL DEFAULT 'Pokdakan',
  `nama_kelompok` varchar(150) NOT NULL,
  `id_kusuka` varchar(50) DEFAULT NULL,
  `nama_ketua` varchar(100) NOT NULL,
  `kontak_hp` varchar(30) DEFAULT NULL,
  `komoditas_utama` varchar(100) DEFAULT 'Ikan Air Tawar',
  `jumlah_anggota` int(11) DEFAULT 0,
  `kelas_kemampuan` enum('Pemula','Madya','Utama','Belum Dinilai') DEFAULT 'Belum Dinilai',
  `status_aktif` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_kecamatan` (`kecamatan`),
  KEY `idx_jenis` (`jenis_lembaga`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `kelembagaan_perikanan` (`id`, `kecamatan`, `desa`, `jenis_lembaga`, `nama_kelompok`, `id_kusuka`, `nama_ketua`, `kontak_hp`, `komoditas_utama`, `jumlah_anggota`, `kelas_kemampuan`, `status_aktif`, `created_at`) VALUES
(1, 'Madukara', 'Kutayasa', 'Pokdakan', 'Mina Barokah', 'KSK-3304-001', 'Supardi', '081298765431', 'Gurami & Nila', 20, 'Madya', 'Aktif', '2026-10-06 16:06:30'),
(2, 'Purwareja Klampok', 'Klampok', 'Pokdakan', 'Mina Mandiri', 'KSK-3304-012', 'Ahmad Fauzi', '081387654321', 'Lele Sangkuriang', 15, '', 'Aktif', '2026-10-06 16:06:30'),
(3, 'Wanadadi', 'Medayu', 'Poklahsar', 'Ikan Barokah', 'KSK-3304-025', 'Tri Wahyuni', '081576543210', 'Abon & Keripik Ikan', 12, 'Pemula', 'Aktif', '2026-10-06 16:06:30'),
(4, 'Bawang', 'Masaran', 'Pokmaswas', 'Mina Lestari', 'KSK-3304-030', 'Joko Prasetyo', '082165432109', 'Konservasi Perairan Umum', 18, 'Madya', 'Aktif', '2026-10-06 16:06:30');

CREATE TABLE `kelembagaan_juleha` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_lengkap` varchar(150) NOT NULL,
  `nik` varchar(20) DEFAULT NULL,
  `kecamatan` varchar(50) NOT NULL,
  `desa` varchar(100) NOT NULL,
  `no_sertifikat_halal` varchar(100) DEFAULT NULL,
  `lembaga_penerbit` varchar(100) DEFAULT 'BNSP / Lembaga Sertifikasi Halal',
  `unit_tugas` varchar(150) NOT NULL,
  `status_sertifikasi` enum('Tersertifikasi','Dalam Pelatihan','Masa Berlaku Habis') DEFAULT 'Tersertifikasi',
  `tahun_kelulusan` year(4) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_kecamatan` (`kecamatan`),
  KEY `idx_status` (`status_sertifikasi`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `kelembagaan_juleha` (`id`, `nama_lengkap`, `nik`, `kecamatan`, `desa`, `no_sertifikat_halal`, `lembaga_penerbit`, `unit_tugas`, `status_sertifikasi`, `tahun_kelulusan`, `created_at`) VALUES
(1, 'Ahmad Subhan', '3304011205850001', 'Banjarnegara', 'Parakancanggah', 'BNSP-JLH-3304-2023-01', 'LSP Juleha Indonesia / BNSP', 'RPH Banjarnegara', 'Tersertifikasi', 2023, '2026-10-06 16:06:30'),
(2, 'Muhammad Rois', '3304141508900003', 'Purwanegara', 'Kalipelus', 'BNSP-JLH-3304-2024-05', 'LSP Halal Indonesia', 'RPU Mandiraja', 'Tersertifikasi', 2024, '2026-10-06 16:06:30'),
(3, 'Hasan Basri', '3304062001880002', 'Karangkobar', 'Karangkobar', 'KEMENAG-HALAL-2023-88', 'Kemenag RI & MUI', 'Kios Daging Pasar Karangkobar', 'Tersertifikasi', 2023, '2026-10-06 16:06:30'),
(4, 'Wahyu Hidayat', '3304151004950004', 'Purwareja Klampok', 'Klampok', 'BNSP-JLH-3304-2025-02', 'LSP Juleha Indonesia', 'Pasar Rakyat Klampok', 'Dalam Pelatihan', 2025, '2026-10-06 16:06:30');

CREATE TABLE `kelembagaan_p4s` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_p4s` varchar(150) NOT NULL,
  `pengelola` varchar(100) NOT NULL,
  `kecamatan` varchar(50) NOT NULL,
  `desa` varchar(100) NOT NULL,
  `bidang_kejuruan` varchar(150) NOT NULL,
  `klasifikasi_akreditasi` enum('Pratama','Madya','Utama','Belum Terakreditasi') DEFAULT 'Pratama',
  `no_register_bppsdmp` varchar(100) DEFAULT NULL,
  `kontak` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_kecamatan` (`kecamatan`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `kelembagaan_p4s` (`id`, `nama_p4s`, `pengelola`, `kecamatan`, `desa`, `bidang_kejuruan`, `klasifikasi_akreditasi`, `no_register_bppsdmp`, `kontak`, `created_at`) VALUES
(1, 'P4S Tani Jaya Mandiri', 'H. Mulyono', 'Batur', 'Batur', 'Hortikultura Kentang & Sayuran Ramah Lingkungan', 'Madya', '033/P4S/BPPSDMP/2021', '081234567890', '2026-10-06 16:06:30'),
(2, 'P4S Makmur Abadi', 'Sutrisno', 'Mandiraja', 'Kertayasa', 'Peternakan Kambing Perah & Pengolahan Susu', 'Pratama', '045/P4S/BPPSDMP/2022', '081398765432', '2026-10-06 16:06:30');

CREATE TABLE `kelembagaan_upja` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_upja` varchar(150) NOT NULL,
  `manajer` varchar(100) NOT NULL,
  `kecamatan` varchar(50) NOT NULL,
  `desa` varchar(100) NOT NULL,
  `gapoktan_induk` varchar(150) DEFAULT NULL,
  `jenis_alsintan_dikelola` varchar(255) NOT NULL,
  `jumlah_alsintan` int(11) DEFAULT 0,
  `status_operasional` enum('Aktif Beroperasi','Perlu Perbaikan','Tidak Aktif') DEFAULT 'Aktif Beroperasi',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_kecamatan` (`kecamatan`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `kelembagaan_upja` (`id`, `nama_upja`, `manajer`, `kecamatan`, `desa`, `gapoktan_induk`, `jenis_alsintan_dikelola`, `jumlah_alsintan`, `status_operasional`, `created_at`) VALUES
(1, 'UPJA Berkah Tani', 'Sugeng Riyadi', 'Purwanegara', 'Mertasari', 'Gapoktan Tani Makmur', 'Traktor Roda 4 (2 unit), Combine Harvester (1 unit), Transplanter (2 unit), Pompa Air (4 unit)', 9, 'Aktif Beroperasi', '2026-10-06 16:06:30'),
(2, 'UPJA Subur Makmur', 'Waryono', 'Rakit', 'Rakit', 'Gapoktan Sumber Rejeki', 'Traktor Roda 2 (4 unit), Power Thresher (2 unit), Pompa Air (3 unit)', 9, 'Aktif Beroperasi', '2026-10-06 16:06:30');


SET FOREIGN_KEY_CHECKS = 1;
-- SELESAI SINKRONISASI
