import fs from 'fs';

const filePath = 'dist/assets/livestock-D6KAVcvO.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update subtitle in livestock view
const targetHeader = 'subtitle:`Tren populasi ternak besar, kecil & unggas di Banjarnegara, deteksi anomali tahunan, serta produksi telur per kecamatan.`';
const replaceHeader = 'subtitle:`Statistik populasi ternak besar, kecil & unggas di 20 kecamatan Banjarnegara, rumpun asli Domba Batur, serta estimasi ternak dijual hidup.`';

if (content.includes(targetHeader)) {
  content = content.replace(targetHeader, replaceHeader);
  console.log('Updated subtitle in livestock view');
}

// 2. Target the Produksi Telur block
const targetBlockStart = 'R.length>0&&(0,O.jsxs)(h,{title:`Produksi Telur';
const startIdx = content.indexOf(targetBlockStart);

if (startIdx === -1) {
  console.error('targetBlockStart not found in livestock-D6KAVcvO.js');
  process.exit(1);
}

// In original file:
// R.length>0&&(0,O.jsxs)(h,{title:`Produksi Telur...})]})}export{k as default};
// Notice the closing before export{k as default}; is: )]})})}
const exportIdx = content.indexOf('export{k as default};');
const endIdx = exportIdx; // replaces everything between startIdx and exportIdx
const targetBlock = content.slice(startIdx, endIdx);

// Replacement block: Rumpun Domba Batur + Indikator Ternak Dijual Hidup
const replacementBlock = `(0,O.jsxs)(h,{title:\`Rumpun Asli Domba Batur Banjarnegara (SK Mentan No. 2916/2011)\`,icon:(0,O.jsx)(s,{size:16,className:\`text-emerald-600\`}),actions:(0,O.jsx)(m,{tone:\`green\`,children:\`Rumpun Unggulan Nasional\`}),children:[(0,O.jsxs)(\`div\`,{className:\`grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\`,children:[(0,O.jsxs)(\`div\`,{className:\`p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60\`,children:[(0,O.jsx)(\`p\`,{className:\`text-[11px] font-bold text-emerald-800 uppercase tracking-wider\`,children:\`Karakteristik Biologis\`}),(0,O.jsx)(\`p\`,{className:\`text-xs text-slate-600 mt-1 leading-relaxed\`,children:\`Hasil persilangan domba Merino dan domba Ekor Tipis lokal yang beradaptasi di iklim dingin Dieng. Wol lebat menutup muka hingga kaki, tanpa tanduk pada jantan/betina.\`})]}),(0,O.jsxs)(\`div\`,{className:\`p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60\`,children:[(0,O.jsx)(\`p\`,{className:\`text-[11px] font-bold text-amber-800 uppercase tracking-wider\`,children:\`Sentra Sebaran Wilayah\`}),(0,O.jsx)(\`p\`,{className:\`text-xs text-slate-600 mt-1 leading-relaxed\`,children:\`Terpusat di dataran tinggi: Kecamatan Batur, Pejawaran, dan Wanayasa. Memiliki pertambahan bobot harian (ADG) tinggi (150-200 gram/hari) dengan bobot jantan mencapai 80-120 kg.\`})]}),(0,O.jsxs)(\`div\`,{className:\`p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/60\`,children:[(0,O.jsx)(\`p\`,{className:\`text-[11px] font-bold text-blue-800 uppercase tracking-wider\`,children:\`Status Integrasi Data\`}),(0,O.jsx)(\`p\`,{className:\`text-xs text-slate-600 mt-1 leading-relaxed\`,children:\`Saat ini data sensus BPS masih menggabungkan Domba Batur dalam kategori Domba umum. Sistem telah siap menyajikan data terpilah saat dinas mengunggah hasil pendataan spesifik.\`})]})]}),(0,O.jsxs)(\`div\`,{className:\`flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600\`,children:[(0,O.jsxs)(\`span\`,{className:\`flex items-center gap-1.5 font-medium\`,children:[(0,O.jsx)(\`span\`,{className:\`w-2 h-2 rounded-full bg-emerald-500\`}),\`Data Produksi Telur, Daging & Susu kini dipisahkan ke menu khusus:\`]}),(0,O.jsx)(\`a\`,{href:\`/peternakan/susu-kulit\`,className:\`inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 underline\`,children:\`Buka Menu Produksi & Hasil Ikutan →\`})]})]}),(0,O.jsxs)(h,{title:\`Estimasi Perdagangan Ternak Dijual Hidup (Ekor)\`,icon:(0,O.jsx)(i,{size:16,className:\`text-blue-600\`}),actions:(0,O.jsx)(m,{tone:\`blue\`,children:\`Pasar & Lalu Lintas\`}),children:[(0,O.jsx)(\`p\`,{className:\`text-xs text-slate-500 mb-3\`,children:\`Selain karkas daging, sebagian besar peternak Banjarnegara memasarkan ternak dalam bentuk ternak hidup (bibit unggul, bakalan penggemukan, dan hewan kurban/aqiqah). Sebaran transaksi dipusatkan di Pasar Hewan Purwareja Klampok, Madukara, dan pasar kecamatan.\`}),(0,O.jsxs)(\`div\`,{className:\`grid grid-cols-2 sm:grid-cols-4 gap-3 text-center\`,children:[(0,O.jsxs)(\`div\`,{className:\`p-3 bg-white border border-slate-200 rounded-lg shadow-sm\`,children:[(0,O.jsx)(\`span\`,{className:\`text-[11px] text-slate-400 font-semibold block uppercase\`,children:\`Sapi Potong Hidup\`}),(0,O.jsx)(\`span\`,{className:\`text-base font-bold text-slate-800 mt-1 block\`,children:\`Perdagangan Pasar\`}),(0,O.jsx)(\`span\`,{className:\`text-[10px] text-emerald-600 font-medium\`,children:\`Pasar Klampok & Lokal\`})]}),(0,O.jsxs)(\`div\`,{className:\`p-3 bg-white border border-slate-200 rounded-lg shadow-sm\`,children:[(0,O.jsx)(\`span\`,{className:\`text-[11px] text-slate-400 font-semibold block uppercase\`,children:\`Domba Batur Bibit\`}),(0,O.jsx)(\`span\`,{className:\`text-base font-bold text-slate-800 mt-1 block\`,children:\`Sentra Batur/Dieng\`}),(0,O.jsx)(\`span\`,{className:\`text-[10px] text-emerald-600 font-medium\`,children:\`Kontes & Pembibitan\`})]}),(0,O.jsxs)(\`div\`,{className:\`p-3 bg-white border border-slate-200 rounded-lg shadow-sm\`,children:[(0,O.jsx)(\`span\`,{className:\`text-[11px] text-slate-400 font-semibold block uppercase\`,children:\`Kambing / Domba Lokal\`}),(0,O.jsx)(\`span\`,{className:\`text-base font-bold text-slate-800 mt-1 block\`,children:\`Qurban & Aqiqah\`}),(0,O.jsx)(\`span\`,{className:\`text-[10px] text-blue-600 font-medium\`,children:\`Permintaan Sepanjang Tahun\`})]}),(0,O.jsxs)(\`div\`,{className:\`p-3 bg-white border border-slate-200 rounded-lg shadow-sm\`,children:[(0,O.jsx)(\`span\`,{className:\`text-[11px] text-slate-400 font-semibold block uppercase\`,children:\`Unggas Hidup / DOC\`}),(0,O.jsx)(\`span\`,{className:\`text-base font-bold text-slate-800 mt-1 block\`,children:\`Peternakan Rakyat\`}),(0,O.jsx)(\`span\`,{className:\`text-[10px] text-purple-600 font-medium\`,children:\`Kemitraan & Mandiri\`})]})]})]})]})})}`;

content = content.replace(targetBlock, replacementBlock);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully refactored livestock-D6KAVcvO.js to focus purely on population and Domba Batur!');
