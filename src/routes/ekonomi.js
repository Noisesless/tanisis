// Ekonomi — /api/v1/ekonomi/*  & Lumbung — /api/v1/lumbung
// Replika fetchInflationData, fetchMarketData, fetchLumbungPangan.
import { Router } from "express";
import { q } from "../db.js";
import { route } from "../lib/helpers.js";

export const ekonomiRouter = Router();
export const lumbungRouter = Router();

const num0 = (v) => (v === null || v === undefined ? 0 : Number(v));

/** GET /api/v1/ekonomi/inflasi -> InflationData[] */
ekonomiRouter.get(
  "/inflasi",
  route(async () => {
    const rows = await q("SELECT wilayah, inflasi_pct, tahun FROM inflasi ORDER BY wilayah, tahun");
    return rows.map((r) => ({
      pembanding: r.wilayah,
      inflasi: num0(r.inflasi_pct),
      tahun: String(r.tahun),
    }));
  }),
);

/** GET /api/v1/ekonomi/pasar -> MarketData[] */
ekonomiRouter.get(
  "/pasar",
  route(async () => {
    const rows = await q("SELECT jenis, jumlah, tahun FROM pasar ORDER BY jenis, tahun");
    return rows.map((r) => ({
      jenis: r.jenis,
      jumlah: Number(r.jumlah),
      tahun: String(r.tahun),
    }));
  }),
);

/** GET /api/v1/ekonomi/harga-kabupaten -> data harga produsen resmi kabupaten */
ekonomiRouter.get(
  "/harga-kabupaten",
  route(async (req) => {
    const { sektor, tahun } = req.query;
    let where = "WHERE 1=1";
    const params = [];
    if (sektor) {
      where += " AND sektor = ?";
      params.push(String(sektor).toLowerCase());
    }
    if (tahun) {
      where += " AND tahun = ?";
      params.push(Number(tahun));
    }
    const rows = await q(
      `SELECT id, sektor, komoditas, satuan, harga_per_satuan, tahun, sumber, created_at
       FROM harga_produsen
       ${where}
       ORDER BY sektor ASC, komoditas ASC`,
      params,
    );
    return {
      status: "success",
      total: rows.length,
      rows: rows.map((r) => ({
        id: r.id,
        sektor: r.sektor,
        komoditas: r.komoditas,
        satuan: r.satuan,
        hargaPerSatuan: Number(r.harga_per_satuan),
        tahun: Number(r.tahun),
        sumber: r.sumber,
      })),
    };
  }),
);

/** GET /api/v1/ekonomi/nilai-ekonomi?bidang=pangan -> data resmi nilai ekonomi
 *  input Dinas (tabel nilai_ekonomi_tahunan). Hanya menampilkan data dari produksi (nilai_rp > 0 & volume > 0). */
ekonomiRouter.get(
  "/nilai-ekonomi",
  route(async (req) => {
    const VALID = ["pangan", "hortikultura", "perkebunan", "peternakan", "perikanan"];
    const bidang = String(req.query.bidang ?? "").toLowerCase();
    if (!VALID.includes(bidang)) {
      const err = new Error(`Parameter 'bidang' wajib salah satu dari: ${VALID.join(", ")}`);
      err.status = 400;
      throw err;
    }
    const rows = await q(
      `SELECT komoditas, satuan, tahun, triwulan, volume,
              harga_produsen AS hargaProdusen, nilai_rp AS nilaiRp
         FROM nilai_ekonomi_tahunan
        WHERE bidang = ? AND volume > 0 AND nilai_rp > 0
        ORDER BY tahun DESC, nilai_rp DESC`,
      [bidang],
    );
    return {
      bidang,
      sumber: rows.length > 0 ? "resmi" : "kosong",
      jumlah: rows.length,
      rows,
    };
  }),
);

/** GET /api/v1/ekonomi/sektor-ringkasan?sektor=hortikultura&tahun=2024
 *  Mengembalikan Top Komoditas Utama & Estimasi Nilai Ekonomi riil per sektor & tahun.
 *  Zero Dummy Data: jika data tidak ada, kembalikan status empty (tanpa mock array). */
ekonomiRouter.get(
  "/sektor-ringkasan",
  route(async (req) => {
    const VALID = ["pangan", "hortikultura", "perkebunan", "peternakan", "perikanan"];
    const sektor = String(req.query.sektor ?? "").toLowerCase();
    if (!VALID.includes(sektor)) {
      const err = new Error(`Parameter 'sektor' wajib salah satu dari: ${VALID.join(", ")}`);
      err.status = 400;
      throw err;
    }

    // Tentukan tahun & ambil daftar komoditas utama
    let tahun = req.query.tahun ? Number(req.query.tahun) : null;
    let items = [];

    if (sektor === "perikanan") {
      if (!tahun || isNaN(tahun)) {
        const [latest] = await q("SELECT MAX(tahun) AS maxTahun FROM ikan_produksi_jenis WHERE produksi_kg > 0");
        tahun = latest?.maxTahun ? Number(latest.maxTahun) : 2025;
      }
      items = await q(
        `SELECT jenis_ikan AS komoditas,
                'Ton' AS satuan,
                COALESCE(nama_kecamatan, 'Kabupaten Banjarnegara') AS kecamatanSentra,
                ROUND(produksi_kg / 1000, 2) AS volumeProduksi,
                nilai_ekonomi_rp AS nilaiEkonomiRp,
                tahun
           FROM ikan_produksi_jenis
          WHERE tahun = ? AND produksi_kg > 0
          ORDER BY produksi_kg DESC`,
        [tahun],
      );
    } else {
      if (!tahun || isNaN(tahun)) {
        const [latest] = await q(
          "SELECT MAX(tahun) AS maxTahun FROM komoditas_unggulan WHERE sektor = ?",
          [sektor],
        );
        tahun = latest?.maxTahun ? Number(latest.maxTahun) : 2024;
      }
      items = await q(
        `SELECT nama_komoditas AS komoditas,
                satuan,
                kecamatan_sentra AS kecamatanSentra,
                total_produksi AS volumeProduksi,
                nilai_ekonomi_estimasi AS nilaiEkonomiRp,
                tahun
           FROM komoditas_unggulan
          WHERE sektor = ? AND tahun = ? AND total_produksi > 0
          ORDER BY total_produksi DESC`,
        [sektor, tahun],
      );
    }

    // Ambil total nilai ekonomi dari nilai_ekonomi_tahunan (jika diinput resmi)
    const [resmiTotal] = await q(
      `SELECT SUM(nilai_rp) AS totalRp
         FROM nilai_ekonomi_tahunan
        WHERE bidang = ? AND tahun = ?`,
      [sektor, tahun],
    );

    // Jika nilai_ekonomi_tahunan ada, gunakan total tersebut.
    // Jika tidak, jumlahkan dari nilai_ekonomi_estimasi di komoditas_unggulan.
    let totalNilaiRp = num0(resmiTotal?.totalRp);
    if (!totalNilaiRp && items.length > 0) {
      totalNilaiRp = items.reduce((acc, it) => acc + num0(it.nilaiEkonomiRp), 0);
    }

    // Handle kondisi kosong (Zero Dummy Data Law)
    if (items.length === 0) {
      return {
        status: "empty",
        sektor,
        tahun,
        message: `Belum ada data komoditas utama dan nilai ekonomi untuk tahun ${tahun}.`,
        top1: null,
        items: [],
        totalNilaiEkonomiRp: 0,
        jumlahKomoditas: 0,
      };
    }

    return {
      status: "success",
      sektor,
      tahun,
      top1: items[0] || null,
      items,
      totalNilaiEkonomiRp: totalNilaiRp,
      jumlahKomoditas: items.length,
    };
  }),
);

/** GET /api/v1/lumbung -> LumbungPangan[] (data tahun TERBARU per kecamatan) */
lumbungRouter.get(
  "/",
  route(async () => {
    const rows = await q(
      `SELECT x.kecamatan, x.tahun, x.lumbung_unit, x.lumbung_kapasitas_ton, x.gudang_luas_m2, x.gudang_kapasitas_ton_bulan
       FROM (
         SELECT k.nama AS kecamatan, l.tahun, l.lumbung_unit, l.lumbung_kapasitas_ton,
                l.gudang_luas_m2, l.gudang_kapasitas_ton_bulan,
                ROW_NUMBER() OVER (PARTITION BY l.kecamatan_id ORDER BY l.tahun DESC, l.id DESC) AS rn
         FROM lumbung_pangan l JOIN kecamatan k ON k.id = l.kecamatan_id
       ) x
       WHERE x.rn = 1
       ORDER BY x.kecamatan`,
    );
    return rows.map((r) => ({
      kecamatan: r.kecamatan,
      lumbungPangan: Number(r.lumbung_unit),
      kapasitasLumbung: num0(r.lumbung_kapasitas_ton),
      luasGudang: num0(r.gudang_luas_m2),
      kapasitasGudang: num0(r.gudang_kapasitas_ton_bulan),
      tahun: Number(r.tahun),
    }));
  }),
);
