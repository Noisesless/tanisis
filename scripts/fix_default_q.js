import fs from 'fs';

const filePath = 'dist/assets/default-CAKe9ffW.js';
let content = fs.readFileSync(filePath, 'utf8');

const target = 'key:"1uf3rs"}]]);q=m(h(),1)';
const replacement = 'key:"1uf3rs"}]]);var q=m(h(),1)';

if (!content.includes(target)) {
  console.error('Target string not found in', filePath);
  process.exit(1);
}

content = content.replace(target, replacement);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully added "var" before q in default layout bundle!');
