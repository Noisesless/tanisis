-- =========================================================================
-- PRODUCTION PATCH: NORMALISASI RELASIONAL DESA & KECAMATAN
-- Generated: 2026-10-09T10:28:51.796Z
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Drop tabel usang fsva_indikator_kabupaten
DROP TABLE IF EXISTS `fsva_indikator_kabupaten`;

-- 2. Buat tabel activity_logs jika belum ada
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tambah kolom pada tabel kecamatan & desa
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'kecamatan' AND COLUMN_NAME = 'kode');
SET @query := IF(@exist = 0, 'ALTER TABLE `kecamatan` ADD COLUMN `kode` varchar(20) DEFAULT NULL AFTER `id`', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'desa' AND COLUMN_NAME = 'kode');
SET @query := IF(@exist = 0, 'ALTER TABLE `desa` ADD COLUMN `kode` varchar(20) DEFAULT NULL AFTER `id`', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'desa' AND COLUMN_NAME = 'tipe');
SET @query := IF(@exist = 0, 'ALTER TABLE `desa` ADD COLUMN `tipe` enum(\'Desa\',\'Kelurahan\') DEFAULT \'Desa\' AFTER `nama`', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 4. Update data kode kecamatan
UPDATE `kecamatan` SET `kode` = '3304090' WHERE `id` = 1;
UPDATE `kecamatan` SET `kode` = '3304060' WHERE `id` = 2;
UPDATE `kecamatan` SET `kode` = '3304160' WHERE `id` = 3;
UPDATE `kecamatan` SET `kode` = '3304050' WHERE `id` = 4;
UPDATE `kecamatan` SET `kode` = '3304180' WHERE `id` = 5;
UPDATE `kecamatan` SET `kode` = '3304130' WHERE `id` = 6;
UPDATE `kecamatan` SET `kode` = '3304080' WHERE `id` = 7;
UPDATE `kecamatan` SET `kode` = '3304030' WHERE `id` = 8;
UPDATE `kecamatan` SET `kode` = '3304061' WHERE `id` = 9;
UPDATE `kecamatan` SET `kode` = '3304140' WHERE `id` = 10;
UPDATE `kecamatan` SET `kode` = '3304181' WHERE `id` = 11;
UPDATE `kecamatan` SET `kode` = '3304150' WHERE `id` = 12;
UPDATE `kecamatan` SET `kode` = '3304120' WHERE `id` = 13;
UPDATE `kecamatan` SET `kode` = '3304040' WHERE `id` = 14;
UPDATE `kecamatan` SET `kode` = '3304020' WHERE `id` = 15;
UPDATE `kecamatan` SET `kode` = '3304110' WHERE `id` = 16;
UPDATE `kecamatan` SET `kode` = '3304070' WHERE `id` = 17;
UPDATE `kecamatan` SET `kode` = '3304010' WHERE `id` = 18;
UPDATE `kecamatan` SET `kode` = '3304100' WHERE `id` = 19;
UPDATE `kecamatan` SET `kode` = '3304170' WHERE `id` = 20;

-- 5. Update data kode dan tipe desa
UPDATE `desa` SET `kode` = '3304090002', `tipe` = 'Desa' WHERE `id` = 1;
UPDATE `desa` SET `kode` = '3304090003', `tipe` = 'Desa' WHERE `id` = 2;
UPDATE `desa` SET `kode` = '3304090016', `tipe` = 'Desa' WHERE `id` = 3;
UPDATE `desa` SET `kode` = '3304090006', `tipe` = 'Desa' WHERE `id` = 4;
UPDATE `desa` SET `kode` = '3304090001', `tipe` = 'Desa' WHERE `id` = 5;
UPDATE `desa` SET `kode` = '3304090012', `tipe` = 'Desa' WHERE `id` = 6;
UPDATE `desa` SET `kode` = '3304090011', `tipe` = 'Desa' WHERE `id` = 7;
UPDATE `desa` SET `kode` = '3304090005', `tipe` = 'Desa' WHERE `id` = 8;
UPDATE `desa` SET `kode` = '3304090015', `tipe` = 'Desa' WHERE `id` = 9;
UPDATE `desa` SET `kode` = '3304090008', `tipe` = 'Desa' WHERE `id` = 10;
UPDATE `desa` SET `kode` = '3304090010', `tipe` = 'Desa' WHERE `id` = 11;
UPDATE `desa` SET `kode` = '3304090014', `tipe` = 'Desa' WHERE `id` = 12;
UPDATE `desa` SET `kode` = '3304090004', `tipe` = 'Desa' WHERE `id` = 13;
UPDATE `desa` SET `kode` = '3304090007', `tipe` = 'Desa' WHERE `id` = 14;
UPDATE `desa` SET `kode` = '3304090017', `tipe` = 'Desa' WHERE `id` = 15;
UPDATE `desa` SET `kode` = '3304090013', `tipe` = 'Desa' WHERE `id` = 16;
UPDATE `desa` SET `kode` = '3304090009', `tipe` = 'Desa' WHERE `id` = 17;
UPDATE `desa` SET `kode` = '3304060008', `tipe` = 'Desa' WHERE `id` = 18;
UPDATE `desa` SET `kode` = '3304060010', `tipe` = 'Desa' WHERE `id` = 19;
UPDATE `desa` SET `kode` = '3304060007', `tipe` = 'Kelurahan' WHERE `id` = 20;
UPDATE `desa` SET `kode` = '3304060017', `tipe` = 'Kelurahan' WHERE `id` = 21;
UPDATE `desa` SET `kode` = '3304060015', `tipe` = 'Kelurahan' WHERE `id` = 22;
UPDATE `desa` SET `kode` = '3304060016', `tipe` = 'Kelurahan' WHERE `id` = 23;
UPDATE `desa` SET `kode` = '3304060013', `tipe` = 'Kelurahan' WHERE `id` = 24;
UPDATE `desa` SET `kode` = '3304060019', `tipe` = 'Kelurahan' WHERE `id` = 25;
UPDATE `desa` SET `kode` = '3304060014', `tipe` = 'Kelurahan' WHERE `id` = 26;
UPDATE `desa` SET `kode` = '3304060012', `tipe` = 'Kelurahan' WHERE `id` = 27;
UPDATE `desa` SET `kode` = '3304060018', `tipe` = 'Kelurahan' WHERE `id` = 28;
UPDATE `desa` SET `kode` = '3304060011', `tipe` = 'Desa' WHERE `id` = 29;
UPDATE `desa` SET `kode` = '3304060009', `tipe` = 'Desa' WHERE `id` = 30;
UPDATE `desa` SET `kode` = '3304160004', `tipe` = 'Desa' WHERE `id` = 31;
UPDATE `desa` SET `kode` = '3304160001', `tipe` = 'Desa' WHERE `id` = 32;
UPDATE `desa` SET `kode` = '3304160005', `tipe` = 'Desa' WHERE `id` = 33;
UPDATE `desa` SET `kode` = '3304160006', `tipe` = 'Desa' WHERE `id` = 34;
UPDATE `desa` SET `kode` = '3304160007', `tipe` = 'Desa' WHERE `id` = 35;
UPDATE `desa` SET `kode` = '3304160008', `tipe` = 'Desa' WHERE `id` = 36;
UPDATE `desa` SET `kode` = '3304160003', `tipe` = 'Desa' WHERE `id` = 37;
UPDATE `desa` SET `kode` = '3304160002', `tipe` = 'Desa' WHERE `id` = 38;
UPDATE `desa` SET `kode` = '3304050018', `tipe` = 'Desa' WHERE `id` = 39;
UPDATE `desa` SET `kode` = '3304050017', `tipe` = 'Desa' WHERE `id` = 40;
UPDATE `desa` SET `kode` = '3304050015', `tipe` = 'Desa' WHERE `id` = 41;
UPDATE `desa` SET `kode` = '3304050019', `tipe` = 'Desa' WHERE `id` = 42;
UPDATE `desa` SET `kode` = '3304050009', `tipe` = 'Desa' WHERE `id` = 43;
UPDATE `desa` SET `kode` = '3304050020', `tipe` = 'Desa' WHERE `id` = 44;
UPDATE `desa` SET `kode` = '3304050016', `tipe` = 'Desa' WHERE `id` = 45;
UPDATE `desa` SET `kode` = '3304050002', `tipe` = 'Desa' WHERE `id` = 46;
UPDATE `desa` SET `kode` = '3304050007', `tipe` = 'Desa' WHERE `id` = 47;
UPDATE `desa` SET `kode` = '3304050005', `tipe` = 'Desa' WHERE `id` = 48;
UPDATE `desa` SET `kode` = '3304050014', `tipe` = 'Desa' WHERE `id` = 49;
UPDATE `desa` SET `kode` = '3304050012', `tipe` = 'Desa' WHERE `id` = 50;
UPDATE `desa` SET `kode` = '3304050021', `tipe` = 'Desa' WHERE `id` = 51;
UPDATE `desa` SET `kode` = '3304050013', `tipe` = 'Desa' WHERE `id` = 52;
UPDATE `desa` SET `kode` = '3304050001', `tipe` = 'Desa' WHERE `id` = 53;
UPDATE `desa` SET `kode` = '3304050010', `tipe` = 'Desa' WHERE `id` = 54;
UPDATE `desa` SET `kode` = '3304050008', `tipe` = 'Desa' WHERE `id` = 55;
UPDATE `desa` SET `kode` = '3304050006', `tipe` = 'Desa' WHERE `id` = 56;
UPDATE `desa` SET `kode` = '3304180004', `tipe` = 'Desa' WHERE `id` = 57;
UPDATE `desa` SET `kode` = '3304180020', `tipe` = 'Desa' WHERE `id` = 58;
UPDATE `desa` SET `kode` = '3304180019', `tipe` = 'Desa' WHERE `id` = 59;
UPDATE `desa` SET `kode` = '3304180012', `tipe` = 'Desa' WHERE `id` = 60;
UPDATE `desa` SET `kode` = '3304180006', `tipe` = 'Desa' WHERE `id` = 61;
UPDATE `desa` SET `kode` = '3304180007', `tipe` = 'Desa' WHERE `id` = 62;
UPDATE `desa` SET `kode` = '3304180022', `tipe` = 'Desa' WHERE `id` = 63;
UPDATE `desa` SET `kode` = '3304180024', `tipe` = 'Desa' WHERE `id` = 64;
UPDATE `desa` SET `kode` = '3304180009', `tipe` = 'Desa' WHERE `id` = 65;
UPDATE `desa` SET `kode` = '3304180011', `tipe` = 'Desa' WHERE `id` = 66;
UPDATE `desa` SET `kode` = '3304180023', `tipe` = 'Desa' WHERE `id` = 67;
UPDATE `desa` SET `kode` = '3304180005', `tipe` = 'Desa' WHERE `id` = 68;
UPDATE `desa` SET `kode` = '3304180010', `tipe` = 'Desa' WHERE `id` = 69;
UPDATE `desa` SET `kode` = '3304180018', `tipe` = 'Desa' WHERE `id` = 70;
UPDATE `desa` SET `kode` = '3304180008', `tipe` = 'Desa' WHERE `id` = 71;
UPDATE `desa` SET `kode` = '3304180021', `tipe` = 'Desa' WHERE `id` = 72;
UPDATE `desa` SET `kode` = '3304130006', `tipe` = 'Desa' WHERE `id` = 73;
UPDATE `desa` SET `kode` = '3304130011', `tipe` = 'Desa' WHERE `id` = 74;
UPDATE `desa` SET `kode` = '3304130003', `tipe` = 'Desa' WHERE `id` = 75;
UPDATE `desa` SET `kode` = '3304130010', `tipe` = 'Desa' WHERE `id` = 76;
UPDATE `desa` SET `kode` = '3304130009', `tipe` = 'Desa' WHERE `id` = 77;
UPDATE `desa` SET `kode` = '3304130012', `tipe` = 'Desa' WHERE `id` = 78;
UPDATE `desa` SET `kode` = '3304130013', `tipe` = 'Desa' WHERE `id` = 79;
UPDATE `desa` SET `kode` = '3304130007', `tipe` = 'Desa' WHERE `id` = 80;
UPDATE `desa` SET `kode` = '3304130008', `tipe` = 'Desa' WHERE `id` = 81;
UPDATE `desa` SET `kode` = '3304130002', `tipe` = 'Desa' WHERE `id` = 82;
UPDATE `desa` SET `kode` = '3304130004', `tipe` = 'Desa' WHERE `id` = 83;
UPDATE `desa` SET `kode` = '3304130005', `tipe` = 'Desa' WHERE `id` = 84;
UPDATE `desa` SET `kode` = '3304130001', `tipe` = 'Desa' WHERE `id` = 85;
UPDATE `desa` SET `kode` = '3304080003', `tipe` = 'Desa' WHERE `id` = 86;
UPDATE `desa` SET `kode` = '3304080015', `tipe` = 'Desa' WHERE `id` = 87;
UPDATE `desa` SET `kode` = '3304080011', `tipe` = 'Desa' WHERE `id` = 88;
UPDATE `desa` SET `kode` = '3304080004', `tipe` = 'Desa' WHERE `id` = 89;
UPDATE `desa` SET `kode` = '3304080019', `tipe` = 'Desa' WHERE `id` = 90;
UPDATE `desa` SET `kode` = '3304080018', `tipe` = 'Desa' WHERE `id` = 91;
UPDATE `desa` SET `kode` = '3304080013', `tipe` = 'Desa' WHERE `id` = 92;
UPDATE `desa` SET `kode` = '3304080002', `tipe` = 'Kelurahan' WHERE `id` = 93;
UPDATE `desa` SET `kode` = '3304080001', `tipe` = 'Kelurahan' WHERE `id` = 94;
UPDATE `desa` SET `kode` = '3304080006', `tipe` = 'Desa' WHERE `id` = 95;
UPDATE `desa` SET `kode` = '3304080010', `tipe` = 'Desa' WHERE `id` = 96;
UPDATE `desa` SET `kode` = '3304080012', `tipe` = 'Desa' WHERE `id` = 97;
UPDATE `desa` SET `kode` = '3304080005', `tipe` = 'Desa' WHERE `id` = 98;
UPDATE `desa` SET `kode` = '3304080020', `tipe` = 'Desa' WHERE `id` = 99;
UPDATE `desa` SET `kode` = '3304080007', `tipe` = 'Desa' WHERE `id` = 100;
UPDATE `desa` SET `kode` = '3304080009', `tipe` = 'Desa' WHERE `id` = 101;
UPDATE `desa` SET `kode` = '3304080016', `tipe` = 'Desa' WHERE `id` = 102;
UPDATE `desa` SET `kode` = '3304080017', `tipe` = 'Desa' WHERE `id` = 103;
UPDATE `desa` SET `kode` = '3304080014', `tipe` = 'Desa' WHERE `id` = 104;
UPDATE `desa` SET `kode` = '3304080008', `tipe` = 'Desa' WHERE `id` = 105;
UPDATE `desa` SET `kode` = '3304030010', `tipe` = 'Desa' WHERE `id` = 106;
UPDATE `desa` SET `kode` = '3304030015', `tipe` = 'Desa' WHERE `id` = 107;
UPDATE `desa` SET `kode` = '3304030012', `tipe` = 'Desa' WHERE `id` = 108;
UPDATE `desa` SET `kode` = '3304030002', `tipe` = 'Desa' WHERE `id` = 109;
UPDATE `desa` SET `kode` = '3304030006', `tipe` = 'Desa' WHERE `id` = 110;
UPDATE `desa` SET `kode` = '3304030004', `tipe` = 'Desa' WHERE `id` = 111;
UPDATE `desa` SET `kode` = '3304030007', `tipe` = 'Desa' WHERE `id` = 112;
UPDATE `desa` SET `kode` = '3304030003', `tipe` = 'Desa' WHERE `id` = 113;
UPDATE `desa` SET `kode` = '3304030011', `tipe` = 'Desa' WHERE `id` = 114;
UPDATE `desa` SET `kode` = '3304030009', `tipe` = 'Desa' WHERE `id` = 115;
UPDATE `desa` SET `kode` = '3304030008', `tipe` = 'Desa' WHERE `id` = 116;
UPDATE `desa` SET `kode` = '3304030016', `tipe` = 'Desa' WHERE `id` = 117;
UPDATE `desa` SET `kode` = '3304030014', `tipe` = 'Desa' WHERE `id` = 118;
UPDATE `desa` SET `kode` = '3304030001', `tipe` = 'Desa' WHERE `id` = 119;
UPDATE `desa` SET `kode` = '3304030013', `tipe` = 'Desa' WHERE `id` = 120;
UPDATE `desa` SET `kode` = '3304030005', `tipe` = 'Desa' WHERE `id` = 121;
UPDATE `desa` SET `kode` = '3304061001', `tipe` = 'Desa' WHERE `id` = 122;
UPDATE `desa` SET `kode` = '3304061008', `tipe` = 'Desa' WHERE `id` = 123;
UPDATE `desa` SET `kode` = '3304061006', `tipe` = 'Desa' WHERE `id` = 124;
UPDATE `desa` SET `kode` = '3304061003', `tipe` = 'Desa' WHERE `id` = 125;
UPDATE `desa` SET `kode` = '3304061002', `tipe` = 'Desa' WHERE `id` = 126;
UPDATE `desa` SET `kode` = '3304061007', `tipe` = 'Desa' WHERE `id` = 127;
UPDATE `desa` SET `kode` = '3304061005', `tipe` = 'Desa' WHERE `id` = 128;
UPDATE `desa` SET `kode` = '3304061004', `tipe` = 'Desa' WHERE `id` = 129;
UPDATE `desa` SET `kode` = '3304061009', `tipe` = 'Desa' WHERE `id` = 130;
UPDATE `desa` SET `kode` = '3304140002', `tipe` = 'Desa' WHERE `id` = 131;
UPDATE `desa` SET `kode` = '3304140015', `tipe` = 'Desa' WHERE `id` = 132;
UPDATE `desa` SET `kode` = '3304140007', `tipe` = 'Desa' WHERE `id` = 133;
UPDATE `desa` SET `kode` = '3304140009', `tipe` = 'Desa' WHERE `id` = 134;
UPDATE `desa` SET `kode` = '3304140004', `tipe` = 'Desa' WHERE `id` = 135;
UPDATE `desa` SET `kode` = '3304140011', `tipe` = 'Desa' WHERE `id` = 136;
UPDATE `desa` SET `kode` = '3304140012', `tipe` = 'Desa' WHERE `id` = 137;
UPDATE `desa` SET `kode` = '3304140008', `tipe` = 'Desa' WHERE `id` = 138;
UPDATE `desa` SET `kode` = '3304140003', `tipe` = 'Desa' WHERE `id` = 139;
UPDATE `desa` SET `kode` = '3304140014', `tipe` = 'Desa' WHERE `id` = 140;
UPDATE `desa` SET `kode` = '3304140006', `tipe` = 'Desa' WHERE `id` = 141;
UPDATE `desa` SET `kode` = '3304140001', `tipe` = 'Desa' WHERE `id` = 142;
UPDATE `desa` SET `kode` = '3304140013', `tipe` = 'Desa' WHERE `id` = 143;
UPDATE `desa` SET `kode` = '3304140010', `tipe` = 'Desa' WHERE `id` = 144;
UPDATE `desa` SET `kode` = '3304140005', `tipe` = 'Desa' WHERE `id` = 145;
UPDATE `desa` SET `kode` = '3304140016', `tipe` = 'Desa' WHERE `id` = 146;
UPDATE `desa` SET `kode` = '3304181003', `tipe` = 'Desa' WHERE `id` = 147;
UPDATE `desa` SET `kode` = '3304181007', `tipe` = 'Desa' WHERE `id` = 148;
UPDATE `desa` SET `kode` = '3304181002', `tipe` = 'Desa' WHERE `id` = 149;
UPDATE `desa` SET `kode` = '3304181005', `tipe` = 'Desa' WHERE `id` = 150;
UPDATE `desa` SET `kode` = '3304181006', `tipe` = 'Desa' WHERE `id` = 151;
UPDATE `desa` SET `kode` = '3304181004', `tipe` = 'Desa' WHERE `id` = 152;
UPDATE `desa` SET `kode` = '3304181001', `tipe` = 'Desa' WHERE `id` = 153;
UPDATE `desa` SET `kode` = '3304181008', `tipe` = 'Desa' WHERE `id` = 154;
UPDATE `desa` SET `kode` = '3304150007', `tipe` = 'Desa' WHERE `id` = 155;
UPDATE `desa` SET `kode` = '3304150002', `tipe` = 'Desa' WHERE `id` = 156;
UPDATE `desa` SET `kode` = '3304150009', `tipe` = 'Desa' WHERE `id` = 157;
UPDATE `desa` SET `kode` = '3304150004', `tipe` = 'Desa' WHERE `id` = 158;
UPDATE `desa` SET `kode` = '3304150010', `tipe` = 'Desa' WHERE `id` = 159;
UPDATE `desa` SET `kode` = '3304150014', `tipe` = 'Desa' WHERE `id` = 160;
UPDATE `desa` SET `kode` = '3304150017', `tipe` = 'Desa' WHERE `id` = 161;
UPDATE `desa` SET `kode` = '3304150001', `tipe` = 'Desa' WHERE `id` = 162;
UPDATE `desa` SET `kode` = '3304150015', `tipe` = 'Desa' WHERE `id` = 163;
UPDATE `desa` SET `kode` = '3304150006', `tipe` = 'Desa' WHERE `id` = 164;
UPDATE `desa` SET `kode` = '3304150005', `tipe` = 'Desa' WHERE `id` = 165;
UPDATE `desa` SET `kode` = '3304150013', `tipe` = 'Desa' WHERE `id` = 166;
UPDATE `desa` SET `kode` = '3304150012', `tipe` = 'Desa' WHERE `id` = 167;
UPDATE `desa` SET `kode` = '3304150016', `tipe` = 'Desa' WHERE `id` = 168;
UPDATE `desa` SET `kode` = '3304150008', `tipe` = 'Desa' WHERE `id` = 169;
UPDATE `desa` SET `kode` = '3304150011', `tipe` = 'Desa' WHERE `id` = 170;
UPDATE `desa` SET `kode` = '3304150003', `tipe` = 'Desa' WHERE `id` = 171;
UPDATE `desa` SET `kode` = '3304120005', `tipe` = 'Desa' WHERE `id` = 172;
UPDATE `desa` SET `kode` = '3304120006', `tipe` = 'Desa' WHERE `id` = 173;
UPDATE `desa` SET `kode` = '3304120010', `tipe` = 'Desa' WHERE `id` = 174;
UPDATE `desa` SET `kode` = '3304120012', `tipe` = 'Desa' WHERE `id` = 175;
UPDATE `desa` SET `kode` = '3304120008', `tipe` = 'Desa' WHERE `id` = 176;
UPDATE `desa` SET `kode` = '3304120009', `tipe` = 'Desa' WHERE `id` = 177;
UPDATE `desa` SET `kode` = '3304120011', `tipe` = 'Desa' WHERE `id` = 178;
UPDATE `desa` SET `kode` = '3304120016', `tipe` = 'Desa' WHERE `id` = 179;
UPDATE `desa` SET `kode` = '3304120014', `tipe` = 'Desa' WHERE `id` = 180;
UPDATE `desa` SET `kode` = '3304120007', `tipe` = 'Desa' WHERE `id` = 181;
UPDATE `desa` SET `kode` = '3304120013', `tipe` = 'Desa' WHERE `id` = 182;
UPDATE `desa` SET `kode` = '3304120001', `tipe` = 'Desa' WHERE `id` = 183;
UPDATE `desa` SET `kode` = '3304120003', `tipe` = 'Desa' WHERE `id` = 184;
UPDATE `desa` SET `kode` = '3304120004', `tipe` = 'Desa' WHERE `id` = 185;
UPDATE `desa` SET `kode` = '3304120015', `tipe` = 'Desa' WHERE `id` = 186;
UPDATE `desa` SET `kode` = '3304120017', `tipe` = 'Desa' WHERE `id` = 187;
UPDATE `desa` SET `kode` = '3304120002', `tipe` = 'Desa' WHERE `id` = 188;
UPDATE `desa` SET `kode` = '3304040013', `tipe` = 'Desa' WHERE `id` = 189;
UPDATE `desa` SET `kode` = '3304040010', `tipe` = 'Desa' WHERE `id` = 190;
UPDATE `desa` SET `kode` = '3304040003', `tipe` = 'Desa' WHERE `id` = 191;
UPDATE `desa` SET `kode` = '3304040011', `tipe` = 'Desa' WHERE `id` = 192;
UPDATE `desa` SET `kode` = '3304040001', `tipe` = 'Desa' WHERE `id` = 193;
UPDATE `desa` SET `kode` = '3304040004', `tipe` = 'Desa' WHERE `id` = 194;
UPDATE `desa` SET `kode` = '3304040009', `tipe` = 'Desa' WHERE `id` = 195;
UPDATE `desa` SET `kode` = '3304040005', `tipe` = 'Desa' WHERE `id` = 196;
UPDATE `desa` SET `kode` = '3304040006', `tipe` = 'Desa' WHERE `id` = 197;
UPDATE `desa` SET `kode` = '3304040007', `tipe` = 'Desa' WHERE `id` = 198;
UPDATE `desa` SET `kode` = '3304040002', `tipe` = 'Desa' WHERE `id` = 199;
UPDATE `desa` SET `kode` = '3304040008', `tipe` = 'Desa' WHERE `id` = 200;
UPDATE `desa` SET `kode` = '3304040012', `tipe` = 'Desa' WHERE `id` = 201;
UPDATE `desa` SET `kode` = '3304020005', `tipe` = 'Desa' WHERE `id` = 202;
UPDATE `desa` SET `kode` = '3304020007', `tipe` = 'Desa' WHERE `id` = 203;
UPDATE `desa` SET `kode` = '3304020008', `tipe` = 'Desa' WHERE `id` = 204;
UPDATE `desa` SET `kode` = '3304020002', `tipe` = 'Desa' WHERE `id` = 205;
UPDATE `desa` SET `kode` = '3304020006', `tipe` = 'Desa' WHERE `id` = 206;
UPDATE `desa` SET `kode` = '3304020004', `tipe` = 'Desa' WHERE `id` = 207;
UPDATE `desa` SET `kode` = '3304020001', `tipe` = 'Desa' WHERE `id` = 208;
UPDATE `desa` SET `kode` = '3304020003', `tipe` = 'Desa' WHERE `id` = 209;
UPDATE `desa` SET `kode` = '3304110004', `tipe` = 'Desa' WHERE `id` = 210;
UPDATE `desa` SET `kode` = '3304110009', `tipe` = 'Desa' WHERE `id` = 211;
UPDATE `desa` SET `kode` = '3304110010', `tipe` = 'Desa' WHERE `id` = 212;
UPDATE `desa` SET `kode` = '3304110002', `tipe` = 'Desa' WHERE `id` = 213;
UPDATE `desa` SET `kode` = '3304110005', `tipe` = 'Desa' WHERE `id` = 214;
UPDATE `desa` SET `kode` = '3304110008', `tipe` = 'Desa' WHERE `id` = 215;
UPDATE `desa` SET `kode` = '3304110007', `tipe` = 'Desa' WHERE `id` = 216;
UPDATE `desa` SET `kode` = '3304110011', `tipe` = 'Desa' WHERE `id` = 217;
UPDATE `desa` SET `kode` = '3304110003', `tipe` = 'Desa' WHERE `id` = 218;
UPDATE `desa` SET `kode` = '3304110001', `tipe` = 'Desa' WHERE `id` = 219;
UPDATE `desa` SET `kode` = '3304110006', `tipe` = 'Desa' WHERE `id` = 220;
UPDATE `desa` SET `kode` = '3304070007', `tipe` = 'Desa' WHERE `id` = 221;
UPDATE `desa` SET `kode` = '3304070006', `tipe` = 'Desa' WHERE `id` = 222;
UPDATE `desa` SET `kode` = '3304070009', `tipe` = 'Desa' WHERE `id` = 223;
UPDATE `desa` SET `kode` = '3304070011', `tipe` = 'Desa' WHERE `id` = 224;
UPDATE `desa` SET `kode` = '3304070015', `tipe` = 'Kelurahan' WHERE `id` = 225;
UPDATE `desa` SET `kode` = '3304070010', `tipe` = 'Desa' WHERE `id` = 226;
UPDATE `desa` SET `kode` = '3304070003', `tipe` = 'Desa' WHERE `id` = 227;
UPDATE `desa` SET `kode` = '3304070008', `tipe` = 'Desa' WHERE `id` = 228;
UPDATE `desa` SET `kode` = '3304070001', `tipe` = 'Desa' WHERE `id` = 229;
UPDATE `desa` SET `kode` = '3304070005', `tipe` = 'Desa' WHERE `id` = 230;
UPDATE `desa` SET `kode` = '3304070002', `tipe` = 'Desa' WHERE `id` = 231;
UPDATE `desa` SET `kode` = '3304070013', `tipe` = 'Desa' WHERE `id` = 232;
UPDATE `desa` SET `kode` = '3304070014', `tipe` = 'Desa' WHERE `id` = 233;
UPDATE `desa` SET `kode` = '3304070004', `tipe` = 'Desa' WHERE `id` = 234;
UPDATE `desa` SET `kode` = '3304070012', `tipe` = 'Desa' WHERE `id` = 235;
UPDATE `desa` SET `kode` = '3304010009', `tipe` = 'Desa' WHERE `id` = 236;
UPDATE `desa` SET `kode` = '3304010003', `tipe` = 'Desa' WHERE `id` = 237;
UPDATE `desa` SET `kode` = '3304010008', `tipe` = 'Desa' WHERE `id` = 238;
UPDATE `desa` SET `kode` = '3304010012', `tipe` = 'Desa' WHERE `id` = 239;
UPDATE `desa` SET `kode` = '3304010006', `tipe` = 'Desa' WHERE `id` = 240;
UPDATE `desa` SET `kode` = '3304010007', `tipe` = 'Desa' WHERE `id` = 241;
UPDATE `desa` SET `kode` = '3304010010', `tipe` = 'Desa' WHERE `id` = 242;
UPDATE `desa` SET `kode` = '3304010015', `tipe` = 'Desa' WHERE `id` = 243;
UPDATE `desa` SET `kode` = '3304010011', `tipe` = 'Desa' WHERE `id` = 244;
UPDATE `desa` SET `kode` = '3304010014', `tipe` = 'Desa' WHERE `id` = 245;
UPDATE `desa` SET `kode` = '3304010002', `tipe` = 'Desa' WHERE `id` = 246;
UPDATE `desa` SET `kode` = '3304010004', `tipe` = 'Desa' WHERE `id` = 247;
UPDATE `desa` SET `kode` = '3304010005', `tipe` = 'Desa' WHERE `id` = 248;
UPDATE `desa` SET `kode` = '3304010001', `tipe` = 'Desa' WHERE `id` = 249;
UPDATE `desa` SET `kode` = '3304010013', `tipe` = 'Desa' WHERE `id` = 250;
UPDATE `desa` SET `kode` = '3304100007', `tipe` = 'Desa' WHERE `id` = 251;
UPDATE `desa` SET `kode` = '3304100010', `tipe` = 'Desa' WHERE `id` = 252;
UPDATE `desa` SET `kode` = '3304100003', `tipe` = 'Desa' WHERE `id` = 253;
UPDATE `desa` SET `kode` = '3304100006', `tipe` = 'Desa' WHERE `id` = 254;
UPDATE `desa` SET `kode` = '3304100002', `tipe` = 'Desa' WHERE `id` = 255;
UPDATE `desa` SET `kode` = '3304100011', `tipe` = 'Desa' WHERE `id` = 256;
UPDATE `desa` SET `kode` = '3304100008', `tipe` = 'Desa' WHERE `id` = 257;
UPDATE `desa` SET `kode` = '3304100009', `tipe` = 'Desa' WHERE `id` = 258;
UPDATE `desa` SET `kode` = '3304100001', `tipe` = 'Desa' WHERE `id` = 259;
UPDATE `desa` SET `kode` = '3304100004', `tipe` = 'Desa' WHERE `id` = 260;
UPDATE `desa` SET `kode` = '3304100005', `tipe` = 'Desa' WHERE `id` = 261;
UPDATE `desa` SET `kode` = '3304170011', `tipe` = 'Desa' WHERE `id` = 262;
UPDATE `desa` SET `kode` = '3304170003', `tipe` = 'Desa' WHERE `id` = 263;
UPDATE `desa` SET `kode` = '3304170006', `tipe` = 'Desa' WHERE `id` = 264;
UPDATE `desa` SET `kode` = '3304170014', `tipe` = 'Desa' WHERE `id` = 265;
UPDATE `desa` SET `kode` = '3304170002', `tipe` = 'Desa' WHERE `id` = 266;
UPDATE `desa` SET `kode` = '3304170016', `tipe` = 'Desa' WHERE `id` = 267;
UPDATE `desa` SET `kode` = '3304170007', `tipe` = 'Desa' WHERE `id` = 268;
UPDATE `desa` SET `kode` = '3304170015', `tipe` = 'Desa' WHERE `id` = 269;
UPDATE `desa` SET `kode` = '3304170004', `tipe` = 'Desa' WHERE `id` = 270;
UPDATE `desa` SET `kode` = '3304170005', `tipe` = 'Desa' WHERE `id` = 271;
UPDATE `desa` SET `kode` = '3304170017', `tipe` = 'Desa' WHERE `id` = 272;
UPDATE `desa` SET `kode` = '3304170010', `tipe` = 'Desa' WHERE `id` = 273;
UPDATE `desa` SET `kode` = '3304170008', `tipe` = 'Desa' WHERE `id` = 274;
UPDATE `desa` SET `kode` = '3304170001', `tipe` = 'Desa' WHERE `id` = 275;
UPDATE `desa` SET `kode` = '3304170012', `tipe` = 'Desa' WHERE `id` = 276;
UPDATE `desa` SET `kode` = '3304170013', `tipe` = 'Desa' WHERE `id` = 277;
UPDATE `desa` SET `kode` = '3304170009', `tipe` = 'Desa' WHERE `id` = 278;

-- 6. Buat tabel fsva_desa_indikator jika belum ada
CREATE TABLE IF NOT EXISTS `fsva_desa_indikator` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tahun` int(11) NOT NULL,
  `kecamatan_id` tinyint(3) unsigned NOT NULL,
  `desa_id` smallint(5) unsigned NOT NULL,
  `kode_kec` varchar(20) NOT NULL,
  `nama_kecamatan` varchar(100) NOT NULL,
  `kode_desa` varchar(20) NOT NULL,
  `nama_desa` varchar(100) NOT NULL,
  `object_id` int(11) NOT NULL,
  `luas_wilayah_ha` decimal(12,2) DEFAULT NULL,
  `jumlah_penduduk` int(11) DEFAULT NULL,
  `jumlah_rt` int(11) DEFAULT NULL,
  `kepadatan_penduduk` decimal(12,2) DEFAULT NULL,
  `luas_lahan_ha` decimal(12,2) DEFAULT NULL,
  `sarpras_pangan_unit` int(11) DEFAULT NULL,
  `penduduk_miskin_jiwa` int(11) DEFAULT NULL,
  `tanpa_akses` tinyint(1) DEFAULT 0,
  `rt_tanpa_air_bersih` int(11) DEFAULT NULL,
  `jumlah_nakes` int(11) DEFAULT NULL,
  `rasio_lahan` decimal(10,4) DEFAULT NULL,
  `rasio_sarana` decimal(10,4) DEFAULT NULL,
  `rasio_miskin` decimal(10,4) DEFAULT NULL,
  `rasio_air_bersih` decimal(10,4) DEFAULT NULL,
  `rasio_nakes` decimal(10,4) DEFAULT NULL,
  `ikp` decimal(6,2) DEFAULT NULL,
  `komposit` tinyint(4) DEFAULT NULL,
  `ikp_ranking` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_desa_tahun` (`kode_desa`,`tahun`),
  KEY `idx_tahun` (`tahun`),
  KEY `idx_obj` (`object_id`),
  KEY `idx_kec` (`nama_kecamatan`),
  KEY `idx_fsva_kec` (`kecamatan_id`),
  KEY `idx_fsva_desa` (`desa_id`),
  CONSTRAINT `fk_fsva_desa` FOREIGN KEY (`desa_id`) REFERENCES `desa` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fsva_kecamatan` FOREIGN KEY (`kecamatan_id`) REFERENCES `kecamatan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tambah kolom relasi di fsva_desa_indikator jika belum ada
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND COLUMN_NAME = 'kecamatan_id');
SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD COLUMN `kecamatan_id` tinyint(3) unsigned NOT NULL AFTER `tahun`', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND COLUMN_NAME = 'desa_id');
SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD COLUMN `desa_id` smallint(5) unsigned NOT NULL AFTER `kecamatan_id`', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 8. Isi/Perbarui data 278 desa ke fsva_desa_indikator
INSERT IGNORE INTO `fsva_desa_indikator` (`tahun`, `kecamatan_id`, `desa_id`, `kode_kec`, `nama_kecamatan`, `kode_desa`, `nama_desa`, `object_id`, `luas_wilayah_ha`, `jumlah_penduduk`, `jumlah_rt`, `kepadatan_penduduk`, `luas_lahan_ha`, `sarpras_pangan_unit`, `penduduk_miskin_jiwa`, `tanpa_akses`, `rt_tanpa_air_bersih`, `jumlah_nakes`, `rasio_lahan`, `rasio_sarana`, `rasio_miskin`, `rasio_air_bersih`, `rasio_nakes`, `ikp`, `komposit`, `ikp_ranking`) VALUES
(2024, 3, 33, '3304160', 'Batur', '3304160005', 'DIENG KULON', 197, 197, 2028, 1411, 1029.44, 222.76, 303, 429, 0, 0, 16, 0.1098, 0.2147, 0.2115, 0, 0.1231, 85.75, 6, 1),
(2024, 17, 230, '3304070', 'Sigaluh', '3304070005', 'RANDEGAN', 210, 108, 2507, 429, 2321.3, 53.62, 37, 232, 0, 3, 12, 0.0214, 0.0862, 0.0925, 0.007, 0.09, 80.65, 6, 2),
(2024, 2, 28, '3304060', 'Banjarnegara', '3304060018', 'WANGON', 223, 119.04, 3092, 1041, 2597.36, 41.2, 90, 334, 0, 4, 17, 0.0133, 0.0865, 0.108, 0.0038, 0.07, 80.37, 6, 3),
(2024, 8, 115, '3304030', 'Mandiraja', '3304030009', 'MANDIRAJA KULON', 34, 177.97, 6488, 2226, 3645.66, 72.01, 181, 59, 0, 2, 17, 0.0111, 0.0813, 0.0091, 0.0009, 0.1047, 80.1, 6, 4),
(2024, 2, 22, '3304060', 'Banjarnegara', '3304060015', 'KRANDEGAN', 229, 73.97, 6525, 2271, 8821.74, 12.17, 663, 621, 0, 30, 14, 0.0019, 0.2919, 0.0952, 0.0132, 0.0528, 79.67, 6, 5),
(2024, 2, 21, '3304060', 'Banjarnegara', '3304060017', 'KARANGTENGAH', 215, 120.32, 4320, 1460, 3590.49, 50.16, 286, 479, 0, 28, 17, 0.0116, 0.1959, 0.1109, 0.0192, 0.0708, 79.43, 6, 6),
(2024, 4, 39, '3304050', 'Bawang', '3304050018', 'BANDINGAN', 73, 130.09, 1721, 576, 1322.98, 32.3, 61, 317, 0, 6, 19, 0.0188, 0.1059, 0.1842, 0.0104, 0.0685, 79.14, 6, 7),
(2024, 2, 26, '3304060', 'Banjarnegara', '3304060014', 'SEMARANG', 224, 58.45, 5208, 1801, 8910.79, 22.27, 310, 900, 0, 15, 14, 0.0043, 0.1721, 0.1728, 0.0083, 0.0417, 78.96, 6, 8),
(2024, 2, 27, '3304060', 'Banjarnegara', '3304060012', 'SOKANANDI', 233, 215.74, 6522, 2191, 3023.15, 71.54, 264, 501, 0, 17, 14, 0.011, 0.1205, 0.0768, 0.0078, 0.1541, 77.95, 6, 9),
(2024, 20, 278, '3304170', 'Wanayasa', '3304170009', 'WANAYASA', 150, 602.09, 2482, 1663, 412.23, 326.93, 104, 510, 0, 2, 20, 0.1317, 0.0625, 0.2055, 0.0012, 0.301, 77.22, 6, 10),
(2024, 12, 155, '3304150', 'Pejawaran', '3304150007', 'BEJI', 145, 210.92, 1896, 396, 898.94, 173.31, 28, 811, 0, 6, 23, 0.0914, 0.0707, 0.4277, 0.0152, 0.0917, 76.83, 6, 11),
(2024, 7, 94, '3304080', 'Madukara', '3304080001', 'REJASA', 234, 171.11, 1755, 960, 1025.68, 40.94, 80, 490, 0, 9, 17, 0.0233, 0.0833, 0.2792, 0.0094, 0.1007, 76.13, 6, 12),
(2024, 4, 56, '3304050', 'Bawang', '3304050006', 'WIRAMASTRA', 36, 271.24, 3397, 1177, 1252.39, 184.96, 85, 614, 0, 1, 14, 0.0544, 0.0722, 0.1807, 0.0008, 0.1937, 76.03, 6, 13),
(2024, 19, 251, '3304100', 'Wanadadi', '3304100007', 'GUMINGSIR', 76, 146.5, 4573, 598, 3121.5, 97.67, 37, 132, 0, 4, 13, 0.0214, 0.0619, 0.0289, 0.0067, 0.1127, 76, 6, 14),
(2024, 17, 225, '3304070', 'Sigaluh', '3304070015', 'KALIBENDA', 231, 102, 1133, 662, 1110.78, 47.58, 35, 163, 0, 3, 20, 0.042, 0.0529, 0.1439, 0.0045, 0.051, 75.77, 6, 15),
(2024, 2, 20, '3304060', 'Banjarnegara', '3304060007', 'ARGASOKA', 217, 369.19, 5745, 1892, 1556.11, 123.31, 232, 901, 0, 1, 17, 0.0215, 0.1226, 0.1568, 0.0005, 0.2172, 75.72, 6, 16),
(2024, 7, 100, '3304080', 'Madukara', '3304080007', 'PEKAUMAN', 243, 184.75, 3211, 613, 1738.06, 98.8, 41, 365, 0, 19, 18, 0.0308, 0.0669, 0.1137, 0.031, 0.1026, 75.48, 6, 17),
(2024, 1, 8, '3304090', 'Banjarmangu', '3304090005', 'Kesenet', 18, 250, 3000, 800, 12, 100, 50, 400, 0, 10, 5, 0.5, 0.2, 0.1, 0.05, 0.01, 75.27, 6, 18),
(2024, 6, 82, '3304130', 'Karangkobar', '3304130002', 'PAWEDEN', 107, 383, 3062, 522, 799.48, 131.96, 47, 364, 0, 46, 20, 0.0431, 0.09, 0.1189, 0.0881, 0.1915, 75.23, 6, 19),
(2024, 13, 177, '3304120', 'Punggelan', '3304120009', 'KECEPIT', 90, 487.69, 2491, 2118, 510.78, 332.13, 97, 570, 0, 17, 20, 0.1333, 0.0458, 0.2288, 0.008, 0.2438, 74.82, 6, 20),
(2024, 2, 23, '3304060', 'Banjarnegara', '3304060016', 'KUTABANJARNEGARA', 230, 148.2, 11466, 3865, 7736.84, 15.73, 251, 1078, 0, 18, 17, 0.0014, 0.0649, 0.094, 0.0047, 0.0872, 74.44, 6, 21),
(2024, 5, 68, '3304180', 'Kalibening', '3304180005', 'SEMBAWA', 121, 395, 2892, 873, 732.15, 280.44, 39, 486, 0, 30, 28, 0.097, 0.0447, 0.168, 0.0344, 0.1411, 74.43, 6, 22),
(2024, 15, 208, '3304020', 'Purwareja Klampok', '3304020001', 'PURWAREJA', 20, 261.5, 9078, 3202, 3471.51, 57.38, 437, 1716, 0, 58, 15, 0.0063, 0.1365, 0.189, 0.0181, 0.1743, 74.23, 6, 23),
(2024, 17, 221, '3304070', 'Sigaluh', '3304070007', 'BANDINGAN', 213, 123, 2767, 640, 2249.59, 77.8, 36, 496, 0, 8, 20, 0.0281, 0.0563, 0.1793, 0.0125, 0.0615, 73.83, 6, 24),
(2024, 7, 95, '3304080', 'Madukara', '3304080006', 'KUTAYASA', 269, 128.65, 2161, 691, 1679.73, 62.67, 37, 359, 0, 1, 18, 0.029, 0.0535, 0.1661, 0.0014, 0.0715, 73.79, 6, 25),
(2024, 11, 148, '3304181', 'Pandanarum', '3304181007', 'LAWEN', 153, 638, 5832, 1686, 914.11, 428.17, 118, 690, 0, 84, 22, 0.0734, 0.07, 0.1183, 0.0498, 0.29, 73.25, 6, 26),
(2024, 2, 25, '3304060', 'Banjarnegara', '3304060019', 'SEMAMPIR', 226, 172.26, 4058, 1337, 2355.7, 52.28, 76, 399, 0, 7, 17, 0.0129, 0.0568, 0.0983, 0.0052, 0.1013, 73.22, 6, 27),
(2024, 12, 159, '3304150', 'Pejawaran', '3304150010', 'GEMBOL', 158, 229.1, 5687, 1006, 2482.31, 256.4, 61, 786, 0, 75, 23, 0.0451, 0.0606, 0.1382, 0.0746, 0.0996, 73.08, 6, 28),
(2024, 17, 224, '3304070', 'Sigaluh', '3304070011', 'KARANGMANGU', 220, 177, 2479, 291, 1400.56, 70.3, 14, 285, 0, 1, 20, 0.0284, 0.0481, 0.115, 0.0034, 0.0885, 72.94, 6, 29),
(2024, 2, 24, '3304060', 'Banjarnegara', '3304060013', 'PARAKANCANGGAH', 232, 173.4, 9106, 3010, 5251.41, 34.27, 205, 1133, 0, 60, 14, 0.0038, 0.0681, 0.1244, 0.0199, 0.1239, 72.89, 6, 30),
(2024, 12, 169, '3304150', 'Pejawaran', '3304150008', 'SEMANGKUNG', 196, 225.49, 3310, 615, 1467.95, 151.87, 34, 918, 0, 2, 23, 0.0459, 0.0553, 0.2773, 0.0033, 0.098, 72.63, 6, 31),
(2024, 20, 266, '3304170', 'Wanayasa', '3304170002', 'KARANGTENGAH', 101, 281.78, 3921, 622, 1391.51, 203.72, 26, 271, 0, 9, 20, 0.052, 0.0418, 0.0691, 0.0145, 0.1409, 72.52, 6, 32),
(2024, 12, 160, '3304150', 'Pejawaran', '3304150014', 'GIRITIRTA', 149, 248.37, 4595, 1046, 1850.08, 320.33, 41, 797, 0, 17, 23, 0.0697, 0.0392, 0.1734, 0.0163, 0.108, 72.51, 6, 33),
(2024, 4, 43, '3304050', 'Bawang', '3304050009', 'DEPOK', 50, 172.56, 1040, 357, 602.7, 80.36, 17, 151, 0, 26, 14, 0.0773, 0.0476, 0.1452, 0.0728, 0.1233, 72.48, 6, 34),
(2024, 4, 41, '3304050', 'Bawang', '3304050015', 'BINORONG', 65, 185.57, 5327, 1869, 2870.66, 91.25, 113, 1120, 0, 13, 19, 0.0171, 0.0605, 0.2102, 0.007, 0.0977, 72.24, 6, 35),
(2024, 18, 244, '3304010', 'Susukan', '3304010011', 'KEDAWUNG', 13, 264, 4485, 1488, 1698.86, 87.41, 136, 1929, 0, 1, 17, 0.0195, 0.0914, 0.4301, 0.0007, 0.1553, 72.15, 6, 36),
(2024, 16, 218, '3304110', 'Rakit', '3304110003', 'RAKIT', 51, 202.35, 5147, 1618, 2543.65, 79.35, 95, 786, 0, 13, 17, 0.0154, 0.0587, 0.1527, 0.008, 0.119, 72.11, 6, 37),
(2024, 8, 107, '3304030', 'Mandiraja', '3304030015', 'BLIMBING', 27, 97.56, 2724, 907, 2792.19, 72.54, 39, 258, 0, 20, 15, 0.0266, 0.043, 0.0947, 0.0221, 0.065, 71.97, 6, 38),
(2024, 12, 165, '3304150', 'Pejawaran', '3304150005', 'PEJAWARAN', 142, 502.91, 3042, 1397, 604.88, 318.69, 64, 913, 0, 2, 23, 0.1048, 0.0458, 0.3001, 0.0014, 0.2187, 71.9, 6, 39),
(2024, 17, 235, '3304070', 'Sigaluh', '3304070012', 'WANACIPTA', 225, 26, 1957, 174, 7526.92, 32.7, 6, 110, 0, 3, 20, 0.0167, 0.0345, 0.0562, 0.0172, 0.013, 71.84, 6, 40),
(2024, 18, 242, '3304010', 'Susukan', '3304010010', 'KARANGJATI', 11, 216, 4921, 1655, 2278.24, 61.5, 85, 372, 0, 3, 17, 0.0125, 0.0514, 0.0756, 0.0018, 0.1271, 71.81, 6, 41),
(2024, 4, 51, '3304050', 'Bawang', '3304050021', 'PUCANG', 273, 324.39, 6855, 2291, 2113.22, 118.6, 128, 505, 0, 9, 19, 0.0173, 0.0559, 0.0737, 0.0039, 0.1707, 71.79, 6, 42),
(2024, 7, 97, '3304080', 'Madukara', '3304080012', 'MADUKARA', 248, 247.75, 2731, 844, 1102.33, 159.26, 45, 808, 0, 3, 18, 0.0583, 0.0533, 0.2959, 0.0036, 0.1376, 71.74, 6, 43),
(2024, 5, 69, '3304180', 'Kalibening', '3304180010', 'SIDAKANGEN', 165, 568, 2977, 1104, 524.12, 150.86, 53, 281, 0, 16, 28, 0.0507, 0.048, 0.0944, 0.0145, 0.2029, 71.29, 6, 44),
(2024, 7, 92, '3304080', 'Madukara', '3304080013', 'KARANGANYAR', 247, 164.95, 2356, 353, 1428.33, 94.86, 13, 282, 0, 3, 18, 0.0403, 0.0368, 0.1197, 0.0085, 0.0916, 71.21, 6, 45),
(2024, 20, 262, '3304170', 'Wanayasa', '3304170011', 'BALUN', 171, 527.58, 4601, 1301, 872.1, 355.89, 44, 34, 0, 0, 20, 0.0774, 0.0338, 0.0074, 0, 0.2638, 71.18, 6, 46),
(2024, 4, 50, '3304050', 'Bawang', '3304050012', 'MASARAN', 61, 321.26, 3141, 1092, 977.73, 155.22, 71, 702, 0, 24, 14, 0.0494, 0.065, 0.2235, 0.022, 0.2295, 71.11, 6, 47),
(2024, 1, 2, '3304090', 'Banjarmangu', '3304090003', 'BANJARMANGU', 246, 138.29, 3092, 1167, 2235.88, 104.13, 51, 596, 0, 17, 20, 0.0337, 0.0437, 0.1928, 0.0146, 0.0691, 71.07, 5, 48),
(2024, 20, 267, '3304170', 'Wanayasa', '3304170016', 'KASIMPAR', 176, 567.14, 2308, 553, 406.95, 238.27, 26, 323, 0, 1, 16, 0.1032, 0.047, 0.1399, 0.0018, 0.3545, 70.87, 5, 49),
(2024, 1, 7, '3304090', 'Banjarmangu', '3304090011', 'KENDAGA', 256, 409, 2191, 1364, 535.7, 206.72, 77, 720, 0, 35, 17, 0.0944, 0.0565, 0.3286, 0.0257, 0.2406, 70.86, 5, 50),
(2024, 10, 138, '3304140', 'Pagentan', '3304140008', 'KAYUARES', 99, 203, 1264, 586, 622.66, 122.91, 21, 452, 0, 10, 19, 0.0972, 0.0358, 0.3576, 0.0171, 0.1068, 70.74, 5, 51),
(2024, 17, 223, '3304070', 'Sigaluh', '3304070009', 'GEMBONGAN', 227, 289, 3672, 1101, 1270.59, 241.63, 56, 800, 0, 64, 20, 0.0658, 0.0509, 0.2179, 0.0581, 0.1445, 70.71, 5, 52),
(2024, 8, 112, '3304030', 'Mandiraja', '3304030007', 'KEBAKALAN', 29, 86.39, 1650, 590, 1909.94, 32.13, 29, 385, 0, 9, 17, 0.0195, 0.0492, 0.2333, 0.0153, 0.0508, 70.68, 5, 53),
(2024, 19, 257, '3304100', 'Wanadadi', '3304100008', 'LINGGASARI', 82, 313.4, 3619, 1053, 1154.75, 117.49, 103, 1272, 0, 37, 13, 0.0325, 0.0978, 0.3515, 0.0351, 0.2411, 70.61, 5, 54),
(2024, 1, 3, '3304090', 'Banjarmangu', '3304090016', 'BEJI', 264, 338.4, 3028, 969, 894.8, 223.16, 38, 545, 0, 2, 17, 0.0737, 0.0392, 0.18, 0.0021, 0.1991, 70.56, 5, 55),
(2024, 5, 71, '3304180', 'Kalibening', '3304180008', 'SIRUKEM', 152, 214, 3029, 669, 1415.42, 170.59, 33, 1200, 0, 4, 28, 0.0563, 0.0493, 0.3962, 0.006, 0.0764, 70.56, 5, 56),
(2024, 19, 260, '3304100', 'Wanadadi', '3304100004', 'WANADADI', 81, 286.8, 4851, 1161, 1691.42, 24.54, 81, 955, 0, 25, 17, 0.0051, 0.0698, 0.1969, 0.0215, 0.1687, 70.48, 5, 57),
(2024, 3, 31, '3304160', 'Batur', '3304160004', 'BAKAL', 163, 485, 1984, 1236, 409.07, 219.69, 51, 422, 0, 4, 16, 0.1107, 0.0413, 0.2127, 0.0032, 0.3031, 70.46, 5, 58),
(2024, 20, 274, '3304170', 'Wanayasa', '3304170008', 'SUSUKAN', 132, 301.27, 2525, 791, 838.12, 235.23, 37, 800, 0, 43, 20, 0.0932, 0.0468, 0.3168, 0.0544, 0.1506, 70.41, 5, 59),
(2024, 8, 120, '3304030', 'Mandiraja', '3304030013', 'SIMBANG', 18, 158.5, 2644, 896, 1668.14, 78.4, 38, 346, 0, 15, 15, 0.0297, 0.0424, 0.1309, 0.0167, 0.1057, 70.39, 5, 60),
(2024, 10, 134, '3304140', 'Pagentan', '3304140009', 'KALITLAGA', 103, 189, 1940, 811, 1026.46, 157.04, 49, 524, 0, 110, 16, 0.0809, 0.0604, 0.2701, 0.1356, 0.1181, 70.39, 5, 61),
(2024, 7, 93, '3304080', 'Madukara', '3304080002', 'KENTENG', 237, 138.75, 2355, 997, 1697.33, 52.11, 51, 630, 0, 5, 17, 0.0221, 0.0512, 0.2675, 0.005, 0.0816, 70.19, 5, 62),
(2024, 5, 65, '3304180', 'Kalibening', '3304180009', 'KERTOSARI', 161, 539, 3846, 755, 713.54, 253.81, 28, 376, 0, 19, 28, 0.066, 0.0371, 0.0978, 0.0252, 0.1925, 70.14, 5, 63),
(2024, 1, 1, '3304090', 'Banjarmangu', '3304090002', 'BANJARKULON', 240, 152.03, 3922, 850, 2579.75, 84.33, 34, 658, 0, 2, 20, 0.0215, 0.04, 0.1678, 0.0024, 0.076, 70, 5, 64),
(2024, 12, 164, '3304150', 'Pejawaran', '3304150006', 'PEGUNDUNGAN', 140, 366.41, 3094, 567, 844.42, 249.62, 30, 782, 0, 50, 23, 0.0807, 0.0529, 0.2527, 0.0882, 0.1593, 69.99, 5, 65),
(2024, 8, 106, '3304030', 'Mandiraja', '3304030010', 'BANJENGAN', 25, 124.68, 2621, 906, 2102.13, 60.25, 30, 211, 0, 14, 17, 0.023, 0.0331, 0.0805, 0.0155, 0.0733, 69.85, 5, 66),
(2024, 19, 253, '3304100', 'Wanadadi', '3304100003', 'KARANGJAMBE', 80, 114.6, 6638, 741, 5792.32, 39.72, 34, 542, 0, 35, 17, 0.006, 0.0459, 0.0817, 0.0472, 0.0674, 69.71, 5, 67),
(2024, 14, 195, '3304040', 'Purwanegara', '3304040009', 'KUTAWULUH', 54, 386.04, 3148, 1156, 815.46, 149.38, 84, 923, 0, 27, 14, 0.0475, 0.0727, 0.2932, 0.0234, 0.2757, 69.69, 5, 68),
(2024, 18, 243, '3304010', 'Susukan', '3304010015', 'KARANGSALAM', 203, 288, 2897, 1036, 1005.9, 109.96, 38, 363, 0, 1, 20, 0.038, 0.0367, 0.1253, 0.001, 0.144, 69.57, 5, 69),
(2024, 7, 98, '3304080', 'Madukara', '3304080005', 'PAGELAK', 238, 161.2, 2036, 789, 1263.01, 67.82, 39, 582, 0, 17, 18, 0.0333, 0.0494, 0.2859, 0.0215, 0.0896, 69.49, 5, 70),
(2024, 19, 259, '3304100', 'Wanadadi', '3304100001', 'TAPEN', 74, 293.9, 3935, 879, 1338.89, 53.31, 46, 443, 0, 15, 17, 0.0135, 0.0523, 0.1126, 0.0171, 0.1729, 69.26, 5, 71),
(2024, 18, 237, '3304010', 'Susukan', '3304010003', 'BRENGKOK', 2, 162, 2888, 1009, 1782.72, 77.09, 46, 604, 0, 35, 20, 0.0267, 0.0456, 0.2091, 0.0347, 0.081, 69.22, 5, 72),
(2024, 1, 13, '3304090', 'Banjarmangu', '3304090004', 'REJASARI', 250, 169.96, 2433, 825, 1431.51, 87.35, 31, 545, 0, 6, 20, 0.0359, 0.0376, 0.224, 0.0073, 0.085, 69.2, 5, 73),
(2024, 5, 60, '3304180', 'Kalibening', '3304180012', 'KALIBENING', 160, 739, 3089, 1618, 418, 164.59, 136, 1655, 0, 9, 28, 0.0533, 0.0841, 0.5358, 0.0056, 0.2639, 69.12, 5, 74),
(2024, 6, 80, '3304130', 'Karangkobar', '3304130007', 'PAGERPELAH', 276, 395, 2052, 660, 519.49, 236.7, 18, 616, 0, 8, 20, 0.1154, 0.0273, 0.3002, 0.0121, 0.1975, 69.1, 5, 75),
(2024, 6, 85, '3304130', 'Karangkobar', '3304130001', 'SLATRI', 277, 468.26, 1011, 804, 215.9, 214.45, 18, 542, 0, 1, 20, 0.2121, 0.0224, 0.5361, 0.0012, 0.2341, 69, 5, 76),
(2024, 7, 102, '3304080', 'Madukara', '3304080016', 'PETAMBAKAN', 239, 220.43, 4200, 1038, 1905.34, 65.02, 81, 742, 0, 154, 17, 0.0155, 0.078, 0.1767, 0.1484, 0.1297, 68.99, 5, 77),
(2024, 15, 206, '3304020', 'Purwareja Klampok', '3304020006', 'KLAMPOK', 200, 238, 7248, 2564, 3045.38, 84.6, 158, 1603, 0, 71, 15, 0.0117, 0.0616, 0.2212, 0.0277, 0.1587, 68.91, 5, 78),
(2024, 7, 101, '3304080', 'Madukara', '3304080009', 'PENAWANGAN', 270, 183.34, 3668, 410, 2000.7, 85.1, 13, 388, 0, 0, 18, 0.0232, 0.0317, 0.1058, 0, 0.1019, 68.89, 5, 79),
(2024, 8, 114, '3304030', 'Mandiraja', '3304030011', 'KERTAYASA', 32, 343.43, 7167, 2295, 2086.92, 224.61, 92, 344, 0, 30, 17, 0.0313, 0.0401, 0.048, 0.0131, 0.202, 68.82, 5, 80),
(2024, 16, 210, '3304110', 'Rakit', '3304110004', 'ADIPASIR', 55, 322.71, 4176, 2307, 1294.06, 146.2, 128, 1090, 0, 23, 17, 0.035, 0.0555, 0.261, 0.01, 0.1898, 68.81, 5, 81),
(2024, 1, 12, '3304090', 'Banjarmangu', '3304090014', 'PRENDENGAN', 263, 334.89, 3209, 851, 958.23, 224.47, 57, 822, 0, 112, 17, 0.07, 0.067, 0.2562, 0.1316, 0.197, 68.76, 5, 82),
(2024, 17, 222, '3304070', 'Sigaluh', '3304070006', 'BOJANEGARA', 211, 182, 2015, 1027, 1107.14, 159.23, 35, 643, 0, 2, 12, 0.079, 0.0341, 0.3191, 0.0019, 0.1517, 68.73, 5, 83),
(2024, 12, 162, '3304150', 'Pejawaran', '3304150001', 'KALILUNJAR', 126, 161.24, 2986, 415, 1851.9, 97.9, 11, 306, 0, 9, 23, 0.0328, 0.0265, 0.1025, 0.0217, 0.0701, 68.73, 5, 84),
(2024, 16, 213, '3304110', 'Rakit', '3304110002', 'GELANG', 49, 187.8, 6489, 1595, 3455.27, 70.28, 81, 1024, 0, 63, 17, 0.0108, 0.0508, 0.1578, 0.0395, 0.1105, 68.72, 5, 85),
(2024, 17, 233, '3304070', 'Sigaluh', '3304070014', 'SINGAMERTA', 235, 191, 1668, 834, 873.3, 100, 36, 406, 0, 64, 20, 0.06, 0.0432, 0.2434, 0.0767, 0.0955, 68.71, 5, 86),
(2024, 4, 45, '3304050', 'Bawang', '3304050016', 'JOHO', 67, 151.67, 2576, 883, 1698.48, 41.88, 32, 432, 0, 2, 19, 0.0163, 0.0362, 0.1677, 0.0023, 0.0798, 68.6, 5, 87),
(2024, 16, 216, '3304110', 'Rakit', '3304110007', 'LUWUNG', 69, 190.22, 5483, 758, 2882.44, 81.29, 42, 441, 0, 67, 14, 0.0148, 0.0554, 0.0804, 0.0884, 0.1359, 68.54, 5, 88),
(2024, 8, 116, '3304030', 'Mandiraja', '3304030008', 'MANDIRAJA WETAN', 39, 150.85, 5181, 1664, 3434.49, 47.96, 64, 720, 0, 12, 17, 0.0093, 0.0385, 0.139, 0.0072, 0.0887, 68.48, 5, 89),
(2024, 20, 270, '3304170', 'Wanayasa', '3304170004', 'PANDANSARI', 109, 487.96, 5349, 1153, 1096.2, 290, 70, 1945, 0, 0, 20, 0.0542, 0.0607, 0.3636, 0, 0.244, 68.46, 5, 90),
(2024, 7, 96, '3304080', 'Madukara', '3304080010', 'LIMBANGAN', 279, 193.2, 2583, 632, 1336.96, 130.62, 19, 550, 0, 5, 18, 0.0506, 0.0301, 0.2129, 0.0079, 0.1073, 68.44, 5, 91),
(2024, 10, 140, '3304140', 'Pagentan', '3304140014', 'MAJASARI', 120, 418, 1265, 1108, 302.63, 313.56, 35, 723, 0, 27, 16, 0.2479, 0.0316, 0.5715, 0.0244, 0.2613, 68.36, 5, 92),
(2024, 3, 37, '3304160', 'Batur', '3304160003', 'PESURENAN', 167, 266, 3727, 995, 1401.13, 142.09, 64, 1491, 0, 0, 13, 0.0381, 0.0643, 0.4001, 0, 0.2046, 68.27, 5, 93),
(2024, 10, 145, '3304140', 'Pagentan', '3304140005', 'SOKARAJA', 195, 216.98, 3277, 833, 1510.28, 171.75, 25, 325, 0, 49, 19, 0.0524, 0.03, 0.0992, 0.0588, 0.1142, 68.26, 4, 94),
(2024, 6, 75, '3304130', 'Karangkobar', '3304130003', 'GUMELAR', 110, 262, 5545, 358, 2116.41, 81.71, 11, 233, 0, 0, 20, 0.0147, 0.0307, 0.042, 0, 0.131, 68.23, 4, 95),
(2024, 16, 219, '3304110', 'Rakit', '3304110001', 'SITUWANGI', 48, 233.41, 4938, 2182, 2115.59, 102.18, 134, 1720, 0, 45, 17, 0.0207, 0.0614, 0.3483, 0.0206, 0.1373, 68.21, 4, 96),
(2024, 1, 6, '3304090', 'Banjarmangu', '3304090012', 'KALILUNJAR', 258, 277.74, 3396, 1038, 1222.73, 179.72, 37, 699, 0, 11, 17, 0.0529, 0.0356, 0.2058, 0.0106, 0.1634, 68.11, 4, 97),
(2024, 5, 72, '3304180', 'Kalibening', '3304180021', 'SIRUKUN', 181, 392, 2342, 639, 597.45, 184.88, 17, 634, 0, 6, 28, 0.0789, 0.0266, 0.2707, 0.0094, 0.14, 68.1, 4, 98),
(2024, 13, 185, '3304120', 'Punggelan', '3304120004', 'SIDARATA', 86, 356.99, 5244, 1700, 1468.95, 148.67, 100, 1068, 0, 69, 17, 0.0283, 0.0588, 0.2037, 0.0406, 0.21, 67.99, 4, 99),
(2024, 10, 139, '3304140', 'Pagentan', '3304140003', 'LARANGAN', 87, 231.99, 2196, 728, 946.59, 123.45, 22, 542, 0, 5, 19, 0.0562, 0.0302, 0.2468, 0.0069, 0.1221, 67.92, 4, 100),
(2024, 18, 245, '3304010', 'Susukan', '3304010014', 'KEMRANGGON', 10, 232, 3558, 1188, 1533.62, 98.61, 45, 604, 0, 29, 20, 0.0277, 0.0379, 0.1698, 0.0244, 0.116, 67.81, 4, 101),
(2024, 5, 61, '3304180', 'Kalibening', '3304180006', 'KALIBOMBONG', 141, 731, 1883, 1525, 257.59, 388.71, 41, 993, 0, 52, 28, 0.2064, 0.0269, 0.5273, 0.0341, 0.2611, 67.77, 4, 102),
(2024, 12, 157, '3304150', 'Pejawaran', '3304150009', 'CONDONGCAMPUR', 157, 343.04, 13835, 1071, 4033.12, 321.37, 42, 1594, 0, 26, 23, 0.0232, 0.0392, 0.1152, 0.0243, 0.1491, 67.72, 4, 103),
(2024, 5, 57, '3304180', 'Kalibening', '3304180004', 'ASINAN', 129, 496, 3179, 825, 640.93, 272.19, 34, 1160, 0, 29, 28, 0.0856, 0.0412, 0.3649, 0.0352, 0.1771, 67.65, 4, 104),
(2024, 20, 269, '3304170', 'Wanayasa', '3304170015', 'LEGOKSAYEM', 162, 159.59, 3483, 332, 2182.47, 94.55, 8, 406, 0, 0, 16, 0.0271, 0.0241, 0.1166, 0, 0.0997, 67.49, 4, 105),
(2024, 4, 47, '3304050', 'Bawang', '3304050007', 'KUTAYASA', 53, 304, 1920, 699, 631.58, 152.82, 19, 253, 0, 25, 14, 0.0796, 0.0272, 0.1318, 0.0358, 0.2171, 67.36, 4, 106),
(2024, 4, 42, '3304050', 'Bawang', '3304050019', 'BLAMBANGAN', 75, 330.87, 6175, 2057, 1866.27, 122.62, 88, 1029, 0, 13, 19, 0.0199, 0.0428, 0.1666, 0.0063, 0.1741, 67.21, 4, 107),
(2024, 12, 166, '3304150', 'Pejawaran', '3304150013', 'PENUSUPAN', 147, 295.23, 4130, 1436, 1398.9, 243.68, 75, 1163, 0, 162, 23, 0.059, 0.0522, 0.2816, 0.1128, 0.1284, 67.13, 4, 108),
(2024, 5, 59, '3304180', 'Kalibening', '3304180019', 'GUNUNGLANGIT', 198, 442, 2560, 946, 579.19, 190.19, 36, 1073, 0, 1, 28, 0.0743, 0.0381, 0.4191, 0.0011, 0.1579, 67.05, 4, 109),
(2024, 10, 131, '3304140', 'Pagentan', '3304140002', 'ARIBAYA', 278, 301, 2920, 780, 970.1, 271.16, 23, 349, 0, 98, 19, 0.0929, 0.0295, 0.1195, 0.1256, 0.1584, 67.02, 4, 110),
(2024, 6, 81, '3304130', 'Karangkobar', '3304130008', 'PASURUHAN', 271, 337, 1939, 486, 575.37, 136.44, 11, 407, 0, 2, 20, 0.0704, 0.0226, 0.2099, 0.0041, 0.1685, 67, 4, 111),
(2024, 20, 271, '3304170', 'Wanayasa', '3304170005', 'PAGERGUNUNG', 114, 260.5, 5320, 565, 2042.23, 213.95, 20, 1218, 0, 12, 20, 0.0402, 0.0354, 0.2289, 0.0212, 0.1303, 66.98, 4, 112),
(2024, 7, 88, '3304080', 'Madukara', '3304080011', 'CLAPAR', 268, 354.35, 1521, 828, 429.23, 155.12, 21, 534, 0, 2, 18, 0.102, 0.0254, 0.3511, 0.0024, 0.1969, 66.93, 4, 113),
(2024, 6, 77, '3304130', 'Karangkobar', '3304130009', 'KARANGGONDANG', 134, 265, 2405, 902, 907.55, 215.87, 40, 1343, 0, 20, 20, 0.0898, 0.0443, 0.5584, 0.0222, 0.1325, 66.92, 4, 114),
(2024, 1, 10, '3304090', 'Banjarmangu', '3304090008', 'PASEH', 255, 312.7, 1897, 1051, 606.65, 174.07, 29, 551, 0, 49, 20, 0.0918, 0.0276, 0.2905, 0.0466, 0.1564, 66.88, 4, 115),
(2024, 10, 144, '3304140', 'Pagentan', '3304140010', 'PLUMBUNGAN', 108, 312.01, 1662, 838, 532.68, 124.44, 28, 534, 0, 2, 16, 0.0749, 0.0334, 0.3213, 0.0024, 0.195, 66.79, 4, 116),
(2024, 6, 76, '3304130', 'Karangkobar', '3304130010', 'JLEGONG', 128, 131.7, 2039, 353, 1548.27, 108.71, 11, 390, 0, 33, 20, 0.0533, 0.0312, 0.1913, 0.0935, 0.0658, 66.72, 4, 117),
(2024, 11, 151, '3304181', 'Pandanarum', '3304181006', 'PINGIT LOR', 143, 512, 5218, 801, 1019.14, 315.86, 31, 108, 0, 84, 22, 0.0605, 0.0387, 0.0207, 0.1049, 0.2327, 66.57, 4, 118),
(2024, 16, 215, '3304110', 'Rakit', '3304110008', 'LENGKONG', 72, 403.31, 6198, 2406, 1536.78, 215.44, 135, 1314, 0, 39, 14, 0.0348, 0.0561, 0.212, 0.0162, 0.2881, 66.52, 4, 119),
(2024, 6, 83, '3304130', 'Karangkobar', '3304130004', 'PURWODADI', 113, 223, 4584, 840, 2055.61, 144.57, 29, 1208, 0, 7, 20, 0.0315, 0.0345, 0.2635, 0.0083, 0.1115, 66.5, 4, 120),
(2024, 15, 205, '3304020', 'Purwareja Klampok', '3304020002', 'KECITRAN', 14, 241.06, 6258, 2137, 2596.03, 90.66, 127, 1267, 0, 21, 9, 0.0145, 0.0594, 0.2025, 0.0098, 0.2678, 66.47, 4, 121),
(2024, 5, 58, '3304180', 'Kalibening', '3304180020', 'BEDANA', 183, 400, 3020, 628, 755, 160.55, 18, 485, 0, 30, 28, 0.0532, 0.0287, 0.1606, 0.0478, 0.1429, 66.46, 4, 122),
(2024, 7, 105, '3304080', 'Madukara', '3304080008', 'TALUNAMBA', 267, 263.56, 2918, 609, 1107.13, 100.61, 40, 703, 0, 89, 18, 0.0345, 0.0657, 0.2409, 0.1461, 0.1464, 66.43, 4, 123),
(2024, 1, 9, '3304090', 'Banjarmangu', '3304090015', 'MAJATENGAH', 266, 212.07, 1723, 358, 812.47, 116.83, 6, 425, 0, 0, 17, 0.0678, 0.0168, 0.2467, 0, 0.1247, 66.35, 4, 124),
(2024, 12, 171, '3304150', 'Pejawaran', '3304150003', 'TLAHAB', 133, 250, 2629, 512, 1051.6, 86.57, 25, 774, 0, 36, 23, 0.0329, 0.0488, 0.2944, 0.0703, 0.1087, 66.32, 4, 125),
(2024, 15, 202, '3304020', 'Purwareja Klampok', '3304020005', 'KALILANDAK', 21, 177.13, 3629, 1260, 2048.78, 96.88, 49, 986, 0, 19, 15, 0.0267, 0.0389, 0.2717, 0.0151, 0.1181, 66.31, 4, 126),
(2024, 4, 49, '3304050', 'Bawang', '3304050014', 'MANTRIANOM', 66, 282.97, 5410, 1843, 1911.86, 128.92, 87, 1054, 0, 111, 19, 0.0238, 0.0472, 0.1948, 0.0602, 0.1489, 66.28, 4, 127),
(2024, 13, 178, '3304120', 'Punggelan', '3304120011', 'KLAPA', 93, 563.83, 1011, 1210, 179.31, 166.96, 58, 783, 0, 16, 20, 0.1651, 0.0479, 0.7745, 0.0132, 0.2819, 66.16, 4, 128),
(2024, 1, 17, '3304090', 'Banjarmangu', '3304090009', 'SIPEDANG', 262, 433.97, 2579, 1368, 594.28, 273.58, 44, 829, 0, 44, 17, 0.1061, 0.0322, 0.3214, 0.0322, 0.2553, 66.14, 4, 129),
(2024, 18, 248, '3304010', 'Susukan', '3304010005', 'PANERUSAN WETAN', 3, 345, 2956, 990, 856.81, 107.48, 42, 836, 0, 16, 20, 0.0364, 0.0424, 0.2828, 0.0162, 0.1725, 65.99, 4, 130),
(2024, 17, 228, '3304070', 'Sigaluh', '3304070008', 'PRIGI', 219, 529, 2947, 1540, 557.09, 261.08, 89, 1176, 0, 125, 20, 0.0886, 0.0578, 0.399, 0.0812, 0.2645, 65.95, 4, 131),
(2024, 12, 163, '3304150', 'Pejawaran', '3304150015', 'KARANGSARI', 138, 217.15, 3173, 1032, 1461.2, 186.7, 40, 743, 0, 123, 23, 0.0588, 0.0388, 0.2342, 0.1192, 0.0944, 65.94, 4, 132),
(2024, 9, 122, '3304061', 'Pagedongan', '3304061001', 'DUREN', 192, 513, 1925, 1025, 375.24, 250.21, 75, 889, 0, 202, 18, 0.13, 0.0732, 0.4618, 0.1971, 0.285, 65.85, 4, 133),
(2024, 16, 214, '3304110', 'Rakit', '3304110005', 'KINCANG', 60, 242.05, 3604, 1583, 1488.98, 114.88, 75, 1063, 0, 44, 14, 0.0319, 0.0474, 0.295, 0.0278, 0.1729, 65.85, 4, 134),
(2024, 4, 40, '3304050', 'Bawang', '3304050017', 'BAWANG', 70, 287.59, 4286, 1429, 1490.32, 48.07, 58, 729, 0, 34, 19, 0.0112, 0.0406, 0.1701, 0.0238, 0.1514, 65.79, 4, 135),
(2024, 14, 189, '3304040', 'Purwanegara', '3304040013', 'DANARAJA', 41, 281.2, 5548, 1992, 1972.97, 185.78, 90, 1329, 0, 55, 14, 0.0335, 0.0452, 0.2395, 0.0276, 0.2009, 65.74, 4, 136),
(2024, 12, 161, '3304150', 'Pejawaran', '3304150017', 'GROGOL', 170, 573.82, 2013, 1076, 350.81, 364.76, 31, 1468, 0, 11, 23, 0.1812, 0.0288, 0.7293, 0.0102, 0.2495, 65.59, 4, 137),
(2024, 3, 34, '3304160', 'Batur', '3304160006', 'KARANGTENGAH', 173, 489, 4213, 1539, 861.55, 275.14, 48, 468, 0, 21, 16, 0.0653, 0.0312, 0.1111, 0.0136, 0.3056, 65.56, 4, 138),
(2024, 10, 141, '3304140', 'Pagentan', '3304140006', 'METAWANA', 98, 224, 3771, 665, 1683.48, 183.5, 23, 610, 0, 59, 16, 0.0487, 0.0346, 0.1618, 0.0887, 0.14, 65.49, 4, 139),
(2024, 18, 249, '3304010', 'Susukan', '3304010001', 'PIASA WETAN', 204, 98, 1322, 451, 1348.98, 50.68, 21, 368, 0, 62, 20, 0.0383, 0.0466, 0.2784, 0.1375, 0.049, 65.43, 3, 140),
(2024, 6, 84, '3304130', 'Karangkobar', '3304130005', 'SAMPANG', 112, 351, 1797, 849, 511.97, 155.19, 27, 816, 0, 10, 20, 0.0864, 0.0318, 0.4541, 0.0118, 0.1755, 65.1, 3, 141),
(2024, 1, 4, '3304090', 'Banjarmangu', '3304090006', 'GRIPIT', 254, 103.22, 1097, 386, 1062.78, 39.1, 20, 374, 0, 53, 20, 0.0356, 0.0518, 0.3409, 0.1373, 0.0516, 65.01, 3, 142),
(2024, 10, 133, '3304140', 'Pagentan', '3304140007', 'GUMINGSIR', 97, 358, 1986, 729, 554.75, 259.21, 21, 812, 0, 72, 19, 0.1305, 0.0288, 0.4089, 0.0988, 0.1884, 65.01, 3, 143),
(2024, 19, 255, '3304100', 'Wanadadi', '3304100002', 'KASILIB', 77, 210.3, 6259, 995, 2976.22, 119.41, 20, 675, 0, 7, 17, 0.0191, 0.0201, 0.1078, 0.007, 0.1237, 64.99, 3, 144),
(2024, 17, 231, '3304070', 'Sigaluh', '3304070002', 'SAWAL', 209, 667, 839, 945, 125.79, 265.66, 30, 289, 0, 1, 12, 0.3166, 0.0317, 0.3445, 0.0011, 0.5558, 64.98, 3, 145),
(2024, 8, 108, '3304030', 'Mandiraja', '3304030012', 'CANDIWULAN', 26, 111.59, 2778, 947, 2489.47, 51.85, 29, 606, 0, 43, 15, 0.0187, 0.0306, 0.2181, 0.0454, 0.0744, 64.83, 3, 146),
(2024, 4, 53, '3304050', 'Bawang', '3304050001', 'WANADRI', 24, 446, 4767, 1649, 1068.83, 437.05, 96, 1013, 0, 257, 14, 0.0917, 0.0582, 0.2125, 0.1559, 0.3186, 64.83, 3, 147),
(2024, 6, 78, '3304130', 'Karangkobar', '3304130012', 'KARANGKOBAR', 131, 268, 1891, 1795, 705.6, 146.61, 109, 1227, 0, 149, 20, 0.0775, 0.0607, 0.6489, 0.083, 0.134, 64.69, 3, 148),
(2024, 10, 143, '3304140', 'Pagentan', '3304140013', 'PAGENTAN', 105, 370, 1860, 1685, 502.7, 242.26, 76, 1255, 0, 68, 16, 0.1302, 0.0451, 0.6747, 0.0404, 0.2312, 64.62, 3, 149),
(2024, 7, 86, '3304080', 'Madukara', '3304080003', 'BANTARWARU', 241, 229.97, 2419, 1204, 1051.89, 88.26, 61, 1054, 0, 58, 17, 0.0365, 0.0507, 0.4357, 0.0482, 0.1353, 64.47, 3, 150),
(2024, 13, 176, '3304120', 'Punggelan', '3304120008', 'KARANGSARI', 92, 561.85, 5458, 1944, 971.43, 253.68, 62, 819, 0, 9, 20, 0.0465, 0.0319, 0.1501, 0.0046, 0.2809, 64.4, 3, 151),
(2024, 10, 136, '3304140', 'Pagentan', '3304140011', 'KAREKAN', 115, 382, 4510, 1013, 1180.63, 182.42, 32, 816, 0, 7, 16, 0.0404, 0.0316, 0.1809, 0.0069, 0.2388, 64.39, 3, 152),
(2024, 2, 18, '3304060', 'Banjarnegara', '3304060008', 'AMPELSARI', 222, 274.15, 5293, 1758, 1930.68, 93.4, 70, 1361, 0, 36, 17, 0.0176, 0.0398, 0.2571, 0.0205, 0.1613, 64.37, 3, 153),
(2024, 11, 152, '3304181', 'Pandanarum', '3304181004', 'PRINGAMBA', 155, 529, 6837, 846, 1292.44, 193.82, 24, 469, 0, 14, 22, 0.0283, 0.0284, 0.0686, 0.0165, 0.2405, 64.29, 3, 154),
(2024, 10, 132, '3304140', 'Pagentan', '3304140015', 'BABADAN', 118, 424, 1911, 1205, 450.71, 294.82, 46, 1428, 0, 13, 16, 0.1543, 0.0382, 0.7473, 0.0108, 0.265, 64.25, 3, 155),
(2024, 19, 254, '3304100', 'Wanadadi', '3304100006', 'KARANGKEMIRI', 79, 150.6, 6583, 1078, 4371.18, 72.51, 20, 770, 0, 2, 13, 0.011, 0.0186, 0.117, 0.0019, 0.1158, 64.23, 3, 156),
(2024, 13, 175, '3304120', 'Punggelan', '3304120012', 'JEMBANGAN', 106, 689.1, 2633, 2155, 382.09, 325.84, 80, 970, 0, 113, 20, 0.1238, 0.0371, 0.3684, 0.0524, 0.3446, 64.19, 3, 157),
(2024, 7, 87, '3304080', 'Madukara', '3304080015', 'BLITAR', 244, 201.51, 2438, 734, 1209.89, 69.33, 26, 705, 0, 32, 17, 0.0284, 0.0354, 0.2892, 0.0436, 0.1185, 64.07, 3, 158),
(2024, 12, 170, '3304150', 'Pejawaran', '3304150011', 'SIDENGOK', 154, 367.28, 2912, 1184, 792.86, 333.52, 27, 1218, 0, 90, 23, 0.1145, 0.0228, 0.4183, 0.076, 0.1597, 64.02, 3, 159),
(2024, 20, 268, '3304170', 'Wanayasa', '3304170007', 'KUBANG', 127, 305.87, 1847, 1261, 603.85, 141.37, 95, 2808, 0, 46, 16, 0.0765, 0.0753, 1.5203, 0.0365, 0.1912, 64.02, 3, 160),
(2024, 8, 118, '3304030', 'Mandiraja', '3304030014', 'PURWASABA', 22, 282.16, 7642, 2545, 2708.44, 150.15, 74, 1116, 0, 30, 15, 0.0196, 0.0291, 0.146, 0.0118, 0.1881, 63.98, 3, 161),
(2024, 8, 117, '3304030', 'Mandiraja', '3304030016', 'PANGGISARI', 188, 259.74, 5363, 1780, 2064.8, 92.91, 55, 821, 0, 44, 15, 0.0173, 0.0309, 0.1531, 0.0247, 0.1732, 63.89, 3, 162),
(2024, 4, 54, '3304050', 'Bawang', '3304050010', 'WATUURIP', 52, 277.18, 1271, 466, 458.55, 79.64, 33, 417, 0, 99, 14, 0.0627, 0.0708, 0.3281, 0.2124, 0.198, 63.77, 3, 163),
(2024, 19, 261, '3304100', 'Wanadadi', '3304100005', 'WANAKARSA', 83, 258.8, 4863, 1133, 1879.06, 16.22, 45, 828, 0, 56, 17, 0.0033, 0.0397, 0.1703, 0.0494, 0.1522, 63.67, 3, 164),
(2024, 1, 15, '3304090', 'Banjarmangu', '3304090017', 'SIJENGGUNG', 265, 249.45, 3101, 667, 1243.13, 162.29, 26, 464, 0, 107, 17, 0.0523, 0.039, 0.1496, 0.1604, 0.1467, 63.5, 3, 165),
(2024, 8, 121, '3304030', 'Mandiraja', '3304030005', 'SOMAWANGI', 19, 690, 9746, 3307, 1412.46, 270.29, 130, 0, 0, 0, 17, 0.0277, 0.0393, 0, 0, 0.4059, 63.48, 3, 166),
(2024, 4, 44, '3304050', 'Bawang', '3304050020', 'GEMURUH', 68, 329.74, 6416, 2157, 1945.76, 120.37, 70, 1173, 0, 74, 19, 0.0188, 0.0325, 0.1828, 0.0343, 0.1735, 63.33, 3, 167),
(2024, 5, 66, '3304180', 'Kalibening', '3304180011', 'MAJATENGAH', 159, 641, 1938, 791, 302.34, 108.78, 27, 673, 0, 8, 28, 0.0561, 0.0341, 0.3473, 0.0101, 0.2289, 63.3, 3, 168),
(2024, 19, 256, '3304100', 'Wanadadi', '3304100011', 'LEMAHJAYA', 272, 514.2, 5456, 2128, 1061.07, 256.41, 97, 1783, 0, 11, 17, 0.047, 0.0456, 0.3268, 0.0052, 0.3025, 63.23, 3, 169),
(2024, 14, 200, '3304040', 'Purwanegara', '3304040008', 'PUCUNGBEDUG', 38, 649.95, 7110, 2442, 1093.93, 363.19, 117, 2131, 0, 23, 19, 0.0511, 0.0479, 0.2997, 0.0094, 0.3421, 63.19, 3, 170),
(2024, 13, 187, '3304120', 'Punggelan', '3304120017', 'TLAGA', 275, 721.85, 2671, 1887, 370.02, 482.54, 44, 1294, 0, 49, 17, 0.1807, 0.0233, 0.4845, 0.026, 0.4246, 62.94, 3, 171),
(2024, 4, 48, '3304050', 'Bawang', '3304050005', 'MAJALENGKA', 43, 523.87, 3746, 1334, 715.06, 368.86, 81, 1082, 0, 203, 14, 0.0985, 0.0607, 0.2888, 0.1522, 0.3742, 62.93, 3, 172),
(2024, 10, 146, '3304140', 'Pagentan', '3304140016', 'TEGALJERUK', 125, 447, 3293, 644, 736.69, 150.72, 24, 907, 0, 7, 16, 0.0458, 0.0373, 0.2754, 0.0109, 0.2794, 62.8, 3, 173),
(2024, 4, 52, '3304050', 'Bawang', '3304050013', 'SERANG', 57, 113.17, 1323, 482, 1169.04, 60.3, 17, 550, 0, 38, 14, 0.0456, 0.0353, 0.4157, 0.0788, 0.0808, 62.72, 3, 174),
(2024, 1, 16, '3304090', 'Banjarmangu', '3304090013', 'SIJERUK', 261, 274.04, 3497, 831, 1276.09, 118.08, 25, 652, 0, 61, 17, 0.0338, 0.0301, 0.1864, 0.0734, 0.1612, 62.72, 3, 175),
(2024, 20, 264, '3304170', 'Wanayasa', '3304170006', 'DAWUHAN', 119, 190.36, 1008, 609, 529.52, 126.29, 18, 876, 0, 0, 16, 0.1253, 0.0296, 0.869, 0, 0.119, 62.68, 3, 176),
(2024, 4, 46, '3304050', 'Bawang', '3304050002', 'KEBONDALEM', 191, 792.39, 4308, 1455, 543.67, 364.25, 98, 1157, 0, 77, 14, 0.0846, 0.0674, 0.2686, 0.0529, 0.566, 62.64, 3, 177),
(2024, 19, 252, '3304100', 'Wanadadi', '3304100010', 'KANDANGWANGI', 85, 294.7, 6837, 1357, 2319.99, 176.88, 57, 1263, 0, 99, 13, 0.0259, 0.042, 0.1847, 0.073, 0.2267, 62.54, 3, 178),
(2024, 4, 55, '3304050', 'Bawang', '3304050008', 'WINONG', 63, 276.1, 3070, 1082, 1111.92, 127.5, 34, 700, 0, 69, 14, 0.0415, 0.0314, 0.228, 0.0638, 0.1972, 62.23, 3, 179),
(2024, 13, 186, '3304120', 'Punggelan', '3304120015', 'TANJUNGTIRTA', 96, 635.84, 2054, 1667, 323.04, 365.79, 62, 1288, 0, 127, 17, 0.1781, 0.0372, 0.6271, 0.0762, 0.374, 62.16, 3, 180),
(2024, 18, 239, '3304010', 'Susukan', '3304010012', 'DERMASARI', 202, 181, 2997, 1045, 1655.8, 58.96, 35, 1054, 0, 43, 17, 0.0197, 0.0335, 0.3517, 0.0411, 0.1065, 62.13, 3, 181),
(2024, 18, 236, '3304010', 'Susukan', '3304010009', 'BERTA', 7, 478, 4030, 1313, 843.1, 128.35, 30, 371, 0, 11, 17, 0.0318, 0.0228, 0.0921, 0.0084, 0.2812, 62.08, 3, 182),
(2024, 5, 64, '3304180', 'Kalibening', '3304180024', 'KASINOMAN', 172, 1907, 3079, 935, 161.46, 369.31, 36, 865, 0, 4, 28, 0.1199, 0.0385, 0.2809, 0.0043, 0.6811, 61.75, 3, 183),
(2024, 8, 109, '3304030', 'Mandiraja', '3304030002', 'GLEMPANG', 193, 569.91, 7056, 2319, 1238.09, 188.28, 84, 591, 0, 13, 15, 0.0267, 0.0362, 0.0838, 0.0056, 0.3799, 61.65, 3, 184),
(2024, 14, 192, '3304040', 'Purwanegara', '3304040011', 'KALIPELUS', 56, 244.52, 4752, 1660, 1943.4, 87.2, 56, 1504, 0, 36, 14, 0.0184, 0.0337, 0.3165, 0.0217, 0.1747, 61.5, 3, 185),
(2024, 7, 89, '3304080', 'Madukara', '3304080004', 'DAWUHAN', 242, 317.1, 962, 1142, 303.37, 145.22, 47, 1413, 0, 99, 17, 0.151, 0.0412, 1.4688, 0.0867, 0.1865, 61.42, 2, 186),
(2024, 11, 150, '3304181', 'Pandanarum', '3304181005', 'PASEGERAN', 139, 1079, 3406, 1068, 315.66, 276.86, 27, 172, 0, 10, 22, 0.0813, 0.0253, 0.0505, 0.0094, 0.4905, 61.36, 2, 187),
(2024, 6, 74, '3304130', 'Karangkobar', '3304130011', 'BINANGUN', 136, 328.67, 2169, 1030, 659.94, 232.74, 35, 896, 0, 178, 20, 0.1073, 0.034, 0.4131, 0.1728, 0.1643, 61.25, 2, 188),
(2024, 14, 201, '3304040', 'Purwanegara', '3304040012', 'PURWONEGORO', 47, 347.5, 8795, 3045, 2530.92, 142.76, 90, 1187, 0, 100, 14, 0.0162, 0.0296, 0.135, 0.0328, 0.2482, 61.14, 2, 189),
(2024, 7, 91, '3304080', 'Madukara', '3304080018', 'KALIURIP', 252, 482.1, 4208, 1216, 872.85, 293.14, 56, 1530, 0, 122, 17, 0.0697, 0.0461, 0.3636, 0.1003, 0.2836, 60.92, 2, 190),
(2024, 16, 211, '3304110', 'Rakit', '3304110009', 'BADAMITA', 71, 360.3, 8550, 1900, 2373.02, 176.64, 61, 1913, 0, 28, 14, 0.0207, 0.0321, 0.2237, 0.0147, 0.2574, 60.91, 2, 191),
(2024, 1, 5, '3304090', 'Banjarmangu', '3304090001', 'JENGGAWUR', 236, 173.05, 2401, 981, 1387.46, 89.45, 33, 1270, 0, 44, 20, 0.0373, 0.0336, 0.5289, 0.0449, 0.0865, 60.78, 2, 192),
(2024, 15, 207, '3304020', 'Purwareja Klampok', '3304020004', 'PAGAK', 15, 168.95, 3651, 1239, 2160.99, 85.43, 58, 1856, 0, 23, 9, 0.0234, 0.0468, 0.5084, 0.0186, 0.1877, 60.76, 2, 193),
(2024, 9, 125, '3304061', 'Pagedongan', '3304061003', 'KEBUTUHDUWUR', 31, 967, 3696, 2234, 382.21, 624.65, 151, 2061, 0, 334, 18, 0.169, 0.0676, 0.5576, 0.1495, 0.5372, 60.68, 2, 194),
(2024, 16, 217, '3304110', 'Rakit', '3304110011', 'PINGIT', 185, 422.38, 6316, 2237, 1495.35, 140.06, 80, 1943, 0, 23, 17, 0.0222, 0.0358, 0.3076, 0.0103, 0.2485, 60.68, 2, 195),
(2024, 8, 113, '3304030', 'Mandiraja', '3304030003', 'KEBANARAN', 16, 521.69, 6172, 2033, 1183.08, 148.93, 89, 1155, 0, 72, 15, 0.0241, 0.0438, 0.1871, 0.0354, 0.3478, 60.65, 2, 196),
(2024, 13, 181, '3304120', 'Punggelan', '3304120007', 'PUNGGELAN', 95, 898.03, 2728, 2855, 303.78, 400.06, 174, 1614, 0, 346, 20, 0.1466, 0.0609, 0.5916, 0.1212, 0.449, 60.61, 2, 197),
(2024, 12, 167, '3304150', 'Pejawaran', '3304150012', 'RATAMBA', 156, 277.08, 3619, 842, 1306.12, 219.52, 27, 1163, 0, 129, 23, 0.0607, 0.0321, 0.3214, 0.1532, 0.1205, 60.6, 2, 198),
(2024, 14, 197, '3304040', 'Purwanegara', '3304040006', 'MERTASARI', 40, 359.53, 5033, 1755, 1399.87, 196.41, 46, 1256, 0, 38, 14, 0.039, 0.0262, 0.2496, 0.0217, 0.2568, 60.54, 2, 199),
(2024, 15, 204, '3304020', 'Purwareja Klampok', '3304020008', 'KALIWINASUH', 35, 239, 5213, 1813, 2181.17, 79.25, 67, 2410, 0, 4, 15, 0.0152, 0.037, 0.4623, 0.0022, 0.1593, 60.44, 2, 200),
(2024, 17, 234, '3304070', 'Sigaluh', '3304070004', 'TUNGGARA', 208, 216, 1410, 628, 652.78, 86.57, 20, 831, 0, 4, 12, 0.0614, 0.0318, 0.5894, 0.0064, 0.18, 60.29, 2, 201),
(2024, 16, 220, '3304110', 'Rakit', '3304110006', 'TANJUNGANOM', 64, 237.82, 5010, 1285, 2106.66, 114.7, 29, 1223, 0, 51, 14, 0.0229, 0.0226, 0.2441, 0.0397, 0.1699, 60.28, 2, 202),
(2024, 5, 70, '3304180', 'Kalibening', '3304180018', 'SIKUMPUL', 166, 486, 2775, 1027, 570.99, 163.05, 30, 1236, 0, 57, 28, 0.0588, 0.0292, 0.4454, 0.0555, 0.1736, 60.23, 2, 203),
(2024, 16, 212, '3304110', 'Rakit', '3304110010', 'BANDINGAN', 186, 442.29, 5872, 1750, 1327.62, 215.3, 70, 1395, 0, 159, 17, 0.0367, 0.04, 0.2376, 0.0909, 0.2602, 60.21, 2, 204),
(2024, 10, 135, '3304140', 'Pagentan', '3304140004', 'KARANGNANGKA', 91, 253, 5112, 693, 2020.55, 168.73, 30, 703, 0, 160, 19, 0.033, 0.0433, 0.1375, 0.2309, 0.1332, 60.07, 2, 205),
(2024, 13, 172, '3304120', 'Punggelan', '3304120005', 'BADAKARYA', 88, 502.82, 7423, 1879, 1476.27, 179.22, 107, 1712, 0, 239, 17, 0.0241, 0.0569, 0.2306, 0.1272, 0.2958, 60.02, 2, 206),
(2024, 11, 149, '3304181', 'Pandanarum', '3304181002', 'PANDANARUM', 124, 1026, 6441, 1063, 627.78, 275.88, 37, 551, 0, 12, 22, 0.0428, 0.0348, 0.0855, 0.0113, 0.4664, 59.84, 2, 207),
(2024, 13, 183, '3304120', 'Punggelan', '3304120001', 'SAMBONG', 187, 588.31, 6484, 1751, 1102.14, 173.9, 45, 1288, 0, 16, 20, 0.0268, 0.0257, 0.1986, 0.0091, 0.2942, 59.71, 2, 208),
(2024, 5, 62, '3304180', 'Kalibening', '3304180007', 'KALISAT KIDUL', 148, 653, 2173, 1325, 332.77, 447.07, 30, 1533, 0, 178, 28, 0.2057, 0.0226, 0.7055, 0.1343, 0.2332, 59.67, 2, 209),
(2024, 8, 111, '3304030', 'Mandiraja', '3304030004', 'KALIWUNGU', 17, 529.73, 4773, 1603, 901.03, 152.25, 64, 878, 0, 137, 17, 0.0319, 0.0399, 0.184, 0.0855, 0.3116, 59.44, 2, 210),
(2024, 20, 276, '3304170', 'Wanayasa', '3304170012', 'TEMPURAN', 169, 538.75, 4273, 1010, 793.13, 225.47, 39, 1050, 0, 132, 20, 0.0528, 0.0386, 0.2457, 0.1307, 0.2694, 59.12, 2, 211),
(2024, 19, 258, '3304100', 'Wanadadi', '3304100009', 'MEDAYU', 274, 243.5, 2127, 1049, 873.51, 137.28, 39, 826, 0, 152, 13, 0.0645, 0.0372, 0.3883, 0.1449, 0.1873, 59.04, 2, 212),
(2024, 11, 147, '3304181', 'Pandanarum', '3304181003', 'BEJI', 144, 710, 3573, 940, 503.24, 302.91, 17, 1128, 0, 36, 22, 0.0848, 0.0181, 0.3157, 0.0383, 0.3227, 58.91, 2, 213),
(2024, 7, 99, '3304080', 'Madukara', '3304080020', 'PAKELEN', 257, 361.15, 4057, 563, 1123.37, 113.12, 19, 747, 0, 79, 18, 0.0279, 0.0337, 0.1841, 0.1403, 0.2006, 58.7, 2, 214),
(2024, 18, 250, '3304010', 'Susukan', '3304010013', 'SUSUKAN', 8, 283, 4034, 1338, 1425.44, 114.9, 51, 1157, 0, 190, 17, 0.0285, 0.0381, 0.2868, 0.142, 0.1665, 58.68, 2, 215),
(2024, 20, 272, '3304170', 'Wanayasa', '3304170017', 'PENANGGUNGAN', 184, 871.78, 5145, 793, 590.17, 381.19, 25, 703, 0, 12, 16, 0.0741, 0.0315, 0.1366, 0.0151, 0.5449, 58.39, 2, 216),
(2024, 7, 103, '3304080', 'Madukara', '3304080017', 'RAKITAN', 249, 265.39, 1160, 969, 437.09, 114.58, 38, 1009, 0, 59, 17, 0.0988, 0.0392, 0.8698, 0.0609, 0.1561, 58.35, 2, 217),
(2024, 13, 179, '3304120', 'Punggelan', '3304120016', 'MLAYA', 122, 636.76, 1452, 902, 228.03, 263.77, 42, 1369, 0, 111, 17, 0.1817, 0.0466, 0.9428, 0.1231, 0.3746, 57.85, 2, 218),
(2024, 11, 154, '3304181', 'Pandanarum', '3304181008', 'SIRONGGE', 164, 871, 5781, 1046, 663.72, 209.98, 47, 1318, 0, 85, 22, 0.0363, 0.0449, 0.228, 0.0813, 0.3959, 57.61, 2, 219),
(2024, 13, 188, '3304120', 'Punggelan', '3304120002', 'TRIBUANA', 78, 435.5, 3720, 1477, 854.19, 131.76, 37, 1222, 0, 99, 20, 0.0354, 0.0251, 0.3285, 0.067, 0.2178, 57.56, 2, 220),
(2024, 13, 174, '3304120', 'Punggelan', '3304120010', 'DANAKERTA', 199, 627.65, 1501, 2110, 239.15, 229.32, 88, 1999, 0, 191, 20, 0.1528, 0.0417, 1.3318, 0.0905, 0.3138, 57.55, 2, 221),
(2024, 14, 191, '3304040', 'Purwanegara', '3304040003', 'KALIAJIR', 23, 756.84, 5874, 2126, 776.13, 394.28, 60, 1267, 0, 150, 19, 0.0671, 0.0282, 0.2157, 0.0706, 0.3983, 57.54, 2, 222),
(2024, 14, 190, '3304040', 'Purwanegara', '3304040010', 'GUMIWANG', 62, 388.2, 8080, 2716, 2081.42, 159.04, 95, 2364, 0, 160, 14, 0.0197, 0.035, 0.2926, 0.0589, 0.2773, 57.44, 2, 223),
(2024, 3, 38, '3304160', 'Batur', '3304160002', 'SUMBEREJO', 174, 670, 2617, 1861, 390.6, 490.34, 58, 1851, 0, 60, 13, 0.1874, 0.0312, 0.7073, 0.0322, 0.5154, 57.32, 2, 224),
(2024, 15, 203, '3304020', 'Purwareja Klampok', '3304020007', 'KALIMANDI', 33, 281.37, 6496, 2135, 2308.7, 99.21, 56, 2069, 0, 143, 15, 0.0153, 0.0262, 0.3185, 0.067, 0.1876, 57.1, 2, 225),
(2024, 13, 184, '3304120', 'Punggelan', '3304120003', 'SAWANGAN', 84, 436.03, 6571, 1227, 1507.01, 115.99, 43, 1288, 0, 184, 20, 0.0177, 0.035, 0.196, 0.15, 0.218, 56.82, 2, 226),
(2024, 20, 263, '3304170', 'Wanayasa', '3304170003', 'BANTAR', 111, 302.15, 3008, 850, 995.53, 187.3, 47, 1434, 0, 223, 20, 0.0623, 0.0553, 0.4767, 0.2624, 0.1511, 56.71, 2, 227),
(2024, 10, 137, '3304140', 'Pagentan', '3304140012', 'KASMARAN', 116, 383, 4396, 734, 1147.78, 187.98, 26, 508, 0, 165, 16, 0.0428, 0.0354, 0.1156, 0.2248, 0.2394, 56.67, 2, 228),
(2024, 6, 79, '3304130', 'Karangkobar', '3304130013', 'LEKSANA', 135, 229, 2370, 1500, 1034.93, 101.75, 77, 1476, 0, 257, 20, 0.0429, 0.0513, 0.6228, 0.1713, 0.1145, 56.56, 2, 229),
(2024, 5, 63, '3304180', 'Kalibening', '3304180022', 'KARANGANYAR', 178, 299, 4824, 913, 1613.38, 154.7, 18, 1789, 0, 108, 28, 0.0321, 0.0197, 0.3709, 0.1183, 0.1068, 56.41, 2, 230),
(2024, 17, 232, '3304070', 'Sigaluh', '3304070013', 'SIGALUH', 228, 99, 1772, 499, 1789.9, 52.59, 31, 604, 0, 207, 20, 0.0297, 0.0621, 0.3409, 0.4148, 0.0495, 56.36, 2, 231),
(2024, 14, 198, '3304040', 'Purwanegara', '3304040007', 'PARAKAN', 44, 605.36, 5570, 1990, 920.11, 313.76, 50, 1553, 0, 22, 14, 0.0563, 0.0251, 0.2788, 0.0111, 0.4324, 56.33, 1, 232),
(2024, 14, 196, '3304040', 'Purwanegara', '3304040005', 'MERDEN', 28, 818.95, 11997, 4107, 1464.92, 328, 177, 2216, 0, 350, 19, 0.0273, 0.0431, 0.1847, 0.0852, 0.431, 55.96, 1, 233),
(2024, 18, 240, '3304010', 'Susukan', '3304010006', 'GUMELEM KULON', 201, 812, 10925, 3526, 1345.44, 207.43, 304, 3489, 0, 641, 17, 0.019, 0.0862, 0.3194, 0.1818, 0.4776, 55.86, 1, 234),
(2024, 7, 104, '3304080', 'Madukara', '3304080014', 'SERED', 245, 184.6, 3426, 676, 1855.92, 79.3, 15, 832, 0, 121, 17, 0.0231, 0.0222, 0.2428, 0.179, 0.1086, 55.76, 1, 235),
(2024, 17, 226, '3304070', 'Sigaluh', '3304070010', 'KEMIRI', 218, 225, 3324, 368, 1477.33, 68.46, 19, 577, 0, 144, 20, 0.0206, 0.0516, 0.1736, 0.3913, 0.1125, 54.58, 1, 236),
(2024, 12, 168, '3304150', 'Pejawaran', '3304150016', 'SARWODADI', 151, 858, 5432, 619, 633.1, 180.17, 17, 550, 0, 81, 23, 0.0332, 0.0275, 0.1013, 0.1309, 0.373, 54.51, 1, 237),
(2024, 20, 273, '3304170', 'Wanayasa', '3304170010', 'PESANTREN', 146, 292.39, 2481, 1078, 848.52, 321.91, 51, 2119, 0, 279, 20, 0.1298, 0.0473, 0.8541, 0.2588, 0.1462, 54.19, 1, 238),
(2024, 9, 124, '3304061', 'Pagedongan', '3304061006', 'GUNUNGJATI', 42, 505, 3128, 1182, 619.41, 218.97, 96, 1510, 0, 476, 18, 0.07, 0.0812, 0.4827, 0.4027, 0.2806, 54.16, 1, 239),
(2024, 3, 32, '3304160', 'Batur', '3304160001', 'BATUR', 175, 1212, 1884, 4428, 155.45, 769.72, 133, 3118, 0, 68, 13, 0.4086, 0.03, 1.655, 0.0154, 0.9323, 53.99, 1, 240),
(2024, 18, 241, '3304010', 'Susukan', '3304010007', 'GUMELEM WETAN', 4, 973, 10824, 3445, 1112.44, 313.39, 196, 2260, 0, 382, 17, 0.029, 0.0569, 0.2088, 0.1109, 0.5724, 53.8, 1, 241),
(2024, 13, 173, '3304120', 'Punggelan', '3304120006', 'BONDOLHARJO', 89, 545.67, 4961, 2056, 909.16, 298.14, 58, 1933, 0, 270, 17, 0.0601, 0.0282, 0.3896, 0.1313, 0.321, 53.14, 1, 242),
(2024, 12, 156, '3304150', 'Pejawaran', '3304150002', 'BITING', 137, 142.96, 3485, 659, 2437.73, 73.29, 23, 698, 0, 225, 23, 0.021, 0.0349, 0.2003, 0.3414, 0.0622, 53.1, 1, 243),
(2024, 8, 119, '3304030', 'Mandiraja', '3304030001', 'SALAMERTA', 6, 472.74, 5403, 1741, 1142.91, 96.72, 52, 1323, 0, 227, 15, 0.0179, 0.0299, 0.2449, 0.1304, 0.3152, 52.65, 1, 244),
(2024, 20, 277, '3304170', 'Wanayasa', '3304170013', 'WANARAJA', 168, 1358.95, 2099, 1534, 154.46, 550.14, 42, 2605, 0, 50, 16, 0.2621, 0.0274, 1.2411, 0.0326, 0.8493, 52.64, 1, 245),
(2024, 15, 209, '3304020', 'Purwareja Klampok', '3304020003', 'SIRKANDI', 9, 579.57, 7860, 2430, 1356.18, 229.47, 135, 1860, 0, 296, 9, 0.0292, 0.0556, 0.2366, 0.1218, 0.644, 52.5, 1, 246),
(2024, 8, 110, '3304030', 'Mandiraja', '3304030006', 'JALATUNDA', 12, 684.66, 6054, 1925, 884.23, 176.71, 48, 1373, 0, 165, 17, 0.0292, 0.0249, 0.2268, 0.0857, 0.4027, 52.3, 1, 247),
(2024, 9, 130, '3304061', 'Pagedongan', '3304061009', 'TWELAGIRI', 58, 460, 3278, 1944, 712.61, 204.63, 47, 1371, 0, 327, 18, 0.0624, 0.0242, 0.4182, 0.1682, 0.2556, 52.29, 1, 248),
(2024, 10, 142, '3304140', 'Pagentan', '3304140001', 'NAGASARI', 94, 229.2, 2348, 608, 1024.43, 226.42, 20, 1053, 0, 311, 19, 0.0964, 0.0329, 0.4485, 0.5115, 0.1206, 51.96, 1, 249),
(2024, 11, 153, '3304181', 'Pandanarum', '3304181001', 'SINDUAJI', 117, 488, 4767, 646, 976.84, 162.12, 32, 834, 0, 284, 22, 0.034, 0.0495, 0.175, 0.4396, 0.2218, 51.92, 1, 250),
(2024, 1, 11, '3304090', 'Banjarmangu', '3304090010', 'PEKANDANGAN', 260, 284.43, 2786, 806, 979.5, 187.54, 28, 1059, 0, 268, 20, 0.0673, 0.0347, 0.3801, 0.3325, 0.1422, 51.73, 1, 251),
(2024, 17, 227, '3304070', 'Sigaluh', '3304070003', 'PANAWAREN', 207, 607, 501, 1242, 82.54, 230.72, 31, 1260, 0, 107, 12, 0.4605, 0.025, 2.515, 0.0862, 0.5058, 50.92, 1, 252),
(2024, 3, 36, '3304160', 'Batur', '3304160008', 'PEKASIRAN', 179, 719, 5382, 1805, 748.54, 255.55, 35, 1426, 0, 24, 13, 0.0475, 0.0194, 0.265, 0.0133, 0.5531, 50.9, 1, 253),
(2024, 2, 29, '3304060', 'Banjarnegara', '3304060011', 'SOKAYASA', 221, 182.01, 3118, 1038, 1713.14, 93.78, 40, 1182, 0, 317, 14, 0.0301, 0.0385, 0.3791, 0.3054, 0.13, 50.76, 1, 254),
(2024, 14, 193, '3304040', 'Purwanegara', '3304040001', 'KALITENGAH', 189, 748.1, 5022, 1733, 671.3, 407.08, 29, 1399, 0, 298, 19, 0.0811, 0.0167, 0.2786, 0.172, 0.3937, 50.64, 1, 255),
(2024, 9, 127, '3304061', 'Pagedongan', '3304061007', 'LEBAKWANGI', 37, 772, 2063, 1774, 267.23, 486.69, 60, 1680, 0, 377, 18, 0.2359, 0.0338, 0.8143, 0.2125, 0.4289, 50.23, 1, 256),
(2024, 5, 67, '3304180', 'Kalibening', '3304180023', 'PLORENGAN', 182, 800, 3274, 1167, 409.25, 311.63, 46, 2058, 0, 282, 28, 0.0952, 0.0394, 0.6286, 0.2416, 0.2857, 50.14, 1, 257),
(2024, 17, 229, '3304070', 'Sigaluh', '3304070001', 'PRINGAMBA', 212, 406, 1061, 640, 261.33, 326.38, 35, 962, 0, 291, 12, 0.3076, 0.0547, 0.9067, 0.4547, 0.3383, 49.78, 1, 258),
(2024, 20, 275, '3304170', 'Wanayasa', '3304170001', 'SUWIDAK', 100, 354.04, 3165, 683, 893.97, 223.72, 28, 1240, 0, 360, 16, 0.0707, 0.041, 0.3918, 0.5271, 0.2213, 49.27, 1, 259),
(2024, 14, 199, '3304040', 'Purwanegara', '3304040002', 'PETIR', 190, 1059.46, 8410, 2825, 793.8, 787.74, 76, 2447, 0, 475, 19, 0.0937, 0.0269, 0.291, 0.1681, 0.5576, 49.14, 1, 260),
(2024, 9, 123, '3304061', 'Pagedongan', '3304061008', 'GENTANSARI', 59, 1556, 4671, 1988, 300.19, 389.87, 84, 1708, 0, 385, 18, 0.0835, 0.0423, 0.3657, 0.1937, 0.8644, 48.85, 1, 261),
(2024, 13, 182, '3304120', 'Punggelan', '3304120013', 'PURWASANA', 104, 627.34, 2535, 1779, 404.09, 237.32, 76, 1555, 0, 440, 17, 0.0936, 0.0427, 0.6134, 0.2473, 0.369, 48.13, 1, 262),
(2024, 18, 238, '3304010', 'Susukan', '3304010008', 'DERIK', 5, 402, 4296, 1438, 1068.66, 119.76, 32, 1503, 0, 334, 17, 0.0279, 0.0223, 0.3499, 0.2323, 0.2365, 47.69, 1, 263),
(2024, 1, 14, '3304090', 'Banjarmangu', '3304090007', 'SIGEBLOG', 259, 458.13, 2912, 1443, 635.63, 323.04, 40, 1509, 0, 523, 20, 0.1109, 0.0277, 0.5182, 0.3624, 0.2291, 47.47, 1, 264),
(2024, 12, 158, '3304150', 'Pejawaran', '3304150004', 'DARMAYASA', 130, 504.25, 4287, 1639, 850.17, 448.68, 49, 2324, 0, 637, 23, 0.1047, 0.0299, 0.5421, 0.3887, 0.2192, 47.17, 1, 265),
(2024, 20, 265, '3304170', 'Wanayasa', '3304170014', 'JATILAWANG', 180, 799.55, 2337, 1611, 292.29, 460.56, 106, 3237, 0, 847, 16, 0.1971, 0.0658, 1.3851, 0.5258, 0.4997, 47.1, 1, 266),
(2024, 6, 73, '3304130', 'Karangkobar', '3304130006', 'AMBAL', 123, 269, 2377, 821, 883.64, 162.87, 38, 1772, 0, 342, 20, 0.0685, 0.0463, 0.7455, 0.4166, 0.1345, 46.03, 1, 267),
(2024, 9, 128, '3304061', 'Pagedongan', '3304061005', 'PAGEDONGAN', 46, 1153, 1289, 2329, 111.8, 353.37, 113, 2521, 0, 655, 18, 0.2741, 0.0485, 1.9558, 0.2812, 0.6406, 45.72, 1, 268),
(2024, 2, 19, '3304060', 'Banjarnegara', '3304060010', 'CENDANA', 216, 367.07, 3705, 1243, 1009.35, 201.57, 43, 1457, 0, 449, 14, 0.0544, 0.0346, 0.3933, 0.3612, 0.2622, 45.19, 1, 269),
(2024, 2, 30, '3304060', 'Banjarnegara', '3304060009', 'TLAGAWERA', 214, 356.38, 3300, 1127, 925.98, 184.9, 9, 1178, 0, 333, 17, 0.056, 0.008, 0.357, 0.2955, 0.2096, 45.04, 1, 270),
(2024, 9, 129, '3304061', 'Pagedongan', '3304061004', 'PESANGKALAN', 45, 1388, 1925, 1237, 138.69, 472.76, 13, 1104, 0, 297, 18, 0.2456, 0.0105, 0.5735, 0.2401, 0.7711, 45.02, 1, 271),
(2024, 3, 35, '3304160', 'Batur', '3304160007', 'KEPAKISAN', 177, 527, 2551, 1020, 484.06, 202.83, 36, 1188, 0, 357, 16, 0.0795, 0.0353, 0.4657, 0.35, 0.3294, 44.65, 1, 272),
(2024, 18, 246, '3304010', 'Susukan', '3304010002', 'PAKIKIRAN', 205, 284, 2844, 993, 1001.41, 67.85, 40, 1509, 0, 369, 20, 0.0239, 0.0403, 0.5306, 0.3716, 0.142, 44.59, 1, 273),
(2024, 14, 194, '3304040', 'Purwanegara', '3304040004', 'KARANGANYAR', 30, 740.89, 7440, 2574, 1004.2, 367.87, 49, 3141, 0, 523, 19, 0.0494, 0.019, 0.4222, 0.2032, 0.3899, 44.11, 1, 274),
(2024, 7, 90, '3304080', 'Madukara', '3304080019', 'GUNUNGGIANA', 251, 366.31, 3080, 922, 840.82, 204.34, 17, 1375, 0, 355, 18, 0.0663, 0.0184, 0.4464, 0.385, 0.2035, 43.56, 1, 275),
(2024, 18, 247, '3304010', 'Susukan', '3304010004', 'PANERUSAN KULON', 206, 308, 2724, 916, 884.42, 70.69, 22, 1545, 0, 283, 20, 0.026, 0.024, 0.5672, 0.309, 0.154, 42.71, 1, 276),
(2024, 13, 180, '3304120', 'Punggelan', '3304120014', 'PETUGURAN', 102, 968.78, 2624, 2465, 270.86, 443.35, 86, 3405, 0, 997, 17, 0.169, 0.0349, 1.2976, 0.4045, 0.5699, 37.82, 1, 277),
(2024, 9, 126, '3304061', 'Pagedongan', '3304061002', 'KEBUTUHJURANG', 194, 1464, 2795, 1613, 190.92, 314.64, 82, 2559, 0, 591, 18, 0.1126, 0.0508, 0.9156, 0.3664, 0.8133, 36.03, 1, 278);

-- 9. Hubungkan fsva_desa_indikator dengan foreign keys (fallback jika tabel sudah ada)
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 3, `desa_id` = 33 WHERE `kode_desa` = '3304160005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 230 WHERE `kode_desa` = '3304070005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 2, `desa_id` = 28 WHERE `kode_desa` = '3304060018' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 115 WHERE `kode_desa` = '3304030009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 2, `desa_id` = 22 WHERE `kode_desa` = '3304060015' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 2, `desa_id` = 21 WHERE `kode_desa` = '3304060017' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 39 WHERE `kode_desa` = '3304050018' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 2, `desa_id` = 26 WHERE `kode_desa` = '3304060014' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 2, `desa_id` = 27 WHERE `kode_desa` = '3304060012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 278 WHERE `kode_desa` = '3304170009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 155 WHERE `kode_desa` = '3304150007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 94 WHERE `kode_desa` = '3304080001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 56 WHERE `kode_desa` = '3304050006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 19, `desa_id` = 251 WHERE `kode_desa` = '3304100007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 225 WHERE `kode_desa` = '3304070015' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 2, `desa_id` = 20 WHERE `kode_desa` = '3304060007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 100 WHERE `kode_desa` = '3304080007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 8 WHERE `kode_desa` = '3304090005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 6, `desa_id` = 82 WHERE `kode_desa` = '3304130002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 177 WHERE `kode_desa` = '3304120009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 2, `desa_id` = 23 WHERE `kode_desa` = '3304060016' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 68 WHERE `kode_desa` = '3304180005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 15, `desa_id` = 208 WHERE `kode_desa` = '3304020001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 221 WHERE `kode_desa` = '3304070007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 95 WHERE `kode_desa` = '3304080006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 11, `desa_id` = 148 WHERE `kode_desa` = '3304181007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 2, `desa_id` = 25 WHERE `kode_desa` = '3304060019' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 159 WHERE `kode_desa` = '3304150010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 224 WHERE `kode_desa` = '3304070011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 2, `desa_id` = 24 WHERE `kode_desa` = '3304060013' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 169 WHERE `kode_desa` = '3304150008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 266 WHERE `kode_desa` = '3304170002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 160 WHERE `kode_desa` = '3304150014' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 43 WHERE `kode_desa` = '3304050009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 41 WHERE `kode_desa` = '3304050015' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 244 WHERE `kode_desa` = '3304010011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 16, `desa_id` = 218 WHERE `kode_desa` = '3304110003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 107 WHERE `kode_desa` = '3304030015' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 165 WHERE `kode_desa` = '3304150005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 235 WHERE `kode_desa` = '3304070012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 242 WHERE `kode_desa` = '3304010010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 51 WHERE `kode_desa` = '3304050021' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 97 WHERE `kode_desa` = '3304080012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 69 WHERE `kode_desa` = '3304180010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 92 WHERE `kode_desa` = '3304080013' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 262 WHERE `kode_desa` = '3304170011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 50 WHERE `kode_desa` = '3304050012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 2 WHERE `kode_desa` = '3304090003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 267 WHERE `kode_desa` = '3304170016' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 7 WHERE `kode_desa` = '3304090011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 138 WHERE `kode_desa` = '3304140008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 223 WHERE `kode_desa` = '3304070009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 112 WHERE `kode_desa` = '3304030007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 19, `desa_id` = 257 WHERE `kode_desa` = '3304100008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 3 WHERE `kode_desa` = '3304090016' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 71 WHERE `kode_desa` = '3304180008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 19, `desa_id` = 260 WHERE `kode_desa` = '3304100004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 3, `desa_id` = 31 WHERE `kode_desa` = '3304160004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 274 WHERE `kode_desa` = '3304170008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 120 WHERE `kode_desa` = '3304030013' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 134 WHERE `kode_desa` = '3304140009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 93 WHERE `kode_desa` = '3304080002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 65 WHERE `kode_desa` = '3304180009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 1 WHERE `kode_desa` = '3304090002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 164 WHERE `kode_desa` = '3304150006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 106 WHERE `kode_desa` = '3304030010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 19, `desa_id` = 253 WHERE `kode_desa` = '3304100003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 14, `desa_id` = 195 WHERE `kode_desa` = '3304040009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 243 WHERE `kode_desa` = '3304010015' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 98 WHERE `kode_desa` = '3304080005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 19, `desa_id` = 259 WHERE `kode_desa` = '3304100001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 237 WHERE `kode_desa` = '3304010003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 13 WHERE `kode_desa` = '3304090004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 60 WHERE `kode_desa` = '3304180012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 6, `desa_id` = 80 WHERE `kode_desa` = '3304130007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 6, `desa_id` = 85 WHERE `kode_desa` = '3304130001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 102 WHERE `kode_desa` = '3304080016' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 15, `desa_id` = 206 WHERE `kode_desa` = '3304020006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 101 WHERE `kode_desa` = '3304080009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 114 WHERE `kode_desa` = '3304030011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 16, `desa_id` = 210 WHERE `kode_desa` = '3304110004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 12 WHERE `kode_desa` = '3304090014' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 222 WHERE `kode_desa` = '3304070006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 162 WHERE `kode_desa` = '3304150001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 16, `desa_id` = 213 WHERE `kode_desa` = '3304110002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 233 WHERE `kode_desa` = '3304070014' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 45 WHERE `kode_desa` = '3304050016' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 16, `desa_id` = 216 WHERE `kode_desa` = '3304110007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 116 WHERE `kode_desa` = '3304030008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 270 WHERE `kode_desa` = '3304170004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 96 WHERE `kode_desa` = '3304080010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 140 WHERE `kode_desa` = '3304140014' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 3, `desa_id` = 37 WHERE `kode_desa` = '3304160003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 145 WHERE `kode_desa` = '3304140005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 6, `desa_id` = 75 WHERE `kode_desa` = '3304130003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 16, `desa_id` = 219 WHERE `kode_desa` = '3304110001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 6 WHERE `kode_desa` = '3304090012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 72 WHERE `kode_desa` = '3304180021' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 185 WHERE `kode_desa` = '3304120004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 139 WHERE `kode_desa` = '3304140003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 245 WHERE `kode_desa` = '3304010014' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 61 WHERE `kode_desa` = '3304180006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 157 WHERE `kode_desa` = '3304150009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 57 WHERE `kode_desa` = '3304180004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 269 WHERE `kode_desa` = '3304170015' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 47 WHERE `kode_desa` = '3304050007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 42 WHERE `kode_desa` = '3304050019' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 166 WHERE `kode_desa` = '3304150013' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 59 WHERE `kode_desa` = '3304180019' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 131 WHERE `kode_desa` = '3304140002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 6, `desa_id` = 81 WHERE `kode_desa` = '3304130008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 271 WHERE `kode_desa` = '3304170005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 88 WHERE `kode_desa` = '3304080011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 6, `desa_id` = 77 WHERE `kode_desa` = '3304130009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 10 WHERE `kode_desa` = '3304090008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 144 WHERE `kode_desa` = '3304140010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 6, `desa_id` = 76 WHERE `kode_desa` = '3304130010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 11, `desa_id` = 151 WHERE `kode_desa` = '3304181006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 16, `desa_id` = 215 WHERE `kode_desa` = '3304110008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 6, `desa_id` = 83 WHERE `kode_desa` = '3304130004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 15, `desa_id` = 205 WHERE `kode_desa` = '3304020002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 58 WHERE `kode_desa` = '3304180020' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 105 WHERE `kode_desa` = '3304080008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 9 WHERE `kode_desa` = '3304090015' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 171 WHERE `kode_desa` = '3304150003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 15, `desa_id` = 202 WHERE `kode_desa` = '3304020005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 49 WHERE `kode_desa` = '3304050014' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 178 WHERE `kode_desa` = '3304120011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 17 WHERE `kode_desa` = '3304090009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 248 WHERE `kode_desa` = '3304010005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 228 WHERE `kode_desa` = '3304070008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 163 WHERE `kode_desa` = '3304150015' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 9, `desa_id` = 122 WHERE `kode_desa` = '3304061001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 16, `desa_id` = 214 WHERE `kode_desa` = '3304110005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 40 WHERE `kode_desa` = '3304050017' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 14, `desa_id` = 189 WHERE `kode_desa` = '3304040013' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 161 WHERE `kode_desa` = '3304150017' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 3, `desa_id` = 34 WHERE `kode_desa` = '3304160006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 141 WHERE `kode_desa` = '3304140006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 249 WHERE `kode_desa` = '3304010001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 6, `desa_id` = 84 WHERE `kode_desa` = '3304130005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 4 WHERE `kode_desa` = '3304090006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 133 WHERE `kode_desa` = '3304140007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 19, `desa_id` = 255 WHERE `kode_desa` = '3304100002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 231 WHERE `kode_desa` = '3304070002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 108 WHERE `kode_desa` = '3304030012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 53 WHERE `kode_desa` = '3304050001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 6, `desa_id` = 78 WHERE `kode_desa` = '3304130012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 143 WHERE `kode_desa` = '3304140013' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 86 WHERE `kode_desa` = '3304080003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 176 WHERE `kode_desa` = '3304120008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 136 WHERE `kode_desa` = '3304140011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 2, `desa_id` = 18 WHERE `kode_desa` = '3304060008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 11, `desa_id` = 152 WHERE `kode_desa` = '3304181004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 132 WHERE `kode_desa` = '3304140015' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 19, `desa_id` = 254 WHERE `kode_desa` = '3304100006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 175 WHERE `kode_desa` = '3304120012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 87 WHERE `kode_desa` = '3304080015' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 170 WHERE `kode_desa` = '3304150011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 268 WHERE `kode_desa` = '3304170007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 118 WHERE `kode_desa` = '3304030014' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 117 WHERE `kode_desa` = '3304030016' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 54 WHERE `kode_desa` = '3304050010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 19, `desa_id` = 261 WHERE `kode_desa` = '3304100005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 15 WHERE `kode_desa` = '3304090017' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 121 WHERE `kode_desa` = '3304030005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 44 WHERE `kode_desa` = '3304050020' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 66 WHERE `kode_desa` = '3304180011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 19, `desa_id` = 256 WHERE `kode_desa` = '3304100011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 14, `desa_id` = 200 WHERE `kode_desa` = '3304040008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 187 WHERE `kode_desa` = '3304120017' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 48 WHERE `kode_desa` = '3304050005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 146 WHERE `kode_desa` = '3304140016' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 52 WHERE `kode_desa` = '3304050013' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 16 WHERE `kode_desa` = '3304090013' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 264 WHERE `kode_desa` = '3304170006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 46 WHERE `kode_desa` = '3304050002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 19, `desa_id` = 252 WHERE `kode_desa` = '3304100010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 4, `desa_id` = 55 WHERE `kode_desa` = '3304050008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 186 WHERE `kode_desa` = '3304120015' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 239 WHERE `kode_desa` = '3304010012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 236 WHERE `kode_desa` = '3304010009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 64 WHERE `kode_desa` = '3304180024' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 109 WHERE `kode_desa` = '3304030002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 14, `desa_id` = 192 WHERE `kode_desa` = '3304040011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 89 WHERE `kode_desa` = '3304080004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 11, `desa_id` = 150 WHERE `kode_desa` = '3304181005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 6, `desa_id` = 74 WHERE `kode_desa` = '3304130011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 14, `desa_id` = 201 WHERE `kode_desa` = '3304040012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 91 WHERE `kode_desa` = '3304080018' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 16, `desa_id` = 211 WHERE `kode_desa` = '3304110009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 5 WHERE `kode_desa` = '3304090001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 15, `desa_id` = 207 WHERE `kode_desa` = '3304020004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 9, `desa_id` = 125 WHERE `kode_desa` = '3304061003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 16, `desa_id` = 217 WHERE `kode_desa` = '3304110011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 113 WHERE `kode_desa` = '3304030003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 181 WHERE `kode_desa` = '3304120007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 167 WHERE `kode_desa` = '3304150012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 14, `desa_id` = 197 WHERE `kode_desa` = '3304040006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 15, `desa_id` = 204 WHERE `kode_desa` = '3304020008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 234 WHERE `kode_desa` = '3304070004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 16, `desa_id` = 220 WHERE `kode_desa` = '3304110006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 70 WHERE `kode_desa` = '3304180018' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 16, `desa_id` = 212 WHERE `kode_desa` = '3304110010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 135 WHERE `kode_desa` = '3304140004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 172 WHERE `kode_desa` = '3304120005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 11, `desa_id` = 149 WHERE `kode_desa` = '3304181002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 183 WHERE `kode_desa` = '3304120001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 62 WHERE `kode_desa` = '3304180007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 111 WHERE `kode_desa` = '3304030004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 276 WHERE `kode_desa` = '3304170012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 19, `desa_id` = 258 WHERE `kode_desa` = '3304100009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 11, `desa_id` = 147 WHERE `kode_desa` = '3304181003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 99 WHERE `kode_desa` = '3304080020' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 250 WHERE `kode_desa` = '3304010013' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 272 WHERE `kode_desa` = '3304170017' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 103 WHERE `kode_desa` = '3304080017' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 179 WHERE `kode_desa` = '3304120016' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 11, `desa_id` = 154 WHERE `kode_desa` = '3304181008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 188 WHERE `kode_desa` = '3304120002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 174 WHERE `kode_desa` = '3304120010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 14, `desa_id` = 191 WHERE `kode_desa` = '3304040003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 14, `desa_id` = 190 WHERE `kode_desa` = '3304040010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 3, `desa_id` = 38 WHERE `kode_desa` = '3304160002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 15, `desa_id` = 203 WHERE `kode_desa` = '3304020007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 184 WHERE `kode_desa` = '3304120003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 263 WHERE `kode_desa` = '3304170003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 137 WHERE `kode_desa` = '3304140012' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 6, `desa_id` = 79 WHERE `kode_desa` = '3304130013' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 63 WHERE `kode_desa` = '3304180022' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 232 WHERE `kode_desa` = '3304070013' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 14, `desa_id` = 198 WHERE `kode_desa` = '3304040007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 14, `desa_id` = 196 WHERE `kode_desa` = '3304040005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 240 WHERE `kode_desa` = '3304010006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 104 WHERE `kode_desa` = '3304080014' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 226 WHERE `kode_desa` = '3304070010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 168 WHERE `kode_desa` = '3304150016' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 273 WHERE `kode_desa` = '3304170010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 9, `desa_id` = 124 WHERE `kode_desa` = '3304061006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 3, `desa_id` = 32 WHERE `kode_desa` = '3304160001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 241 WHERE `kode_desa` = '3304010007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 173 WHERE `kode_desa` = '3304120006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 156 WHERE `kode_desa` = '3304150002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 119 WHERE `kode_desa` = '3304030001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 277 WHERE `kode_desa` = '3304170013' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 15, `desa_id` = 209 WHERE `kode_desa` = '3304020003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 8, `desa_id` = 110 WHERE `kode_desa` = '3304030006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 9, `desa_id` = 130 WHERE `kode_desa` = '3304061009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 10, `desa_id` = 142 WHERE `kode_desa` = '3304140001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 11, `desa_id` = 153 WHERE `kode_desa` = '3304181001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 11 WHERE `kode_desa` = '3304090010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 227 WHERE `kode_desa` = '3304070003' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 3, `desa_id` = 36 WHERE `kode_desa` = '3304160008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 2, `desa_id` = 29 WHERE `kode_desa` = '3304060011' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 14, `desa_id` = 193 WHERE `kode_desa` = '3304040001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 9, `desa_id` = 127 WHERE `kode_desa` = '3304061007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 5, `desa_id` = 67 WHERE `kode_desa` = '3304180023' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 17, `desa_id` = 229 WHERE `kode_desa` = '3304070001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 275 WHERE `kode_desa` = '3304170001' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 14, `desa_id` = 199 WHERE `kode_desa` = '3304040002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 9, `desa_id` = 123 WHERE `kode_desa` = '3304061008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 182 WHERE `kode_desa` = '3304120013' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 238 WHERE `kode_desa` = '3304010008' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 1, `desa_id` = 14 WHERE `kode_desa` = '3304090007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 12, `desa_id` = 158 WHERE `kode_desa` = '3304150004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 20, `desa_id` = 265 WHERE `kode_desa` = '3304170014' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 6, `desa_id` = 73 WHERE `kode_desa` = '3304130006' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 9, `desa_id` = 128 WHERE `kode_desa` = '3304061005' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 2, `desa_id` = 19 WHERE `kode_desa` = '3304060010' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 2, `desa_id` = 30 WHERE `kode_desa` = '3304060009' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 9, `desa_id` = 129 WHERE `kode_desa` = '3304061004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 3, `desa_id` = 35 WHERE `kode_desa` = '3304160007' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 246 WHERE `kode_desa` = '3304010002' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 14, `desa_id` = 194 WHERE `kode_desa` = '3304040004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 7, `desa_id` = 90 WHERE `kode_desa` = '3304080019' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 18, `desa_id` = 247 WHERE `kode_desa` = '3304010004' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 13, `desa_id` = 180 WHERE `kode_desa` = '3304120014' AND `tahun` = 2024;
UPDATE `fsva_desa_indikator` SET `kecamatan_id` = 9, `desa_id` = 126 WHERE `kode_desa` = '3304061002' AND `tahun` = 2024;

-- 10. Tambah index & constraint FK pada fsva_desa_indikator
SET @exist := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND INDEX_NAME = 'idx_fsva_kec');
SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD INDEX `idx_fsva_kec` (`kecamatan_id`)', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND INDEX_NAME = 'idx_fsva_desa');
SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD INDEX `idx_fsva_desa` (`desa_id`)', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND CONSTRAINT_NAME = 'fk_fsva_kecamatan');
SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD CONSTRAINT `fk_fsva_kecamatan` FOREIGN KEY (`kecamatan_id`) REFERENCES `kecamatan` (`id`) ON DELETE CASCADE', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND CONSTRAINT_NAME = 'fk_fsva_desa');
SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD CONSTRAINT `fk_fsva_desa` FOREIGN KEY (`desa_id`) REFERENCES `desa` (`id`) ON DELETE CASCADE', 'SELECT 1');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET FOREIGN_KEY_CHECKS = 1;
