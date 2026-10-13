/**
 * scripts/uniformize_header_images.js
 *
 * Menyeragamkan dimensi dan kontainer ilustrasi header di seluruh halaman:
 * 1. Menyeragamkan kontainer gambar dari w-full md:w-48 lg:w-64 (tinggi 144px)
 *    menjadi kartu kompak w-28 h-20 (tinggi 64px) seperti pada Dashboard Eksekutif.
 * 2. Merampingkan padding dan margin header dari py-4 md:py-8 pb-8 menjadi py-2 pb-3 mb-1.
 * 3. Mengatur gap vertikal container utama menjadi gap-5 py-0.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(ROOT_DIR, "dist", "assets");

const targetFiles = [
  "food-security-Dw2-7ErS.js",
  "fisheries-5_2RapTI.js",
  "government-assistance-IGl4ANlx.js",
  "price-volatility-DAM5jR7a.js",
  "supply-chain-DHz-vGZ9.js"
];

console.log("================================================================================");
console.log(" SISPERTANI — Penyeragaman Dimensi Ilustrasi Header Halaman (64px Kompak)");
console.log("================================================================================");

for (const file of targetFiles) {
  const filePath = path.join(ASSETS_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`[Skip] Berkas tidak ditemukan: ${file}`);
    continue;
  }

  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // 1. Seragamkan container div gambar
  const oldDivClass = "className:`w-full md:w-48 lg:w-64 shrink-0 flex items-center justify-center`";
  const newDivClass = "className:`hidden sm:flex shrink-0 items-center justify-center p-2 bg-white border border-slate-200 rounded-xl shadow-sm w-28 h-20 overflow-hidden`";
  if (content.includes(oldDivClass)) {
    content = content.replace(oldDivClass, newDivClass);
    modified = true;
  }

  // 2. Seragamkan img class dan tambahkan style batas tinggi 64px
  const oldImgClass = "className:`w-full max-h-32 md:max-h-36 object-contain`";
  const newImgClass = "className:`w-full h-full object-contain shrink-0`,style:{maxHeight:`64px`,maxWidth:`100%`,objectFit:`contain`}";
  if (content.includes(oldImgClass)) {
    content = content.replace(oldImgClass, newImgClass);
    modified = true;
  }

  // 3. Rampingkan header section
  const oldHeaderClass = "relative text-left animate-fade-in py-4 md:py-8 flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-200 pb-8";
  const newHeaderClass = "relative text-left animate-fade-in py-2 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-3 mb-1";
  if (content.includes(oldHeaderClass)) {
    content = content.replace(oldHeaderClass, newHeaderClass);
    modified = true;
  }

  // 4. Rampingkan outer section gap
  const oldOuterClass = "flex flex-col gap-8 py-2";
  const newOuterClass = "flex flex-col gap-5 py-0";
  if (content.includes(oldOuterClass)) {
    content = content.replace(oldOuterClass, newOuterClass);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✓ Berhasil diseragamkan: ${file}`);
  } else {
    console.log(`- Sudah seragam: ${file}`);
  }
}

console.log("Status: 100% Selesai penyeragaman visual header ilustrasi!");
