/**
 * scripts/seed_hortikultura_distankan.js
 * Importer data riil resmi BPS Distankan KP ke tabel:
 * - horti_produksi (sayuran, buah_tahunan, biofarmaka, tanaman_hias)
 * - horti_luas (sayuran, biofarmaka, tanaman_hias)
 */
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const KEC_ALIASES = {
  "purworejo klampok": "purwareja klampok",
  "purwonegoro": "purwanegara"
};

function parseNum(val) {
  if (val === null || val === undefined) return 0;
  const s = val.toString().trim();
  if (s === "" || s === "-" || s === "#REF!" || s === "n/a") return 0;
  const cleaned = s.replace(/,/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseTidyCsv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File tidak ditemukan: ${filePath}`);
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(",");
    if (parts.length < 4) continue;
    const kecamatan = parts[0].trim();
    const tahun = parseInt(parts[1].trim(), 10);
    // metric e.g. "Bawang Merah (ton) 2017" -> "Bawang Merah"
    const rawMetric = parts[2].trim();
    const komoditas = rawMetric.replace(/\s*\(.*?\)\s*\d*$/, "").trim();
    const val = parseNum(parts[3]);
    if (kecamatan && !isNaN(tahun) && komoditas) {
      records.push({ kecamatan, tahun, komoditas, val });
    }
  }
  return records;
}

async function main() {
  const envHost = process.env.DB_HOST || "127.0.0.1";
  const envPort = Number(process.env.DB_PORT || 3306);
  const envUser = process.env.DB_USER || "root";
  const envPass = process.env.DB_PASS || process.env.DB_PASSWORD || "";
  const envName = process.env.DB_NAME || "pertasis";

  console.log(`[Seed Hortikultura] Menghubungkan ke ${envName} di ${envHost}:${envPort}...`);
  const conn = await mysql.createConnection({
    host: envHost,
    port: envPort,
    user: envUser,
    password: envPass,
    database: envName,
  });

  // 1. Dapatkan mapping kecamatan dinamis
  const [kecRows] = await conn.query("SELECT id, nama FROM kecamatan");
  const kecMap = new Map();
  for (const k of kecRows) {
    const norm = k.nama.trim().toLowerCase();
    kecMap.set(norm, k.id);
    kecMap.set(norm.replace(/\s+/g, ""), k.id);
  }

  function resolveKecId(rawName) {
    if (!rawName) return null;
    let n = rawName.trim().toLowerCase();
    if (KEC_ALIASES[n]) n = KEC_ALIASES[n];
    return kecMap.get(n) || kecMap.get(n.replace(/\s+/g, "")) || null;
  }

  console.log(`[Seed Hortikultura] Berhasil memetakan ${kecRows.length} kecamatan dari basis data.`);

  // 2. Daftar dataset Produksi
  const prodDatasets = [
    {
      kelompok: "sayuran",
      path: "dist/14. Distankan KP/tidy/Produksi Tanaman Sayuran Menurut Kecamatan dan Jenis Tanaman (ton)/Produksi Tanaman Sayuran Menurut Kecamatan dan Jenis Tanaman (ton) tidy.csv",
      satuan: "ton"
    },
    {
      kelompok: "buah_tahunan",
      path: "dist/14. Distankan KP/tidy/Produksi Buah-buahan Menurut Kecamatan dan Jenis Tanaman (ton)/Produksi Buah-buahan Menurut Kecamatan dan Jenis Tanaman (ton) tidy.csv",
      satuan: "ton"
    },
    {
      kelompok: "biofarmaka",
      path: "dist/14. Distankan KP/tidy/Produksi Tanaman Biofarmaka Menurut Kecamatan dan Jenis Tanaman (Tangkai)/Produksi Tanaman Biofarmaka Menurut Kecamatan dan Jenis Tanaman (Tangkai) tidy.csv",
      satuan: "tangkai"
    },
    {
      kelompok: "tanaman_hias",
      path: "dist/14. Distankan KP/tidy/Produksi Tanaman Hias Menurut Kecamatan dan Jenis Tanaman (tangkai)/Produksi Tanaman Hias Menurut Kecamatan dan Jenis Tanaman (tangkai) tidy.csv",
      satuan: "tangkai"
    }
  ];

  // Hapus data lama yang akan di-replace di horti_produksi
  console.log("[Seed Hortikultura] Membersihkan data lama di `horti_produksi`...");
  await conn.query("DELETE FROM horti_produksi WHERE kelompok IN ('sayuran', 'buah_tahunan', 'biofarmaka', 'tanaman_hias')");

  let totalProdInserted = 0;
  for (const ds of prodDatasets) {
    const fullPath = path.resolve(process.cwd(), ds.path);
    const records = parseTidyCsv(fullPath);
    console.log(`[Seed Hortikultura] Memproses ${records.length} baris produksi ${ds.kelompok}...`);

    for (const r of records) {
      const kecId = resolveKecId(r.kecamatan);
      if (!kecId) continue;

      await conn.query(
        `INSERT INTO horti_produksi (kecamatan_id, kelompok, komoditas, tahun, produksi_ton, nilai, sumber)
         VALUES (?, ?, ?, ?, ?, ?, 'BPS Distankan KP')
         ON DUPLICATE KEY UPDATE nilai = VALUES(nilai), produksi_ton = VALUES(produksi_ton)`,
        [kecId, ds.kelompok, r.komoditas, r.tahun, r.val, r.val]
      );
      totalProdInserted++;
    }
  }
  console.log(`[Seed Hortikultura] Berhasil memasukkan ${totalProdInserted} baris ke \`horti_produksi\`.`);

  // 3. Daftar dataset Luas Panen
  const luasDatasets = [
    {
      kelompok: "sayuran",
      path: "dist/14. Distankan KP/tidy/Luas Panen Tanaman Sayuran Menurut Kecamatan dan Jenis Tanaman (ha)/Luas Panen Tanaman Sayuran Menurut Kecamatan dan Jenis Tanaman (ha) tidy.csv",
      satuan: "ha"
    },
    {
      kelompok: "biofarmaka",
      path: "dist/14. Distankan KP/tidy/Luas Panen Tanaman Biofarmaka Menurut Kecamatan dan Jenis Tanaman (m2)/Luas Panen Tanaman Biofarmaka Menurut Kecamatan dan Jenis Tanaman (m2) tidy.csv",
      satuan: "m2"
    },
    {
      kelompok: "tanaman_hias",
      path: "dist/14. Distankan KP/tidy/Luas Panen Tanaman Hias Menurut Kecamatan dan Jenis Tanaman (m2)/Luas Panen Tanaman Hias Menurut Kecamatan dan Jenis Tanaman (m2) tidy.csv",
      satuan: "m2"
    }
  ];

  console.log("[Seed Hortikultura] Membersihkan data lama di `horti_luas`...");
  await conn.query("DELETE FROM horti_luas WHERE kelompok IN ('sayuran', 'biofarmaka', 'tanaman_hias')");

  let totalLuasInserted = 0;
  for (const ds of luasDatasets) {
    const fullPath = path.resolve(process.cwd(), ds.path);
    const records = parseTidyCsv(fullPath);
    console.log(`[Seed Hortikultura] Memproses ${records.length} baris luas panen ${ds.kelompok}...`);

    for (const r of records) {
      const kecId = resolveKecId(r.kecamatan);
      if (!kecId) continue;

      await conn.query(
        `INSERT INTO horti_luas (kecamatan_id, kelompok, komoditas, tahun, luas_ha, nilai, sumber)
         VALUES (?, ?, ?, ?, ?, ?, 'BPS Distankan KP')
         ON DUPLICATE KEY UPDATE nilai = VALUES(nilai), luas_ha = VALUES(luas_ha)`,
        [kecId, ds.kelompok, r.komoditas, r.tahun, r.val, r.val]
      );
      totalLuasInserted++;
    }
  }
  console.log(`[Seed Hortikultura] Berhasil memasukkan ${totalLuasInserted} baris ke \`horti_luas\`.`);

  await conn.end();
  console.log("✅ Seed Hortikultura (Sayuran, Buah, Biofarmaka, Tanaman Hias) selesai 100%!");
}

main().catch(err => {
  console.error("❌ Galat saat seeding hortikultura:", err);
  process.exit(1);
});
