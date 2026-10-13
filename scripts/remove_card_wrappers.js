/**
 * scripts/remove_card_wrappers.js
 *
 * Menghapus wrapper box/card/border/shadow dari seluruh ilustrasi gambar domain.
 * Gambar ditampilkan secara alami dan bersih (unboxed illustration):
 * className: "h-14 sm:h-16 w-auto object-contain shrink-0 select-none"
 * style: { maxHeight: "60px" }
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT_DIR, "dist", "assets");

console.log("=== Menghapus Seluruh Border / Card Box pada Gambar Domain (Anti-Slop) ===");

// 1. Update index-CI1XYnwk.js (Ft Component)
const indexPath = path.join(ASSETS_DIR, "index-CI1XYnwk.js");
if (fs.existsSync(indexPath)) {
  let code = fs.readFileSync(indexPath, "utf8");
  const p1 = code.indexOf("function Ft({");
  const p2 = code.indexOf(";function It({");
  if (p1 !== -1 && p2 !== -1) {
    const cleanFt = `function Ft({icon:e,title:t,subtitle:n,actions:r,className:i=""}){var _m=null;if(typeof t==="string"){if(t.includes("Sayuran")||t.includes("Horti")){_m="/img/domain/horticulture.png"}else if(t.includes("Perkebunan")||t.includes("Kebun")){_m="/img/domain/plantation.png"}else if(t.includes("Ternak")||t.includes("Peternakan")){_m="/img/domain/livestock.png"}else if(t.includes("Lahan")){_m="/img/domain/Irrigation512px.png"}}return(0,k.jsxs)("header",{className:"flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-2 "+i,children:[(0,k.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,k.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight",children:t}),n&&(0,k.jsx)("p",{className:"mt-1.5 max-w-3xl text-xs sm:text-sm font-medium text-slate-500 leading-relaxed",children:n})]}),(r||_m)&&(0,k.jsxs)("div",{className:"flex items-center gap-3 shrink-0",children:[r&&(0,k.jsx)("div",{className:"flex flex-wrap items-center gap-2",children:r}),_m&&(0,k.jsx)("img",{src:_m,alt:String(t),className:"h-14 sm:h-16 w-auto object-contain shrink-0 select-none",style:{maxHeight:"60px"}})]})]})};`;
    code = code.slice(0, p1) + cleanFt + code.slice(p2);
    fs.writeFileSync(indexPath, code, "utf8");
    console.log("✓ index-CI1XYnwk.js diperbarui (tanpa card/border)");
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
            (0, jsx.jsx)("img", {
              src: "/img/domain/suitability.png",
              alt: "Kesesuaian Lahan",
              className: "h-14 sm:h-16 w-auto object-contain shrink-0 select-none",
              style: { maxHeight: "60px" }
            })
          ]
        }),

        `;
      code = code.slice(0, p1) + headerSnippet + code.slice(p2);
      fs.writeFileSync(suitPath, code, "utf8");
      console.log("✓ suitability-BoKTpxZD.js diperbarui (tanpa card/border)");
    }
  }
}

// 3. Update prediction-CDnhQcRe.js
const predPath = path.join(ASSETS_DIR, "prediction-CDnhQcRe.js");
if (fs.existsSync(predPath)) {
  let code = fs.readFileSync(predPath, "utf8");
  const pIdx = code.indexOf("/img/domain/prediction.png");
  if (pIdx !== -1) {
    const divStart = code.lastIndexOf("(0,b.jsx)(`div`", pIdx);
    const divEnd = code.indexOf("})})", pIdx) + 4;
    if (divStart !== -1 && divEnd > divStart) {
      const cleanImg = "(0,b.jsx)(`img`,{src:`/img/domain/prediction.png`,alt:`Prediksi Panen`,className:`h-14 sm:h-16 w-auto object-contain shrink-0 select-none`,style:{maxHeight:`60px`}})";
      code = code.slice(0, divStart) + cleanImg + code.slice(divEnd);
      fs.writeFileSync(predPath, code, "utf8");
      console.log("✓ prediction-CDnhQcRe.js diperbarui (tanpa card/border)");
    }
  }
}

// 4. Update farmers-RBAkXoyn.js
const farmersPath = path.join(ASSETS_DIR, "farmers-RBAkXoyn.js");
if (fs.existsSync(farmersPath)) {
  let code = fs.readFileSync(farmersPath, "utf8");
  const fIdx = code.indexOf("/img/domain/farmers.png");
  if (fIdx !== -1) {
    const divStart = code.lastIndexOf("(0, T.jsx)(\"div\", {\n              className: \"flex shrink-0", fIdx);
    const divEnd = code.indexOf("}) })", fIdx) + 5;
    if (divStart !== -1 && divEnd > divStart) {
      const cleanImg = '(0, T.jsx)("img", { src: "/img/domain/farmers.png", alt: "Direktori Petani", className: "h-14 sm:h-16 w-auto object-contain shrink-0 select-none", style: { maxHeight: "60px" } })';
      code = code.slice(0, divStart) + cleanImg + code.slice(divEnd);
      fs.writeFileSync(farmersPath, code, "utf8");
      console.log("✓ farmers-RBAkXoyn.js diperbarui (tanpa card/border)");
    }
  }
}

// 5. Update other 6 files
const files6 = [
  { file: "pages-BdW-ZTL4.js", img: "/img/domain/dashboard.png", jsx: "R" },
  { file: "food-security-Dw2-7ErS.js", img: "/img/domain/food-security.png", jsx: "w" },
  { file: "fisheries-5_2RapTI.js", img: "/img/domain/fisheries.png", jsx: "D" },
  { file: "government-assistance-IGl4ANlx.js", img: "/img/domain/economic-value.png", jsx: "T" },
  { file: "price-volatility-DAM5jR7a.js", img: "/img/domain/price-volatility.png", jsx: "k" },
  { file: "supply-chain-DHz-vGZ9.js", img: "/img/domain/supply-chain.png", jsx: "v" }
];

for (const item of files6) {
  const p = path.join(ASSETS_DIR, item.file);
  if (!fs.existsSync(p)) continue;
  let code = fs.readFileSync(p, "utf8");
  const idx = code.indexOf(item.img);
  if (idx === -1) continue;

  const divStart = code.lastIndexOf(`(0,${item.jsx}.jsx)(\`div\``, idx);
  const divEnd = code.indexOf("})})", idx) + 4;
  if (divStart !== -1 && divEnd > divStart) {
    const cleanImg = `(0,${item.jsx}.jsx)(\`img\`,{src:\`${item.img}\`,alt:\`Ilustrasi Domain\`,className:\`h-14 sm:h-16 w-auto object-contain shrink-0 select-none\`,style:{maxHeight:\`60px\`}})`;
    code = code.slice(0, divStart) + cleanImg + code.slice(divEnd);
    fs.writeFileSync(p, code, "utf8");
    console.log(`✓ ${item.file} diperbarui (tanpa card/border)`);
  }
}

console.log("=== Selesai menghapus seluruh card wrappers! ===");
