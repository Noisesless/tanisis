import express from "express";
import { Readable } from "node:stream";
import { q } from "../db.js";

const aiRouter = express.Router();

// Daftar model Gemini resmi yang didukung dengan fallback otomatis
const SUPPORTED_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
  "gemini-2.0-flash-lite",
  "gemini-3.8-flash"
];

// 20 Kecamatan resmi Kabupaten Banjarnegara
const KECAMATAN_BANJARNEGARA = [
  "Banjarmangu", "Banjarnegara", "Batur", "Bawang", "Kalibening",
  "Karangkobar", "Madukara", "Mandiraja", "Pagedongan", "Pagentan",
  "Pandanarum", "Pejawaran", "Punggelan", "Purwareja Klampok", "Purwanegara",
  "Rakit", "Sigaluh", "Susukan", "Wanadadi", "Wanayasa"
];

// In-memory sliding rate limiter per IP untuk mencegah exploit / kuota drain oleh pihak luar
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 menit
const MAX_REQUESTS_PER_WINDOW = 30; // maks 30 chat per menit per IP

// Pembersihan rutin setiap 5 menit
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { startTime: now, count: 1 });
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  record.count++;
  return true;
}

/**
 * Dynamic RAG Retrieval Engine (Dev & Production Parity)
 * Mengambil data statistik riil secara langsung dan dinamis dari database MariaDB/MySQL (pertasis)
 * dan OpenData Banjarnegara (CKAN API) berdasarkan kata kunci pertanyaan pengguna.
 */
async function retrieveDynamicContext(userQuery) {
  if (!userQuery || typeof userQuery !== "string") return "";

  const queryLower = userQuery.toLowerCase();
  const rawWords = queryLower.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length >= 3);
  const stopWords = new Set([
    "apa", "berapa", "bagaimana", "dimana", "kapan", "mengapa", "siapa", "yang", "dan", "di",
    "ke", "dari", "pada", "untuk", "dengan", "adalah", "ini", "itu", "saya", "anda", "kami",
    "kita", "banjarnegara", "kabupaten", "analisa", "analisis", "data", "rekomendasi", "potensi",
    "sektor", "informasi", "tolong", "bantu", "daerah", "wilayah", "tahun", "terbaru", "apakah",
    "bisa", "jelaskan", "sebutkan", "beri", "tahu", "tentang", "kalau", "mana", "paling"
  ]);
  const keywords = rawWords.filter((w) => !stopWords.has(w));
  if (keywords.length === 0) keywords.push("unggulan");

  // Deteksi filter tahun eksplisit (contoh: 2023, 2024, 2022)
  const yearMatch = queryLower.match(/\b(201\d|202\d)\b/);
  const requestedYear = yearMatch ? parseInt(yearMatch[1], 10) : null;

  // Deteksi nama kecamatan dan arah sorting/ranking (sedikit/terkecil vs terbanyak/terbesar)
  const matchedKec = KECAMATAN_BANJARNEGARA.find((k) => queryLower.includes(k.toLowerCase()));
  const isAsc = queryLower.includes("sedikit") || queryLower.includes("rendah") || queryLower.includes("terkecil") || queryLower.includes("minim");
  const sortDir = isAsc ? "ASC" : "DESC";

  // Deteksi domain khusus
  const isTanamanHias = queryLower.includes("hias") || queryLower.includes("tanaman hias") || queryLower.includes("agloenema") || queryLower.includes("krisan") || queryLower.includes("mawar") || queryLower.includes("soka");
  const isIkanHias = queryLower.includes("ikan hias") || queryLower.includes("koi") || queryLower.includes("cupang") || queryLower.includes("komet") || queryLower.includes("koki") || queryLower.includes("mas koki");
  const isSawit = queryLower.includes("sawit") || queryLower.includes("kelapa sawit");
  const isKopi = queryLower.includes("kopi") || queryLower.includes("robusta") || queryLower.includes("arabika");
  const isWortel = queryLower.includes("wortel");
  const isBawang = queryLower.includes("bawang");
  const isKapulaga = queryLower.includes("kapulaga");
  const isLahan = queryLower.includes("lahan") || queryLower.includes("sawah") || queryLower.includes("tegal") || queryLower.includes("alih fungsi");

  const contextParts = [];

  try {
    // 1. DATA KOMODITAS UNGGULAN RESMI (Hanya yang berproduksi riil > 0 dan is_unggulan = 1)
    const unggulanList = [];
    if (matchedKec) {
      const kecUnggulan = await q(
        `SELECT sektor, nama_komoditas, satuan, kecamatan_sentra, total_produksi, nilai_ekonomi_estimasi, tahun 
         FROM komoditas_unggulan 
         WHERE LOWER(kecamatan_sentra) LIKE ? AND total_produksi > 0 AND is_unggulan = 1
         ORDER BY total_produksi DESC LIMIT 6`,
        [`%${matchedKec.toLowerCase()}%`]
      );
      for (const r of kecUnggulan) unggulanList.push(r);
    }
    for (const kw of keywords) {
      const rows = await q(
        `SELECT sektor, nama_komoditas, satuan, kecamatan_sentra, total_produksi, nilai_ekonomi_estimasi, tahun 
         FROM komoditas_unggulan 
         WHERE (LOWER(nama_komoditas) LIKE ? OR LOWER(sektor) LIKE ?) AND total_produksi > 0 AND is_unggulan = 1
         ORDER BY total_produksi DESC LIMIT 6`,
        [`%${kw}%`, `%${kw}%`]
      );
      for (const r of rows) {
        if (!unggulanList.some((u) => u.nama_komoditas === r.nama_komoditas && u.tahun === r.tahun)) {
          unggulanList.push(r);
        }
      }
    }
    if (unggulanList.length > 0) {
      let text = "RINGKASAN DATA KOMODITAS UNGGULAN SISTEM (TERVERIFIKASI PRODUKSI RIIL):\n";
      for (const u of unggulanList) {
        text += `- ${u.nama_komoditas} [Sektor ${u.sektor}, Tahun ${u.tahun}]: Total Produksi ${Number(u.total_produksi).toLocaleString("id-ID")} ${u.satuan || "Ton"}, Sentra: Kec. ${u.kecamatan_sentra || "Banjarnegara"}${u.nilai_ekonomi_estimasi > 0 ? `, Estimasi Nilai: Rp ${Number(u.nilai_ekonomi_estimasi).toLocaleString("id-ID")}` : ""}\n`;
      }
      contextParts.push(text);
    }

    // 2. DATA KHUSUS TANAMAN HIAS (Agloenema, Krisan, Mawar, Soka)
    if (isTanamanHias) {
      const hiasAgregat = await q(
        `SELECT h.komoditas, h.tahun, SUM(h.nilai) as total_produksi, h.satuan 
         FROM horti_produksi h 
         WHERE h.kelompok = 'tanaman_hias' ${requestedYear ? "AND h.tahun = " + requestedYear : ""}
         GROUP BY h.komoditas, h.tahun, h.satuan 
         ORDER BY total_produksi DESC`
      );
      if (hiasAgregat.length > 0) {
        let text = `DATA RESMI KELOMPOK TANAMAN HIAS HORTIKULTURA BANJARNEGARA (${requestedYear || hiasAgregat[0].tahun}):\n`;
        text += "- FAKTA SISTEM: Komoditas tanaman hias tercatat resmi di sektor hortikultura SISPERTANI mencakup Agloenema, Krisan, Mawar, dan Soka.\n";
        for (const h of hiasAgregat) {
          text += `- Komoditas ${h.komoditas} [Tahun ${h.tahun}]: Total Produksi ${Number(h.total_produksi).toLocaleString("id-ID")} ${h.satuan}\n`;
        }
        contextParts.push(text);
      }

      const hiasSentra = await q(
        `SELECT k.nama as kecamatan, h.komoditas, h.tahun, h.nilai, h.satuan 
         FROM horti_produksi h JOIN kecamatan k ON k.id=h.kecamatan_id 
         WHERE h.kelompok = 'tanaman_hias' AND h.nilai > 0 ${requestedYear ? "AND h.tahun = " + requestedYear : ""}
         ORDER BY h.nilai DESC LIMIT 8`
      );
      if (hiasSentra.length > 0) {
        let text = `RINCIAN KECAMATAN PENGHASIL TANAMAN HIAS:\n`;
        for (const hs of hiasSentra) {
          text += `- Kec. ${hs.kecamatan}: ${hs.komoditas} sebanyak ${Number(hs.nilai).toLocaleString("id-ID")} ${hs.satuan} (Tahun ${hs.tahun})\n`;
        }
        contextParts.push(text);
      }
    }

    // 3. DATA KHUSUS IKAN HIAS (Tabel ikan_hias: Koi, Mas Koki, Komet, Cupang)
    if (isIkanHias) {
      const ikanHiasVarietas = await q(
        `SELECT varietas, SUM(volume_ekor) as total_ekor, SUM(nilai_ekonomi) as total_nilai, tahun 
         FROM ikan_hias 
         ${requestedYear ? "WHERE tahun = " + requestedYear : ""}
         GROUP BY varietas, tahun 
         ORDER BY total_ekor DESC`
      );
      if (ikanHiasVarietas.length > 0) {
        let text = `DATA RESMI BUDIDAYA IKAN HIAS KABUPATEN BANJARNEGARA (${requestedYear || ikanHiasVarietas[0].tahun}):\n`;
        text += "- FAKTA SISTEM: Komoditas ikan hias tercatat resmi di SISPERTANI mencakup Ikan Koi, Ikan Mas Koki, Ikan Cupang, dan Ikan Komet.\n";
        for (const iv of ikanHiasVarietas) {
          text += `- ${iv.varietas}: ${Number(iv.total_ekor).toLocaleString("id-ID")} ekor (Nilai Ekonomi: Rp ${Number(iv.total_nilai).toLocaleString("id-ID")})\n`;
        }
        contextParts.push(text);
      }

      const ikanHiasSentra = await q(
        `SELECT nama_kecamatan, SUM(volume_ekor) as total_ekor, SUM(nilai_ekonomi) as total_nilai, tahun 
         FROM ikan_hias 
         WHERE volume_ekor > 0 ${requestedYear ? "AND tahun = " + requestedYear : ""}
         GROUP BY nama_kecamatan, tahun 
         ORDER BY total_ekor DESC LIMIT 8`
      );
      if (ikanHiasSentra.length > 0) {
        let text = `KECAMATAN SENTRA BUDIDAYA IKAN HIAS TERBESAR (${ikanHiasSentra[0].tahun}):\n`;
        for (const is of ikanHiasSentra) {
          text += `- Kec. ${is.nama_kecamatan}: ${Number(is.total_ekor).toLocaleString("id-ID")} ekor (Nilai Ekonomi: Rp ${Number(is.total_nilai).toLocaleString("id-ID")})\n`;
        }
        contextParts.push(text);
      }
    }

    // 4. DATA KELAPA SAWIT (Penegasan Faktual)
    if (isSawit) {
      let text = "DATA STATISTIK KELAPA SAWIT KABUPATEN BANJARNEGARA:\n";
      text += "- FAKTA SISTEM: Produksi Kelapa Sawit di seluruh kecamatan Kabupaten Banjarnegara tercatat 0 Ton (TIDAK ADA produksi kelapa sawit karena kondisi geografis dan agroklimat Banjarnegara bukan sentra perkebunan sawit).\n";
      text += "- KOMODITAS PERKEBUNAN UTAMA BANJARNEGARA: Kelapa Dalam/Deres (Gula Semut) dengan produksi 16.921 Ton (sentra Susukan & Mandiraja), Kopi Robusta (2.167 Ton sentra Karangkobar), dan Teh (3.731 Ton sentra Kalibening).\n";
      contextParts.push(text);
    }

    // 5. DATA KOPI (Robusta vs Arabika)
    if (isKopi) {
      const kopiYearSql = requestedYear ? `p.tahun = ${requestedYear}` : `p.tahun = (SELECT MAX(tahun) FROM perkebunan_produksi WHERE LOWER(tanaman) LIKE '%kopi%')`;
      const kopiRobusta = await q(
        `SELECT k.nama as kecamatan, p.tanaman, p.tahun, p.produksi_ton 
         FROM perkebunan_produksi p JOIN kecamatan k ON k.id=p.kecamatan_id 
         WHERE LOWER(p.tanaman) = 'kopi robusta' AND ${kopiYearSql}
         ORDER BY p.produksi_ton ${sortDir} LIMIT 10`
      );
      if (kopiRobusta.length > 0) {
        let text = `DATA SENTRA KOPI ROBUSTA RESMI BANJARNEGARA (${kopiRobusta[0].tahun}):\n`;
        text += "- FAKTA SISTEM: Komoditas kopi utama yang berproduksi aktif di Banjarnegara adalah KOPI ROBUSTA dengan total produksi kabupaten mencapai 2.167 Ton (sentra utama Kec. Karangkobar dan Kalibening). Kopi Arabika tercatat 0 Ton.\n";
        for (const kr of kopiRobusta) {
          text += `- Kec. ${kr.kecamatan}: ${Number(kr.produksi_ton).toLocaleString("id-ID")} Ton\n`;
        }
        contextParts.push(text);
      }
    }

    // 6. DATA WORTEL & BAWANG (Hortikultura Sayuran Semusim)
    if (isWortel || isBawang || isKapulaga) {
      const filterKomoditas = isWortel ? "wortel" : isBawang ? "bawang" : "kapulaga";
      const semusimRows = await q(
        `SELECT kelompok, komoditas, tahun, nilai, satuan 
         FROM horti_produksi_kabupaten 
         WHERE LOWER(komoditas) LIKE ? ${requestedYear ? "AND tahun = " + requestedYear : ""}
         ORDER BY tahun DESC LIMIT 6`,
        [`%${filterKomoditas}%`]
      );
      if (semusimRows.length > 0) {
        let text = `DATA RESMI HORTIKULTURA SEMUSIM / KABUPATEN (${semusimRows[0].komoditas}):\n`;
        for (const s of semusimRows) {
          text += `- ${s.komoditas} [Tahun ${s.tahun}]: Total Produksi ${Number(s.nilai).toLocaleString("id-ID")} ${s.satuan}\n`;
        }
        if (isWortel) {
          text += "- FAKTA SISTEM: Wortel merupakan salah satu komoditas sayuran hortikultura terbesar di Banjarnegara (produksi ~48.000-51.000 Ton), terkonsentrasi di kawasan sentra dataran tinggi Dieng (Kecamatan Batur dan sekitarnya).\n";
        }
        if (isBawang) {
          text += "- FAKTA SISTEM: Banjarnegara BUKAN sentra bawang merah (produksi bawang merah hanya 0,33 Ton pada 2024 dan 52,31 Ton pada 2023). Bawang yang lebih banyak dihasilkan adalah Bawang Daun (10.175 Ton pada 2024).\n";
        }
        contextParts.push(text);
      }
    }

    // 7. DATA PADI & BERAS (Agregasi Sawah + Ladang Dinamis Tahun)
    if (queryLower.includes("padi") || queryLower.includes("beras") || queryLower.includes("panen")) {
      const macroPadi = await q(
        `SELECT tahun, SUM(luas_panen_ha) as total_luas, SUM(produksi_ton) as total_produksi
         FROM padi_produksi 
         ${requestedYear ? "WHERE tahun = " + requestedYear : ""}
         GROUP BY tahun ORDER BY tahun DESC LIMIT 4`
      );
      if (macroPadi.length > 0) {
        let text = "DATA RESMI PRODUKSI PADI KABUPATEN BANJARNEGARA (TOTAL KABUPATEN):\n";
        for (const m of macroPadi) {
          text += `- Tahun ${m.tahun}: Total Produksi ${Number(m.total_produksi).toLocaleString("id-ID")} Ton, Luas Panen ${Number(m.total_luas).toLocaleString("id-ID")} Ha\n`;
        }
        contextParts.push(text);
      }

      const padiYearSql = requestedYear ? `p.tahun = ${requestedYear}` : `p.tahun = (SELECT MAX(tahun) FROM padi_produksi)`;
      const sentraPadi = await q(
        `SELECT k.nama as kecamatan, p.tahun, 
                SUM(p.luas_panen_ha) as luas_ha, 
                SUM(p.produksi_ton) as produksi_ton,
                ROUND(SUM(p.produksi_ton) * 10 / NULLIF(SUM(p.luas_panen_ha), 0), 2) as produktivitas_ku_ha
         FROM padi_produksi p JOIN kecamatan k ON k.id=p.kecamatan_id 
         WHERE ${padiYearSql}
         GROUP BY k.nama, p.tahun
         ORDER BY produksi_ton ${sortDir} LIMIT 8`
      );
      if (sentraPadi.length > 0) {
        let text = `DETAIL KECAMATAN SENTRA PADI (${sentraPadi[0].tahun}):\n`;
        for (const s of sentraPadi) {
          text += `- Kec. ${s.kecamatan}: Produksi ${Number(s.produksi_ton).toLocaleString("id-ID")} Ton, Luas ${Number(s.luas_ha).toLocaleString("id-ID")} Ha, Produktivitas ${s.produktivitas_ku_ha} Ku/Ha\n`;
        }
        contextParts.push(text);
      }
    }

    // 8. DATA PENGGUNAAN LAHAN
    if (isLahan) {
      try {
        const lahanRows = await q(
          `SELECT jenis_penggunaan, tahun, luas_ha 
           FROM lahan_penggunaan 
           ${requestedYear ? "WHERE tahun = " + requestedYear : ""}
           ORDER BY tahun DESC, luas_ha DESC LIMIT 8`
        );
        if (lahanRows.length > 0) {
          let text = `DATA PENGGUNAAN LAHAN KABUPATEN BANJARNEGARA (${lahanRows[0].tahun}):\n`;
          for (const l of lahanRows) {
            text += `- ${l.jenis_penggunaan}: ${Number(l.luas_ha).toLocaleString("id-ID")} Ha (Tahun ${l.tahun})\n`;
          }
          contextParts.push(text);
        }
      } catch {}
    }

    // 9. PENCARIAN DETAIL SEKTORAL DINAMIS PER KATA KUNCI (Horti, Perkebunan, Palawija, Ternak, Perikanan)
    for (const kw of keywords) {
      if (["hias", "sawit", "kopi", "wortel", "bawang"].includes(kw)) continue;

      // A. Hortikultura Buah & Sayuran (Salak, Kentang, Kubis, Tomat, Cabai, dll)
      const hortiTahunSql = requestedYear ? `h.tahun = ${requestedYear}` : `h.tahun = (SELECT MAX(h2.tahun) FROM horti_produksi h2 WHERE LOWER(h2.komoditas) LIKE '%${kw}%')`;
      const hortiRows = await q(
        `SELECT k.nama as kecamatan, h.komoditas, h.tahun, h.nilai, h.satuan 
         FROM horti_produksi h JOIN kecamatan k ON k.id=h.kecamatan_id 
         WHERE LOWER(h.komoditas) LIKE ? AND ${hortiTahunSql}
         ORDER BY h.nilai ${sortDir} LIMIT 10`,
        [`%${kw}%`]
      );
      if (hortiRows.length > 0) {
        // Ambil juga rekap agregat total tahunan untuk konteks perbandingan
        const hortiMacro = await q(
          `SELECT tahun, SUM(nilai) as total_produksi, satuan 
           FROM horti_produksi 
           WHERE LOWER(komoditas) LIKE ? 
           GROUP BY tahun, satuan 
           ORDER BY tahun DESC LIMIT 4`,
          [`%${kw}%`]
        );
        let text = `DATA RESMI HORTIKULTURA (${hortiRows[0].komoditas.toUpperCase()}):\n`;
        if (hortiMacro.length > 0) {
          text += `RINGKASAN TOTAL PRODUKSI KABUPATEN PER TAHUN:\n`;
          for (const hm of hortiMacro) {
            text += `- Tahun ${hm.tahun}: Total Produksi ${Number(hm.total_produksi).toLocaleString("id-ID")} ${hm.satuan}\n`;
          }
        }
        text += `RINCIAN PER KECAMATAN (TAHUN ${hortiRows[0].tahun}, ${isAsc ? "TERENDAH" : "TERBESAR"}):\n`;
        for (const r of hortiRows) {
          text += `- Kec. ${r.kecamatan}: ${Number(r.nilai).toLocaleString("id-ID")} ${r.satuan}\n`;
        }
        contextParts.push(text);
      }

      // B. Perkebunan (Kopi, Teh, Kelapa, Tembakau, Tebu, Cengkeh, dll)
      const perkTahunSql = requestedYear ? `p.tahun = ${requestedYear}` : `p.tahun = (SELECT MAX(p2.tahun) FROM perkebunan_produksi p2 WHERE LOWER(p2.tanaman) LIKE '%${kw}%')`;
      const perkRows = await q(
        `SELECT k.nama as kecamatan, p.tanaman, p.tahun, p.produksi_ton 
         FROM perkebunan_produksi p JOIN kecamatan k ON k.id=p.kecamatan_id 
         WHERE LOWER(p.tanaman) LIKE ? AND ${perkTahunSql}
         ORDER BY p.produksi_ton ${sortDir} LIMIT 10`,
        [`%${kw}%`]
      );
      if (perkRows.length > 0) {
        let text = `DATA STATISTIK PERKEBUNAN (${perkRows[0].tanaman}, Tahun ${perkRows[0].tahun}):\n`;
        for (const r of perkRows) {
          text += `- Kec. ${r.kecamatan}: ${Number(r.produksi_ton).toLocaleString("id-ID")} Ton\n`;
        }
        contextParts.push(text);
      }

      // C. Palawija (Jagung, Ubi Kayu, Ubi Jalar, Kedelai, Kacang Tanah)
      const palTahunSql = requestedYear ? `p.tahun = ${requestedYear}` : `p.tahun = (SELECT MAX(p2.tahun) FROM palawija_produksi p2 WHERE LOWER(p2.komoditas) LIKE '%${kw}%')`;
      const palRows = await q(
        `SELECT k.nama as kecamatan, p.komoditas, p.tahun, p.luas_panen_ha, p.produksi_ton, p.rata_ku_ha 
         FROM palawija_produksi p JOIN kecamatan k ON k.id=p.kecamatan_id 
         WHERE LOWER(p.komoditas) LIKE ? AND ${palTahunSql}
         ORDER BY p.produksi_ton ${sortDir} LIMIT 10`,
        [`%${kw}%`]
      );
      if (palRows.length > 0) {
        let text = `DETAIL PRODUKSI PALAWIJA (${palRows[0].komoditas}, Tahun ${palRows[0].tahun}):\n`;
        for (const r of palRows) {
          text += `- Kec. ${r.kecamatan}: ${Number(r.produksi_ton).toLocaleString("id-ID")} Ton (Luas Panen ${Number(r.luas_panen_ha).toLocaleString("id-ID")} Ha)\n`;
        }
        contextParts.push(text);
      }

      // D. Peternakan (Sapi, Kambing, Domba, Ayam, Unggas)
      const ternakTahunSql = requestedYear ? `t.tahun = ${requestedYear}` : `t.tahun = (SELECT MAX(t2.tahun) FROM ternak_populasi t2 WHERE LOWER(t2.jenis) LIKE '%${kw}%')`;
      const ternakRows = await q(
        `SELECT k.nama as kecamatan, t.jenis, t.tahun, t.jumlah_ekor 
         FROM ternak_populasi t JOIN kecamatan k ON k.id=t.kecamatan_id 
         WHERE LOWER(t.jenis) LIKE ? AND ${ternakTahunSql}
         ORDER BY t.jumlah_ekor ${sortDir} LIMIT 8`,
        [`%${kw}%`]
      );
      if (ternakRows.length > 0) {
        let text = `DETAIL POPULASI PETERNAKAN (${ternakRows[0].jenis}, Tahun ${ternakRows[0].tahun}):\n`;
        for (const r of ternakRows) {
          text += `- Kec. ${r.kecamatan}: ${Number(r.jumlah_ekor).toLocaleString("id-ID")} ekor\n`;
        }
        contextParts.push(text);
      }

      // E. Produksi Daging Ternak
      if (kw.includes("daging") || queryLower.includes("daging")) {
        const dagingRows = await q(
          `SELECT k.nama as kecamatan, d.jenis, d.tahun, d.produksi_kg 
           FROM ternak_daging d JOIN kecamatan k ON k.id=d.kecamatan_id 
           WHERE LOWER(d.jenis) LIKE ? 
           ORDER BY d.tahun DESC, d.produksi_kg ${sortDir} LIMIT 8`,
          [`%${kw}%`]
        );
        if (dagingRows.length > 0) {
          let text = `PRODUKSI DAGING TERNAK (${dagingRows[0].jenis}, Tahun ${dagingRows[0].tahun}):\n`;
          for (const r of dagingRows) {
            text += `- Kec. ${r.kecamatan}: ${Number(r.produksi_kg).toLocaleString("id-ID")} kg\n`;
          }
          contextParts.push(text);
        }
      }

      // F. Pemotongan Ternak (RPH & Luar RPH)
      if (queryLower.includes("rph") || queryLower.includes("potong") || queryLower.includes("pemotongan")) {
        const potongRows = await q(
          `SELECT k.nama as kecamatan, p.lokasi, p.jenis, p.tahun, p.jumlah_ekor 
           FROM ternak_pemotongan p JOIN kecamatan k ON k.id=p.kecamatan_id 
           WHERE LOWER(p.jenis) LIKE ? 
           ORDER BY p.tahun DESC, p.jumlah_ekor ${sortDir} LIMIT 8`,
          [`%${kw}%`]
        );
        if (potongRows.length > 0) {
          let text = `DATA PEMOTONGAN TERNAK (${potongRows[0].jenis}, Tahun ${potongRows[0].tahun}):\n`;
          for (const r of potongRows) {
            text += `- Kec. ${r.kecamatan} [${r.lokasi}]: ${Number(r.jumlah_ekor).toLocaleString("id-ID")} ekor\n`;
          }
          contextParts.push(text);
        }
      }

      // G. Arus Ternak (Pemasukan & Pengeluaran)
      if (queryLower.includes("pemasukan") || queryLower.includes("pengeluaran") || queryLower.includes("arus ternak")) {
        const flowRows = await q(
          `SELECT k.nama as kecamatan, f.arah, f.jenis, f.tahun, f.jumlah_ekor 
           FROM ternak_flow f JOIN kecamatan k ON k.id=f.kecamatan_id 
           WHERE LOWER(f.jenis) LIKE ? 
           ORDER BY f.tahun DESC, f.jumlah_ekor ${sortDir} LIMIT 8`,
          [`%${kw}%`]
        );
        if (flowRows.length > 0) {
          let text = `ARUS LALU LINTAS TERNAK (${flowRows[0].jenis}, Tahun ${flowRows[0].tahun}):\n`;
          for (const r of flowRows) {
            text += `- Kec. ${r.kecamatan} [${r.arah}]: ${Number(r.jumlah_ekor).toLocaleString("id-ID")} ekor\n`;
          }
          contextParts.push(text);
        }
      }

      // H. Perikanan Budidaya & Tangkap
      if (kw.includes("ikan") || kw.includes("perikanan") || kw.includes("budidaya") || kw.includes("kolam") || kw.includes("karamba") || kw.includes("minapadi")) {
        const ikanTahunSql = requestedYear ? `tahun = ${requestedYear}` : `tahun = (SELECT MAX(tahun) FROM ikan_produksi_jenis)`;
        const ikanJenis = await q(
          `SELECT jenis_ikan, tahun, SUM(produksi_kg) as total_kg 
           FROM ikan_produksi_jenis 
           WHERE ${ikanTahunSql}
           GROUP BY jenis_ikan, tahun
           ORDER BY total_kg DESC LIMIT 10`
        );
        if (ikanJenis.length > 0) {
          let text = `PRODUKSI PERIKANAN RESMI PER JENIS IKAN (TAHUN ${ikanJenis[0].tahun}):\n`;
          for (const ij of ikanJenis) {
            text += `- Ikan ${ij.jenis_ikan}: ${Number(ij.total_kg).toLocaleString("id-ID")} kg (${(Number(ij.total_kg)/1000).toLocaleString("id-ID", {maximumFractionDigits: 2})} Ton)\n`;
          }
          contextParts.push(text);
        }

        const ikanRows = await q(
          `SELECT k.nama as kecamatan, i.jenis_budidaya, i.tahun, i.produksi_kg, i.nilai_ribu_rp 
           FROM ikan_budidaya i JOIN kecamatan k ON k.id=i.kecamatan_id 
           ORDER BY i.tahun DESC, i.produksi_kg DESC LIMIT 8`
        );
        if (ikanRows.length > 0) {
          let text = `DETAIL PERIKANAN BUDIDAYA (${ikanRows[0].tahun}):\n`;
          for (const r of ikanRows) {
            text += `- Kec. ${r.kecamatan} [${r.jenis_budidaya}]: ${Number(r.produksi_kg).toLocaleString("id-ID")} kg\n`;
          }
          contextParts.push(text);
        }
      }
    }

    // 10. DATA HARGA PASAR TERKINI
    if (queryLower.includes("harga") || queryLower.includes("pasar") || queryLower.includes("sembako") || queryLower.includes("murah") || queryLower.includes("mahal") || queryLower.includes("inflasi")) {
      const hargaRows = await q(
        `SELECT komoditas, lokasi_pasar, kecamatan, harga, satuan, perubahan_rp, tanggal 
         FROM harga_pasar_banjarnegara 
         ORDER BY tanggal DESC, harga DESC LIMIT 8`
      );
      if (hargaRows.length > 0) {
        let text = "INFORMASI HARGA KOMODITAS PANGAN PASAR BANJARNEGARA:\n";
        for (const h of hargaRows) {
          text += `- ${h.komoditas} di ${h.lokasi_pasar} (${h.kecamatan}): Rp ${Number(h.harga).toLocaleString("id-ID")}/${h.satuan} [Update: ${h.tanggal.toISOString ? h.tanggal.toISOString().slice(0, 10) : h.tanggal}]\n`;
        }
        contextParts.push(text);
      }
    }

    // 11. NERACA PANGAN KOMPOSIT
    if (queryLower.includes("neraca") || queryLower.includes("surplus") || queryLower.includes("defisit") || queryLower.includes("ketersediaan") || queryLower.includes("konsumsi")) {
      const neracaRows = await q(
        `SELECT komoditas, ketersediaan_bersih_ton, kebutuhan_konsumsi_ton, neraca_ton, status_neraca, tahun 
         FROM neraca_pangan_komposit 
         ORDER BY tahun DESC, neraca_ton DESC LIMIT 8`
      );
      if (neracaRows.length > 0) {
        let text = `NERACA PANGAN KOMPOSIT KABUPATEN BANJARNEGARA (${neracaRows[0].tahun}):\n`;
        for (const n of neracaRows) {
          text += `- ${n.komoditas}: Ketersediaan ${Number(n.ketersediaan_bersih_ton).toLocaleString("id-ID")} Ton, Kebutuhan ${Number(n.kebutuhan_konsumsi_ton).toLocaleString("id-ID")} Ton -> Neraca ${Number(n.neraca_ton).toLocaleString("id-ID")} Ton (${n.status_neraca})\n`;
        }
        contextParts.push(text);
      }
    }

    // 12. FSVA & KETAHANAN PANGAN
    if (queryLower.includes("fsva") || queryLower.includes("ketahanan pangan") || queryLower.includes("kerentanan") || queryLower.includes("rawan pangan")) {
      const fsvaRows = await q(
        `SELECT nomor_indikator, nama_indikator, satuan, standar_norma, nilai_capaian, status_data, tahun 
         FROM fsva_indikator_kabupaten 
         ORDER BY tahun DESC, nomor_indikator ASC LIMIT 8`
      );
      if (fsvaRows.length > 0) {
        let text = `INDIKATOR KETAHANAN & KERENTANAN PANGAN (FSVA ${fsvaRows[0].tahun}):\n`;
        for (const f of fsvaRows) {
          text += `- Indikator #${f.nomor_indikator} ${f.nama_indikator}: Capaian ${f.nilai_capaian} ${f.satuan} (Standar: ${f.standar_norma}) [${f.status_data}]\n`;
        }
        contextParts.push(text);
      }
    }

    // 13. KELEMBAGAAN TANI, KWT, GAPOKTAN, POKDAKAN & PENYULUH
    const isKelembagaanQuery = 
      queryLower.includes("kwt") || 
      queryLower.includes("wanita tani") ||
      queryLower.includes("poktan") || 
      queryLower.includes("kelompok") || 
      queryLower.includes("gapoktan") || 
      queryLower.includes("kelembagaan") || 
      queryLower.includes("lembaga") || 
      queryLower.includes("penyuluh") || 
      queryLower.includes("simluhtan") ||
      queryLower.includes("pokdakan") ||
      queryLower.includes("juleha") ||
      queryLower.includes("upja") ||
      queryLower.includes("p4s");

    if (isKelembagaanQuery) {
      try {
        let targetJenis = null;
        if (queryLower.includes("kwt") || queryLower.includes("wanita tani")) {
          targetJenis = "KWT";
        } else if (queryLower.includes("gapoktan")) {
          targetJenis = "Gapoktan";
        } else if (queryLower.includes("poktan")) {
          targetJenis = "Poktan";
        }

        // Rekapitulasi Umum SIMLUHTAN
        const lembagaSummary = await q(
          `SELECT jenis_lembaga, COUNT(*) as total_lembaga, SUM(jumlah_anggota) as total_petani, SUM(luas_lahan_ha) as total_lahan
           FROM kelembagaan_pertanian
           GROUP BY jenis_lembaga`
        );
        if (lembagaSummary.length > 0) {
          let text = "REKAPITULASI KELEMBAGAAN PETANI KABUPATEN BANJARNEGARA (SIMLUHTAN):\n";
          for (const l of lembagaSummary) {
            text += `- ${l.jenis_lembaga}: ${Number(l.total_lembaga).toLocaleString("id-ID")} Lembaga (${Number(l.total_petani).toLocaleString("id-ID")} Petani terdaftar, Luas Lahan ${Number(l.total_lahan).toLocaleString("id-ID")} Ha)\n`;
          }
          try {
            const [perikananCount] = await q("SELECT COUNT(*) as c FROM kelembagaan_perikanan");
            const [julehaCount] = await q("SELECT COUNT(*) as c FROM kelembagaan_juleha");
            const [p4sCount] = await q("SELECT COUNT(*) as c FROM kelembagaan_p4s");
            const [upjaCount] = await q("SELECT COUNT(*) as c FROM kelembagaan_upja");
            text += `- Pokdakan (Kelompok Perikanan): ${perikananCount.c} Kelompok Binaan\n`;
            text += `- Juru Sembelih Halal (JULEHA): ${julehaCount.c} Unit Terdaftar\n`;
            text += `- Pusat Pelatihan Pertanian Perdesaan Swadaya (P4S): ${p4sCount.c} Lembaga Binaan\n`;
            text += `- Usaha Pelayanan Jasa Alat & Mesin Pertanian (UPJA): ${upjaCount.c} Unit Binaan\n`;
          } catch {}
          contextParts.push(text);
        }

        // Sebaran Spasial & Ranking per Kecamatan
        const needBreakdown = targetJenis || queryLower.includes("kecamatan") || queryLower.includes("desa") || queryLower.includes("sedikit") || queryLower.includes("banyak") || queryLower.includes("paling") || queryLower.includes("mana");
        if (needBreakdown) {
          const filterSql = targetJenis ? "WHERE UPPER(jenis_lembaga) = ?" : "";
          const filterParams = targetJenis ? [targetJenis] : [];

          let kecQuery = `SELECT kecamatan, COUNT(*) as jumlah_lembaga, SUM(jumlah_anggota) as total_petani 
                          FROM kelembagaan_pertanian ${filterSql} 
                          GROUP BY kecamatan 
                          ORDER BY jumlah_lembaga ${sortDir} LIMIT 10`;
          let kecParams = filterParams;

          if (matchedKec) {
            const whereKec = targetJenis 
              ? "WHERE UPPER(jenis_lembaga) = ? AND LOWER(kecamatan) = ?" 
              : "WHERE LOWER(kecamatan) = ?";
            kecQuery = `SELECT kecamatan, COUNT(*) as jumlah_lembaga, SUM(jumlah_anggota) as total_petani 
                        FROM kelembagaan_pertanian ${whereKec} 
                        GROUP BY kecamatan`;
            kecParams = targetJenis ? [targetJenis, matchedKec.toLowerCase()] : [matchedKec.toLowerCase()];
          }

          const kecBreakdown = await q(kecQuery, kecParams);
          if (kecBreakdown.length > 0) {
            const labelJenis = targetJenis || "Kelembagaan Tani";
            let kecText = `DATA SEBARAN ${labelJenis.toUpperCase()} PER KECAMATAN (${isAsc ? "URUTAN PALING SEDIKIT/MINIMAL" : "URUTAN TERBANYAK"}):\n`;
            for (const kb of kecBreakdown) {
              kecText += `- Kec. ${kb.kecamatan}: ${kb.jumlah_lembaga} ${labelJenis} (Total ${Number(kb.total_petani).toLocaleString("id-ID")} Anggota)\n`;
            }
            contextParts.push(kecText);
          }

          // Detail Tingkat Desa
          const needDesa = queryLower.includes("desa") || queryLower.includes("kelurahan") || matchedKec || isAsc;
          if (needDesa) {
            let desaQuery = `SELECT kecamatan, desa, COUNT(*) as jumlah_lembaga, GROUP_CONCAT(nama_kelompok SEPARATOR ', ') as nama_kelompok, SUM(jumlah_anggota) as total_petani 
                             FROM kelembagaan_pertanian ${filterSql} 
                             GROUP BY kecamatan, desa 
                             ORDER BY jumlah_lembaga ${sortDir} LIMIT 12`;
            let desaParams = filterParams;

            if (matchedKec) {
              const whereKecDesa = targetJenis 
                ? "WHERE UPPER(jenis_lembaga) = ? AND LOWER(kecamatan) = ?" 
                : "WHERE LOWER(kecamatan) = ?";
              desaQuery = `SELECT kecamatan, desa, COUNT(*) as jumlah_lembaga, GROUP_CONCAT(nama_kelompok SEPARATOR ', ') as nama_kelompok, SUM(jumlah_anggota) as total_petani 
                           FROM kelembagaan_pertanian ${whereKecDesa} 
                           GROUP BY kecamatan, desa 
                           ORDER BY jumlah_lembaga ${sortDir} LIMIT 15`;
              desaParams = targetJenis ? [targetJenis, matchedKec.toLowerCase()] : [matchedKec.toLowerCase()];
            } else if (isAsc && kecBreakdown.length > 0) {
              const leastKecs = kecBreakdown.slice(0, 3).map(k => `'${k.kecamatan}'`).join(", ");
              const whereLeastKec = targetJenis 
                ? `WHERE UPPER(jenis_lembaga) = ? AND kecamatan IN (${leastKecs})` 
                : `WHERE kecamatan IN (${leastKecs})`;
              desaQuery = `SELECT kecamatan, desa, COUNT(*) as jumlah_lembaga, GROUP_CONCAT(nama_kelompok SEPARATOR ', ') as nama_kelompok, SUM(jumlah_anggota) as total_petani 
                           FROM kelembagaan_pertanian ${whereLeastKec} 
                           GROUP BY kecamatan, desa 
                           ORDER BY jumlah_lembaga ${sortDir} LIMIT 12`;
              desaParams = targetJenis ? [targetJenis] : [];
            }

            const desaBreakdown = await q(desaQuery, desaParams);
            if (desaBreakdown.length > 0) {
              const labelJenis = targetJenis || "Kelembagaan Tani";
              let desaText = `DETAIL TINGKAT DESA (${labelJenis.toUpperCase()}) DI KECAMATAN TERKAIT:\n`;
              for (const db of desaBreakdown) {
                desaText += `- Desa ${db.desa} (Kec. ${db.kecamatan}): ${db.jumlah_lembaga} ${labelJenis} (Nama: ${db.nama_kelompok}, Anggota: ${Number(db.total_petani).toLocaleString("id-ID")})\n`;
              }
              contextParts.push(desaText);
            }
          }
        }
      } catch (lembagaErr) {
        console.warn("[AI-RAG] Kelembagaan query warning:", lembagaErr.message);
      }
    }

    // 14. PSAT PDUK & PENGAWASAN KEAMANAN PANGAN
    if (queryLower.includes("psat") || queryLower.includes("pduk") || queryLower.includes("keamanan pangan") || queryLower.includes("uji") || queryLower.includes("pestisida") || queryLower.includes("izin edar")) {
      const psatRows = await q(
        `SELECT komoditas, nama_pedagang, lokasi_pasar, kecamatan, parameter_uji, hasil_uji, no_registrasi, status 
         FROM psat_pduk 
         ORDER BY id DESC LIMIT 5`
      );
      if (psatRows.length > 0) {
        let text = "PENGAWASAN KEAMANAN PANGAN SEGAR (PSAT-PDUK) BANJARNEGARA:\n";
        for (const p of psatRows) {
          text += `- ${p.komoditas} di ${p.lokasi_pasar} (${p.kecamatan}): Parameter ${p.parameter_uji} -> ${p.hasil_uji} [Status: ${p.status}, No Reg: ${p.no_registrasi || '-'}]\n`;
        }
        contextParts.push(text);
      }
    }

    // 9. Pencarian Katalog Data Terbuka Resmi (CKAN) jika relevan atau diminta pengguna
    const isDatasetQuery = queryLower.includes("data") || 
                           queryLower.includes("dataset") || 
                           queryLower.includes("opendata") || 
                           queryLower.includes("tabel") ||
                           queryLower.includes("download");
    if (isDatasetQuery || keywords.some((k) => ["lahan", "bantuan", "pupuk", "st2023"].includes(k))) {
      try {
        const ckanOrigin = process.env.CKAN_ORIGIN || "https://opendata.banjarnegarakab.go.id";
        const ckanQuery = keywords.slice(0, 2).join(" ");
        const ckanRes = await fetch(`${ckanOrigin}/api/3/action/package_search?q=${encodeURIComponent(ckanQuery || "pertanian")}&rows=4`, {
          signal: AbortSignal.timeout(3000)
        });
        if (ckanRes.ok) {
          const ckanJson = await ckanRes.json();
          if (ckanJson.success && ckanJson.result?.results?.length > 0) {
            let ckanText = "DATASET TERKAIT DI OPENDATA BANJARNEGARA (opendata.banjarnegarakab.go.id):\n";
            for (const ds of ckanJson.result.results) {
              ckanText += `- "${ds.title}" [Instansi: ${ds.organization?.title || ds.organization?.name || "Dinas Terkait"}]\n`;
            }
            contextParts.push(ckanText);
          }
        }
      } catch {
        // Abaikan jika CKAN timeout, jangan hentikan alur chat
      }
    }
  } catch (dbErr) {
    console.warn("[AI-RAG] Database retrieval warning:", dbErr.message);
  }

  return contextParts.join("\n");
}

aiRouter.post("/chat", async (req, res) => {
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";

  // 1. Rate Limiting Protection (Anti-Abuse / Anti-DDoS)
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: "rate_limit_exceeded",
      message: "Terlalu banyak permintaan chat dalam waktu singkat. Silakan tunggu 1 menit."
    });
  }

  // 2. Payload Validation & Sanitization (Anti-Exploit)
  const { messages, stream = true, temperature = 0.6 } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      error: "invalid_payload",
      message: "Daftar pesan (messages) wajib berupa array yang tidak kosong."
    });
  }

  // Batasi panjang histori chat maksimal 30 pesan untuk menghemat token dan cegah buffer overflow
  const safeMessages = messages.slice(-30).map((msg) => ({
    role: msg.role === "assistant" ? "assistant" : msg.role === "system" ? "system" : "user",
    content: typeof msg.content === "string" ? msg.content.slice(0, 15000) : ""
  }));

  // 3. Dynamic Live RAG Search (Dev & Production)
  // Ekstrak pesan terakhir pengguna untuk pencarian live ke MySQL & OpenData
  const lastUserMsg = safeMessages.filter((m) => m.role === "user").pop()?.content || "";
  const dynamicContext = await retrieveDynamicContext(lastUserMsg);

  // 4. Secret Key Guard & Graceful Local Fallback
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[AI-RAG] GEMINI_API_KEY tidak ditemukan di environment. Menggunakan respons faktual basis data langsung.");
    if (stream) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no"
      });
      const localReply = dynamicContext
        ? `Halo! Berdasarkan data riil basis data SISPERTANI Kabupaten Banjarnegara:\n\n${dynamicContext}\n\n*(Catatan: Jawaban disajikan langsung secara faktual dari basis data resmi SISPERTANI Banjarnegara)*`
        : `Halo! Saya Si Pertani, asisten cerdas SISPERTANI Kabupaten Banjarnegara. Saat ini kunci akses \`GEMINI_API_KEY\` belum dikonfigurasi pada file \`.env\` di server produksi.\n\nUntuk pertanyaan data komoditas statistik, silakan sebutkan kata kunci komoditas spesifik (seperti padi, salak, kopi, jagung, ikan, ternak, dsb) agar sistem dapat menarik data langsung dari database.`;
      const lines = localReply.split("\n");
      for (const l of lines) {
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: l + "\n" } }] })}\n\n`);
      }
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    } else {
      return res.json({
        choices: [{
          message: {
            role: "assistant",
            content: dynamicContext
              ? `Halo! Berdasarkan data riil basis data SISPERTANI Kabupaten Banjarnegara:\n\n${dynamicContext}`
              : `Halo! Saya Si Pertani. Konfigurasi GEMINI_API_KEY belum diset pada file .env di server produksi.`
          }
        }]
      });
    }
  }

  const finalMessages = [...safeMessages];
  if (dynamicContext) {
    const ragInstruction = `\n\n[DATA STATISTIK RIIL RESMI DARI DATABASE SISTEM SISPERTANI & OPENDATA BANJARNEGARA]:\n${dynamicContext}\n\nPANDUAN & ATURAN RESPON SI PERTANI:
- KONTEKS DATA SISTEM: Gunakan data statistik riil di atas sebagai rujukan utama. Sebutkan angka produksi, luasan, jumlah kelompok/anggota, kecamatan sentra, dan tahun data faktual yang tercatat di database sistem.
- TAHUN SPESIFIK: Jika pengguna menanyakan tahun spesifik (misal 2023), rujuk data pada tahun 2023 yang tertera di atas. Jika data tahun tersebut tersedia, JANGAN PERNAH menyatakan hanya ada data tahun lain.
- KOMODITAS TERCATAT: Tanaman hias (Agloenema, Krisan, Mawar, Soka) dan Ikan Hias (Koi, Mas Koki, Cupang, Komet) TERCATAT RESMI di SISPERTANI. Jelaskan data dan angka riilnya sesuai ringkasan di atas. JANGAN menyatakan tidak tercatat.
- KOMODITAS DENGAN PRODUKSI 0 / BUKAN SENTRA: Jika pengguna menanyakan komoditas yang bukan sentra Banjarnegara (seperti Kelapa Sawit atau Bawang Merah yang produksinya 0 atau sangat minim), jelaskan secara faktual bahwa Banjarnegara bukan sentra komoditas tersebut dan sebutkan komoditas unggulan aslinya (misal Kopi Robusta, Kelapa Dalam, Kentang, Kubis, Wortel).
- HORTIKULTURA DATARAN TINGGI: Untuk komoditas seperti Wortel, jelaskan bahwa total produksi Banjarnegara sangat besar (puluhan ribu ton) dengan kawasan sentra di dataran tinggi Batur/Dieng.
- Gunakan Bahasa Indonesia yang ramah, ringkas, lugas, profesional, dan objektif. DILARANG menggunakan kata-kata hiperbola atau buzzwords.`;

    if (finalMessages[0]?.role === "system") {
      finalMessages[0] = {
        role: "system",
        content: finalMessages[0].content + ragInstruction
      };
    } else {
      finalMessages.unshift({
        role: "system",
        content: `Kamu adalah "Si Pertani", asisten AI resmi SISPERTANI Kabupaten Banjarnegara (Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara).${ragInstruction}`
      });
    }
  }

  // Batasi parameter agar tidak bisa dieksploitasi pihak luar
  const safePayload = {
    messages: finalMessages,
    temperature: Math.min(Math.max(Number(temperature) || 0.6, 0.1), 1.0),
    max_tokens: Math.min(Number(req.body.max_tokens) || 4096, 8192),
    stream: Boolean(stream)
  };

  // 5. Model Fallback Orchestration
  // Mulai dengan model yang diminta (jika valid) atau default ke model paling cepat & stabil
  const requestedModel = req.body.model;
  const candidateModels = [];
  if (requestedModel && SUPPORTED_MODELS.includes(requestedModel)) {
    candidateModels.push(requestedModel);
  }
  for (const m of SUPPORTED_MODELS) {
    if (!candidateModels.includes(m)) {
      candidateModels.push(m);
    }
  }

  let lastError = null;
  let success = false;

  for (const model of candidateModels) {
    try {
      const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          ...safePayload,
          model: model
        })
      });

      // Jika model sedang overload / 503 / 429 / 404, coba kandidat model berikutnya
      if (upstream.status === 503 || upstream.status === 429 || upstream.status === 404) {
        console.warn(`[AI-PROXY] Model ${model} returned HTTP ${upstream.status}, trying fallback...`);
        lastError = await upstream.text().catch(() => `HTTP ${upstream.status}`);
        continue;
      }

      if (!upstream.ok) {
        const errorText = await upstream.text().catch(() => `HTTP ${upstream.status}`);
        console.error(`[AI-PROXY] Upstream error from ${model} (${upstream.status}):`, errorText);
        return res.status(upstream.status).json({
          error: "upstream_error",
          status: upstream.status,
          message: "Layanan AI mengembalikan status error."
        });
      }

      // Stream sukses
      success = true;
      res.writeHead(upstream.status, {
        "Content-Type": upstream.headers.get("content-type") || "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no"
      });

      if (upstream.body) {
        const nodeReadable = Readable.fromWeb(upstream.body);
        nodeReadable.on("error", (err) => {
          console.error("[AI-PROXY] Stream piping error:", err.message);
          if (!res.writableEnded) res.end();
        });
        req.on("close", () => {
          nodeReadable.destroy();
        });
        nodeReadable.pipe(res);
      } else {
        res.end();
      }
      break;
    } catch (fetchErr) {
      console.error(`[AI-PROXY] Connection error on model ${model}:`, fetchErr.message);
      lastError = fetchErr.message;
    }
  }

  if (!success && !res.headersSent) {
    if (dynamicContext) {
      console.log("[AI-PROXY] Upstream unavilable, streaming local RAG fallback response...");
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no"
      });
      const localReply = `Halo! Berdasarkan data riil basis data SISPERTANI Kabupaten Banjarnegara:\n\n${dynamicContext}\n\n*(Catatan: Jawaban disajikan langsung dari basis data resmi SISPERTANI Banjarnegara)*`;
      const lines = localReply.split("\n");
      for (const l of lines) {
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: l + "\n" } }] })}\n\n`);
      }
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    res.status(503).json({
      error: "service_unavailable",
      message: "Seluruh model AI sedang mengalami beban tinggi. Silakan coba kembali sesaat lagi.",
      details: lastError
    });
  }
});

export default aiRouter;
