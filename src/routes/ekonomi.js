// Ekonomi — /api/v1/ekonomi/*  & Lumbung — /api/v1/lumbung
// Replika fetchInflationData, fetchMarketData, fetchLumbungPangan.
import { Router } from "express";
import { q } from "../db.js";
import { route, toIntOrNull } from "../lib/helpers.js";

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
    const { sektor } = req.query;
    const thn = toIntOrNull(req.query.tahun);
    let where = "WHERE 1=1";
    const params = [];
    if (sektor) {
      where += " AND sektor = ?";
      params.push(String(sektor).toLowerCase());
    }
    if (thn !== null) {
      where += " AND tahun = ?";
      params.push(thn);
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
    let tahun = toIntOrNull(req.query.tahun);
    let items = [];

    const subsektor = String(req.query.subsektor ?? "").toLowerCase();

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
    } else if (sektor === "hortikultura" && (subsektor === "biofarmaka" || subsektor === "tanaman_hias" || subsektor === "tanaman-hias")) {
      if (!tahun || isNaN(tahun)) {
        tahun = 2024;
      }
      const kelompokDb = subsektor === "biofarmaka" ? "biofarmaka" : "tanaman_hias";
      const defaultSatuan = subsektor === "biofarmaka" ? "Kg" : "Tangkai";
      const bioOrHiasRows = await q(
        `SELECT t.komoditas,
                ? AS satuan,
                SUM(t.nilai) AS volumeProduksi,
                ? AS tahun
           FROM horti_produksi t
          WHERE t.kelompok = ? AND t.tahun = ? AND t.nilai > 0
          GROUP BY t.komoditas
          ORDER BY volumeProduksi DESC`,
        [defaultSatuan, tahun, kelompokDb, tahun],
      );
      for (const row of bioOrHiasRows) {
        const [sentraRow] = await q(
          `SELECT k.nama AS sentra
             FROM horti_produksi t
             JOIN kecamatan k ON k.id = t.kecamatan_id
            WHERE t.komoditas = ? AND t.tahun = ? AND t.kelompok = ?
            ORDER BY t.nilai DESC LIMIT 1`,
          [row.komoditas, tahun, kelompokDb],
        );
        row.kecamatanSentra = sentraRow?.sentra || "Kabupaten Banjarnegara";
        row.nilaiEkonomiRp = 0;
      }
      items = bioOrHiasRows;
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

      // Filter sub-sektor khusus hortikultura
      if (sektor === "hortikultura" && subsektor === "sayuran") {
        const SAYURAN_LIST = ["Kentang", "Kubis", "Wortel", "Cabai Rawit", "Cabai Merah", "Cabai Besar", "Bawang Merah", "Bawang Putih", "Tomat", "Petsai"];
        items = items.filter((it) => SAYURAN_LIST.some((s) => s.toLowerCase() === it.komoditas.toLowerCase()));
      } else if (sektor === "hortikultura" && subsektor === "buah") {
        const BUAH_LIST = ["Salak", "Pisang", "Durian", "Mangga", "Pepaya", "Jeruk Besar", "Jeruk Siam"];
        items = items.filter((it) => BUAH_LIST.some((b) => b.toLowerCase() === it.komoditas.toLowerCase()));
      }
    }

    // Ambil total nilai ekonomi dari nilai_ekonomi_tahunan (jika diinput resmi)
    let totalNilaiRp = 0;
    if (sektor === "hortikultura" && subsektor === "sayuran") {
      const SAYURAN_LIST = ["Kentang", "Kubis", "Wortel", "Cabai Rawit", "Cabai Merah", "Cabai Besar", "Bawang Merah", "Bawang Putih", "Tomat", "Petsai"];
      const [resmiTotal] = await q(
        `SELECT SUM(nilai_rp) AS totalRp
           FROM nilai_ekonomi_tahunan
          WHERE bidang = 'hortikultura' AND tahun = ?
            AND komoditas IN (${SAYURAN_LIST.map(() => "?").join(",")})`,
        [tahun, ...SAYURAN_LIST],
      );
      totalNilaiRp = num0(resmiTotal?.totalRp);
    } else if (sektor === "hortikultura" && subsektor === "buah") {
      const BUAH_LIST = ["Salak", "Pisang", "Durian", "Mangga", "Pepaya", "Jeruk Besar", "Jeruk Siam"];
      const [resmiTotal] = await q(
        `SELECT SUM(nilai_rp) AS totalRp
           FROM nilai_ekonomi_tahunan
          WHERE bidang = 'hortikultura' AND tahun = ?
            AND komoditas IN (${BUAH_LIST.map(() => "?").join(",")})`,
        [tahun, ...BUAH_LIST],
      );
      totalNilaiRp = num0(resmiTotal?.totalRp);
    } else if (sektor === "hortikultura" && (subsektor === "biofarmaka" || subsektor === "tanaman_hias" || subsektor === "tanaman-hias")) {
      totalNilaiRp = 0;
    } else {
      const [resmiTotal] = await q(
        `SELECT SUM(nilai_rp) AS totalRp
           FROM nilai_ekonomi_tahunan
          WHERE bidang = ? AND tahun = ?`,
        [sektor, tahun],
      );
      totalNilaiRp = num0(resmiTotal?.totalRp);
    }

    // Jika nilai_ekonomi_tahunan ada, gunakan total tersebut.
    // Jika tidak, jumlahkan dari nilai_ekonomi_estimasi di komoditas_unggulan.
    if (!totalNilaiRp && items.length > 0) {
      totalNilaiRp = items.reduce((acc, it) => acc + num0(it.nilaiEkonomiRp), 0);
    }

    // Handle kondisi kosong (Zero Dummy Data Law)
    if (items.length === 0) {
      return {
        status: "empty",
        sektor,
        subsektor: subsektor || null,
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
      subsektor: subsektor || null,
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
