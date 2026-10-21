import fs from "fs";
import path from "path";
import { getPool, q } from "../src/db.js";

async function audit() {
  console.log("=== AUDIT GAP SISTEM: FRONTEND - BACKEND - DATABASE ===");
  const results = {
    dbGaps: [],
    endpointGaps: [],
    schemaChecks: [],
    frontendCalls: []
  };

  // 1. Get all tables and columns from MySQL information_schema
  const dbCols = await q(`
    SELECT table_name, column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'pertasis'
  `);
  const schemaMap = new Map();
  for (const row of dbCols) {
    const t = row.table_name.toLowerCase();
    const c = row.column_name.toLowerCase();
    if (!schemaMap.has(t)) schemaMap.set(t, new Set());
    schemaMap.get(t).add(c);
  }
  console.log(`[DB] Terdeteksi ${schemaMap.size} tabel di database pertasis.`);

  // 2. Scan all backend files for SQL queries
  const srcFiles = [];
  function walkDir(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const p = path.join(dir, file);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) walkDir(p);
      else if (p.endsWith(".js")) srcFiles.push(p);
    }
  }
  walkDir("./src");

  console.log(`[Backend] Memeriksa kueri SQL pada ${srcFiles.length} file di src/...`);
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf8");
    // Regex to match SELECT/INSERT/UPDATE queries
    const sqlRegex = /(?:SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM)\s+([^;`"'\)\n]+)/gi;
    let match;
    while ((match = sqlRegex.exec(content)) !== null) {
      const snippet = match[0].replace(/\s+/g, " ");
      // Check for table mentions like FROM <table> or JOIN <table>
      const fromMatch = snippet.match(/(?:FROM|INTO|UPDATE|JOIN)\s+([a-zA-Z0-9_]+)/i);
      if (fromMatch) {
        const table = fromMatch[1].toLowerCase();
        if (!schemaMap.has(table) && !["information_schema", "dual"].includes(table)) {
          results.dbGaps.push({
            file,
            table,
            issue: "Tabel tidak ditemukan di database pertasis",
            snippet: snippet.slice(0, 80)
          });
        }
      }
    }
  }

  // 3. Scan frontend assets for API endpoints called
  console.log(`[Frontend] Memindai pemanggilan API pada bundle dist/assets/...`);
  const assetFiles = fs.readdirSync("./dist/assets").filter(f => f.endsWith(".js"));
  const apiCallSet = new Set();
  const endpointRegex = /["'`](?:\/api|\/sispertani-api)\/([a-zA-Z0-9_\-\/:?&=]+)["'`]/g;

  for (const f of assetFiles) {
    const filePath = path.join("./dist/assets", f);
    const content = fs.readFileSync(filePath, "utf8");
    let match;
    while ((match = endpointRegex.exec(content)) !== null) {
      const fullUrl = match[0].slice(1, -1);
      // Clean query params to get base endpoint
      const baseEp = fullUrl.split("?")[0].replace(/^\/sispertani-api/, "/api");
      apiCallSet.add({ full: fullUrl, base: baseEp, asset: f });
    }
  }

  // Extract unique base endpoints
  const uniqueBaseEndpoints = [...new Set([...apiCallSet].map(x => x.base))];
  console.log(`[Frontend] Ditemukan ${uniqueBaseEndpoints.length} unique base API endpoints yang dipanggil frontend:`);
  
  // Test each endpoint against the live local server
  for (const ep of uniqueBaseEndpoints) {
    // Skip parameterized endpoints with colon like /api/v1/admin/template/:domain
    if (ep.includes(":")) continue;
    try {
      const res = await fetch(`http://127.0.0.1:5173${ep}`, {
        headers: { accept: "application/json" }
      });
      if (res.status === 404) {
        results.endpointGaps.push({
          endpoint: ep,
          status: 404,
          issue: "Endpoint dipanggil frontend tapi mengembalikan 404 Not Found"
        });
      } else if (res.status >= 500) {
        results.endpointGaps.push({
          endpoint: ep,
          status: res.status,
          issue: "Endpoint mengembalikan Server Error 500"
        });
      }
    } catch (e) {
      results.endpointGaps.push({
        endpoint: ep,
        issue: `Koneksi gagal: ${e.message}`
      });
    }
  }

  // 4. Output summary
  console.log("\n--- HASIL AUDIT DATABASE GAPS ---");
  console.log(results.dbGaps.length === 0 ? "Tidak ada tabel hilang." : results.dbGaps);

  console.log("\n--- HASIL AUDIT ENDPOINT GAPS ---");
  console.log(results.endpointGaps.length === 0 ? "Tidak ada 404/500 pada endpoint publik frontend." : results.endpointGaps);

  console.log("\n--- DAFTAR ENDPOINT YANG DIUJI ---");
  console.log(uniqueBaseEndpoints);

  process.exit(0);
}

audit().catch(console.error);
