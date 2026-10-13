/**
 * scripts/fix_farmers_image.js
 *
 * Menghapus wrapper card/border dari gambar farmers.png di farmers-RBAkXoyn.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const FARMERS_PATH = path.join(ROOT_DIR, "dist", "assets", "farmers-RBAkXoyn.js");

let code = fs.readFileSync(FARMERS_PATH, "utf8");
const imgPos = code.indexOf("/img/domain/farmers.png");

if (imgPos === -1) {
  console.error("farmers.png tidak ditemukan!");
  process.exit(1);
}

const divStart = code.lastIndexOf('(0, T.jsx)("div"', imgPos);
const divEnd = code.indexOf("})", imgPos + 100) + 4; // covers outer closing })

console.log("Snippet to replace:");
console.log(code.slice(divStart, divEnd));

const cleanImg = '(0, T.jsx)("img", { src: "/img/domain/farmers.png", alt: "Direktori Petani", className: "h-14 sm:h-16 w-auto object-contain shrink-0 select-none", style: { maxHeight: "60px" } })';

code = code.slice(0, divStart) + cleanImg + code.slice(divEnd);
fs.writeFileSync(FARMERS_PATH, code, "utf8");
console.log("✓ farmers-RBAkXoyn.js berhasil diperbarui (tanpa border/card)!");
