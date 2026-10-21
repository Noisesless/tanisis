/**
 * Rule-Based Natural Language Generator (NLG) — SISPERTANI Banjarnegara
 * Mengubah data terstruktur hasil kueri database dan pengetahuan offline
 * menjadi kalimat narasi bahasa Indonesia yang luwes, santun, dan komunikatif.
 */

/**
 * Format angka ribuan dengan pemisah titik ala Indonesia.
 */
export function formatNum(num) {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return Number(num).toLocaleString("id-ID");
}

/**
 * Mengonversi ringkasan teks database kasar menjadi narasi percakapan yang alami.
 * @param {string} rawContext Hasil dari retrieveDynamicContext()
 * @param {Array<object>} kbItems Hasil dari lookupOfflineKB()
 * @param {string} userQuery Pertanyaan pengguna
 * @returns {string} Respon bahasa alami yang telah disintesis
 */
export function synthesizeNaturalResponse(rawContext, kbItems = [], userQuery = "") {
  const parts = [];

  // 1. Pembuka Santun & Kontekstual
  parts.push("Halo! Saya **Si Pertani**, asisten informasi resmi Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara.");

  let hasData = false;

  // 2. Olah Data Statistik Database jika ada
  if (rawContext && typeof rawContext === "string" && rawContext.trim().length > 0) {
    hasData = true;
    const transformedSections = transformRawContextToNarrative(rawContext);
    if (transformedSections) {
      parts.push(transformedSections);
    }
  }

  // 3. Olah Pengetahuan Kualitatif / SOP dari Knowledge Base jika ada
  if (kbItems && kbItems.length > 0) {
    hasData = true;
    for (const kb of kbItems) {
      let kbText = `### 📋 ${kb.title}\n${kb.summary}\n\n**Panduan Teknis & Rekomendasi Lapangan:**\n`;
      for (const guide of kb.guidance) {
        kbText += `- ${guide}\n`;
      }
      parts.push(kbText);
    }
  }

  // 4. Jika tidak ada data spesifik yang cocok sama sekali
  if (!hasData) {
    parts.push(
      "Data spesifik yang Anda cari belum tercatat pada basis data kami atau memerlukan kata kunci yang lebih spesifik.\n\n" +
      "**Anda dapat menanyakan hal-hal berikut secara spesifik:**\n" +
      "1. **Target Perencanaan & Renstra:** *\"Target padi renstra 2019\"*, *\"Indikator IKU renstra 2025\"*, atau *\"Evaluasi renstra 2019\"*.\n" +
      "2. **Komoditas & Produksi:** *\"Berapa produksi padi di Susukan?\"*, *\"Komoditas unggulan Karangkobar\"*, atau *\"Populasi sapi di Batur\"*.\n" +
      "3. **Hortikultura & Sayuran:** *\"Produksi wortel Dieng\"*, *\"Tanaman hias Banjarnegara\"*, atau *\"Budidaya salak pondoh\"*.\n" +
      "4. **Kelembagaan & Bantuan:** *\"Jumlah kelompok wanita tani (KWT)\"*, *\"Program bantuan alsintan\"*, atau *\"Hasil sensus ST2023\"*.\n" +
      "5. **Ketahanan Pangan:** *\"Peta FSVA kerentanan pangan desa\"*, *\"Lumbung pangan masyarakat\"*, atau *\"Neraca pangan beras\"*."
    );
  } else {
    // Penutup Informatif
    parts.push(
      "*(Informasi di atas bersumber langsung dari data resmi Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara. Silakan sebutkan topik atau komoditas lain jika Anda memerlukan rincian lebih lanjut.)*"
    );
  }

  return parts.join("\n\n");
}

/**
 * Mengubah blok teks teknis huruf besar dari retrieveDynamicContext() menjadi paragraf naratif yang ramah.
 */
function transformRawContextToNarrative(rawContext) {
  // Pisahkan per bagian berdasarkan double newline
  const sections = rawContext.split("\n\n");
  const narrativeSections = [];

  for (const sec of sections) {
    const trimmed = sec.trim();
    if (!trimmed) continue;

    if (trimmed.includes("RINGKASAN DATA KOMODITAS UNGGULAN SISTEM")) {
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      if (lines.length > 0) {
        let secText = "### 🌾 Data Komoditas Unggulan Terverifikasi\n";
        secText += "Berdasarkan evaluasi statistik produksi dan nilai ekonomi daerah, komoditas unggulan yang tercatat aktif meliputi:\n\n";
        for (const l of lines) {
          // Bersihkan awalan "- "
          const content = l.replace(/^-\s*/, "");
          secText += `• **${content}**\n`;
        }
        narrativeSections.push(secText);
      }
    } else if (trimmed.includes("KELOMPOK TANAMAN HIAS HORTIKULTURA")) {
      let secText = "### 🌸 Komoditas Tanaman Hias Banjarnegara\n";
      secText += "Sektor hortikultura Kabupaten Banjarnegara mencatat potensi tanaman hias komersial aktif. Rincian volume produksi resmi:\n\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- ") && !l.includes("FAKTA SISTEM"));
      for (const l of lines) {
        secText += `• ${l.replace(/^-\s*/, "")}\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("BUDIDAYA IKAN HIAS")) {
      let secText = "### 🐠 Komoditas Ikan Hias Air Tawar\n";
      secText += "Budidaya perikanan air tawar Banjarnegara mengembangkan varietas ikan hias unggul dengan rincian volume populasi dan nilai estimasi:\n\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- ") && !l.includes("FAKTA SISTEM"));
      for (const l of lines) {
        secText += `• ${l.replace(/^-\s*/, "")}\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("PRODUKSI PADI KABUPATEN BANJARNEGARA")) {
      let secText = "### 🌾 Statistik Produksi Padi Daerah\n";
      secText += "Realisasi panen padi (gabungan padi sawah dan ladang) Kabupaten Banjarnegara mencatatkan capaian sebagai berikut:\n\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      for (const l of lines) {
        secText += `• ${l.replace(/^-\s*/, "")}\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("KELEMBAGAAN PETANI KABUPATEN BANJARNEGARA")) {
      let secText = "### 👥 Rekapitulasi Kelembagaan Petani (SIMLUHTAN)\n";
      secText += "Data binaan dinas pada sistem penyuluhan pertanian mencatat kelembagaan tani aktif sebagai berikut:\n\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      for (const l of lines) {
        secText += `• ${l.replace(/^-\s*/, "")}\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("VALIDASI FSVA-DESA BANJARNEGARA")) {
      let secText = "### 🛡️ Peta Ketahanan & Kerentanan Pangan (FSVA Desa)\n";
      secText += "Berdasarkan pemetaan 16 indikator fisik dan rasio Badan Pangan Nasional (Bapanas), desa dengan prioritas atensi meliputi:\n\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      for (const l of lines) {
        secText += `• ${l.replace(/^-\s*/, "")}\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("TARGET DOKUMEN RENSTRA RESMI")) {
      let secText = "### 🎯 Target Indikator Renstra Distankan KP\n";
      secText += "Berdasarkan dokumen resmi Rencana Strategis (Renstra) Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara:\n\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      for (const l of lines) {
        secText += `• **${l.replace(/^-\s*/, "")}**\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("DATA REALISASI STATISTIK LAPANGAN TAHUN 2019")) {
      let secText = "### 📈 Evaluasi Ketercapaian Target Renstra (Realisasi 2019)\n";
      secText += "Perbandingan capaian riil statistik pertanian di lapangan terhadap target dokumen Renstra:\n\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      for (const l of lines) {
        secText += `• ${l.replace(/^-\s*/, "")}\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("DATA PROGRAM BANTUAN PEMERINTAH")) {
      let secText = "### 🚜 Program Bantuan Alsintan & Saprodi Dinas\n";
      secText += "Alokasi program bantuan sarana dan prasarana pertanian Kabupaten Banjarnegara:\n\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      for (const l of lines) {
        secText += `• ${l.replace(/^-\s*/, "")}\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("DATA RESMI SENSUS PERTANIAN ST2023")) {
      let secText = "### 📊 Rekapitulasi Sensus Pertanian ST2023 (BPS Banjarnegara)\n";
      secText += "Profil demografi dan sebaran rumah tangga petani menurut hasil Sensus Pertanian BPS:\n\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      for (const l of lines) {
        secText += `• ${l.replace(/^-\s*/, "")}\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("DATA LUMBUNG PANGAN MASYARAKAT")) {
      let secText = "### 🏛️ Data Cadangan & Lumbung Pangan Masyarakat (LPM)\n";
      secText += "Kapasitas simpan cadangan pangan fisik di tingkat kelompok dan kecamatan:\n\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      for (const l of lines) {
        secText += `• ${l.replace(/^-\s*/, "")}\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("DATA PRODUKSI TELUR PETERNAKAN") || trimmed.includes("UNIT USAHA BERSERTIFIKAT NOMOR KONTROL VETERINER")) {
      let secText = "### 🥚 Hilirisasi Peternakan & Sertifikasi Higienitas\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      for (const l of lines) {
        secText += `• ${l.replace(/^-\s*/, "")}\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("DATA PRODUKSI BENIH IKAN") || trimmed.includes("DATA PERIKANAN TANGKAP PERAIRAN UMUM")) {
      let secText = "### 🐟 Perikanan Benih & Tangkap Perairan Umum\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      for (const l of lines) {
        secText += `• ${l.replace(/^-\s*/, "")}\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("DATASET TERKAIT DI OPENDATA")) {
      let secText = "### 🌐 Katalog Open Data Terkait\n";
      secText += "Dataset terbuka yang dapat diunduh melalui portal Open Data Banjarnegara:\n\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      for (const l of lines) {
        secText += `• ${l.replace(/^-\s*/, "")}\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("DATA PASAR RESMI DI KABUPATEN BANJARNEGARA")) {
      let secText = "### 🛒 Titik Lokasi Pasar Resmi di Banjarnegara\n";
      secText += "Berdasarkan basis data geospasial resmi SISPERTANI Kabupaten Banjarnegara, berikut lokasi pasar yang tercatat:\n\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      for (const l of lines) {
        secText += `• **${l.replace(/^-\s*/, "")}**\n`;
      }
      narrativeSections.push(secText);
    } else if (trimmed.includes("DATA TOKO PETERNAKAN & POULTRY SHOP")) {
      let secText = "### 🏪 Sebaran Toko Pakan Ternak & Poultry Shop Terverifikasi\n";
      secText += "Berdasarkan basis data peternakan dan sarana produksi SISPERTANI Banjarnegara:\n\n";
      const lines = trimmed.split("\n").filter((l) => l.startsWith("- "));
      for (const l of lines) {
        secText += `• **${l.replace(/^-\s*/, "")}**\n`;
      }
      narrativeSections.push(secText);
    } else {
      // Format umum untuk blok data lainnya
      narrativeSections.push(trimmed);
    }
  }

  return narrativeSections.join("\n\n");
}
