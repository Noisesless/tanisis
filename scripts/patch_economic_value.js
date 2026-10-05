import fs from 'fs';

const filePath = 'dist/assets/economic-value-DLEXCH7D.js';
let content = fs.readFileSync(filePath, 'utf8');

// Target string in economic-value-DLEXCH7D.js
const target = 'ue=[...i.map(e=>({key:e,label:s[e].label,icon:M[s[e].ikon],href:`/nilai-ekonomi/${e}`})),{key:`perikanan`,label:`Perikanan`,icon:l,href:`/economic-value`}]';
const replacement = 'ue=[{key:`perikanan`,label:`Perikanan`,icon:l,href:`/economic-value`}]';

if (!content.includes(target)) {
  console.error('Target not found in', filePath);
  process.exit(1);
}

content = content.replace(target, replacement);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated economic-value tabs!');
