// Ketahanan Pangan Router — Harga Pasar Banjarnegara, FSVA Kabupaten & Neraca Komposit
// Single Source of Truth dari MariaDB pertasis (DKPP Kab. Banjarnegara)
import { Router } from "express";
import { q } from "../db.js";
import { route } from "../lib/helpers.js";

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
    const { tahun, pilar } = req.query;
    let where = "WHERE 1=1";
    const params = [];

    if (tahun) {
      where += " AND tahun = ?";
      params.push(Number(tahun));
    }
    if (pilar && pilar !== "all") {
      where += " AND pilar = ?";
      params.push(String(pilar).trim());
    }

    const rows = await q(
      `SELECT id, tahun, pilar, nomor_indikator, nama_indikator,
              satuan, standar_norma, nilai_capaian, status_data, sumber_opd, deskripsi
       FROM fsva_indikator_kabupaten
       ${where}
       ORDER BY pilar ASC, nomor_indikator ASC`,
      params,
    );

    return {
      status: "success",
      total: rows.length,
      rows: rows.map((r) => ({
        id: r.id,
        tahun: r.tahun,
        pilar: r.pilar,
        nomorIndikator: r.nomor_indikator,
        namaIndikator: r.nama_indikator,
        satuan: r.satuan,
        standarNorma: r.standar_norma,
        nilaiCapaian: r.nilai_capaian !== null ? Number(r.nilai_capaian) : null,
        statusData: r.status_data,
        sumberOpd: r.sumber_opd,
        deskripsi: r.deskripsi,
      })),
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
    const { tahun } = req.query;
    let where = "WHERE 1=1";
    const params = [];

    if (tahun) {
      where += " AND tahun = ?";
      params.push(Number(tahun));
    }

    const rows = await q(
      `SELECT id, tahun, komoditas, kategori,
              ketersediaan_bersih_ton, kebutuhan_konsumsi_ton, neraca_ton,
              status_neraca, sumber_data
       FROM neraca_pangan_komposit
       ${where}
       ORDER BY id ASC`,
      params,
    );

    return {
      status: "success",
      total: rows.length,
      rows: rows.map((r) => ({
        id: r.id,
        tahun: r.tahun,
        komoditas: r.komoditas,
        kategori: r.kategori,
        ketersediaanBersihTon: r.ketersediaan_bersih_ton !== null ? Number(r.ketersediaan_bersih_ton) : null,
        kebutuhanKonsumsiTon: r.kebutuhan_konsumsi_ton !== null ? Number(r.kebutuhan_konsumsi_ton) : null,
        neracaTon: r.neraca_ton !== null ? Number(r.neraca_ton) : null,
        statusNeraca: r.status_neraca,
        sumberData: r.sumber_data,
      })),
    };
  }),
);
