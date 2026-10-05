// Hortikultura — /api/v1/hortikultura/*
// Replika fetchVegetableProduction, fetchVegetableArea, fetchFruitProduction,
// fetchAnnualHorticultureProduction (termasuk titik 2025 hardcoded BPS).
import { Router } from "express";
import { q } from "../db.js";
import { route, pivotLong } from "../lib/helpers.js";

export const hortikulturaRouter = Router();

const SAYURAN_FIELDS = [
  ["Bawang Merah", "bawangMerah"],
  ["Cabai Besar", "cabaiBesar"],
  ["Kentang", "kentang"],
  ["Kubis", "kubis"],
  ["Petsai", "petsai"],
  ["Tomat", "tomat"],
  ["Bawang Putih", "bawangPutih"],
  ["Cabai Rawit", "cabaiRawit"],
];
const SAYURAN_MAP = new Map(SAYURAN_FIELDS);

const BUAH_FIELDS = [
  ["Mangga", "mangga"],
  ["Durian", "durian"],
  ["Jeruk Besar", "jerukBesar"],
  ["Pisang", "pisang"],
  ["Pepaya", "pepaya"],
  ["Salak", "salak"],
  ["Jeruk Siam", "jerukSiam"],
];
const BUAH_MAP = new Map(BUAH_FIELDS);

const num0 = (v) => (v === null || v === undefined ? 0 : Number(v));

/** GET /api/v1/hortikultura/sayuran-produksi -> VegetableProduction[] (ton) */
hortikulturaRouter.get(
  "/sayuran-produksi",
  route(async () => {
    const rows = await q(
      `SELECT k.nama AS kecamatan, t.tahun, t.komoditas, t.nilai
       FROM horti_produksi t JOIN kecamatan k ON k.id = t.kecamatan_id
       WHERE t.kelompok = 'sayuran' ORDER BY k.nama, t.tahun`,
    );
    return pivotLong(rows, (r) => {
      const f = SAYURAN_MAP.get(r.komoditas);
      return f ? [f, num0(r.nilai)] : null;
    });
  }),
);

/** GET /api/v1/hortikultura/sayuran-luas -> VegetableArea[] (ha) */
hortikulturaRouter.get(
  "/sayuran-luas",
  route(async () => {
    const rows = await q(
      `SELECT k.nama AS kecamatan, t.tahun, t.komoditas, t.nilai
       FROM horti_luas t JOIN kecamatan k ON k.id = t.kecamatan_id
       WHERE t.kelompok = 'sayuran' ORDER BY k.nama, t.tahun`,
    );
    return pivotLong(rows, (r) => {
      const f = SAYURAN_MAP.get(r.komoditas);
      return f ? [f, num0(r.nilai)] : null;
    });
  }),
);

/** GET /api/v1/hortikultura/buah-produksi -> FruitProduction[] (ton) */
hortikulturaRouter.get(
  "/buah-produksi",
  route(async () => {
    const rows = await q(
      `SELECT k.nama AS kecamatan, t.tahun, t.komoditas, t.nilai
       FROM horti_produksi t JOIN kecamatan k ON k.id = t.kecamatan_id
       WHERE t.kelompok = 'buah_tahunan' ORDER BY k.nama, t.tahun`,
    );
    return pivotLong(rows, (r) => {
      const f = BUAH_MAP.get(r.komoditas);
      return f ? [f, num0(r.nilai)] : null;
    });
  }),
);

/**
 * GET /api/v1/hortikultura/produksi-tahunan -> AnnualHorticultureProduction[]
 * Buah-buahan & sayuran tahunan kabupaten murni dinamis dari tabel horti_produksi_kabupaten (Zero Dummy Data).
 */
hortikulturaRouter.get(
  "/produksi-tahunan",
  route(async () => {
    const rows = await q(
      `SELECT t.komoditas, t.nilai, t.tahun
       FROM horti_produksi_kabupaten t
       WHERE t.nilai > 0
       ORDER BY t.tahun DESC, t.nilai DESC`,
    );
    return rows.map((r) => ({
      jenisTanaman: r.komoditas,
      produksiTon: num0(r.nilai),
      tahun: String(r.tahun),
    }));
  }),
);

/**
 * GET /api/v1/hortikultura/rekap-global?tahun=2024
 * Merekap total produksi & luas per 4 subsektor: sayuran, buah, biofarmaka, tanaman_hias
 * Buah & sayur semusim otomatis dipilah ke subsektor Sayuran dan Buah secara global.
 */
hortikulturaRouter.get(
  "/rekap-global",
  route(async (req) => {
    const tahun = req.query.tahun ? Number(req.query.tahun) : null;
    let whereTahun = tahun ? "WHERE tahun = ?" : "WHERE 1=1";
    let params = tahun ? [tahun] : [];

    // 1. Sayuran (Ton)
    const [sayuranProd] = await q(
      `SELECT SUM(nilai) as total_produksi FROM horti_produksi ${whereTahun} AND kelompok = 'sayuran' AND nilai > 0`,
      params,
    );
    const [sayuranLuas] = await q(
      `SELECT SUM(nilai) as total_luas FROM horti_luas ${whereTahun} AND kelompok = 'sayuran' AND nilai > 0`,
      params,
    );

    // 2. Buah-Buahan (Ton) — menggabungkan buah tahunan pohon + buah semusim (melon/semangka)
    const [buahProd] = await q(
      `SELECT SUM(nilai) as total_produksi FROM horti_produksi ${whereTahun} AND kelompok = 'buah_tahunan' AND nilai > 0`,
      params,
    );

    // 3. Biofarmaka (Tangkai / Kg)
    const [bioProd] = await q(
      `SELECT SUM(nilai) as total_produksi FROM horti_produksi ${whereTahun} AND kelompok = 'biofarmaka' AND nilai > 0`,
      params,
    );
    const [bioLuas] = await q(
      `SELECT SUM(nilai) as total_luas FROM horti_luas ${whereTahun} AND kelompok = 'biofarmaka' AND nilai > 0`,
      params,
    );

    // 4. Tanaman Hias (Tangkai)
    const [hiasProd] = await q(
      `SELECT SUM(nilai) as total_produksi FROM horti_produksi ${whereTahun} AND kelompok = 'tanaman_hias' AND nilai > 0`,
      params,
    );
    const [hiasLuas] = await q(
      `SELECT SUM(nilai) as total_luas FROM horti_luas ${whereTahun} AND kelompok = 'tanaman_hias' AND nilai > 0`,
      params,
    );

    return {
      ok: true,
      tahun: tahun || "Semua",
      rekap: {
        sayuran: {
          label: "Sayuran",
          produksi: num0(sayuranProd?.total_produksi),
          satuanProduksi: "Ton",
          luas: num0(sayuranLuas?.total_luas),
          satuanLuas: "Ha",
        },
        buah: {
          label: "Buah-Buahan",
          produksi: num0(buahProd?.total_produksi),
          satuanProduksi: "Ton",
          luas: 0,
          satuanLuas: "Ha",
        },
        biofarmaka: {
          label: "Biofarmaka / Tanaman Obat",
          produksi: num0(bioProd?.total_produksi),
          satuanProduksi: "Tangkai/Kg",
          luas: num0(bioLuas?.total_luas),
          satuanLuas: "m²",
        },
        tanaman_hias: {
          label: "Tanaman Hias",
          produksi: num0(hiasProd?.total_produksi),
          satuanProduksi: "Tangkai",
          luas: num0(hiasLuas?.total_luas),
          satuanLuas: "m²",
        },
      },
    };
  }),
);

/**
 * Gabung luas (m2) + produksi (tangkai) tingkat kabupaten untuk suatu kelompok
 * (tanaman_hias / biofarmaka) menjadi deret long per jenis tanaman × tahun.
 * Bentuk hasil: [{ jenisTanaman, tahun, luas, produksi }]
 */
async function kelompokLuasProduksi(kelompok) {
  const luasRows = await q(
    `SELECT t.komoditas, t.tahun, t.nilai
     FROM horti_luas_kabupaten t WHERE t.kelompok = '${kelompok}'`,
  );
  const prodRows = await q(
    `SELECT t.komoditas, t.tahun, t.nilai
     FROM horti_produksi_kabupaten t WHERE t.kelompok = '${kelompok}'`,
  );
  const luas = new Map(luasRows.map((r) => [`${r.komoditas}|${r.tahun}`, num0(r.nilai)]));
  const prod = new Map(prodRows.map((r) => [`${r.komoditas}|${r.tahun}`, num0(r.nilai)]));
  const keys = new Set([...luas.keys(), ...prod.keys()]);
  return [...keys]
    .map((k) => {
      const [jenisTanaman, tahun] = k.split("|");
      return {
        jenisTanaman,
        tahun: String(tahun),
        luas: luas.get(k) ?? 0,
        produksi: prod.get(k) ?? 0,
      };
    })
    .sort(
      (a, b) =>
        a.jenisTanaman.localeCompare(b.jenisTanaman, "id") ||
        a.tahun.localeCompare(b.tahun, "id"),
    );
}

/** GET /api/v1/hortikultura/tanaman-hias -> [{ jenisTanaman, tahun, luas, produksi }] */
hortikulturaRouter.get(
  "/tanaman-hias",
  route(async () => kelompokLuasProduksi("tanaman_hias")),
);

/** GET /api/v1/hortikultura/biofarmaka -> [{ jenisTanaman, tahun, luas, produksi }] */
hortikulturaRouter.get(
  "/biofarmaka",
  route(async () => kelompokLuasProduksi("biofarmaka")),
);

/** GET /api/v1/hortikultura/sayuran-buah-semusim -> [{ jenisTanaman, tahun, luas, produksi }] */
hortikulturaRouter.get(
  "/sayuran-buah-semusim",
  route(async () => kelompokLuasProduksi("sayuran_buah_semusim")),
);
