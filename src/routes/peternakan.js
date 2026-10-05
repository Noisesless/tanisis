// Peternakan — /api/v1/peternakan/*
// Replika fetchTernakKecil/Besar/Unggas, fetchPemasukanTernak, fetchPengeluaranTernak,
// fetchLuarRPH, fetchDagingUnggas (semua bentuk TernakFlow memakai items + label fix).
import { Router } from "express";
import { q } from "../db.js";
import { route, pivotLong } from "../lib/helpers.js";

export const peternakanRouter = Router();

const num0 = (v) => (v === null || v === undefined ? 0 : Number(v));

const POPULASI_MAPS = {
  kecil: new Map([
    ["Kambing", "kambing"],
    ["Domba", "domba"],
    ["Domba Batur", "dombaBatur"],
    ["Babi", "babi"],
    ["Kelinci", "kelinci"],
  ]),
  besar: new Map([
    ["Sapi Perah", "sapiPerah"],
    ["Sapi", "sapi"],
    ["Kerbau", "kerbau"],
    ["Kuda", "kuda"],
  ]),
  unggas: new Map([
    ["Ayam Kampung", "ayamKampung"],
    ["Ayam Ras Layer", "ayamRasLayer"],
    ["Ayam Broiler", "ayamBroiler"],
    ["Itik Biasa", "itikBiasa"],
    ["Itik Manila", "itikManila"],
  ]),
};

for (const kelompok of Object.keys(POPULASI_MAPS)) {
  peternakanRouter.get(
    `/${kelompok}`,
    route(async () => {
      const rows = await q(
        `SELECT k.nama AS kecamatan, t.tahun, t.jenis, t.jumlah_ekor AS nilai
         FROM ternak_populasi t JOIN kecamatan k ON k.id = t.kecamatan_id
         WHERE t.kelompok = ? ORDER BY k.nama, t.tahun`,
        [kelompok],
      );
      const map = POPULASI_MAPS[kelompok];
      return pivotLong(
        rows,
        (r) => {
          const f = map.get(r.jenis);
          return f ? [f, num0(r.nilai)] : null;
        },
        // pastikan semua field hadir (default 0) seperti kolom CSV yang selalu ada
        (r) => Object.fromEntries([...map.values()].map((f) => [f, 0])),
      );
    }),
  );
}

/** Label TernakFlow lalu-lintas ternak — urutan & nama persis seperti frontend.
 *  Kolom sumber "Sapi" ditampilkan sebagai "Sapi Potong". */
const FLOW_LABELS = ["Sapi Perah", "Sapi Potong", "Kerbau", "Kuda", "Kambing", "Domba"];
const FLOW_DB_TO_LABEL = { "Sapi Perah": "Sapi Perah", Sapi: "Sapi Potong", Kerbau: "Kerbau", Kuda: "Kuda", Kambing: "Kambing", Domba: "Domba" };

const RPH_LABELS = ["Sapi", "Kerbau", "Babi", "Kambing", "Domba"];
const UNGGAS_LABELS = ["Ayam Ras Layer", "Ayam Broiler", "Ayam Kampung", "Itik", "Puyuh"];

async function ternakFlow({ table, where, params, labels, dbToLabel, valueCol, unit }) {
  const rows = await q(
    `SELECT k.nama AS kecamatan, t.tahun, t.jenis, t.${valueCol} AS nilai
     FROM ${table} t JOIN kecamatan k ON k.id = t.kecamatan_id
     ${where} ORDER BY k.nama, t.tahun`,
    params,
  );
  const byKey = new Map();
  for (const r of rows) {
    const key = `${r.kecamatan}|${r.tahun}`;
    if (!byKey.has(key)) byKey.set(key, { kecamatan: r.kecamatan, tahun: String(r.tahun), values: {} });
    const label = dbToLabel ? dbToLabel[r.jenis] : r.jenis;
    byKey.get(key).values[label] = num0(r.nilai);
  }
  return [...byKey.values()]
    .map((r) => ({
      kecamatan: r.kecamatan,
      tahun: r.tahun,
      unit,
      items: labels.map((label) => ({ jenis: label, jumlah: r.values[label] ?? 0 })),
    }))
    .sort((a, b) =>
      a.kecamatan === b.kecamatan
        ? parseInt(a.tahun) - parseInt(b.tahun)
        : a.kecamatan.localeCompare(b.kecamatan),
    );
}

/** GET /api/v1/peternakan/pemasukan -> TernakFlow[] */
peternakanRouter.get(
  "/pemasukan",
  route(() => ternakFlow({ table: "ternak_flow", where: "WHERE t.arah = ?", params: ["pemasukan"], labels: FLOW_LABELS, dbToLabel: FLOW_DB_TO_LABEL, valueCol: "jumlah_ekor", unit: "ekor" })),
);

/** GET /api/v1/peternakan/pengeluaran -> TernakFlow[] (Sapi Perah & Kuda nihil di sumber -> 0) */
peternakanRouter.get(
  "/pengeluaran",
  route(() => ternakFlow({ table: "ternak_flow", where: "WHERE t.arah = ?", params: ["pengeluaran"], labels: FLOW_LABELS, dbToLabel: FLOW_DB_TO_LABEL, valueCol: "jumlah_ekor", unit: "ekor" })),
);

/** GET /api/v1/peternakan/luar-rph -> TernakFlow[] (ekor) */
peternakanRouter.get(
  "/luar-rph",
  route(() => ternakFlow({ table: "ternak_pemotongan", where: "WHERE t.lokasi = ?", params: ["luar_rph"], labels: RPH_LABELS, valueCol: "jumlah_ekor", unit: "ekor" })),
);

/** GET /api/v1/peternakan/rph-pemerintah -> TernakFlow[] (ekor) - pemotongan RESMI di RPH Pemerintah.
 *  Sumber: ternak_pemotongan lokasi='rph_pemerintah' (importer: "Jumlah Ternak yang Dipotong di RPH Pemerintah").
 *  Notulen Distankan KP 21 Sep 2026 - Submenu 4 Peternakan: "Lalu Lintas Ternak & Produksi Daging + RPH (resmi)". */
const RPH_PEMERINTAH_LABELS = ["Sapi", "Kerbau", "Kuda", "Babi", "Kambing", "Domba"];
peternakanRouter.get(
  "/rph-pemerintah",
  route(() => ternakFlow({ table: "ternak_pemotongan", where: "WHERE t.lokasi = ?", params: ["rph_pemerintah"], labels: RPH_PEMERINTAH_LABELS, valueCol: "jumlah_ekor", unit: "ekor" })),
);

/** GET /api/v1/peternakan/daging-unggas -> TernakFlow[] (kg) */
peternakanRouter.get(
  "/daging-unggas",
  route(() => ternakFlow({ table: "ternak_daging", where: "WHERE t.kelompok = ?", params: ["unggas"], labels: UNGGAS_LABELS, valueCol: "produksi_kg", unit: "kg" })),
);

/** GET /api/v1/peternakan/susu-kulit -> TernakFlow[] (produksi kulit terpilah per jenis hewan, susu, wol & hasil ikutan).
 *  Dipisahkan secara tegas: Kulit Sapi, Kulit Kerbau, Kulit Kambing, Kulit Domba, Kulit Kelinci, Susu Sapi Segar, Susu Kambing, Wol Domba Batur, Tulang & Tanduk. */
const KULIT_SUSU_LABELS = [
  "Kulit Sapi", "Kulit Kerbau", "Kulit Kambing", "Kulit Domba", "Kulit Kelinci",
  "Susu Sapi Segar", "Susu Kambing", "Wol Domba Batur", "Tulang & Tanduk"
];
peternakanRouter.get(
  "/susu-kulit",
  route(() =>
    ternakFlow({
      table: "ternak_susu_kulit",
      where: "",
      params: [],
      labels: KULIT_SUSU_LABELS,
      valueCol: "nilai",
      unit: "lembar / liter / kg",
    }),
  ),
);

/** GET /api/v1/peternakan/daging -> TernakFlow[] (kg) — daging ternak besar & kecil
 *  (Sapi, Kerbau, Kambing, Domba, Babi, Kelinci). Daging unggas lihat /daging-unggas.
 *  CATATAN: Domba Batur TIDAK dicatat sebagai komoditas daging karena merupakan ternak hias / bibit yang dipasarkan per ekor hidup. */
const DAGING_TERNAK_LABELS = ["Sapi", "Kerbau", "Kambing", "Domba", "Babi", "Kelinci"];
peternakanRouter.get(
  "/daging",
  route(() => ternakFlow({ table: "ternak_daging", where: "WHERE t.kelompok = ?", params: ["ternak"], labels: DAGING_TERNAK_LABELS, valueCol: "produksi_kg", unit: "kg" })),
);

/** GET /api/v1/peternakan/domba-batur -> data populasi Domba Batur (ternak hias & bibit ekor) */
peternakanRouter.get(
  "/domba-batur",
  route(async (req) => {
    const { tahun } = req.query;
    let sql = `
      SELECT k.nama AS kecamatan, t.tahun, t.jumlah_ekor AS ekor
      FROM ternak_populasi t
      JOIN kecamatan k ON k.id = t.kecamatan_id
      WHERE (t.jenis = 'Domba Batur' OR (t.jenis = 'Domba' AND k.nama IN ('Batur', 'Pejawaran', 'Wanayasa', 'Kalibening', 'Karangkobar')))
    `;
    const params = [];
    if (tahun) {
      sql += ` AND t.tahun = ?`;
      params.push(Number(tahun));
    }
    sql += ` ORDER BY t.tahun DESC, t.jumlah_ekor DESC`;
    const rows = await q(sql, params);
    return {
      ok: true,
      komoditas: "Domba Batur (Khas Banjarnegara)",
      kategori: "Ternak Hias & Bibit Unggul (Jual Ekor)",
      satuan: "ekor",
      items: rows,
    };
  }),
);

/** GET /api/v1/peternakan/telur -> TernakFlow[] (butir/kg) — telur ayam kampung, ras layer, itik & puyuh. */
const TELUR_LABELS = ["Ayam Ras Layer", "Ayam Kampung", "Itik", "Puyuh"];
peternakanRouter.get(
  "/telur",
  route(() => ternakFlow({ table: "ternak_telur", where: "", params: [], labels: TELUR_LABELS, valueCol: "produksi_kg", unit: "butir" })),
);

/** GET /api/v1/peternakan/hpt -> data lahan hijauan pakan ternak */
peternakanRouter.get(
  "/hpt",
  route(async (req) => {
    const { tahun, kecamatan_id } = req.query;
    let where = "WHERE 1=1";
    const params = [];
    if (tahun) { where += " AND h.tahun = ?"; params.push(Number(tahun)); }
    if (kecamatan_id) { where += " AND h.kecamatan_id = ?"; params.push(Number(kecamatan_id)); }
    return q(
      `SELECT h.*, k.nama AS kecamatan 
       FROM ternak_hpt h JOIN kecamatan k ON k.id = h.kecamatan_id 
       ${where} ORDER BY h.tahun DESC, k.nama ASC`,
      params,
    );
  }),
);

/** GET /api/v1/peternakan/umkm-pakan -> direktori UMKM pakan ternak mandiri */
peternakanRouter.get(
  "/umkm-pakan",
  route(async (req) => {
    const { tahun, kecamatan_id } = req.query;
    let where = "WHERE 1=1";
    const params = [];
    if (tahun) { where += " AND u.tahun = ?"; params.push(Number(tahun)); }
    if (kecamatan_id) { where += " AND u.kecamatan_id = ?"; params.push(Number(kecamatan_id)); }
    return q(
      `SELECT u.*, k.nama AS kecamatan 
       FROM ternak_umkm_pakan u JOIN kecamatan k ON k.id = u.kecamatan_id 
       ${where} ORDER BY u.tahun DESC, k.nama ASC`,
      params,
    );
  }),
);

/** GET /api/v1/peternakan/poultry-shop -> sebaran toko peternakan / poultry shop */
peternakanRouter.get(
  "/poultry-shop",
  route(async (req) => {
    const { tahun, kecamatan_id } = req.query;
    let where = "WHERE 1=1";
    const params = [];
    if (tahun) { where += " AND p.tahun = ?"; params.push(Number(tahun)); }
    if (kecamatan_id) { where += " AND p.kecamatan_id = ?"; params.push(Number(kecamatan_id)); }
    return q(
      `SELECT p.*, k.nama AS kecamatan 
       FROM ternak_poultry_shop p JOIN kecamatan k ON k.id = p.kecamatan_id 
       ${where} ORDER BY p.tahun DESC, k.nama ASC`,
      params,
    );
  }),
);

/** GET /api/v1/peternakan/nkv -> unit usaha bersertifikat Nomor Kontrol Veteriner (NKV) */
peternakanRouter.get(
  "/nkv",
  route(async (req) => {
    const { tahun, kecamatan_id } = req.query;
    let where = "WHERE 1=1";
    const params = [];
    if (tahun) { where += " AND n.tahun = ?"; params.push(Number(tahun)); }
    if (kecamatan_id) { where += " AND n.kecamatan_id = ?"; params.push(Number(kecamatan_id)); }
    return q(
      `SELECT n.*, k.nama AS kecamatan 
       FROM ternak_nkv n JOIN kecamatan k ON k.id = n.kecamatan_id 
       ${where} ORDER BY n.tahun DESC, k.nama ASC`,
      params,
    );
  }),
);

/** POST /api/v1/peternakan/entry -> Endpoint entry manual bagian peternakan yang kosong */
peternakanRouter.post(
  "/entry",
  route(async (req) => {
    const { kategori, kecamatan, tahun, bulan, nama, jenis, jumlah, nilai, satuan, catatan, alamat, kontak, koordinat, nomor_nkv, status } = req.body || {};
    if (!kategori) throw Object.assign(new Error("Kategori entry wajib ditentukan (populasi, hpt, umkm_pakan, poultry_shop, nkv, susu_kulit, daging, telur)."), { status: 400 });
    if (!kecamatan) throw Object.assign(new Error("Kecamatan wajib diisi."), { status: 400 });

    // Cari ID kecamatan
    const kecRows = await q("SELECT id FROM kecamatan WHERE LOWER(nama) = LOWER(?) LIMIT 1", [kecamatan.trim()]);
    if (kecRows.length === 0) throw Object.assign(new Error(`Kecamatan '${kecamatan}' tidak ditemukan di Banjarnegara.`), { status: 400 });
    const kecId = kecRows[0].id;
    const thn = Number(tahun) || new Date().getFullYear();

    if (kategori === "hpt") {
      const jns = jenis || "Rumput Odot";
      const luas = Number(jumlah || nilai || 0);
      const prod = Number(req.body.produksi || 0);
      const st = Number(req.body.kapasitas_st || (luas * 100 / 12));
      await q(
        `INSERT INTO ternak_hpt (kecamatan_id, tahun, bulan, jenis_hijauan, luas_ha, produksi_ton, kapasitas_st, catatan, sumber)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'manual')`,
        [kecId, thn, bulan || null, jns, luas, prod, st, catatan || null],
      );
      return { ok: true, message: `Data Lahan HPT ${jns} di Kec. ${kecamatan} berhasil disimpan.` };
    }

    if (kategori === "umkm_pakan") {
      const nm = nama || "Kelompok Tani Pakan";
      const jns = jenis || "Silase Tebon Jagung";
      const kap = Number(jumlah || nilai || 0);
      await q(
        `INSERT INTO ternak_umkm_pakan (kecamatan_id, tahun, bulan, nama_usaha, jenis_pakan, kapasitas_ton_bulan, alamat, kontak, catatan, sumber)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual')`,
        [kecId, thn, bulan || null, nm, jns, kap, alamat || null, kontak || null, catatan || null],
      );
      return { ok: true, message: `Data UMKM Pakan '${nm}' di Kec. ${kecamatan} berhasil disimpan.` };
    }

    if (kategori === "poultry_shop") {
      const nm = nama || "Toko Sapronak";
      const lyn = jenis || req.body.layanan || "Pakan, Obat & Sapronak";
      await q(
        `INSERT INTO ternak_poultry_shop (kecamatan_id, tahun, bulan, nama_toko, alamat, jenis_layanan, koordinat, kontak, catatan, sumber)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual')`,
        [kecId, thn, bulan || null, nm, alamat || null, lyn, koordinat || null, kontak || null, catatan || null],
      );
      return { ok: true, message: `Data Toko Peternakan '${nm}' di Kec. ${kecamatan} berhasil disimpan.` };
    }

    if (kategori === "nkv") {
      const nm = nama || "Unit Usaha Produk Hewan";
      const noNkv = nomor_nkv || "Dalam Proses";
      const kat = jenis || req.body.kategori_usaha || "RPH / Kios Produk Hewan";
      const stat = status || "Registrasi";
      await q(
        `INSERT INTO ternak_nkv (kecamatan_id, tahun, bulan, nama_unit_usaha, nomor_nkv, kategori, status_verifikasi, catatan, sumber)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'manual')`,
        [kecId, thn, bulan || null, nm, noNkv, kat, stat, catatan || null],
      );
      return { ok: true, message: `Data Sertifikasi NKV '${nm}' di Kec. ${kecamatan} berhasil disimpan.` };
    }

    if (kategori === "susu_kulit") {
      const jns = jenis || "Kulit Sapi";
      const val = Number(jumlah || nilai || 0);
      await q(
        `INSERT INTO ternak_susu_kulit (kecamatan_id, jenis, tahun, nilai, catatan, sumber)
         VALUES (?, ?, ?, ?, ?, 'manual')
         ON DUPLICATE KEY UPDATE nilai = VALUES(nilai), catatan = VALUES(catatan)`,
        [kecId, jns, thn, val, catatan || null],
      );
      return { ok: true, message: `Data ${jns} di Kec. ${kecamatan} berhasil disimpan (${val} ${satuan || "lembar/liter"}).` };
    }

    if (kategori === "daging") {
      const jns = jenis || "Sapi";
      const klp = ["Ayam Ras Layer", "Ayam Broiler", "Ayam Kampung", "Itik", "Puyuh"].includes(jns) ? "unggas" : "ternak";
      const val = Number(jumlah || nilai || 0);
      await q(
        `INSERT INTO ternak_daging (kecamatan_id, kelompok, jenis, tahun, produksi_kg, sumber)
         VALUES (?, ?, ?, ?, ?, 'manual')
         ON DUPLICATE KEY UPDATE produksi_kg = VALUES(produksi_kg)`,
        [kecId, klp, jns, thn, val],
      );
      return { ok: true, message: `Data Produksi Daging ${jns} di Kec. ${kecamatan} berhasil disimpan (${val} kg).` };
    }

    if (kategori === "telur") {
      const jns = jenis || "Ayam Ras Layer";
      const val = Number(jumlah || nilai || 0);
      await q(
        `INSERT INTO ternak_telur (kecamatan_id, jenis, tahun, produksi_kg, sumber)
         VALUES (?, ?, ?, ?, 'manual')
         ON DUPLICATE KEY UPDATE produksi_kg = VALUES(produksi_kg)`,
        [kecId, jns, thn, val],
      );
      return { ok: true, message: `Data Produksi Telur ${jns} di Kec. ${kecamatan} berhasil disimpan (${val} butir).` };
    }

    if (kategori === "populasi") {
      const jns = jenis || "Domba Batur";
      const klp = ["Sapi", "Sapi Potong", "Sapi Perah", "Kerbau", "Kuda"].includes(jns) ? "besar" : ["Ayam Kampung", "Ayam Broiler", "Ayam Ras Layer", "Itik Biasa", "Itik Manila", "Burung Puyuh"].includes(jns) ? "unggas" : "kecil";
      const val = Number(jumlah || nilai || 0);
      await q(
        `INSERT INTO ternak_populasi (kecamatan_id, kelompok, jenis, tahun, jumlah_ekor, sumber)
         VALUES (?, ?, ?, ?, ?, 'manual')
         ON DUPLICATE KEY UPDATE jumlah_ekor = VALUES(jumlah_ekor)`,
        [kecId, klp, jns, thn, val],
      );
      return { ok: true, message: `Data Populasi ${jns} di Kec. ${kecamatan} berhasil disimpan (${val} ekor).` };
    }

    throw Object.assign(new Error(`Kategori '${kategori}' belum didukung.`), { status: 400 });
  }),
);


