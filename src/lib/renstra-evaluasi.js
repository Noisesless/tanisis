import { q } from '../db.js';

export async function getEvaluasiRenstra(periode = "2025-2029") {
  const is2025 = periode === "2025-2029";
  const years = is2025 ? [2024, 2025, 2026, 2027, 2028, 2029, 2030] : [2017, 2018, 2019, 2020, 2021, 2022];

  // 1. Fetch Target Renstra
  const targets = await q(
    `SELECT id, periode, jenis_tabel, kategori_sektor, no_urut,
            indikator, satuan, baseline_tahun, baseline_nilai,
            t1, t2, t3, t4, t5, t6, sumber_tabel, sumber_dokumen
     FROM renstra_target
     WHERE periode = ?
     ORDER BY jenis_tabel ASC, no_urut ASC`,
    [periode]
  );

  // 2. Fetch Aggregated Real Data from pertasis database
  // Padi
  const padiRows = await q('SELECT tahun, ROUND(SUM(produksi_ton), 2) as val FROM padi_produksi GROUP BY tahun');
  const padiMap = Object.fromEntries(padiRows.map(r => [r.tahun, Number(r.val)]));

  // Palawija
  const palawijaRows = await q('SELECT tahun, LOWER(komoditas) as kom, ROUND(SUM(produksi_ton), 2) as val FROM palawija_produksi GROUP BY tahun, LOWER(komoditas)');
  const palawijaMap = {};
  for (const r of palawijaRows) {
    if (!palawijaMap[r.kom]) palawijaMap[r.kom] = {};
    palawijaMap[r.kom][r.tahun] = Number(r.val);
  }

  // Hortikultura
  const hortiRows = await q('SELECT tahun, LOWER(komoditas) as kom, ROUND(SUM(nilai), 2) as val FROM horti_produksi GROUP BY tahun, LOWER(komoditas)');
  const hortiMap = {};
  for (const r of hortiRows) {
    if (!hortiMap[r.kom]) hortiMap[r.kom] = {};
    hortiMap[r.kom][r.tahun] = Number(r.val);
  }

  // Ternak Populasi
  const ternakRows = await q('SELECT tahun, LOWER(jenis) as jenis, SUM(jumlah_ekor) as val FROM ternak_populasi GROUP BY tahun, LOWER(jenis)');
  const ternakMap = {};
  for (const r of ternakRows) {
    if (!ternakMap[r.jenis]) ternakMap[r.jenis] = {};
    ternakMap[r.jenis][r.tahun] = Number(r.val);
  }

  // Perikanan Budidaya
  const ikanRows = await q('SELECT tahun, ROUND(SUM(produksi_kg)/1000, 2) as val FROM ikan_budidaya GROUP BY tahun');
  const ikanMap = Object.fromEntries(ikanRows.map(r => [r.tahun, Number(r.val)]));

  // Perkebunan
  const kebunRows = await q('SELECT tahun, LOWER(tanaman) as tanaman, ROUND(SUM(produksi_ton), 2) as val FROM perkebunan_produksi GROUP BY tahun, LOWER(tanaman)');
  const kebunMap = {};
  for (const r of kebunRows) {
    if (!kebunMap[r.tanaman]) kebunMap[r.tanaman] = {};
    kebunMap[r.tanaman][r.tahun] = Number(r.val);
  }

  // IKP dari FSVA Desa
  const [ikpRow] = await q('SELECT ROUND(AVG(ikp), 2) as avg_ikp FROM fsva_desa_indikator WHERE ikp IS NOT NULL');
  const avgIkp = ikpRow ? Number(ikpRow.avg_ikp) : 79.40;

  // Helper parser string angka Indonesia (misal: "158.868,55" -> 158868.55)
  function parseVal(v) {
    if (!v || v === '-' || v === '—') return null;
    const clean = String(v).replace(/\./g, '').replace(',', '.').replace('%', '').trim();
    const num = parseFloat(clean);
    return isNaN(num) ? null : num;
  }

  // 3. Map Real Data to Each Indicator
  const evaluasiData = targets.map(item => {
    const indLower = item.indikator.toLowerCase();
    const realisasi = {};
    const prosentase = {};
    const status = {};

    function getRealValue(yr) {
      if (indLower.includes("padi")) return padiMap[yr] ?? null;
      if (indLower.includes("jagung")) return palawijaMap["jagung"]?.[yr] ?? null;
      if (indLower.includes("kedelai")) return palawijaMap["kedelai"]?.[yr] ?? null;
      if (indLower.includes("ubi kayu")) return palawijaMap["ubi kayu"]?.[yr] ?? null;
      if (indLower.includes("salak")) return hortiMap["salak"]?.[yr] ?? null;
      if (indLower.includes("kentang")) return hortiMap["kentang"]?.[yr] ?? null;
      if (indLower.includes("pisang")) return hortiMap["pisang"]?.[yr] ?? null;
      if (indLower.includes("durian")) return hortiMap["durian"]?.[yr] ?? null;
      if (indLower.includes("cabai")) {
        const rawit = hortiMap["cabai rawit"]?.[yr] || 0;
        const besar = hortiMap["cabai besar"]?.[yr] || 0;
        return (rawit + besar) > 0 ? (rawit + besar) : null;
      }
      if (indLower.includes("kopi")) return kebunMap["kopi robusta"]?.[yr] ?? null;
      if (indLower.includes("kelapa dalam")) return kebunMap["kelapa dalam"]?.[yr] ?? null;
      if (indLower.includes("teh")) return kebunMap["teh"]?.[yr] ?? null;
      if (indLower.includes("tembakau")) return kebunMap["tembakau"]?.[yr] ?? null;
      if (indLower.includes("sapi")) return ternakMap["sapi"]?.[yr] ?? null;
      if (indLower.includes("kambing") && indLower.includes("domba")) {
        const k = ternakMap["kambing"]?.[yr] || 0;
        const d = ternakMap["domba"]?.[yr] || 0;
        return (k + d) > 0 ? (k + d) : null;
      }
      if (indLower.includes("domba batur")) return ternakMap["domba batur"]?.[yr] ?? null;
      if (indLower.includes("perikanan budidaya")) return ikanMap[yr] ?? null;
      if (indLower.includes("indeks ketahanan pangan") || indLower.includes("ikp")) {
        return yr >= 2024 ? avgIkp : null;
      }
      return null;
    }

    const targetMap = {
      [years[0]]: parseVal(item.baseline_nilai),
      [years[1]]: parseVal(item.t1),
      [years[2]]: parseVal(item.t2),
      [years[3]]: parseVal(item.t3),
      [years[4]]: parseVal(item.t4),
      [years[5]]: parseVal(item.t5),
      [years[6]]: item.t6 ? parseVal(item.t6) : null,
    };

    for (const yr of years) {
      const real = getRealValue(yr);
      const tgt = targetMap[yr];
      realisasi[yr] = real;

      if (real !== null && tgt !== null && tgt > 0) {
        const pct = (real / tgt) * 100;
        prosentase[yr] = Number(pct.toFixed(1));
        if (pct >= 100) status[yr] = "TERCAPAI";
        else if (pct >= 80) status[yr] = "MENDEKATI";
        else status[yr] = "PERHATIAN";
      } else {
        prosentase[yr] = null;
        status[yr] = "BELUM_ADA_DATA";
      }
    }

    return {
      no: item.no_urut,
      sektor: item.kategori_sektor,
      indikator: item.indikator,
      satuan: item.satuan,
      jenis: (item.jenis_tabel || "").toUpperCase(),
      baseline_tahun: item.baseline_tahun,
      baseline: item.baseline_nilai,
      target: {
        baseline: item.baseline_nilai,
        t1: item.t1,
        t2: item.t2,
        t3: item.t3,
        t4: item.t4,
        t5: item.t5,
        t6: item.t6,
      },
      realisasi,
      prosentase,
      status
    };
  });

  return {
    periode,
    years,
    total_indikator: evaluasiData.length,
    data: evaluasiData
  };
}

export function getPaguRenstra(periode = "2025-2029") {
  const is2025 = periode === "2025-2029";
  const years = is2025 ? [2025, 2026, 2027, 2028, 2029] : [2018, 2019, 2020, 2021, 2022];

  const pagu2025 = [
    {
      no: 1,
      sektor: "Pangan & Gizi",
      kode: "3.27.02",
      program: "Program Peningkatan Diversifikasi dan Ketahanan Pangan Masyarakat",
      indikator: "Skor Pola Pangan Harapan (PPH) & Ketersediaan Pangan",
      pagu: { 2025: 1850000000, 2026: 1950000000, 2027: 2050000000, 2028: 2150000000, 2029: 2250000000 }
    },
    {
      no: 2,
      sektor: "Pangan & Gizi",
      kode: "3.27.03",
      program: "Program Penanganan Kerawanan Pangan",
      indikator: "Penanganan Desa Rentan Rawan Pangan (FSVA)",
      pagu: { 2025: 650000000, 2026: 700000000, 2027: 750000000, 2028: 800000000, 2029: 850000000 }
    },
    {
      no: 3,
      sektor: "Pangan & Gizi",
      kode: "3.27.04",
      program: "Program Pengawasan Keamanan Pangan Segar",
      indikator: "Sertifikasi dan Pengawasan PSAT-PDUK",
      pagu: { 2025: 450000000, 2026: 480000000, 2027: 510000000, 2028: 540000000, 2029: 570000000 }
    },
    {
      no: 4,
      sektor: "Tanaman Pangan",
      kode: "3.27.05",
      program: "Program Penyediaan dan Pengembangan Sarana Pertanian",
      indikator: "Fasilitasi Benih, Alsintan, dan Sarana Produksi Pangan",
      pagu: { 2025: 8750000000, 2026: 9200000000, 2027: 9650000000, 2028: 10100000000, 2029: 10550000000 }
    },
    {
      no: 5,
      sektor: "Tanaman Pangan",
      kode: "3.27.06",
      program: "Program Penyediaan dan Pengembangan Prasarana Pertanian",
      indikator: "Jaringan Irigasi Tersier, Jalan Usaha Tani, Konservasi Lahan",
      pagu: { 2025: 420000000, 2026: 445000000, 2027: 470000000, 2028: 495000000, 2029: 520000000 }
    },
    {
      no: 6,
      sektor: "Tanaman Pangan",
      kode: "3.27.07",
      program: "Program Pengendalian dan Penanggulangan Bencana Pertanian",
      indikator: "Pengendalian OPT dan Penanganan Dampak Perubahan Iklim",
      pagu: { 2025: 750000000, 2026: 800000000, 2027: 850000000, 2028: 900000000, 2029: 950000000 }
    },
    {
      no: 7,
      sektor: "Peternakan",
      kode: "3.27.08",
      program: "Program Pengendalian Kesehatan Hewan dan Kesmavet",
      indikator: "Vaksinasi Zoonosis, Pengawasan NKV, Populasi Ternak",
      pagu: { 2025: 2450000000, 2026: 2600000000, 2027: 2750000000, 2028: 2900000000, 2029: 3050000000 }
    },
    {
      no: 8,
      sektor: "Tata Kelola",
      kode: "3.27.09",
      program: "Program Penyuluhan Pertanian",
      indikator: "Pembinaan Poktan, Gapoktan, KWT dan Balai Penyuluhan Pertanian",
      pagu: { 2025: 3100000000, 2026: 3250000000, 2027: 3400000000, 2028: 3550000000, 2029: 370000000 }
    },
    {
      no: 9,
      sektor: "Perikanan",
      kode: "3.27.10",
      program: "Program Pengelolaan Perikanan Budidaya",
      indikator: "Peningkatan Produksi Ikan Kolam/KJA dan Benih Ikan",
      pagu: { 2025: 1950000000, 2026: 2100000000, 2027: 2250000000, 2028: 2400000000, 2029: 255000000 }
    },
    {
      no: 10,
      sektor: "Perikanan",
      kode: "3.27.11",
      program: "Program Pengolahan dan Pemasaran Hasil Perikanan",
      indikator: "Hilirisasi Olahan Ikan dan Edukasi Konsumsi Ikan",
      pagu: { 2025: 580000000, 2026: 620000000, 2027: 660000000, 2028: 700000000, 2029: 740000000 }
    },
    {
      no: 11,
      sektor: "Tata Kelola",
      kode: "3.27.01",
      program: "Program Penunjang Urusan Pemerintahan Daerah (Sekretariat)",
      indikator: "Gaji ASN, Operasional Dinas, Pengelolaan Keuangan & Aset",
      pagu: { 2025: 21083400432, 2026: 24903388488, 2027: 25000000000, 2028: 25100000000, 2029: 25200000000 }
    }
  ];

  const pagu2019 = [
    {
      no: 1,
      sektor: "Pangan & Gizi",
      kode: "3.01.01",
      program: "Program Peningkatan Ketahanan Pangan",
      indikator: "Ketersediaan Energi & Cadangan Pangan Kabupaten",
      pagu: { 2018: 1250000000, 2019: 1350000000, 2020: 1450000000, 2021: 1550000000, 2022: 1650000000 }
    },
    {
      no: 2,
      sektor: "Tanaman Pangan",
      kode: "3.01.02",
      program: "Program Peningkatan Produksi Pertanian / Perkebunan",
      indikator: "Produksi Padi, Palawija, dan Komoditas Hortikultura",
      pagu: { 2018: 6800000000, 2019: 7200000000, 2020: 7500000000, 2021: 7800000000, 2022: 8100000000 }
    },
    {
      no: 3,
      sektor: "Peternakan",
      kode: "3.01.03",
      program: "Program Pencegahan dan Penanggulangan Penyakit Ternak",
      indikator: "Pengendalian Zoonosis & Penurunan Kematian Unggas",
      pagu: { 2018: 1800000000, 2019: 1950000000, 2020: 2100000000, 2021: 2250000000, 2022: 2400000000 }
    },
    {
      no: 4,
      sektor: "Peternakan",
      kode: "3.01.04",
      program: "Program Peningkatan Produksi Hasil Peternakan",
      indikator: "Populasi Sapi, Kambing/Domba, Domba Batur, Produksi Daging",
      pagu: { 2018: 2400000000, 2019: 2550000000, 2020: 2700000000, 2021: 2850000000, 2022: 3000000000 }
    },
    {
      no: 5,
      sektor: "Perikanan",
      kode: "3.01.05",
      program: "Program Pengembangan Budidaya Perikanan",
      indikator: "Produksi Perikanan Budidaya dan Benih Ikan Air Tawar",
      pagu: { 2018: 1600000000, 2019: 1750000000, 2020: 1900000000, 2021: 2050000000, 2022: 2200000000 }
    },
    {
      no: 6,
      sektor: "Tata Kelola",
      kode: "3.01.06",
      program: "Program Peningkatan Kesejahteraan Petani",
      indikator: "Bina Kelompok Tani & Fasilitasi Kelompok Tani Miskin",
      pagu: { 2018: 2100000000, 2019: 2250000000, 2020: 2400000000, 2021: 2550000000, 2022: 2700000000 }
    },
    {
      no: 7,
      sektor: "Tata Kelola",
      kode: "3.01.07",
      program: "Program Pelayanan Administrasi Perkantoran & Sarpras Dinas",
      indikator: "Aparatur, Pelayanan Umum, dan Kebutuhan Operasional",
      pagu: { 2018: 18500000000, 2019: 19200000000, 2020: 19800000000, 2021: 20400000000, 2022: 21000000000 }
    }
  ];

  const data = is2025 ? pagu2025 : pagu2019;
  return {
    periode,
    years,
    total_program: data.length,
    sumber_dokumen: is2025 ? "Renstra Distankan & KP Kab. Banjarnegara 2025–2029 (Tabel 4.3)" : "Renstra Distankan & KP Kab. Banjarnegara 2019–2022 (Bab VI)",
    data
  };
}

