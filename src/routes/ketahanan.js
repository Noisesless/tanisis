// Ketahanan Pangan Router — Harga Pasar Banjarnegara, FSVA Kabupaten & Neraca Komposit
// Single Source of Truth dari MariaDB pertasis (DKPP Kab. Banjarnegara)
import { Router } from "express";
import { q } from "../db.js";
import { route, toIntOrNull } from "../lib/helpers.js";

export const ketahananRouter = Router();

/**
 * GET /api/v1/ketahanan/harga-pasar
 * Mengambil data harga harian komoditas pasar tradisional Kabupaten Banjarnegara
 */
ketahananRouter.get(
  "/harga-pasar",
  route(async (req) => {
    const { pasar, komoditas, tanggal } = req.query;
    let where = "WHERE 1=1";
    const params = [];

    if (pasar && pasar !== "all") {
      where += " AND lokasi_pasar = ?";
      params.push(String(pasar).trim());
    }
    if (komoditas && komoditas !== "all") {
      where += " AND komoditas = ?";
      params.push(String(komoditas).trim());
    }
    if (tanggal) {
      where += " AND tanggal = ?";
      params.push(String(tanggal).trim());
    }

    const rows = await q(
      `SELECT id, DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal,
              lokasi_pasar, kecamatan, komoditas, kategori,
              harga, satuan, perubahan_rp, status_pantau, petugas_pencatat
       FROM harga_pasar_banjarnegara
       ${where}
       ORDER BY lokasi_pasar ASC, komoditas ASC`,
      params,
    );

    return {
      status: "success",
      total: rows.length,
      rows: rows.map((r) => ({
        id: r.id,
        tanggal: r.tanggal,
        lokasiPasar: r.lokasi_pasar,
        kecamatan: r.kecamatan,
        komoditas: r.komoditas,
        kategori: r.kategori,
        harga: r.harga ? Number(r.harga) : null,
        satuan: r.satuan,
        perubahanRp: Number(r.perubahan_rp || 0),
        statusPantau: r.status_pantau,
        petugas: r.petugas_pencatat,
      })),
    };
  }),
);

/**
 * GET /api/v1/ketahanan/fsva-kabupaten
 * Mengambil data 12 Indikator FSVA Kerentanan & Ketahanan Pangan Kabupaten Banjarnegara
 */
ketahananRouter.get(
  "/fsva-kabupaten",
  route(async (req) => {
    const { pilar } = req.query;
    const thn = toIntOrNull(req.query.tahun);
    let where = "WHERE 1=1";
    const params = [];

    if (thn !== null) {
      where += " AND tahun = ?";
      params.push(thn);
    }
    if (pilar && pilar !== "all") {
      where += " AND pilar = ?";
      params.push(String(pilar).trim());
    }

    return {
      status: "success",
      total: 0,
      pesan: "Indikator FSVA kabupaten telah dinormalisasi ke tingkat desa (fsva-desa).",
      rows: []
    };
  }),
);

/**
 * GET /api/v1/ketahanan/neraca-komposit
 * Mengambil data Neraca Bahan Makanan (NBM) komposit non-beras Kabupaten Banjarnegara
 */
ketahananRouter.get(
  "/neraca-komposit",
  route(async (req) => {
    // 1. Ambil daftar tahun yang tersedia
    const yearRows = await q(
      `SELECT DISTINCT tahun FROM neraca_pangan_komposit ORDER BY tahun DESC`
    );
    const availableYears = yearRows.map((y) => Number(y.tahun)).filter(Boolean);
    const defaultYear = availableYears.length > 0 ? availableYears[0] : 2024;
    const reqYear = toIntOrNull(req.query.tahun);
    const activeYear = reqYear !== null ? reqYear : defaultYear;

    // 2. Ambil data neraca komposit dari tabel utama
    const rows = await q(
      `SELECT id, tahun, komoditas, kategori,
              ketersediaan_bersih_ton, kebutuhan_konsumsi_ton, neraca_ton,
              status_neraca, sumber_data
       FROM neraca_pangan_komposit
       WHERE tahun = ?
       ORDER BY id ASC`,
      [activeYear],
    );

    // 3. Ambil data referensi panen lokal (Palawija & Ternak) tahun aktif sebagai data pembanding faktual
    const palawijaRows = await q(
      `SELECT komoditas, SUM(produksi_ton) as total_ton
       FROM palawija_produksi
       WHERE tahun = ? AND komoditas IN ('Jagung', 'Kedelai', 'Ubi Kayu')
       GROUP BY komoditas`,
      [activeYear]
    );
    const palawijaMap = {};
    for (const p of palawijaRows) {
      palawijaMap[p.komoditas] = Number(p.total_ton || 0);
    }

    const dagingRows = await q(
      `SELECT jenis, SUM(produksi_kg)/1000 as total_ton
       FROM ternak_daging
       WHERE tahun = ?
       GROUP BY jenis`,
      [activeYear]
    );
    const dagingMap = {};
    for (const d of dagingRows) {
      dagingMap[d.jenis] = Number(d.total_ton || 0);
    }

    const telurRows = await q(
      `SELECT jenis, SUM(produksi_kg)/1000 as total_ton
       FROM ternak_telur
       WHERE tahun = ?
       GROUP BY jenis`,
      [activeYear]
    );
    const telurMap = {};
    for (const t of telurRows) {
      telurMap[t.jenis] = Number(t.total_ton || 0);
    }

    return {
      status: "success",
      tahun: activeYear,
      availableYears: availableYears.length > 0 ? availableYears : [2024],
      total: rows.length,
      rows: rows.map((r) => {
        const kName = r.komoditas || "";
        const satuan = kName.toLowerCase().includes("minyak") ? "Liter" : "Ton";
        let prodLokal = null;

        if (kName === "Jagung") prodLokal = palawijaMap["Jagung"] || null;
        else if (kName.includes("Kedelai")) prodLokal = palawijaMap["Kedelai"] || null;
        else if (kName.includes("Ubi Kayu") || kName.includes("Singkong")) prodLokal = palawijaMap["Ubi Kayu"] || null;
        else if (kName.includes("Sapi")) prodLokal = dagingMap["Sapi"] || null;
        else if (kName.includes("Ayam")) prodLokal = (dagingMap["Ayam Ras Layer"] || 0) + (dagingMap["Ayam Kampung"] || 0) || null;
        else if (kName.includes("Telur")) prodLokal = telurMap["Ayam Ras Layer"] || null;

        return {
          id: r.id,
          tahun: r.tahun,
          komoditas: r.komoditas,
          kategori: r.kategori,
          satuan,
          ketersediaanBersihTon: r.ketersediaan_bersih_ton !== null ? Number(r.ketersediaan_bersih_ton) : null,
          kebutuhanKonsumsiTon: r.kebutuhan_konsumsi_ton !== null ? Number(r.kebutuhan_konsumsi_ton) : null,
          neracaTon: r.neraca_ton !== null ? Number(r.neraca_ton) : null,
          statusNeraca: r.status_neraca || "Menunggu Data",
          produksiLokalTon: prodLokal !== null ? Math.round(prodLokal) : null,
          sumberData: r.sumber_data || "Dinas Ketahanan Pangan & Pertanian Kab. Banjarnegara",
        };
      }),
    };
  }),
);

/**
 * GET /api/v1/ketahanan/fsva-desa
 * Mengambil data 16 indikator FSVA desa (fisik, demografi, rasio, IKP, komposit)
 */
ketahananRouter.get(
  "/fsva-desa",
  route(async (req) => {
    const thn = toIntOrNull(req.query.tahun);
    const { kecamatan, komposit, limit, offset, kecamatan_id, desa_id } = req.query;
    let where = "WHERE 1=1";
    const params = [];

    if (thn !== null) {
      where += " AND tahun = ?";
      params.push(thn);
    }
    if (kecamatan_id) {
      where += " AND kecamatan_id = ?";
      params.push(Number(kecamatan_id));
    }
    if (desa_id) {
      where += " AND desa_id = ?";
      params.push(Number(desa_id));
    }
    if (kecamatan && kecamatan !== "all") {
      where += " AND nama_kecamatan = ?";
      params.push(String(kecamatan).trim());
    }
    if (komposit && komposit !== "all") {
      where += " AND komposit = ?";
      params.push(Number(komposit));
    }

    let pagination = "";
    if (limit) {
      const l = Math.max(1, Math.min(1000, Number(limit) || 278));
      const o = Math.max(0, Number(offset) || 0);
      pagination = ` LIMIT ${l} OFFSET ${o}`;
    }

    const rows = await q(
      `SELECT id, tahun, kecamatan_id, desa_id, kode_kec, nama_kecamatan, kode_desa, nama_desa, object_id,
              luas_wilayah_ha, jumlah_penduduk, jumlah_rt, kepadatan_penduduk,
              luas_lahan_ha, sarpras_pangan_unit, penduduk_miskin_jiwa, tanpa_akses,
              rt_tanpa_air_bersih, jumlah_nakes,
              rasio_lahan, rasio_sarana, rasio_miskin, rasio_air_bersih, rasio_nakes,
              ikp, komposit, ikp_ranking
       FROM fsva_desa_indikator
       ${where}
       ORDER BY tahun DESC, ikp_ranking ASC
       ${pagination}`,
      params,
    );

    return {
      status: "success",
      total: rows.length,
      tahun: thn ?? 2024,
      rows: rows.map((r) => ({
        id: r.id,
        tahun: r.tahun,
        kecamatanId: r.kecamatan_id,
        desaId: r.desa_id,
        kodeKec: r.kode_kec,
        kecamatan: r.nama_kecamatan,
        kodeDesa: r.kode_desa,
        desa: r.nama_desa,
        objectId: r.object_id,
        // Data Fisik & Demografi
        luasWilayahHa: r.luas_wilayah_ha !== null ? Number(r.luas_wilayah_ha) : null,
        jumlahPenduduk: r.jumlah_penduduk !== null ? Number(r.jumlah_penduduk) : null,
        jumlahRt: r.jumlah_rt !== null ? Number(r.jumlah_rt) : null,
        kepadatanPenduduk: r.kepadatan_penduduk !== null ? Number(r.kepadatan_penduduk) : null,
        luasLahanHa: r.luas_lahan_ha !== null ? Number(r.luas_lahan_ha) : null,
        sarprasUnit: r.sarpras_pangan_unit !== null ? Number(r.sarpras_pangan_unit) : null,
        miskinJiwa: r.penduduk_miskin_jiwa !== null ? Number(r.penduduk_miskin_jiwa) : null,
        tanpaAkses: Number(r.tanpa_akses || 0),
        rtTanpaAirBersih: r.rt_tanpa_air_bersih !== null ? Number(r.rt_tanpa_air_bersih) : null,
        jumlahNakes: r.jumlah_nakes !== null ? Number(r.jumlah_nakes) : null,
        // Rasio FSVA
        rasioLahan: r.rasio_lahan !== null ? Number(r.rasio_lahan) : null,
        rasioSarana: r.rasio_sarana !== null ? Number(r.rasio_sarana) : null,
        rasioMiskin: r.rasio_miskin !== null ? Number(r.rasio_miskin) : null,
        rasioAirBersih: r.rasio_air_bersih !== null ? Number(r.rasio_air_bersih) : null,
        rasioNakes: r.rasio_nakes !== null ? Number(r.rasio_nakes) : null,
        // IKP & Komposit
        ikp: r.ikp !== null ? Number(r.ikp) : null,
        komposit: r.komposit !== null ? Number(r.komposit) : null,
        ikpRanking: r.ikp_ranking !== null ? Number(r.ikp_ranking) : null,
      })),
    };
  }),
);

/**
 * GET /api/v1/ketahanan/fsva-desa/ringkasan
 * Ringkasan agregat FSVA kabupaten (rata-rata IKP, total lahan, total miskin, sebaran prioritas)
 */
ketahananRouter.get(
  "/fsva-desa/ringkasan",
  route(async (req) => {
    const thn = toIntOrNull(req.query.tahun) ?? 2024;
    const [stat] = await q(
      `SELECT COUNT(*) AS total_desa,
              ROUND(AVG(ikp), 2) AS rata_ikp,
              ROUND(MIN(ikp), 2) AS min_ikp,
              ROUND(MAX(ikp), 2) AS max_ikp,
              ROUND(SUM(luas_lahan_ha), 2) AS total_lahan_ha,
              SUM(penduduk_miskin_jiwa) AS total_miskin_jiwa,
              SUM(sarpras_pangan_unit) AS total_sarpras_unit,
              SUM(jumlah_penduduk) AS total_penduduk,
              SUM(rt_tanpa_air_bersih) AS total_rt_tanpa_air
       FROM fsva_desa_indikator
       WHERE tahun = ?`,
      [thn],
    );

    const sebaran = await q(
      `SELECT komposit, COUNT(*) AS jumlah
       FROM fsva_desa_indikator
       WHERE tahun = ?
       GROUP BY komposit
       ORDER BY komposit ASC`,
      [thn],
    );

    return {
      status: "success",
      tahun: thn,
      ringkasan: stat,
      sebaranKomposit: sebaran,
    };
  }),
);

