import{c as e,o as t,t as n,u as r}from"./default-CAKe9ffW.js";
import{t as i}from"./chart-column-Bd-Z4r1s.js";
import{a,p as o,r as s}from"./x-CXWFwwzx.js";
import{t as c}from"./rotate-ccw-CKD5pTED.js";
import{t as l}from"./table-2-IlJK-Tnk.js";
import{C as u,b as d,c as f,d as p,i as m,l as h,o as g,p as _,s as v,u as y}from"./index-CI1XYnwk.js";

var k=u(d(),1),A=_(),j=new Intl.NumberFormat("id-ID");

var SAMPLE_DATA=[
  {id:1,tanggal_uji:"2025-02-14",lokasi_pasar:"Pasar Induk Banjarnegara",nama_pedagang:"Kios Pangan Berkah",komoditas:"Beras Medium",kecamatan:"Banjarnegara",parameter_uji:"Residu Pestisida & Pemutih",hasil_uji:"Memenuhi Syarat (Aman)",no_registrasi:"PSAT-PDUK 33.04-A.I.001-2024",status:"Terdaftar / Berizin",keterangan:"Lolos uji klorin & organofosfat"},
  {id:2,tanggal_uji:"2025-02-18",lokasi_pasar:"Pasar Sayur Karangkobar",nama_pedagang:"Kios Sayur Segar Dieng",komoditas:"Cabai Rawit Merah",kecamatan:"Karangkobar",parameter_uji:"Rapid Test Residu Pestisida",hasil_uji:"Memenuhi Syarat (Aman)",no_registrasi:"-",status:"Uji Petik Acak",keterangan:"Uji petik rutin berkala"},
  {id:3,tanggal_uji:"2025-02-20",lokasi_pasar:"Pasar Rakyat Mandiraja",nama_pedagang:"Pengepul Buah Subur",komoditas:"Salak Pondoh",kecamatan:"Mandiraja",parameter_uji:"Residu Pestisida & Logam",hasil_uji:"Memenuhi Syarat (Aman)",no_registrasi:"-",status:"Uji Petik Acak",keterangan:"Hasil rapid test kit negatif"},
  {id:4,tanggal_uji:"2025-02-22",lokasi_pasar:"Pasar Rakyat Klampok",nama_pedagang:"Kios Sayur Bu Siti",komoditas:"Tomat & Kubis",kecamatan:"Purwareja Klampok",parameter_uji:"Rapid Test Residu Pestisida",hasil_uji:"Dalam Pengujian",no_registrasi:"-",status:"Uji Petik Acak",keterangan:"Sampel dikirim ke laboratorium daerah"},
  {id:5,tanggal_uji:"2025-02-25",lokasi_pasar:"Pasar Batur",nama_pedagang:"Poktan Dieng Makmur",komoditas:"Kentang Granola Kemas",kecamatan:"Batur",parameter_uji:"Residu Kimia & Logam Berat",hasil_uji:"Memenuhi Syarat (Aman)",no_registrasi:"PSAT-PDUK 33.04-A.I.004-2025",status:"Terdaftar / Berizin",keterangan:"Sertifikasi mutu pangan segar terdaftar"}
];

var TONE_MAP={
  "Memenuhi Syarat (Aman)":"emerald",
  "Tidak Memenuhi Syarat":"red",
  "Dalam Pengujian":"amber"
};

var STATUS_TONE={
  "Terdaftar / Berizin":"blue",
  "Uji Petik Acak":"slate",
  "Pembinaan":"amber"
};

function PsatPdukPage(){
  let[data,setData]=(0,k.useState)(null);
  let[filterKec,setFilterKec]=(0,k.useState)("all");
  let[filterHasil,setFilterHasil]=(0,k.useState)("all");
  let[filterStatus,setFilterStatus]=(0,k.useState)("all");
  let[search,setSearch]=(0,k.useState)("");

  (0,k.useEffect)(()=>{
    let active=true;
    fetch("/sispertani-api/v1/psat-pduk")
      .then(r=>r.json())
      .then(res=>{
        if(active){
          if(res && Array.isArray(res.rows) && res.rows.length>0){
            setData(res.rows);
          } else {
            setData([]);
          }
        }
      })
      .catch(()=>{
        if(active) setData([]);
      });
    return ()=>{ active=false; };
  },[]);

  let isPlaceholder = !(data && data.length > 0);
  let rawList = isPlaceholder ? SAMPLE_DATA : data;

  let kecamatanList = (0,k.useMemo)(()=>[...new Set(rawList.map(e=>e.kecamatan).filter(Boolean))].sort(),[rawList]);

  let filtered = (0,k.useMemo)(()=>{
    let s = search.trim().toLowerCase();
    return rawList.filter(item=>{
      if(filterKec !== "all" && item.kecamatan !== filterKec) return false;
      if(filterHasil !== "all" && item.hasil_uji !== filterHasil) return false;
      if(filterStatus !== "all" && item.status !== filterStatus) return false;
      if(s){
        let match = [item.lokasi_pasar, item.nama_pedagang, item.komoditas, item.no_registrasi].some(t=>String(t||"").toLowerCase().includes(s));
        if(!match) return false;
      }
      return true;
    });
  },[rawList, filterKec, filterHasil, filterStatus, search]);

  if(data === null){
    return (0,A.jsx)(n,{children:(0,A.jsxs)("section",{className:"flex flex-col gap-6",children:[
      (0,A.jsx)(f,{icon:(0,A.jsx)(t,{className:"h-6 w-6"}),title:"Keamanan Pangan Segar (PSAT-PDUK)",subtitle:"Pengawasan uji petik acak pasar dan registrasi izin edar pangan segar asal tumbuhan Kabupaten Banjarnegara."}),
      (0,A.jsx)(v,{label:"Memuat data keamanan pangan..."})
    ]})});
  }

  let totalSampel = filtered.length;
  let totalAman = filtered.filter(e=>e.hasil_uji==="Memenuhi Syarat (Aman)").length;
  let totalIzin = filtered.filter(e=>e.status==="Terdaftar / Berizin").length;
  let totalUjiPetik = filtered.filter(e=>e.status==="Uji Petik Acak").length;

  return (0,A.jsx)(n,{children:(0,A.jsxs)("section",{className:"flex flex-col gap-6",children:[
    (0,A.jsx)(f,{
      icon:(0,A.jsx)(t,{className:"h-6 w-6"}),
      title:"Keamanan Pangan Segar (PSAT-PDUK)",
      subtitle:"Pengawasan keamanan pangan segar melalui uji petik acak pasar/pedagang dan registrasi izin edar pangan segar asal tumbuhan (OKKPD Banjarnegara).",
      actions:(0,A.jsxs)(A.Fragment,{children:[
        isPlaceholder ? (0,A.jsx)(m,{tone:"amber",children:"Pratinjau Uji Petik Acak"}) : (0,A.jsx)(m,{tone:"emerald",children:"Data Resmi OKKPD"}),
        (0,A.jsxs)(m,{tone:"blue",children:[totalSampel," entri"]})
      ]})
    }),

    isPlaceholder && (0,A.jsxs)("div",{className:"flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800",children:[
      (0,A.jsx)(r,{className:"mt-0.5 h-5 w-5 shrink-0"}),
      (0,A.jsxs)("div",{className:"text-sm leading-relaxed",children:[
        (0,A.jsx)("p",{className:"font-semibold",children:"Pratinjau struktur uji petik acak pasar & akreditasi PSAT-PDUK."}),
        (0,A.jsx)("p",{className:"text-xs mt-0.5",children:"Menampilkan contoh alur inspeksi acak pasar (rapid test kit residu pestisida) dan registrasi izin edar pedagang kecil. Data hasil uji resmi dinas akan otomatis menggantikan tabel ini begitu diinput ke sistem."})
      ]})
    ]}),

    (0,A.jsxs)(y,{children:[
      (0,A.jsx)(p,{label:"Kecamatan",children:(0,A.jsxs)("select",{value:filterKec,onChange:e=>setFilterKec(e.target.value),className:"w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800/20",children:[
        (0,A.jsx)("option",{value:"all",children:"Semua Kecamatan"}),
        kecamatanList.map(e=>(0,A.jsx)("option",{value:e,children:e},e))
      ]})}),
      (0,A.jsx)(p,{label:"Hasil Uji",children:(0,A.jsxs)("select",{value:filterHasil,onChange:e=>setFilterHasil(e.target.value),className:"w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800/20",children:[
        (0,A.jsx)("option",{value:"all",children:"Semua Hasil Uji"}),
        (0,A.jsx)("option",{value:"Memenuhi Syarat (Aman)",children:"Memenuhi Syarat (Aman)"}),
        (0,A.jsx)("option",{value:"Dalam Pengujian",children:"Dalam Pengujian"}),
        (0,A.jsx)("option",{value:"Tidak Memenuhi Syarat",children:"Tidak Memenuhi Syarat"})
      ]})}),
      (0,A.jsx)(p,{label:"Status Registrasi",children:(0,A.jsxs)("select",{value:filterStatus,onChange:e=>setFilterStatus(e.target.value),className:"w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800/20",children:[
        (0,A.jsx)("option",{value:"all",children:"Semua Status"}),
        (0,A.jsx)("option",{value:"Uji Petik Acak",children:"Uji Petik Acak"}),
        (0,A.jsx)("option",{value:"Terdaftar / Berizin",children:"Terdaftar / Berizin PSAT-PDUK"}),
        (0,A.jsx)("option",{value:"Pembinaan",children:"Pembinaan"})
      ]})}),
      (0,A.jsxs)("button",{type:"button",onClick:()=>{setFilterKec("all");setFilterHasil("all");setFilterStatus("all");setSearch("");},className:"h-[38px] inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50",children:[
        (0,A.jsx)(c,{className:"mr-1.5 h-4 w-4"}),"Reset"
      ]})
    ]}),

    (0,A.jsxs)("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4",children:[
      (0,A.jsx)(g,{icon:(0,A.jsx)(s,{className:"h-5 w-5"}),label:"Sampel Diperiksa",value:j.format(totalSampel),unit:"sampel",color:"bg-blue-300",hint:"pengawasan acak di pasar/pedagang"}),
      (0,A.jsx)(g,{icon:(0,A.jsx)(a,{className:"h-5 w-5"}),label:"Memenuhi Syarat",value:j.format(totalAman),unit:"sampel",color:"bg-emerald-300",hint:"aman dari residu berbahaya"}),
      (0,A.jsx)(g,{icon:(0,A.jsx)(o,{className:"h-5 w-5"}),label:"Uji Petik Pasar",value:j.format(totalUjiPetik),unit:"titik",color:"bg-amber-300",hint:"inspeksi acak berkala"}),
      (0,A.jsx)(g,{icon:(0,A.jsx)(e,{className:"h-5 w-5"}),label:"Izin PSAT-PDUK",value:j.format(totalIzin),unit:"usaha",color:"bg-cyan-300",hint:"kemasan usaha kecil terdaftar"})
    ]}),

    (0,A.jsxs)(h,{
      title:"Daftar Hasil Uji Petik Pasar & Registrasi PSAT-PDUK",
      icon:(0,A.jsx)(l,{className:"h-4 w-4 text-blue-800"}),
      actions:(0,A.jsxs)(A.Fragment,{children:[
        (0,A.jsx)("input",{value:search,onChange:e=>setSearch(e.target.value),placeholder:"Cari pasar, pedagang, komoditas, no izin...",className:"w-64 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800/20"}),
        (0,A.jsxs)(m,{tone:"slate",children:[filtered.length," entri"]})
      ]}),
      bodyClassName:"p-0",
      children:[(0,A.jsx)("div",{className:"overflow-x-auto",children:(0,A.jsxs)("table",{className:"w-full text-sm",children:[
        (0,A.jsx)("thead",{className:"bg-slate-50",children:(0,A.jsxs)("tr",{children:[
          (0,A.jsx)("th",{className:"px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"No."}),
          (0,A.jsx)("th",{className:"px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"Tanggal Uji"}),
          (0,A.jsx)("th",{className:"px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"Lokasi Pasar"}),
          (0,A.jsx)("th",{className:"px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"Pedagang / Usaha"}),
          (0,A.jsx)("th",{className:"px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"Komoditas"}),
          (0,A.jsx)("th",{className:"px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"Kecamatan"}),
          (0,A.jsx)("th",{className:"px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"Parameter Uji"}),
          (0,A.jsx)("th",{className:"px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"Hasil Uji"}),
          (0,A.jsx)("th",{className:"px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"Status Registrasi"}),
          (0,A.jsx)("th",{className:"px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"No. Izin / Registrasi"})
        ]})}),
        (0,A.jsxs)("tbody",{children:[
          filtered.map((e,t)=>(0,A.jsxs)("tr",{className:"hover:bg-slate-50",children:[
            (0,A.jsx)("td",{className:"px-4 py-2.5 border-b border-slate-100 text-slate-500",children:t+1}),
            (0,A.jsx)("td",{className:"px-4 py-2.5 border-b border-slate-100 text-slate-700 whitespace-nowrap",children:e.tanggal_uji||"-"}),
            (0,A.jsx)("td",{className:"px-4 py-2.5 border-b border-slate-100 font-medium text-slate-800",children:e.lokasi_pasar}),
            (0,A.jsx)("td",{className:"px-4 py-2.5 border-b border-slate-100 text-slate-700",children:e.nama_pedagang}),
            (0,A.jsx)("td",{className:"px-4 py-2.5 border-b border-slate-100 font-semibold text-slate-800",children:e.komoditas}),
            (0,A.jsx)("td",{className:"px-4 py-2.5 border-b border-slate-100 text-slate-700",children:e.kecamatan}),
            (0,A.jsx)("td",{className:"px-4 py-2.5 border-b border-slate-100 text-xs text-slate-600",children:e.parameter_uji}),
            (0,A.jsx)("td",{className:"px-4 py-2.5 border-b border-slate-100",children:(0,A.jsx)(m,{tone:TONE_MAP[e.hasil_uji]||"slate",children:e.hasil_uji})}),
            (0,A.jsx)("td",{className:"px-4 py-2.5 border-b border-slate-100",children:(0,A.jsx)(m,{tone:STATUS_TONE[e.status]||"slate",children:e.status})}),
            (0,A.jsx)("td",{className:"px-4 py-2.5 border-b border-slate-100 text-xs font-mono text-slate-600",children:e.no_registrasi||"-"})
          ]},e.id||t)),
          filtered.length===0 && (0,A.jsx)("tr",{children:(0,A.jsx)("td",{colSpan:10,className:"px-4 py-8 text-center text-sm text-slate-400",children:"Tidak ada data uji petik / registrasi yang cocok dengan filter."})})
        ]})
      ]})}),
      (0,A.jsxs)("div",{className:"border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-500",children:[
        "Sumber: Otoritas Kompeten Keamanan Pangan Daerah (OKKPD) Dinas Pertanian dan Ketahanan Pangan Kabupaten Banjarnegara. Pengawasan dilakukan secara berkala dan acak pada pasar tradisional dan pedagang eceran.",
        isPlaceholder && (0,A.jsxs)("span",{className:"font-semibold text-amber-700",children:[" ","Menampilkan data pratinjau alur pengawasan."]})
      ]})
    ]})
  ]})});
}

export {PsatPdukPage as default};
