import assert from "node:assert/strict";
import { lookupOfflineKB, OFFLINE_AGRICULTURE_KB } from "../src/lib/ai-offline-kb.js";
import { synthesizeNaturalResponse, formatNum } from "../src/lib/ai-nlg.js";

console.log("=== Menjalankan Pengujian AI Fallback & Knowledge Base ===");

// 1. Uji Format Angka
assert.equal(formatNum(1234567), "1.234.567", "formatNum ribuan gagal");
assert.equal(formatNum(0), "0", "formatNum nol gagal");
console.log("✔ [Pass] formatNum berhasil memformat angka sesuai standar ID.");

// 2. Uji Lookup Offline Knowledge Base
const testCasesKB = [
  {
    query: "bagaimana cara mengendalikan hama wereng batang coklat pada padi sawah?",
    expectedId: "kb_hama_wereng"
  },
  {
    query: "apa ciri dan keunggulan bibit domba batur dieng?",
    expectedId: "kb_domba_batur"
  },
  {
    query: "bagaimana syarat dan alur pendaftaran kelompok tani di simluhtan?",
    expectedId: "kb_daftar_poktan"
  },
  {
    query: "sentra buah salak pondoh dan teknik penyerbukan bunga",
    expectedId: "kb_salak_pondoh"
  },
  {
    query: "bagaimana menangani penyakit patek antraknosa pada tanaman cabai?",
    expectedId: "kb_penyakit_antraknosa"
  }
];

for (const tc of testCasesKB) {
  const matches = lookupOfflineKB(tc.query);
  assert.ok(matches.length > 0, `KB tidak menemukan hasil untuk query: "${tc.query}"`);
  assert.equal(matches[0].id, tc.expectedId, `ID KB tidak sesuai untuk query: "${tc.query}"`);
  console.log(`✔ [Pass] KB Match: "${tc.query.slice(0, 35)}..." -> ${matches[0].title}`);
}

// 3. Uji Sintesis Bahasa Alami (NLG) dengan Konteks Database Mentah
const sampleRawContext = `RINGKASAN DATA KOMODITAS UNGGULAN SISTEM (TERVERIFIKASI PRODUKSI RIIL):
- Salak [Sektor Hortikultura, Tahun 2024]: Total Produksi 158.420 Ton, Sentra: Kec. Madukara
- Kopi Robusta [Sektor Perkebunan, Tahun 2024]: Total Produksi 2.167 Ton, Sentra: Kec. Karangkobar

DATA RESMI PRODUKSI PADI KABUPATEN BANJARNEGARA (TOTAL KABUPATEN):
- Tahun 2024: Total Produksi 185.320 Ton, Luas Panen 32.410 Ha`;

const nlgOutput = synthesizeNaturalResponse(sampleRawContext, [], "apa komoditas unggulan banjarnegara?");
assert.ok(nlgOutput.includes("Si Pertani"), "Harus menyertakan identitas Si Pertani");
assert.ok(nlgOutput.includes("Data Komoditas Unggulan Terverifikasi"), "Harus memiliki header naratif yang rapi");
assert.ok(nlgOutput.includes("Salak"), "Harus mempertahankan data komoditas Salak");
assert.ok(nlgOutput.includes("158.420"), "Harus mempertahankan angka produksi");
assert.ok(!nlgOutput.includes("RINGKASAN DATA KOMODITAS UNGGULAN SISTEM"), "Raw uppercase heading harus ditransformasi");
console.log("✔ [Pass] NLG berhasil mentransformasi raw context SQL menjadi teks narasi sopan & terstruktur.");

// 4. Uji Sintesis Kombinasi (Data Statistik + SOP Offline KB)
const werengKB = lookupOfflineKB("hama wereng pada padi");
const samplePadiContext = `DATA RESMI PRODUKSI PADI KABUPATEN BANJARNEGARA (TOTAL KABUPATEN):
- Tahun 2024: Total Produksi 185.320 Ton, Luas Panen 32.410 Ha`;

const hybridOutput = synthesizeNaturalResponse(samplePadiContext, werengKB, "hama wereng pada padi");
assert.ok(hybridOutput.includes("Statistik Produksi Padi"), "Harus menyertakan data padi");
assert.ok(hybridOutput.includes("Pengendalian Hama Wereng"), "Harus menyertakan panduan SOP wereng");
assert.ok(hybridOutput.includes("Jajar legowo") || hybridOutput.includes("Beauveria bassiana"), "Harus memuat rekomendasi teknis");
console.log("✔ [Pass] Hybrid Sintesis (SQL + SOP KB) berhasil disajikan secara harmonis.");

// 5. Uji Kueri Kosong / Tidak Cocok
const emptyOutput = synthesizeNaturalResponse("", [], "pertanyaan di luar konteks pertanian");
assert.ok(emptyOutput.includes("Anda dapat menanyakan hal-hal berikut"), "Harus menyajikan panduan navigasi saat data kosong");
console.log("✔ [Pass] Fallback gracefully memberikan panduan fitur saat data kosong.");

console.log("\n=======================================================");
console.log("SEMUA 5 PENGUJIAN AI FALLBACK & NLG SELESAI DENGAN SUKSES!");
console.log("=======================================================");
