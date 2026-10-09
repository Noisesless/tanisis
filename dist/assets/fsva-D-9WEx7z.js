import{t as e,u as t}from"./default-CAKe9ffW.js";
import{t as n}from"./arrow-up-right-BGgoYqpN.js";
import{o as r}from"./x-CXWFwwzx.js";
import{t as i}from"./map-pinned-B8IASXIi.js";
import{C as a,_ as o,b as s,m as c,p as l,s as u}from"./index-CI1XYnwk.js";
import{n as d}from"./desa-BL4wG73W.js";
import{a as f,c as p,i as m,n as h,r as g,s as _,t as v}from"./esm-C6CgEwSP.js";
import{a as y,c as b,i as x,n as S,o as C,r as w,s as T,t as E}from"./fsva-B7L8e1cB.js";
var D=a(s(),1),O=l(),k=`#e2e8f0`,A=`#cbd5e1`,j=`https://tiles.openfreemap.org/styles/liberty`,M=!1;
function N(e){if(M)return;M=!0;let t=new v;e.addProtocol(`pmtiles`,t.tile)}
function P({desaIndex:e,rows:t,indikator:n,colorOf:r,judul:a,berdata:s,total:c}){
  let l=(0,D.useRef)(null),u=(0,D.useRef)(null),d=o();
  (0,D.useEffect)(()=>{
    if(!l.current||u.current||!e.length)return;
    N(p),g(`/maplibre-gl-worker.mjs`);
    let i=new Map(t.map(e=>[e.objectId,e])),a=e=>Number(e[n.key]||0),
        o={type:`FeatureCollection`,features:e.map((e,t)=>{
          let o=i.get(e.objectId)??null,s=!!o,c=s?a(o):0,l=s?r(c):k,u=s?r(c):A,d=F(e.geometry?.geometry);
          return d?{type:`Feature`,geometry:d,properties:{
            OBJECTID:t+1,nama:e.namaTampil,kecamatan:e.kecamatanTampil,routeKec:e.kecamatanSlug,routeNama:e.namaSlug,
            nilai:s?c:0,nilaiText:s?n.format(c):`·`,ada:+!!s,warna:l,warnaLine:u,
            lahan:s?o.luasLahanHa:null,miskin:s?o.miskinJiwa:null,sarpras:s?o.sarprasUnit:null
          }}:null
        }).filter(e=>e!==null)},
        s=new h({container:l.current,style:j,center:[109.6,-7.35],zoom:10,attributionControl:!1,cooperativeGestures:!0,scrollZoom:!0,boxZoom:!1,doubleClickZoom:!0,pitchWithRotate:!1,dragRotate:!1,touchZoomRotate:!0,dragPan:!0});
    u.current=s;
    s.addControl(new f({customAttribution:`© <a href="https://openfreemap.org">OpenFreeMap</a> · © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`}));
    s.addControl(new m({showCompass:!1}),`top-right`);
    s.on(`load`,()=>{
      let e=`fsva-desa`;
      s.addSource(e,{type:`geojson`,data:o,promoteId:`OBJECTID`});
      s.addLayer({id:`${e}-fill`,type:`fill`,source:e,paint:{"fill-color":[`get`,`warna`],"fill-opacity":[`case`,[`boolean`,[`feature-state`,`hover`],!1],.95,.78]}});
      s.addLayer({id:`${e}-outline`,type:`line`,source:e,paint:{"line-color":[`case`,[`boolean`,[`feature-state`,`hover`],!1],`#f59e0b`,`#94a3b8`],"line-width":[`case`,[`boolean`,[`feature-state`,`hover`],!1],3,.8]}});
      let t=null,r=null;
      s.on(`mousemove`,`${e}-fill`,i=>{
        s.getCanvas().style.cursor=`pointer`;
        let a=i.features;if(!a||!a.length)return;
        let o=a[0].id;
        t!=null&&s.setFeatureState({source:e,id:t},{hover:!1});
        o!=null&&(s.setFeatureState({source:e,id:o},{hover:!0}),t=o);
        let c=a[0].properties??{},l=Number(c.ada??0)===1;
        let extra=c.lahan!=null?`<div class="mt-1.5 pt-1 border-t border-slate-200 text-[10px] text-slate-600 flex flex-col gap-0.5"><span>🌾 Lahan: <b>${c.lahan} Ha</b></span><span>👥 Miskin DTKS: <b>${Number(c.miskin).toLocaleString("id-ID")} Jiwa</b></span><span>🏪 Sarpras Pangan: <b>${c.sarpras} Unit</b></span></div>`:``;
        let u=`<div class="text-sm font-bold text-slate-900">${L(String(c.nama??``))}</div><div class="text-[11px] text-slate-500">${L(String(c.kecamatan??``))}</div>`+(l?`<div class="text-xs font-semibold text-slate-800 mt-1">${L(n.label)}: ${L(String(c.nilaiText??``))}${L(n.unit)}</div>`:`<div class="text-xs text-slate-500 italic mt-1">Data belum tercatat</div>`)+extra;
        r?r.setLngLat(i.lngLat).setHTML(u):r=new _({closeButton:!1,closeOnClick:!1,offset:14}).setLngLat(i.lngLat).setHTML(u).addTo(s);
      });
      s.on(`mouseleave`,`${e}-fill`,()=>{
        s.getCanvas().style.cursor=``;
        t!=null&&(s.setFeatureState({source:e,id:t},{hover:!1}),t=null);
        r&&=(r.remove(),null);
      });
      s.on(`click`,`${e}-fill`,e=>{
        let t=e.features;if(!t||!t.length)return;
        let n=t[0].properties??{},r=String(n.routeKec??``),i=String(n.routeNama??``);
        r&&i&&d(`/desa/${r}/${i}`);
      });
      let i=I(o);
      i&&s.fitBounds(i,{padding:24,duration:0,animate:!1,maxZoom:12});
    });
    return()=>{u.current&&=(u.current.remove(),null)}
  },[]);
  return(0,O.jsxs)(`div`,{className:`rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white`,children:[
    (0,O.jsxs)(`div`,{className:`flex items-center gap-2 px-3 py-1.5 border-b border-slate-200 bg-gradient-to-r from-teal-50 to-white`,children:[
      (0,O.jsx)(i,{className:`w-3.5 h-3.5 text-teal-700`,"aria-hidden":!0}),
      (0,O.jsxs)(`span`,{className:`text-xs font-semibold text-slate-700`,children:[a,` — Peta Kabupaten Banjarnegara`]}),
      (0,O.jsxs)(`span`,{"aria-hidden":!0,className:`ml-auto inline-flex items-center gap-1 rounded-full bg-white ring-1 ring-slate-200 px-1.5 py-0.5 text-[10px] text-slate-500`,children:[
        (0,O.jsx)(`span`,{className:`inline-block w-2.5 h-0.5 bg-teal-600 rounded`}),s,`/`,c,` desa berdata`
      ]})
    ]}),
    (0,O.jsx)(`div`,{ref:l,style:{height:520,width:`100%`}})
  ]});
}
function F(e){if(!e)return null;if(e.type!==`GeometryCollection`)return e;let t=[],n=e=>{if(e.type===`GeometryCollection`)for(let t of e.geometries)n(t);else e.type===`Polygon`?t.push(e.coordinates):e.type===`MultiPolygon`&&t.push(...e.coordinates)};return n(e),t.length===0?null:t.length===1?{type:`Polygon`,coordinates:t[0]}:{type:`MultiPolygon`,coordinates:t}}
function I(e){let t=1/0,n=1/0,r=-1/0,i=-1/0,a=e=>{if(Array.isArray(e)){if(typeof e[0]==`number`&&typeof e[1]==`number`){let a=e[0],o=e[1];a<t&&(t=a),o<n&&(n=o),a>r&&(r=a),o>i&&(i=o);return}for(let t of e)a(t)}},o=e=>{if(e.type===`GeometryCollection`){for(let t of e.geometries)o(t);return}a(e.coordinates)};for(let t of e.features){let e=t.geometry;e&&o(e)}return!isFinite(t)||!isFinite(r)?null:[[t,n],[r,i]]}
function L(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}
function R(e,t){let n=[...e].sort((e,t)=>e-t),r=n.length;if(r===0)return[];let i=[];for(let e=1;e<t;e++){let a=e/t*(r-1),o=Math.floor(a),s=Math.ceil(a),c=a-o;i.push(n[o]*(1-c)+n[s]*c)}return i}
function z(e,t){
  if(e.categorical){
    if(e.key===`komposit`)return{colorOf:e=>w[Math.round(e)]??`#cbd5e1`,legend:[...new Set(t.map(e=>e.komposit))].sort((e,t)=>e-t).map(e=>({color:w[e]??`#cbd5e1`,label:`${e} — ${T(e)}`}))};
    let n=t.filter(e=>Number(e.tanpaAkses)===0).length;
    return{colorOf:e=>Number(e)===1?`#d73027`:`#1a9850`,legend:[{color:`#1a9850`,label:`Ada akses (${n} desa)`},{color:`#d73027`,label:`Tanpa akses (${t.length-n} desa)`}]}
  }
  let n=R(t.map(t=>Number(t[e.key]||0)),5),r=e.higherIsBetter?x:y,i=e.format,
      a=[{color:r[0],label:`≤ ${i(n[0])}`},{color:r[1],label:`${i(n[0])} – ${i(n[1])}`},{color:r[2],label:`${i(n[1])} – ${i(n[2])}`},{color:r[3],label:`${i(n[2])} – ${i(n[3])}`},{color:r[4],label:`> ${i(n[3])}`}];
  return{colorOf:b(n,r),legend:a}
}
function B(){
  let[n,i]=(0,D.useState)([]),[a,o]=(0,D.useState)(!0),[s,c]=(0,D.useState)(2024),[l,f]=(0,D.useState)(`ikp`),[dynRows,setDynRows]=(0,D.useState)(null);
  (0,D.useEffect)(()=>{(async()=>{try{i(await d())}catch(e){console.error(`Gagal memuat peta desa:`,e)}finally{o(!1)}})()},[]);
  (0,D.useEffect)(()=>{
    fetch(`/api/v1/ketahanan/fsva-desa?tahun=${s}`).then(r=>r.json()).then(j=>{
      if(j&&j.status===`success`&&Array.isArray(j.rows)&&j.rows.length){setDynRows(j.rows)}
    }).catch(()=>{});
  },[s]);
  let p=(0,D.useMemo)(()=>dynRows||E[s]||[],[dynRows,s]),
      m=(0,D.useMemo)(()=>S.find(e=>e.key===l)??S[0],[l]),
      h=(0,D.useMemo)(()=>z(m,p),[m,p]),
      g=(0,D.useMemo)(()=>{let e=new Map;for(let t of n)e.set(t.objectId,t);return e},[n]),
      _=(0,D.useMemo)(()=>{
        let e=[...p].sort((e,t)=>{
          let n=Number(e[m.key]||0),r=Number(t[m.key]||0);
          return m.higherIsBetter?r-n:n-r
        });
        return{best:e.slice(0,10),worst:[...e].reverse().slice(0,10)}
      },[p,m]),
      v=(0,D.useMemo)(()=>p.length?p.reduce((e,t)=>e+Number(t[m.key]||0),0)/p.length:0,[p,m]);
  return a?(0,O.jsx)(e,{children:(0,O.jsx)(`div`,{className:`py-16 flex justify-center`,children:(0,O.jsx)(u,{label:`Memuat peta ketahanan pangan...`})})}):
  (0,O.jsx)(e,{children:(0,O.jsxs)(`section`,{className:`flex flex-col gap-6 py-2`,children:[
    (0,O.jsxs)("header",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-2",children:[
      (0,O.jsxs)("div",{className:"flex-1 min-w-0",children:[
        (0,O.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight",children:"Ketahanan Pangan (FSVA Desa)"}),
        (0,O.jsx)("p",{className:"mt-1.5 max-w-3xl text-xs sm:text-sm font-medium text-slate-500 leading-relaxed",children:"Atlas Kerentanan & Ketahanan Pangan Desa Kabupaten Banjarnegara — Standar Badan Pangan Nasional. Terintegrasi langsung dengan database pertasis (16 variabel data fisik riil dan indikator rasio)."})
      ]})
    ]}),
    (0,O.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[
      (0,O.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[
        (0,O.jsx)(`span`,{className:`text-xs font-semibold text-slate-600`,children:`Tahun Data:`}),
        (0,O.jsx)(`div`,{className:`flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5`,children:C.map(e=>(0,O.jsx)(`button`,{type:`button`,onClick:()=>c(e),"aria-pressed":s===e,className:`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${s===e?`bg-white text-teal-700 shadow-sm`:`text-slate-500 hover:text-slate-700`}`,children:e},e))})
      ]}),
      (0,O.jsx)(`div`,{className:`flex flex-wrap gap-1.5`,children:S.map(e=>(0,O.jsx)(`button`,{type:`button`,onClick:()=>f(e.key),"aria-pressed":l===e.key,title:e.label,className:`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors ${l===e.key?`bg-teal-600 text-white ring-teal-600`:`bg-white text-slate-600 ring-slate-200 hover:bg-slate-50`}`,children:e.short},e.key))})
    ]}),
    (0,O.jsxs)(`div`,{className:`grid grid-cols-2 gap-3 lg:grid-cols-4`,children:[
      (0,O.jsx)(V,{label:`Rata-rata ${m.short}`,value:`${m.format(v)}${m.unit}`}),
      (0,O.jsx)(V,{label:`Desa Terpetakan`,value:`${p.length}`}),
      (0,O.jsx)(V,{label:`Tertinggi / Terbaik`,value:_.best[0]?_.best[0].desa:`—`,detail:_.best[0]?`${m.format(_.best[0][m.key])}${m.unit}`:void 0}),
      (0,O.jsx)(V,{label:`Terendah`,value:_.worst[0]?_.worst[0].desa:`—`,detail:_.worst[0]?`${m.format(_.worst[0][m.key])}${m.unit}`:void 0})
    ]}),
    (0,O.jsxs)(`div`,{className:`grid grid-cols-1 gap-4 lg:grid-cols-[1fr_240px]`,children:[
      (0,O.jsx)(P,{desaIndex:n,rows:p,indikator:m,colorOf:h.colorOf,judul:`${m.label} · ${s}`,berdata:p.length,total:n.length},`${s}-${l}`),
      (0,O.jsx)(H,{indicator:m,legend:h.legend,higherIsBetter:m.higherIsBetter,categorical:m.categorical})
    ]}),
    (0,O.jsx)(U,{judul:`10 Desa ${m.higherIsBetter?`Terbaik`:`Terendah`}`,subtitle:`Peringkat berdasarkan ${m.label.toLowerCase()} tahun ${s}.`,rows:_.best,indikator:m,desaByOid:g}),
    (0,O.jsxs)(`p`,{className:`flex items-start gap-1.5 text-[11px] text-slate-400`,children:[
      (0,O.jsx)(t,{className:`mt-0.5 h-3.5 w-3.5 shrink-0`,"aria-hidden":!0}),
      `Data bersumber dari hasil validasi Food Security and Vulnerability Atlas (FSVA-Desa) Badan Pangan Nasional bersama Dinas Pertanian, Perikanan dan Ketahanan Pangan Kab. Banjarnegara. Indikator negatif (miskin, tanpa air bersih) dibalik arah pewarnaannya: nilai tinggi ditampilkan merah (makin rawan).`
    ]})
  ]})})
}
function V({label:e,value:t,detail:n}){return(0,O.jsxs)(`div`,{className:`rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200 shadow-sm`,children:[(0,O.jsx)(`div`,{className:`text-[10px] uppercase tracking-wider text-slate-500`,children:e}),(0,O.jsx)(`div`,{className:`mt-0.5 truncate text-base font-bold text-slate-800`,children:t}),n?(0,O.jsx)(`div`,{className:`text-[11px] text-slate-500`,children:n}):null]})}
function H({indicator:e,legend:t,higherIsBetter:n,categorical:r}){return(0,O.jsxs)(`aside`,{className:`rounded-lg border border-slate-200 bg-white p-4 shadow-sm`,children:[(0,O.jsx)(`div`,{className:`mb-1 text-xs font-bold text-slate-800`,children:e.label}),(0,O.jsx)(`div`,{className:`mb-3 text-[10px] text-slate-500`,children:r?`Pembagian kategori.`:`Sebaran 278 desa dibagi 5 kelas kuantil${n?``:` (dibalik karena indikator negatif)`}.`}),(0,O.jsx)(`ul`,{className:`space-y-1.5`,children:t.map(e=>(0,O.jsxs)(`li`,{className:`flex items-center gap-2 text-[11px] text-slate-600`,children:[(0,O.jsx)(`span`,{className:`inline-block h-3 w-3 shrink-0 rounded`,style:{backgroundColor:e.color}}),e.label]},e.label))})]})}
function U({judul:e,subtitle:t,rows:r,indikator:i,desaByOid:a}){
  return(0,O.jsxs)(`div`,{className:`rounded-lg border border-slate-200 bg-white p-4 shadow-sm`,children:[
    (0,O.jsxs)(`div`,{className:`mb-2 flex items-center gap-2`,children:[
      (0,O.jsx)(`h3`,{className:`text-sm font-bold text-slate-800`,children:e}),
      (0,O.jsx)(`span`,{className:`text-[10px] text-slate-400`,children:t})
    ]}),
    (0,O.jsx)(`div`,{className:`overflow-x-auto`,children:(0,O.jsxs)(`table`,{className:`w-full text-xs`,children:[
      (0,O.jsx)(`thead`,{children:(0,O.jsxs)(`tr`,{className:`border-b border-slate-200 text-left text-[10px] uppercase tracking-wider text-slate-500`,children:[
        (0,O.jsx)(`th`,{className:`py-1.5 pr-2 font-semibold`,children:`#`}),
        (0,O.jsx)(`th`,{className:`py-1.5 pr-2 font-semibold`,children:`Desa`}),
        (0,O.jsx)(`th`,{className:`py-1.5 pr-2 font-semibold`,children:`Kecamatan`}),
        (0,O.jsx)(`th`,{className:`py-1.5 text-right font-semibold`,children:i.short}),
        (0,O.jsx)(`th`,{className:`py-1.5 text-right font-semibold`,children:`Lahan (Ha)`}),
        (0,O.jsx)(`th`,{className:`py-1.5 text-right font-semibold`,children:`Miskin DTKS`}),
        (0,O.jsx)(`th`,{className:`py-1.5 text-right font-semibold`,children:`Sarpras`}),
        (0,O.jsx)(`th`,{className:`py-1.5 pl-2`})
      ]})}),
      (0,O.jsx)(`tbody`,{children:r.map((e,t)=>{
        let r=a.get(e.objectId);
        return(0,O.jsxs)(`tr`,{className:`border-b border-slate-100 last:border-0 hover:bg-slate-50/50`,children:[
          (0,O.jsx)(`td`,{className:`py-1.5 pr-2 tabular-nums text-slate-400`,children:t+1}),
          (0,O.jsx)(`td`,{className:`py-1.5 pr-2 font-semibold text-slate-700`,children:e.desa}),
          (0,O.jsx)(`td`,{className:`py-1.5 pr-2 text-slate-500`,children:e.kecamatan}),
          (0,O.jsxs)(`td`,{className:`py-1.5 text-right font-semibold tabular-nums text-slate-800`,children:[i.format(e[i.key]),i.unit]}),
          (0,O.jsx)(`td`,{className:`py-1.5 text-right tabular-nums text-slate-600`,children:e.luasLahanHa!=null?`${e.luasLahanHa} Ha`:`—`}),
          (0,O.jsx)(`td`,{className:`py-1.5 text-right tabular-nums text-slate-600`,children:e.miskinJiwa!=null?Number(e.miskinJiwa).toLocaleString("id-ID"):`—`}),
          (0,O.jsx)(`td`,{className:`py-1.5 text-right tabular-nums text-slate-600`,children:e.sarprasUnit!=null?Number(e.sarprasUnit).toLocaleString("id-ID"):`—`}),
          (0,O.jsx)(`td`,{className:`py-1.5 pl-2 text-right`,children:r?(0,O.jsx)(c,{to:`/desa/${r.kecamatanSlug}/${r.namaSlug}`,className:`inline-flex items-center gap-0.5 text-teal-600 hover:text-teal-700`,"aria-label":`Detail ${e.desa}`,children:(0,O.jsx)(n,{className:`h-3.5 w-3.5`})}):null})
        ]},e.objectId)
      })})
    ]})})
  ]});
}
export{B as default};