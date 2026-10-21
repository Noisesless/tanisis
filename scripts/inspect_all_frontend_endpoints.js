import fs from "fs";
import path from "path";

const files = fs.readdirSync("./dist/assets").filter(f => f.endsWith(".js"));
const allEndpoints = new Set();

for (const f of files) {
  const code = fs.readFileSync(path.join("./dist/assets", f), "utf8");
  // Match "/v1/..." or "/api/..." or "/sispertani-api/..."
  const reg = /(?:["'`])(\/(?:api\/|sispertani-api\/|v1\/)[a-zA-Z0-9_\-\/]+)(?:[?#"'\`])/g;
  let m;
  while ((m = reg.exec(code)) !== null) {
    let ep = m[1];
    ep = ep.replace(/^\/sispertani-api/, "");
    if (!ep.startsWith("/api")) ep = "/api" + (ep.startsWith("/") ? "" : "/") + ep;
    allEndpoints.add(ep);
  }
}

const list = [...allEndpoints].sort();
console.log(`Ditemukan ${list.length} endpoint yang dipanggil frontend:`);

async function testAll() {
  const issues = [];
  for (const ep of list) {
    if (ep.includes(":")) continue;
    try {
      const res = await fetch(`http://127.0.0.1:5173${ep}`);
      console.log(`[${res.status}] ${ep}`);
      if (res.status === 404 || res.status >= 500) {
        issues.push({ ep, status: res.status });
      }
    } catch (e) {
      issues.push({ ep, error: e.message });
    }
  }
  console.log("\n=== RINGKASAN MASALAH ENDPOINT ===");
  if (issues.length === 0) console.log("Semua endpoint GET lolos 100%!");
  else console.log(issues);
  process.exit(0);
}

testAll();
