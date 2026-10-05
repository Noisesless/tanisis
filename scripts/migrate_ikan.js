// scripts/migrate_ikan.js
// Migrasi & seeder 10 jenis ikan, penambahan Bubu, dan kolom luas di tabel perikanan
import { q } from "../src/db.js";
import ExcelJS from "exceljs";

async function run() {
  console.log("== 1. Buat / Update Tabel ikan_produksi_jenis ==");
  await q(`
    CREATE TABLE IF NOT EXISTS ikan_produksi_jenis (
      id INT AUTO_INCREMENT PRIMARY KEY,
      kecamatan_id TINYINT UNSIGNED NULL,
      nama_kecamatan VARCHAR(50) DEFAULT 'Kabupaten Banjarnegara',
      tahun SMALLINT UNSIGNED NOT NULL,
      jenis_ikan VARCHAR(50) NOT NULL,
      produksi_kg DOUBLE NOT NULL DEFAULT 0,
      luas_ha DOUBLE NOT NULL DEFAULT 0,
      nilai_ekonomi_rp DOUBLE NOT NULL DEFAULT 0,
      sumber VARCHAR(60) DEFAULT 'Data produksi 2020-2025.xlsx',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_tahun (tahun),
      INDEX idx_jenis (jenis_ikan),
      INDEX idx_kecamatan (kecamatan_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✓ Tabel ikan_produksi_jenis siap.");

  // Import data 10 jenis ikan dari Excel resmi klien
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile("./dist/Data produksi 2020-2025.xlsx");
  const sheet = wb.getWorksheet(1);

  await q("DELETE FROM ikan_produksi_jenis WHERE sumber = 'Data produksi 2020-2025.xlsx'");

  const years = [2020, 2021, 2022, 2023, 2024, 2025];
  let inserted = 0;

  for (let rowIdx = 6; rowIdx <= 15; rowIdx++) {
    const row = sheet.getRow(rowIdx);
    const jenis = String(row.getCell(2).value || "").trim();
    if (!jenis) continue;

    for (let colIdx = 3; colIdx <= 8; colIdx++) {
      const year = years[colIdx - 3];
      const val = row.getCell(colIdx).value;
      const produksiKg = typeof val === "number" ? val : (parseFloat(val) || 0);

      await q(
        "INSERT INTO ikan_produksi_jenis (kecamatan_id, nama_kecamatan, tahun, jenis_ikan, produksi_kg, luas_ha, nilai_ekonomi_rp, sumber) VALUES (NULL, ?, ?, ?, ?, 0, 0, ?)",
        ["Kabupaten Banjarnegara", year, jenis, produksiKg, "Data produksi 2020-2025.xlsx"]
      );
      inserted++;
    }
  }
  console.log(`✓ Berhasil insert ${inserted} data riil 10 jenis ikan 2020-2025 (Rekap Kabupaten).`);

  console.log("== 2. Periksa / Tambahkan Kolom Luas di ikan_hias & ikan_benih ==");
  try {
    await q("ALTER TABLE ikan_hias ADD COLUMN luas_m2 DECIMAL(10,2) DEFAULT 0 AFTER volume_ekor");
    console.log("✓ Kolom luas_m2 ditambahkan ke ikan_hias.");
  } catch (err) {
    if (err.message.includes("Duplicate column name")) {
      console.log("ℹ Kolom luas_m2 sudah ada di ikan_hias.");
    } else {
      console.warn("Peringatan ikan_hias:", err.message);
    }
  }

  try {
    await q("ALTER TABLE ikan_benih ADD COLUMN luas_ha DECIMAL(10,2) DEFAULT 0 AFTER jumlah_ekor");
    console.log("✓ Kolom luas_ha ditambahkan ke ikan_benih.");
  } catch (err) {
    if (err.message.includes("Duplicate column name")) {
      console.log("ℹ Kolom luas_ha sudah ada di ikan_benih.");
    } else {
      console.warn("Peringatan ikan_benih:", err.message);
    }
  }

  console.log("== 3. Pastikan Kategori Bubu Ada di ikan_tangkap ==");
  const bubuCheck = await q("SELECT COUNT(*) as c FROM ikan_tangkap WHERE jenis_alat = 'Bubu'");
  if (bubuCheck[0].c === 0) {
    // Ambil tahun terbaru dan kecamatan dari ikan_tangkap
    const kecList = await q("SELECT DISTINCT kecamatan_id FROM ikan_tangkap");
    const yearsTangkap = [2022, 2023, 2024];
    let bubuInserted = 0;
    for (const kec of kecList) {
      for (const y of yearsTangkap) {
        await q(
          "INSERT INTO ikan_tangkap (kecamatan_id, jenis_alat, tahun, produksi_kg, nilai_ribu_rp, sumber) VALUES (?, 'Bubu', ?, 0, 0, 'manual')",
          [kec.kecamatan_id, y]
        );
        bubuInserted++;
      }
    }
    console.log(`✓ Ditambahkan ${bubuInserted} baris placeholder alat tangkap Bubu untuk 20 kecamatan.`);
  } else {
    console.log(`ℹ Alat tangkap Bubu sudah terdaftar (${bubuCheck[0].c} baris).`);
  }

  console.log("== SELESAI ==");
  process.exit(0);
}

run().catch((err) => {
  console.error("Gagal migrasi:", err);
  process.exit(1);
});
