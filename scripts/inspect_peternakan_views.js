import fs from 'fs';

console.log('=== INSPECTING LIVESTOCK VIEW ===');
const lsCode = fs.readFileSync('dist/assets/livestock-D6KAVcvO.js', 'utf8');

// Find tab states or button texts
const tabMatch = lsCode.match(/tabs\s*=\s*\[[^\]]+\]/i) || lsCode.match(/\[\{id:[^}]+\}[^\]]*\]/);
console.log('Tab match in livestock:', tabMatch ? tabMatch[0] : 'None direct');

// Let's print string literals with Indonesian words
const re = /`([^`]{4,60})`/g;
let m;
const strings = new Set();
while ((m = re.exec(lsCode)) !== null) {
  if (m[1].includes('Ternak') || m[1].includes('Populasi') || m[1].includes('Produksi') || m[1].includes('Unggas') || m[1].includes('Besar') || m[1].includes('Kecil') || m[1].includes('Daging') || m[1].includes('Telur') || m[1].includes('Tab') || m[1].includes('Kecamatan')) {
    strings.add(m[1]);
  }
}
console.log('Interesting strings in livestock:', [...strings]);

console.log('\n=== INSPECTING SUSU KULIT VIEW ===');
const skCode = fs.readFileSync('dist/assets/peternakan-susu-kulit-B1vV3OM5.js', 'utf8');
const skStrings = new Set();
while ((m = re.exec(skCode)) !== null) {
  if (m[1].includes('Susu') || m[1].includes('Kulit') || m[1].includes('Produksi') || m[1].includes('Ternak') || m[1].includes('Tab') || m[1].includes('Kecamatan')) {
    skStrings.add(m[1]);
  }
}
console.log('Interesting strings in susu-kulit:', [...skStrings]);
