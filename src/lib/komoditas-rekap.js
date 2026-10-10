import { q } from "../db.js";

/**
 * Memastikan tabel komoditas_unggulan memiliki indeks unik untuk UPSERT yang aman.
 */
let tableEnsured = false;
export async function ensureKomoditasUnggulanIndex() {
  if (tableEnsured) return;
  try {
    const indexes = await q("SHOW INDEX FROM komoditas_unggulan WHERE Key_name = 'uniq_sektor_komoditas_tahun'");
    if (indexes.length === 0) {
      await q("ALTER TABLE komoditas_unggulan ADD UNIQUE KEY uniq_sektor_komoditas_tahun (sektor, nama_komoditas, tahun)");
    }
    tableEnsured = true;
  } catch (err) {
    console.error("[komoditas-rekap] Gagal memastikan indeks unik:", err.message);
  }
}

/**
 * Melakukan agregasi dan rekapitulasi otomatis data komoditas unggulan
 * dari tabel operasional fisik (padi, palawija, horti, perkebunan, peternakan, perikanan)
 * ke dalam tabel `komoditas_unggulan`.
 *
 * @param {number|null} targetTahun - Jika null, rekap seluruh tahun yang tersedia.
 * @returns {Promise<{ success: boolean, totalInserted: number, tahunList: number[] }>}
 */
export async function rekapKomoditasUnggulan(targetTahun = null) {
  await ensureKomoditasUnggulanIndex();

  // 1. Tentukan daftar tahun yang akan direkap
  let tahunList = [];
  if (targetTahun && Number.isFinite(Number(targetTahun))) {
    tahunList = [Number(targetTahun)];
  } else {
    const yearsPadi = await q("SELECT DISTINCT tahun FROM padi_produksi WHERE tahun IS NOT NULL");
    const yearsHorti = await q("SELECT DISTINCT tahun FROM horti_produksi WHERE tahun IS NOT NULL");
    const yearsKebun = await q("SELECT DISTINCT tahun FROM perkebunan_produksi WHERE tahun IS NOT NULL");
    const yearsTernak = await q("SELECT DISTINCT tahun FROM ternak_populasi WHERE tahun IS NOT NULL");
    tahunList = [...new Set([...yearsPadi, ...yearsHorti, ...yearsKebun, ...yearsTernak].map((r) => r.tahun))]
      .filter((y) => y >= 2018)
      .sort((a, b) => a - b);
  }

  // 2. Ambil master harga produsen untuk estimasi nilai ekonomi
  const hargaRows = await q("SELECT sektor, komoditas, harga_per_satuan, tahun FROM harga_produsen");
  const hargaMap = new Map();
  for (const h of hargaRows) {
    const key = `${h.komoditas?.toLowerCase()}_${h.tahun}`;
    const keyGlobal = `${h.komoditas?.toLowerCase()}`;
    hargaMap.set(key, Number(h.harga_per_satuan) || 0);
    if (!hargaMap.has(keyGlobal)) {
      hargaMap.set(keyGlobal, Number(h.harga_per_satuan) || 0);
    }
  }

  const getHarga = (nama, thn) => {
    const key = `${nama.toLowerCase()}_${thn}`;
    const keyGlobal = `${nama.toLowerCase()}`;
    return hargaMap.get(key) || hargaMap.get(keyGlobal) || 0;
  };

  let totalInserted = 0;

  for (const thn of tahunList) {
    const records = [];

    // --- A. PADI (Sawah & Ladang) ---
    const padiRows = await q(
      `SELECT 
        p.tahun,
        'pangan' AS sektor,
        IF(p.jenis = 'sawah', 'Padi Sawah', 'Padi Ladang') AS nama_komoditas,
        'Ton' AS satuan,
        k.nama AS kecamatan_sentra,
        ROUND(sub.total_produksi, 2) AS total_produksi
       FROM padi_produksi p
       JOIN kecamatan k ON p.kecamatan_id = k.id
       JOIN (
         SELECT tahun, jenis, MAX(produksi_ton) AS max_prod, SUM(produksi_ton) AS total_produksi
         FROM padi_produksi
         WHERE produksi_ton > 0 AND tahun = ?
         GROUP BY tahun, jenis
       ) sub ON p.tahun = sub.tahun AND p.jenis = sub.jenis AND p.produksi_ton = sub.max_prod
       WHERE p.tahun = ?
       GROUP BY p.tahun, p.jenis`,
      [thn, thn]
    );
    for (const r of padiRows) {
      const harga = getHarga(r.nama_komoditas, thn) || (r.nama_komoditas === "Padi Sawah" ? 6800000 : 6500000); // per ton
      records.push({
        ...r,
        nilai_ekonomi_estimasi: Math.round(r.total_produksi * harga),
      });
    }

    // --- B. PALAWIJA ---
    const palawijaRows = await q(
      `SELECT 
        p.tahun,
        'pangan' AS sektor,
        p.komoditas AS nama_komoditas,
        'Ton' AS satuan,
        k.nama AS kecamatan_sentra,
        ROUND(sub.total_produksi, 2) AS total_produksi
       FROM palawija_produksi p
       JOIN kecamatan k ON p.kecamatan_id = k.id
       JOIN (
         SELECT tahun, komoditas, MAX(produksi_ton) AS max_prod, SUM(produksi_ton) AS total_produksi
         FROM palawija_produksi
         WHERE produksi_ton > 0 AND tahun = ?
         GROUP BY tahun, komoditas
       ) sub ON p.tahun = sub.tahun AND p.komoditas = sub.komoditas AND p.produksi_ton = sub.max_prod
       WHERE p.tahun = ?
       GROUP BY p.tahun, p.komoditas`,
      [thn, thn]
    );
    for (const r of palawijaRows) {
      const hargaPerKg = getHarga(r.nama_komoditas, thn) || 5000;
      const hargaTon = hargaPerKg > 100000 ? hargaPerKg : hargaPerKg * 1000;
      records.push({
        ...r,
        nilai_ekonomi_estimasi: Math.round(r.total_produksi * hargaTon),
      });
    }

    // --- C. HORTIKULTURA ---
    const hortiRows = await q(
      `SELECT 
        p.tahun,
        'hortikultura' AS sektor,
        p.komoditas AS nama_komoditas,
        'Ton' AS satuan,
        k.nama AS kecamatan_sentra,
        ROUND(sub.total_produksi, 2) AS total_produksi
       FROM horti_produksi p
       JOIN kecamatan k ON p.kecamatan_id = k.id
       JOIN (
         SELECT tahun, komoditas, MAX(nilai) AS max_prod, SUM(nilai) AS total_produksi
         FROM horti_produksi
         WHERE nilai > 0 AND tahun = ? AND satuan = 'ton'
         GROUP BY tahun, komoditas
       ) sub ON p.tahun = sub.tahun AND p.komoditas = sub.komoditas AND p.nilai = sub.max_prod
       WHERE p.tahun = ? AND p.satuan = 'ton'
       GROUP BY p.tahun, p.komoditas`,
      [thn, thn]
    );
    for (const r of hortiRows) {
      const hargaPerKg = getHarga(r.nama_komoditas, thn) || 8000;
      const hargaTon = hargaPerKg > 100000 ? hargaPerKg : hargaPerKg * 1000;
      records.push({
        ...r,
        nilai_ekonomi_estimasi: Math.round(r.total_produksi * hargaTon),
      });
    }

    // --- D. PERKEBUNAN ---
    const kebunRows = await q(
      `SELECT 
        p.tahun,
        'perkebunan' AS sektor,
        p.tanaman AS nama_komoditas,
        'Ton' AS satuan,
        k.nama AS kecamatan_sentra,
        ROUND(sub.total_produksi, 2) AS total_produksi
       FROM perkebunan_produksi p
       JOIN kecamatan k ON p.kecamatan_id = k.id
       JOIN (
         SELECT tahun, tanaman, MAX(produksi_ton) AS max_prod, SUM(produksi_ton) AS total_produksi
         FROM perkebunan_produksi
         WHERE produksi_ton > 0 AND tahun = ?
         GROUP BY tahun, tanaman
       ) sub ON p.tahun = sub.tahun AND p.tanaman = sub.tanaman AND p.produksi_ton = sub.max_prod
       WHERE p.tahun = ?
       GROUP BY p.tahun, p.tanaman`,
      [thn, thn]
    );
    for (const r of kebunRows) {
      const hargaPerKg = getHarga(r.nama_komoditas, thn) || 12000;
      const hargaTon = hargaPerKg > 100000 ? hargaPerKg : hargaPerKg * 1000;
      records.push({
        ...r,
        nilai_ekonomi_estimasi: Math.round(r.total_produksi * hargaTon),
      });
    }

    // --- E. PETERNAKAN (Populasi Ternak) ---
    const ternakRows = await q(
      `SELECT 
        p.tahun,
        'peternakan' AS sektor,
        p.jenis AS nama_komoditas,
        'Ekor' AS satuan,
        k.nama AS kecamatan_sentra,
        sub.total_produksi
       FROM ternak_populasi p
       JOIN kecamatan k ON p.kecamatan_id = k.id
       JOIN (
         SELECT tahun, jenis, MAX(jumlah_ekor) AS max_prod, SUM(jumlah_ekor) AS total_produksi
         FROM ternak_populasi
         WHERE jumlah_ekor > 0 AND tahun = ?
         GROUP BY tahun, jenis
       ) sub ON p.tahun = sub.tahun AND p.jenis = sub.jenis AND p.jumlah_ekor = sub.max_prod
       WHERE p.tahun = ?
       GROUP BY p.tahun, p.jenis`,
      [thn, thn]
    );
    for (const r of ternakRows) {
      const hargaEkor = getHarga(r.nama_komoditas, thn) || 
        (r.nama_komoditas.includes("Sapi") ? 20000000 : 
         r.nama_komoditas.includes("Kambing") || r.nama_komoditas.includes("Domba") ? 2500000 : 
         r.nama_komoditas.includes("Ayam") ? 35000 : 500000);
      records.push({
        ...r,
        nilai_ekonomi_estimasi: Math.round(r.total_produksi * hargaEkor),
      });
    }

    // --- F. PERIKANAN ---
    try {
      const ikanRows = await q(
        `SELECT 
          tahun,
          'perikanan' AS sektor,
          jenis_ikan AS nama_komoditas,
          'Ton' AS satuan,
          COALESCE(nama_kecamatan, 'Sentra Perikanan') AS kecamatan_sentra,
          ROUND(produksi_kg / 1000, 2) AS total_produksi,
          ROUND(nilai_ekonomi_rp, 2) AS nilai_ekonomi_estimasi
         FROM ikan_produksi_jenis
         WHERE tahun = ? AND produksi_kg > 0`,
        [thn]
      );
      for (const r of ikanRows) {
        records.push({
          ...r,
          nilai_ekonomi_estimasi: r.nilai_ekonomi_estimasi || Math.round(r.total_produksi * 25000000),
        });
      }
    } catch {
      /* abaikan jika tabel sedang kosong */
    }

    // 3. Simpan seluruh records ke tabel komoditas_unggulan secara UPSERT
    for (const rec of records) {
      await q(
        `INSERT INTO komoditas_unggulan (
          sektor, nama_komoditas, satuan, kecamatan_sentra, total_produksi, nilai_ekonomi_estimasi, tahun, is_unggulan
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE
          satuan = VALUES(satuan),
          kecamatan_sentra = VALUES(kecamatan_sentra),
          total_produksi = VALUES(total_produksi),
          nilai_ekonomi_estimasi = VALUES(nilai_ekonomi_estimasi),
          is_unggulan = 1`,
        [
          rec.sektor,
          rec.nama_komoditas,
          rec.satuan,
          rec.kecamatan_sentra,
          rec.total_produksi,
          rec.nilai_ekonomi_estimasi,
          rec.tahun,
        ]
      );
      totalInserted++;
    }
  }

  return { success: true, totalInserted, tahunList };
}
