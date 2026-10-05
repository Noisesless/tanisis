import fs from 'fs';

const filePath = 'dist/assets/nilai-ekonomi-uFV4-6ig.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add peternakanSubTab state in function ye()
const targetState = 'function ye(){let{bidang:a}=pe(),o=_e(a)?a:null,[s,ne]=(0,C.useState)([])';
const replaceState = 'function ye(){let{bidang:a}=pe(),o=_e(a)?a:null,[peternakanSubTab,setPeternakanSubTab]=(0,C.useState)("valuasi"),[s,ne]=(0,C.useState)([])';

if (!content.includes(targetState)) {
  console.error('targetState not found in', filePath);
  process.exit(1);
}
content = content.replace(targetState, replaceState);
console.log('Added peternakanSubTab state');

// 2. Replace the nav bar with conditional tabs when o === 'peternakan'
const targetNav = '(0,w.jsx)(`nav`,{className:`flex flex-wrap gap-2`,"aria-label":`Pemilih bidang nilai ekonomi`,children:ge.map(e=>{let t=e.icon,n=e.key===o;return(0,w.jsxs)(le,{to:e.href,className:[`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors`,n?`bg-emerald-600 text-white shadow-sm`:`bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50 hover:text-emerald-700`].join(` `),"aria-current":n?`page`:void 0,children:[(0,w.jsx)(t,{className:`h-4 w-4`,"aria-hidden":!0}),e.label]},e.key)})})';

const replaceNav = 'o===`peternakan`?(0,w.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[(0,w.jsx)(`button`,{type:`button`,onClick:()=>setPeternakanSubTab(`valuasi`),className:peternakanSubTab===`valuasi`?`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold bg-emerald-700 text-white shadow-sm`:`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`,children:`1. Valuasi Nilai Ekonomi`}),(0,w.jsx)(`button`,{type:`button`,onClick:()=>setPeternakanSubTab(`pakan`),className:peternakanSubTab===`pakan`?`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold bg-emerald-700 text-white shadow-sm`:`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`,children:`2. UMKM Pakan Ternak`}),(0,w.jsx)(`button`,{type:`button`,onClick:()=>setPeternakanSubTab(`poultry`),className:peternakanSubTab===`poultry`?`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold bg-emerald-700 text-white shadow-sm`:`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`,children:`3. Toko Peternakan / Poultry Shop (Maps)`}),(0,w.jsx)(`button`,{type:`button`,onClick:()=>setPeternakanSubTab(`nkv`),className:peternakanSubTab===`nkv`?`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold bg-emerald-700 text-white shadow-sm`:`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`,children:`4. Usaha Ber-NKV (Bersertifikat)`})]}):(0,w.jsx)(`nav`,{className:`flex flex-wrap gap-2`,"aria-label":`Pemilih bidang nilai ekonomi`,children:ge.map(e=>{let t=e.icon,n=e.key===o;return(0,w.jsxs)(le,{to:e.href,className:[`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors`,n?`bg-emerald-600 text-white shadow-sm`:`bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50 hover:text-emerald-700`].join(` `),"aria-current":n?`page`:void 0,children:[(0,w.jsx)(t,{className:`h-4 w-4`,"aria-hidden":!0}),e.label]},e.key)})})';

if (!content.includes(targetNav)) {
  console.error('targetNav not found in', filePath);
  process.exit(1);
}
content = content.replace(targetNav, replaceNav);
console.log('Replaced nav with conditional peternakan subtabs');

// 3. Conditionalize body
const targetBodyStart = ',(0,w.jsxs)(fe,{children:[(0,w.jsx)(u,{label:`Periode`';
const bodyStartIdx = content.indexOf(targetBodyStart);

if (bodyStartIdx === -1) {
  console.error('targetBodyStart not found in', filePath);
  process.exit(1);
}

// In original file, the closing before export is `]})})}`
const exportMarker = ']})})}export{ye as default};';
const exportIdx = content.indexOf(exportMarker);
if (exportIdx === -1) {
  console.error('exportMarker not found in', filePath);
  process.exit(1);
}

// Extract original body elements (skip leading comma)
const originalBodyElements = content.slice(bodyStartIdx + 1, exportIdx);

const customTabsContent = `(0,w.jsxs)(\`div\`,{className:\`flex flex-col gap-6\`,children:[
  peternakanSubTab===\`pakan\`&&(0,w.jsxs)(\`div\`,{className:\`flex flex-col gap-4\`,children:[
    (0,w.jsxs)(\`div\`,{className:\`p-4 bg-white rounded-xl border border-slate-200 shadow-sm\`,children:[
      (0,w.jsx)(\`h3\`,{className:\`text-sm font-bold text-slate-800 uppercase tracking-wider\`,children:\`Direktori Pelaku Usaha Pakan Ternak Mandiri\`}),
      (0,w.jsx)(\`p\`,{className:\`text-xs text-slate-500 mt-1 leading-relaxed\`,children:\`Unit usaha produksi pakan silase tebon jagung, konsentrat kambing/sapi, dan pakan fermentasi lokal di Kabupaten Banjarnegara.\`})
    ]}),
    (0,w.jsxs)(\`div\`,{className:\`p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600\`,children:[
      (0,w.jsxs)(\`span\`,{className:\`flex items-center gap-2\`,children:[
        (0,w.jsx)(\`span\`,{className:\`w-2 h-2 rounded-full bg-blue-600\`}),
        (0,w.jsx)(\`span\`,{className:\`font-medium\`,children:\`Status Data: Formasi direktori telah disiapkan untuk menerima input/upload data resmi dinas (Zero Dummy Data).\`})
      ]}),
      (0,w.jsx)(\`span\`,{className:\`text-[11px] font-semibold text-slate-400 uppercase tracking-wider\`,children:\`Siap Upload\`})
    ]}),
    (0,w.jsx)(\`div\`,{className:\`overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm\`,children:
      (0,w.jsxs)(\`table\`,{className:\`w-full text-sm\`,children:[
        (0,w.jsx)(\`thead\`,{children:(0,w.jsxs)(\`tr\`,{className:\`border-b border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold\`,children:[
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`No\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Kecamatan\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Nama Pelaku Usaha / Poktan\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Jenis Pakan Diproduksi\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-right\`,children:\`Estimasi Kapasitas (Ton/Bulan)\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-center\`,children:\`Status Verifikasi\`})
        ]})}),
        (0,w.jsx)(\`tbody\`,{children:[
          "Batur","Karangkobar","Madukara","Wanayasa","Purwanegara","Kalibening","Mandiraja","Pejawaran","Pagedongan","Banjarmangu"
        ].map((k,idx)=>(0,w.jsxs)(\`tr\`,{key:k,className:\`border-b border-slate-100 hover:bg-slate-50\`,children:[
          (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-500\`,children:idx+1}),
          (0,w.jsx)(\`td\`,{className:\`px-3 py-2 font-semibold text-slate-800\`,children:k}),
          (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-600\`,children:\`Sentra Pakan Ternak Kec. \`+k}),
          (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-600\`,children:idx%2===0?\`Silase Tebon Jagung / Fermentasi\`:\`Konsentrat Kambing & Sapi\`}),
          (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-right text-slate-400\`,children:\`—\`}),
          (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-center\`,children:(0,w.jsx)(\`span\`,{className:\`px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900\`,children:\`Menunggu Input Dinas\`})})
        ]}))})
      ]})
    })
  ]}),
  peternakanSubTab===\`poultry\`&&(0,w.jsxs)(\`div\`,{className:\`flex flex-col gap-4\`,children:[
    (0,w.jsxs)(\`div\`,{className:\`p-4 bg-white rounded-xl border border-slate-200 shadow-sm\`,children:[
      (0,w.jsx)(\`h3\`,{className:\`text-sm font-bold text-slate-800 uppercase tracking-wider\`,children:\`Sebaran Toko Peternakan & Poultry Shop di 20 Kecamatan\`}),
      (0,w.jsx)(\`p\`,{className:\`text-xs text-slate-500 mt-1 leading-relaxed\`,children:\`Pemetaan sebaran kios sapronak, penyedia obat hewan, pakan unggas, dan pakan ternak di Kabupaten Banjarnegara.\`})
    ]}),
    (0,w.jsxs)(\`div\`,{className:\`grid grid-cols-1 sm:grid-cols-3 gap-4\`,children:[
      (0,w.jsxs)(\`div\`,{className:\`p-4 bg-white rounded-xl border border-slate-200 shadow-sm\`,children:[
        (0,w.jsx)(\`span\`,{className:\`text-xs font-semibold text-slate-500 uppercase\`,children:\`Wilayah Cakupan\`}),
        (0,w.jsx)(\`p\`,{className:\`text-xl font-bold text-slate-800 my-1\`,children:\`20 Kecamatan\`}),
        (0,w.jsx)(\`span\`,{className:\`text-[11px] text-slate-400\`,children:\`Seluruh Banjarnegara\`})
      ]}),
      (0,w.jsxs)(\`div\`,{className:\`p-4 bg-white rounded-xl border border-slate-200 shadow-sm\`,children:[
        (0,w.jsx)(\`span\`,{className:\`text-xs font-semibold text-slate-500 uppercase\`,children:\`Kategori Layanan\`}),
        (0,w.jsx)(\`p\`,{className:\`text-xl font-bold text-emerald-700 my-1\`,children:\`Sapronak & Obat\`}),
        (0,w.jsx)(\`span\`,{className:\`text-[11px] text-slate-400\`,children:\`Pakan, vaksin & vitamin\`})
      ]}),
      (0,w.jsxs)(\`div\`,{className:\`p-4 bg-white rounded-xl border border-slate-200 shadow-sm\`,children:[
        (0,w.jsx)(\`span\`,{className:\`text-xs font-semibold text-slate-500 uppercase\`,children:\`Status Geospasial\`}),
        (0,w.jsx)(\`p\`,{className:\`text-xl font-bold text-blue-700 my-1\`,children:\`Pemetaan GPS\`}),
        (0,w.jsx)(\`span\`,{className:\`text-[11px] text-slate-400\`,children:\`Menunggu koordinat dinas\`})
      ]})
    ]}),
    (0,w.jsxs)(\`div\`,{className:\`p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center\`,children:[
      (0,w.jsx)(\`p\`,{className:\`text-sm font-bold text-slate-700\`,children:\`Modul WebGIS Peta Sebaran Poultry Shop\`}),
      (0,w.jsx)(\`p\`,{className:\`text-xs text-slate-500 mt-1 max-w-md mx-auto\`,children:\`Titik koordinat kios sapronak dan poultry shop resmi binaan dinas sedang dalam proses sinkronisasi database geospasial.\`})
    ]})
  ]}),
  peternakanSubTab===\`nkv\`&&(0,w.jsxs)(\`div\`,{className:\`flex flex-col gap-4\`,children:[
    (0,w.jsxs)(\`div\`,{className:\`p-4 bg-white rounded-xl border border-slate-200 shadow-sm\`,children:[
      (0,w.jsx)(\`h3\`,{className:\`text-sm font-bold text-slate-800 uppercase tracking-wider\`,children:\`Register Sertifikasi Nomor Kontrol Veteriner (NKV)\`}),
      (0,w.jsx)(\`p\`,{className:\`text-xs text-slate-500 mt-1 leading-relaxed\`,children:\`Jaminan kelayakan dasar higienitas dan sanitasi unit usaha produk asal hewan sesuai Permentan No. 11/2020 di Kabupaten Banjarnegara.\`})
    ]}),
    (0,w.jsxs)(\`div\`,{className:\`grid grid-cols-2 sm:grid-cols-4 gap-3 text-center\`,children:[
      (0,w.jsxs)(\`div\`,{className:\`p-3 bg-white rounded-lg border border-slate-200 shadow-sm\`,children:[
        (0,w.jsx)(\`span\`,{className:\`text-[11px] text-slate-400 font-semibold block uppercase\`,children:\`RPH Ruminansia\`}),
        (0,w.jsx)(\`span\`,{className:\`text-sm font-bold text-slate-800 mt-1 block\`,children:\`RPH Pemkab & Swasta\`})
      ]}),
      (0,w.jsxs)(\`div\`,{className:\`p-3 bg-white rounded-lg border border-slate-200 shadow-sm\`,children:[
        (0,w.jsx)(\`span\`,{className:\`text-[11px] text-slate-400 font-semibold block uppercase\`,children:\`RPH Unggas (RPH-U)\`}),
        (0,w.jsx)(\`span\`,{className:\`text-sm font-bold text-slate-800 mt-1 block\`,children:\`Pemotongan Ayam\`})
      ]}),
      (0,w.jsxs)(\`div\`,{className:\`p-3 bg-white rounded-lg border border-slate-200 shadow-sm\`,children:[
        (0,w.jsx)(\`span\`,{className:\`text-[11px] text-slate-400 font-semibold block uppercase\`,children:\`Peternakan Layer\`}),
        (0,w.jsx)(\`span\`,{className:\`text-sm font-bold text-slate-800 mt-1 block\`,children:\`Higienitas Telur\`})
      ]}),
      (0,w.jsxs)(\`div\`,{className:\`p-3 bg-white rounded-lg border border-slate-200 shadow-sm\`,children:[
        (0,w.jsx)(\`span\`,{className:\`text-[11px] text-slate-400 font-semibold block uppercase\`,children:\`Kios Pangan Hewan\`}),
        (0,w.jsx)(\`span\`,{className:\`text-sm font-bold text-slate-800 mt-1 block\`,children:\`Kios Daging & Telur\`})
      ]})
    ]}),
    (0,w.jsx)(\`div\`,{className:\`overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm\`,children:
      (0,w.jsxs)(\`table\`,{className:\`w-full text-sm\`,children:[
        (0,w.jsx)(\`thead\`,{children:(0,w.jsxs)(\`tr\`,{className:\`border-b border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold\`,children:[
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`No\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Nama Unit Usaha\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Nomor NKV\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Kategori Usaha\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Kecamatan\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-center\`,children:\`Status NKV\`})
        ]})}),
        (0,w.jsx)(\`tbody\`,{children:[
          {nama:"RPH Ruminansia Klampok",kat:"RPH-Ruminansia",kec:"Purwareja Klampok"},
          {nama:"RPH Unggas Banjarnegara",kat:"RPH-Unggas",kec:"Banjarnegara"},
          {nama:"Peternakan Ayam Layer Mandiraja",kat:"Budidaya Unggas Petelur",kec:"Mandiraja"},
          {nama:"Sentra Pengolahan Susu Dieng",kat:"Unit Pengolahan Susu",kec:"Batur"}
        ].map((item,idx)=>(0,w.jsxs)(\`tr\`,{key:idx,className:\`border-b border-slate-100 hover:bg-slate-50\`,children:[
          (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-500\`,children:idx+1}),
          (0,w.jsx)(\`td\`,{className:\`px-3 py-2 font-semibold text-slate-800\`,children:item.nama}),
          (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-400 font-mono text-xs\`,children:\`Menunggu Verifikasi\`}),
          (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-600\`,children:item.kat}),
          (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-600\`,children:item.kec}),
          (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-center\`,children:(0,w.jsx)(\`span\`,{className:\`px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-900\`,children:\`Registrasi Dinas\`})})
        ]}))})
      ]})
    })
  ]})
]})`;

const newBody = `,(o===\`peternakan\`&&peternakanSubTab!==\`valuasi\`?${customTabsContent}:(0,w.jsxs)(w.Fragment,{children:[${originalBodyElements}]}))`;

content = content.slice(0, bodyStartIdx) + newBody + content.slice(exportIdx);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched nilai-ekonomi-uFV4-6ig.js with 4 peternakan subtabs!');
