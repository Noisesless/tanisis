import { q } from "../src/db.js";
import fs from "node:fs";

async function generateSql() {
  const lines = [];
  lines.push("-- =========================================================================");
  lines.push("-- PRODUCTION PATCH: NORMALISASI RELASIONAL DESA & KECAMATAN");
  lines.push("-- Generated: " + new Date().toISOString());
  lines.push("-- =========================================================================\n");
  lines.push("SET FOREIGN_KEY_CHECKS = 0;\n");

  // 1. Drop tabel usang
  lines.push("-- 1. Drop tabel usang fsva_indikator_kabupaten");
  lines.push("DROP TABLE IF EXISTS `fsva_indikator_kabupaten`;\n");

  // 2. Buat tabel activity_logs jika belum ada
  lines.push("-- 2. Buat tabel activity_logs jika belum ada");
  const [actCreate] = await q("SHOW CREATE TABLE activity_logs");
  const cleanCreate = actCreate["Create Table"]
    .replace("CREATE TABLE", "CREATE TABLE IF NOT EXISTS")
    .replace(/AUTO_INCREMENT=\d+\s*/, "");
  lines.push(cleanCreate + ";\n");

  // 3. Tambah kolom kode & tipe di kecamatan dan desa
  lines.push("-- 3. Tambah kolom pada tabel kecamatan & desa");
  lines.push("SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'kecamatan' AND COLUMN_NAME = 'kode');");
  lines.push("SET @query := IF(@exist = 0, 'ALTER TABLE `kecamatan` ADD COLUMN `kode` varchar(20) DEFAULT NULL AFTER `id`', 'SELECT 1');");
  lines.push("PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;\n");

  lines.push("SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'desa' AND COLUMN_NAME = 'kode');");
  lines.push("SET @query := IF(@exist = 0, 'ALTER TABLE `desa` ADD COLUMN `kode` varchar(20) DEFAULT NULL AFTER `id`', 'SELECT 1');");
  lines.push("PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;\n");

  lines.push("SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'desa' AND COLUMN_NAME = 'tipe');");
  lines.push("SET @query := IF(@exist = 0, 'ALTER TABLE `desa` ADD COLUMN `tipe` enum(\\'Desa\\',\\'Kelurahan\\') DEFAULT \\'Desa\\' AFTER `nama`', 'SELECT 1');");
  lines.push("PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;\n");

  // 4. Tambah kolom di fsva_desa_indikator
  lines.push("-- 4. Tambah kolom relasi di fsva_desa_indikator");
  lines.push("SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND COLUMN_NAME = 'kecamatan_id');");
  lines.push("SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD COLUMN `kecamatan_id` int(11) NULL AFTER `tahun`', 'SELECT 1');");
  lines.push("PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;\n");

  lines.push("SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND COLUMN_NAME = 'desa_id');");
  lines.push("SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD COLUMN `desa_id` int(11) NULL AFTER `kecamatan_id`', 'SELECT 1');");
  lines.push("PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;\n");

  // 5. Update data kode kecamatan
  lines.push("-- 5. Update data kode kecamatan");
  const kecs = await q("SELECT id, kode FROM kecamatan WHERE kode IS NOT NULL");
  for (const k of kecs) {
    lines.push(`UPDATE \`kecamatan\` SET \`kode\` = '${k.kode}' WHERE \`id\` = ${k.id};`);
  }
  lines.push("");

  // 6. Update data kode dan tipe desa
  lines.push("-- 6. Update data kode dan tipe desa");
  const desas = await q("SELECT id, kode, tipe FROM desa WHERE kode IS NOT NULL");
  for (const d of desas) {
    lines.push(`UPDATE \`desa\` SET \`kode\` = '${d.kode}', \`tipe\` = '${d.tipe}' WHERE \`id\` = ${d.id};`);
  }
  lines.push("");

  // 7. Update fsva_desa_indikator FK
  lines.push("-- 7. Hubungkan fsva_desa_indikator dengan foreign keys");
  const fsvas = await q("SELECT id, kecamatan_id, desa_id FROM fsva_desa_indikator WHERE kecamatan_id IS NOT NULL AND desa_id IS NOT NULL");
  for (const f of fsvas) {
    lines.push(`UPDATE \`fsva_desa_indikator\` SET \`kecamatan_id\` = ${f.kecamatan_id}, \`desa_id\` = ${f.desa_id} WHERE \`id\` = ${f.id};`);
  }
  lines.push("");

  // 8. Terapkan NOT NULL, Index & FK Constraints
  lines.push("-- 8. Modifikasi kolom menjadi NOT NULL, tambah index & constraint FK");
  lines.push("ALTER TABLE `fsva_desa_indikator` MODIFY COLUMN `kecamatan_id` int(11) NOT NULL, MODIFY COLUMN `desa_id` int(11) NOT NULL;\n");

  lines.push("SET @exist := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND INDEX_NAME = 'idx_fsva_kec');");
  lines.push("SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD INDEX `idx_fsva_kec` (`kecamatan_id`)', 'SELECT 1');");
  lines.push("PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;\n");

  lines.push("SET @exist := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND INDEX_NAME = 'idx_fsva_desa');");
  lines.push("SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD INDEX `idx_fsva_desa` (`desa_id`)', 'SELECT 1');");
  lines.push("PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;\n");

  lines.push("SET @exist := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND CONSTRAINT_NAME = 'fk_fsva_kecamatan');");
  lines.push("SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD CONSTRAINT `fk_fsva_kecamatan` FOREIGN KEY (`kecamatan_id`) REFERENCES `kecamatan` (`id`) ON DELETE CASCADE', 'SELECT 1');");
  lines.push("PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;\n");

  lines.push("SET @exist := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND CONSTRAINT_NAME = 'fk_fsva_desa');");
  lines.push("SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD CONSTRAINT `fk_fsva_desa` FOREIGN KEY (`desa_id`) REFERENCES `desa` (`id`) ON DELETE CASCADE', 'SELECT 1');");
  lines.push("PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;\n");

  lines.push("SET FOREIGN_KEY_CHECKS = 1;\n");

  fs.writeFileSync("database/patch_production_normalization_2026.sql", lines.join("\n"));
  console.log("Successfully wrote database/patch_production_normalization_2026.sql (" + lines.length + " lines)");
  process.exit(0);
}

generateSql().catch(e => {
  console.error("Error:", e);
  process.exit(1);
});
