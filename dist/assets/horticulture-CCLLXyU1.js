import{SectorEconomicWidget as Wgt}from"./sektor-ringkasan-widget.js";import{c as e,i as t,m as n,t as r}from"./default-CAKe9ffW.js";import{a as i,i as a,o}from"./x-CXWFwwzx.js";import{t as s}from"./file-spreadsheet-R11Sgu_C.js";import{t as c}from"./funnel-DPwG6jvG.js";import{C as l,b as u,c as d,f,i as p,l as m,o as h,p as g,r as _,s as ee}from"./index-CI1XYnwk.js";import{B as te,Q as ne,U as re,Z as ie,c as ae,i as oe,o as se}from"./api-BxFGoia1.js";import{Z as v,d as y,f as b,g as x,in as S,t as ce,u as C}from"./BarChart-CCPNsfhB.js";import{t as w}from"./Legend-DA0d5fUM.js";import{n as T,t as le}from"./LineChart-BhctH1ao.js";var ue=_(`pizza`,[[`path`,{d:`m12 14-1 1`,key:`11onhr`}],[`path`,{d:`m13.75 18.25-1.25 1.42`,key:`1yisr3`}],[`path`,{d:`M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12`,key:`1qtqk6`}],[`path`,{d:`M18.8 9.3a1 1 0 0 0 2.1 7.7`,key:`fbbbr2`}],[`path`,{d:`M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z`,key:`1hyfdd`}]]),E=l(u(),1),D=g();const fetchHortiJson=async(e)=>{try{let t=await fetch(e);if(!t.ok)return[];let n=await t.json();return Array.isArray(n)?n:[]}catch(t){return console.error("Gagal memuat "+e+":",t),[]}};function O(){
let[l,u]=(0,E.useState)([]),
[g,_]=(0,E.useState)([]),
[O,fe]=(0,E.useState)([]),
[k,pe]=(0,E.useState)([]),
[me,he]=(0,E.useState)([]),
[ge,_e]=(0,E.useState)([]),
[ve,ye]=(0,E.useState)([]),
[bLuas,setBLuas]=(0,E.useState)([]),
[bProd,setBProd]=(0,E.useState)([]),
[hLuas,setHLuas]=(0,E.useState)([]),
[hProd,setHProd]=(0,E.useState)([]),
[A,be]=(0,E.useState)("sayuran"),
[j,M]=(0,E.useState)("luas"),
[N,xe]=(0,E.useState)("2024"),
[P,Se]=(0,E.useState)("Semua"),
[Ce,we]=(0,E.useState)(!0);

(0,E.useEffect)(()=>{
(async()=>{
try{
let[e,t,n,r,i,a,o,bl,bp,hl,hp]=await Promise.all([
ie(),ne(),ae(),oe(),re(),se(),te(),
fetchHortiJson("/api/v1/hortikultura/biofarmaka-luas"),
fetchHortiJson("/api/v1/hortikultura/biofarmaka-produksi"),
fetchHortiJson("/api/v1/hortikultura/tanaman-hias-luas"),
fetchHortiJson("/api/v1/hortikultura/tanaman-hias-produksi")
]);
u(e),_(t),fe(n),pe(r),he(i),_e(a),ye(o),setBLuas(bl),setBProd(bp),setHLuas(hl),setHProd(hp)
}catch(e){console.error("Gagal memuat data hortikultura:",e)}
finally{we(!1)}
})()
},[]);

let F=(0,E.useMemo)(()=>[
{key:"bawangMerah",label:"Bawang Merah"},
{key:"cabaiBesar",label:"Cabai Besar"},
{key:"kentang",label:"Kentang"},
{key:"kubis",label:"Kubis"},
{key:"petsai",label:"Petsai"},
{key:"tomat",label:"Tomat"},
{key:"bawangPutih",label:"Bawang Putih"},
{key:"cabaiRawit",label:"Cabai Rawit"}
],[]),
I=(0,E.useMemo)(()=>[
{key:"mangga",label:"Mangga"},
{key:"durian",label:"Durian"},
{key:"jerukBesar",label:"Jeruk Besar"},
{key:"pisang",label:"Pisang"},
{key:"pepaya",label:"Pepaya"},
{key:"salak",label:"Salak"},
{key:"jerukSiam",label:"Jeruk Siam"}
],[]),
BIO_CROPS=(0,E.useMemo)(()=>[
{key:"jahe",label:"Jahe"},
{key:"kunyit",label:"Kunyit"},
{key:"kencur",label:"Kencur"},
{key:"laos",label:"Laos"}
],[]),
HIAS_CROPS=(0,E.useMemo)(()=>[
{key:"aglaonema",label:"Aglaonema"},
{key:"soka",label:"Soka"},
{key:"krisan",label:"Krisan"},
{key:"mawar",label:"Mawar"}
],[]),
L=(0,E.useMemo)(()=>A==="sayuran"?F:A==="buah"?I:A==="biofarmaka"?BIO_CROPS:HIAS_CROPS,[A,F,I,BIO_CROPS,HIAS_CROPS]),
R=e=>e?e.toString().replace(/^\d+\.\s*/,"").replace(/\s+/g,"").toUpperCase():"UNKNOWN",
z=e=>e?e.toString().replace(/^\d+\.\s*/,"").trim().toLowerCase().split(/\s+/).map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" "):"Unknown",

Te=(0,E.useMemo)(()=>{
let e=new Map;
return l.forEach(t=>{
let n=R(t.kecamatan),r=n+"_"+t.tahun;
e.set(r,{
kecNameRaw:t.kecamatan,
kecamatan:n,
tahun:t.tahun,
luas:{bawangMerah:t.bawangMerah,cabaiBesar:t.cabaiBesar,kentang:t.kentang,kubis:t.kubis,petsai:t.petsai,tomat:t.tomat,bawangPutih:t.bawangPutih,cabaiRawit:t.cabaiRawit},
produksi:{bawangMerah:0,cabaiBesar:0,kentang:0,kubis:0,petsai:0,tomat:0,bawangPutih:0,cabaiRawit:0}
})
}),
g.forEach(t=>{
let n=R(t.kecamatan)+"_"+t.tahun;
if(e.has(n)){
let r=e.get(n);
F.forEach(e=>{r.produksi[e.key]=t[e.key]||0})
}
}),
Array.from(e.values())
},[l,g,F]),

Ee=(0,E.useMemo)(()=>O.map(e=>{
let t=R(e.kecamatan),n={};
return I.forEach(t=>{n[t.key]=e[t.key]||0}),
{kecNameRaw:e.kecamatan,kecamatan:t,tahun:e.tahun,luas:{},produksi:n}
}),[O,I]),

BioMerged=(0,E.useMemo)(()=>{
let e=new Map;
return bLuas.forEach(t=>{
let n=R(t.kecamatan),r=n+"_"+t.tahun,luasObj={},prodObj={};
BIO_CROPS.forEach(c=>{luasObj[c.key]=t[c.key]||0,prodObj[c.key]=0});
e.set(r,{kecNameRaw:t.kecamatan,kecamatan:n,tahun:t.tahun,luas:luasObj,produksi:prodObj})
}),
bProd.forEach(t=>{
let n=R(t.kecamatan)+"_"+t.tahun;
if(e.has(n)){
let r=e.get(n);
BIO_CROPS.forEach(c=>{r.produksi[c.key]=t[c.key]||0})
}else{
let luasObj={},prodObj={};
BIO_CROPS.forEach(c=>{luasObj[c.key]=0,prodObj[c.key]=t[c.key]||0});
e.set(n,{kecNameRaw:t.kecamatan,kecamatan:R(t.kecamatan),tahun:t.tahun,luas:luasObj,produksi:prodObj})
}
}),
Array.from(e.values())
},[bLuas,bProd,BIO_CROPS]),

HiasMerged=(0,E.useMemo)(()=>{
let e=new Map;
return hLuas.forEach(t=>{
let n=R(t.kecamatan),r=n+"_"+t.tahun,luasObj={},prodObj={};
HIAS_CROPS.forEach(c=>{luasObj[c.key]=t[c.key]||0,prodObj[c.key]=0});
e.set(r,{kecNameRaw:t.kecamatan,kecamatan:n,tahun:t.tahun,luas:luasObj,produksi:prodObj})
}),
hProd.forEach(t=>{
let n=R(t.kecamatan)+"_"+t.tahun;
if(e.has(n)){
let r=e.get(n);
HIAS_CROPS.forEach(c=>{r.produksi[c.key]=t[c.key]||0})
}else{
let luasObj={},prodObj={};
HIAS_CROPS.forEach(c=>{luasObj[c.key]=0,prodObj[c.key]=t[c.key]||0});
e.set(n,{kecNameRaw:t.kecamatan,kecamatan:R(t.kecamatan),tahun:t.tahun,luas:luasObj,produksi:prodObj})
}
}),
Array.from(e.values())
},[hLuas,hProd,HIAS_CROPS]),

V=(0,E.useMemo)(()=>A==="sayuran"?Te:A==="buah"?Ee:A==="biofarmaka"?BioMerged:HiasMerged,[A,Te,Ee,BioMerged,HiasMerged]),
B=(0,E.useMemo)(()=>Array.from(new Set(V.map(e=>e.tahun).filter(Boolean))).sort((e,t)=>t.localeCompare(e)),[V]);

(0,E.useEffect)(()=>{
B.length>0&&!B.includes(N)&&xe(B[0])
},[B,N]);

let De=(0,E.useMemo)(()=>V.filter(e=>e.tahun===N),[V,N]),
Oe=(0,E.useMemo)(()=>["Semua",...Array.from(new Set(V.map(e=>z(e.kecNameRaw)))).sort()],[V]),
H=(0,E.useMemo)(()=>P==="Semua"?De:De.filter(e=>R(e.kecNameRaw)===R(P)),[De,P]),

unitLuas=(0,E.useMemo)(()=>A==="sayuran"?"Ha":"m²",[A]),
unitProduksi=(0,E.useMemo)(()=>A==="sayuran"||A==="buah"?"Ton":A==="biofarmaka"?"Kg":"Tangkai",[A]),
unitProduktivitas=(0,E.useMemo)(()=>A==="sayuran"?"Ton/Ha":A==="biofarmaka"?"Kg/m²":"Tangkai/m²",[A]),
subSektorLabel=(0,E.useMemo)(()=>A==="sayuran"?"Sayuran":A==="buah"?"Buah":A==="biofarmaka"?"Biofarmaka":"Tanaman Hias",[A]),

U=(0,E.useMemo)(()=>A==="buah"?"produksi":j,[A,j]),
$=(0,E.useMemo)(()=>U==="luas"?"Luas Lahan ("+unitLuas+")":U==="produksi"?"Volume Produksi ("+unitProduksi+")":"Produktivitas ("+unitProduktivitas+")",[U,unitLuas,unitProduksi,unitProduktivitas]),

W=(0,E.useMemo)(()=>{
let e=0,t=0,n=-1,r="-",i=L.map(e=>({key:e.key,name:e.label,luas:0,produksi:0}));
H.forEach(a=>{
let o=0,s=0;
L.forEach((e,t)=>{
let n=a.luas[e.key]||0,r=a.produksi[e.key]||0;
o+=n,s+=r,i[t].luas+=n,i[t].produksi+=r
}),e+=o,t+=s;
let c=U==="luas"?o:U==="produksi"?s:o>0?s/o:0;
c>n&&(n=c,r=z(a.kecNameRaw))
});
let a=i.map(e=>{
let t=U==="luas"?e.luas:U==="produksi"?e.produksi:e.luas>0?e.produksi/e.luas:0;
return{name:e.name,value:t,luas:e.luas,produksi:e.produksi}
}).sort((e,t)=>t.value-e.value);
return{total:U==="luas"?e:U==="produksi"?t:e>0?t/e:0,totalLuas:e,totalProduksi:t,topDistrict:r,topVal:n,breakdown:a}
},[H,U,L]),

G=(0,E.useMemo)(()=>{
let e=new Set;
return k.forEach(t=>{/^\d{4}$/.test(t.tahun)&&e.add(t.tahun)}),Array.from(e).sort((e,t)=>t.localeCompare(e))
},[k]),
[K,ke]=(0,E.useState)("");

(0,E.useEffect)(()=>{
G.length!==0&&(!K||!G.includes(K))&&ke(G[0])
},[G,K]);

let q=(0,E.useMemo)(()=>{
let e=K||G[0]||"2025",
t=k.filter(t=>t.tahun===e).sort((e,t)=>t.produksiTon-e.produksiTon),
n=t.reduce((e,t)=>e+t.produksiTon,0);
return{year:e,count:t.length,items:t.slice(0,10),total:n,top:t[0]}
},[k,K,G]),

Ae=(0,E.useMemo)(()=>H.map(e=>{
let t={name:z(e.kecNameRaw)},n=0,r=0,i=0;
return L.forEach(a=>{
let o=0;
if(U==="luas")o=e.luas[a.key]||0;
else if(U==="produksi")o=e.produksi[a.key]||0;
else{let t=e.luas[a.key]||0,n=e.produksi[a.key]||0;o=t>0?n/t:0}
t[a.label]=o,n+=o,r+=e.luas[a.key]||0,i+=e.produksi[a.key]||0
}),t.total=U==="produktivitas"?r>0?i/r:0:n,t
}).filter(e=>P!=="Semua"||e.total>0).sort((e,t)=>t.total-e.total),[H,U,L,P]),

je=(0,E.useMemo)(()=>{
let e=L.map(e=>{
let t=H.reduce((t,n)=>t+(n.luas[e.key]||0),0),
n=H.reduce((t,n)=>t+(n.produksi[e.key]||0),0);
return{key:e.key,val:U==="luas"?t:U==="produksi"?n:t>0?n/t:0}
}),t=0,n=0;
return H.forEach(e=>L.forEach(r=>{t+=e.luas[r.key]||0,n+=e.produksi[r.key]||0})),
{perCrop:e,total:U==="luas"?t:U==="produksi"?n:t>0?n/t:0}
},[H,L,U]),

J=(0,E.useMemo)(()=>{
let e=P==="Semua"?V:V.filter(e=>R(e.kecNameRaw)===R(P)),t=new Map;
return e.forEach(e=>{
let n=e.tahun;
if(!n)return;
if(!t.has(n)){
let e={tahun:n,total:0,totalLuas:0,totalProduksi:0};
L.forEach(t=>e[t.label]=0),t.set(n,e)
}
let r=t.get(n);
L.forEach(t=>{
let n=e.luas[t.key]||0,i=e.produksi[t.key]||0;
r.totalLuas+=n,r.totalProduksi+=i,U==="luas"?r[t.label]+=n:U==="produksi"&&(r[t.label]+=i)
})
}),
Array.from(t.values()).map(t=>(U==="luas"?t.total=t.totalLuas:U==="produksi"?t.total=t.totalProduksi:(t.total=t.totalLuas>0?t.totalProduksi/t.totalLuas:0,L.forEach(n=>{let r=0,i=0;e.filter(e=>e.tahun===t.tahun).forEach(e=>{r+=e.luas[n.key]||0,i+=e.produksi[n.key]||0}),t[n.label]=r>0?i/r:0})),t)).sort((e,t)=>e.tahun.localeCompare(t.tahun))
},[V,P,U,L]),

Y=(0,E.useMemo)(()=>{
if(J.length<2)return null;
let e=J[J.length-1],t=parseInt(e.tahun),n=J.find(e=>(e.total||0)>0);
if(!n)return null;
let r=t-parseInt(n.tahun);
if(!r||r<=0)return null;
let i=(e,t,n)=>!e||e<=0||t<0||n<=0?null:((t/e)**(1/n)-1)*100,
a=L.map(n=>{
let r=J.find(e=>(e[n.label]||0)>0);
if(!r)return{name:n.label,cagr:null};
let a=t-parseInt(r.tahun);
return{name:n.label,cagr:i(r[n.label]||0,e[n.label]||0,a)}
});
return{periode:n.tahun+"–"+e.tahun,years:r,total:i(n.total||0,e.total||0,r),items:a}
},[J,L]),

Me=(0,E.useMemo)(()=>{
let e=[];
for(let t=1;t<J.length;t++){
let n=J[t-1],r=J[t];
if(!n.total||n.total<=0)continue;
let i=(r.total-n.total)/n.total*100;
if(i>-15)continue;
let a="-",o=0;
L.forEach(e=>{
let t=(n[e.label]||0)-(r[e.label]||0);
t>o&&(o=t,a=e.label)
}),e.push({tahun:r.tahun,prevTahun:n.tahun,pct:i,selisih:r.total-n.total,penyumbang:a})
}
return e
},[J,L]),

X=(0,E.useMemo)(()=>{
if(J.length<3)return null;
let e=J.map(e=>({x:parseInt(e.tahun),y:e.total})),
t=e.length,
n=e.reduce((e,t)=>e+t.x,0),
r=e.reduce((e,t)=>e+t.y,0),
i=e.reduce((e,t)=>e+t.x*t.y,0),
a=t*e.reduce((e,t)=>e+t.x*t.x,0)-n*n;
if(a===0)return null;
let o=(t*i-n*r)/a,s=(r-o*n)/t,c=r/t,
l=e.reduce((e,t)=>e+(t.y-c)**2,0),
u=e.reduce((e,t)=>e+(t.y-(o*t.x+s))**2,0),
d=l===0?0:1-u/l,
f=e[t-1].x+1,
p=Math.max(0,o*f+s),
m=e[t-1].y,
h=m>0?(p-m)/m*100:null;
return{nextYear:String(f),predicted:p,r2:d,slope:o,deltaPct:h,lastTahun:J[t-1].tahun}
},[J]),

Ne=(0,E.useMemo)(()=>{
let e=J.map(e=>({...e,proyeksi:void 0}));
return X&&e.length>0&&(e[e.length-1].proyeksi=e[e.length-1].total,e.push({tahun:X.nextYear,total:void 0,proyeksi:X.predicted})),e
},[J,X]),

Z=e=>new Intl.NumberFormat("id-ID",{maximumFractionDigits:U==="produktivitas"?2:0}).format(e||0),
Q=e=>new Intl.NumberFormat("id-ID",{minimumFractionDigits:1,maximumFractionDigits:1}).format(e||0);

return(0,D.jsx)(r,{children:(0,D.jsxs)("section",{className:"flex flex-col gap-8 py-2",children:[
(0,D.jsx)(d,{
icon:(0,D.jsx)(i,{className:"h-6 w-6"}),
title:"Produksi Sayuran, Buah & Flora Hias",
subtitle:"Pemantauan produksi dan lahan komoditas hortikultura (sayuran, buah, biofarmaka & tanaman hias) per kecamatan di Kabupaten Banjarnegara.",
actions:(0,D.jsxs)(p,{tone:"blue",children:["Tahun ",N]})
}),
(0,D.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm text-left",children:[
(0,D.jsxs)("div",{className:"flex flex-col gap-1.5",children:[
(0,D.jsx)("label",{className:"text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"Sub-Sektor"}),
(0,D.jsxs)("div",{className:"grid grid-cols-2 2xl:grid-cols-4 gap-1.5",children:[
(0,D.jsxs)("button",{onClick:()=>be("sayuran"),className:"py-1.5 px-2 border border-slate-200 rounded-md text-[11px] font-semibold uppercase flex items-center justify-center gap-1.5 transition-all truncate whitespace-nowrap "+(A==="sayuran"?"bg-blue-800 text-white shadow-sm":"bg-white text-slate-800 hover:bg-slate-100 shadow-sm"),children:[(0,D.jsx)(i,{size:14}),"Sayuran"]}),
(0,D.jsxs)("button",{onClick:()=>be("buah"),className:"py-1.5 px-2 border border-slate-200 rounded-md text-[11px] font-semibold uppercase flex items-center justify-center gap-1.5 transition-all truncate whitespace-nowrap "+(A==="buah"?"bg-blue-800 text-white shadow-sm":"bg-white text-slate-800 hover:bg-slate-100 shadow-sm"),children:[(0,D.jsx)(ue,{size:14}),"Buah"]}),
(0,D.jsxs)("button",{onClick:()=>be("biofarmaka"),className:"py-1.5 px-2 border border-slate-200 rounded-md text-[11px] font-semibold uppercase flex items-center justify-center gap-1.5 transition-all truncate whitespace-nowrap "+(A==="biofarmaka"?"bg-blue-800 text-white shadow-sm":"bg-white text-slate-800 hover:bg-slate-100 shadow-sm"),children:[(0,D.jsx)(i,{size:14}),"Biofarmaka"]}),
(0,D.jsxs)("button",{onClick:()=>be("tanaman_hias"),className:"py-1.5 px-2 border border-slate-200 rounded-md text-[11px] font-semibold uppercase flex items-center justify-center gap-1.5 transition-all truncate whitespace-nowrap "+(A==="tanaman_hias"?"bg-blue-800 text-white shadow-sm":"bg-white text-slate-800 hover:bg-slate-100 shadow-sm"),children:[(0,D.jsx)(ue,{size:14}),"Tanaman Hias"]})
]})
]}),
(0,D.jsxs)("div",{className:"flex flex-col gap-1.5",children:[
(0,D.jsx)("label",{className:"text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"Metrik Analisis"}),
A==="buah"?(0,D.jsxs)("div",{className:"py-2 px-3 border border-slate-200 bg-slate-50 text-slate-400 text-xs font-semibold uppercase flex items-center justify-center gap-1 rounded-md",children:[(0,D.jsx)(i,{size:14}),"Hanya Produksi (Ton)"]}):(0,D.jsxs)("div",{className:"grid grid-cols-3 gap-1.5",children:[
(0,D.jsx)("button",{onClick:()=>M("luas"),className:"py-1.5 px-1 border border-slate-200 rounded-md text-[10px] sm:text-[11px] font-semibold uppercase flex items-center justify-center gap-0.5 transition-all truncate whitespace-nowrap "+(j==="luas"?"bg-blue-800 text-white shadow-sm":"bg-white text-slate-800 hover:bg-slate-100 shadow-sm"),children:"Luas ("+unitLuas+")"}),
(0,D.jsx)("button",{onClick:()=>M("produksi"),className:"py-1.5 px-1 border border-slate-200 rounded-md text-[10px] sm:text-[11px] font-semibold uppercase flex items-center justify-center gap-0.5 transition-all truncate whitespace-nowrap "+(j==="produksi"?"bg-blue-800 text-white shadow-sm":"bg-white text-slate-800 hover:bg-slate-100 shadow-sm"),children:"Produksi"}),
(0,D.jsx)("button",{onClick:()=>M("produktivitas"),className:"py-1.5 px-1 border border-slate-200 rounded-md text-[10px] sm:text-[11px] font-semibold uppercase flex items-center justify-center gap-0.5 transition-all truncate whitespace-nowrap "+(j==="produktivitas"?"bg-blue-800 text-white shadow-sm":"bg-white text-slate-800 hover:bg-slate-100 shadow-sm"),children:A==="sayuran"?"T / Ha":"Hasil/m²"})
]})
]}),
(0,D.jsxs)("div",{className:"flex flex-col gap-1.5",children:[
(0,D.jsx)("label",{className:"text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"Tahun Data"}),
(0,D.jsxs)("div",{className:"relative",children:[
(0,D.jsx)(n,{className:"absolute left-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none"}),
(0,D.jsx)("select",{value:N,onChange:e=>xe(e.target.value),className:"w-full pl-9 pr-4 py-1.5 border border-slate-200 text-xs sm:text-sm font-medium bg-white focus:outline-none appearance-none cursor-pointer rounded-md",children:B.map(e=>(0,D.jsx)("option",{value:e,children:e},e))})
]})
]}),
(0,D.jsxs)("div",{className:"flex flex-col gap-1.5",children:[
(0,D.jsx)("label",{className:"text-[11px] font-semibold uppercase tracking-wider text-slate-500",children:"Pilih Kecamatan"}),
(0,D.jsxs)("div",{className:"relative",children:[
(0,D.jsx)(c,{className:"absolute left-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none"}),
(0,D.jsx)("select",{value:P,onChange:e=>Se(e.target.value),className:"w-full pl-9 pr-4 py-1.5 border border-slate-200 text-xs sm:text-sm font-medium bg-white focus:outline-none appearance-none cursor-pointer rounded-md",children:Oe.map(e=>(0,D.jsx)("option",{value:e,children:e},e))})
]})
]})
]}),

Ce?(0,D.jsx)(ee,{label:"Memuat data hortikultura"}):(0,D.jsxs)(D.Fragment,{children:[
(0,D.jsx)(Wgt,{sektor:"hortikultura",tahun:N}),

(0,D.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[
(0,D.jsx)(h,{
icon:A==="sayuran"&&U==="luas"?(0,D.jsx)(i,{size:20}):(0,D.jsx)(ue,{size:20}),
label:"Total "+$,
value:Z(W.total),
color:"bg-amber-300",
hint:A==="buah"?"Volume Produksi "+Z(W.totalProduksi)+" Ton":"Luas Panen "+Z(W.totalLuas)+" "+unitLuas+" · Produksi "+Z(W.totalProduksi)+" "+unitProduksi
}),
(0,D.jsx)(h,{
icon:(0,D.jsx)(e,{size:20}),
label:"Kecamatan Tertinggi",
value:W.topDistrict,
color:"bg-emerald-300",
hint:"Nilai "+Z(W.topVal)+" "+(A==="buah"?"Ton":U==="luas"?unitLuas:U==="produksi"?unitProduksi:unitProduktivitas)+" ("+N+")"
}),
(0,D.jsx)(m,{title:"Komposisi Komoditas",bodyClassName:"p-5 flex flex-col justify-center",children:(0,D.jsx)("div",{className:"flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1",children:W.breakdown.map((e,t)=>{
let n=U==="produktivitas"?W.breakdown[0].value>0?e.value/W.breakdown[0].value*100:0:W.total>0?e.value/W.total*100:0;
return(0,D.jsxs)("div",{className:"flex flex-col gap-0.5",children:[
(0,D.jsxs)("div",{className:"flex justify-between text-[11px] font-semibold text-slate-600",children:[
(0,D.jsx)("span",{className:"truncate max-w-[120px]",children:e.name}),
(0,D.jsxs)("span",{children:[Z(e.value)," ",A==="buah"?"Ton":U==="luas"?unitLuas:U==="produksi"?unitProduksi:unitProduktivitas," ",U!=="produktivitas"&&"("+n.toFixed(1)+"%)"]})
]}),
(0,D.jsx)("div",{className:"w-full bg-slate-200 h-1.5 rounded-full",children:(0,D.jsx)("div",{className:"h-full rounded-full",style:{width:n+"%",backgroundColor:["#059669","#2563eb","#7c3aed","#db2777","#ea580c","#d97706","#4b5563","#16a34a"][t%8]}})})
]},e.name)
})})})
]}),

(A==="sayuran"||A==="buah")&&(0,D.jsxs)(m,{title:"Produksi Buah & Sayuran Tahunan Kabupaten",icon:(0,D.jsx)(s,{size:16,className:"text-emerald-600"}),actions:(0,D.jsxs)(D.Fragment,{children:[
(0,D.jsx)(p,{tone:"amber",children:"Agregat kabupaten · tidak mengikuti filter"}),
(0,D.jsxs)("div",{className:"flex items-center gap-3",children:[
G.length>1&&(0,D.jsx)("select",{value:q.year,onChange:e=>ke(e.target.value),className:"rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none","aria-label":"Pilih tahun data tahunan",children:G.map(e=>(0,D.jsx)("option",{value:e,children:e},e))}),
(0,D.jsxs)("div",{className:"text-right",children:[
(0,D.jsxs)("p",{className:"text-[11px] font-semibold uppercase text-slate-500",children:["Total Produksi ",q.year]}),
(0,D.jsxs)("p",{className:"text-xl font-bold tabular-nums text-slate-800",children:[Z(q.total)," Ton"]})
]})
]})
]}),children:[
(0,D.jsx)("p",{className:"text-xs text-slate-500 mb-4",children:q.year==="2025"?"Data BPS 2025, dikonversi dari kuintal ke ton. Hanya tersedia agregat tingkat kabupaten, sehingga panel ini tidak berubah saat filter kecamatan atau tahun diganti.":"Sumber: \"Produksi Buah-buahan dan Sayuran Tahunan Menurut Jenis Tanaman\" (Distankan KP/BPS) — "+q.count+" jenis tanaman tahunan "+q.year+"."}),
(0,D.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[
(0,D.jsx)("div",{className:"lg:col-span-2 h-[320px]",children:(0,D.jsx)(S,{width:"100%",height:"100%",children:(0,D.jsxs)(ce,{data:q.items,layout:"vertical",margin:{top:5,right:20,left:40,bottom:5},children:[
(0,D.jsx)(x,{strokeDasharray:"3 3",stroke:"#64748b",strokeOpacity:.1,horizontal:!1}),
(0,D.jsx)(y,{type:"number",tickFormatter:e=>Z(e),tick:{fill:"#475569",fontSize:10}}),
(0,D.jsx)(C,{dataKey:"jenisTanaman",type:"category",width:110,tick:{fill:"#475569",fontSize:10}}),
(0,D.jsx)(v,{formatter:e=>[Z(Number(e||0))+" Ton","Produksi"],contentStyle:{backgroundColor:"#fff",border:"1px solid #cbd5e1",borderRadius:8,fontSize:"12px",boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1)"}}),
(0,D.jsx)(b,{dataKey:"produksiTon",fill:"#059669",stroke:"#cbd5e1",strokeWidth:1,radius:[0,4,4,0]})
]})})}),
(0,D.jsxs)("div",{className:"border border-slate-200 bg-emerald-50 rounded-lg p-4 flex flex-col gap-3",children:[
(0,D.jsxs)("div",{children:[
(0,D.jsx)("p",{className:"text-[11px] font-semibold uppercase text-slate-500",children:"Komoditas Dominan"}),
(0,D.jsx)("h5",{className:"text-2xl font-bold text-slate-800 leading-tight mt-1",children:q.top?.jenisTanaman||"-"}),
(0,D.jsxs)("p",{className:"text-sm font-semibold tabular-nums text-emerald-700 mt-2",children:[Z(q.top?.produksiTon||0)," Ton"]})
]}),
(0,D.jsx)("div",{className:"border-t border-slate-200 pt-3 flex flex-col gap-2 max-h-[210px] overflow-y-auto pr-1",children:q.items.slice(0,6).map((e,t)=>(0,D.jsxs)("div",{className:"flex items-center justify-between gap-3 text-xs font-semibold tabular-nums bg-white border border-slate-200 rounded-md px-2 py-1",children:[
(0,D.jsxs)("span",{className:"truncate",children:[t+1,". ",e.jenisTanaman]}),
(0,D.jsxs)("span",{className:"shrink-0",children:[Z(e.produksiTon)," Ton"]})
]},e.jenisTanaman))})
]})
]})
]}),

A==="sayuran"?(0,D.jsx)(de,{title:"Sayuran & Buah Semusim (Kabupaten)",subtitle:"Sumber: \"Luas Panen & Produksi Tanaman Sayuran dan Buah–Buahan Semusim Menurut Jenis Tanaman\" (Distankan KP/BPS) — agregat kabupaten. Satuan luas ha, produksi ton.",data:ve,accent:"#7c3aed",unitProduksi:"ton",unitLuas:"ha",selectedYear:N}):null,
A==="biofarmaka"?(0,D.jsx)(de,{title:"Tanaman Biofarmaka (Agregat Kabupaten)",subtitle:"Sumber: \"Luas Panen & Produksi Tanaman Biofarmaka Menurut Jenis Tanaman\" (Distankan KP/BPS) — data resmi Kabupaten Banjarnegara. Satuan luas m², produksi kg.",data:ge,accent:"#059669",unitProduksi:"kg",unitLuas:"m²",selectedYear:N}):null,
A==="tanaman_hias"?(0,D.jsx)(de,{title:"Tanaman Hias / Florikultura (Agregat Kabupaten)",subtitle:"Sumber: \"Luas Panen & Produksi Tanaman Hias Menurut Jenis Tanaman\" (Distankan KP/BPS) — data resmi Kabupaten Banjarnegara. Satuan luas m², produksi tangkai.",data:me,accent:"#2563eb",unitProduksi:"tangkai",unitLuas:"m²",selectedYear:N}):null,

(0,D.jsx)(m,{
title:"Tren Perkembangan "+$+" "+subSektorLabel+(P==="Semua"?"":" · "+P),
icon:(0,D.jsx)(a,{size:16,className:"text-emerald-600"}),
actions:U!=="produktivitas"&&Y?Y.total===null?(0,D.jsxs)(p,{tone:"slate",children:["CAGR N/A · ",Y.periode]}):(0,D.jsx)(f,{value:Y.total,label:"CAGR "+Y.periode}):void 0,
children:(0,D.jsx)("div",{className:"h-[320px] w-full",children:(0,D.jsx)(S,{width:"100%",height:"100%",children:(0,D.jsxs)(le,{data:Ne,margin:{top:10,right:20,left:0,bottom:0},children:[
(0,D.jsx)(x,{strokeDasharray:"3 3",stroke:"#64748b",strokeOpacity:.1,vertical:!1}),
(0,D.jsx)(y,{dataKey:"tahun",tick:{fill:"#475569",fontSize:11},axisLine:{stroke:"#cbd5e1",strokeWidth:1},tickLine:{stroke:"#cbd5e1"}}),
(0,D.jsx)(C,{tick:{fill:"#475569",fontSize:10},axisLine:{stroke:"#cbd5e1",strokeWidth:1},tickLine:{stroke:"#cbd5e1"},tickFormatter:e=>Z(e)}),
(0,D.jsx)(v,{contentStyle:{backgroundColor:"#ffffff",border:"1px solid #cbd5e1",borderRadius:"8px",fontSize:"12px",boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1)"},formatter:(e,t)=>[Z(Number(e)),String(t??"")]}),
(0,D.jsx)(w,{verticalAlign:"top",height:36,wrapperStyle:{fontSize:"10px"}}),
(0,D.jsx)(T,{type:"monotone",dataKey:"total",name:"Total "+(A==="buah"?"Ton":U==="luas"?unitLuas:U==="produksi"?unitProduksi:"Rata-Rata"),stroke:"#64748b",strokeWidth:3,dot:{fill:"#475569",r:4},activeDot:{r:6},connectNulls:!1}),
U!=="produktivitas"&&(0,D.jsx)(T,{type:"monotone",dataKey:"proyeksi",name:"Proyeksi",stroke:"#ef4444",strokeWidth:2,strokeDasharray:"6 4",dot:{fill:"#ef4444",r:4},connectNulls:!0}),
L.map((e,t)=>{
let n=["#059669","#2563eb","#7c3aed","#db2777","#ea580c","#d97706","#4b5563","#16a34a"];
return(0,D.jsx)(T,{type:"monotone",dataKey:e.label,stroke:n[t%n.length],strokeWidth:1.5,dot:!1},e.key)
})
]})})})
}),

U!=="produktivitas"&&X&&(0,D.jsxs)(m,{title:"Proyeksi Garis Tren Hortikultura ("+X.nextYear+")",icon:(0,D.jsx)(a,{size:16,className:"text-emerald-600"}),children:[
(0,D.jsx)("p",{className:"text-xs text-slate-500 mb-4",children:"Estimasi model regresi linier (least-squares) berdasarkan tren historis"}),
(0,D.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4 text-left",children:[
(0,D.jsxs)("div",{className:"border border-emerald-100 bg-emerald-50 rounded-lg p-4 flex flex-col justify-between",children:[
(0,D.jsxs)("span",{className:"text-[11px] font-semibold uppercase text-slate-500",children:["Prediksi ",X.nextYear," (",U==="luas"?unitLuas:unitProduksi,")"]}),
(0,D.jsx)("span",{className:"text-2xl font-bold tabular-nums text-slate-800 mt-2",children:Z(X.predicted)})
]}),
(0,D.jsxs)("div",{className:"border border-slate-200 bg-white rounded-lg p-4 flex flex-col justify-between",children:[
(0,D.jsxs)("span",{className:"text-[11px] font-semibold uppercase text-slate-500",children:["Perubahan vs ",X.lastTahun]}),
(0,D.jsx)("span",{className:"text-2xl font-bold tabular-nums mt-2 "+(X.deltaPct===null?"text-slate-400":X.deltaPct>=0?"text-emerald-600":"text-red-600"),children:X.deltaPct===null?"N/A":(X.deltaPct>=0?"▲":"▼")+" "+Q(Math.abs(X.deltaPct))+"%"})
]}),
(0,D.jsxs)("div",{className:"border border-slate-200 bg-white rounded-lg p-4 flex flex-col justify-between",children:[
(0,D.jsx)("span",{className:"text-[11px] font-semibold uppercase text-slate-500",children:"Keandalan Model (R²)"}),
(0,D.jsxs)("span",{className:"text-2xl font-bold tabular-nums mt-2 "+(X.r2>=.7?"text-emerald-600":X.r2>=.4?"text-amber-600":"text-red-600"),children:[Q(X.r2*100),"%"]})
]})
]})
]}),

U!=="produktivitas"&&(0,D.jsx)(m,{title:"Deteksi Anomali Hortikultura",icon:(0,D.jsx)(t,{size:16,className:"text-red-600"}),actions:(0,D.jsxs)(p,{tone:"red",children:["Penurunan > ",15,"% YoY"]}),children:Me.length===0?(0,D.jsxs)("div",{className:"flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-semibold text-emerald-800 text-left",children:[(0,D.jsx)(o,{size:14}),"Tidak ada anomali penurunan tajam terdeteksi pada komoditas hortikultura di wilayah ini."]}):(0,D.jsx)("div",{className:"flex flex-col gap-3",children:Me.map(e=>(0,D.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-left",children:[
(0,D.jsxs)("div",{className:"flex items-center gap-3",children:[
(0,D.jsx)("span",{className:"inline-flex items-center px-2 py-0.5 rounded-md bg-red-800 text-white text-xs font-bold tabular-nums",children:e.tahun}),
(0,D.jsxs)("div",{children:[
(0,D.jsxs)("p",{className:"text-xs font-semibold text-red-700",children:["Mengalami penurunan ",Q(Math.abs(e.pct)),"% dibandingkan ",e.prevTahun]}),
(0,D.jsxs)("p",{className:"text-[11px] text-slate-500",children:["Penyumbang penurunan terbesar: ",e.penyumbang," (Selisih: ",Z(e.selisih)," ",U==="luas"?unitLuas:unitProduksi,")"]})
]})
]}),
(0,D.jsxs)("span",{className:"text-xl font-bold tabular-nums text-red-600",children:["▼ ",Q(Math.abs(e.pct)),"%"]})
]},e.tahun))})}),

U!=="produktivitas"&&Y&&(0,D.jsxs)(m,{title:"Rata-rata Laju Pertumbuhan Komoditas (CAGR) "+Y.periode,children:[
(0,D.jsxs)("p",{className:"text-xs text-slate-500 mb-4",children:["Laju pertumbuhan majemuk per tahun per komoditas (",P==="Semua"?"Seluruh Banjarnegara":P,")"]}),
(0,D.jsxs)("div",{className:"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-left",children:[
(0,D.jsxs)("div",{className:"border border-slate-800 bg-slate-800 text-white rounded-lg p-4 flex flex-col justify-between",children:[
(0,D.jsx)("span",{className:"text-[11px] font-semibold uppercase text-slate-400",children:"Total Gabungan"}),
(0,D.jsx)("span",{className:"text-2xl font-bold tabular-nums mt-2",children:Y.total===null?"N/A":(Y.total>=0?"+":"")+Q(Y.total)+"%"})
]}),
Y.items.map(e=>(0,D.jsxs)("div",{className:"border border-slate-200 bg-white rounded-lg p-4 flex flex-col justify-between",children:[
(0,D.jsx)("span",{className:"text-[11px] font-semibold uppercase text-slate-500 leading-tight",children:e.name}),
(0,D.jsx)("span",{className:"text-2xl font-bold tabular-nums mt-2 "+(e.cagr===null?"text-slate-400":e.cagr>=0?"text-emerald-600":"text-red-600"),children:e.cagr===null?"N/A":(0,D.jsxs)(D.Fragment,{children:[e.cagr>=0?"▲":"▼"," ",Q(Math.abs(e.cagr)),"%"]})})
]},e.name))
]})
]}),

(0,D.jsxs)(m,{title:"Sebaran Nilai Komoditas per Kecamatan ("+N+")",icon:(0,D.jsx)(s,{size:16,className:"text-emerald-600"}),children:[
(0,D.jsxs)("p",{className:"text-xs text-slate-500 mb-4",children:["Kontribusi masing-masing kecamatan terhadap ",$," hortikultura"]}),
(0,D.jsx)("div",{className:"h-[420px] w-full",children:(0,D.jsx)(S,{width:"100%",height:"100%",children:(0,D.jsxs)(ce,{data:Ae,margin:{top:10,right:10,left:0,bottom:90},children:[
(0,D.jsx)(x,{strokeDasharray:"3 3",stroke:"#64748b",strokeOpacity:.1,vertical:!1}),
(0,D.jsx)(y,{dataKey:"name",tick:{fill:"#475569",fontSize:10},axisLine:{stroke:"#cbd5e1",strokeWidth:1},tickLine:{stroke:"#cbd5e1"},interval:0,angle:-45,textAnchor:"end",height:70}),
(0,D.jsx)(C,{width:70,tick:{fill:"#475569",fontSize:10},axisLine:{stroke:"#cbd5e1",strokeWidth:1},tickLine:{stroke:"#cbd5e1"}}),
(0,D.jsx)(v,{contentStyle:{backgroundColor:"#ffffff",border:"1px solid #cbd5e1",borderRadius:"8px",fontSize:"12px",boxShadow:"0 4px 6px -1px rgba(0,0,0,0.1)"},formatter:(e,t)=>[Z(Number(e||0))+" "+(A==="buah"?"Ton":U==="luas"?unitLuas:U==="produksi"?unitProduksi:unitProduktivitas),String(t??"")],labelFormatter:e=>"Kec. "+e}),
(0,D.jsx)(w,{verticalAlign:"top",height:36,wrapperStyle:{fontSize:"10px"}}),
L.map((e,t)=>{
let n=["#059669","#2563eb","#7c3aed","#db2777","#ea580c","#d97706","#4b5563","#16a34a"];
return(0,D.jsx)(b,{dataKey:e.label,stackId:U==="produktivitas"?void 0:"a",fill:n[t%n.length],stroke:"#64748b",strokeWidth:1},e.key)
})
]})})})
]}),

(0,D.jsxs)(m,{title:"Tabel Rincian Data Perkecamatan ("+N+")",children:[
(0,D.jsxs)("p",{className:"text-xs text-slate-500 mb-3",children:["Nilai yang ditampilkan adalah ",$]}),
(0,D.jsx)("div",{className:"overflow-x-auto",children:(0,D.jsxs)("table",{className:"w-full text-left text-sm border-collapse",children:[
(0,D.jsx)("thead",{children:(0,D.jsxs)("tr",{className:"border-b border-slate-200 bg-slate-50",children:[
(0,D.jsx)("th",{className:"px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500",children:"No"}),
(0,D.jsx)("th",{className:"px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500",children:"Kecamatan"}),
L.map(e=>(0,D.jsx)("th",{className:"px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500 truncate max-w-[100px]",children:e.label},e.key)),
(0,D.jsx)("th",{className:"px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500",children:"Total"})
]})}),
(0,D.jsx)("tbody",{children:Ae.length===0?(0,D.jsx)("tr",{children:(0,D.jsx)("td",{colSpan:L.length+3,className:"px-4 py-8 text-center text-xs text-slate-400",children:"Belum ada data hortikultura pada filter ini."})}):Ae.map((e,t)=>(0,D.jsxs)("tr",{className:"border-b border-slate-100 hover:bg-slate-50",children:[
(0,D.jsx)("td",{className:"px-3 py-2.5 text-xs font-semibold text-slate-500",children:t+1}),
(0,D.jsx)("td",{className:"px-3 py-2.5 text-xs font-semibold truncate max-w-[120px]",children:e.name}),
L.map(t=>(0,D.jsx)("td",{className:"px-3 py-2.5 text-xs text-right tabular-nums",children:Z(e[t.label]||0)},t.key)),
(0,D.jsx)("td",{className:"px-3 py-2.5 text-xs font-bold text-right bg-slate-50 tabular-nums",children:Z(e.total)})
]},e.name))}),
Ae.length>0&&(0,D.jsx)("tfoot",{children:(0,D.jsxs)("tr",{className:"border-t-2 border-slate-300 bg-slate-50 font-semibold",children:[
(0,D.jsx)("td",{colSpan:2,className:"px-3 py-2.5 text-xs text-slate-900",children:P==="Semua"?"Kabupaten Banjarnegara":"Kecamatan "+z(P)}),
je.perCrop.map(e=>(0,D.jsx)("td",{className:"px-3 py-2.5 text-xs text-right text-slate-900 tabular-nums",children:Z(e.val)},e.key)),
(0,D.jsx)("td",{className:"px-3 py-2.5 text-xs font-bold text-right text-slate-900 bg-slate-100 tabular-nums",children:Z(je.total)})
]})})
]})}),
(0,D.jsx)("p",{className:"text-[11px] text-slate-400 mt-3",children:U==="produktivitas"?"Baris footer = rata-rata tertimbang (Σ produksi ÷ Σ luas panen), bukan penjumlahan produktivitas.":"Baris footer = penjumlahan seluruh kecamatan yang tampil."})
]}),

(0,D.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-slate-50/60 p-4 flex items-start gap-3",children:[
(0,D.jsx)(s,{size:18,className:"text-emerald-600 shrink-0 mt-0.5"}),
(0,D.jsxs)("div",{className:"text-xs leading-relaxed text-slate-500",children:[
(0,D.jsx)("p",{className:"font-semibold text-slate-700 mb-1",children:"Sumber Data"}),
(0,D.jsx)("p",{children:"Dinas Ketahanan Pangan Kabupaten Banjarnegara — tabel Luas Panen & Produksi Sayuran, Buah-buahan, Biofarmaka (Tanaman Obat), dan Tanaman Hias Menurut Kecamatan dan Jenis Tanaman (Distankan KP/BPS). Nilai \"-\" pada sumber dibaca sebagai 0."})
]})
]})

]})
]})})}
function de({title:e,subtitle:t,data:n,accent:r,unitProduksi:i="tangkai",unitLuas:a="m²",selectedYear:sy}){let[o,c]=(0,E.useState)(sy||""),l=(0,E.useMemo)(()=>Array.from(new Set(n.map(e=>e.tahun))).sort((e,t)=>t.localeCompare(e)),[n]);(0,E.useEffect)(()=>{sy&&l.includes(sy)?c(sy):l.length>0&&!l.includes(o)&&c(l[0])},[l,o,sy]);let u=(0,E.useMemo)(()=>n.filter(e=>e.tahun===o).sort((e,t)=>t.produksi-e.produksi),[n,o]),d=u.reduce((e,t)=>e+t.produksi,0),f=u.reduce((e,t)=>e+t.luas,0),h=u[0],g=(0,E.useMemo)(()=>{let e=new Map;for(let t of n){let n=e.get(t.tahun)??{produksi:0,luas:0};n.produksi+=t.produksi,n.luas+=t.luas,e.set(t.tahun,n)}return[...e.entries()].map(([e,t])=>({tahun:e,produksi:t.produksi,luas:t.luas})).sort((e,t)=>e.tahun.localeCompare(t.tahun))},[n]),_=e=>new Intl.NumberFormat(`id-ID`,{maximumFractionDigits:0}).format(e||0);return n.length===0?(0,D.jsx)(m,{title:e,children:(0,D.jsx)(`p`,{className:`text-xs text-slate-500`,children:`Belum ada data tersedia.`})}):(0,D.jsxs)(m,{title:e,icon:(0,D.jsx)(s,{size:16,className:`text-emerald-600`}),actions:(0,D.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,D.jsx)(p,{tone:`amber`,children:`Agregat kabupaten · tidak mengikuti filter`}),l.length>1&&(0,D.jsx)(`select`,{value:o,onChange:e=>c(e.target.value),className:`rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none`,"aria-label":`Pilih tahun ${e}`,children:l.map(e=>(0,D.jsx)(`option`,{value:e,children:e},e))})]}),children:[(0,D.jsx)(`p`,{className:`text-xs text-slate-500 mb-4`,children:t}),(0,D.jsxs)(`div`,{className:`grid grid-cols-1 lg:grid-cols-3 gap-6`,children:[(0,D.jsx)(`div`,{className:`lg:col-span-2 h-[320px]`,children:(0,D.jsx)(S,{width:`100%`,height:`100%`,children:(0,D.jsxs)(ce,{data:u,layout:`vertical`,margin:{top:5,right:20,left:80,bottom:5},children:[(0,D.jsx)(x,{strokeDasharray:`3 3`,stroke:`#64748b`,strokeOpacity:.1,horizontal:!1}),(0,D.jsx)(y,{type:`number`,tickFormatter:e=>_(e),tick:{fill:`#475569`,fontSize:10}}),(0,D.jsx)(C,{dataKey:`jenisTanaman`,type:`category`,width:130,tick:{fill:`#475569`,fontSize:10}}),(0,D.jsx)(v,{contentStyle:{backgroundColor:`#fff`,border:`1px solid #cbd5e1`,borderRadius:8,fontSize:`12px`,boxShadow:`0 4px 6px -1px rgba(0,0,0,0.1)`},formatter:(e,t)=>String(t||``).toLowerCase().includes(`produksi`)?[`${_(Number(e))} ${i}`,`Produksi`]:[`${_(Number(e))} ${a}`,`Luas`]}),(0,D.jsx)(b,{dataKey:`produksi`,name:`Produksi`,fill:r,stroke:`#cbd5e1`,strokeWidth:1,radius:[0,4,4,0]})]})})}),(0,D.jsxs)(`div`,{className:`border border-slate-200 bg-emerald-50 rounded-lg p-4 flex flex-col gap-3`,children:[(0,D.jsxs)(`div`,{children:[(0,D.jsxs)(`p`,{className:`text-[11px] font-semibold uppercase text-slate-500`,children:[`Jenis Dominan `,o]}),(0,D.jsx)(`h5`,{className:`text-2xl font-bold text-slate-800 leading-tight mt-1`,children:h?.jenisTanaman||`-`}),(0,D.jsxs)(`p`,{className:`text-sm font-semibold tabular-nums text-emerald-700 mt-2`,children:[_(h?.produksi||0),` `,i]})]}),(0,D.jsxs)(`div`,{className:`grid grid-cols-2 gap-2`,children:[(0,D.jsxs)(`div`,{className:`bg-white border border-slate-200 rounded-md px-3 py-2`,children:[(0,D.jsx)(`p`,{className:`text-[10px] font-semibold uppercase text-slate-500`,children:`Total Produksi`}),(0,D.jsx)(`p`,{className:`text-sm font-bold tabular-nums text-slate-800`,children:_(d)})]}),(0,D.jsxs)(`div`,{className:`bg-white border border-slate-200 rounded-md px-3 py-2`,children:[(0,D.jsx)(`p`,{className:`text-[10px] font-semibold uppercase text-slate-500`,children:`Total Luas`}),(0,D.jsxs)(`p`,{className:`text-sm font-bold tabular-nums text-slate-800`,children:[_(f),` `,a]})]})]}),(0,D.jsx)(`div`,{className:`border-t border-slate-200 pt-3 flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1`,children:u.map((e,t)=>(0,D.jsxs)(`div`,{className:`flex items-center justify-between gap-3 text-xs font-semibold tabular-nums bg-white border border-slate-200 rounded-md px-2 py-1`,children:[(0,D.jsxs)(`span`,{className:`truncate`,children:[t+1,`. `,e.jenisTanaman]}),(0,D.jsx)(`span`,{className:`shrink-0`,children:_(e.produksi)})]},e.jenisTanaman))})]})]}),(0,D.jsxs)(`div`,{className:`mt-6`,children:[(0,D.jsxs)(`p`,{className:`text-[11px] font-semibold uppercase text-slate-500 mb-2`,children:[`Tren Tahunan Produksi (`,i,`) & Luas (`,a,`)`]}),(0,D.jsx)(`div`,{className:`h-[220px] w-full`,children:(0,D.jsx)(S,{width:`100%`,height:`100%`,children:(0,D.jsxs)(le,{data:g,margin:{top:10,right:20,left:0,bottom:0},children:[(0,D.jsx)(x,{strokeDasharray:`3 3`,stroke:`#64748b`,strokeOpacity:.1,vertical:!1}),(0,D.jsx)(y,{dataKey:`tahun`,tick:{fill:`#475569`,fontSize:11},axisLine:{stroke:`#cbd5e1`,strokeWidth:1},tickLine:{stroke:`#cbd5e1`}}),(0,D.jsx)(C,{yAxisId:`left`,tick:{fill:`#475569`,fontSize:10},tickFormatter:e=>_(e),axisLine:{stroke:`#cbd5e1`,strokeWidth:1},tickLine:{stroke:`#cbd5e1`}}),(0,D.jsx)(C,{yAxisId:`right`,orientation:`right`,tick:{fill:`#94a3b8`,fontSize:10},tickFormatter:e=>_(e),axisLine:{stroke:`#cbd5e1`,strokeWidth:1},tickLine:{stroke:`#cbd5e1`}}),(0,D.jsx)(v,{contentStyle:{backgroundColor:`#fff`,border:`1px solid #cbd5e1`,borderRadius:8,fontSize:`12px`,boxShadow:`0 4px 6px -1px rgba(0,0,0,0.1)`},formatter:(e,t)=>String(t||``).toLowerCase().includes(`produksi`)?[`${_(Number(e))} ${i}`,`Produksi`]:[`${_(Number(e))} ${a}`,`Luas`]}),(0,D.jsx)(w,{verticalAlign:`top`,height:36,wrapperStyle:{fontSize:`10px`}}),(0,D.jsx)(T,{yAxisId:`left`,type:`monotone`,dataKey:`produksi`,name:`Produksi (${i})`,stroke:r,strokeWidth:2,dot:{r:3},activeDot:{r:5}}),(0,D.jsx)(T,{yAxisId:`right`,type:`monotone`,dataKey:`luas`,name:`Luas (${a})`,stroke:`#94a3b8`,strokeWidth:2,dot:{r:3},activeDot:{r:5}})]})})})]})]})}export{O as default};