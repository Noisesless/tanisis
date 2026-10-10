// SISPERTANI backend — API di atas MySQL/MariaDB `sispertani`.
// Read: seluruh domain statistik + bantuan pemerintah. Write: dasbor admin
// (login token, import/export/template Excel) — routes/admin.js.
// Jalankan: npm start (membaca .env via --env-file) atau node --env-file=.env src/server.js
import path from "node:path";
import express from "express";
import { getPool } from "./db.js";
import { lahanRouter } from "./routes/lahan.js";
import { padiRouter, palawijaRouter } from "./routes/padi.js";
import { hortikulturaRouter } from "./routes/hortikultura.js";
import { perkebunanRouter } from "./routes/perkebunan.js";
import { peternakanRouter } from "./routes/peternakan.js";
import { perikananRouter } from "./routes/perikanan.js";
import { ekonomiRouter, lumbungRouter } from "./routes/ekonomi.js";
import { kelembagaanRouter } from "./routes/kelembagaan.js";
import { st2023Router } from "./routes/st2023.js";
import bantuanRouter from "./routes/bantuan.js";
import { komoditasUnggulanRouter } from "./routes/komoditas-unggulan.js";
import adminRouter from "./routes/admin.js";
import aiRouter from "./routes/ai.js";
import { psatRouter } from "./routes/psat.js";
import { ketahananRouter } from "./routes/ketahanan.js";
import { getDynamicKomoditasUnggulan } from "./lib/komoditas-dinamis.js";
let compressionMiddleware = (_req, _res, next) => next();
try {
  const { default: compression } = await import("compression");
  compressionMiddleware = compression({
    filter: (req, res) => {
      const p = (req.path || "").toLowerCase();
      // Bypass kompresi untuk file statis (.geojson, .csv, .json, gambar) agar disajikan
      // dengan header Content-Length utuh & standard stream, mencegah benturan framing
      // chunked HTTP/2 pada reverse proxy Nginx (resolusi net::ERR_HTTP2_PROTOCOL_ERROR).
      if (
        p.endsWith(".geojson") ||
        p.endsWith(".csv") ||
        p.endsWith(".json") ||
        /\.(png|jpe?g|svg|webp|ico|woff2?)$/.test(p)
      ) {
        return false;
      }
      return compression.filter(req, res);
    },
  });
} catch (err) {
  console.warn("[Server] Peringatan: Modul 'compression' belum terpasang, berjalan tanpa kompresi gzip:", err?.message);
}

const app = express();
app.disable("x-powered-by");
app.use(compressionMiddleware);

// Security Headers Hygiene (SP-011, SP-023)
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  next();
});

// CORS sederhana berbasis allowlist (tanpa dependensi tambahan).
const allowed = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowed.includes("*") || (origin && allowed.includes(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "86400");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// === Produksi (1 × Node.js Site CloudPanel) ==============================
// Semua endpoint API didaftarkan pada SATU Router yang di-mount dua kali:
// /api/* (path internal) dan /sispertani-api/* (prefix frontend). Mount ganda
// dipilih karena rewrite req.url di middleware tidak andal antar versi Express.
const api = express.Router();

// Rate Limiter Bertingkat: Tier 1 - Proteksi Umum API (Anti-Abuse / Anti-Scraping)
// Membatasi maksimal 120 request per menit per IP untuk seluruh endpoint /api/* dan /sispertani-api/*
const globalRateLimitMap = new Map();
const GLOBAL_RATE_LIMIT_WINDOW = 60 * 1000;
const GLOBAL_MAX_REQUESTS = 120;

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of globalRateLimitMap.entries()) {
    if (now - record.startTime > GLOBAL_RATE_LIMIT_WINDOW) {
      globalRateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

function generalApiLimiter(req, res, next) {
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();
  const record = globalRateLimitMap.get(clientIp);

  if (!record || now - record.startTime > GLOBAL_RATE_LIMIT_WINDOW) {
    globalRateLimitMap.set(clientIp, { startTime: now, count: 1 });
    return next();
  }

  if (record.count >= GLOBAL_MAX_REQUESTS) {
    return res.status(429).json({
      error: "rate_limit_exceeded",
      message: "Terlalu banyak permintaan API. Silakan coba kembali dalam 1 menit.",
    });
  }

  record.count++;
  next();
}

api.use(generalApiLimiter);

// Proxy CKAN (GET /api/3/* & /sispertani-api/3/* → opendata.banjarnegarakab.go.id)
// supaya katalog online ikut hidup dari origin aplikasi sendiri. Matikan CKAN_PROXY=0.
const CKAN_ORIGIN = process.env.CKAN_ORIGIN || "https://opendata.banjarnegarakab.go.id";
const CKAN_PROXY = (process.env.CKAN_PROXY ?? "1") !== "0";
api.use("/3", async (req, res) => {
  if (!CKAN_PROXY) return res.status(501).json({ error: "ckan_proxy_disabled" });
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });
  try {
    const safeSubPath = req.url.startsWith("/") ? req.url : `/${req.url}`;
    const targetUrl = new URL(`/api/3${safeSubPath}`, CKAN_ORIGIN);
    const expectedHost = new URL(CKAN_ORIGIN).host;
    if (targetUrl.host !== expectedHost) {
      return res.status(400).json({ error: "invalid_upstream_host" });
    }
    const upstream = await fetch(targetUrl.href, {
      headers: { accept: req.headers.accept || "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    const body = await upstream.text();
    res.status(upstream.status);
    const ct = upstream.headers.get("content-type");
    if (ct) res.set("content-type", ct);
    res.set("cache-control", "public, max-age=300");
    res.send(body);
  } catch {
    res.status(502).json({ error: "ckan_unreachable" });
  }
});

// Health check — dipakai frontend untuk mendeteksi ketersediaan API (Debug Mode Off / Sanitized error).
api.get("/health", async (_req, res) => {
  try {
    const rows = await getPool().query("SELECT 1 AS ok");
    const ok = Array.isArray(rows) ? rows[0]?.[0]?.ok : rows?.ok;
    res.json({ ok: true, db: ok === 1 ? "up" : "down", time: new Date().toISOString() });
  } catch (e) {
    console.error("[health] DB check failed:", e?.message);
    res.status(503).json({ ok: false, db: "down" });
  }
});

app.use(express.json({ limit: "256kb" })); // body JSON login dasbor admin

api.get("/v1", (_req, res) => {
  res.json({
    name: "SISPERTANI API",
    version: 1,
    readonly: false,
    write: "admin-only (Bearer token — routes/admin.js)",
    endpoints: [
      "/api/v1/lahan/desa", "/api/v1/lahan/kabupaten",
      "/api/v1/padi/production", "/api/v1/padi/history", "/api/v1/padi/sawah-ladang",
      "/api/v1/palawija/jagung-ubi-kayu", "/api/v1/palawija/kacang-kedelai", "/api/v1/palawija/ubi-kacang-hijau",
      "/api/v1/hortikultura/sayuran-produksi", "/api/v1/hortikultura/sayuran-luas",
      "/api/v1/hortikultura/buah-produksi", "/api/v1/hortikultura/produksi-tahunan",
      "/api/v1/perkebunan/areal", "/api/v1/perkebunan/produksi",
      "/api/v1/peternakan/kecil", "/api/v1/peternakan/besar", "/api/v1/peternakan/unggas",
      "/api/v1/peternakan/pemasukan", "/api/v1/peternakan/pengeluaran",
      "/api/v1/peternakan/luar-rph", "/api/v1/peternakan/daging-unggas",
      "/api/v1/peternakan/susu-kulit",
      "/api/v1/perikanan/budidaya", "/api/v1/perikanan/tangkap", "/api/v1/perikanan/benih",
      "/api/v1/perikanan/nilai-budidaya", "/api/v1/perikanan/nilai-tangkap",
      "/api/v1/ekonomi/inflasi", "/api/v1/ekonomi/pasar", "/api/v1/lumbung",
      "/api/v1/kelembagaan/kelompok-tani", "/api/v1/kelembagaan/kth",
      "/api/v1/st2023/desa",
      "/api/v1/bantuan",
      "/api/v1/komoditas-unggulan/per-kecamatan",
      "/api/v1/komoditas-unggulan",
      "/api/v1/ai",
      "/api/v1/admin/login", "/api/v1/admin/domains", "/api/v1/admin/sync-log",
      "/api/v1/admin/template/:domain", "/api/v1/admin/export/:domain",
      "/api/v1/admin/import/:domain",
      "/api/v1/admin/paket", "/api/v1/admin/paket/:tipe/:file",
    ],
  });
});

api.use("/v1/lahan", lahanRouter);
api.use("/v1/padi", padiRouter);
api.use("/v1/palawija", palawijaRouter);
api.use("/v1/hortikultura", hortikulturaRouter);
api.use("/v1/perkebunan", perkebunanRouter);
api.use("/v1/peternakan", peternakanRouter);
api.use("/v1/perikanan", perikananRouter);
api.use("/v1/ekonomi", ekonomiRouter);
api.use("/v1/lumbung", lumbungRouter);
api.use("/v1/kelembagaan", kelembagaanRouter);
api.use("/v1/st2023", st2023Router);
api.use("/v1/bantuan", bantuanRouter);
api.use("/v1/komoditas-unggulan/per-kecamatan", komoditasUnggulanRouter);
api.use("/v1/admin", adminRouter);
api.use("/v1/ai", aiRouter);
api.use("/v1/psat-pduk", psatRouter);
api.use("/v1/ketahanan", ketahananRouter);

// Endpoint Komoditas Unggulan Dinamis Multi-Sektor (Zero Hardcode, Zero Dummy Law)
api.get("/v1/komoditas-unggulan", async (req, res) => {
  try {
    const data = await getDynamicKomoditasUnggulan();
    return res.json(data);
  } catch (err) {
    console.error("[komoditas-unggulan] Query error:", err?.message);
    return res.status(500).json({ error: "internal_error", message: "Gagal memproses data komoditas unggulan." });
  }
});

// Catch-all 404 di dalam router — berlaku untuk kedua prefix (/api & /sispertani-api).
api.use((_req, res) => res.status(404).json({ error: "not_found" }));

// Mount ganda: /api (path internal) + /sispertani-api (prefix yang dipanggil frontend).
app.use("/api", api);
app.use("/sispertani-api", api);

// === Frontend: dist/ hasil build Vite dilayani dari sini ==================
// Security Guard: Blokir akses langsung ke ekstensi sensitif (.sql, .env, .bak, .sh, dll)
app.use((req, res, next) => {
  const ext = path.extname(req.path).toLowerCase();
  const BLOCKED_EXTS = new Set([".sql", ".env", ".bak", ".sh", ".bash", ".yml", ".yaml", ".config"]);
  if (BLOCKED_EXTS.has(ext) || req.path.includes("/.")) {
    return res.status(403).json({ error: "forbidden_access" });
  }
  next();
});

// DIST_DIR relatif Application Root (default ./dist, sejajar package.json).
// Di dev (tanpa dist/) bagian ini tidak mengganggu — frontend tetap via Vite.
const DIST_DIR = process.env.DIST_DIR || "./dist";
const distRoot = path.isAbsolute(DIST_DIR) ? DIST_DIR : path.join(process.cwd(), DIST_DIR);
// Normalisasi modul JS: Bersihkan query string (?v=...) agar browser hanya memuat 1 instance modul React tunggal
app.use((req, res, next) => {
  if (req.path.startsWith("/assets/") && req.path.endsWith(".js") && Object.keys(req.query).length > 0) {
    return res.redirect(302, req.path);
  }
  next();
});

app.use(
  express.static(distRoot, {
    setHeaders: (res, filePath) => {
      // Asset statis besar (GeoJSON, gambar, fonts, fallback dataset) di-cache browser (1 hari)
      // agar tidak mendownload puluhan megabyte berulang kali dan memicu net::ERR_HTTP2_PROTOCOL_ERROR.
      if (/\.(geojson|png|jpg|jpeg|svg|webp|woff2?|ico)$/i.test(filePath) || filePath.includes("fallback.json")) {
        res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
      } else {
        // Berkas aplikasi (HTML, JS, CSS) tetap no-cache agar pembaruan kode langsung aktif
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      }
    },
  })
);

// Normalisasi rute & redirect spesifik sebelum SPA fallback
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  if (req.path === "/sebaran" || req.path === "/sebaran/") {
    return res.redirect(302, "/sebaran/pangan");
  }
  if (req.path === "/kecamatan/") {
    return res.redirect(302, "/kecamatan");
  }
  next();
});

// SPA fallback: route frontend (GET/HEAD tanpa ekstensi) → index.html supaya
// refresh di URL dalam (mis. /desa/susukan/brengkok) tidak 404. Path API tak
// dikenal tetap 404 JSON; file statis yang hilang tetap 404.
app.use((req, res, next) => {
  if (
    (req.method !== "GET" && req.method !== "HEAD") ||
    req.path.startsWith("/api") ||
    req.path.startsWith("/sispertani-api") ||
    path.extname(req.path)
  ) {
    return next();
  }
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.sendFile(path.join(distRoot, "index.html"));
});

// SP-019 & Debug Mode Off: Global Safe Error Handler (mencegah kebocoran stack trace ke browser)
app.use((err, _req, res, _next) => {
  console.error("[global-error]", err?.message || err);
  if (!res.headersSent) {
    res.status(err?.status || 500).json({
      error: "internal_error",
      message: "Terjadi kesalahan internal pada server.",
    });
  }
});

app.use((_req, res) => res.status(404).json({ error: "not_found" }));

const port = Number(process.env.PORT || 4100);
app.listen(port, process.env.BIND_HOST || "0.0.0.0", () => {
  console.log(`[sispertani-api] API listening on http://127.0.0.1:${port} (statistik+bantuan read, admin write; dist=${DIST_DIR})`);
  // Self-healing: sinkronisasi rekap komoditas unggulan di latar belakang saat server start
  import("./lib/komoditas-rekap.js")
    .then(({ rekapKomoditasUnggulan }) => {
      rekapKomoditasUnggulan().catch((err) => console.error("[komoditas-rekap] Startup sync error:", err.message));
    })
    .catch(() => {});
});
