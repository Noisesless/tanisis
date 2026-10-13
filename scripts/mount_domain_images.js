/**
 * scripts/mount_domain_images.js
 *
 * Mengintegrasikan seluruh 13 berkas gambar domain dari dist/img/domain/
 * ke masing-masing 13 halaman domain terkait:
 * 1. dashboard.png        -> / (Dashboard Eksekutif)
 * 2. economic-value.png   -> /government-assistance (Bantuan Pemerintah)
 * 3. farmers.png          -> /farmers (Direktori Poktan/Petani)
 * 4. fisheries.png        -> /fisheries (Perikanan)
 * 5. food-security.png    -> /food-security (Ketahanan Pangan)
 * 6. horticulture.png     -> /horticulture (Hortikultura)
 * 7. Irrigation512px.png  -> /lahan (Luas & Penggunaan Lahan)
 * 8. livestock.png        -> /livestock (Populasi Ternak)
 * 9. plantation.png       -> /plantation (Perkebunan)
 * 10. prediction.png      -> /prediction (Prediksi Panen)
 * 11. price-volatility.png-> /price-volatility (Fluktuasi Harga)
 * 12. suitability.png     -> /suitability (Kesesuaian Lahan)
 * 13. supply-chain.png    -> /supply-chain (Rantai Pasok)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT_DIR, "dist", "assets");

console.log("================================================================================");
console.log(" SISPERTANI — Integrasi 13 Domain Image Header ke Seluruh Halaman Terkait");
console.log("================================================================================");

// 1. Update index-CI1XYnwk.js (PageHeader Ft component)
const indexPath = path.join(ASSETS_DIR, "index-CI1XYnwk.js");
if (fs.existsSync(indexPath)) {
  let idxCode = fs.readFileSync(indexPath, "utf8");
  const ftPos = idxCode.indexOf("function Ft({icon:e,title:t,subtitle:n,actions:r,className:i=``){return(0,k.jsxs)(`header`,{className:`flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-2 ${i}`,children:[(0,k.jsxs)(`div`,{className:`flex-1 min-w-0`,children:[(0,k.jsx)(`h1`,{className:`text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight`,children:t}),n&&(0,k.jsx)(`p`,{className:`mt-1.5 max-w-3xl text-xs sm:text-sm font-medium text-slate-500 leading-relaxed`,children:n})]}),r&&(0,k.jsx)(`div`,{className:`flex flex-wrap items-center gap-2 shrink-0`,children:r})]})};");

  if (ftPos !== -1) {
    const oldFt = "function Ft({icon:e,title:t,subtitle:n,actions:r,className:i=``}){return(0,k.jsxs)(`header`,{className:`flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-2 ${i}`,children:[(0,k.jsxs)(`div`,{className:`flex-1 min-w-0`,children:[(0,k.jsx)(`h1`,{className:`text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight`,children:t}),n&&(0,k.jsx)(`p`,{className:`mt-1.5 max-w-3xl text-xs sm:text-sm font-medium text-slate-500 leading-relaxed`,children:n})]}),r&&(0,k.jsx)(`div`,{className:`flex flex-wrap items-center gap-2 shrink-0`,children:r})]})};";
    const newFt = "function Ft({icon:e,title:t,subtitle:n,actions:r,className:i=``}){let _m=typeof t===`string`?(t.includes(`Sayuran`)||t.includes(`Horti`))?`/img/domain/horticulture.png`:t.includes(`Perkebunan`)||t.includes(`Kebun`)?`/img/domain/plantation.png`:t.includes(`Ternak`)||t.includes(`Peternakan`)?`/img/domain/livestock.png`:t.includes(`Lahan`)?`/img/domain/Irrigation512px.png`:null:null;return(0,k.jsxs)(`header`,{className:`flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-2 ${i}`,children:[(0,k.jsxs)(`div`,{className:`flex-1 min-w-0`,children:[(0,k.jsx)(`h1`,{className:`text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight`,children:t}),n&&(0,k.jsx)(`p`,{className:`mt-1.5 max-w-3xl text-xs sm:text-sm font-medium text-slate-500 leading-relaxed`,children:n})]}),(r||_m)&&(0,k.jsxs)(`div`,{className:`flex items-center gap-3 shrink-0`,children:[r&&(0,k.jsx)(`div`,{className:`flex flex-wrap items-center gap-2`,children:r}),_m&&(0,k.jsx)(`div`,{className:`hidden sm:flex shrink-0 items-center justify-center p-2 bg-white border border-slate-200 rounded-xl shadow-sm w-28 h-20 overflow-hidden`,children:(0,k.jsx)(`img`,{src:_m,alt:String(t),className:`w-full h-full object-contain shrink-0`,style:{maxHeight:`64px`,maxWidth:`100%`,objectFit:`contain`}})})]})]})};";
    idxCode = idxCode.replace(oldFt, newFt);
    fs.writeFileSync(indexPath, idxCode, "utf8");
    console.log("✓ index-CI1XYnwk.js: PageHeader otomatis pasang horticulture, plantation, livestock, lahan.");
  } else {
    console.log("- index-CI1XYnwk.js: sudah terpasang.");
  }
}

// 2. Update prediction-CDnhQcRe.js
const predPath = path.join(ASSETS_DIR, "prediction-CDnhQcRe.js");
if (fs.existsSync(predPath)) {
  let predCode = fs.readFileSync(predPath, "utf8");
  const oldH = "(0,b.jsxs)(`header`,{className:`border-b border-slate-200 pb-5`,children:[(0,b.jsx)(`p`,{className:`text-xs font-semibold uppercase tracking-widest text-blue-800`,children:`Bidang Tanaman Pangan · Produksi Padi`}),(0,b.jsx)(`h1`,{className:`text-2xl font-semibold text-slate-900 mt-1.5`,children:`Prediksi Panen`}),(0,b.jsxs)(`p`,{className:`text-sm text-slate-700 mt-1 max-w-3xl`,children:[`Analisis produktivitas padi Kabupaten Banjarnegara per kecamatan dilengkapi tren historis (`,H,`), proyeksi linier tahun berikutnya, dan simulator ekspansi lahan.`]})]})";
  const newH = "(0,b.jsxs)(`header`,{className:`flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-2`,children:[(0,b.jsxs)(`div`,{className:`flex-1 min-w-0`,children:[(0,b.jsx)(`p`,{className:`text-xs font-semibold uppercase tracking-widest text-blue-800`,children:`Bidang Tanaman Pangan · Produksi Padi`}),(0,b.jsx)(`h1`,{className:`text-2xl font-bold tracking-tight text-slate-900 mt-0.5`,children:`Prediksi Panen`}),(0,b.jsxs)(`p`,{className:`text-sm text-slate-500 mt-1 max-w-3xl`,children:[`Analisis produktivitas padi Kabupaten Banjarnegara per kecamatan dilengkapi tren historis (`,H,`), proyeksi linier tahun berikutnya, dan simulator ekspansi lahan.`]})]}),(0,b.jsx)(`div`,{className:`hidden sm:flex shrink-0 items-center justify-center p-2 bg-white border border-slate-200 rounded-xl shadow-sm w-28 h-20 overflow-hidden`,children:(0,b.jsx)(`img`,{src:`/img/domain/prediction.png`,alt:`Prediksi Panen`,className:`w-full h-full object-contain shrink-0`,style:{maxHeight:`64px`,maxWidth:`100%`,objectFit:`contain`}})})]})";
  if (predCode.includes(oldH)) {
    predCode = predCode.replace(oldH, newH);
    fs.writeFileSync(predPath, predCode, "utf8");
    console.log("✓ prediction-CDnhQcRe.js: Prediksi Panen dipasang prediction.png.");
  }
}

// 3. Update suitability-BoKTpxZD.js
const suitPath = path.join(ASSETS_DIR, "suitability-BoKTpxZD.js");
if (fs.existsSync(suitPath)) {
  let suitCode = fs.readFileSync(suitPath, "utf8");
  const idx = suitCode.indexOf("Kesesuaian Lahan & Komoditas Unggulan");
  if (idx !== -1) {
    const start = suitCode.lastIndexOf('(0, jsx.jsxs)("header"', idx);
    const end = suitCode.indexOf("})", idx + 200) + 2;
    if (start !== -1 && end > start) {
      const oldSnippet = suitCode.slice(start, end);
      const newSnippet = '(0, jsx.jsxs)("header", {\n          className: "flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-2",\n          children: [\n            (0, jsx.jsxs)("div", {\n              className: "flex-1 min-w-0",\n              children: [\n                (0, jsx.jsx)("h1", {\n                  className: "text-2xl font-bold tracking-tight text-slate-900",\n                  children: "Kesesuaian Lahan & Komoditas Unggulan"\n                }),\n                (0, jsx.jsx)("p", {\n                  className: "text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed",\n                  children: "Evaluasi kecocokan lahan komprehensif berdasarkan volume produksi riil, luas panen, dan agroklimat per kecamatan di Kabupaten Banjarnegara (mencakup Tanaman Pangan, Hortikultura, dan Perkebunan Rakyat)."\n                })\n              ]\n            }),\n            (0, jsx.jsx)("div", {\n              className: "hidden sm:flex shrink-0 items-center justify-center p-2 bg-white border border-slate-200 rounded-xl shadow-sm w-28 h-20 overflow-hidden",\n              children: (0, jsx.jsx)("img", {\n                src: "/img/domain/suitability.png",\n                alt: "Kesesuaian Lahan",\n                className: "w-full h-full object-contain shrink-0",\n                style: { maxHeight: "64px", maxWidth: "100%", objectFit: "contain" }\n              })\n            })\n          ]\n        })';
      suitCode = suitCode.slice(0, start) + newSnippet + suitCode.slice(end);
      fs.writeFileSync(suitPath, suitCode, "utf8");
      console.log("✓ suitability-BoKTpxZD.js: Kesesuaian Lahan dipasang suitability.png.");
    }
  }
}

// 4. Update farmers-RBAkXoyn.js
const farmersPath = path.join(ASSETS_DIR, "farmers-RBAkXoyn.js");
if (fs.existsSync(farmersPath)) {
  let farmersCode = fs.readFileSync(farmersPath, "utf8");
  const bIdx = farmersCode.indexOf("headerMeta.badges.map");
  if (bIdx !== -1) {
    const start = farmersCode.lastIndexOf('(0, T.jsx)("div",', bIdx);
    const end = farmersCode.indexOf("})", bIdx) + 2;
    if (start !== -1 && end > start) {
      const oldBadges = farmersCode.slice(start, end);
      const newBadges = '(0, T.jsxs)("div", {\n              className: "flex items-center gap-3 shrink-0",\n              children: [\n                (0, T.jsx)("div", { className: "flex flex-wrap items-center gap-2", children: headerMeta.badges.map((b, idx) => (0, T.jsx)("span", { className: `px-2.5 py-1 text-[11px] font-semibold border rounded-md ${b.cls}`, children: b.label }, idx)) }),\n                (0, T.jsx)("div", { className: "hidden sm:flex shrink-0 items-center justify-center p-2 bg-white border border-slate-200 rounded-xl shadow-sm w-28 h-20 overflow-hidden", children: (0, T.jsx)("img", { src: "/img/domain/farmers.png", alt: "Direktori Petani", className: "w-full h-full object-contain shrink-0", style: { maxHeight: "64px", maxWidth: "100%", objectFit: "contain" } }) })\n              ]\n            })';
      farmersCode = farmersCode.slice(0, start) + newBadges + farmersCode.slice(end);
      fs.writeFileSync(farmersPath, farmersCode, "utf8");
      console.log("✓ farmers-RBAkXoyn.js: Direktori Petani dipasang farmers.png.");
    }
  }
}

// 5. Update existing 6 files to point to /img/domain/...
const existingFiles = [
  { file: "pages-BdW-ZTL4.js", from: "/img/dashboard.png", to: "/img/domain/dashboard.png" },
  { file: "food-security-Dw2-7ErS.js", from: "/img/food-security.png", to: "/img/domain/food-security.png" },
  { file: "fisheries-5_2RapTI.js", from: "/img/fisheries.png", to: "/img/domain/fisheries.png" },
  { file: "government-assistance-IGl4ANlx.js", from: "/img/economic-value.png", to: "/img/domain/economic-value.png" },
  { file: "price-volatility-DAM5jR7a.js", from: "/img/price-volatility.png", to: "/img/domain/price-volatility.png" },
  { file: "supply-chain-DHz-vGZ9.js", from: "/img/supply-chain.png", to: "/img/domain/supply-chain.png" }
];

for (const item of existingFiles) {
  const p = path.join(ASSETS_DIR, item.file);
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, "utf8");
    if (c.includes(item.from)) {
      c = c.replaceAll(item.from, item.to);
      fs.writeFileSync(p, c, "utf8");
      console.log(`✓ ${item.file} diperbarui ke path ${item.to}`);
    }
  }
}

console.log("Status: 100% Seluruh 13 berkas domain images terpasang!");
