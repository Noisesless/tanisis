// Kelembagaan — /api/v1/kelembagaan/*
// Replika fetchKelompokTani (poktan Dinas 2022-2025 MERGE data KTH SIMLUH per desa)
// dan fetchKelompokTaniHutanSnapshot (snapshot KTH murni, tahun 2026).
import { Router } from "express";
import { q } from "../db.js";
import { route } from "../lib/helpers.js";

export const kelembagaanRouter = Router();

const num0 = (v) => (v === null || v === undefined ? 0 : Number(v));

/** Bentuk baris KTH + daftar kelompoknya (meniru kelompok-tani-hutan.json). */
async function kthByDesa() {
  const rows = await q(
    `SELECT h.id, h.desa, h.desa_norm, h.kecamatan_id, k.nama AS kecamatan, h.tahun,
            h.kth, h.kth_pemula, h.kth_madya, h.kth_utama
     FROM kelompok_tani_hutan h JOIN kecamatan k ON k.id = h.kecamatan_id
     ORDER BY k.nama, h.desa`,
  );
  const details = await q(
    `SELECT d.kelompok_tani_hutan_id, d.nama_kelompok, d.no_register, d.tanggal_berdiri,
            d.kelas, d.alamat, d.ketua
     FROM kth_detail d ORDER BY d.id`,
  );
  const lists = new Map();
  for (const d of details) {
    if (!lists.has(d.kelompok_tani_hutan_id)) lists.set(d.kelompok_tani_hutan_id, []);
    lists.get(d.kelompok_tani_hutan_id).push({
      namaKelompok: d.nama_kelompok,
      noRegister: d.no_register,
      tanggalBerdiri: d.tanggal_berdiri ? String(d.tanggal_berdiri) : d.tanggal_berdiri,
      kelas: d.kelas,
      alamat: d.alamat,
      ketua: d.ketua,
    });
  }
  const map = new Map();
  for (const h of rows) {
    map.set(`${h.desa_norm}|${h.kecamatan_id}`, {
      desa: h.desa,
      kecamatan: h.kecamatan,
      kelompokTaniHutan: Number(h.kth),
      kthPemula: Number(h.kth_pemula),
      kthMadya: Number(h.kth_madya),
      kthUtama: Number(h.kth_utama),
      kelompokTaniHutanList: lists.get(h.id) ?? [],
    });
  }
  return map;
}

/**
 * GET /api/v1/kelembagaan/kth -> KelompokTaniRow[]
 * Snapshot KTH SIMLUH (188 desa, tahun 2026) — bentuk meniru fetchKelompokTaniHutanSnapshot.
 */
kelembagaanRouter.get(
  "/kth",
  route(async () => {
    const map = await kthByDesa();
    return [...map.values()].map((h) => ({
      desa: h.desa,
      kecamatan: h.kecamatan,
      kelompokTani: 0,
      anggotaTani: 0,
      kelompokPerikanan: 0,
      anggotaPerikanan: 0,
      gapoktan: 0,
      anggotaGapoktan: 0,
      tahun: "2026",
      kelompokTaniHutan: h.kelompokTaniHutan,
      kthPemula: h.kthPemula,
      kthMadya: h.kthMadya,
      kthUtama: h.kthUtama,
      kelompokTaniHutanList: h.kelompokTaniHutanList,
    }));
  }),
);

/**
 * GET /api/v1/kelembagaan/kelompok-tani -> KelompokTaniRow[]
 * Poktan Dinas (2022-2025; baris dasar 2026 milik snapshot KTH, dikecualikan)
 * lalu data KTH di-merge per desa — meniru mergeKelompokTaniHutan di api.ts.
 */
kelembagaanRouter.get(
  "/kelompok-tani",
  route(async () => {
    const [rows, kth] = await Promise.all([
      q(
        `SELECT k.nama AS kecamatan, t.desa, t.desa_norm, t.kecamatan_id, t.tahun,
                t.kelompok_tani, t.anggota_tani, t.kelompok_perikanan, t.anggota_perikanan,
                t.gapoktan, t.anggota_gapoktan
         FROM kelompok_tani t JOIN kecamatan k ON k.id = t.kecamatan_id
         WHERE t.tahun <= 2025
         ORDER BY t.tahun, k.nama, t.desa`,
      ),
      kthByDesa(),
    ]);
    return rows.map((r) => {
      const h = kth.get(`${r.desa_norm}|${r.kecamatan_id}`);
      return {
        desa: r.desa,
        kecamatan: r.kecamatan,
        kelompokTani: num0(r.kelompok_tani),
        anggotaTani: num0(r.anggota_tani),
        kelompokPerikanan: num0(r.kelompok_perikanan),
        anggotaPerikanan: num0(r.anggota_perikanan),
        gapoktan: num0(r.gapoktan),
        anggotaGapoktan: num0(r.anggota_gapoktan),
        tahun: String(r.tahun),
        ...(h
          ? {
              kelompokTaniHutan: h.kelompokTaniHutan,
              kthPemula: h.kthPemula,
              kthMadya: h.kthMadya,
              kthUtama: h.kthUtama,
              kelompokTaniHutanList: h.kelompokTaniHutanList,
            }
          : {}),
      };
    });
  }),
);

/**
 * GET /api/v1/kelembagaan/pertanian
 * Master data kelembagaan pertanian: Poktan, Gapoktan, KWT dengan ID Simluhtan / SK
 */
kelembagaanRouter.get(
  "/pertanian",
  route(async (req) => {
    const { kecamatan, jenis, q: search } = req.query;
    let where = "WHERE 1=1";
    const params = [];

    if (kecamatan && kecamatan !== "all" && kecamatan !== "Semua") {
      where += " AND kecamatan = ?";
      params.push(String(kecamatan).trim());
    }
    if (jenis && jenis !== "all" && jenis !== "Semua") {
      where += " AND jenis_lembaga = ?";
      params.push(String(jenis).trim());
    }
    if (search) {
      where += " AND (nama_kelompok LIKE ? OR id_simluhtan LIKE ? OR nama_ketua LIKE ? OR desa LIKE ?)";
      const term = `%${String(search).trim()}%`;
      params.push(term, term, term, term);
    }

    const rows = await q(
      `SELECT id, kecamatan, desa, jenis_lembaga, nama_kelompok,
              id_simluhtan, no_sk_pengukuhan, nama_ketua, kontak_hp,
              kelas_kemampuan, subsektor_utama, jumlah_anggota,
              tahun_berdiri, status_aktif
       FROM kelembagaan_pertanian
       ${where}
       ORDER BY kecamatan ASC, jenis_lembaga ASC, nama_kelompok ASC`,
      params,
    );

    return {
      status: "success",
      total: rows.length,
      rows: rows.map((r) => ({
        id: r.id,
        kecamatan: r.kecamatan,
        desa: r.desa,
        jenisLembaga: r.jenis_lembaga,
        namaKelompok: r.nama_kelompok,
        idSimluhtan: r.id_simluhtan || "-",
        noSk: r.no_sk_pengukuhan || "-",
        namaKetua: r.nama_ketua,
        kontak: r.kontak_hp || "-",
        kelasKemampuan: r.kelas_kemampuan,
        subsektor: r.subsektor_utama,
        jumlahAnggota: Number(r.jumlah_anggota || 0),
        tahunBerdiri: r.tahun_berdiri || "-",
        statusAktif: r.status_aktif,
      })),
    };
  }),
);

/**
 * GET /api/v1/kelembagaan/perikanan
 * Master data kelembagaan perikanan: Pokdakan, Poklahsar, Pokmaswas dengan ID KUSUKA
 */
kelembagaanRouter.get(
  "/perikanan",
  route(async (req) => {
    const { kecamatan, jenis, q: search } = req.query;
    let where = "WHERE 1=1";
    const params = [];

    if (kecamatan && kecamatan !== "all" && kecamatan !== "Semua") {
      where += " AND kecamatan = ?";
      params.push(String(kecamatan).trim());
    }
    if (jenis && jenis !== "all" && jenis !== "Semua") {
      where += " AND jenis_lembaga = ?";
      params.push(String(jenis).trim());
    }
    if (search) {
      where += " AND (nama_kelompok LIKE ? OR id_kusuka LIKE ? OR nama_ketua LIKE ? OR komoditas_utama LIKE ?)";
      const term = `%${String(search).trim()}%`;
      params.push(term, term, term, term);
    }

    const rows = await q(
      `SELECT id, kecamatan, desa, jenis_lembaga, nama_kelompok,
              id_kusuka, nama_ketua, kontak_hp, komoditas_utama,
              jumlah_anggota, kelas_kemampuan, status_aktif
       FROM kelembagaan_perikanan
       ${where}
       ORDER BY kecamatan ASC, jenis_lembaga ASC, nama_kelompok ASC`,
      params,
    );

    return {
      status: "success",
      total: rows.length,
      rows: rows.map((r) => ({
        id: r.id,
        kecamatan: r.kecamatan,
        desa: r.desa,
        jenisLembaga: r.jenis_lembaga,
        namaKelompok: r.nama_kelompok,
        idKusuka: r.id_kusuka || "-",
        namaKetua: r.nama_ketua,
        kontak: r.kontak_hp || "-",
        komoditasUtama: r.komoditas_utama,
        jumlahAnggota: Number(r.jumlah_anggota || 0),
        kelasKemampuan: r.kelas_kemampuan,
        statusAktif: r.status_aktif,
      })),
    };
  }),
);

/**
 * GET /api/v1/kelembagaan/juleha
 * Data Juru Sembelih Halal (JULEHA) bersertifikat
 */
kelembagaanRouter.get(
  "/juleha",
  route(async (req) => {
    const { kecamatan, status, q: search } = req.query;
    let where = "WHERE 1=1";
    const params = [];

    if (kecamatan && kecamatan !== "all" && kecamatan !== "Semua") {
      where += " AND kecamatan = ?";
      params.push(String(kecamatan).trim());
    }
    if (status && status !== "all" && status !== "Semua") {
      where += " AND status_sertifikasi = ?";
      params.push(String(status).trim());
    }
    if (search) {
      where += " AND (nama_lengkap LIKE ? OR no_sertifikat_halal LIKE ? OR unit_tugas LIKE ?)";
      const term = `%${String(search).trim()}%`;
      params.push(term, term, term);
    }

    const rows = await q(
      `SELECT id, nama_lengkap, nik, kecamatan, desa,
              no_sertifikat_halal, lembaga_penerbit, unit_tugas,
              status_sertifikasi, tahun_kelulusan
       FROM kelembagaan_juleha
       ${where}
       ORDER BY kecamatan ASC, nama_lengkap ASC`,
      params,
    );

    return {
      status: "success",
      total: rows.length,
      rows: rows.map((r) => ({
        id: r.id,
        namaLengkap: r.nama_lengkap,
        nik: r.nik ? `${r.nik.slice(0, 6)}******${r.nik.slice(-4)}` : "-",
        kecamatan: r.kecamatan,
        desa: r.desa,
        noSertifikat: r.no_sertifikat_halal || "-",
        lembagaPenerbit: r.lembaga_penerbit,
        unitTugas: r.unit_tugas,
        statusSertifikasi: r.status_sertifikasi,
        tahunKelulusan: r.tahun_kelulusan || "-",
      })),
    };
  }),
);

/**
 * GET /api/v1/kelembagaan/p4s
 * Data Pusat Pelatihan Pertanian dan Perdesaan Swadaya (P4S)
 */
kelembagaanRouter.get(
  "/p4s",
  route(async (req) => {
    const { kecamatan, q: search } = req.query;
    let where = "WHERE 1=1";
    const params = [];

    if (kecamatan && kecamatan !== "all" && kecamatan !== "Semua") {
      where += " AND kecamatan = ?";
      params.push(String(kecamatan).trim());
    }
    if (search) {
      where += " AND (nama_p4s LIKE ? OR pengelola LIKE ? OR bidang_kejuruan LIKE ?)";
      const term = `%${String(search).trim()}%`;
      params.push(term, term, term);
    }

    const rows = await q(
      `SELECT id, nama_p4s, pengelola, kecamatan, desa,
              bidang_kejuruan, klasifikasi_akreditasi, no_register_bppsdmp, kontak
       FROM kelembagaan_p4s
       ${where}
       ORDER BY nama_p4s ASC`,
      params,
    );

    return {
      status: "success",
      total: rows.length,
      rows: rows.map((r) => ({
        id: r.id,
        namaP4S: r.nama_p4s,
        pengelola: r.pengelola,
        kecamatan: r.kecamatan,
        desa: r.desa,
        bidangKejuruan: r.bidang_kejuruan,
        klasifikasi: r.klasifikasi_akreditasi,
        noRegister: r.no_register_bppsdmp || "-",
        kontak: r.kontak || "-",
      })),
    };
  }),
);

/**
 * GET /api/v1/kelembagaan/upja
 * Data Usaha Pelayanan Jasa Alsintan (UPJA)
 */
kelembagaanRouter.get(
  "/upja",
  route(async (req) => {
    const { kecamatan, q: search } = req.query;
    let where = "WHERE 1=1";
    const params = [];

    if (kecamatan && kecamatan !== "all" && kecamatan !== "Semua") {
      where += " AND kecamatan = ?";
      params.push(String(kecamatan).trim());
    }
    if (search) {
      where += " AND (nama_upja LIKE ? OR manajer LIKE ? OR jenis_alsintan_dikelola LIKE ?)";
      const term = `%${String(search).trim()}%`;
      params.push(term, term, term);
    }

    const rows = await q(
      `SELECT id, nama_upja, manajer, kecamatan, desa,
              gapoktan_induk, jenis_alsintan_dikelola, jumlah_alsintan, status_operasional
       FROM kelembagaan_upja
       ${where}
       ORDER BY nama_upja ASC`,
      params,
    );

    return {
      status: "success",
      total: rows.length,
      rows: rows.map((r) => ({
        id: r.id,
        namaUPJA: r.nama_upja,
        manajer: r.manajer,
        kecamatan: r.kecamatan,
        desa: r.desa,
        gapoktanInduk: r.gapoktan_induk || "-",
        jenisAlsintan: r.jenis_alsintan_dikelola,
        jumlahAlsintan: Number(r.jumlah_alsintan || 0),
        statusOperasional: r.status_operasional,
      })),
    };
  }),
);

