import fs from 'fs';

const filePath = 'dist/assets/komoditas-unggulan-BhWh4UVQ.js';
let code = fs.readFileSync(filePath, 'utf8');

console.log('Patching komoditas-unggulan view for dynamic sector years and units...');

// 1. Ganti logika tahun default agar mengikuti sektor yang sedang dibuka
const oldYearLogic = 'U=(0,D.useMemo)(()=>[...new Set(H.map(e=>e.tahun).filter(e=>e!=null))].sort((e,t)=>t-e).map(String),[H]),W=_||U[0]||``,';
const newYearLogic = 'U=(0,D.useMemo)(()=>{let f=L===`all`?H:H.filter(e=>e.bidang===L);let y=[...new Set(f.map(e=>e.tahun).filter(e=>e!=null))].sort((e,t)=>t-e).map(String);return y.length>0?y:[...new Set(H.map(e=>e.tahun).filter(e=>e!=null))].sort((e,t)=>t-e).map(String)},[H,L]),W=_&&U.includes(_)?_:(U[0]||``),';

if (code.includes(oldYearLogic)) {
  code = code.replace(oldYearLogic, newYearLogic);
  console.log('Successfully patched dynamic year selector!');
} else {
  console.warn('Old year logic not found, skipping year patch');
}

// 2. Ganti header tabel 'Produksi (Ton)' menjadi 'Produksi / Jumlah'
const oldTh = 'children:`Produksi (Ton)`}';
const newTh = 'children:`Produksi / Banyaknya`}';

if (code.includes(oldTh)) {
  code = code.replace(oldTh, newTh);
  console.log('Successfully patched table header for unit neutrality!');
} else {
  console.warn('Old table header not found');
}

// 3. Tambahkan satuan dinamis pada sel data produksi di tabel
const oldTdProd = 'text-right tabular-nums text-slate-700`,children:A(e.produksi)}';
const newTdProd = 'text-right tabular-nums text-slate-700`,children:(0,O.jsxs)(O.Fragment,{children:[A(e.produksi),` `,(0,O.jsx)(`span`,{className:`text-[11px] text-slate-500 font-medium`,children:e.satuan||(e.bidang===`Peternakan`?`Ekor`:`Ton`)})]})';

if (code.includes(oldTdProd)) {
  code = code.replace(oldTdProd, newTdProd);
  console.log('Successfully patched table cell with dynamic unit display!');
} else {
  console.warn('Old table cell not found');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('Finished updating dist/assets/komoditas-unggulan-BhWh4UVQ.js!');
