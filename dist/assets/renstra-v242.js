import { g as e, i as t, t as n } from "./default-CAKe9ffW.js";
import { t as r } from "./arrow-right-Z7jtJnlf.js";
import { i } from "./x-CXWFwwzx.js";
import { t as a } from "./circle-check-PxHdRpHr.js";
import { n as o, t as s } from "./file-text-lGWqWg17.js";
import { t as c } from "./printer-BDcaNACb.js";
import { C as l, b as u, p as d } from "./index-CI1XYnwk.js";

var f = l(u(), 1);
var p = d();

// Helper parser angka format ID
function parseVal(v) {
  if (!v || v === '-' || v === '—') return null;
  const clean = String(v).replace(/\./g, '').replace(',', '.').replace('%', '').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? null : num;
}

// Helper gaya badge sektor terstandarisasi (design-system.md)
function getSectorBadge(sektor) {
  const s = (sektor || "").toLowerCase();
  if (s.includes("pangan") && !s.includes("tanaman")) {
    return (0, p.jsx)("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200", children: sektor });
  }
  if (s.includes("tanaman")) {
    return (0, p.jsx)("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200", children: sektor });
  }
  if (s.includes("peternakan")) {
    return (0, p.jsx)("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200", children: sektor });
  }
  if (s.includes("perikanan")) {
    return (0, p.jsx)("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200", children: sektor });
  }
  if (s.includes("horti") || s.includes("kebun")) {
    return (0, p.jsx)("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200", children: sektor });
  }
  return (0, p.jsx)("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200", children: sektor });
}

// Helper badge persentase ketercapaian
function getPercentBadge(pct) {
  if (pct === null || pct === undefined || isNaN(pct)) {
    return (0, p.jsx)("span", { className: "text-slate-400 font-mono text-xs", children: "—" });
  }
  let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
  if (pct >= 100) colorClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
  else if (pct >= 80) colorClass = "bg-amber-50 text-amber-800 border-amber-200";
  else colorClass = "bg-rose-50 text-rose-800 border-rose-200";

  return (0, p.jsxs)("span", {
    className: `inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono tabular-nums border ${colorClass}`,
    children: [pct, "%"]
  });
}

// Format Rupiah
function formatRp(num) {
  if (!num || isNaN(num)) return "Rp 0";
  return "Rp " + Number(num).toLocaleString("id-ID");
}

// =========================================================================
// KOMPONEN: BAR CHART TARGET VS REALISASI INDIKATOR UTAMA
// =========================================================================
function RenstraBarChart({ evaluasiData, periode, is2025 }) {
  const years = is2025 ? [2024, 2025] : [2018, 2019, 2020, 2021, 2022];
  const [selectedYear, setSelectedYear] = (0, f.useState)(is2025 ? 2024 : 2021);

  // Ambil komoditas & indikator utama fisik terverifikasi
  const chartItems = (0, f.useMemo)(() => {
    if (!evaluasiData || evaluasiData.length === 0) return [];

    const candidates = evaluasiData.filter(d => {
      const name = d.indikator.toLowerCase();
      if (is2025) {
        return (
          name.includes("pangan") ||
          name.includes("padi") ||
          name.includes("hortikultura") ||
          name.includes("ternak") ||
          name.includes("perikanan") ||
          name.includes("ikp") ||
          name.includes("ketahanan")
        );
      } else {
        return (
          name.includes("produksi padi") ||
          name.includes("produksi jagung") ||
          name.includes("produksi salak") ||
          name.includes("produksi kentang") ||
          name.includes("populasi sapi") ||
          name.includes("populasi kambing") ||
          name.includes("perikanan budidaya")
        );
      }
    });

    return candidates.slice(0, 7).map(item => {
      let tgtVal = null;
      if (is2025) {
        if (selectedYear === 2024) tgtVal = parseVal(item.target?.baseline);
        else if (selectedYear === 2025) tgtVal = parseVal(item.target?.t1);
      } else {
        if (selectedYear === 2018) tgtVal = parseVal(item.target?.t1);
        else if (selectedYear === 2019) tgtVal = parseVal(item.target?.t2);
        else if (selectedYear === 2020) tgtVal = parseVal(item.target?.t3);
        else if (selectedYear === 2021) tgtVal = parseVal(item.target?.t4);
        else if (selectedYear === 2022) tgtVal = parseVal(item.target?.t5);
      }

      const realVal = item.realisasi?.[selectedYear] ?? null;
      let pct = null;
      if (tgtVal !== null && realVal !== null && tgtVal > 0) {
        pct = Number(((realVal / tgtVal) * 100).toFixed(1));
      }

      return {
        nama: item.indikator,
        sektor: item.sektor,
        satuan: item.satuan,
        target: tgtVal,
        realisasi: realVal,
        prosentase: pct
      };
    });
  }, [evaluasiData, selectedYear, is2025]);

  return (0, p.jsxs)("div", {
    className: "mt-6 pt-6 border-t border-slate-200",
    children: [
      // Header Bar Chart
      (0, p.jsxs)("div", {
        className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4",
        children: [
          (0, p.jsxs)("div", {
            children: [
              (0, p.jsxs)("h4", {
                className: "text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2",
                children: [
                  (0, p.jsx)(s, { size: 16, className: "text-emerald-700" }),
                  "Grafik Komparasi: Target Renstra vs Realisasi Lapangan"
                ]
              }),
              (0, p.jsxs)("p", {
                className: "text-xs text-slate-500 mt-0.5",
                children: [
                  "Visualisasi komparasi angka target dokumen resmi terhadap data transaksi riil tahun ",
                  (0, p.jsx)("strong", { className: "text-slate-800", children: selectedYear })
                ]
              })
            ]
          }),

          // Kontrol Tahun & Legenda
          (0, p.jsxs)("div", {
            className: "flex flex-wrap items-center gap-3",
            children: [
              (0, p.jsxs)("div", {
                className: "flex items-center gap-3 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md",
                children: [
                  (0, p.jsxs)("div", {
                    className: "flex items-center gap-1.5",
                    children: [
                      (0, p.jsx)("span", { className: "w-3 h-3 rounded-xs bg-slate-400" }),
                      (0, p.jsx)("span", { className: "text-slate-600 font-medium text-[11px]", children: "Target" })
                    ]
                  }),
                  (0, p.jsxs)("div", {
                    className: "flex items-center gap-1.5",
                    children: [
                      (0, p.jsx)("span", { className: "w-3 h-3 rounded-xs bg-emerald-600" }),
                      (0, p.jsx)("span", { className: "text-slate-600 font-medium text-[11px]", children: "Realisasi" })
                    ]
                  })
                ]
              }),
              (0, p.jsxs)("div", {
                className: "flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-2xs",
                children: [
                  (0, p.jsx)("span", { className: "text-[11px] font-semibold text-slate-500", children: "Tahun:" }),
                  (0, p.jsx)("select", {
                    value: selectedYear,
                    onChange: e => setSelectedYear(Number(e.target.value)),
                    className: "bg-transparent font-bold text-xs text-slate-800 focus:outline-none cursor-pointer",
                    children: years.map(yr => (0, p.jsx)("option", {
                      value: yr,
                      children: is2025 && yr === 2024 ? "2024 (Baseline Awal)" : is2025 && yr === 2025 ? "2025 (Tahun Berjalan)" : String(yr)
                    }, yr))
                  })
                ]
              })
            ]
          })
        ]
      }),

      // Daftar Bar Chart Horizontal (Normalized Scale per Komoditas)
      (0, p.jsx)("div", {
        className: "space-y-3.5 bg-slate-50/60 border border-slate-200 rounded-lg p-5 shadow-2xs",
        children: chartItems.map((item, idx) => {
          const maxVal = Math.max(item.target || 0, item.realisasi || 0) * 1.15 || 1;
          const tgtPct = item.target ? Math.min(100, (item.target / maxVal) * 100) : 0;
          const realPct = item.realisasi ? Math.min(100, (item.realisasi / maxVal) * 100) : 0;

          return (0, p.jsxs)("div", {
            key: `bar-${idx}`,
            className: "bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs flex flex-col gap-2",
            children: [
              // Header Indikator
              (0, p.jsxs)("div", {
                className: "flex flex-wrap items-center justify-between gap-2",
                children: [
                  (0, p.jsxs)("div", {
                    className: "flex items-center gap-2",
                    children: [
                      getSectorBadge(item.sektor),
                      (0, p.jsx)("span", { className: "font-bold text-xs sm:text-sm text-slate-900", children: item.nama }),
                      (0, p.jsx)("span", { className: "text-[11px] text-slate-500", children: `(${item.satuan})` })
                    ]
                  }),
                  getPercentBadge(item.prosentase)
                ]
              }),

              // Bar Tracks
              (0, p.jsxs)("div", {
                className: "flex flex-col gap-1.5 pt-1",
                children: [
                  // Track Target
                  (0, p.jsxs)("div", {
                    className: "flex items-center gap-2",
                    children: [
                      (0, p.jsx)("span", { className: "w-16 text-[10px] font-semibold text-slate-500 shrink-0 uppercase tracking-wide", children: "Target" }),
                      (0, p.jsx)("div", {
                        className: "flex-1 bg-slate-100 rounded-full h-3 overflow-hidden",
                        children: item.target ? (0, p.jsx)("div", {
                          className: "bg-slate-400 h-full rounded-full transition-all duration-500",
                          style: { width: `${tgtPct}%` }
                        }) : null
                      }),
                      (0, p.jsx)("span", {
                        className: "w-32 text-right font-mono text-[11px] font-medium text-slate-700 shrink-0 tabular-nums",
                        children: item.target ? `${Number(item.target).toLocaleString("id-ID")} ${item.satuan}` : "—"
                      })
                    ]
                  }),

                  // Track Realisasi
                  (0, p.jsxs)("div", {
                    className: "flex items-center gap-2",
                    children: [
                      (0, p.jsx)("span", { className: "w-16 text-[10px] font-semibold text-slate-500 shrink-0 uppercase tracking-wide", children: "Realisasi" }),
                      (0, p.jsx)("div", {
                        className: "flex-1 bg-slate-100 rounded-full h-3 overflow-hidden",
                        children: item.realisasi ? (0, p.jsx)("div", {
                          className: `${item.prosentase >= 100 ? "bg-emerald-600" : item.prosentase >= 80 ? "bg-amber-500" : "bg-rose-500"} h-full rounded-full transition-all duration-500`,
                          style: { width: `${realPct}%` }
                        }) : null
                      }),
                      (0, p.jsx)("span", {
                        className: "w-32 text-right font-mono text-[11px] font-bold text-slate-900 shrink-0 tabular-nums",
                        children: item.realisasi !== null ? `${Number(item.realisasi).toLocaleString("id-ID")} ${item.satuan}` : "— (Belum Ada)"
                      })
                    ]
                  })
                ]
              })
            ]
          });
        })
      })
    ]
  });
}

// =========================================================================
// KOMPONEN UNIFIED: RENSTRA VIEW DENGAN MODEL A
// =========================================================================
function RenstraView({ periode }) {
  const is2025 = periode === "2025-2029";
  const years = is2025 ? [2024, 2025, 2026, 2027, 2028, 2029, 2030] : [2017, 2018, 2019, 2020, 2021, 2022];
  const evalYears = is2025 ? [2024, 2025, 2026, 2027, 2028, 2029] : [2018, 2019, 2020, 2021, 2022];

  // State Model A
  const [analysisMode, setAnalysisMode] = (0, f.useState)("target"); // "target" | "realisasi" | "prosentase" | "ringkasan" | "pagu"
  const [indicatorTab, setIndicatorTab] = (0, f.useState)("sasaran"); // "sasaran" | "program"
  const [selectedSektor, setSelectedSektor] = (0, f.useState)("semua");
  const [searchQuery, setSearchQuery] = (0, f.useState)("");

  // Data Async
  const [evaluasiData, setEvaluasiData] = (0, f.useState)(null);
  const [paguData, setPaguData] = (0, f.useState)(null);
  const [loading, setLoading] = (0, f.useState)(true);

  // Fetch Evaluasi & Pagu
  (0, f.useEffect)(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      fetch(`/api/v1/renstra/evaluasi?periode=${periode}`).then(r => r.json()).catch(() => null),
      fetch(`/api/v1/renstra/pagu?periode=${periode}`).then(r => r.json()).catch(() => null)
    ]).then(([evRes, pgRes]) => {
      if (active) {
        if (evRes && Array.isArray(evRes.data)) setEvaluasiData(evRes.data);
        if (pgRes && Array.isArray(pgRes.data)) setPaguData(pgRes.data);
        setLoading(false);
      }
    });

    return () => { active = false; };
  }, [periode]);

  // Dataset Indikator Sesuai Filter
  const currentIndicators = (0, f.useMemo)(() => {
    if (!evaluasiData) return [];
    return evaluasiData.filter(item => {
      // Sub-filter Sasaran vs Program
      const isTargetSasaran = is2025 ? item.jenis === "IKU" : item.jenis === "SASARAN_RENSTRA";
      const matchType = indicatorTab === "sasaran" ? isTargetSasaran : !isTargetSasaran;
      if (!matchType) return false;

      // Filter Sektor
      const matchSektor = selectedSektor === "semua" || item.sektor.toLowerCase().includes(selectedSektor.toLowerCase());
      if (!matchSektor) return false;

      // Search Query
      const matchSearch = !searchQuery || item.indikator.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [evaluasiData, is2025, indicatorTab, selectedSektor, searchQuery]);

  // Dataset Pagu Sesuai Filter
  const currentPagu = (0, f.useMemo)(() => {
    if (!paguData) return [];
    return paguData.filter(item => {
      const matchSektor = selectedSektor === "semua" || item.sektor.toLowerCase().includes(selectedSektor.toLowerCase());
      if (!matchSektor) return false;
      const matchSearch = !searchQuery || item.program.toLowerCase().includes(searchQuery.toLowerCase()) || item.indikator.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [paguData, selectedSektor, searchQuery]);

  // Summary Metrics
  const totalSasaran = is2025 ? 9 : 43;
  const totalProgram = is2025 ? 18 : 17;

  // Agregasi Ringkasan Sektoral (Mode Ringkasan)
  const sektorSummary = (0, f.useMemo)(() => {
    if (!evaluasiData) return [];
    const map = {};
    for (const item of evaluasiData) {
      const s = item.sektor || "Lainnya";
      if (!map[s]) {
        map[s] = { sektor: s, total: 0, terisi: 0, sumPct: 0, countPct: 0, tercapai: 0, mendekati: 0, perhatian: 0 };
      }
      map[s].total++;

      // Cek apakah ada realisasi di tahun-tahun berjalan
      let hasReal = false;
      for (const yr of evalYears) {
        const pct = item.prosentase?.[yr];
        if (pct !== null && pct !== undefined) {
          hasReal = true;
          map[s].sumPct += pct;
          map[s].countPct++;
          if (pct >= 100) map[s].tercapai++;
          else if (pct >= 80) map[s].mendekati++;
          else map[s].perhatian++;
        }
      }
      if (hasReal) map[s].terisi++;
    }

    return Object.values(map).map(sec => ({
      ...sec,
      avgPct: sec.countPct > 0 ? (sec.sumPct / sec.countPct).toFixed(1) : null
    }));
  }, [evaluasiData, evalYears]);

  return (0, p.jsxs)("div", {
    className: "flex flex-col gap-6",
    children: [
      // 1. TOP METRIC CARDS (3 Kartu Identik)
      (0, p.jsxs)("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
        children: [
          (0, p.jsxs)("div", {
            className: "bg-white border border-slate-200 border-l-4 border-l-emerald-600 rounded-lg p-5 shadow-xs text-left",
            children: [
              (0, p.jsxs)("div", {
                className: "flex items-center justify-between",
                children: [
                  (0, p.jsx)("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Indikator Sasaran" }),
                  (0, p.jsx)("span", { className: "w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center", children: (0, p.jsx)(e, { className: "w-4 h-4" }) })
                ]
              }),
              (0, p.jsxs)("div", { className: "text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums", children: [totalSasaran, " Indikator"] }),
              (0, p.jsx)("p", { className: "text-xs text-slate-500 mt-1", children: is2025 ? "Sasaran kinerja utama dinas (Tabel 4.5)" : "Indikator sasaran daerah & komoditas (Tabel 4.1)" })
            ]
          }),
          (0, p.jsxs)("div", {
            className: "bg-white border border-slate-200 border-l-4 border-l-blue-700 rounded-lg p-5 shadow-xs text-left",
            children: [
              (0, p.jsxs)("div", {
                className: "flex items-center justify-between",
                children: [
                  (0, p.jsx)("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Indikator Program" }),
                  (0, p.jsx)("span", { className: "w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center", children: (0, p.jsx)(a, { className: "w-4 h-4" }) })
                ]
              }),
              (0, p.jsxs)("div", { className: "text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums", children: [totalProgram, " Indikator"] }),
              (0, p.jsx)("p", { className: "text-xs text-slate-500 mt-1", children: is2025 ? "Target indikator kinerja kunci (Tabel 4.7)" : "Indikator program urusan RPJMD (Tabel 7.2)" })
            ]
          }),
          (0, p.jsxs)("div", {
            className: "bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-lg p-5 shadow-xs text-left",
            children: [
              (0, p.jsxs)("div", {
                className: "flex items-center justify-between",
                children: [
                  (0, p.jsx)("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Periode Dokumen" }),
                  (0, p.jsx)("span", { className: "w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center", children: (0, p.jsx)(i, { className: "w-4 h-4" }) })
                ]
              }),
              (0, p.jsx)("div", { className: "text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums", children: is2025 ? "2025–2029" : "2019–2022" }),
              (0, p.jsx)("p", { className: "text-xs text-slate-500 mt-1", children: is2025 ? "Penjabaran RPJMD 2025–2029" : "Penggabungan OPD & Permendagri 90/2019" })
            ]
          })
        ]
      }),

      // 2. STRATEGIC PILLARS (Grid 4 Kotak)
      (0, p.jsxs)("div", {
        className: "print-block bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs text-left",
        children: [
          (0, p.jsxs)("h3", {
            className: "text-sm sm:text-base font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4 flex items-center gap-2",
            children: [
              (0, p.jsx)(s, { size: 18, className: "text-emerald-700" }),
              is2025 ? "Sasaran Strategis Renstra 2025–2029" : "Sasaran Strategis Renstra 2019–2022"
            ]
          }),
          (0, p.jsxs)("div", {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5",
            children: [
              (0, p.jsxs)("div", {
                className: "p-4 rounded-lg border border-slate-200 bg-slate-50/60",
                children: [
                  (0, p.jsxs)("div", {
                    className: "flex items-center gap-2 mb-1.5",
                    children: [
                      (0, p.jsx)("span", { className: "w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center", children: "01" }),
                      (0, p.jsx)("span", { className: "font-semibold text-xs text-slate-900", children: "Ketahanan Pangan" })
                    ]
                  }),
                  (0, p.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed", children: is2025 ? "Target Skor PPH 94,05 dan Indeks Ketahanan Pangan (IKP) 82,29." : "Target Skor PPH 95, cadangan pangan 23%, dan ketersediaan 162.069 ton." })
                ]
              }),
              (0, p.jsxs)("div", {
                className: "p-4 rounded-lg border border-slate-200 bg-slate-50/60",
                children: [
                  (0, p.jsxs)("div", {
                    className: "flex items-center gap-2 mb-1.5",
                    children: [
                      (0, p.jsx)("span", { className: "w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center", children: "02" }),
                      (0, p.jsx)("span", { className: "font-semibold text-xs text-slate-900", children: "Pertanian & Peternakan" })
                    ]
                  }),
                  (0, p.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed", children: is2025 ? "Laju produksi pangan, hortikultura, perkebunan, dan kenaikan populasi ternak." : "Produksi komoditas fisik: Padi, Kentang, Salak, Kopi, dan Domba Batur." })
                ]
              }),
              (0, p.jsxs)("div", {
                className: "p-4 rounded-lg border border-slate-200 bg-slate-50/60",
                children: [
                  (0, p.jsxs)("div", {
                    className: "flex items-center gap-2 mb-1.5",
                    children: [
                      (0, p.jsx)("span", { className: "w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center", children: "03" }),
                      (0, p.jsx)("span", { className: "font-semibold text-xs text-slate-900", children: "Produksi Perikanan" })
                    ]
                  }),
                  (0, p.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed", children: is2025 ? "Peningkatan produksi budidaya (42 rb ton), benih, dan hilirisasi olahan ikan." : "Peningkatan perikanan budidaya (41,9 rb ton) dan benih (2,76 miliar ekor)." })
                ]
              }),
              (0, p.jsxs)("div", {
                className: "p-4 rounded-lg border border-slate-200 bg-slate-50/60",
                children: [
                  (0, p.jsxs)("div", {
                    className: "flex items-center gap-2 mb-1.5",
                    children: [
                      (0, p.jsx)("span", { className: "w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center", children: "04" }),
                      (0, p.jsx)("span", { className: "font-semibold text-xs text-slate-900", children: "Tata Kelola & Layanan" })
                    ]
                  }),
                  (0, p.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed", children: is2025 ? "Target nilai SAKIP 74,60 dan Indeks Pelayanan Publik (IPP) 3,63." : "Target SAKIP predikat BB (73), SKM 78, dan Nilai Tukar Petani (NTP) 105." })
                ]
              })
            ]
          })
        ]
      }),

      // 3. TABEL MATRIKS EVALUASI KINERJA (MODEL A - 5 TAB TERPADU)
      (0, p.jsxs)("div", {
        className: "print-block bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden text-left",
        children: [
          // Header Kontrol & Navigasi Tab
          (0, p.jsxs)("div", {
            className: "p-5 border-b border-slate-200 flex flex-col gap-4",
            children: [
              // Baris Atas: Judul & 5-Segmented Tab Model A
              (0, p.jsxs)("div", {
                className: "flex flex-col lg:flex-row lg:items-center justify-between gap-3",
                children: [
                  (0, p.jsxs)("div", {
                    children: [
                      (0, p.jsx)("h3", {
                        className: "text-sm sm:text-base font-bold text-slate-900",
                        children: analysisMode === "pagu"
                          ? `Kerangka Pendanaan & Pagu Anggaran APBD (${is2025 ? "2025–2029" : "2018–2022"})`
                          : analysisMode === "ringkasan"
                            ? `Ringkasan Ketercapaian Kinerja Sektoral (${is2025 ? "2025–2029" : "2019–2022"})`
                            : `Matriks ${analysisMode === "target" ? "Target" : analysisMode === "realisasi" ? "Realisasi Lapangan" : "Prosentase Ketercapaian"} Kinerja (${is2025 ? "2025–2029" : "2019–2022"})`
                      }),
                      (0, p.jsx)("p", {
                        className: "text-xs text-slate-500 mt-0.5",
                        children: analysisMode === "pagu"
                          ? (is2025 ? "Alokasi pagu indikatif belanja APBD per program/kegiatan dinas (Tabel 4.3)" : "Rencana pendanaan indikatif program perangkat daerah (Bab VI)")
                          : analysisMode === "ringkasan"
                            ? "Status ketercapaian target dinas berdasarkan verifikasi data transaksi riil lapangan"
                            : (indicatorTab === "sasaran"
                              ? (is2025 ? "Indikator Sasaran Kinerja Utama (IKU Dinas — Tabel 4.5)" : "Indikator Sasaran & Komoditas Fisik Renstra (Tabel 4.1)")
                              : (is2025 ? "Indikator Kinerja Kunci Program (IKK — Tabel 4.7)" : "Indikator Program Urusan Penyelenggaraan RPJMD (Tabel 7.2)"))
                      })
                    ]
                  }),

                  // 5-Segmented Tab Model A (Executive Segmented Pill)
                  (0, p.jsxs)("div", {
                    className: "inline-flex flex-wrap items-center gap-1 p-1 rounded-lg border border-slate-200 bg-slate-100 shadow-2xs text-xs font-semibold",
                    children: [
                      { id: "target", label: "Target" },
                      { id: "realisasi", label: "Realisasi" },
                      { id: "prosentase", label: "Prosentase" },
                      { id: "ringkasan", label: "Ringkasan" },
                      { id: "pagu", label: "Pagu Anggaran" }
                    ].map(tab => (0, p.jsx)("button", {
                      type: "button",
                      key: tab.id,
                      onClick: () => setAnalysisMode(tab.id),
                      className: analysisMode === tab.id
                        ? "px-3 py-1.5 rounded-md bg-white text-emerald-800 shadow-xs font-bold transition-all"
                        : "px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-semibold transition-all",
                      children: tab.label
                    }))
                  })
                ]
              }),

              // Baris Bawah: Sub-filter (IKU vs IKK) & Sektor & Search
              (0, p.jsxs)("div", {
                className: "flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100",
                children: [
                  // Sub-filter IKU vs IKK (hanya untuk mode target, realisasi, prosentase)
                  analysisMode !== "pagu" && analysisMode !== "ringkasan" ? (0, p.jsxs)("div", {
                    className: "inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold",
                    children: [
                      (0, p.jsx)("button", {
                        type: "button",
                        onClick: () => setIndicatorTab("sasaran"),
                        className: indicatorTab === "sasaran"
                          ? "px-3 py-1 rounded-md bg-white text-emerald-800 shadow-2xs font-bold"
                          : "px-3 py-1 text-slate-600 hover:text-slate-900",
                        children: is2025 ? "Indikator Sasaran (IKU)" : "Indikator Sasaran (Tabel 4.1)"
                      }),
                      (0, p.jsx)("button", {
                        type: "button",
                        onClick: () => setIndicatorTab("program"),
                        className: indicatorTab === "program"
                          ? "px-3 py-1 rounded-md bg-white text-emerald-800 shadow-2xs font-bold"
                          : "px-3 py-1 text-slate-600 hover:text-slate-900",
                        children: is2025 ? "Indikator Program (IKK)" : "Indikator Program (Tabel 7.2)"
                      })
                    ]
                  }) : (0, p.jsx)("div", {
                    className: "text-xs font-semibold text-slate-500",
                    children: analysisMode === "pagu" ? "Data Pagu Program APBD" : "Agregat Evaluasi Multi-Sektor"
                  }),

                  // Filter Sektor & Pencarian
                  (0, p.jsxs)("div", {
                    className: "flex flex-wrap items-center gap-2",
                    children: [
                      (0, p.jsxs)("select", {
                        "aria-label": "Filter Sektor",
                        value: selectedSektor,
                        onChange: e => setSelectedSektor(e.target.value),
                        className: "bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer",
                        children: [
                          (0, p.jsx)("option", { value: "semua", children: "Semua Sektor" }),
                          (0, p.jsx)("option", { value: "pangan", children: "Pangan & Gizi" }),
                          (0, p.jsx)("option", { value: "tanaman", children: "Tanaman Pangan" }),
                          (0, p.jsx)("option", { value: "horti", children: "Hortikultura & Kebun" }),
                          (0, p.jsx)("option", { value: "peternakan", children: "Peternakan" }),
                          (0, p.jsx)("option", { value: "perikanan", children: "Perikanan" }),
                          (0, p.jsx)("option", { value: "tata kelola", children: "Tata Kelola / Layanan" })
                        ]
                      }),
                      (0, p.jsx)("input", {
                        type: "text",
                        placeholder: analysisMode === "pagu" ? "Cari program..." : "Cari indikator...",
                        value: searchQuery,
                        onChange: e => setSearchQuery(e.target.value),
                        className: "bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-44"
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // Content Switcher Berdasarkan Analysis Mode
          (0, p.jsx)("div", {
            className: "overflow-x-auto",
            children: loading ? (
              (0, p.jsx)("div", { className: "p-8 text-center text-xs text-slate-500", children: "Memuat data matriks kinerja..." })
            ) : analysisMode === "ringkasan" ? (
              // TAMPILAN MODE RINGKASAN: TABEL REKAPITULASI + BAR CHART KOMPARASI
              (0, p.jsxs)("div", {
                className: "p-5",
                children: [
                  (0, p.jsxs)("table", {
                    className: "w-full text-left text-xs border-collapse min-w-[700px]",
                    children: [
                      (0, p.jsx)("thead", {
                        children: (0, p.jsxs)("tr", {
                          className: "border-b border-slate-200 bg-slate-50/80 text-slate-600",
                          children: [
                            (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px]", children: "Bidang Sektor" }),
                            (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-center", children: "Total Indikator" }),
                            (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-center", children: "Data Lapangan" }),
                            (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-center", children: "Tercapai (≥100%)" }),
                            (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-center", children: "Mendekati (80-99%)" }),
                            (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-center", children: "Perlu Perhatian (<80%)" }),
                            (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right", children: "Rata-rata Capaian" })
                          ]
                        })
                      }),
                      (0, p.jsx)("tbody", {
                        className: "divide-y divide-slate-100",
                        children: sektorSummary.map(s => (0, p.jsxs)("tr", {
                          key: s.sektor,
                          className: "hover:bg-slate-50/80 transition-colors",
                          children: [
                            (0, p.jsx)("td", { className: "p-3 font-semibold", children: getSectorBadge(s.sektor) }),
                            (0, p.jsxs)("td", { className: "p-3 text-center font-bold text-slate-700 tabular-nums", children: [s.total, " Indikator"] }),
                            (0, p.jsxs)("td", { className: "p-3 text-center font-medium text-slate-600 tabular-nums", children: [s.terisi, " / ", s.total] }),
                            (0, p.jsx)("td", { className: "p-3 text-center font-bold text-emerald-700 tabular-nums", children: s.tercapai }),
                            (0, p.jsx)("td", { className: "p-3 text-center font-bold text-amber-600 tabular-nums", children: s.mendekati }),
                            (0, p.jsx)("td", { className: "p-3 text-center font-bold text-rose-600 tabular-nums", children: s.perhatian }),
                            (0, p.jsx)("td", { className: "p-3 text-right font-bold tabular-nums", children: getPercentBadge(s.avgPct) })
                          ]
                        }))
                      })
                    ]
                  }),
                  (0, p.jsx)("p", {
                    className: "text-[11px] text-slate-400 mt-4 leading-relaxed",
                    children: "* Catatan: Rata-rata persentase ketercapaian dihitung secara faktual hanya dari indikator yang telah memiliki data statistik transaksi riil di database SISPERTANI. Indikator non-fisik atau tahun yang belum berjalan ditampilkan sebagai status belum terisi (Zero Dummy Data Law)."
                  }),

                  // KOMPONEN BAR CHART KOMPARASI TARGET VS REALISASI INDIKATOR UTAMA
                  (0, p.jsx)(RenstraBarChart, {
                    evaluasiData,
                    periode,
                    is2025
                  })
                ]
              })
            ) : analysisMode === "pagu" ? (
              // TAMPILAN MODE PAGU ANGGARAN (TABEL 4.3)
              (0, p.jsxs)("table", {
                className: "w-full text-left text-xs border-collapse min-w-[850px]",
                children: [
                  (0, p.jsx)("thead", {
                    children: (0, p.jsxs)("tr", {
                      className: "border-b border-slate-200 bg-slate-50/80 text-slate-600",
                      children: [
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] w-12 text-center", children: "No" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px]", children: "Sektor" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] font-mono", children: "Kode" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px]", children: "Program Pembangunan" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px]", children: "Indikator Output" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right", children: is2025 ? "Pagu 2025" : "Pagu 2018" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right", children: is2025 ? "Pagu 2026" : "Pagu 2019" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right", children: is2025 ? "Pagu 2027" : "Pagu 2020" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right", children: is2025 ? "Pagu 2028" : "Pagu 2021" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right bg-emerald-50/60 text-emerald-900 font-bold", children: is2025 ? "Pagu 2029" : "Pagu 2022" })
                      ]
                    })
                  }),
                  (0, p.jsx)("tbody", {
                    className: "divide-y divide-slate-100",
                    children: currentPagu.length === 0 ? (
                      (0, p.jsx)("tr", { children: (0, p.jsx)("td", { colSpan: 10, className: "p-8 text-center text-slate-400 italic", children: "Tidak ada program yang sesuai dengan filter." }) })
                    ) : (
                      currentPagu.map(item => {
                        const pYears = is2025 ? [2025, 2026, 2027, 2028, 2029] : [2018, 2019, 2020, 2021, 2022];
                        return (0, p.jsxs)("tr", {
                          key: item.kode,
                          className: "hover:bg-slate-50/80 transition-colors",
                          children: [
                            (0, p.jsx)("td", { className: "p-3 text-center font-bold text-slate-500 tabular-nums", children: item.no }),
                            (0, p.jsx)("td", { className: "p-3 font-semibold", children: getSectorBadge(item.sektor) }),
                            (0, p.jsx)("td", { className: "p-3 font-mono text-[11px] text-slate-600", children: item.kode }),
                            (0, p.jsx)("td", { className: "p-3 font-bold text-slate-900", children: item.program }),
                            (0, p.jsx)("td", { className: "p-3 text-slate-600 text-[11px]", children: item.indikator }),
                            (0, p.jsx)("td", { className: "p-3 text-right font-mono text-[11px] tabular-nums text-slate-700", children: formatRp(item.pagu[pYears[0]]) }),
                            (0, p.jsx)("td", { className: "p-3 text-right font-mono text-[11px] tabular-nums text-slate-700", children: formatRp(item.pagu[pYears[1]]) }),
                            (0, p.jsx)("td", { className: "p-3 text-right font-mono text-[11px] tabular-nums text-slate-700", children: formatRp(item.pagu[pYears[2]]) }),
                            (0, p.jsx)("td", { className: "p-3 text-right font-mono text-[11px] tabular-nums text-slate-700", children: formatRp(item.pagu[pYears[3]]) }),
                            (0, p.jsx)("td", { className: "p-3 text-right font-mono text-[11px] tabular-nums font-bold text-emerald-900 bg-emerald-50/30", children: formatRp(item.pagu[pYears[4]]) })
                          ]
                        });
                      })
                    )
                  })
                ]
              })
            ) : (
              // TAMPILAN MODE TARGET, REALISASI, PROSENTASE
              (0, p.jsxs)("table", {
                className: "w-full text-left text-xs border-collapse min-w-[760px]",
                children: [
                  (0, p.jsx)("thead", {
                    children: (0, p.jsxs)("tr", {
                      className: "border-b border-slate-200 bg-slate-50/80 text-slate-600",
                      children: [
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] w-12 text-center", children: "No" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px]", children: "Sektor" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px]", children: "Indikator Kinerja" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-center", children: "Satuan" }),
                        analysisMode !== "prosentase" && (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right bg-slate-100/70", children: is2025 ? "2024" : "2017" }),
                        (0, p.jsx)("th", { className: `p-3 font-bold uppercase tracking-wider text-[11px] text-right ${is2025 ? "bg-emerald-50/80 text-emerald-800" : ""}`, children: is2025 ? "2025" : "2018" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right", children: is2025 ? "2026" : "2019" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right", children: is2025 ? "2027" : "2020" }),
                        (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right", children: is2025 ? "2028" : "2021" }),
                        (0, p.jsx)("th", { className: `p-3 font-bold uppercase tracking-wider text-[11px] text-right ${is2025 ? "bg-blue-50/60 text-blue-900 font-bold" : "bg-emerald-50/80 text-emerald-900 font-bold"}`, children: is2025 ? "2029" : "2022" }),
                        is2025 && analysisMode === "target" && (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right text-slate-400", children: "2030" })
                      ].filter(Boolean)
                    })
                  }),
                  (0, p.jsx)("tbody", {
                    className: "divide-y divide-slate-100",
                    children: currentIndicators.length === 0 ? (
                      (0, p.jsx)("tr", {
                        children: (0, p.jsx)("td", {
                          colSpan: is2025 ? 11 : 10,
                          className: "p-8 text-center text-slate-500 text-xs italic",
                          children: "Tidak ada indikator yang sesuai dengan filter pencarian."
                        })
                      })
                    ) : (
                      currentIndicators.map((item, idx) => (0, p.jsxs)("tr", {
                        key: `row-${item.no}-${idx}`,
                        className: "hover:bg-slate-50/80 transition-colors",
                        children: [
                          (0, p.jsx)("td", { className: "p-3 text-center font-bold text-slate-500 tabular-nums", children: item.no }),
                          (0, p.jsx)("td", { className: "p-3 font-semibold", children: getSectorBadge(item.sektor) }),
                          (0, p.jsx)("td", { className: "p-3 font-semibold text-slate-900", children: item.indikator }),
                          (0, p.jsx)("td", { className: "p-3 text-center font-medium text-slate-500 text-[11px]", children: item.satuan }),

                          // Baseline
                          analysisMode !== "prosentase" && (0, p.jsx)("td", {
                            className: "p-3 text-right font-medium text-slate-700 tabular-nums bg-slate-50/50 font-mono",
                            children: item.target?.baseline || "—"
                          }),

                          // Year 1 (2025 / 2018)
                          (0, p.jsx)("td", {
                            className: `p-3 text-right tabular-nums font-mono ${is2025 ? "font-bold text-emerald-800 bg-emerald-50/40" : "font-medium text-slate-600"}`,
                            children: analysisMode === "target"
                              ? (item.target?.t1 || "—")
                              : analysisMode === "realisasi"
                                ? (item.realisasi?.[years[1]] !== null ? Number(item.realisasi[years[1]]).toLocaleString("id-ID") : (0, p.jsx)("span", { className: "text-slate-400", children: "—" }))
                                : getPercentBadge(item.prosentase?.[years[1]])
                          }),

                          // Year 2 (2026 / 2019)
                          (0, p.jsx)("td", {
                            className: "p-3 text-right font-mono font-medium text-slate-600 tabular-nums",
                            children: analysisMode === "target"
                              ? (item.target?.t2 || "—")
                              : analysisMode === "realisasi"
                                ? (item.realisasi?.[years[2]] !== null ? Number(item.realisasi[years[2]]).toLocaleString("id-ID") : (0, p.jsx)("span", { className: "text-slate-400", children: "—" }))
                                : getPercentBadge(item.prosentase?.[years[2]])
                          }),

                          // Year 3 (2027 / 2020)
                          (0, p.jsx)("td", {
                            className: "p-3 text-right font-mono font-medium text-slate-600 tabular-nums",
                            children: analysisMode === "target"
                              ? (item.target?.t3 || "—")
                              : analysisMode === "realisasi"
                                ? (item.realisasi?.[years[3]] !== null ? Number(item.realisasi[years[3]]).toLocaleString("id-ID") : (0, p.jsx)("span", { className: "text-slate-400", children: "—" }))
                                : getPercentBadge(item.prosentase?.[years[3]])
                          }),

                          // Year 4 (2028 / 2021)
                          (0, p.jsx)("td", {
                            className: "p-3 text-right font-mono font-medium text-slate-600 tabular-nums",
                            children: analysisMode === "target"
                              ? (item.target?.t4 || "—")
                              : analysisMode === "realisasi"
                                ? (item.realisasi?.[years[4]] !== null ? Number(item.realisasi[years[4]]).toLocaleString("id-ID") : (0, p.jsx)("span", { className: "text-slate-400", children: "—" }))
                                : getPercentBadge(item.prosentase?.[years[4]])
                          }),

                          // Year 5 (2029 / 2022)
                          (0, p.jsx)("td", {
                            className: `p-3 text-right font-bold tabular-nums font-mono ${is2025 ? "text-blue-900 bg-blue-50/30" : "text-emerald-900 bg-emerald-50/40"}`,
                            children: analysisMode === "target"
                              ? (item.target?.t5 || "—")
                              : analysisMode === "realisasi"
                                ? (item.realisasi?.[years[5]] !== null ? Number(item.realisasi[years[5]]).toLocaleString("id-ID") : (0, p.jsx)("span", { className: "text-slate-400", children: "—" }))
                                : getPercentBadge(item.prosentase?.[years[5]])
                          }),

                          // Year 6 (2030 jika 2025 target)
                          is2025 && analysisMode === "target" && (0, p.jsx)("td", {
                            className: "p-3 text-right font-normal text-slate-400 tabular-nums font-mono",
                            children: item.target?.t6 || "—"
                          })
                        ].filter(Boolean)
                      }))
                    )
                  })
                ]
              })
            )
          })
        ]
      }),

      // 4. SUMBER DOKUMEN & TAUTAN UNDUH (Footer Card)
      (0, p.jsxs)("div", {
        className: "print-block bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs text-left",
        children: [
          (0, p.jsx)("h3", {
            className: "text-sm sm:text-base font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4",
            children: "Sumber Dokumen Resmi"
          }),
          (0, p.jsxs)("ul", {
            className: "space-y-3 text-xs text-slate-600 leading-relaxed",
            children: [
              (0, p.jsxs)("li", {
                className: "flex items-start gap-2.5",
                children: [
                  (0, p.jsx)(r, { size: 14, className: "text-emerald-600 mt-0.5 shrink-0" }),
                  (0, p.jsx)("span", {
                    children: is2025
                      ? "Data target dan pagu anggaran merujuk dokumen Rencana Strategis Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara 2025–2029 (Tabel 4.3, 4.5, dan 4.7)."
                      : "Data target dan pendanaan merujuk dokumen Rencana Strategis Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara 2019–2022 (Tabel 4.1, 7.2, dan Bab VI)."
                  })
                ]
              }),
              (0, p.jsxs)("li", {
                className: "flex items-start gap-2.5 pt-2 border-t border-slate-100",
                children: [
                  (0, p.jsx)(s, { size: 14, className: "text-slate-400 mt-0.5 shrink-0" }),
                  (0, p.jsxs)("span", {
                    className: "text-slate-500 text-[11px]",
                    children: [
                      "Tautan berkas resmi: ",
                      (0, p.jsx)("a", {
                        href: is2025 ? "/renstra-2025-2029.pdf" : "/renstra.pdf",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-emerald-700 font-semibold underline hover:text-emerald-800",
                        children: is2025 ? "Renstra 2025–2029 (PDF)" : "Renstra 2019–2022 (PDF)"
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

// =========================================================================
// MAIN PAGE COMPONENT: RENSTRA & RKPD
// =========================================================================
function RenstraPage() {
  const [selectedPeriod, setSelectedPeriod] = (0, f.useState)("2025-2029");
  const downloadPdfHref = selectedPeriod === "2025-2029" ? "/renstra-2025-2029.pdf" : "/renstra.pdf";

  return (0, p.jsx)(n, {
    children: (0, p.jsxs)("section", {
      className: "flex flex-col gap-6 py-2 text-left notranslate",
      translate: "no",
      children: [
        // Header Halaman Terpadu
        (0, p.jsxs)("header", {
          className: "flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5",
          children: [
            (0, p.jsxs)("div", {
              className: "flex-1 min-w-0",
              children: [
                (0, p.jsx)("h1", {
                  className: "text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight",
                  children: "Renstra & RKPD"
                }),
                (0, p.jsx)("p", {
                  className: "text-xs sm:text-sm font-medium text-slate-500 leading-relaxed max-w-3xl mt-1",
                  children: selectedPeriod === "2025-2029"
                    ? "Target Kinerja & Evaluasi Capaian Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara 2025–2029"
                    : "Target Kinerja & Evaluasi Capaian Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara 2019–2022"
                })
              ]
            }),
            (0, p.jsxs)("div", {
              className: "flex flex-wrap items-center gap-2.5 shrink-0",
              children: [
                (0, p.jsxs)("div", {
                  className: "flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs",
                  children: [
                    (0, p.jsx)("span", { className: "text-[11px] font-semibold text-slate-500 uppercase tracking-wide", children: "Periode:" }),
                    (0, p.jsxs)("select", {
                      "aria-label": "Pilih Periode Renstra",
                      value: selectedPeriod,
                      onChange: e => setSelectedPeriod(e.target.value),
                      className: "bg-transparent font-bold text-xs text-slate-800 focus:outline-none cursor-pointer pr-1",
                      children: [
                        (0, p.jsx)("option", { value: "2025-2029", children: "Renstra 2025–2029" }),
                        (0, p.jsx)("option", { value: "2019-2022", children: "Renstra 2019–2022" })
                      ]
                    })
                  ]
                }),
                (0, p.jsxs)("a", {
                  href: downloadPdfHref,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-slate-200 bg-white font-semibold text-xs text-slate-700 hover:bg-slate-50 transition-all shadow-2xs",
                  children: [
                    (0, p.jsx)(s, { size: 14 }),
                    "Unduh Dokumen"
                  ]
                }),
                (0, p.jsxs)("button", {
                  onClick: () => window.print(),
                  className: "inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-2xs transition-all",
                  children: [
                    (0, p.jsx)(c, { size: 14 }),
                    "Cetak Laporan"
                  ]
                })
              ]
            })
          ]
        }),

        // Unified View Component
        (0, p.jsx)(RenstraView, { key: `view-${selectedPeriod}`, periode: selectedPeriod })
      ]
    })
  });
}

export { RenstraPage as default };
