/**
 * scripts/apply_all_domain_images.js
 *
 * Menerapkan gambar domain 64px secara konsisten di semua halaman:
 * - Menggunakan path resmi: /img/domain/<file>.png (100% di dalam folder domain)
 * - Menggunakan className: flex shrink-0 items-center justify-center p-2 bg-white border border-slate-200 rounded-xl shadow-sm w-28 h-20 overflow-hidden
 *   (tanpa 'hidden sm:flex' agar SELALU tampil di semua ukuran layar dan rasio jendela)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT_DIR, "dist", "assets");

console.log("=== Memperbarui Seluruh Header Gambar Domain (Pasti Tampil & Seragam) ===");

// 1. Update index-CI1XYnwk.js (PageHeader Ft component)
const indexPath = path.join(ASSETS_DIR, "index-CI1XYnwk.js");
if (fs.existsSync(indexPath)) {
  let code = fs.readFileSync(indexPath, "utf8");
  const p1 = code.indexOf("function Ft({");
  const p2 = code.indexOf(";function It({");
  if (p1 !== -1 && p2 !== -1) {
    const cleanFt = `function Ft({icon:e,title:t,subtitle:n,actions:r,className:i=""}){var _m=null;if(typeof t==="string"){if(t.includes("Sayuran")||t.includes("Horti")){_m="/img/domain/horticulture.png"}else if(t.includes("Perkebunan")||t.includes("Kebun")){_m="/img/domain/plantation.png"}else if(t.includes("Ternak")||t.includes("Peternakan")){_m="/img/domain/livestock.png"}else if(t.includes("Lahan")){_m="/img/domain/Irrigation512px.png"}}return(0,k.jsxs)("header",{className:"flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-2 "+i,children:[(0,k.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,k.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight",children:t}),n&&(0,k.jsx)("p",{className:"mt-1.5 max-w-3xl text-xs sm:text-sm font-medium text-slate-500 leading-relaxed",children:n})]}),(r||_m)&&(0,k.jsxs)("div",{className:"flex items-center gap-3 shrink-0",children:[r&&(0,k.jsx)("div",{className:"flex flex-wrap items-center gap-2",children:r}),_m&&(0,k.jsx)("div",{className:"flex shrink-0 items-center justify-center p-2 bg-white border border-slate-200 rounded-xl shadow-sm w-28 h-20 overflow-hidden",children:(0,k.jsx)("img",{src:_m,alt:String(t),className:"w-full h-full object-contain shrink-0",style:{maxHeight:"64px",maxWidth:"100%",objectFit:"contain"}})})]})]});}`;
    code = code.slice(0, p1) + cleanFt + code.slice(p2);
    fs.writeFileSync(indexPath, code, "utf8");
    console.log("✓ index-CI1XYnwk.js diperbarui (Hortikultura, Perkebunan, Peternakan, Lahan)");
  }
}

// 2. Update suitability-BoKTpxZD.js
const suitPath = path.join(ASSETS_DIR, "suitability-BoKTpxZD.js");
if (fs.existsSync(suitPath)) {
  let code = fs.readFileSync(suitPath, "utf8");
  const idx = code.indexOf("Kesesuaian Lahan & Komoditas Unggulan");
  if (idx !== -1) {
    const p1 = code.lastIndexOf("(0, jsx.jsxs)(\"header\"", idx);
    const p2 = code.indexOf("// 2. Tab Navigasi", idx);
    if (p1 !== -1 && p2 !== -1) {
      const headerSnippet = `(0, jsx.jsxs)("header", {
          className: "flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-2",
          children: [
            (0, jsx.jsxs)("div", {
              className: "flex-1 min-w-0",
              children: [
                (0, jsx.jsx)("h1", {
                  className: "text-2xl font-bold tracking-tight text-slate-900",
                  children: "Kesesuaian Lahan & Komoditas Unggulan"
                }),
                (0, jsx.jsx)("p", {
                  className: "text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed",
                  children: "Evaluasi kecocokan lahan komprehensif berdasarkan volume produksi riil, luas panen, dan agroklimat per kecamatan di Kabupaten Banjarnegara (mencakup Tanaman Pangan, Hortikultura, dan Perkebunan Rakyat)."
                })
              ]
            }),
            (0, jsx.jsx)("div", {
              className: "flex shrink-0 items-center justify-center p-2 bg-white border border-slate-200 rounded-xl shadow-sm w-28 h-20 overflow-hidden",
              children: (0, jsx.jsx)("img", {
                src: "/img/domain/suitability.png",
                alt: "Kesesuaian Lahan",
                className: "w-full h-full object-contain shrink-0",
                style: { maxHeight: "64px", maxWidth: "100%", objectFit: "contain" }
              })
            })
          ]
        }),

        `;
      code = code.slice(0, p1) + headerSnippet + code.slice(p2);
      fs.writeFileSync(suitPath, code, "utf8");
      console.log("✓ suitability-BoKTpxZD.js diperbarui (Kesesuaian Lahan)");
    }
  }
}

// 3. Update prediction-CDnhQcRe.js
const predPath = path.join(ASSETS_DIR, "prediction-CDnhQcRe.js");
if (fs.existsSync(predPath)) {
  let code = fs.readFileSync(predPath, "utf8");
  code = code.replaceAll("hidden sm:flex shrink-0", "flex shrink-0");
  fs.writeFileSync(predPath, code, "utf8");
  console.log("✓ prediction-CDnhQcRe.js diperbarui (Prediksi Panen)");
}

// 4. Update farmers-RBAkXoyn.js
const farmersPath = path.join(ASSETS_DIR, "farmers-RBAkXoyn.js");
if (fs.existsSync(farmersPath)) {
  let code = fs.readFileSync(farmersPath, "utf8");
  code = code.replaceAll("hidden sm:flex shrink-0", "flex shrink-0");
  fs.writeFileSync(farmersPath, code, "utf8");
  console.log("✓ farmers-RBAkXoyn.js diperbarui (Direktori Petani)");
}

// 5. Update other 6 files (ganti 'hidden sm:flex' ke 'flex shrink-0')
const others = [
  "pages-BdW-ZTL4.js",
  "food-security-Dw2-7ErS.js",
  "fisheries-5_2RapTI.js",
  "government-assistance-IGl4ANlx.js",
  "price-volatility-DAM5jR7a.js",
  "supply-chain-DHz-vGZ9.js"
];

for (const file of others) {
  const p = path.join(ASSETS_DIR, file);
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, "utf8");
    c = c.replaceAll("hidden sm:flex shrink-0", "flex shrink-0");
    fs.writeFileSync(p, c, "utf8");
    console.log(`✓ ${file} diperbarui (flex shrink-0 aktif tanpa sembunyi)`);
  }
}

console.log("=== Selesai! ===");
