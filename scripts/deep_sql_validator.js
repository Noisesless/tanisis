import fs from "fs";
import path from "path";
import { q } from "../src/db.js";

async function validateAllSql() {
  console.log("=== COMPREHENSIVE SQL QUERY INTEGRITY AUDIT ===");
  
  const files = [];
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (p.endsWith(".js")) files.push(p);
    }
  }
  walk("./src");

  console.log(`Analyzing ${files.length} JavaScript files in src/...`);
  
  // Extract all literal SQL queries passed to `q(...)` or `pool.query(...)`
  const queryExtractRegex = /(?:await\s+q|\.query)\s*\(\s*[`'"]([\s\S]*?)[`'"]/g;
  
  let totalQueries = 0;
  let passedQueries = 0;
  const issues = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    let match;
    while ((match = queryExtractRegex.exec(content)) !== null) {
      let rawSql = match[1].trim();
      
      // Skip empty or purely dynamic fragments
      if (!rawSql || rawSql.length < 10) continue;
      
      // If it has template interpolations or is a SELECT statement, we can inspect EXPLAIN
      // Replace ${...} with safe dummy literals
      let testSql = rawSql
        .replace(/\$\{[^}]+\}/g, " 1 ")
        .replace(/\?/g, "'1'")
        .trim();

      // Only test SELECT queries with EXPLAIN to avoid mutating data
      if (/^SELECT\b/i.test(testSql)) {
        totalQueries++;
        try {
          // Wrap in EXPLAIN to validate syntax and table/column existence without running heavy scans
          await q(`EXPLAIN ${testSql}`);
          passedQueries++;
        } catch (err) {
          // If error is about syntax from replacement, report carefully
          issues.push({
            file,
            error: err.message,
            rawSql: rawSql.replace(/\s+/g, " ").slice(0, 120)
          });
        }
      }
    }
  }

  console.log(`\nAudited ${totalQueries} SELECT queries across backend:`);
  console.log(`Passed EXPLAIN syntax & schema validation: ${passedQueries}`);
  console.log(`Potential Schema Issues / Syntax Mismatches: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log("\nDetails of potential issues:");
    for (const issue of issues) {
      console.log(`- [${issue.file}]`);
      console.log(`  Error: ${issue.error}`);
      console.log(`  Query: ${issue.rawSql}`);
    }
  }
  
  process.exit(0);
}

validateAllSql().catch(console.error);
