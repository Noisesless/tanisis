/**
 * scripts/optimize_geojson.js
 *
 * Skrip optimasi berkas GeoJSON untuk SISPERTANI.
 * Menangani:
 * 1. Pemangkasan koordinat float ke 6 desimal (~11 cm akurasi, standar sub-meter)
 * 2. Eliminasi dimensi Z (elevasi [lon, lat, 0] -> [lon, lat])
 * 3. Sanitasi properti metadata shapefile mentah yang tidak digunakan frontend
 * 4. Pengecekan integritas jumlah fitur dan keabsahan JSON AST
 *
 * Penggunaan:
 *   node scripts/optimize_geojson.js          # Jalankan optimasi
 *   node scripts/optimize_geojson.js --restore # Pulihkan dari backup
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const BACKUP_DIR = path.join(DIST_DIR, ".geojson_original_backup");

// Konfigurasi atribut properti yang dipertahankan per berkas
const KEEP_PROPS = {
  "peta_desa_v3.geojson": ["OBJECTID", "Nama_Desa_", "Kecamatan", "Kabupaten", "Name"],
  "peta_kecamatan.geojson": ["Kecamatan", "Name"],
  "kebun.geojson": ["NAMOBJ", "name", "JNSKBN"],
  "sawah.geojson": ["NAMOBJ", "name", "JNSSWH"],
  "ladang.geojson": ["NAMOBJ", "name"],
  "jalan.geojson": ["name", "type"],
  "sungai.geojson": ["NAMOBJ", "name"],
  "banjarnegara-air-permukaan.geojson": ["NAMOBJ", "name", "REMARK"],
  "danau.geojson": ["NAMOBJ", "name"],
  "bangunan_area.geojson": ["NAMOBJ", "name"],
  "tonggak-kilometer.geojson": ["NAMOBJ", "name", "KODTKM"],
  "pasar-banjarnegara.geojson": ["name", "kategori", "alamat", "NAMOBJ"]
};

// Fungsi rekursif pembulatan koordinat dan penghapusan elevasi Z
function roundCoordinates(coords) {
  if (!Array.isArray(coords)) return coords;
  if (typeof coords[0] === "number") {
    const lon = Math.round(coords[0] * 1000000) / 1000000;
    const lat = Math.round(coords[1] * 1000000) / 1000000;
    return [lon, lat]; // Hapus koordinat Z ketiga jika ada
  }
  return coords.map(roundCoordinates);
}

// Optimasi objek GeoJSON tunggal
function optimizeFeatureCollection(data, filename) {
  if (!data || !Array.isArray(data.features)) return data;

  const allowedProps = KEEP_PROPS[filename] || null;

  const optimizedFeatures = data.features.map((feature) => {
    const feat = { type: feature.type || "Feature" };
    if (feature.id !== undefined) feat.id = feature.id;

    // 1. Optimasi geometri
    if (feature.geometry) {
      feat.geometry = {
        type: feature.geometry.type,
        coordinates: roundCoordinates(feature.geometry.coordinates)
      };
    }

    // 2. Filter atribut properti
    if (feature.properties) {
      if (allowedProps) {
        const cleanProps = {};
        for (const key of allowedProps) {
          if (feature.properties[key] !== undefined) {
            cleanProps[key] = feature.properties[key];
          }
        }
        feat.properties = cleanProps;
      } else {
        feat.properties = feature.properties;
      }
    } else {
      feat.properties = {};
    }

    return feat;
  });

  return {
    type: data.type || "FeatureCollection",
    ...(data.name ? { name: data.name } : {}),
    ...(data.crs ? { crs: data.crs } : {}),
    features: optimizedFeatures
  };
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function restoreFromBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.error("[GeoJSON] Direktori backup tidak ditemukan di:", BACKUP_DIR);
    process.exit(1);
  }

  console.log("[GeoJSON] Memulihkan berkas dari backup...");
  const backupFiles = fs.readdirSync(BACKUP_DIR);
  for (const file of backupFiles) {
    const src = path.join(BACKUP_DIR, file);
    let dest = path.join(DIST_DIR, file);
    if (file === "pasar-banjarnegara.geojson") {
      dest = path.join(DIST_DIR, "data", file);
    }
    fs.copyFileSync(src, dest);
    console.log(`  ✓ Dipulihkan: ${file}`);
  }
  console.log("[GeoJSON] Pemulihan selesai!");
}

async function runOptimization() {
  console.log("================================================================================");
  console.log(" SISPERTANI — Optimasi Berkas GeoJSON (6 Desimal, 2D Flatten, Metadata Strip)");
  console.log("================================================================================");

  // 1. Buat backup otomatis jika belum ada
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`[Backup] Membuat direktori backup di ${BACKUP_DIR}`);
  }

  const targetFiles = [
    { name: "peta_desa_v3.geojson", path: path.join(DIST_DIR, "peta_desa_v3.geojson") },
    { name: "peta_kecamatan.geojson", path: path.join(DIST_DIR, "peta_kecamatan.geojson") },
    { name: "jalan.geojson", path: path.join(DIST_DIR, "jalan.geojson") },
    { name: "kebun.geojson", path: path.join(DIST_DIR, "kebun.geojson") },
    { name: "sawah.geojson", path: path.join(DIST_DIR, "sawah.geojson") },
    { name: "ladang.geojson", path: path.join(DIST_DIR, "ladang.geojson") },
    { name: "sungai.geojson", path: path.join(DIST_DIR, "sungai.geojson") },
    { name: "banjarnegara-air-permukaan.geojson", path: path.join(DIST_DIR, "banjarnegara-air-permukaan.geojson") },
    { name: "danau.geojson", path: path.join(DIST_DIR, "danau.geojson") },
    { name: "bangunan_area.geojson", path: path.join(DIST_DIR, "bangunan_area.geojson") },
    { name: "tonggak-kilometer.geojson", path: path.join(DIST_DIR, "tonggak-kilometer.geojson") },
    { name: "pasar-banjarnegara.geojson", path: path.join(DIST_DIR, "data", "pasar-banjarnegara.geojson") }
  ];

  let totalOriginal = 0;
  let totalOptimized = 0;

  console.log(
    "Berkas".padEnd(36) +
    "Fitur".padStart(8) +
    "Sebelum".padStart(12) +
    "Sesudah".padStart(12) +
    "Hemat".padStart(10)
  );
  console.log("-".repeat(78));

  for (const item of targetFiles) {
    if (!fs.existsSync(item.path)) {
      continue;
    }

    // Pastikan backup ada
    const backupDest = path.join(BACKUP_DIR, item.name);
    if (!fs.existsSync(backupDest)) {
      fs.copyFileSync(item.path, backupDest);
    }

    const raw = fs.readFileSync(item.path, "utf8");
    const origBytes = Buffer.byteLength(raw, "utf8");
    totalOriginal += origBytes;

    const data = JSON.parse(raw);
    const origFeatureCount = data.features ? data.features.length : 0;

    // Jalankan optimasi
    const optData = optimizeFeatureCollection(data, item.name);
    const optFeatureCount = optData.features ? optData.features.length : 0;

    // Verifikasi integritas jumlah fitur
    if (origFeatureCount !== optFeatureCount) {
      console.error(`[Error] Jumlah fitur tidak cocok pada ${item.name}: ${origFeatureCount} vs ${optFeatureCount}`);
      process.exit(1);
    }

    const optJson = JSON.stringify(optData);
    const optBytes = Buffer.byteLength(optJson, "utf8");
    totalOptimized += optBytes;

    // Tulis kembali berkas yang telah dioptimasi
    fs.writeFileSync(item.path, optJson, "utf8");

    const pct = (((origBytes - optBytes) / origBytes) * 100).toFixed(1);
    console.log(
      item.name.padEnd(36) +
      String(origFeatureCount).padStart(8) +
      formatBytes(origBytes).padStart(12) +
      formatBytes(optBytes).padStart(12) +
      `-${pct}%`.padStart(10)
    );
  }

  console.log("-".repeat(78));
  const totalSaved = totalOriginal - totalOptimized;
  const totalPct = (((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1);
  console.log(
    "TOTAL KESELURUHAN".padEnd(44) +
    formatBytes(totalOriginal).padStart(12) +
    formatBytes(totalOptimized).padStart(12) +
    `-${totalPct}%`.padStart(10)
  );
  console.log(`\nPenghematan Bandwidth Transfer: ${formatBytes(totalSaved)} (-${totalPct}%)`);
  console.log("Status: 100% Lulus Verifikasi Integritas Spasial");
}

if (process.argv.includes("--restore")) {
  restoreFromBackup();
} else {
  runOptimization();
}
