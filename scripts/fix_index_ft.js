/**
 * scripts/fix_index_ft.js
 *
 * Memperbaiki dan menyempurnakan implementasi Ft di dist/assets/index-CI1XYnwk.js
 * dengan sintaks ES Module yang 100% valid tanpa template literal escaping.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const INDEX_PATH = path.join(ROOT_DIR, "dist", "assets", "index-CI1XYnwk.js");

console.log("Memproses perbaikan index-CI1XYnwk.js...");

let code = fs.readFileSync(INDEX_PATH, "utf8");
const ftStart = code.indexOf("function Ft({");
const ftEnd = code.indexOf(";function It({");

if (ftStart === -1 || ftEnd === -1) {
  console.error("Gagal menemukan marker Ft/It di index-CI1XYnwk.js!");
  process.exit(1);
}

const cleanFt = `function Ft({icon:e,title:t,subtitle:n,actions:r,className:i=""}){var _m=null;if(typeof t==="string"){if(t.includes("Sayuran")||t.includes("Horti")){_m="/img/domain/horticulture.png"}else if(t.includes("Perkebunan")||t.includes("Kebun")){_m="/img/domain/plantation.png"}else if(t.includes("Ternak")||t.includes("Peternakan")){_m="/img/domain/livestock.png"}else if(t.includes("Lahan")){_m="/img/domain/Irrigation512px.png"}}return(0,k.jsxs)("header",{className:"flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-2 "+i,children:[(0,k.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,k.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight",children:t}),n&&(0,k.jsx)("p",{className:"mt-1.5 max-w-3xl text-xs sm:text-sm font-medium text-slate-500 leading-relaxed",children:n})]}),(r||_m)&&(0,k.jsxs)("div",{className:"flex items-center gap-3 shrink-0",children:[r&&(0,k.jsx)("div",{className:"flex flex-wrap items-center gap-2",children:r}),_m&&(0,k.jsx)("div",{className:"hidden sm:flex shrink-0 items-center justify-center p-2 bg-white border border-slate-200 rounded-xl shadow-sm w-28 h-20 overflow-hidden",children:(0,k.jsx)("img",{src:_m,alt:String(t),className:"w-full h-full object-contain shrink-0",style:{maxHeight:"64px",maxWidth:"100%",objectFit:"contain"}})})]})]});}`;

code = code.slice(0, ftStart) + cleanFt + code.slice(ftEnd + 1);
fs.writeFileSync(INDEX_PATH, code, "utf8");
console.log("✓ Berhasil memperbarui Ft dengan sintaks aman 100%!");
