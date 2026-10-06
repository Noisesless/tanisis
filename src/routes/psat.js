// PSAT-PDUK Router — Keamanan Pangan Segar Asal Tumbuhan & Uji Petik Acak Pasar
// Pengawasan Keamanan Pangan & Registrasi Izin Edar OKKPD Distankan KP Kab. Banjarnegara
import { Router } from "express";
import { q } from "../db.js";
import { route } from "../lib/helpers.js";

export const psatRouter = Router();

/**
 * GET /api/v1/psat-pduk
 * Query parameters:
 * - kecamatan: filter per kecamatan
 * - pasar: filter nama pasar
 * - komoditas: filter per komoditas
 * - hasil: filter hasil uji (Memenuhi Syarat (Aman), Tidak Memenuhi Syarat, Dalam Pengujian)
 * - q: text search (lokasi_pasar, nama_pedagang, komoditas, no_registrasi)
 */
psatRouter.get(
  "/",
  route(async (req) => {
    const { kecamatan, pasar, komoditas, hasil, q: search } = req.query;
    let where = "WHERE 1=1";
    const params = [];

    if (kecamatan && kecamatan !== "all") {
      where += " AND kecamatan = ?";
      params.push(String(kecamatan).trim());
    }
    if (pasar && pasar !== "all") {
      where += " AND lokasi_pasar LIKE ?";
      params.push(`%${String(pasar).trim()}%`);
    }
    if (komoditas && komoditas !== "all") {
      where += " AND komoditas = ?";
      params.push(String(komoditas).trim());
    }
    if (hasil && hasil !== "all") {
      where += " AND hasil_uji = ?";
      params.push(String(hasil).trim());
    }
    if (search) {
      where += " AND (lokasi_pasar LIKE ? OR nama_pedagang LIKE ? OR komoditas LIKE ? OR no_registrasi LIKE ?)";
      const term = `%${String(search).trim()}%`;
      params.push(term, term, term, term);
    }

    const rows = await q(
      `SELECT id, DATE_FORMAT(tanggal_uji, '%Y-%m-%d') AS tanggal_uji,
              lokasi_pasar, nama_pedagang, komoditas, kecamatan,
              parameter_uji, hasil_uji, no_registrasi, status, keterangan, created_at
       FROM psat_pduk
       ${where}
       ORDER BY tanggal_uji DESC, id DESC`,
      params,
    );

    return {
      status: "success",
      total: rows.length,
      rows: rows.map((r) => ({
        id: r.id,
        tanggal_uji: r.tanggal_uji || "-",
        tanggalUji: r.tanggal_uji || "-",
        lokasi_pasar: r.lokasi_pasar,
        lokasiPasar: r.lokasi_pasar,
        nama_pedagang: r.nama_pedagang,
        namaPedagang: r.nama_pedagang,
        komoditas: r.komoditas,
        kecamatan: r.kecamatan,
        parameter_uji: r.parameter_uji || "Residu Pestisida & Bahan Berbahaya",
        parameterUji: r.parameter_uji || "Residu Pestisida & Bahan Berbahaya",
        hasil_uji: r.hasil_uji,
        hasilUji: r.hasil_uji,
        no_registrasi: r.no_registrasi || "-",
        noRegistrasi: r.no_registrasi || "-",
        status: r.status,
        keterangan: r.keterangan || "-",
      })),
    };
  }),
);

/**
 * POST /api/v1/psat-pduk
 * Input data hasil uji petik pasar / registrasi PSAT-PDUK
 */
psatRouter.post(
  "/",
  route(async (req) => {
    const {
      tanggalUji,
      lokasiPasar,
      namaPedagang,
      komoditas,
      kecamatan,
      parameterUji,
      hasilUji,
      noRegistrasi,
      status,
      keterangan,
    } = req.body;

    if (!lokasiPasar || !namaPedagang || !komoditas || !kecamatan) {
      const err = new Error("Data wajib: lokasiPasar, namaPedagang, komoditas, kecamatan");
      err.status = 400;
      throw err;
    }

    const res = await q(
      `INSERT INTO psat_pduk (tanggal_uji, lokasi_pasar, nama_pedagang, komoditas, kecamatan, parameter_uji, hasil_uji, no_registrasi, status, keterangan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tanggalUji || null,
        lokasiPasar,
        namaPedagang,
        komoditas,
        kecamatan,
        parameterUji || "Residu Pestisida & Bahan Berbahaya",
        hasilUji || "Memenuhi Syarat (Aman)",
        noRegistrasi || null,
        status || "Uji Petik Acak",
        keterangan || null,
      ],
    );

    return {
      status: "success",
      message: "Data pengawasan keamanan pangan berhasil disimpan",
      id: res.insertId,
    };
  }),
);
