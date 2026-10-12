// Build script untuk menyatukan preamble Recharts Radar dengan komponen Kesesuaian Lahan Multi-Sektor
import fs from "fs";
import { execSync } from "child_process";

const bakFile = "dist/assets/suitability-BoKTpxZD.js.bak";
const targetFile = "dist/assets/suitability-BoKTpxZD.js";

if (!fs.existsSync(bakFile)) {
  console.error(`[build] File backup ${bakFile} tidak ditemukan!`);
  process.exit(1);
}

const bakCode = fs.readFileSync(bakFile, "utf8");
let currentCode = "";
if (fs.existsSync("./scratch/test_suitability.js")) {
  currentCode = fs.readFileSync("./scratch/test_suitability.js", "utf8");
} else {
  currentCode = fs.readFileSync(targetFile, "utf8");
}

// 1. Ambil preamble (Radar components & module imports) dari backup
const cutPoint = bakCode.indexOf("$=l(),") + "$=l(),".length;
let preamble = bakCode.slice(0, cutPoint);

// Ganti koma terakhir dengan titik koma
preamble = preamble.slice(0, -1) + ";";

// Tambahkan import createIcon dari index-CI1XYnwk.js
preamble = preamble.replace(
  'import{C as s,b as c,p as l,s as u}from"./index-CI1XYnwk.js";',
  'import{C as s,b as c,p as l,s as u,r as createIcon}from"./index-CI1XYnwk.js";'
);

// 2. Deklarasikan variabel adapter/bridge yang menghubungkan nama komponen ke identifier minified
const bridges = `
var React = H;
var jsx = $;
var LayoutWrapper = r;
var LoadingSpinner = u;
var MapPin = e;
var Award = t;
var Calendar = n;
var RadarChart = ti;
var PolarGrid = rn;
var PolarAngleAxis = Jn;
var PolarRadiusAxis = On;
var Radar = Fr;
var ResponsiveContainer = Re;
var BarChart = it;
var Bar = Ne;
var XAxis = je;
var YAxis = ot;
var Tooltip = we;
var CartesianGrid = Ie;
var Cell = Se;
var LabelList = _e;
`;

// 3. Ambil body komponen halaman baru
const bodyStart = currentCode.indexOf("// Lucide Icons");
if (bodyStart === -1) {
  console.error("[build] Marker '// Lucide Icons' tidak ditemukan pada kode sumber!");
  process.exit(1);
}
const body = currentCode.slice(bodyStart);

const fullCode = preamble + "\n" + bridges + "\n" + body;

// 4. Validasi syntax sebelum menulis ke target
fs.writeFileSync("./scratch/build_temp.js", fullCode, "utf8");
try {
  execSync("node --check ./scratch/build_temp.js");
  fs.writeFileSync(targetFile, fullCode, "utf8");
  console.log(`[build_suitability_view] Berhasil membuat ${targetFile} (${fullCode.length} bytes)`);
} catch (err) {
  console.error("[build_suitability_view] Gagal validasi syntax:", err.message);
  process.exit(1);
}
