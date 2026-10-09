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
  lines.push("-- 1. Drop tabel usang fsva_indikator_kabupaten & kwt_kelompok_wanita_tani");
  lines.push("DROP TABLE IF EXISTS `fsva_indikator_kabupaten`;");
  lines.push("DROP TABLE IF EXISTS `kwt_kelompok_wanita_tani`;");
  lines.push("DROP TABLE IF EXISTS `kwt`;\n");

  // 2. Buat tabel activity_logs jika belum ada
  lines.push("-- 2. Buat tabel activity_logs jika belum ada");
  const [actCreate] = await q("SHOW CREATE TABLE activity_logs");
  const cleanActCreate = actCreate["Create Table"]
    .replace("CREATE TABLE", "CREATE TABLE IF NOT EXISTS")
    .replace(/AUTO_INCREMENT=\d+\s*/, "");
  lines.push(cleanActCreate + ";\n");

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

  // 4. Update data kode kecamatan
  lines.push("-- 4. Update data kode kecamatan");
  const kecs = await q("SELECT id, kode FROM kecamatan WHERE kode IS NOT NULL");
  for (const k of kecs) {
    lines.push(`UPDATE \`kecamatan\` SET \`kode\` = '${k.kode}' WHERE \`id\` = ${k.id};`);
  }
  lines.push("");

  // 5. Update data kode dan tipe desa
  lines.push("-- 5. Update data kode dan tipe desa");
  const desas = await q("SELECT id, kode, tipe FROM desa WHERE kode IS NOT NULL");
  for (const d of desas) {
    lines.push(`UPDATE \`desa\` SET \`kode\` = '${d.kode}', \`tipe\` = '${d.tipe}' WHERE \`id\` = ${d.id};`);
  }
  lines.push("");

  // 6. Buat tabel fsva_desa_indikator jika belum ada
  lines.push("-- 6. Buat tabel fsva_desa_indikator jika belum ada");
  const [fsvaCreate] = await q("SHOW CREATE TABLE fsva_desa_indikator");
  const cleanFsvaCreate = fsvaCreate["Create Table"]
    .replace("CREATE TABLE", "CREATE TABLE IF NOT EXISTS")
    .replace(/AUTO_INCREMENT=\d+\s*/, "");
  lines.push(cleanFsvaCreate + ";\n");

  // 7. Tambah kolom relasi di fsva_desa_indikator jika tabel sudah ada sebelumnya tanpa kolom relasi
  lines.push("-- 7. Tambah kolom relasi di fsva_desa_indikator jika belum ada");
  lines.push("SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND COLUMN_NAME = 'kecamatan_id');");
  lines.push("SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD COLUMN `kecamatan_id` tinyint(3) unsigned NOT NULL AFTER `tahun`', 'SELECT 1');");
  lines.push("PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;\n");

  lines.push("SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND COLUMN_NAME = 'desa_id');");
  lines.push("SET @query := IF(@exist = 0, 'ALTER TABLE `fsva_desa_indikator` ADD COLUMN `desa_id` smallint(5) unsigned NOT NULL AFTER `kecamatan_id`', 'SELECT 1');");
  lines.push("PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;\n");

  // 8. Seeding data 278 desa ke fsva_desa_indikator
  lines.push("-- 8. Isi/Perbarui data 278 desa ke fsva_desa_indikator");
  const rows = await q("SELECT * FROM fsva_desa_indikator");
  if (rows.length > 0) {
    const cols = [
      "tahun", "kecamatan_id", "desa_id", "kode_kec", "nama_kecamatan", "kode_desa", "nama_desa", "object_id",
      "luas_wilayah_ha", "jumlah_penduduk", "jumlah_rt", "kepadatan_penduduk", "luas_lahan_ha", "sarpras_pangan_unit",
      "penduduk_miskin_jiwa", "tanpa_akses", "rt_tanpa_air_bersih", "jumlah_nakes", "rasio_lahan", "rasio_sarana",
      "rasio_miskin", "rasio_air_bersih", "rasio_nakes", "ikp", "komposit", "ikp_ranking"
    ];
    lines.push(`INSERT IGNORE INTO \`fsva_desa_indikator\` (${cols.map(c => `\`${c}\``).join(", ")}) VALUES`);
    const valChunks = [];
    for (const r of rows) {
      const vals = cols.map(c => {
        const v = r[c];
        if (v === null || v === undefined) return "NULL";
        if (typeof v === "number") return v;
        return `'${String(v).replace(/'/g, "''")}'`;
      });
      valChunks.push(`(${vals.join(", ")})`);
    }
    lines.push(valChunks.join(",\n") + ";\n");
  }

  // 9. Pastikan FK update jika ada data lama yang belum terhubung
  lines.push("-- 9. Hubungkan fsva_desa_indikator dengan foreign keys (fallback jika tabel sudah ada)");
  for (const f of rows) {
    lines.push(`UPDATE \`fsva_desa_indikator\` SET \`kecamatan_id\` = ${f.kecamatan_id}, \`desa_id\` = ${f.desa_id} WHERE \`kode_desa\` = '${f.kode_desa}' AND \`tahun\` = ${f.tahun};`);
  }
  lines.push("");

  // 10. Terapkan Index & FK Constraints
  lines.push("-- 10. Tambah index & constraint FK pada fsva_desa_indikator");
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
