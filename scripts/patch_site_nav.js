import fs from 'fs';

// 1. Update site-B5h-x_N5.js
const sitePath = 'dist/assets/site-B5h-x_N5.js';
let siteContent = fs.readFileSync(sitePath, 'utf8');

const targetSite = '{title:`Peternakan & Keswan`,subtitle:`Domba Batur, Populasi & RPH`,icon:`ternak`,items:[{label:`Populasi & Produksi Ternak`,href:`/livestock`},{label:`Komoditas Unggulan Peternakan`,href:`/komoditas-unggulan/peternakan`},{label:`Nilai Ekonomi Peternakan`,href:`/nilai-ekonomi/peternakan`},{label:`Susu & Kulit Ternak`,href:`/peternakan/susu-kulit`},{label:`Lalu Lintas & Pemotongan RPH`,href:`/livestock-flow`}]}';

const replaceSite = '{title:`Peternakan & Keswan`,subtitle:`Domba Batur, Populasi & RPH`,icon:`ternak`,items:[{label:`Populasi Ternak`,href:`/livestock`},{label:`Produksi & Hasil Ikutan`,href:`/peternakan/susu-kulit`},{label:`Komoditas Unggulan Peternakan`,href:`/komoditas-unggulan/peternakan`},{label:`Nilai Ekonomi & Ekosistem Usaha`,href:`/nilai-ekonomi/peternakan`},{label:`Lalu Lintas, Pasar & RPH`,href:`/livestock-flow`}]}';

if (siteContent.includes(targetSite)) {
  siteContent = siteContent.replace(targetSite, replaceSite);
  fs.writeFileSync(sitePath, siteContent, 'utf8');
  console.log('Successfully updated site-B5h-x_N5.js navigation labels!');
} else {
  console.log('site-B5h-x_N5.js already has updated labels, skipping.');
}

// 2. Update default-CAKe9ffW.js icon mapper cases
const defPath = 'dist/assets/default-CAKe9ffW.js';
let defContent = fs.readFileSync(defPath, 'utf8');

// Match switch cases in default layout
const targetDef = 'case`Populasi & Produksi Ternak`:return(0,J.jsx)(n,{className:h});case`Kesehatan Hewan & Zoonosis`:return(0,J.jsx)(N,{className:h});case`Pakan Ternak & Hijauan`:return(0,J.jsx)(C,{className:h});case`Susu & Kulit Ternak`:return(0,J.jsx)(A,{className:h});';
const replaceDef = 'case`Populasi Ternak`:case`Populasi & Produksi Ternak`:return(0,J.jsx)(n,{className:h});case`Kesehatan Hewan & Zoonosis`:return(0,J.jsx)(N,{className:h});case`Pakan Ternak & Hijauan`:return(0,J.jsx)(C,{className:h});case`Produksi & Hasil Ikutan`:case`Susu & Kulit Ternak`:return(0,J.jsx)(A,{className:h});case`Nilai Ekonomi & Ekosistem Usaha`:return(0,J.jsx)(k,{className:h});case`Lalu Lintas, Pasar & RPH`:return(0,J.jsx)(W,{className:h});';

if (!defContent.includes(targetDef)) {
  console.error('targetDef not found in default-CAKe9ffW.js');
  process.exit(1);
}

defContent = defContent.replace(targetDef, replaceDef);
fs.writeFileSync(defPath, defContent, 'utf8');
console.log('Successfully updated default-CAKe9ffW.js icon mappings!');
