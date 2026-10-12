// Logika Evaluasi Kesesuaian Lahan Multi-Sektor (Pangan, Hortikultura, Perkebunan)
// Terhubung langsung ke MariaDB pertasis (Zero Dummy Data, Zero Buzzwords).
import { q } from "../db.js";

export async function getKesesuaianLahan({ sektor = "semua", kecamatan = "Semua Kecamatan", tahun = 2024 } = {}) {
  // Ambil daftar tahun yang tersedia
  const yearRows = await q(`
    SELECT DISTINCT tahun FROM (
      SELECT tahun FROM padi_produksi
      UNION
      SELECT tahun FROM horti_produksi
      UNION
      SELECT tahun FROM perkebunan_produksi
    ) t ORDER BY tahun DESC
  `);
  const tahunList = yearRows.map((r) => Number(r.tahun)).filter((y) => y >= 2018);

  const defaultYear = tahunList[0] || 2024;
  const y = Number(tahun) && tahunList.includes(Number(tahun)) ? Number(tahun) : defaultYear;
  const prevY = y - 1;

  // 1. Resolve Kecamatan & Daftar Kecamatan
  const allKecRows = await q("SELECT id, nama FROM kecamatan ORDER BY nama ASC");
  const kecamatanList = allKecRows.map((k) => k.nama);

  let kecId = null;
  let kecNama = "Semua Kecamatan";
  if (kecamatan && kecamatan !== "Semua Kecamatan") {
    const matched = allKecRows.find(
      (k) => k.nama.toLowerCase() === kecamatan.toLowerCase() || k.nama.toUpperCase() === kecamatan.toUpperCase()
    );
    if (matched) {
      kecId = matched.id;
      kecNama = matched.nama;
    }
  }

  // 2. Profil Tutupan Lahan (Korelasi Fisik)
  let sawahHa = 0;
  let bukanSawahHa = 0;
  if (kecId) {
    const [lRow] = await q(
      "SELECT SUM(sawah_ha) as sawah, SUM(bukan_sawah_ha) as bukan FROM lahan_desa WHERE kecamatan_id = ?",
      [kecId]
    );
    sawahHa = Number(lRow?.sawah || 0);
    bukanSawahHa = Number(lRow?.bukan || 0);
  } else {
    const lRows = await q(
      "SELECT kategori, luas_ha FROM lahan_penggunaan WHERE tahun = (SELECT MAX(tahun) FROM lahan_penggunaan)"
    );
    sawahHa = Number(lRows.find((r) => r.kategori.includes("sawah") && !r.kategori.includes("Bukan"))?.luas_ha || 0);
    bukanSawahHa = Number(lRows.find((r) => r.kategori.includes("Bukan lahan sawah"))?.luas_ha || 0);
  }
  const totalLahan = sawahHa + bukanSawahHa;
  const sawahPct = totalLahan > 0 ? (sawahHa / totalLahan) * 100 : 0;
  const bukanSawahPct = totalLahan > 0 ? (bukanSawahHa / totalLahan) * 100 : 0;
  const tipologi =
    sawahPct > 60
      ? "Dominasi Sawah Irigasi/Tadah Hujan (Potensi Utama Pangan)"
      : bukanSawahPct > 60
        ? "Dominasi Tegalan / Kebun / Lereng (Potensi Hortikultura & Perkebunan)"
        : "Campuran Seimbang Sawah & Tegalan";

  // 3. Query Komoditas per Sektor
  const items = [];
  const secFilter = ["semua", "pangan", "hortikultura", "perkebunan"].includes(sektor) ? sektor : "semua";

  // Sektor Tanaman Pangan
  if (secFilter === "semua" || secFilter === "pangan") {
    const padiFilter = kecId ? `WHERE p.kecamatan_id = ${kecId}` : "";
    const padiRows = await q(`
      SELECT 
        CASE WHEN p.jenis = 'sawah' THEN 'Padi Sawah' ELSE 'Padi Ladang' END as komoditas,
        'Tanaman Pangan' as sektor,
        'Padi' as subsektor,
        SUM(CASE WHEN p.tahun = ${y} THEN p.produksi_ton ELSE 0 END) as produksi,
        SUM(CASE WHEN p.tahun = ${y} THEN p.luas_panen_ha ELSE 0 END) as luas_ha,
        SUM(CASE WHEN p.tahun = ${prevY} THEN p.produksi_ton ELSE 0 END) as prev_produksi
      FROM padi_produksi p
      ${padiFilter}
      GROUP BY p.jenis
    `);

    const palawijaFilter = kecId ? `WHERE w.kecamatan_id = ${kecId}` : "";
    const palawijaRows = await q(`
      SELECT 
        w.komoditas,
        'Tanaman Pangan' as sektor,
        'Palawija' as subsektor,
        SUM(CASE WHEN w.tahun = ${y} THEN w.produksi_ton ELSE 0 END) as produksi,
        SUM(CASE WHEN w.tahun = ${y} THEN w.luas_panen_ha ELSE 0 END) as luas_ha,
        SUM(CASE WHEN w.tahun = ${prevY} THEN w.produksi_ton ELSE 0 END) as prev_produksi
      FROM palawija_produksi w
      ${palawijaFilter}
      GROUP BY w.komoditas
    `);

    items.push(...padiRows, ...palawijaRows);
  }

  // Sektor Hortikultura
  if (secFilter === "semua" || secFilter === "hortikultura") {
    const hortiFilter = kecId ? `WHERE h.kecamatan_id = ${kecId}` : "";
    const hortiRows = await q(`
      SELECT 
        h.komoditas,
        'Hortikultura' as sektor,
        CASE 
          WHEN h.kelompok = 'sayuran' THEN 'Sayuran'
          WHEN h.kelompok = 'buah_tahunan' THEN 'Buah'
          WHEN h.kelompok = 'biofarmaka' THEN 'Biofarmaka'
          ELSE 'Tanaman Hias'
        END as subsektor,
        SUM(CASE WHEN h.tahun = ${y} THEN h.nilai ELSE 0 END) as produksi,
        0 as luas_ha,
        SUM(CASE WHEN h.tahun = ${prevY} THEN h.nilai ELSE 0 END) as prev_produksi
      FROM horti_produksi h
      ${hortiFilter}
      GROUP BY h.komoditas, h.kelompok
    `);

    const luasHortiFilter = kecId ? `WHERE l.kecamatan_id = ${kecId} AND l.tahun = ${y}` : `WHERE l.tahun = ${y}`;
    const luasHortiRows = await q(`
      SELECT l.komoditas, SUM(l.nilai) as luas_ha
      FROM horti_luas l
      ${luasHortiFilter}
      GROUP BY l.komoditas
    `);
    const luasHortiMap = new Map(luasHortiRows.map((r) => [r.komoditas, Number(r.luas_ha)]));
    for (const hr of hortiRows) {
      if (luasHortiMap.has(hr.komoditas)) {
        hr.luas_ha = luasHortiMap.get(hr.komoditas);
      }
    }
    items.push(...hortiRows);
  }

  // Sektor Perkebunan
  if (secFilter === "semua" || secFilter === "perkebunan") {
    const kebunFilter = kecId ? `WHERE k.kecamatan_id = ${kecId}` : "";
    const kebunRows = await q(`
      SELECT 
        k.tanaman as komoditas,
        'Perkebunan' as sektor,
        'Perkebunan Rakyat' as subsektor,
        SUM(CASE WHEN k.tahun = ${y} THEN k.produksi_ton ELSE 0 END) as produksi,
        0 as luas_ha,
        SUM(CASE WHEN k.tahun = ${prevY} THEN k.produksi_ton ELSE 0 END) as prev_produksi
      FROM perkebunan_produksi k
      ${kebunFilter}
      GROUP BY k.tanaman
    `);

    const arealFilter = kecId ? `WHERE a.kecamatan_id = ${kecId} AND a.tahun = ${y}` : `WHERE a.tahun = ${y}`;
    const arealKebunRows = await q(`
      SELECT a.tanaman, SUM(a.luas_ha) as luas_ha
      FROM perkebunan_areal a
      ${arealFilter}
      GROUP BY a.tanaman
    `);
    const arealKebunMap = new Map(arealKebunRows.map((r) => [r.tanaman, Number(r.luas_ha)]));
    for (const kr of kebunRows) {
      if (arealKebunMap.has(kr.komoditas)) {
        kr.luas_ha = arealKebunMap.get(kr.komoditas);
      }
    }
    items.push(...kebunRows);
  }

  // 4. Normalisasi dan Evaluasi Kesesuaian Lahan Multi-Sektor
  const totalProduksiSektor = items.reduce((acc, it) => acc + (Number(it.produksi) || 0), 0);

  const sektorTotals = {};
  for (const it of items) {
    sektorTotals[it.sektor] = (sektorTotals[it.sektor] || 0) + (Number(it.produksi) || 0);
  }

  const evaluatedItems = items.map((it) => {
    const prod = Number(it.produksi) || 0;
    const prev = Number(it.prev_produksi) || 0;
    const luas = Number(it.luas_ha) || 0;
    const secTotal = sektorTotals[it.sektor] || 1;
    const shareSec = secTotal > 0 ? (prod / secTotal) * 100 : 0;
    const deltaTon = prod - prev;
    const deltaPct = prev > 0 ? ((prod - prev) / prev) * 100 : null;

    let kelas = "N";
    let labelKelas = "Tidak Diusahakan";
    let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
    let dotColor = "bg-slate-400";
    let rekomendasi = "Tidak tercatat panen signifikan pada wilayah dan periode ini.";

    if (prod > 0) {
      if (shareSec >= 15 || prod >= 5000) {
        kelas = "S1";
        labelKelas = "Sangat Sesuai";
        badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-300";
        dotColor = "bg-emerald-600";
        rekomendasi = `Sentra produksi basis wilayah; direkomendasikan untuk pengembangan klaster budidaya dan korporasi tani.`;
      } else if (shareSec >= 3 || prod >= 250) {
        kelas = "S2";
        labelKelas = "Cukup Sesuai";
        badgeColor = "bg-blue-50 text-blue-800 border-blue-300";
        dotColor = "bg-blue-600";
        rekomendasi = `Kondisi lahan dan iklim adaptif; berpotensi ditingkatkan melalui intensifikasi dan akses sarana produksi.`;
      } else {
        kelas = "S3";
        labelKelas = "Kesesuaian Marjinal";
        badgeColor = "bg-amber-50 text-amber-800 border-amber-300";
        dotColor = "bg-amber-500";
        rekomendasi = `Diusahakan dalam skala kecil/terbatas; memerlukan perbaikan input agronomis atau pengelolaan air mikro.`;
      }
    }

    return {
      komoditas: it.komoditas,
      sektor: it.sektor,
      subsektor: it.subsektor,
      produksi: Math.round(prod * 100) / 100,
      luasHa: Math.round(luas * 100) / 100,
      prevProduksi: Math.round(prev * 100) / 100,
      deltaTon: Math.round(deltaTon * 100) / 100,
      deltaPct: deltaPct !== null ? Math.round(deltaPct * 10) / 10 : null,
      sharePct: Math.round(shareSec * 10) / 10,
      kelas,
      labelKelas,
      badgeColor,
      dotColor,
      rekomendasi,
    };
  });

  // Urutkan dari produksi terbesar
  evaluatedItems.sort((a, b) => b.produksi - a.produksi);

  // KPI
  const komoditasAktif = evaluatedItems.filter((i) => i.produksi > 0).length;
  const komoditasS1 = evaluatedItems.filter((i) => i.kelas === "S1").length;
  const komoditasS2 = evaluatedItems.filter((i) => i.kelas === "S2").length;
  const topKomoditas = evaluatedItems[0] || null;

  return {
    tahun: y,
    tahunList,
    kecamatan: kecNama,
    kecamatanList,
    sektor: secFilter,
    tutupanLahan: {
      sawahHa: Math.round(sawahHa * 10) / 10,
      bukanSawahHa: Math.round(bukanSawahHa * 10) / 10,
      sawahPct: Math.round(sawahPct * 10) / 10,
      bukanSawahPct: Math.round(bukanSawahPct * 10) / 10,
      tipologi,
    },
    kpi: {
      totalProduksi: Math.round(totalProduksiSektor * 100) / 100,
      topKomoditas: topKomoditas
        ? { nama: topKomoditas.komoditas, produksi: topKomoditas.produksi, share: topKomoditas.sharePct }
        : null,
      komoditasAktif,
      totalKomoditas: evaluatedItems.length,
      komoditasPrioritas: komoditasS1 + komoditasS2,
    },
    items: evaluatedItems,
  };
}
