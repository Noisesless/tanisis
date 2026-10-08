var e = {
  name: `SISPERTANI`,
  version: `2.4.0`,
  releaseDate: `Oktober 2026`,
  description: `Sistem Informasi Pertanian Kabupaten Banjarnegara.`,
  navGroups: [
    {
      category: `EKSEKUTIF & SPASIAL`,
      title: ``,
      items: [
        { label: `Dashboard Eksekutif`, href: `/` },
        { label: `Peta Geospasial GIS`, href: `/sebaran/pangan` }
      ]
    },
    {
      category: `SEKTOR KOMODITAS`,
      title: `Tanaman Pangan`,
      subtitle: `Padi, Jagung & Palawija`,
      icon: `pangan`,
      items: [
        { label: `Produksi Padi & Palawija`, href: `/food-crops` },
        { label: `Komoditas Unggulan Pangan`, href: `/komoditas-unggulan/pangan` },
        { label: `Nilai Ekonomi Pangan`, href: `/nilai-ekonomi/pangan` },
        { label: `LTT & Kalender Tanam`, href: `/ltt-katam` },
        { label: `Prediksi Panen`, href: `/prediction` }
      ]
    },
    {
      title: `Hortikultura`,
      subtitle: `Sayuran, Buah & Biofarmaka`,
      icon: `horti`,
      items: [
        { label: `Produksi Sayuran & Buah`, href: `/horticulture` },
        { label: `Komoditas Unggulan Hortikultura`, href: `/komoditas-unggulan/hortikultura` },
        { label: `Nilai Ekonomi Hortikultura`, href: `/nilai-ekonomi/hortikultura` }
      ]
    },
    {
      title: `Perkebunan`,
      subtitle: `Kopi, Teh, Kelapa & Tembakau`,
      icon: `kebun`,
      items: [
        { label: `Produksi Perkebunan`, href: `/plantation` },
        { label: `Komoditas Unggulan Perkebunan`, href: `/komoditas-unggulan/perkebunan` },
        { label: `Nilai Ekonomi Perkebunan`, href: `/nilai-ekonomi/perkebunan` }
      ]
    },
    {
      title: `Peternakan & Keswan`,
      subtitle: `Domba Batur, Populasi & RPH`,
      icon: `ternak`,
      items: [
        { label: `Populasi Ternak`, href: `/livestock` },
        { label: `Produksi & Hasil Ikutan`, href: `/peternakan/susu-kulit` },
        { label: `Komoditas Unggulan Peternakan`, href: `/komoditas-unggulan/peternakan` },
        { label: `Nilai Ekonomi & Ekosistem Usaha`, href: `/nilai-ekonomi/peternakan` },
        { label: `Lalu Lintas, Pasar & RPH`, href: `/livestock-flow` }
      ]
    },
    {
      title: `Perikanan Air Tawar`,
      subtitle: `Budidaya Kolam, Waduk & Benih`,
      icon: `ikan`,
      items: [
        { label: `Produksi & Budidaya Ikan`, href: `/fisheries` },
        { label: `Komoditas Unggulan Perikanan`, href: `/komoditas-unggulan/perikanan` },
        { label: `Nilai Ekonomi Perikanan`, href: `/economic-value` }
      ]
    },
    {
      category: `KEBIJAKAN & ANALITIK`,
      title: `Ketahanan Pangan (Bapanas)`,
      subtitle: `Neraca Beras & Peta FSVA`,
      icon: `ketapang`,
      items: [
        { label: `Ketersediaan Beras & Lumbung`, href: `/food-security` },
        { label: `Peta Kerawanan Pangan (FSVA)`, href: `/fsva` },
        { label: `Rantai Pasok & Distribusi`, href: `/supply-chain` },
        { label: `Fluktuasi Harga & Inflasi`, href: `/price-volatility` },
        { label: `Keamanan Pangan (PSAT-PDUK)`, href: `/psat-pduk` }
      ]
    },
    {
      title: `Perencanaan & Renstra`,
      subtitle: `Target Kinerja & Sensus ST2023`,
      icon: `renstra`,
      items: [
        { label: `Analisis Renstra & RKPD`, href: `/renstra` },
        { label: `Rekomendasi Kebijakan Dinas`, href: `/recommendations` },
        { label: `Sensus Pertanian 2023 (BPS)`, href: `/sensus-2023` }
      ]
    },
    {
      category: `KELEMBAGAAN & DATA`,
      title: `Kelembagaan Tani`,
      subtitle: `Poktan, KEP & Penyuluhan`,
      icon: `lembaga`,
      items: [
        { label: `Tani, Gapoktan & KWT`, href: `/farmers?klaster=tani` },
        { label: `Ekonomi & Penyuluhan`, href: `/farmers?klaster=ekonomi` },
        { label: `Sektoral & Pendukung`, href: `/farmers?klaster=sektoral` }
      ]
    },
    {
      title: `Bantuan & Sarana Prasarana`,
      subtitle: `Alsintan & Benih Pemerintah`,
      icon: `bantuan`,
      items: [
        { label: `Analisis & Sebaran Bantuan`, href: `/government-assistance` }
      ]
    },
    {
      title: `Data Lahan & Geografi`,
      subtitle: `Tutupan Lahan & Kecamatan`,
      icon: `lahan`,
      items: [
        { label: `Luas & Penggunaan Lahan`, href: `/lahan` },
        { label: `Kesesuaian Lahan`, href: `/suitability` },
        { label: `Profil 20 Kecamatan`, href: `/kecamatan` }
      ]
    }
  ],
  navItems: []
};

for (let t of e.navGroups) {
  for (let n of t.items) {
    e.navItems.push(n);
  }
}

export { e as t };