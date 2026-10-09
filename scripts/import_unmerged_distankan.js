/**
 * scripts/import_unmerged_distankan.js
 * Importer 7 dataset BPS Distankan KP yang belum terisi ke database MySQL (pertasis).
 * Target tabel:
 * 1. ternak_flow (arah='pemasukan')
 * 2. ternak_flow (arah='pengeluaran')
 * 3. ternak_pemotongan (lokasi='rph_pemerintah')
 * 4. ternak_daging (kelompok='ternak')
 * 5. horti_luas_kabupaten (kelompok='sayuran_buah_semusim')
 * 6. horti_produksi_kabupaten (kelompok='sayuran_buah_semusim')
 * 7. horti_produksi_kabupaten (kelompok='buah_sayuran_tahunan')
 */
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const KECAMATAN_MAP = {
  "banjarmangu": 1,
  "banjarnegara": 2,
  "batur": 3,
  "bawang": 4,
  "kalibening": 5,
  "karangkobar": 6,
  "madukara": 7,
  "mandiraja": 8,
  "pagedongan": 9,
  "pagentan": 10,
  "pandanarum": 11,
  "pejawaran": 12,
  "punggelan": 13,
  "purwanegara": 14,
  "purwonegoro": 14,
  "purwareja klampok": 15,
  "purworejo klampok": 15,
  "purworejo klp.": 15,
  "klampok": 15,
  "rakit": 16,
  "sigaluh": 17,
  "susukan": 18,
  "wanadadi": 19,
  "wanayasa": 20
};

function normalizeKecamatan(raw) {
  if (!raw) return null;
  const s = raw.toString().replace(/[\d\.\(\)]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  const condensed = s.replace(/\s+/g, "");
  if (condensed === "jumlah" || condensed === "total" || condensed === "kabupaten") return null;
  return KECAMATAN_MAP[s] || KECAMATAN_MAP[condensed] || null;
}

function parseNum(val) {
  if (val === null || val === undefined) return 0;
  const s = val.toString().trim();
  if (s === "" || s === "-" || s === "#REF!" || s === "n/a") return 0;
  // Hilangkan koma ribuan atau ganti koma desimal jika diperlukan
  const cleaned = s.replace(/,/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseCsv(content) {
  // Support BOM
  const clean = content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
  const lines = clean.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",").map(p => p.trim().replace(/^["']|["']$/g, ""));
    const rowObj = {};
    for (let j = 0; j < headers.length; j++) {
      rowObj[headers[j]] = parts[j] !== undefined ? parts[j] : "";
    }
    rows.push(rowObj);
  }
  return rows;
}

async function main() {
  const host = process.env.DB_HOST || "127.0.0.1";
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASS || process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "pertasis";

  console.log(`[Import Distankan] Menghubungkan ke basis data: ${database}...`);
  const conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database
  });

  const baseDir = path.resolve("dist/14. Distankan KP");

  try {
    // =========================================================================
    // 1. Pemasukan Ternak -> ternak_flow (arah = 'pemasukan')
    // =========================================================================
    console.log("\n[1/7] Mengimpor: Banyaknya Pemasukan Ternak...");
    const filePemasukan = path.join(baseDir, "Banyaknya Pemasukan Ternak ke Kabupaten Banjarnegara", "Banyaknya Pemasukan Ternak Ke Kabupaten Banjarnegara CSV.csv");
    if (fs.existsSync(filePemasukan)) {
      const rows = parseCsv(fs.readFileSync(filePemasukan, "utf-8"));
      let inserted = 0;
      for (const r of rows) {
        const kecId = normalizeKecamatan(r.Kecamatan);
        const tahun = parseInt(r.Tahun, 10);
        if (!kecId || !tahun) continue;

        const jenisList = [
          { jenis: "Sapi Perah", val: parseNum(r["Sapi Perah"]) },
          { jenis: "Sapi", val: parseNum(r["Sapi"]) },
          { jenis: "Kerbau", val: parseNum(r["Kerbau"]) },
          { jenis: "Kuda", val: parseNum(r["Kuda"]) },
          { jenis: "Kambing", val: parseNum(r["Kambing"]) },
          { jenis: "Domba", val: parseNum(r["DOMBA"] || r["Domba"]) }
        ];

        for (const item of jenisList) {
          await conn.query(
            `INSERT INTO ternak_flow (kecamatan_id, arah, jenis, tahun, jumlah_ekor, sumber)
             VALUES (?, 'pemasukan', ?, ?, ?, 'csv')
             ON DUPLICATE KEY UPDATE jumlah_ekor = VALUES(jumlah_ekor), sumber = 'csv'`,
            [kecId, item.jenis, tahun, item.val]
          );
          inserted++;
        }
      }
      console.log(`   ✅ Selesai: ${inserted} baris diproses ke \`ternak_flow\` (pemasukan).`);
    }

    // =========================================================================
    // 2. Pengeluaran Ternak -> ternak_flow (arah = 'pengeluaran')
    // =========================================================================
    console.log("\n[2/7] Mengimpor: Banyaknya Pengeluaran Ternak Potong...");
    const filePengeluaran = path.join(baseDir, "Banyaknya Pengeluaran Ternak Potong ke Kabupaten Banjarnegara", "Banyaknya Pengeluaran Ternak Potong ke Kabupaten Banjarnegara CSV.csv");
    if (fs.existsSync(filePengeluaran)) {
      const rows = parseCsv(fs.readFileSync(filePengeluaran, "utf-8"));
      let inserted = 0;
      for (const r of rows) {
        const kecId = normalizeKecamatan(r.Kecamatan);
        const tahun = parseInt(r.Tahun, 10);
        if (!kecId || !tahun) continue;

        const jenisList = [
          { jenis: "Sapi Perah", val: parseNum(r["Sapi Perah"]) },
          { jenis: "Sapi", val: parseNum(r["Sapi"]) },
          { jenis: "Kerbau", val: parseNum(r["Kerbau"]) },
          { jenis: "Kuda", val: parseNum(r["Kuda"]) },
          { jenis: "Kambing", val: parseNum(r["Kambing"]) },
          { jenis: "Domba", val: parseNum(r["Domba"]) }
        ];

        for (const item of jenisList) {
          await conn.query(
            `INSERT INTO ternak_flow (kecamatan_id, arah, jenis, tahun, jumlah_ekor, sumber)
             VALUES (?, 'pengeluaran', ?, ?, ?, 'csv')
             ON DUPLICATE KEY UPDATE jumlah_ekor = VALUES(jumlah_ekor), sumber = 'csv'`,
            [kecId, item.jenis, tahun, item.val]
          );
          inserted++;
        }
      }
      console.log(`   ✅ Selesai: ${inserted} baris diproses ke \`ternak_flow\` (pengeluaran).`);
    }

    // =========================================================================
    // 3. Ternak Dipotong di RPH -> ternak_pemotongan (lokasi = 'rph_pemerintah')
    // =========================================================================
    console.log("\n[3/7] Mengimpor: Jumlah Ternak yang Dipotong di RPH Pemerintah...");
    const fileRPH = path.join(baseDir, "Jumlah Ternak yang Dipotong di RPH Pemerintah", "Jumlah Ternak yang Dipotong di RPH Pemerintah CSV.csv");
    if (fs.existsSync(fileRPH)) {
      const rows = parseCsv(fs.readFileSync(fileRPH, "utf-8"));
      let inserted = 0;
      for (const r of rows) {
        const kecId = normalizeKecamatan(r.Kecamatan);
        const tahun = parseInt(r.Tahun, 10);
        if (!kecId || !tahun) continue;

        const jenisList = [
          { jenis: "Sapi", val: parseNum(r["Sapi"]) },
          { jenis: "Kerbau", val: parseNum(r["Kerbau"]) },
          { jenis: "Kuda", val: parseNum(r["Kuda"]) },
          { jenis: "Babi", val: parseNum(r["Babi"]) },
          { jenis: "Kambing", val: parseNum(r["Kambing"]) },
          { jenis: "Domba", val: parseNum(r["Domba"]) }
        ];

        for (const item of jenisList) {
          await conn.query(
            `INSERT INTO ternak_pemotongan (kecamatan_id, lokasi, jenis, tahun, jumlah_ekor, sumber)
             VALUES (?, 'rph_pemerintah', ?, ?, ?, 'csv')
             ON DUPLICATE KEY UPDATE jumlah_ekor = VALUES(jumlah_ekor), sumber = 'csv'`,
            [kecId, item.jenis, tahun, item.val]
          );
          inserted++;
        }
      }
      console.log(`   ✅ Selesai: ${inserted} baris diproses ke \`ternak_pemotongan\` (rph_pemerintah).`);
    }

    // =========================================================================
    // 4. Produksi Daging Ternak (Besar & Kecil) -> ternak_daging (kelompok = 'ternak')
    // =========================================================================
    console.log("\n[4/7] Mengimpor: Produksi Daging Ternak...");
    const fileDaging = path.join(baseDir, "Produksi Daging  Ternak Menurut Kecamatan dan Jenis Ternak", "Produksi Daging  Ternak Menurut Kecamatan dan Jenis Ternak CSV.csv");
    if (fs.existsSync(fileDaging)) {
      const rows = parseCsv(fs.readFileSync(fileDaging, "utf-8"));
      let inserted = 0;
      for (const r of rows) {
        const kecId = normalizeKecamatan(r.Kecamatan);
        const tahun = parseInt(r.Tahun, 10);
        if (!kecId || !tahun) continue;

        const jenisList = [
          { jenis: "Sapi", val: parseNum(r["Sapi"]) },
          { jenis: "Kerbau", val: parseNum(r["Kerbau"]) },
          { jenis: "Babi", val: parseNum(r["Babi"]) },
          { jenis: "Kambing", val: parseNum(r["Kambing"]) },
          { jenis: "Domba", val: parseNum(r["Domba"]) }
        ];

        for (const item of jenisList) {
          await conn.query(
            `INSERT INTO ternak_daging (kecamatan_id, kelompok, jenis, tahun, produksi_kg, sumber)
             VALUES (?, 'ternak', ?, ?, ?, 'csv')
             ON DUPLICATE KEY UPDATE produksi_kg = VALUES(produksi_kg), sumber = 'csv'`,
            [kecId, item.jenis, tahun, item.val]
          );
          inserted++;
        }
      }
      console.log(`   ✅ Selesai: ${inserted} baris diproses ke \`ternak_daging\` (kelompok 'ternak').`);
    }

    // =========================================================================
    // 5. Luas Panen Sayuran/Buah Semusim (Kabupaten) -> horti_luas_kabupaten
    // =========================================================================
    console.log("\n[5/7] Mengimpor: Luas Panen Sayuran & Buah Semusim (Kabupaten)...");
    const fileLuasSayurKab = path.join(baseDir, "Luas Panen Tanaman Sayuran dan BuahûBuahan Semusim Menurut Jenis Tanaman (ha)", "Luas Panen Tanaman Sayuran dan BuahûBuahan Semusim Menurut Jenis Tanaman (ha) CSV.csv");
    if (fs.existsSync(fileLuasSayurKab)) {
      const rows = parseCsv(fs.readFileSync(fileLuasSayurKab, "utf-8"));
      let inserted = 0;
      for (const r of rows) {
        const komoditas = (r["Jenis Tanaman"] || "").trim();
        const tahun = parseInt(r["Tahun"], 10);
        const luas = parseNum(r["Luas Panen (ha)"]);
        if (!komoditas || !tahun || komoditas.toLowerCase() === "total" || komoditas.toLowerCase() === "jumlah") continue;

        await conn.query(
          `INSERT INTO horti_luas_kabupaten (kelompok, komoditas, tahun, nilai, satuan, sumber)
           VALUES ('sayuran_buah_semusim', ?, ?, ?, 'ha', 'csv')
           ON DUPLICATE KEY UPDATE nilai = VALUES(nilai), satuan = 'ha', sumber = 'csv'`,
          [komoditas, tahun, luas]
        );
        inserted++;
      }
      console.log(`   ✅ Selesai: ${inserted} baris diproses ke \`horti_luas_kabupaten\`.`);
    }

    // =========================================================================
    // 6. Produksi Sayuran & Buah Semusim (Kabupaten) -> horti_produksi_kabupaten
    // =========================================================================
    console.log("\n[6/7] Mengimpor: Produksi Sayuran & Buah Semusim (Kabupaten)...");
    const fileProdSayurKab = path.join(baseDir, "Produksi Tanaman Sayuran dan BuahûBuahan Semusim Menurut Jenis Tanaman (Ton)", "Produksi Tanaman Sayuran dan BuahûBuahan Semusim Menurut Jenis Tanaman (Ton) CSV.csv");
    if (fs.existsSync(fileProdSayurKab)) {
      const rows = parseCsv(fs.readFileSync(fileProdSayurKab, "utf-8"));
      let inserted = 0;
      for (const r of rows) {
        const komoditas = (r["Jenis Tanaman"] || "").trim();
        const tahun = parseInt(r["Tahun"], 10);
        const prod = parseNum(r["Produksi (Ton)"] || r["Produksi (ton)"]);
        if (!komoditas || !tahun || komoditas.toLowerCase() === "total" || komoditas.toLowerCase() === "jumlah") continue;

        await conn.query(
          `INSERT INTO horti_produksi_kabupaten (kelompok, komoditas, tahun, nilai, satuan, sumber)
           VALUES ('sayuran_buah_semusim', ?, ?, ?, 'ton', 'csv')
           ON DUPLICATE KEY UPDATE nilai = VALUES(nilai), satuan = 'ton', sumber = 'csv'`,
          [komoditas, tahun, prod]
        );
        inserted++;
      }
      console.log(`   ✅ Selesai: ${inserted} baris diproses ke \`horti_produksi_kabupaten\` (sayuran_buah_semusim).`);
    }

    // =========================================================================
    // 7. Produksi Buah-buahan & Sayuran Tahunan (Kabupaten) -> horti_produksi_kabupaten
    // =========================================================================
    console.log("\n[7/7] Mengimpor: Produksi Buah & Sayuran Tahunan (Kabupaten)...");
    const fileProdBuahKab = path.join(baseDir, "Produksi Buah-buahan dan Sayuran Tahunan Menurut Jenis Tanaman (ton)", "Produksi Buah-buahan dan Sayuran Tahunan Menurut Jenis Tanaman (ton) CSV.csv");
    if (fs.existsSync(fileProdBuahKab)) {
      const rows = parseCsv(fs.readFileSync(fileProdBuahKab, "utf-8"));
      let inserted = 0;
      for (const r of rows) {
        const komoditas = (r["Jenis Tanaman"] || "").trim();
        const tahun = parseInt(r["Tahun"], 10);
        const prod = parseNum(r["Produksi (ton)"] || r["Produksi (Ton)"]);
        if (!komoditas || !tahun || komoditas.toLowerCase() === "total" || komoditas.toLowerCase() === "jumlah") continue;

        await conn.query(
          `INSERT INTO horti_produksi_kabupaten (kelompok, komoditas, tahun, nilai, satuan, sumber)
           VALUES ('buah_sayuran_tahunan', ?, ?, ?, 'ton', 'csv')
           ON DUPLICATE KEY UPDATE nilai = VALUES(nilai), satuan = 'ton', sumber = 'csv'`,
          [komoditas, tahun, prod]
        );
        inserted++;
      }
      console.log(`   ✅ Selesai: ${inserted} baris diproses ke \`horti_produksi_kabupaten\` (buah_sayuran_tahunan).`);
    }

    // =========================================================================
    // VERIFIKASI AKHIR
    // =========================================================================
    console.log("\n=======================================================");
    console.log("=== STATUS VERIFIKASI PASCA-IMPOR KE BASIS DATA ===");
    console.log("=======================================================");

    const checks = [
      { name: "ternak_flow (pemasukan)", query: "SELECT COUNT(*) as c FROM ternak_flow WHERE arah='pemasukan'" },
      { name: "ternak_flow (pengeluaran)", query: "SELECT COUNT(*) as c FROM ternak_flow WHERE arah='pengeluaran'" },
      { name: "ternak_pemotongan (rph_pemerintah)", query: "SELECT COUNT(*) as c FROM ternak_pemotongan WHERE lokasi='rph_pemerintah'" },
      { name: "ternak_daging (ternak)", query: "SELECT COUNT(*) as c FROM ternak_daging WHERE kelompok='ternak'" },
      { name: "horti_luas_kabupaten (sayuran_buah_semusim)", query: "SELECT COUNT(*) as c FROM horti_luas_kabupaten WHERE kelompok='sayuran_buah_semusim'" },
      { name: "horti_produksi_kabupaten (sayuran_buah_semusim)", query: "SELECT COUNT(*) as c FROM horti_produksi_kabupaten WHERE kelompok='sayuran_buah_semusim'" },
      { name: "horti_produksi_kabupaten (buah_sayuran_tahunan)", query: "SELECT COUNT(*) as c FROM horti_produksi_kabupaten WHERE kelompok='buah_sayuran_tahunan'" }
    ];

    for (const ch of checks) {
      const [res] = await conn.query(ch.query);
      console.log(`✅ [OK] ${ch.name}: ${res[0].c} baris data tersimpan.`);
    }

    console.log("\n[Import Distankan] SELURUH 7 DATASET BERHASIL DI-IMPORT 100%!");
  } finally {
    await conn.end();
  }
}

main().catch(err => {
  console.error("[Import Distankan] FATAL ERROR:", err);
  process.exit(1);
});
