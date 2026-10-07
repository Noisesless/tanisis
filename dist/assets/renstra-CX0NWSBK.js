import { g as e, i as t, t as n } from "./default-CAKe9ffW.js";
import { t as r } from "./arrow-right-Z7jtJnlf.js";
import { i } from "./x-CXWFwwzx.js";
import { t as a } from "./circle-check-PxHdRpHr.js";
import { n as o, t as s } from "./file-text-lGWqWg17.js";
import { t as c } from "./printer-BDcaNACb.js";
import { C as l, b as u, p as d } from "./index-CI1XYnwk.js";

var f = l(u(), 1);
var p = d();

function RenstraPage() {
  let dateFormatted = (0, f.useMemo)(() => new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }), []);
  let indikatorData = [
    { kategori: "Pertanian & Tanaman Pangan", indikator: "Produksi Padi Tahunan", target2022: 162069, actual2022: 171560, satuan: "Ton", keterangan: "Produksi gabungan padi sawah dan ladang di seluruh kecamatan Kabupaten Banjarnegara." },
    { kategori: "Peternakan", indikator: "Populasi Sapi (Potong & Perah)", target2022: 32269, actual2022: 28001, satuan: "Ekor", keterangan: "Populasi sapi potong dan perah untuk mendukung ketahanan protein daerah." },
    { kategori: "Peternakan", indikator: "Populasi Kambing & Domba", target2022: 263925, actual2022: 281218, satuan: "Ekor", keterangan: "Didorong pertumbuhan kambing Jawa/PE dan budidaya ras unggul Domba Batur." },
    { kategori: "Perikanan", indikator: "Produksi Perikanan Budidaya", target2022: 41901, actual2022: 40920, satuan: "Ton", keterangan: "Produksi gabungan perikanan kolam pembesaran, karamba, dan mina padi." }
  ];

  let calculatedData = (0, f.useMemo)(() => indikatorData.map(item => {
    let pct = (item.actual2022 / item.target2022) * 100;
    let status = "under";
    if (pct >= 100) status = "achieved";
    else if (pct >= 80) status = "near";
    return { ...item, persentase: pct, status };
  }), []);

  let totalIndikator = calculatedData.length;
  let achievedCount = calculatedData.filter(i => i.status === "achieved").length;
  let nearCount = calculatedData.filter(i => i.status === "near").length;
  let alignmentRate = Math.round(((achievedCount + nearCount) / totalIndikator) * 100);

  return (0, p.jsx)(n, {
    children: (0, p.jsxs)("section", {
      className: "flex flex-col gap-6 py-2",
      children: [
        // Executive Page Header
        (0, p.jsxs)("header", {
          className: "flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5 text-left",
          children: [
            (0, p.jsxs)("div", {
              className: "flex-1 min-w-0",
              children: [
                (0, p.jsx)("h1", {
                  className: "text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight",
                  children: "Analisis Renstra & RKPD"
                }),
                (0, p.jsx)("p", {
                  className: "mt-1.5 max-w-3xl text-xs sm:text-sm font-medium text-slate-500 leading-relaxed",
                  children: "Evaluasi Capaian Rencana Strategis (Renstra) 2019–2022 · Dinas Pertanian, Perikanan dan Ketahanan Pangan Kab. Banjarnegara"
                })
              ]
            }),
            (0, p.jsxs)("div", {
              className: "flex flex-wrap items-center gap-2 shrink-0",
              children: [
                (0, p.jsxs)("a", {
                  href: "/renstra.pdf",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-slate-200 bg-white font-semibold text-xs text-slate-700 hover:bg-slate-50 transition-all shadow-2xs",
                  children: [
                    (0, p.jsx)(s, { size: 14 }),
                    "Dokumen Sumber"
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

        // 3-Pillar KPI Metrics Card Formation (Border-Left-4 Executive Agritech)
        (0, p.jsxs)("div", {
          className: "grid grid-cols-1 md:grid-cols-3 gap-4",
          children: [
            (0, p.jsxs)("div", {
              className: "bg-white border border-slate-200 border-l-4 border-l-emerald-600 rounded-lg p-5 shadow-xs text-left",
              children: [
                (0, p.jsxs)("div", {
                  className: "flex items-center justify-between",
                  children: [
                    (0, p.jsx)("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Target Tercapai" }),
                    (0, p.jsx)("span", { className: "w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center", children: (0, p.jsx)(e, { className: "w-4 h-4" }) })
                  ]
                }),
                (0, p.jsxs)("div", {
                  className: "text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums",
                  children: [achievedCount, " / ", totalIndikator, " Indikator"]
                }),
                (0, p.jsx)("p", {
                  className: "text-xs text-slate-500 mt-1 leading-normal",
                  children: "Indikator dengan realisasi ≥ 100% dari target Renstra."
                })
              ]
            }),

            (0, p.jsxs)("div", {
              className: "bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-lg p-5 shadow-xs text-left",
              children: [
                (0, p.jsxs)("div", {
                  className: "flex items-center justify-between",
                  children: [
                    (0, p.jsx)("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Mendekati Target" }),
                    (0, p.jsx)("span", { className: "w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center", children: (0, p.jsx)(i, { className: "w-4 h-4" }) })
                  ]
                }),
                (0, p.jsxs)("div", {
                  className: "text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums",
                  children: [nearCount, " / ", totalIndikator, " Indikator"]
                }),
                (0, p.jsx)("p", {
                  className: "text-xs text-slate-500 mt-1 leading-normal",
                  children: "Indikator dengan realisasi berkisar antara 80% s/d 99%."
                })
              ]
            }),

            (0, p.jsxs)("div", {
              className: "bg-white border border-slate-200 border-l-4 border-l-blue-800 rounded-lg p-5 shadow-xs text-left",
              children: [
                (0, p.jsxs)("div", {
                  className: "flex items-center justify-between",
                  children: [
                    (0, p.jsx)("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Tingkat Keselarasan" }),
                    (0, p.jsx)("span", {
                      className: "w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center",
                      children: alignmentRate >= 90 ? (0, p.jsx)(a, { className: "w-4 h-4" }) : alignmentRate >= 70 ? (0, p.jsx)(t, { className: "w-4 h-4" }) : (0, p.jsx)(o, { className: "w-4 h-4" })
                    })
                  ]
                }),
                (0, p.jsxs)("div", {
                  className: "text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums",
                  children: [alignmentRate, "%"]
                }),
                (0, p.jsx)("p", {
                  className: "text-xs text-slate-500 mt-1 leading-normal",
                  children: "Proporsi target Renstra yang berhasil direalisasikan secara optimal."
                })
              ]
            })
          ]
        }),

        // Tujuan Renstra Panel
        (0, p.jsxs)("div", {
          className: "print-block bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs text-left",
          children: [
            (0, p.jsxs)("h3", {
              className: "text-sm sm:text-base font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4 flex items-center gap-2",
              children: [
                (0, p.jsx)(s, { size: 18, className: "text-emerald-700" }),
                "Tujuan Pelaksanaan Renstra (Bab IV)"
              ]
            }),
            (0, p.jsxs)("div", {
              className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5",
              children: [
                (0, p.jsxs)("div", {
                  className: "p-4 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors",
                  children: [
                    (0, p.jsxs)("div", {
                      className: "flex items-center gap-2 mb-1.5",
                      children: [
                        (0, p.jsx)("span", { className: "w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center", children: "01" }),
                        (0, p.jsx)("span", { className: "font-semibold text-xs text-slate-900", children: "Ketersediaan Pangan" })
                      ]
                    }),
                    (0, p.jsx)("p", {
                      className: "text-xs text-slate-600 leading-relaxed font-normal",
                      children: "Menjamin pasokan pangan yang cukup, aman, dan berkelanjutan bagi seluruh penduduk Kabupaten Banjarnegara."
                    })
                  ]
                }),
                (0, p.jsxs)("div", {
                  className: "p-4 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors",
                  children: [
                    (0, p.jsxs)("div", {
                      className: "flex items-center gap-2 mb-1.5",
                      children: [
                        (0, p.jsx)("span", { className: "w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center", children: "02" }),
                        (0, p.jsx)("span", { className: "font-semibold text-xs text-slate-900", children: "Pengembangan SDM" })
                      ]
                    }),
                    (0, p.jsx)("p", {
                      className: "text-xs text-slate-600 leading-relaxed font-normal",
                      children: "Memberdayakan petani, pembudidaya ikan, dan peternak melalui penerapan teknologi tepat guna lokal."
                    })
                  ]
                }),
                (0, p.jsxs)("div", {
                  className: "p-4 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors",
                  children: [
                    (0, p.jsxs)("div", {
                      className: "flex items-center gap-2 mb-1.5",
                      children: [
                        (0, p.jsx)("span", { className: "w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center", children: "03" }),
                        (0, p.jsx)("span", { className: "font-semibold text-xs text-slate-900", children: "Pendapatan Usaha" })
                      ]
                    }),
                    (0, p.jsx)("p", {
                      className: "text-xs text-slate-600 leading-relaxed font-normal",
                      children: "Meningkatkan kesejahteraan pelaku usaha lewat kenaikan nilai tambah, efisiensi produksi, dan akses pasar."
                    })
                  ]
                }),
                (0, p.jsxs)("div", {
                  className: "p-4 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors",
                  children: [
                    (0, p.jsxs)("div", {
                      className: "flex items-center gap-2 mb-1.5",
                      children: [
                        (0, p.jsx)("span", { className: "w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center", children: "04" }),
                        (0, p.jsx)("span", { className: "font-semibold text-xs text-slate-900", children: "Akuntabilitas Pelayanan" })
                      ]
                    }),
                    (0, p.jsx)("p", {
                      className: "text-xs text-slate-600 leading-relaxed font-normal",
                      children: "Mewujudkan tata kelola pemerintahan yang baik, transparan, dan berorientasi penuh pada kepuasan masyarakat."
                    })
                  ]
                })
              ]
            })
          ]
        }),

        // Table Panel
        (0, p.jsxs)("div", {
          className: "print-block bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden text-left",
          children: [
            (0, p.jsxs)("div", {
              className: "p-5 border-b border-slate-200",
              children: [
                (0, p.jsx)("h3", {
                  className: "text-sm sm:text-base font-bold text-slate-900",
                  children: "Tabel Evaluasi Indikator Kinerja Renstra 2022 vs Realisasi Riil"
                }),
                (0, p.jsx)("p", {
                  className: "text-xs text-slate-500 mt-0.5",
                  children: "Perbandingan target dokumen Renstra terhadap hasil kompilasi statistik sektoral."
                })
              ]
            }),
            (0, p.jsx)("div", {
              className: "overflow-x-auto",
              children: (0, p.jsxs)("table", {
                className: "w-full text-left text-xs border-collapse",
                children: [
                  (0, p.jsx)("thead", {
                    children: (0, p.jsxs)("tr", {
                      className: "border-b border-slate-200 bg-slate-50/80 text-slate-600",
                      children: [
                        (0, p.jsx)("th", { className: "p-3.5 font-bold uppercase tracking-wider text-[11px]", children: "Bidang / Urusan" }),
                        (0, p.jsx)("th", { className: "p-3.5 font-bold uppercase tracking-wider text-[11px]", children: "Indikator Kinerja" }),
                        (0, p.jsx)("th", { className: "p-3.5 font-bold uppercase tracking-wider text-[11px] text-right", children: "Target Renstra" }),
                        (0, p.jsx)("th", { className: "p-3.5 font-bold uppercase tracking-wider text-[11px] text-right", children: "Realisasi Riil" }),
                        (0, p.jsx)("th", { className: "p-3.5 font-bold uppercase tracking-wider text-[11px] text-center", children: "Persentase" }),
                        (0, p.jsx)("th", { className: "p-3.5 font-bold uppercase tracking-wider text-[11px] text-center", children: "Status" })
                      ]
                    })
                  }),
                  (0, p.jsx)("tbody", {
                    className: "divide-y divide-slate-100",
                    children: calculatedData.map((item, idx) => (0, p.jsxs)("tr", {
                      className: "hover:bg-slate-50/80 transition-colors",
                      children: [
                        (0, p.jsx)("td", { className: "p-3.5 font-semibold text-slate-800", children: item.kategori }),
                        (0, p.jsxs)("td", {
                          className: "p-3.5",
                          children: [
                            (0, p.jsx)("span", { className: "font-semibold text-slate-900 block", children: item.indikator }),
                            (0, p.jsx)("span", { className: "text-[11px] text-slate-500 block mt-0.5", children: item.keterangan })
                          ]
                        }),
                        (0, p.jsxs)("td", { className: "p-3.5 text-right font-medium text-slate-600 tabular-nums", children: [new Intl.NumberFormat("id-ID").format(item.target2022), " ", item.satuan] }),
                        (0, p.jsxs)("td", { className: "p-3.5 text-right font-bold text-emerald-800 tabular-nums", children: [new Intl.NumberFormat("id-ID").format(item.actual2022), " ", item.satuan] }),
                        (0, p.jsxs)("td", { className: "p-3.5 text-center font-bold text-slate-800 tabular-nums", children: [item.persentase.toFixed(1), "%"] }),
                        (0, p.jsx)("td", {
                          className: "p-3.5 text-center",
                          children: item.status === "achieved" ? (0, p.jsxs)("span", {
                            className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200",
                            children: [(0, p.jsx)(a, { size: 11 }), "Tercapai"]
                          }) : item.status === "near" ? (0, p.jsxs)("span", {
                            className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200",
                            children: [(0, p.jsx)(t, { size: 11 }), "Mendekati"]
                          }) : (0, p.jsxs)("span", {
                            className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200",
                            children: [(0, p.jsx)(o, { size: 11 }), "Belum Tercapai"]
                          })
                        })
                      ]
                    }, idx))
                  })
                ]
              })
            })
          ]
        }),

        // Catatan Evaluasi & Sinkronisasi Data Panel
        (0, p.jsxs)("div", {
          className: "print-block bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs text-left",
          children: [
            (0, p.jsx)("h3", {
              className: "text-sm sm:text-base font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4",
              children: "Catatan Evaluasi & Sinkronisasi Data"
            }),
            (0, p.jsxs)("ul", {
              className: "space-y-3 text-xs text-slate-600 leading-relaxed font-normal",
              children: [
                (0, p.jsxs)("li", {
                  className: "flex items-start gap-2.5",
                  children: [
                    (0, p.jsx)(r, { size: 14, className: "text-emerald-600 mt-0.5 shrink-0" }),
                    (0, p.jsx)("span", { children: "Capaian sektor pertanian (Padi) dan peternakan (Kambing & Domba) melampaui target Renstra 2022 secara optimal." })
                  ]
                }),
                (0, p.jsxs)("li", {
                  className: "flex items-start gap-2.5",
                  children: [
                    (0, p.jsx)(r, { size: 14, className: "text-emerald-600 mt-0.5 shrink-0" }),
                    (0, p.jsx)("span", { children: "Populasi Sapi menunjukkan kemajuan positif mendekati target akhir dengan tingkat ketercapaian 86.8%." })
                  ]
                }),
                (0, p.jsxs)("li", {
                  className: "flex items-start gap-2.5",
                  children: [
                    (0, p.jsx)(r, { size: 14, className: "text-emerald-600 mt-0.5 shrink-0" }),
                    (0, p.jsx)("span", { children: "Sektor perikanan budidaya (kolam pembesaran, karamba, minapadi) mencapai 97.7% dari target; perlu dorongan akhir pada periode Renstra berikutnya untuk memenuhi volume produksi secara penuh." })
                  ]
                }),
                (0, p.jsxs)("li", {
                  className: "flex items-start gap-2.5 pt-2 border-t border-slate-100",
                  children: [
                    (0, p.jsx)(s, { size: 14, className: "text-slate-400 mt-0.5 shrink-0" }),
                    (0, p.jsxs)("span", {
                      className: "text-slate-500 text-[11px]",
                      children: [
                        "Sumber: target merujuk Tabel 4.1 dokumen ",
                        (0, p.jsx)("a", { href: "/renstra.pdf", target: "_blank", rel: "noopener noreferrer", className: "text-emerald-700 font-semibold underline hover:text-emerald-800", children: "Renstra Dintankan & KP 2019–2022" }),
                        "; realisasi 2022 dihitung dari dataset BPS–Distankan KP terverifikasi (Luas Panen & Produksi Padi Sawah+Ladang; Jumlah Ternak Besar; Jumlah Ternak Kecil; Produksi & Nilai Perikanan Budidaya)."
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    })
  });
}

export { RenstraPage as default };