/**
 * scripts/patch_pages_lazy_layers.js
 *
 * Mengubah strategi pemuatan layer GeoJSON di dist/assets/pages-BdW-ZTL4.js:
 * 1. Menghilangkan setTimeout(2200) bulk preload yang mengunduh 18 MB layer serentak.
 * 2. Menginisialisasi layer unchecked dengan FeatureCollection kosong agar tetap muncul di LayersControl.
 * 3. Menambahkan listener 'overlayadd' di useMapEvents (Ve) untuk melakukan fetch on-demand
 *    hanya saat pengguna mencentang checkbox layer bersangkutan di peta.
 */

import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const BUNDLE_PATH = path.join(ROOT_DIR, "dist", "assets", "pages-BdW-ZTL4.js");
const BACKUP_PATH = path.join(ROOT_DIR, "dist", "assets", "pages-BdW-ZTL4.js.bak");

console.log("================================================================================");
console.log(" SISPERTANI — Patch True-Lazy Loading Layer Peta (pages-BdW-ZTL4.js)");
console.log("================================================================================");

if (!fs.existsSync(BUNDLE_PATH)) {
  console.error("[Error] Berkas bundle tidak ditemukan:", BUNDLE_PATH);
  process.exit(1);
}

// Backup bundle asli jika belum ada
if (!fs.existsSync(BACKUP_PATH)) {
  fs.copyFileSync(BUNDLE_PATH, BACKUP_PATH);
  console.log("✓ Berkas backup dibuat di:", BACKUP_PATH);
}

let content = fs.readFileSync(BUNDLE_PATH, "utf8");

// Target 1: Modifikasi Ve untuk menerima onOverlayAdd
const target1 = "Ve=({zoomRef:e,restyle:t})=>{let n=be({zoomend:()=>{e.current=n.getZoom(),t()}});return null}";
const replace1 = "Ve=({zoomRef:e,restyle:t,onOverlayAdd:o})=>{let n=be({zoomend:()=>{e.current=n.getZoom(),t()},overlayadd:a=>{o&&o(a)}});return null}";

if (!content.includes(target1)) {
  console.error("[Error] Target 1 (Ve definition) tidak ditemukan!");
  process.exit(1);
}

// Target 2: Eliminasi setTimeout(2200) dan inisialisasi empty FeatureCollection untuk unchecked layers
const target2 = "Promise.all(Ie.filter(e=>e.checked).map(async e=>{try{let r=await fetch(e.file);if(!r.ok)return[e.key,null];let i=await r.json();return[e.key,i]}catch{return[e.key,null]}})).then(e=>{c(prev=>({...prev,...Object.fromEntries(e.filter(x=>x[1]!==null))}));setTimeout(()=>{Ie.filter(e=>!e.checked).forEach(async e=>{try{let r=await fetch(e.file);if(r.ok){let i=await r.json();c(prev=>({...prev,[e.key]:i}))}}catch{}})},2200)})";
const replace2 = "Promise.all(Ie.filter(e=>e.checked).map(async e=>{try{let r=await fetch(e.file);if(!r.ok)return[e.key,null];let i=await r.json();return[e.key,i]}catch{return[e.key,null]}})).then(e=>{c(prev=>({...prev,...Object.fromEntries(Ie.filter(e=>!e.checked).map(e=>[e.key,{type:`FeatureCollection`,features:[]}])),...Object.fromEntries(e.filter(x=>x[1]!==null))}))})";

if (!content.includes(target2)) {
  console.error("[Error] Target 2 (useEffect bulk fetch) tidak ditemukan!");
  process.exit(1);
}

// Target 3: Render Ve dengan onOverlayAdd: ql dan definisi handler ql
const target3 = "(0,R.jsx)(Ve,{zoomRef:N,restyle:fe})";
const replace3 = "(0,R.jsx)(Ve,{zoomRef:N,restyle:fe,onOverlayAdd:ql})";

if (!content.includes(target3)) {
  console.error("[Error] Target 3 (Ve render) tidak ditemukan!");
  process.exit(1);
}

// Deklarasi ql di dalam komponen Ze
const targetDecl = "re=e=>{try{let t=W.default.geoJSON(e.feature).getBounds();";
const replaceDecl = "ql=e=>{let t=Ie.find(t=>t.name===e.name);t&&c(e=>{if(!e[t.key]||!e[t.key].features||e[t.key].features.length===0){fetch(t.file).then(e=>e.ok?e.json():null).then(e=>{e&&c(n=>({...n,[t.key]:e}))}).catch(e=>console.error(`Gagal memuat layer ${t.name}:`,e))}return e})},re=e=>{try{let t=W.default.geoJSON(e.feature).getBounds();";

if (!content.includes(targetDecl)) {
  console.error("[Error] Target Deklarasi ql tidak ditemukan!");
  process.exit(1);
}

// Lakukan replace
content = content.replace(target1, replace1);
content = content.replace(target2, replace2);
content = content.replace(targetDecl, replaceDecl);
content = content.replace(target3, replace3);

fs.writeFileSync(BUNDLE_PATH, content, "utf8");
console.log("✓ Berkas bundle berhasil diperbarui:", BUNDLE_PATH);
console.log("Status: True-Lazy Loading untuk seluruh layer GeoJSON berhasil diaktifkan!");
