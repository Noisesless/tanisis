// scripts/import_fsva_desa.js
// ETL Importer untuk Data Validasi FSVA-Desa (Bapanas & Distankan KP Banjarnegara)
// Mengimpor 16 Variabel Lengkap (Fisik, Demografi, Rasio, IKP, Komposit) ke tabel MariaDB `fsva_desa_indikator`.
// Penggunaan: node --env-file=.env scripts/import_fsva_desa.js [--tahun=2024]
import path from "node:path";
import fs from "node:fs";
import ExcelJS from "exceljs";
import { q, getPool } from "../src/db.js";

// Helper regex normalisasi ejaan desa/kecamatan
function cleanStr(s) {
  if (!s) return "";
  let res = s.toLowerCase().trim();
  res = res.replace(/^(desa|kelurahan|kel|kecamatan|kec)\b[\s\.]*/i, "");
  res = res.replace(/[^a-z0-9]/g, "");
  return res;
}

const ALIASES = {
  "susukan:panerusankulon": "susukan:panarusankulon",
  "susukan:panerusanwetan": "susukan:panarusanwetan",
  "purwarejaklampok:pucungbedug": "purwarejaklampok:pucungbeduk",
  "purwanegara:pucungbedug": "purwanegara:pucungbeduk",
  "sigaluh:tunggara": "sigaluh:tunggoro",
  "sigaluh:singamerta": "sigaluh:singomerto",
  "karangkobar:purwodadi": "karangkobar:purwadadi",
  "pejawaran:pegundungan": "pejawaran:pagundungan",
  "pejawaran:sarwodadi": "pejawaran:sarwadadi",
  "wanayasa:pagergunung": "wanayasa:pegergunung",
  "madukara:rejasa": "madukara:rejasa",
  "madukara:kenteng": "madukara:kenteng",
  "sigaluh:kalibenda": "sigaluh:kalibenda",
};

function getVal(c) {
  if (!c) return null;
  const v = c.result !== undefined ? c.result : c.value;
  if (v && typeof v === "object" && v.result !== undefined) return v.result;
  return v;
}

function toNum(v, fallback = 0) {
  if (v === null || v === undefined || v === "" || v === "-") return fallback;
  const n = Number(v);
  return isNaN(n) ? fallback : n;
}

function percentile(arr, p) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  const weight = idx - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function normalize(val, minV, maxV, positive = true) {
  if (maxV === minV) return 50.0;
  const clamped = Math.max(minV, Math.min(maxV, val));
  if (positive) {
    return ((clamped - minV) / (maxV - minV)) * 100.0;
  } else {
    return ((maxV - clamped) / (maxV - minV)) * 100.0;
  }
}

async function ensureTable() {
  await q(`
    CREATE TABLE IF NOT EXISTS fsva_desa_indikator (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tahun INT NOT NULL,
      kode_kec VARCHAR(20) NOT NULL,
      nama_kecamatan VARCHAR(100) NOT NULL,
      kode_desa VARCHAR(20) NOT NULL,
      nama_desa VARCHAR(100) NOT NULL,
      object_id INT NOT NULL,
      -- 10 Data Dasar Fisik & Demografi
      luas_wilayah_ha DECIMAL(12,2) DEFAULT NULL,
      jumlah_penduduk INT DEFAULT NULL,
      jumlah_rt INT DEFAULT NULL,
      kepadatan_penduduk DECIMAL(12,2) DEFAULT NULL,
      luas_lahan_ha DECIMAL(12,2) DEFAULT NULL,
      sarpras_pangan_unit INT DEFAULT NULL,
      penduduk_miskin_jiwa INT DEFAULT NULL,
      tanpa_akses TINYINT(1) DEFAULT 0,
      rt_tanpa_air_bersih INT DEFAULT NULL,
      jumlah_nakes INT DEFAULT NULL,
      -- 6 Indikator Rasio FSVA
      rasio_lahan DECIMAL(10,4) DEFAULT NULL,
      rasio_sarana DECIMAL(10,4) DEFAULT NULL,
      rasio_miskin DECIMAL(10,4) DEFAULT NULL,
      rasio_air_bersih DECIMAL(10,4) DEFAULT NULL,
      rasio_nakes DECIMAL(10,4) DEFAULT NULL,
      -- Indeks & Peringkat Komposit
      ikp DECIMAL(6,2) DEFAULT NULL,
      komposit TINYINT DEFAULT NULL,
      ikp_ranking INT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uk_desa_tahun (kode_desa, tahun),
      KEY idx_tahun (tahun),
      KEY idx_obj (object_id),
      KEY idx_kec (nama_kecamatan)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

async function main() {
  const args = process.argv.slice(2);
  let tahun = 2024;
  let inputDir = path.join(process.cwd(), "dist", "validasi data FSVA");

  for (const arg of args) {
    if (arg.startsWith("--tahun=")) {
      tahun = parseInt(arg.replace("--tahun=", ""), 10);
    } else if (arg.startsWith("--dir=")) {
      inputDir = arg.replace("--dir=", "");
    }
  }

  console.log(`[ETL FSVA] Memulai impor FSVA Desa Tahun ${tahun} dari folder: ${inputDir}`);

  // 1. Pastikan tabel tersedia
  await ensureTable();

  // 2. Load GeoJSON untuk mapping OBJECTID
  const geojsonPath = path.join(process.cwd(), "dist", "peta_desa_v3.geojson");
  if (!fs.existsSync(geojsonPath)) {
    throw new Error(`Berkas peta GeoJSON tidak ditemukan: ${geojsonPath}`);
  }
  const geojson = JSON.parse(fs.readFileSync(geojsonPath, "utf8"));
  const geoLookup = new Map();
  for (const feat of geojson.features) {
    const p = feat.properties;
    const oid = p.OBJECTID;
    const k = cleanStr(p.Kecamatan);
    const d = cleanStr(p.Nama_Desa_);
    geoLookup.set(`${k}:${d}`, oid);
  }

  // 3. Baca 5 File Excel
  const wbKet = new ExcelJS.Workbook();
  const wbAks = new ExcelJS.Workbook();
  const wbPem = new ExcelJS.Workbook();
  const wbDuk = new ExcelJS.Workbook();
  const wbHit = new ExcelJS.Workbook();

  console.log("[ETL FSVA] Membaca 5 workbook validasi Bapanas...");
  await Promise.all([
    wbKet.xlsx.readFile(path.join(inputDir, "indikator_ketersediaan.xlsx")),
    wbAks.xlsx.readFile(path.join(inputDir, "indikator_akses_pangan.xlsx")),
    wbPem.xlsx.readFile(path.join(inputDir, "indikator_pemanfaatan.xlsx")),
    wbDuk.xlsx.readFile(path.join(inputDir, "data_pendukung.xlsx")),
    wbHit.xlsx.readFile(path.join(inputDir, "hitung_indikator.xlsx")),
  ]);

  const sKet = wbKet.worksheets[0];
  const sAks = wbAks.worksheets[0];
  const sPem = wbPem.worksheets[0];
  const sDuk = wbDuk.worksheets[0];
  const sHit = wbHit.worksheets[0];

  const parsed = [];
  for (let r = 7; r <= 284; r++) {
    const rowHit = sHit.getRow(r);
    const rowKet = sKet.getRow(r);
    const rowAks = sAks.getRow(r);
    const rowPem = sPem.getRow(r);
    const rowDuk = sDuk.getRow(r);

    const kec = String(getVal(rowHit.getCell(2)) || "").trim();
    const kodeKec = String(getVal(rowHit.getCell(3)) || "").trim();
    const kodeDesa = String(getVal(rowHit.getCell(4)) || "").trim();
    const desa = String(getVal(rowHit.getCell(5)) || "").trim();

    if (!desa) continue;

    // Mapping GeoJSON OBJECTID
    let key = `${cleanStr(kec)}:${cleanStr(desa)}`;
    if (ALIASES[key]) key = ALIASES[key];
    const objectId = geoLookup.get(key);
    if (!objectId) {
      console.warn(`[WARN] Desa belum terpetakan ke GeoJSON: ${kec} - ${desa} (key: ${key})`);
    }

    const luasLahanHa = toNum(getVal(rowKet.getCell(10)));
    const sarprasUnit = Math.round(toNum(getVal(rowKet.getCell(17))));

    const miskinJiwa = Math.round(toNum(getVal(rowAks.getCell(10))));
    const tanpaAkses = toNum(getVal(rowAks.getCell(17))); // 1 = ada akses

    const rtTanpaAir = Math.round(toNum(getVal(rowPem.getCell(10))));
    const nakesOrang = Math.round(toNum(getVal(rowPem.getCell(17))));

    const luasWilayahHa = toNum(getVal(rowDuk.getCell(10)));
    const pendudukTotal = Math.round(toNum(getVal(rowDuk.getCell(17))));
    const jumlahRt = Math.round(toNum(getVal(rowDuk.getCell(24))));
    const kepadatan = toNum(getVal(rowDuk.getCell(28)));

    const rasioLahan = toNum(getVal(rowHit.getCell(6)));
    const rasioSarana = toNum(getVal(rowHit.getCell(7)));
    const rasioMiskin = toNum(getVal(rowHit.getCell(8)));
    const rasioAir = toNum(getVal(rowHit.getCell(10)));
    const rasioNakes = toNum(getVal(rowHit.getCell(12)));

    parsed.push({
      tahun,
      kodeKec,
      namaKecamatan: kec,
      kodeDesa,
      namaDesa: desa,
      objectId: objectId || 0,
      luasWilayahHa,
      pendudukTotal,
      jumlahRt,
      kepadatan,
      luasLahanHa,
      sarprasUnit,
      miskinJiwa,
      tanpaAkses: tanpaAkses === 1 ? 0 : 1, // di db: 0=ada akses, 1=tanpa akses
      rtTanpaAir,
      nakesOrang,
      rasioLahan,
      rasioSarana,
      rasioMiskin,
      rasioAir,
      rasioNakes,
    });
  }

  console.log(`[ETL FSVA] Berhasil mengekstrak ${parsed.length} desa dari berkas Excel.`);

  // 4. Kalkulasi IKP & Komposit (Normalisasi Min-Max Standar Bapanas)
  const vLahan = parsed.map((d) => d.rasioLahan);
  const vSarana = parsed.map((d) => d.rasioSarana);
  const vMiskin = parsed.map((d) => d.rasioMiskin);
  const vAir = parsed.map((d) => d.rasioAir);
  const vNakes = parsed.map((d) => d.rasioNakes);

  const minLahan = Math.min(...vLahan), maxLahan = percentile(vLahan, 95);
  const minSarana = Math.min(...vSarana), maxSarana = percentile(vSarana, 95);
  const minMiskin = Math.min(...vMiskin), maxMiskin = Math.min(1.0, percentile(vMiskin, 95));
  const minAir = Math.min(...vAir), maxAir = percentile(vAir, 95);
  const minNakes = Math.min(...vNakes), maxNakes = percentile(vNakes, 95);

  const scored = parsed.map((d) => {
    const s1 = normalize(d.rasioLahan, minLahan, maxLahan, true);
    const s2 = normalize(d.rasioSarana, minSarana, maxSarana, true);
    const s3 = normalize(d.rasioMiskin, minMiskin, maxMiskin, false);
    const s4 = d.tanpaAkses === 1 ? 0.0 : 100.0;
    const s5 = normalize(d.rasioAir, minAir, maxAir, false);
    const s6 = normalize(d.rasioNakes, minNakes, maxNakes, false);

    const ikp = Number(((s1 + s2 + s3 + s4 + s5 + s6) / 6.0).toFixed(2));
    return { ...d, ikp };
  });

  // Ranking desa berdasarkan IKP descending
  scored.sort((a, b) => b.ikp - a.ikp);
  scored.forEach((d, idx) => {
    d.ikpRanking = idx + 1;
  });

  // Tentukan batas kuantil 6 kelas (Prioritas 1-6)
  const allIkp = scored.map((d) => d.ikp);
  const q1 = percentile(allIkp, 16.67);
  const q2 = percentile(allIkp, 33.33);
  const q3 = percentile(allIkp, 50.0);
  const q4 = percentile(allIkp, 66.67);
  const q5 = percentile(allIkp, 83.33);

  scored.forEach((d) => {
    let komp = 1;
    if (d.ikp <= q1) komp = 1; // Sangat Rawan
    else if (d.ikp <= q2) komp = 2; // Rawan
    else if (d.ikp <= q3) komp = 3; // Agak Rawan
    else if (d.ikp <= q4) komp = 4; // Agak Tahan
    else if (d.ikp <= q5) komp = 5; // Tahan
    else komp = 6; // Sangat Tahan
    d.komposit = komp;
  });

  // 5. Simpan ke MariaDB (UPSERT dengan relasi kecamatan_id & desa_id)
  console.log(`[ETL FSVA] Menyimpan ${scored.length} rekaman ke tabel fsva_desa_indikator...`);
  const kRows = await q("SELECT id, nama FROM kecamatan");
  const dRows = await q("SELECT id, kecamatan_id, nama FROM desa");
  const kecMap = new Map();
  for (const k of kRows) kecMap.set(cleanStr(k.nama), k);
  kecMap.set("purwarejaklampok", kecMap.get("purwarejaklampok") || kecMap.get("klampok"));

  const DESA_PHONETIC = {
    "12_pegundungan": "pagundungan",
    "12_sarwodadi": "sarwadadi",
    "17_singamerta": "singomerto",
    "17_tunggara": "tunggoro",
    "20_pagergunung": "pegergunung",
    "6_purwodadi": "purwadadi",
    "18_panerusankulon": "panarusankulon",
    "18_panerusanwetan": "panarusanwetan",
    "14_pucungbedug": "pucungbeduk",
  };

  const desaMap = new Map();
  for (const d of dRows) {
    desaMap.set(`${d.kecamatan_id}_${cleanStr(d.nama)}`, d);
  }

  let inserted = 0;
  for (const d of scored) {
    const k = kecMap.get(cleanStr(d.namaKecamatan));
    const cKey = cleanStr(d.namaDesa);
    const lookupKey = k ? `${k.id}_${cKey}` : "";
    const altKey = DESA_PHONETIC[lookupKey] ? `${k.id}_${DESA_PHONETIC[lookupKey]}` : lookupKey;
    const des = desaMap.get(altKey);

    const kecamatanId = k ? k.id : 1;
    const desaId = des ? des.id : 1;

    await q(
      `INSERT INTO fsva_desa_indikator (
        tahun, kecamatan_id, desa_id, kode_kec, nama_kecamatan, kode_desa, nama_desa, object_id,
        luas_wilayah_ha, jumlah_penduduk, jumlah_rt, kepadatan_penduduk,
        luas_lahan_ha, sarpras_pangan_unit, penduduk_miskin_jiwa, tanpa_akses,
        rt_tanpa_air_bersih, jumlah_nakes,
        rasio_lahan, rasio_sarana, rasio_miskin, rasio_air_bersih, rasio_nakes,
        ikp, komposit, ikp_ranking
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        kecamatan_id = VALUES(kecamatan_id),
        desa_id = VALUES(desa_id),
        nama_kecamatan = VALUES(nama_kecamatan),
        nama_desa = VALUES(nama_desa),
        object_id = VALUES(object_id),
        luas_wilayah_ha = VALUES(luas_wilayah_ha),
        jumlah_penduduk = VALUES(jumlah_penduduk),
        jumlah_rt = VALUES(jumlah_rt),
        kepadatan_penduduk = VALUES(kepadatan_penduduk),
        luas_lahan_ha = VALUES(luas_lahan_ha),
        sarpras_pangan_unit = VALUES(sarpras_pangan_unit),
        penduduk_miskin_jiwa = VALUES(penduduk_miskin_jiwa),
        tanpa_akses = VALUES(tanpa_akses),
        rt_tanpa_air_bersih = VALUES(rt_tanpa_air_bersih),
        jumlah_nakes = VALUES(jumlah_nakes),
        rasio_lahan = VALUES(rasio_lahan),
        rasio_sarana = VALUES(rasio_sarana),
        rasio_miskin = VALUES(rasio_miskin),
        rasio_air_bersih = VALUES(rasio_air_bersih),
        rasio_nakes = VALUES(rasio_nakes),
        ikp = VALUES(ikp),
        komposit = VALUES(komposit),
        ikp_ranking = VALUES(ikp_ranking),
        updated_at = CURRENT_TIMESTAMP`,
      [
        d.tahun, kecamatanId, desaId, d.kodeKec, d.namaKecamatan, d.kodeDesa, d.namaDesa, d.objectId,
        d.luasWilayahHa, d.pendudukTotal, d.jumlahRt, d.kepadatan,
        d.luasLahanHa, d.sarprasUnit, d.miskinJiwa, d.tanpaAkses,
        d.rtTanpaAir, d.nakesOrang,
        d.rasioLahan, d.rasioSarana, d.rasioMiskin, d.rasioAir, d.rasioNakes,
        d.ikp, d.komposit, d.ikpRanking,
      ]
    );
    inserted++;
  }

  console.log(`[ETL FSVA] Berhasil menyimpan ${inserted} desa ke database!`);

  // Ringkasan hasil
  const [summary] = await q(
    `SELECT COUNT(*) as total_desa,
            ROUND(AVG(ikp), 2) as rata_ikp,
            ROUND(MIN(ikp), 2) as min_ikp,
            ROUND(MAX(ikp), 2) as max_ikp,
            SUM(luas_lahan_ha) as total_lahan_ha,
            SUM(penduduk_miskin_jiwa) as total_miskin_jiwa,
            SUM(sarpras_pangan_unit) as total_sarpras
     FROM fsva_desa_indikator WHERE tahun = ?`,
    [tahun]
  );
  console.log("[ETL FSVA] Ringkasan Capaian Kabupaten:", summary);

  process.exit(0);
}

main().catch((err) => {
  console.error("[ETL FSVA ERROR]", err);
  process.exit(1);
});
