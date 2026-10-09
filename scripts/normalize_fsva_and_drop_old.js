import path from "node:path";
import { execSync } from "node:child_process";
import { q } from "../src/db.js";
import { normKey } from "../src/lib/domains.js";

const DESA_PHONETIC_FIXES = {
  "12_pegundungan": "pagundungan",
  "12_sarwodadi": "sarwadadi",
  "17_singamerta": "singomerto",
  "17_tunggara": "tunggoro",
  "20_pagergunung": "pegergunung",
  "6_purwodadi": "purwadadi",
  "18_panerusankulon": "panarusankulon",
  "18_panerusanwetan": "panarusanwetan",
  "14_pucungbedug": "pucungbeduk"
};

async function executeMigration() {
  console.log("=== 0. PASTIKAN TABEL ACTIVITY_LOGS TERSEDIA ===");
  await q(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
      user_id int(10) unsigned DEFAULT NULL,
      username varchar(50) NOT NULL DEFAULT 'guest',
      nama_lengkap varchar(100) DEFAULT NULL,
      role varchar(50) NOT NULL DEFAULT 'guest',
      action varchar(50) NOT NULL,
      entity varchar(100) DEFAULT NULL,
      description text NOT NULL,
      ip_address varchar(45) DEFAULT NULL,
      user_agent text DEFAULT NULL,
      status enum('success','failed','warning') DEFAULT 'success',
      metadata longtext DEFAULT NULL,
      created_at datetime NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (id),
      KEY idx_created_at (created_at),
      KEY idx_username (username),
      KEY idx_action (action),
      KEY idx_role (role),
      KEY idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("Tabel activity_logs siap.");

  console.log("\n=== 1. DROP TABEL USANG fsva_indikator_kabupaten ===");
  await q("DROP TABLE IF EXISTS fsva_indikator_kabupaten");
  console.log("Berhasil drop tabel fsva_indikator_kabupaten.");

  console.log("\n=== 2. PASTIKAN TABEL & DATA FSVA DESA TERSEDIA ===");
  const [tblCheck] = await q("SELECT COUNT(*) AS c FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator'");
  if (tblCheck.c === 0) {
    console.log("Tabel fsva_desa_indikator belum ditemukan di database. Mengimpor data validasi FSVA Desa terlebih dahulu...");
    execSync(`node "${path.resolve(process.cwd(), "scripts/import_fsva_desa.js")}"`, { stdio: "inherit", env: process.env });
  } else {
    const [{ count }] = await q("SELECT COUNT(*) AS count FROM fsva_desa_indikator");
    if (count === 0) {
      console.log("Tabel fsva_desa_indikator masih kosong. Mengimpor data validasi FSVA Desa...");
      execSync(`node "${path.resolve(process.cwd(), "scripts/import_fsva_desa.js")}"`, { stdio: "inherit", env: process.env });
    }
  }

  console.log("\n=== 3. TAMBAH KOLOM RELASIONAL & KODE BPS ===");
  const kCols = (await q("DESCRIBE kecamatan")).map(c => c.Field);
  if (!kCols.includes("kode")) {
    await q("ALTER TABLE kecamatan ADD COLUMN kode VARCHAR(20) NULL AFTER id");
    console.log("Kolom 'kode' ditambahkan ke tabel kecamatan.");
  }

  const dCols = (await q("DESCRIBE desa")).map(c => c.Field);
  if (!dCols.includes("kode")) {
    await q("ALTER TABLE desa ADD COLUMN kode VARCHAR(20) NULL AFTER id");
    console.log("Kolom 'kode' ditambahkan ke tabel desa.");
  }
  if (!dCols.includes("tipe")) {
    await q("ALTER TABLE desa ADD COLUMN tipe ENUM('Desa', 'Kelurahan') DEFAULT 'Desa' AFTER nama");
    console.log("Kolom 'tipe' ditambahkan ke tabel desa.");
  }

  const fCols = (await q("DESCRIBE fsva_desa_indikator")).map(c => c.Field);
  if (!fCols.includes("kecamatan_id")) {
    await q("ALTER TABLE fsva_desa_indikator ADD COLUMN kecamatan_id INT NULL AFTER tahun");
    console.log("Kolom 'kecamatan_id' ditambahkan ke tabel fsva_desa_indikator.");
  }
  if (!fCols.includes("desa_id")) {
    await q("ALTER TABLE fsva_desa_indikator ADD COLUMN desa_id INT NULL AFTER kecamatan_id");
    console.log("Kolom 'desa_id' ditambahkan ke tabel fsva_desa_indikator.");
  }

  console.log("\n=== 4. SINKRONISASI RELASI 278 DESA & KODE BPS ===");
  const kRows = await q("SELECT id, nama FROM kecamatan");
  const dRows = await q("SELECT id, kecamatan_id, nama FROM desa");
  const fRows = await q("SELECT id, kode_kec, nama_kecamatan, kode_desa, nama_desa FROM fsva_desa_indikator");

  const kecMap = new Map();
  for (const k of kRows) kecMap.set(normKey(k.nama), k);
  kecMap.set("purwarejaklampok", kecMap.get("purwarejaklampok") || kecMap.get("klampok"));

  function cleanDesaKey(name) {
    let s = normKey(name);
    return s.replace(/^kelurahan/, "").replace(/^kel/, "").replace(/^desa/, "");
  }

  const desaMap = new Map();
  for (const d of dRows) {
    desaMap.set(`${d.kecamatan_id}_${cleanDesaKey(d.nama)}`, d);
  }

  let updatedCount = 0;
  for (const f of fRows) {
    const k = kecMap.get(normKey(f.nama_kecamatan));
    let cKey = cleanDesaKey(f.nama_desa);
    const lookupKey = `${k.id}_${cKey}`;
    const altKey = DESA_PHONETIC_FIXES[lookupKey] ? `${k.id}_${DESA_PHONETIC_FIXES[lookupKey]}` : lookupKey;
    const d = desaMap.get(altKey);

    if (d) {
      // Update kecamatan kode jika belum ada
      await q("UPDATE kecamatan SET kode = ? WHERE id = ? AND (kode IS NULL OR kode = '')", [f.kode_kec, k.id]);
      
      // Update desa kode dan tipe jika kelurahan
      const isKel = d.nama.toLowerCase().includes("kel.") || d.nama.toLowerCase().includes("kelurahan");
      await q("UPDATE desa SET kode = ?, tipe = ? WHERE id = ?", [f.kode_desa, isKel ? "Kelurahan" : "Desa", d.id]);

      // Update fsva_desa_indikator kecamatan_id & desa_id
      await q("UPDATE fsva_desa_indikator SET kecamatan_id = ?, desa_id = ? WHERE id = ?", [k.id, d.id, f.id]);
      updatedCount++;
    } else {
      console.error(`Tidak cocok: ${f.nama_kecamatan} -> ${f.nama_desa}`);
    }
  }

  console.log(`Berhasil menghubungkan ${updatedCount} dari ${fRows.length} baris fsva_desa_indikator.`);

  console.log("\n=== 5. TERAPKAN NOT NULL & INDEX FOREIGN KEY ===");
  try {
    const cols = await q("SHOW COLUMNS FROM fsva_desa_indikator LIKE 'desa_id'");
    if (cols[0]?.Null === "YES") {
      await q("ALTER TABLE fsva_desa_indikator MODIFY COLUMN kecamatan_id INT NOT NULL, MODIFY COLUMN desa_id INT NOT NULL");
      console.log("Kolom kecamatan_id dan desa_id diubah menjadi NOT NULL.");
    }
  } catch {}

  // Tambahkan Index jika belum ada
  try {
    const [idxKec] = await q("SHOW INDEX FROM fsva_desa_indikator WHERE Key_name = 'idx_fsva_kec'");
    if (!idxKec) await q("ALTER TABLE fsva_desa_indikator ADD INDEX idx_fsva_kec (kecamatan_id)");
  } catch {}
  try {
    const [idxDes] = await q("SHOW INDEX FROM fsva_desa_indikator WHERE Key_name = 'idx_fsva_desa'");
    if (!idxDes) await q("ALTER TABLE fsva_desa_indikator ADD INDEX idx_fsva_desa (desa_id)");
  } catch {}

  // Tambahkan Foreign Key jika belum ada
  try {
    const [fkKec] = await q("SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND CONSTRAINT_NAME = 'fk_fsva_kecamatan'");
    if (!fkKec) await q("ALTER TABLE fsva_desa_indikator ADD CONSTRAINT fk_fsva_kecamatan FOREIGN KEY (kecamatan_id) REFERENCES kecamatan(id) ON DELETE CASCADE");
  } catch {}
  try {
    const [fkDes] = await q("SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fsva_desa_indikator' AND CONSTRAINT_NAME = 'fk_fsva_desa'");
    if (!fkDes) {
      await q("ALTER TABLE fsva_desa_indikator ADD CONSTRAINT fk_fsva_desa FOREIGN KEY (desa_id) REFERENCES desa(id) ON DELETE CASCADE");
      console.log("Foreign Key constraints fk_fsva_kecamatan & fk_fsva_desa aktif!");
    }
  } catch {}

  console.log("\n=== MIGRATION SELESAI SUKSES! ===");
}

executeMigration().then(() => process.exit(0)).catch(e => {
  console.error("Migration error:", e);
  process.exit(1);
});
