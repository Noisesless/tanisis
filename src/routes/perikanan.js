// Perikanan — /api/v1/perikanan/*
// Replika fetchPerikananBudidaya, fetchPerikananTangkap, fetchPerikananBenih,
// fetchNilaiProduksiBudidaya, fetchNilaiProduksiTangkap.
// Perhatian label: DB "Jaring Ingsang" (typo BPS) ditampilkan "Jaring Insang";
// DB "Pembesaran" (ikan_budidaya) ditampilkan "Kolam Pembesaran".
import { Router } from "express";
import { q } from "../db.js";
import { route, pivotLong } from "../lib/helpers.js";

export const perikananRouter = Router();

const num0 = (v) => (v === null || v === undefined ? 0 : Number(v));

const PEMELIHARAAN_MAP = new Map([
  ["Kolam Pembesaran Ikan", "kolamPembesaran"],
  ["Jaring Karamba Apung", "karambaApung"],
  ["Mina Padi Penyelang", "minaPenyelang"],
  ["Mina Padi Tumpang sari", "minaTumpangsari"],
]);

const ALAT_MAP = new Map([
  ["Jala Tebar", "jalaTebar"],
  ["Pancing", "pancing"],
  ["Jaring Ingsang", "jaringIngsang"],
  ["Bubu", "bubu"],
  ["Lainnya", "lainnya"],
]);

/** GET /api/v1/perikanan/budidaya -> PerikananBudidaya[] (produksi kg per tempat pemeliharaan) */
perikananRouter.get(
  "/budidaya",
  route(async () => {
    const rows = await q(
      `SELECT k.nama AS kecamatan, t.tahun, t.tempat, t.produksi_kg AS nilai
       FROM ikan_pemeliharaan t JOIN kecamatan k ON k.id = t.kecamatan_id
       WHERE t.produksi_kg > 0
       ORDER BY k.nama, t.tahun`,
    );
    return pivotLong(
      rows,
      (r) => {
        const f = PEMELIHARAAN_MAP.get(r.tempat);
        return f ? [f, num0(r.nilai)] : null;
      },
      () => Object.fromEntries([...PEMELIHARAAN_MAP.values()].map((f) => [f, 0])),
    );
  }),
);

/** GET /api/v1/perikanan/tangkap -> PerikananTangkap[] (produksi kg per jenis alat) */
perikananRouter.get(
  "/tangkap",
  route(async () => {
    const rows = await q(
      `SELECT k.nama AS kecamatan, t.tahun, t.jenis_alat, t.produksi_kg AS nilai
       FROM ikan_tangkap t JOIN kecamatan k ON k.id = t.kecamatan_id
       WHERE t.produksi_kg > 0
       ORDER BY k.nama, t.tahun`,
    );
    return pivotLong(
      rows,
      (r) => {
        const f = ALAT_MAP.get(r.jenis_alat);
        return f ? [f, num0(r.nilai)] : null;
      },
      () => Object.fromEntries([...ALAT_MAP.values()].map((f) => [f, 0])),
    );
  }),
);

/** GET /api/v1/perikanan/benih -> PerikananBenih[] (ekor per arah distribusi) */
perikananRouter.get(
  "/benih",
  route(async () => {
    const rows = await q(
      `SELECT k.nama AS kecamatan, t.tahun, t.arah, t.jumlah_ekor AS nilai
       FROM ikan_benih t JOIN kecamatan k ON k.id = t.kecamatan_id
       WHERE t.jumlah_ekor > 0
       ORDER BY k.nama, t.tahun`,
    );
    return pivotLong(
      rows,
      (r) => (r.arah === "sendiri" ? ["dipeliharaSendiri", num0(r.nilai)] : ["dijualLuar", num0(r.nilai)]),
      () => ({ dipeliharaSendiri: 0, dijualLuar: 0 }),
    );
  }),
);

/** Pairs nilai produksi — label tampilan vs nilai DB (meniru NILAI_*_PAIRS di api.ts). */
const NILAI_BUDIDAYA = [
  { label: "Kolam Pembesaran", db: "Pembesaran" },
  { label: "Karamba Jaring Apung", db: "Karamba Jaring Apung" },
  { label: "Minapadi Tumpang Sari", db: "Minapadi Tumpang Sari" },
];
const NILAI_TANGKAP = [
  { label: "Jala Tebar", db: "Jala Tebar" },
  { label: "Pancing", db: "Pancing" },
  { label: "Jaring Insang", db: "Jaring Ingsang" },
  { label: "Bubu", db: "Bubu" },
  { label: "Lainnya", db: "Lainnya" },
];

async function nilaiProduksi({ table, keyCol, subSektor, pairs }) {
  const rows = await q(
    `SELECT k.nama AS kecamatan, t.tahun, t.${keyCol} AS kunci, t.produksi_kg, t.nilai_ribu_rp
     FROM ${table} t JOIN kecamatan k ON k.id = t.kecamatan_id
     WHERE t.produksi_kg > 0 OR t.nilai_ribu_rp > 0
     ORDER BY k.nama, t.tahun`,
  );
  const byKey = new Map();
  for (const r of rows) {
    const key = `${r.kecamatan}|${r.tahun}`;
    if (!byKey.has(key)) byKey.set(key, { kecamatan: r.kecamatan, tahun: String(r.tahun), data: {} });
    byKey.get(key).data[r.kunci] = { produksi: num0(r.produksi_kg), nilai: num0(r.nilai_ribu_rp) };
  }
  return [...byKey.values()]
    .map((r) => ({
      kecamatan: r.kecamatan,
      tahun: r.tahun,
      subSektor,
      jenis: pairs.map((p) => ({
        label: p.label,
        produksi: r.data[p.db]?.produksi ?? 0,
        nilai: r.data[p.db]?.nilai ?? 0,
      })),
    }))
    .sort((a, b) =>
      a.kecamatan === b.kecamatan
        ? parseInt(a.tahun) - parseInt(b.tahun)
        : a.kecamatan.localeCompare(b.kecamatan),
    );
}

/** GET /api/v1/perikanan/nilai-budidaya -> NilaiProduksiRow[] */
perikananRouter.get("/nilai-budidaya", route(() => nilaiProduksi({ table: "ikan_budidaya", keyCol: "jenis_budidaya", subSektor: "Budidaya", pairs: NILAI_BUDIDAYA })));

/** GET /api/v1/perikanan/nilai-tangkap -> NilaiProduksiRow[] */
perikananRouter.get("/nilai-tangkap", route(() => nilaiProduksi({ table: "ikan_tangkap", keyCol: "jenis_alat", subSektor: "Tangkap", pairs: NILAI_TANGKAP })));

/** GET /api/v1/perikanan/jenis-ikan -> 10 komoditas riil 2020-2025 (Rekap Kabupaten & Sebaran) */
perikananRouter.get(
  "/jenis-ikan",
  route(async () => {
    const rows = await q(
      `SELECT tahun, jenis_ikan, produksi_kg, luas_ha, nilai_ekonomi_rp, sumber
       FROM ikan_produksi_jenis
       WHERE produksi_kg > 0
       ORDER BY tahun DESC, produksi_kg DESC`,
    );
    return rows;
  }),
);

/** GET /api/v1/perikanan/budidaya-luasan -> Luas (Ha) vs Produksi (Kg) vs Produktivitas (Ton/Ha) */
perikananRouter.get(
  "/budidaya-luasan",
  route(async () => {
    const rows = await q(
      `SELECT k.nama AS kecamatan, t.tahun, t.tempat, 
              t.luas_ha, t.produksi_kg,
              CASE WHEN t.luas_ha > 0 THEN ROUND((t.produksi_kg / 1000) / t.luas_ha, 2) ELSE 0 END AS produktivitas_ton_ha
       FROM ikan_pemeliharaan t JOIN kecamatan k ON k.id = t.kecamatan_id
       WHERE t.luas_ha > 0 OR t.produksi_kg > 0
       ORDER BY k.nama, t.tahun DESC, t.luas_ha DESC`,
    );
    return rows;
  }),
);

/** GET /api/v1/perikanan/hias -> Ikan Hias per kecamatan & varietas */
perikananRouter.get(
  "/hias",
  route(async () => {
    const rows = await q(
      `SELECT COALESCE(k.nama, t.nama_kecamatan, 'Banjarnegara') AS kecamatan,
              t.tahun, t.varietas, t.volume_ekor, COALESCE(t.luas_m2, 0) AS luas_m2, t.nilai_ekonomi
       FROM ikan_hias t
       LEFT JOIN kecamatan k ON k.id = t.kecamatan_id
       WHERE t.volume_ekor > 0
       ORDER BY t.tahun DESC, t.volume_ekor DESC`,
    );
    return rows;
  }),
);

