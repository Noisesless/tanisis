import express from "express";
import { Readable } from "node:stream";
import { q } from "../db.js";

const aiRouter = express.Router();

// Daftar model Gemini resmi yang didukung dengan fallback otomatis
const SUPPORTED_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-flash-latest"
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
    "bisa", "jelaskan", "sebutkan", "beri", "tahu", "tentang"
  ]);
  const keywords = rawWords.filter((w) => !stopWords.has(w));
  if (keywords.length === 0) keywords.push("unggulan");

  const contextParts = [];

  try {
    // 1. Cari komoditas unggulan & valuasi ekonomi (komoditas_unggulan)
    const unggulanList = [];
    for (const kw of keywords) {
      const rows = await q(
        `SELECT sektor, nama_komoditas, satuan, kecamatan, sentra, produksi, nilai_ekonomi, tahun 
         FROM komoditas_unggulan 
         WHERE LOWER(nama_komoditas) LIKE ? OR LOWER(sektor) LIKE ? 
         ORDER BY produksi DESC LIMIT 6`,
        [`%${kw}%`, `%${kw}%`]
      );
      for (const r of rows) {
        if (!unggulanList.some((u) => u.nama_komoditas === r.nama_komoditas && u.tahun === r.tahun)) {
          unggulanList.push(r);
        }
      }
    }
    if (unggulanList.length > 0) {
      let text = "RINGKASAN DATA KOMODITAS UNGGULAN SISTEM:\n";
      for (const u of unggulanList) {
        text += `- ${u.nama_komoditas} [Sektor ${u.sektor}, Tahun ${u.tahun}]: Total Produksi ${Number(u.produksi).toLocaleString("id-ID")} ${u.satuan || "Ton"}, Sentra: Kec. ${u.kecamatan || u.sentra || "Banjarnegara"}${u.nilai_ekonomi > 0 ? `, Estimasi Nilai: Rp ${Number(u.nilai_ekonomi).toLocaleString("id-ID")}` : ""}\n`;
      }
      contextParts.push(text);
    }

    // 2. DATA PADI & BERAS (Agregasi Akurat Sawah + Ladang)
    if (queryLower.includes("padi") || queryLower.includes("beras") || queryLower.includes("panen")) {
      const macroPadi = await q(
        `SELECT tahun, SUM(luas_panen_ha) as total_luas, SUM(produksi_ton) as total_produksi
         FROM padi_produksi GROUP BY tahun ORDER BY tahun DESC LIMIT 3`
      );
      if (macroPadi.length > 0) {
        let text = "DATA RESMI PRODUKSI PADI KABUPATEN BANJARNEGARA (TOTAL KABUPATEN):\n";
        for (const m of macroPadi) {
          text += `- Tahun ${m.tahun}: Total Produksi ${Number(m.total_produksi).toLocaleString("id-ID")} Ton, Luas Panen ${Number(m.total_luas).toLocaleString("id-ID")} Ha\n`;
        }
        contextParts.push(text);
      }

      const sentraPadi = await q(
        `SELECT k.nama as kecamatan, p.tahun, 
                SUM(p.luas_panen_ha) as luas_ha, 
                SUM(p.produksi_ton) as produksi_ton,
                ROUND(SUM(p.produksi_ton) * 10 / NULLIF(SUM(p.luas_panen_ha), 0), 2) as produktivitas_ku_ha
         FROM padi_produksi p JOIN kecamatan k ON k.id=p.kecamatan_id 
         WHERE p.tahun = (SELECT MAX(tahun) FROM padi_produksi)
         GROUP BY k.nama, p.tahun
         ORDER BY produksi_ton DESC LIMIT 8`
      );
      if (sentraPadi.length > 0) {
        let text = `DETAIL KECAMATAN SENTRA PADI TAHUN TERBARU (${sentraPadi[0].tahun}):\n`;
        for (const s of sentraPadi) {
          text += `- Kec. ${s.kecamatan}: Produksi ${Number(s.produksi_ton).toLocaleString("id-ID")} Ton, Luas ${Number(s.luas_ha).toLocaleString("id-ID")} Ha, Produktivitas ${s.produktivitas_ku_ha} Ku/Ha\n`;
        }
        contextParts.push(text);
      }
    }

    // 3. Cari detail produksi sektoral per kecamatan
    for (const kw of keywords) {
      // Perkebunan (Kopi, Teh, Kelapa, Karet, Kakao, Tembakau, Tebu, Cengkeh, dll)
      const perkRows = await q(
        `SELECT k.nama as kecamatan, p.tanaman, p.tahun, p.produksi_ton 
         FROM perkebunan_produksi p JOIN kecamatan k ON k.id=p.kecamatan_id 
         WHERE LOWER(p.tanaman) LIKE ? 
         ORDER BY p.tahun DESC, p.produksi_ton DESC LIMIT 8`,
        [`%${kw}%`]
      );
      if (perkRows.length > 0) {
        let text = `DETAIL STATISTIK PERKEBUNAN (${perkRows[0].tanaman}, Tahun ${perkRows[0].tahun}):\n`;
        for (const r of perkRows) {
          text += `- Kec. ${r.kecamatan}: ${Number(r.produksi_ton).toLocaleString("id-ID")} Ton\n`;
        }
        contextParts.push(text);
      }

      // Palawija (Jagung, Kedelai, Ubi Kayu, Ubi Jalar, Kacang Tanah, Kacang Hijau)
      const palRows = await q(
        `SELECT k.nama as kecamatan, p.komoditas, p.tahun, p.luas_panen_ha, p.produksi_ton, p.rata_ku_ha 
         FROM palawija_produksi p JOIN kecamatan k ON k.id=p.kecamatan_id 
         WHERE LOWER(p.komoditas) LIKE ? 
         ORDER BY p.tahun DESC, p.produksi_ton DESC LIMIT 8`,
        [`%${kw}%`]
      );
      if (palRows.length > 0) {
        let text = `DETAIL PRODUKSI PALAWIJA (${palRows[0].komoditas}, Tahun ${palRows[0].tahun}):\n`;
        for (const r of palRows) {
          text += `- Kec. ${r.kecamatan}: ${Number(r.produksi_ton).toLocaleString("id-ID")} Ton (Luas ${Number(r.luas_panen_ha).toLocaleString("id-ID")} Ha)\n`;
        }
        contextParts.push(text);
      }

      // Hortikultura (Salak, Kentang, Cabai, Kubis, Tomat, Durian, Pisang, dll)
      const hortiRows = await q(
        `SELECT k.nama as kecamatan, h.komoditas, h.tahun, COALESCE(h.produksi_ton, h.nilai) as nilai, 'Ton' as satuan 
         FROM horti_produksi h JOIN kecamatan k ON k.id=h.kecamatan_id 
         WHERE LOWER(h.komoditas) LIKE ? 
         ORDER BY h.tahun DESC, nilai DESC LIMIT 8`,
        [`%${kw}%`]
      );
      if (hortiRows.length > 0) {
        let text = `DETAIL PRODUKSI HORTIKULTURA (${hortiRows[0].komoditas}, Tahun ${hortiRows[0].tahun}):\n`;
        for (const r of hortiRows) {
          text += `- Kec. ${r.kecamatan}: ${Number(r.nilai).toLocaleString("id-ID")} ${r.satuan}\n`;
        }
        contextParts.push(text);
      }

      // Peternakan (Sapi, Kambing, Domba, Unggas, Ayam, Itik)
      const ternakRows = await q(
        `SELECT k.nama as kecamatan, t.jenis, t.tahun, t.jumlah_ekor 
         FROM ternak_populasi t JOIN kecamatan k ON k.id=t.kecamatan_id 
         WHERE LOWER(t.jenis) LIKE ? 
         ORDER BY t.tahun DESC, t.jumlah_ekor DESC LIMIT 8`,
        [`%${kw}%`]
      );
      if (ternakRows.length > 0) {
        let text = `DETAIL POPULASI PETERNAKAN (${ternakRows[0].jenis}, Tahun ${ternakRows[0].tahun}):\n`;
        for (const r of ternakRows) {
          text += `- Kec. ${r.kecamatan}: ${Number(r.jumlah_ekor).toLocaleString("id-ID")} ekor\n`;
        }
        contextParts.push(text);
      }

      // Perikanan (Berdasarkan Metode Budidaya)
      if (kw.includes("ikan") || kw.includes("perikanan") || kw.includes("budidaya") || kw.includes("kolam") || kw.includes("karamba") || kw.includes("minapadi")) {
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

    // 4. DATA HARGA PASAR TERKINI
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

    // 5. NERACA PANGAN KOMPOSIT
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

    // 6. FSVA & KETAHANAN PANGAN
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

    // 7. KELEMBAGAAN TANI & PENYULUH
    if (queryLower.includes("kelompok") || queryLower.includes("poktan") || queryLower.includes("gapoktan") || queryLower.includes("kelembagaan") || queryLower.includes("lembaga") || queryLower.includes("penyuluh") || queryLower.includes("simluhtan")) {
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
        contextParts.push(text);
      }
    }

    // 8. PSAT PDUK & PENGAWASAN KEAMANAN PANGAN
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

  // 2. Secret Key Guard
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "config_error",
      message: "GEMINI_API_KEY belum dikonfigurasi di server."
    });
  }

  // 3. Payload Validation & Sanitization (Anti-Exploit)
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

  // 4. Dynamic Live RAG Search (Dev & Production)
  // Ekstrak pesan terakhir pengguna untuk pencarian live ke MySQL & OpenData
  const lastUserMsg = safeMessages.filter((m) => m.role === "user").pop()?.content || "";
  const dynamicContext = await retrieveDynamicContext(lastUserMsg);

  const finalMessages = [...safeMessages];
  if (dynamicContext) {
    const ragInstruction = `\n\n[DATA STATISTIK RIIL RESMI DARI DATABASE SISTEM SISPERTANI & OPENDATA BANJARNEGARA]:\n${dynamicContext}\n\nPANDUAN & ATURAN RESPON SI PERTANI:
- KONTEKS WAKTU SISTEM: Tahun berjalan saat ini adalah 2025/2026. Data statistik tahun 2025 pada konteks di atas ADALAH DATA RESMI AKTUAL yang telah terekam lengkap di database SISPERTANI. JANGAN PERNAH menyatakan bahwa data 2025 belum ada, belum dirilis, atau masih dalam proyeksi.
- Berikan jawaban yang LANGSUNG, SPESIFIK, dan FAKTUAL menggunakan data riil di atas (sebutkan angka produksi, satuan, kecamatan sentra, produktivitas, dan tahunnya).
- DILARANG MENOLAK MENJAWAB atau mengeluarkan pesan penolakan jika data komoditas/indikator tersebut ada dalam ringkasan di atas.
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
