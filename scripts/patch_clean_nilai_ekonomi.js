import fs from 'fs';

const filePath = 'dist/assets/nilai-ekonomi-uFV4-6ig.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Ensure live state is present
if (!content.includes('liveUmkm')) {
  const targetState = 'function ye(){let{bidang:a}=pe(),o=_e(a)?a:null,[peternakanSubTab,setPeternakanSubTab]=(0,C.useState)("valuasi"),[s,ne]=(0,C.useState)([])';
  const replaceState = 'function ye(){let{bidang:a}=pe(),o=_e(a)?a:null,[peternakanSubTab,setPeternakanSubTab]=(0,C.useState)("valuasi"),[liveUmkm,setLiveUmkm]=(0,C.useState)([]),[livePoultry,setLivePoultry]=(0,C.useState)([]),[liveNkv,setLiveNkv]=(0,C.useState)([]),[s,ne]=(0,C.useState)([])';
  if (content.includes(targetState)) {
    content = content.replace(targetState, replaceState);
  }
}

// 2. Add useEffect to fetch live data
const fetchHookMarker = '(0,C.useEffect)(()=>{let e=!0;return g(o).then(t=>{e&&ne(t)})';
const fetchHookReplace = '(0,C.useEffect)(()=>{if(o==="peternakan"){fetch("/api/v1/peternakan/umkm-pakan").then(r=>r.json()).then(d=>{if(Array.isArray(d))setLiveUmkm(d);}).catch(()=>{});fetch("/api/v1/peternakan/poultry-shop").then(r=>r.json()).then(d=>{if(Array.isArray(d))setLivePoultry(d);}).catch(()=>{});fetch("/api/v1/peternakan/nkv").then(r=>r.json()).then(d=>{if(Array.isArray(d))setLiveNkv(d);}).catch(()=>{});}},[o]);(0,C.useEffect)(()=>{let e=!0;return g(o).then(t=>{e&&ne(t)})';

if (content.includes(fetchHookMarker) && !content.includes('/api/v1/peternakan/umkm-pakan')) {
  content = content.replace(fetchHookMarker, fetchHookReplace);
}

// 3. Update nav labels cleanly
const oldNavSearch = 'o===`peternakan`?(0,w.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[(0,w.jsx)(`button`,{type:`button`,onClick:()=>setPeternakanSubTab(`valuasi`),className:peternakanSubTab===`valuasi`?`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold bg-emerald-700 text-white shadow-sm`:`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`,children:`1. Valuasi Nilai Ekonomi`}),(0,w.jsx)(`button`,{type:`button`,onClick:()=>setPeternakanSubTab(`pakan`),className:peternakanSubTab===`pakan`?`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold bg-emerald-700 text-white shadow-sm`:`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`,children:`2. UMKM Pakan Ternak`}),(0,w.jsx)(`button`,{type:`button`,onClick:()=>setPeternakanSubTab(`poultry`),className:peternakanSubTab===`poultry`?`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold bg-emerald-700 text-white shadow-sm`:`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`,children:`3. Toko Peternakan / Poultry Shop (Maps)`}),(0,w.jsx)(`button`,{type:`button`,onClick:()=>setPeternakanSubTab(`nkv`),className:peternakanSubTab===`nkv`?`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold bg-emerald-700 text-white shadow-sm`:`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`,children:`4. Usaha Ber-NKV (Bersertifikat)`})]}):';

const cleanNav = 'o===`peternakan`?(0,w.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[(0,w.jsx)(`button`,{type:`button`,onClick:()=>setPeternakanSubTab(`valuasi`),className:peternakanSubTab===`valuasi`?`px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white shadow-sm`:`px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`,children:`1. Nilai Ekonomi Ternak`}),(0,w.jsx)(`button`,{type:`button`,onClick:()=>setPeternakanSubTab(`pakan`),className:peternakanSubTab===`pakan`?`px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white shadow-sm`:`px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`,children:`2. UMKM Pakan Ternak`}),(0,w.jsx)(`button`,{type:`button`,onClick:()=>setPeternakanSubTab(`poultry`),className:peternakanSubTab===`poultry`?`px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white shadow-sm`:`px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`,children:`3. Toko Peternakan & Poultry Shop`}),(0,w.jsx)(`button`,{type:`button`,onClick:()=>setPeternakanSubTab(`nkv`),className:peternakanSubTab===`nkv`?`px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white shadow-sm`:`px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50`,children:`4. Unit Usaha Ber-NKV`})]}):';

if (content.includes(oldNavSearch)) {
  content = content.replace(oldNavSearch, cleanNav);
}

// 4. Replace customTabsContent cleanly
const p2 = ':(0,w.jsxs)(w.Fragment,{children:';
const i2 = content.indexOf(p2);
const start = content.lastIndexOf('(o===`peternakan`&&peternakanSubTab!==`valuasi`?', i2);

if (start !== -1 && i2 !== -1) {
  const newSegment = `(o===\`peternakan\`&&peternakanSubTab!==\`valuasi\`?(0,w.jsxs)(\`div\`,{className:\`flex flex-col gap-6\`,children:[
  peternakanSubTab===\`pakan\`&&(0,w.jsxs)(\`div\`,{className:\`flex flex-col gap-4\`,children:[
    (0,w.jsxs)(\`div\`,{className:\`p-4 bg-white rounded-xl border border-slate-200 shadow-sm\`,children:[
      (0,w.jsx)(\`h3\`,{className:\`text-xs font-semibold text-slate-700 uppercase tracking-wider\`,children:\`Direktori Pelaku Usaha Pakan Ternak Mandiri\`}),
      (0,w.jsx)(\`p\`,{className:\`text-xs text-slate-500 mt-1 leading-relaxed\`,children:\`Data pelaku usaha dan kelompok tani pengolah pakan ternak (silase tebon jagung, konsentrat, dan pakan fermentasi) di Kabupaten Banjarnegara.\`})
    ]}),
    (0,w.jsx)(\`div\`,{className:\`overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm\`,children:
      (0,w.jsxs)(\`table\`,{className:\`w-full text-sm\`,children:[
        (0,w.jsx)(\`thead\`,{children:(0,w.jsxs)(\`tr\`,{className:\`border-b border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold\`,children:[
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`No\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Kecamatan\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Nama Pelaku Usaha / Poktan\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Jenis Pakan Diproduksi\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-right\`,children:\`Kapasitas (Ton/Bulan)\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Kontak / Alamat\`})
        ]})}),
        (0,w.jsx)(\`tbody\`,{children:
          liveUmkm.length > 0 ? liveUmkm.map((item, idx)=>(0,w.jsxs)(\`tr\`,{key:idx,className:\`border-b border-slate-100 hover:bg-slate-50\`,children:[
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-500\`,children:idx+1}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 font-medium text-slate-800\`,children:item.kecamatan}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-700 font-semibold\`,children:item.nama_usaha}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-600\`,children:item.jenis_pakan}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-right tabular-nums text-slate-900\`,children:item.kapasitas_ton_bulan || \`—\`}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-500 text-xs\`,children:item.kontak || item.alamat || \`—\`})
          ]})) : (0,w.jsx)(\`tr\`,{children:(0,w.jsx)(\`td\`,{colSpan:6,className:\`px-4 py-8 text-center text-xs text-slate-500\`,children:\`Belum ada data pelaku usaha pakan ternak tersimpan. Data dapat diunggah melalui Menu Admin (Domain Peternakan & Keswan).\`})})
        })
      ]})
    })
  ]}),
  peternakanSubTab===\`poultry\`&&(0,w.jsxs)(\`div\`,{className:\`flex flex-col gap-4\`,children:[
    (0,w.jsxs)(\`div\`,{className:\`p-4 bg-white rounded-xl border border-slate-200 shadow-sm\`,children:[
      (0,w.jsx)(\`h3\`,{className:\`text-xs font-semibold text-slate-700 uppercase tracking-wider\`,children:\`Sebaran Toko Peternakan dan Poultry Shop\`}),
      (0,w.jsx)(\`p\`,{className:\`text-xs text-slate-500 mt-1 leading-relaxed\`,children:\`Data kios sapronak, penyedia obat hewan, vitamin, dan pakan ternak di Kabupaten Banjarnegara.\`})
    ]}),
    (0,w.jsx)(\`div\`,{className:\`overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm\`,children:
      (0,w.jsxs)(\`table\`,{className:\`w-full text-sm\`,children:[
        (0,w.jsx)(\`thead\`,{children:(0,w.jsxs)(\`tr\`,{className:\`border-b border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold\`,children:[
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`No\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Kecamatan\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Nama Toko / Kios\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Layanan / Produk\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Alamat / Kontak\`})
        ]})}),
        (0,w.jsx)(\`tbody\`,{children:
          livePoultry.length > 0 ? livePoultry.map((item, idx)=>(0,w.jsxs)(\`tr\`,{key:idx,className:\`border-b border-slate-100 hover:bg-slate-50\`,children:[
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-500\`,children:idx+1}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 font-medium text-slate-800\`,children:item.kecamatan}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-700 font-semibold\`,children:item.nama_toko}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-600\`,children:item.jenis_layanan || \`Sapronak & Pakan\`}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-500 text-xs\`,children:item.alamat || item.kontak || \`—\`})
          ]})) : (0,w.jsx)(\`tr\`,{children:(0,w.jsx)(\`td\`,{colSpan:5,className:\`px-4 py-8 text-center text-xs text-slate-500\`,children:\`Belum ada data toko peternakan / poultry shop tersimpan. Data dapat diunggah melalui Menu Admin (Domain Peternakan & Keswan).\`})})
        })
      ]})
    })
  ]}),
  peternakanSubTab===\`nkv\`&&(0,w.jsxs)(\`div\`,{className:\`flex flex-col gap-4\`,children:[
    (0,w.jsxs)(\`div\`,{className:\`p-4 bg-white rounded-xl border border-slate-200 shadow-sm\`,children:[
      (0,w.jsx)(\`h3\`,{className:\`text-xs font-semibold text-slate-700 uppercase tracking-wider\`,children:\`Register Sertifikasi Nomor Kontrol Veteriner (NKV)\`}),
      (0,w.jsx)(\`p\`,{className:\`text-xs text-slate-500 mt-1 leading-relaxed\`,children:\`Daftar unit usaha produk hewan yang telah memiliki registrasi dan sertifikasi Nomor Kontrol Veteriner di Kabupaten Banjarnegara.\`})
    ]}),
    (0,w.jsx)(\`div\`,{className:\`overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm\`,children:
      (0,w.jsxs)(\`table\`,{className:\`w-full text-sm\`,children:[
        (0,w.jsx)(\`thead\`,{children:(0,w.jsxs)(\`tr\`,{className:\`border-b border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold\`,children:[
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`No\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Kecamatan\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Nama Unit Usaha\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Nomor NKV\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-left\`,children:\`Kategori Usaha\`}),
          (0,w.jsx)(\`th\`,{className:\`px-3 py-2.5 text-center\`,children:\`Status Verifikasi\`})
        ]})}),
        (0,w.jsx)(\`tbody\`,{children:
          liveNkv.length > 0 ? liveNkv.map((item, idx)=>(0,w.jsxs)(\`tr\`,{key:idx,className:\`border-b border-slate-100 hover:bg-slate-50\`,children:[
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-500\`,children:idx+1}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 font-medium text-slate-800\`,children:item.kecamatan}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 font-semibold text-slate-800\`,children:item.nama_unit_usaha}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 font-mono text-xs text-slate-700\`,children:item.nomor_nkv || \`Proses Registrasi\`}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-slate-600\`,children:item.kategori}),
            (0,w.jsx)(\`td\`,{className:\`px-3 py-2 text-center\`,children:(0,w.jsx)(\`span\`,{className:\`px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800\`,children:item.status_verifikasi || \`Tercatat\`})})
          ]})) : (0,w.jsx)(\`tr\`,{children:(0,w.jsx)(\`td\`,{colSpan:6,className:\`px-4 py-8 text-center text-xs text-slate-500\`,children:\`Belum ada data unit usaha ber-NKV tersimpan. Data dapat diunggah melalui Menu Admin (Domain Peternakan & Keswan).\`})})
        })
      ]})
    })
  ]})
]})`;

  content = content.slice(0, start) + newSegment + content.slice(i2);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched nilai-ekonomi-uFV4-6ig.js cleanly!');
} else {
  console.error('Failed to locate range:', start, i2);
  process.exit(1);
}
