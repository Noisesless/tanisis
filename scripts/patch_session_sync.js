import fs from 'fs';

// 1. Update admin-C9Dakcgq.js to support both localStorage and sessionStorage
const adminFile = 'dist/assets/admin-C9Dakcgq.js';
let adminContent = fs.readFileSync(adminFile, 'utf8');

// Target 1: z function reading session
const targetZ = 'z=()=>{try{let e=sessionStorage.getItem(I);return e?JSON.parse(e):null}catch{return null}}';
const replaceZ = 'z=()=>{try{let e=localStorage.getItem(I)||sessionStorage.getItem(I);return e?JSON.parse(e):null}catch{return null}}';

// Target 2: initial useState for token
const targetInitTok = 'let[t,n]=(0,N.useState)(()=>sessionStorage.getItem(F))';
const replaceInitTok = 'let[t,n]=(0,N.useState)(()=>localStorage.getItem(F)||sessionStorage.getItem(F))';

// Target 3: Ce logout function
const targetCe = 'function Ce(){sessionStorage.removeItem(F),sessionStorage.removeItem(I),s(null),n(null),E(null),Q(null),G(null),xe(null)}';
const replaceCe = 'function Ce(){try{localStorage.removeItem(F),localStorage.removeItem(I),sessionStorage.removeItem(F),sessionStorage.removeItem(I),window.dispatchEvent(new Event("sispertani:auth-change"))}catch{}s(null),n(null),E(null),Q(null),G(null),xe(null)}';

// Target 4: we login function writing session
const targetWe = 'sessionStorage.setItem(F,t.token);let r={user:t.user??l,role:t.role??`admin`,label:t.label??`Administrator`};sessionStorage.setItem(I,JSON.stringify(r)),s(r),n(t.token),p(``)';
const replaceWe = 'try{localStorage.setItem(F,t.token),sessionStorage.setItem(F,t.token)}catch{};let r={user:t.user??l,role:t.role??`admin`,label:t.label??`Administrator`};try{localStorage.setItem(I,JSON.stringify(r)),sessionStorage.setItem(I,JSON.stringify(r)),window.dispatchEvent(new Event("sispertani:auth-change"))}catch{};s(r),n(t.token),p(``)';

if (!adminContent.includes(targetZ)) {
  console.error('targetZ not found in admin file');
  process.exit(1);
}
if (!adminContent.includes(targetInitTok)) {
  console.error('targetInitTok not found in admin file');
  process.exit(1);
}
if (!adminContent.includes(targetCe)) {
  console.error('targetCe not found in admin file');
  process.exit(1);
}
if (!adminContent.includes(targetWe)) {
  console.error('targetWe not found in admin file');
  process.exit(1);
}

adminContent = adminContent.replace(targetZ, replaceZ);
adminContent = adminContent.replace(targetInitTok, replaceInitTok);
adminContent = adminContent.replace(targetCe, replaceCe);
adminContent = adminContent.replace(targetWe, replaceWe);
fs.writeFileSync(adminFile, adminContent, 'utf8');
console.log('Successfully updated admin-C9Dakcgq.js with dual-storage & event dispatch!');
