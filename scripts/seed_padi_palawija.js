import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const KECAMATAN_MAP = {
  "susukan": 1,
  "purwarejaklampok": 2,
  "purworejoklampok": 2,
  "mandiraja": 3,
  "purwanegara": 4,
  "purwonegoro": 4,
  "bawang": 5,
  "banjarnegara": 6,
  "pagedongan": 7,
  "sigaluh": 8,
  "madukara": 9,
  "banjarmangu": 10,
  "wanadadi": 11,
  "rakit": 12,
  "punggelan": 13,
  "karangkobar": 14,
  "pejawaran": 15,
  "pagentan": 16,
  "batur": 17,
  "wanayasa": 18,
  "kalibening": 19,
  "pandanarum": 20
};

function normalizeKecName(str) {
  if (!str) return "";
  let clean = str.replace(/^\d+\.\s*/, "").replace(/\s+/g, " ").trim().toLowerCase();
  clean = clean.replace(/[^a-z0-9]/g, "");
  return clean;
}

function getKecId(rawName) {
  const norm = normalizeKecName(rawName);
  return KECAMATAN_MAP[norm] || null;
}

function parseNum(val) {
  if (!val) return 0;
  let str = String(val).trim();
  if (str === "-" || str === "" || str === "..." || str === "–") return 0;
  str = str.replace(/["\s]/g, "").replace(/,/g, "");
  const n = parseFloat(str);
  return Number.isFinite(n) ? n : 0;
}

// Simple robust CSV parser for these files
function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  const rows = [];
  for (const line of lines) {
    const cells = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        cells.push(cur.trim());
        cur = "";
      } else {
        cur += char;
      }
    }
    cells.push(cur.trim());
    rows.push(cells);
  }
  return rows;
}

async function main() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "pertasis",
    waitForConnections: true,
    connectionLimit: 5,
  });

  console.log("=== Seeding Padi & Palawija Data ===");

  // 1. Padi 2018-2024 from Distankan CSV
  const padiCsvPath = "dist/14. Distankan KP/Luas  Panen,  Produksi dan Rata-rata Produksi/Luas Panen, Produksi dan Rata-rata Produksi Padi Sawah Dan Padi Ladang CSV.csv";
  if (fs.existsSync(padiCsvPath)) {
    const rows = parseCsv(padiCsvPath);
    // Header is row 0: Kecamatan,Padi Sawah (Ha),Produksi Padi Sawah (Ton),Rata-rata Produksi Padi Sawah(Kw/Ha),Padi Ladang (Ha),Produksi Padi Ladang(Ton),Rata-rata Produksi Padi Ladang(Ku/Ha),Tahun
    let count = 0;
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (r.length < 8) continue;
      const kecId = getKecId(r[0]);
      const tahun = parseInt(r[7]);
      if (!kecId || !tahun) continue;

      const sawahLuas = parseNum(r[1]);
      const sawahProd = parseNum(r[2]);
      const sawahRata = parseNum(r[3]);

      const ladangLuas = parseNum(r[4]);
      const ladangProd = parseNum(r[5]);
      const ladangRata = parseNum(r[6]);

      // Sawah
      await pool.query(
        `INSERT INTO padi_produksi (kecamatan_id, tahun, jenis, luas_panen_ha, produksi_ton, rata_ku_ha, sumber)
         VALUES (?, ?, 'sawah', ?, ?, ?, 'Distankan KP')
         ON DUPLICATE KEY UPDATE luas_panen_ha=VALUES(luas_panen_ha), produksi_ton=VALUES(produksi_ton), rata_ku_ha=VALUES(rata_ku_ha)`,
        [kecId, tahun, sawahLuas, sawahProd, sawahRata]
      );

      // Ladang
      await pool.query(
        `INSERT INTO padi_produksi (kecamatan_id, tahun, jenis, luas_panen_ha, produksi_ton, rata_ku_ha, sumber)
         VALUES (?, ?, 'ladang', ?, ?, ?, 'Distankan KP')
         ON DUPLICATE KEY UPDATE luas_panen_ha=VALUES(luas_panen_ha), produksi_ton=VALUES(produksi_ton), rata_ku_ha=VALUES(rata_ku_ha)`,
        [kecId, tahun, ladangLuas, ladangProd, ladangRata]
      );
      count += 2;
    }
    console.log(`[Padi 2018-2024] Seeded ${count} rows`);
  }

  // 2. Padi 2025 Snapshot
  const padi2025Path = "dist/data/snapshots/padi-2025.csv";
  if (fs.existsSync(padi2025Path)) {
    const rows = parseCsv(padi2025Path);
    let count = 0;
    for (let i = 4; i < rows.length; i++) {
      const r = rows[i];
      if (r.length < 4) continue;
      const kecId = getKecId(r[0]);
      if (!kecId) continue;
      const luas = parseNum(r[1]);
      const prod = parseNum(r[2]);
      const rata = parseNum(r[3]);

      await pool.query(
        `INSERT INTO padi_produksi (kecamatan_id, tahun, jenis, luas_panen_ha, produksi_ton, rata_ku_ha, sumber)
         VALUES (?, 2025, 'sawah', ?, ?, ?, 'BPS 2025')
         ON DUPLICATE KEY UPDATE luas_panen_ha=VALUES(luas_panen_ha), produksi_ton=VALUES(produksi_ton), rata_ku_ha=VALUES(rata_ku_ha)`,
        [kecId, luas, prod, rata]
      );
      count++;
    }
    console.log(`[Padi 2025] Seeded ${count} rows with actual numbers`);
  }

  // 3. Palawija: Jagung dan Ubi Kayu
  const jagungCsv = "dist/14. Distankan KP/Luas  Panen,  Produksi dan Rata-rata Produksi/Luas Panen, Produksi dan Rata-rata Produksi Tanaman Pangan (Jagung dan Ubi Kayu) CSV.csv";
  if (fs.existsSync(jagungCsv)) {
    const rows = parseCsv(jagungCsv);
    let count = 0;
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (r.length < 8) continue;
      const kecId = getKecId(r[0]);
      const tahun = parseInt(r[7]);
      if (!kecId || !tahun) continue;

      const jLuas = parseNum(r[1]);
      const jProd = parseNum(r[2]);
      const jRata = parseNum(r[3]);

      const uLuas = parseNum(r[4]);
      const uProd = parseNum(r[5]);
      const uRata = parseNum(r[6]);

      await pool.query(
        `INSERT INTO palawija_produksi (kecamatan_id, tahun, komoditas, luas_panen_ha, produksi_ton, rata_ku_ha, sumber)
         VALUES (?, ?, 'Jagung', ?, ?, ?, 'Distankan KP')
         ON DUPLICATE KEY UPDATE luas_panen_ha=VALUES(luas_panen_ha), produksi_ton=VALUES(produksi_ton), rata_ku_ha=VALUES(rata_ku_ha)`,
        [kecId, tahun, jLuas, jProd, jRata]
      );
      await pool.query(
        `INSERT INTO palawija_produksi (kecamatan_id, tahun, komoditas, luas_panen_ha, produksi_ton, rata_ku_ha, sumber)
         VALUES (?, ?, 'Ubi Kayu', ?, ?, ?, 'Distankan KP')
         ON DUPLICATE KEY UPDATE luas_panen_ha=VALUES(luas_panen_ha), produksi_ton=VALUES(produksi_ton), rata_ku_ha=VALUES(rata_ku_ha)`,
        [kecId, tahun, uLuas, uProd, uRata]
      );
      count += 2;
    }
    console.log(`[Palawija Jagung & Ubi Kayu] Seeded ${count} rows`);
  }

  // 4. Palawija: Kacang Tanah dan Kedelai
  const kacangCsv = "dist/14. Distankan KP/Luas  Panen,  Produksi dan Rata-rata Produksi/Luas Panen, Produksi dan Rata-rata Produksi Tanaman Pangan (Kacang Tanah dan Kedelai) CSV.csv";
  if (fs.existsSync(kacangCsv)) {
    const rows = parseCsv(kacangCsv);
    let count = 0;
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (r.length < 8) continue;
      const kecId = getKecId(r[0]);
      const tahun = parseInt(r[7]);
      if (!kecId || !tahun) continue;

      const kLuas = parseNum(r[1]);
      const kProd = parseNum(r[2]);
      const kRata = parseNum(r[3]);

      const dLuas = parseNum(r[4]);
      const dProd = parseNum(r[5]);
      const dRata = parseNum(r[6]);

      await pool.query(
        `INSERT INTO palawija_produksi (kecamatan_id, tahun, komoditas, luas_panen_ha, produksi_ton, rata_ku_ha, sumber)
         VALUES (?, ?, 'Kacang Tanah', ?, ?, ?, 'Distankan KP')
         ON DUPLICATE KEY UPDATE luas_panen_ha=VALUES(luas_panen_ha), produksi_ton=VALUES(produksi_ton), rata_ku_ha=VALUES(rata_ku_ha)`,
        [kecId, tahun, kLuas, kProd, kRata]
      );
      await pool.query(
        `INSERT INTO palawija_produksi (kecamatan_id, tahun, komoditas, luas_panen_ha, produksi_ton, rata_ku_ha, sumber)
         VALUES (?, ?, 'Kedelai', ?, ?, ?, 'Distankan KP')
         ON DUPLICATE KEY UPDATE luas_panen_ha=VALUES(luas_panen_ha), produksi_ton=VALUES(produksi_ton), rata_ku_ha=VALUES(rata_ku_ha)`,
        [kecId, tahun, dLuas, dProd, dRata]
      );
      count += 2;
    }
    console.log(`[Palawija Kacang Tanah & Kedelai] Seeded ${count} rows`);
  }

  // 5. Palawija: Ubi Jalar dan Kacang Hijau
  const ubiJalarCsv = "dist/14. Distankan KP/Luas  Panen,  Produksi dan Rata-rata Produksi/Luas Panen, Produksi dan Rata-rata Produksi Tanaman Pangan (Ubi Jalar dan Kacang Hijau) CSV.csv";
  if (fs.existsSync(ubiJalarCsv)) {
    const rows = parseCsv(ubiJalarCsv);
    let count = 0;
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (r.length < 8) continue;
      const kecId = getKecId(r[0]);
      const tahun = parseInt(r[7]);
      if (!kecId || !tahun) continue;

      const ujLuas = parseNum(r[1]);
      const ujProd = parseNum(r[2]);
      const ujRata = parseNum(r[3]);

      const khLuas = parseNum(r[4]);
      const khProd = parseNum(r[5]);
      const khRata = parseNum(r[6]);

      await pool.query(
        `INSERT INTO palawija_produksi (kecamatan_id, tahun, komoditas, luas_panen_ha, produksi_ton, rata_ku_ha, sumber)
         VALUES (?, ?, 'Ubi Jalar', ?, ?, ?, 'Distankan KP')
         ON DUPLICATE KEY UPDATE luas_panen_ha=VALUES(luas_panen_ha), produksi_ton=VALUES(produksi_ton), rata_ku_ha=VALUES(rata_ku_ha)`,
        [kecId, tahun, ujLuas, ujProd, ujRata]
      );
      await pool.query(
        `INSERT INTO palawija_produksi (kecamatan_id, tahun, komoditas, luas_panen_ha, produksi_ton, rata_ku_ha, sumber)
         VALUES (?, ?, 'Kacang Hijau', ?, ?, ?, 'Distankan KP')
         ON DUPLICATE KEY UPDATE luas_panen_ha=VALUES(luas_panen_ha), produksi_ton=VALUES(produksi_ton), rata_ku_ha=VALUES(rata_ku_ha)`,
        [kecId, tahun, khLuas, khProd, khRata]
      );
      count += 2;
    }
    console.log(`[Palawija Ubi Jalar & Kacang Hijau] Seeded ${count} rows`);
  }

  await pool.end();
  console.log("=== Seeding Padi & Palawija Complete! ===");
}

main().catch(err => {
  console.error("Error seeding padi & palawija:", err);
  process.exit(1);
});
