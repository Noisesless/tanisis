import fs from "fs";

const target = process.argv[2] || "./dist/assets/suitability-BoKTpxZD.js";
const file = fs.readFileSync(target, "utf8");

// Cari semua import statement
const importRegex = /import\s*\{([^}]+)\}\s*from\s*["']\.\/([^"']+)["'];/g;
let match;
let allValid = true;

while ((match = importRegex.exec(file)) !== null) {
  const importedList = match[1].split(",").map(s => s.trim()).filter(Boolean);
  const targetFile = `./dist/assets/${match[2]}`;
  
  if (!fs.existsSync(targetFile)) {
    console.error(`Target file ${targetFile} TIDAK DITEMUKAN!`);
    allValid = false;
    continue;
  }
  
  const targetCode = fs.readFileSync(targetFile, "utf8");
  const exportMatches = targetCode.match(/export\s*\{([^}]+)\}/g);
  const exportedNames = new Set();
  
  if (exportMatches) {
    for (const em of exportMatches) {
      const inner = em.replace(/^export\s*\{|\}$/g, "");
      const items = inner.split(",").map(s => s.trim()).filter(Boolean);
      for (const item of items) {
        const parts = item.split(/\s+as\s+/);
        exportedNames.add(parts.length === 2 ? parts[1] : parts[0]);
      }
    }
  }

  const funcMatches = [...targetCode.matchAll(/export\s+(?:async\s+)?function\s+([a-zA-Z0-9_$]+)/g)];
  for (const fm of funcMatches) exportedNames.add(fm[1]);

  const varMatches = [...targetCode.matchAll(/export\s+(?:const|let|var)\s+([a-zA-Z0-9_$]+)/g)];
  for (const vm of varMatches) exportedNames.add(vm[1]);

  if (/export\s+default\b/.test(targetCode)) exportedNames.add("default");
  
  console.log(`Checking ${targetFile} (exports: ${exportedNames.size})...`);
  for (const imp of importedList) {
    const parts = imp.split(/\s+as\s+/);
    const originName = parts[0];
    if (!exportedNames.has(originName)) {
      console.error(`  ERROR: ${originName} TIDAK DIEKSPOR OLEH ${targetFile}!`);
      allValid = false;
    }
  }
}

if (allValid) {
  console.log("SEMUA IMPORT VALID 100%! Tidak ada missing export.");
} else {
  console.error("ADA IMPORT YANG GAGAL!");
}
