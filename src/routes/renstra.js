// Router Renstra & RKPD — /api/v1/renstra/*
// Menyajikan target indikator kinerja resmi dari dokumen Renstra 2019–2022 & 2025–2029.
import { Router } from "express";
import { q } from "../db.js";
import { route } from "../lib/helpers.js";

export const renstraRouter = Router();

/**
 * GET /api/v1/renstra/target
 * Query:
 * - periode: '2025-2029' (default) | '2019-2022'
 * - jenis: 'iku' | 'ikk' | 'sasaran_renstra' | 'program_rpjmd' | 'semua'
 * - sektor: string nama sektor atau 'semua'
 */
renstraRouter.get(
  "/target",
  route(async (req) => {
    const periode = req.query.periode === "2019-2022" ? "2019-2022" : "2025-2029";
    const jenis = (req.query.jenis || "").toUpperCase();
    const sektor = (req.query.sektor || "").toLowerCase();

    let sql = `
      SELECT id, periode, jenis_tabel, kategori_sektor, no_urut,
             indikator, satuan, baseline_tahun, baseline_nilai,
             t1, t2, t3, t4, t5, t6, sumber_tabel, sumber_dokumen
      FROM renstra_target
      WHERE periode = ?
    `;
    const params = [periode];

    if (jenis && jenis !== "SEMUA") {
      sql += " AND jenis_tabel = ?";
      params.push(jenis);
    }

    if (sektor && sektor !== "semua") {
      sql += " AND LOWER(kategori_sektor) LIKE ?";
      params.push(`%${sektor}%`);
    }

    sql += " ORDER BY jenis_tabel ASC, no_urut ASC";

    const rows = await q(sql, params);
    return {
      periode,
      total: rows.length,
      data: rows
    };
  })
);

/**
 * GET /api/v1/renstra/summary
 * Query:
 * - periode: '2025-2029' | '2019-2022'
 */
renstraRouter.get(
  "/summary",
  route(async (req) => {
    const periode = req.query.periode === "2019-2022" ? "2019-2022" : "2025-2029";

    const counts = await q(
      `SELECT jenis_tabel, COUNT(*) as count
       FROM renstra_target
       WHERE periode = ?
       GROUP BY jenis_tabel`,
      [periode]
    );

    const sasaranRow = counts.find(c => c.jenis_tabel === "IKU" || c.jenis_tabel === "SASARAN_RENSTRA");
    const programRow = counts.find(c => c.jenis_tabel === "IKK" || c.jenis_tabel === "PROGRAM_RPJMD");

    return {
      periode,
      total_sasaran: sasaranRow ? Number(sasaranRow.count) : 0,
      total_program: programRow ? Number(programRow.count) : 0,
      sumber_dokumen: periode === "2025-2029"
        ? "Renstra Distankan & KP Kab. Banjarnegara 2025–2029"
        : "Renstra Distankan & KP Kab. Banjarnegara 2019–2022"
    };
  })
);

/**
 * GET /api/v1/renstra/evaluasi
 * Query:
 * - periode: '2025-2029' (default) | '2019-2022'
 */
renstraRouter.get(
  "/evaluasi",
  route(async (req) => {
    const { getEvaluasiRenstra } = await import("../lib/renstra-evaluasi.js");
    const periode = req.query.periode === "2019-2022" ? "2019-2022" : "2025-2029";
    return await getEvaluasiRenstra(periode);
  })
);

/**
 * GET /api/v1/renstra/pagu
 * Query:
 * - periode: '2025-2029' (default) | '2019-2022'
 */
renstraRouter.get(
  "/pagu",
  route(async (req) => {
    const { getPaguRenstra } = await import("../lib/renstra-evaluasi.js");
    const periode = req.query.periode === "2019-2022" ? "2019-2022" : "2025-2029";
    return getPaguRenstra(periode);
  })
);

