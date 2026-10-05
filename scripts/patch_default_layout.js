import fs from 'fs';

const filePath = 'dist/assets/default-CAKe9ffW.js';
let content = fs.readFileSync(filePath, 'utf8');

// Target 1: Top definitions
const targetTop = 'q=m(h(),1),J=v();function Y({children:m}){let h=g(),[v,y]=(0,q.useState)(!1),[Y,X]=(0,q.useState)(null),[menuOpen,setMenuOpen]=(0,q.useState)(!1);(0,q.useEffect)(()=>{let e=b.navGroups.findIndex(e=>e.items.some(e=>e.href===h.pathname));e>=0&&X(e)},[h.pathname]);(0,q.useEffect)(()=>{setMenuOpen(!1)},[h.pathname]);';

const replaceTop = '_authKeyTok="sispertani:admin-token",_authKeySes="sispertani:admin-session",_readAuth=()=>{try{let e=localStorage.getItem(_authKeySes)||sessionStorage.getItem(_authKeySes),t=localStorage.getItem(_authKeyTok)||sessionStorage.getItem(_authKeyTok);if(!e||!t)return null;let n=JSON.parse(e);return n&&n.user?n:null}catch{return null}},_clearAuth=()=>{try{localStorage.removeItem(_authKeyTok),localStorage.removeItem(_authKeySes),sessionStorage.removeItem(_authKeyTok),sessionStorage.removeItem(_authKeySes),window.dispatchEvent(new Event("sispertani:auth-change"))}catch{}},_logOutIcon=y("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);q=m(h(),1),J=v();function Y({children:m}){let h=g(),[v,y]=(0,q.useState)(!1),[Y,X]=(0,q.useState)(null),[menuOpen,setMenuOpen]=(0,q.useState)(!1),[auth,setAuth]=(0,q.useState)(()=>_readAuth());(0,q.useEffect)(()=>{let e=b.navGroups.findIndex(e=>e.items.some(e=>e.href===h.pathname));e>=0&&X(e)},[h.pathname]);(0,q.useEffect)(()=>{setMenuOpen(!1),setAuth(_readAuth())},[h.pathname]);(0,q.useEffect)(()=>{let e=()=>setAuth(_readAuth());return window.addEventListener("storage",e),window.addEventListener("sispertani:auth-change",e),()=>{window.removeEventListener("storage",e),window.removeEventListener("sispertani:auth-change",e)}},[]);';

// Target 2: Sidebar bottom button
const targetSidebar = '(0,J.jsx)(`div`,{className:`p-3 border-t border-slate-800/80 mt-auto shrink-0`,children:(0,J.jsxs)(_,{to:`/admin`,className:`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 transition-all group`,children:[(0,J.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,J.jsx)(t,{className:`w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300 shrink-0`}),`Portal Admin`]}),(0,J.jsx)(D,{className:`w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 -rotate-90 shrink-0 transition-transform`})]})})';

const replaceSidebar = '(0,J.jsx)(`div`,{className:`p-3 border-t border-slate-800/80 mt-auto shrink-0`,children:(0,J.jsxs)(_,{to:`/admin`,className:auth?`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 transition-all group`:`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 transition-all group`,children:[(0,J.jsxs)(`div`,{className:`flex items-center gap-2 truncate`,children:[(0,J.jsx)(t,{className:`w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300 shrink-0`}),auth?(auth.label||auth.user)+` (Aktif)`:`Portal Admin`]}),(0,J.jsx)(D,{className:`w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 -rotate-90 shrink-0 transition-transform`})]})})';

// Target 3: Top header button
const targetHeaderBtn = '(0,J.jsxs)(`button`,{type:`button`,onClick:()=>setMenuOpen(!menuOpen),className:`flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer group text-left focus:outline-none`,"aria-label":`Menu Pengguna`,children:[(0,J.jsxs)(`div`,{className:`text-right hidden sm:block`,children:[(0,J.jsx)(`p`,{className:`text-xs font-bold text-slate-800 group-hover:text-slate-900 leading-tight`,children:`Guest`}),(0,J.jsx)(`p`,{className:`text-[9px] font-semibold text-slate-400 uppercase tracking-wider leading-none mt-0.5`,children:`Pengunjung`})]}),(0,J.jsx)(`div`,{className:`w-8 h-8 rounded-full border border-amber-300/80 bg-amber-100 flex items-center justify-center font-sans font-bold text-xs text-amber-900 shadow-sm shrink-0`,children:`G`}),(0,J.jsx)(D,{className:`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${menuOpen?`rotate-180`:``} shrink-0`})]})';

const replaceHeaderBtn = '(0,J.jsxs)(`button`,{type:`button`,onClick:()=>setMenuOpen(!menuOpen),className:`flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer group text-left focus:outline-none`,"aria-label":`Menu Pengguna`,children:[auth?(0,J.jsxs)(`div`,{className:`text-right hidden sm:block`,children:[(0,J.jsx)(`p`,{className:`text-xs font-bold text-slate-800 group-hover:text-emerald-700 leading-tight truncate max-w-[140px]`,children:auth.label||auth.user}),(0,J.jsxs)(`p`,{className:`text-[9px] font-semibold text-emerald-600 uppercase tracking-wider leading-none mt-0.5 flex items-center justify-end gap-1`,children:[(0,J.jsx)(`span`,{className:`w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse`}),`Sesi Aktif`]})]}):(0,J.jsxs)(`div`,{className:`text-right hidden sm:block`,children:[(0,J.jsx)(`p`,{className:`text-xs font-bold text-slate-800 group-hover:text-slate-900 leading-tight`,children:`Guest`}),(0,J.jsx)(`p`,{className:`text-[9px] font-semibold text-slate-400 uppercase tracking-wider leading-none mt-0.5`,children:`Pengunjung`})]}),auth?(0,J.jsx)(`div`,{className:`w-8 h-8 rounded-full border border-emerald-400/80 bg-emerald-600 flex items-center justify-center font-sans font-bold text-xs text-white shadow-sm shrink-0`,children:(auth.label||auth.user||`A`).charAt(0).toUpperCase()}):(0,J.jsx)(`div`,{className:`w-8 h-8 rounded-full border border-amber-300/80 bg-amber-100 flex items-center justify-center font-sans font-bold text-xs text-amber-900 shadow-sm shrink-0`,children:`G`}),(0,J.jsx)(D,{className:`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${menuOpen?`rotate-180`:``} shrink-0`})]})';

// Target 4: Dropdown user card
const targetCard = '(0,J.jsxs)(`div`,{className:`px-3.5 py-2.5 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50 rounded-t-xl`,children:[(0,J.jsx)(`div`,{className:`w-8 h-8 rounded-full border border-amber-300/80 bg-amber-100 flex items-center justify-center font-bold text-xs text-amber-900 shrink-0`,children:`G`}),(0,J.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,J.jsx)(`p`,{className:`text-xs font-bold text-slate-900 truncate`,children:`Guest User`}),(0,J.jsx)(`p`,{className:`text-[10px] text-slate-500 truncate`,children:`Hak Akses: Pengunjung`})]})]})';

const replaceCard = '(0,J.jsxs)(`div`,{className:`px-3.5 py-2.5 border-b border-slate-100 flex items-center gap-2.5 ${auth?`bg-emerald-50/70`:`bg-slate-50/50`} rounded-t-xl`,children:[auth?(0,J.jsx)(`div`,{className:`w-8 h-8 rounded-full border border-emerald-400/80 bg-emerald-600 flex items-center justify-center font-bold text-xs text-white shrink-0`,children:(auth.label||auth.user||`A`).charAt(0).toUpperCase()}):(0,J.jsx)(`div`,{className:`w-8 h-8 rounded-full border border-amber-300/80 bg-amber-100 flex items-center justify-center font-bold text-xs text-amber-900 shrink-0`,children:`G`}),(0,J.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,J.jsx)(`p`,{className:`text-xs font-bold text-slate-900 truncate`,children:auth?auth.label||auth.user:`Guest User`}),(0,J.jsx)(`p`,{className:`text-[10px] text-slate-500 truncate`,children:auth?`Hak Akses: ${auth.role===`admin`?`Super Administrator`:auth.label}`:`Hak Akses: Pengunjung`})]})]})';

// Target 5: Dropdown footer button (Masuk Portal Admin)
const targetFooterBtn = '(0,J.jsx)(`div`,{className:`p-1.5`,children:(0,J.jsxs)(_,{to:`/admin`,onClick:()=>setMenuOpen(!1),className:`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 border border-emerald-200/60 transition-colors`,children:[(0,J.jsx)(t,{className:`w-4 h-4 text-emerald-600 shrink-0`}),(0,J.jsx)(`span`,{children:`Masuk Portal Admin`})]})})';

const replaceFooterBtn = 'auth?(0,J.jsxs)(`div`,{className:`p-1.5 space-y-1`,children:[(0,J.jsxs)(_,{to:`/admin`,onClick:()=>setMenuOpen(!1),className:`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200/70 transition-colors w-full`,children:[(0,J.jsx)(t,{className:`w-4 h-4 text-emerald-600 shrink-0`}),(0,J.jsx)(`span`,{children:`Buka Dasbor Admin`})]}),(0,J.jsxs)(`button`,{type:`button`,onClick:()=>{_clearAuth();setAuth(null);setMenuOpen(!1)},className:`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors w-full text-left`,children:[(0,J.jsx)(_logOutIcon,{className:`w-4 h-4 text-rose-600 shrink-0`}),(0,J.jsx)(`span`,{children:`Keluar (Logout)`})]})]}):(0,J.jsx)(`div`,{className:`p-1.5`,children:(0,J.jsxs)(_,{to:`/admin`,onClick:()=>setMenuOpen(!1),className:`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 border border-emerald-200/60 transition-colors`,children:[(0,J.jsx)(t,{className:`w-4 h-4 text-emerald-600 shrink-0`}),(0,J.jsx)(`span`,{children:`Masuk Portal Admin`})]})})';

if (!content.includes(targetTop)) {
  console.error('targetTop not found in default layout');
  process.exit(1);
}
if (!content.includes(targetSidebar)) {
  console.error('targetSidebar not found in default layout');
  process.exit(1);
}
if (!content.includes(targetHeaderBtn)) {
  console.error('targetHeaderBtn not found in default layout');
  process.exit(1);
}
if (!content.includes(targetCard)) {
  console.error('targetCard not found in default layout');
  process.exit(1);
}
if (!content.includes(targetFooterBtn)) {
  console.error('targetFooterBtn not found in default layout');
  process.exit(1);
}

content = content.replace(targetTop, replaceTop);
content = content.replace(targetSidebar, replaceSidebar);
content = content.replace(targetHeaderBtn, replaceHeaderBtn);
content = content.replace(targetCard, replaceCard);
content = content.replace(targetFooterBtn, replaceFooterBtn);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated default-CAKe9ffW.js with dynamic session avatar and dropdown!');
