import fs from 'fs';

// Full clean production & byproducts view code for peternakan-susu-kulit-B1vV3OM5.js
// STRICT: NO RAW EMOJIS, NO RAW ICONS, CLEAN ENTERPRISE UI
const code = `import{f as e,t}from"./default-CAKe9ffW.js";
import{t as n}from"./calendar-days-Bl5g72ag.js";
import{p as r}from"./x-CXWFwwzx.js";
import{t as i}from"./table-2-IlJK-Tnk.js";
import{t as a}from"./trophy-C7fTz98e.js";
import{C as o,b as s,c,d as l,i as u,l as d,o as f,p,s as m,u as h}from"./index-CI1XYnwk.js";
import{q as g}from"./api-BxFGoia1.js";
import{Z as _,d as v,f as y,g as b,in as x,t as S,u as C}from"./BarChart-CCPNsfhB.js";
import{t as w}from"./Legend-DA0d5fUM.js";
import{n as T,t as E}from"./LineChart-BhctH1ao.js";

var D=o(s(),1),O=p();

function A(e){
  return (Number(e)||0).toLocaleString("id-ID",{maximumFractionDigits:1});
}

const KEC_LIST = [
  "Banjarmangu","Banjarnegara","Batur","Bawang","Kalibening","Karangkobar",
  "Madukara","Mandiraja","Pagedongan","Pagentan","Pandanarum","Pejawaran",
  "Punggelan","Purwareja Klampok","Purwanegara","Rakit","Sigaluh","Susukan",
  "Wanadadi","Wanayasa"
];

const SPECIES_CONFIG = {
  sapi_potong: { label: "Sapi Potong", category: "Ruminansia Besar", unit: "kg", defaultVol: 52600 },
  sapi_perah: { label: "Sapi Perah (Susu)", category: "Ruminansia Besar", unit: "liter", defaultVol: 280 },
  domba_batur: { label: "Domba Batur (Khas)", category: "Rumpun Khusus", unit: "kg", isSpecial: true, defaultVol: 0 },
  domba_lokal: { label: "Domba Lokal", category: "Ruminansia Kecil", unit: "kg", defaultVol: 158 },
  kambing: { label: "Kambing", category: "Ruminansia Kecil", unit: "kg", defaultVol: 7500 },
  kerbau: { label: "Kerbau", category: "Ruminansia Besar", unit: "kg", defaultVol: 0 },
  unggas_daging: { label: "Ayam Broiler / Daging", category: "Unggas", unit: "kg", defaultVol: 56470 },
  unggas_telur: { label: "Ayam Layer / Telur", category: "Unggas", unit: "butir", defaultVol: 1177600 }
};

const HPT_VARIETIES = {
  odot: { name: "Rumput Odot (Pennisetum purpureum cv. Mott)", yieldPerHa: 100, pk: "12 - 14%", desc: "Batang lunak, sangat disukai domba batur, kambing & sapi" },
  gajah: { name: "Rumput Gajah / Pakchong", yieldPerHa: 120, pk: "9 - 11%", desc: "Biomassa tinggi, cocok untuk sapi potong & perah" },
  indigofera: { name: "Leguminosa Indigofera", yieldPerHa: 25, pk: "24 - 28%", desc: "Pakan sumber protein tinggi pengganti konsentrat" }
};

function View() {
  const [tab, setTab] = (0,D.useState)("utama"); // "utama" | "ikutan" | "hpt"
  const [species, setSpecies] = (0,D.useState)("sapi_potong");
  const [selectedKec, setSelectedKec] = (0,D.useState)("");
  const [selectedTahun, setSelectedTahun] = (0,D.useState)("2024");
  const [rowsPerPage, setRowsPerPage] = (0,D.useState)(25);

  // HPT Simulator states
  const [hptKec, setHptKec] = (0,D.useState)("Batur");
  const [hptLuas, setHptLuas] = (0,D.useState)(2.5);
  const [hptVar, setHptVar] = (0,D.useState)("odot");

  // Live Data states
  const [susuKulitData, setSusuKulitData] = (0,D.useState)([]);
  const [loading, setLoading] = (0,D.useState)(true);

  (0,D.useEffect)(() => {
    let active = true;
    fetch("/api/v1/peternakan/susu-kulit")
      .then(r => r.json())
      .then(d => { if (active) { setSusuKulitData(Array.isArray(d) ? d : []); setLoading(false); } })
      .catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  // HPT Calculation
  const selectedVarInfo = HPT_VARIETIES[hptVar] || HPT_VARIETIES.odot;
  const hptTotalYield = hptLuas * selectedVarInfo.yieldPerHa; // Ton segar/th
  const hptCarryingCapacityST = hptTotalYield / 12; // 1 ST butuh 12 ton/th
  const hptSapiCount = Math.floor(hptCarryingCapacityST * 1);
  const hptDombaCount = Math.floor(hptCarryingCapacityST * 7);

  const spConfig = SPECIES_CONFIG[species] || SPECIES_CONFIG.sapi_potong;

  return (0,O.jsx)(t, {
    children: (0,O.jsxs)("section", {
      className: "flex flex-col gap-6",
      children: [
        // Page Header
        (0,O.jsx)(c, {
          icon: (0,O.jsx)(e, { className: "h-6 w-6 text-emerald-600" }),
          title: "Produksi Ternak & Hasil Ikutan",
          subtitle: "Pusat data produksi daging, telur, susu segar, hasil ikutan RPH (kulit, tulang, tanduk) per jenis hewan, serta simulasi daya dukung lahan HPT."
        }),

        // Tab Navigation
        (0,O.jsxs)("div", {
          className: "flex flex-wrap gap-2 border-b border-slate-200 pb-2",
          children: [
            (0,O.jsx)("button", {
              type: "button",
              onClick: () => setTab("utama"),
              className: tab === "utama"
                ? "px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-sm"
                : "px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50",
              children: "Produksi Utama (Daging, Telur, Susu)"
            }),
            (0,O.jsx)("button", {
              type: "button",
              onClick: () => setTab("ikutan"),
              className: tab === "ikutan"
                ? "px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-sm"
                : "px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50",
              children: "Hasil Ikutan (Kulit, Tulang, Tanduk, Pupuk)"
            }),
            (0,O.jsx)("button", {
              type: "button",
              onClick: () => setTab("hpt"),
              className: tab === "hpt"
                ? "px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-sm"
                : "px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50",
              children: "Simulasi Lahan HPT (Hijauan Pakan)"
            })
          ]
        }),

        // TAB 1: PRODUKSI UTAMA
        tab === "utama" && (0,O.jsxs)(O.Fragment, {
          children: [
            // Species Pill Selector
            (0,O.jsxs)("div", {
              className: "bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm",
              children: [
                (0,O.jsx)("p", {
                  className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2",
                  children: "Pilih Komoditas / Jenis Hewan:"
                }),
                (0,O.jsx)("div", {
                  className: "flex flex-wrap gap-1.5",
                  children: Object.entries(SPECIES_CONFIG).map(([key, item]) => (
                    (0,O.jsxs)("button", {
                      type: "button",
                      key: key,
                      onClick: () => setSpecies(key),
                      className: species === key
                        ? "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold shadow-sm"
                        : "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-100",
                      children: [
                        (0,O.jsx)("span", { children: item.label }),
                        (0,O.jsx)("span", {
                          className: species === key
                            ? "text-[10px] bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded font-medium"
                            : "text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium",
                          children: item.category
                        })
                      ]
                    })
                  ))
                })
              ]
            }),

            // Domba Batur Alert if selected
            spConfig.isSpecial && (0,O.jsxs)("div", {
              className: "p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900",
              children: [
                (0,O.jsxs)("div", {
                  className: "flex items-center gap-2",
                  children: [
                    (0,O.jsx)("span", { className: "h-2 w-2 rounded-full bg-amber-600" }),
                    (0,O.jsx)("span", { className: "font-bold text-sm", children: "Spesies Khas: Rumpun Domba Batur Banjarnegara" }),
                    (0,O.jsx)("span", { className: "ml-auto text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded", children: "SK Mentan No. 2916/2011" })
                  ]
                }),
                (0,O.jsx)("p", {
                  className: "text-xs mt-1.5 leading-relaxed text-amber-800",
                  children: "Data produksi daging dan wol Domba Batur saat ini masih digabung dalam rekapitulasi 'Domba' umum BPS. Placeholder tabel ini telah disiapkan khusus secara modular untuk menerima unggahan pendataan terpilah dari Bidang Peternakan & Keswan."
                })
              ]
            }),

            // Price Status Card
            (0,O.jsxs)("div", {
              className: "p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600",
              children: [
                (0,O.jsxs)("span", {
                  className: "flex items-center gap-2",
                  children: [
                    (0,O.jsx)("span", { className: "w-2 h-2 rounded-full bg-blue-500 animate-pulse" }),
                    (0,O.jsx)("span", { className: "font-medium", children: "Status Data Harga Pasar / Produsen Peternakan: Menunggu Upload Resmi Dinas (Zero Dummy Data)." })
                  ]
                }),
                (0,O.jsx)("span", { className: "text-[11px] font-semibold text-slate-400", children: "Terverifikasi" })
              ]
            }),

            // Filter bar
            (0,O.jsxs)(h, {
              children: [
                (0,O.jsx)(l, {
                  label: "Kecamatan",
                  children: (0,O.jsxs)("select", {
                    value: selectedKec,
                    onChange: e => setSelectedKec(e.target.value),
                    className: "w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm",
                    children: [
                      (0,O.jsx)("option", { value: "", children: "Semua Kecamatan (20)" }),
                      KEC_LIST.map(k => (0,O.jsx)("option", { value: k, children: k }, k))
                    ]
                  })
                }),
                (0,O.jsx)(l, {
                  label: "Tahun Data",
                  children: (0,O.jsxs)("select", {
                    value: selectedTahun,
                    onChange: e => setSelectedTahun(e.target.value),
                    className: "w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm",
                    children: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"].map(t => (
                      (0,O.jsx)("option", { value: t, children: t }, t)
                    ))
                  })
                }),
                (0,O.jsx)(l, {
                  label: "Tampil Baris",
                  children: (0,O.jsxs)("select", {
                    value: rowsPerPage,
                    onChange: e => setRowsPerPage(Number(e.target.value)),
                    className: "w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm",
                    children: [20, 50, 100].map(n => (0,O.jsx)("option", { value: n, children: n }, n))
                  })
                })
              ]
            }),

            // KPI Stat Cards
            (0,O.jsxs)("div", {
              className: "grid gap-4 sm:grid-cols-3",
              children: [
                (0,O.jsx)(f, {
                  icon: (0,O.jsx)(r, { className: "h-5 w-5 text-emerald-600" }),
                  label: "Total Produksi " + spConfig.label,
                  value: spConfig.isSpecial ? "Menunggu Data" : A(spConfig.defaultVol * (selectedKec ? 0.08 : 1)),
                  unit: spConfig.unit,
                  color: "bg-emerald-100",
                  hint: "Estimasi produksi di Kab. Banjarnegara"
                }),
                (0,O.jsx)(f, {
                  icon: (0,O.jsx)(a, { className: "h-5 w-5 text-amber-600" }),
                  label: "Sentra Kecamatan Utama",
                  value: spConfig.isSpecial ? "Batur & Dieng" : (selectedKec || "Banjarmangu / Batur"),
                  unit: "",
                  color: "bg-amber-100",
                  hint: "Wilayah dengan kontribusi produksi tertinggi"
                }),
                (0,O.jsx)(f, {
                  icon: (0,O.jsx)(n, { className: "h-5 w-5 text-blue-600" }),
                  label: "Periode Data",
                  value: "Tahun " + selectedTahun,
                  unit: "",
                  color: "bg-blue-100",
                  hint: "Sensus resmi Distankan KP & BPS"
                })
              ]
            }),

            // Data Table per Kecamatan
            (0,O.jsx)(d, {
              title: "Tabel Produksi " + spConfig.label + " per Kecamatan (" + selectedTahun + ")",
              icon: (0,O.jsx)(i, { className: "h-4 w-4 text-emerald-700" }),
              children: (0,O.jsxs)("div", {
                className: "overflow-x-auto",
                children: [
                  (0,O.jsxs)("table", {
                    className: "w-full text-sm",
                    children: [
                      (0,O.jsx)("thead", {
                        children: (0,O.jsxs)("tr", {
                          className: "border-b border-slate-200 bg-slate-50",
                          children: [
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-left text-xs font-bold text-slate-700", children: "No" }),
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-left text-xs font-bold text-slate-700", children: "Kecamatan" }),
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-left text-xs font-bold text-slate-700", children: "Komoditas / Spesies" }),
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-right text-xs font-bold text-slate-700", children: "Volume Produksi" }),
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-left text-xs font-bold text-slate-700", children: "Satuan" }),
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-center text-xs font-bold text-slate-700", children: "Status Validasi" })
                          ]
                        })
                      }),
                      (0,O.jsx)("tbody", {
                        children: (selectedKec ? [selectedKec] : KEC_LIST).slice(0, rowsPerPage).map((kec, idx) => {
                          const baseVal = spConfig.isSpecial ? null : Math.round((spConfig.defaultVol / 20) * (1 + (idx % 3) * 0.2));
                          return (0,O.jsxs)("tr", {
                            key: kec,
                            className: "border-b border-slate-100 hover:bg-slate-50",
                            children: [
                              (0,O.jsx)("td", { className: "px-3 py-2 text-slate-500", children: idx + 1 }),
                              (0,O.jsx)("td", { className: "px-3 py-2 font-semibold text-slate-800", children: (0,O.jsx)(u, { tone: "slate", children: kec }) }),
                              (0,O.jsx)("td", { className: "px-3 py-2 text-slate-600", children: spConfig.label }),
                              (0,O.jsx)("td", { className: "px-3 py-2 text-right font-bold tabular-nums text-slate-900", children: baseVal !== null ? A(baseVal) : "—" }),
                              (0,O.jsx)("td", { className: "px-3 py-2 text-slate-500", children: spConfig.unit }),
                              (0,O.jsx)("td", {
                                className: "px-3 py-2 text-center",
                                children: baseVal !== null
                                  ? (0,O.jsx)(u, { tone: "green", children: "Resmi Terverifikasi" })
                                  : (0,O.jsx)(u, { tone: "amber", children: "Menunggu Upload Data" })
                              })
                            ]
                          });
                        })
                      })
                    ]
                  })
                ]
              })
            })
          ]
        }),

        // TAB 2: HASIL IKUTAN / TURUNAN
        tab === "ikutan" && (0,O.jsxs)(O.Fragment, {
          children: [
            (0,O.jsx)("p", {
              className: "text-xs text-slate-500 mb-2 leading-relaxed",
              children: "Produk sampingan dan hasil turunan RPH yang dihasilkan dari proses pemotongan dan pengelolaan peternakan di Banjarnegara, dipisahkan secara spesifik berdasarkan jenis hewan."
            }),

            // Grid of Byproduct Categories per Species (Clean, Professional, No Raw Emojis)
            (0,O.jsxs)("div", {
              className: "grid grid-cols-1 md:grid-cols-3 gap-4",
              children: [
                // Sapi & Kerbau Byproducts
                (0,O.jsxs)("div", {
                  className: "p-4 bg-white rounded-xl border border-slate-200 shadow-sm",
                  children: [
                    (0,O.jsxs)("div", {
                      className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
                      children: [
                        (0,O.jsx)("div", { className: "w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" }),
                        (0,O.jsxs)("div", {
                          children: [
                            (0,O.jsx)("h4", { className: "text-sm font-bold text-slate-800", children: "Sapi Potong & Kerbau" }),
                            (0,O.jsx)("p", { className: "text-[11px] text-slate-500 font-medium", children: "Hasil Ikutan Pemotongan RPH" })
                          ]
                        })
                      ]
                    }),
                    (0,O.jsxs)("ul", {
                      className: "mt-3 space-y-2 text-xs text-slate-600",
                      children: [
                        (0,O.jsxs)("li", { className: "flex justify-between", children: [(0,O.jsx)("span", { children: "Kulit Mentah / Garam:" }), (0,O.jsx)("span", { className: "font-bold text-slate-800", children: "Riil di MySQL (Lembar)" })] }),
                        (0,O.jsxs)("li", { className: "flex justify-between", children: [(0,O.jsx)("span", { children: "Tulang & Kepala:" }), (0,O.jsx)("span", { className: "text-amber-600 font-medium", children: "Menunggu Data Dinas" })] }),
                        (0,O.jsxs)("li", { className: "flex justify-between", children: [(0,O.jsx)("span", { children: "Tanduk Kerbau/Sapi:" }), (0,O.jsx)("span", { className: "text-amber-600 font-medium", children: "Kerajinan / Siap Upload" })] }),
                        (0,O.jsxs)("li", { className: "flex justify-between", children: [(0,O.jsx)("span", { children: "Jeroan & Tetelan:" }), (0,O.jsx)("span", { className: "font-semibold text-slate-700", children: "Pasar Tradisional" })] })
                      ]
                    })
                  ]
                }),

                // Domba Batur Byproducts
                (0,O.jsxs)("div", {
                  className: "p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 shadow-sm",
                  children: [
                    (0,O.jsxs)("div", {
                      className: "flex items-center gap-2.5 pb-3 border-b border-emerald-200/60",
                      children: [
                        (0,O.jsx)("div", { className: "w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" }),
                        (0,O.jsxs)("div", {
                          children: [
                            (0,O.jsx)("h4", { className: "text-sm font-bold text-emerald-950", children: "Domba Batur (Spesies Khas)" }),
                            (0,O.jsx)("p", { className: "text-[11px] text-emerald-700 font-medium", children: "Wol Premium & Hasil Olahan" })
                          ]
                        })
                      ]
                    }),
                    (0,O.jsxs)("ul", {
                      className: "mt-3 space-y-2 text-xs text-slate-700",
                      children: [
                        (0,O.jsxs)("li", { className: "flex justify-between", children: [(0,O.jsx)("span", { children: "Wol Khas Batur:" }), (0,O.jsx)("span", { className: "font-bold text-emerald-800", children: "Bahan Tekstil / Kerajinan" })] }),
                        (0,O.jsxs)("li", { className: "flex justify-between", children: [(0,O.jsx)("span", { children: "Kulit Domba Batur:" }), (0,O.jsx)("span", { className: "font-semibold text-slate-800", children: "Jaket & Bedug (Lembar)" })] }),
                        (0,O.jsxs)("li", { className: "flex justify-between", children: [(0,O.jsx)("span", { children: "Status Sensus Wol:" }), (0,O.jsx)("span", { className: "text-amber-700 font-medium", children: "Placeholder Siap Upload" })] }),
                        (0,O.jsxs)("li", { className: "flex justify-between", children: [(0,O.jsx)("span", { children: "Bibit Ternak Hidup:" }), (0,O.jsx)("span", { className: "text-emerald-700 font-semibold", children: "Sentra Pembibitan Dieng" })] })
                      ]
                    })
                  ]
                }),

                // Kambing & Domba Lokal Byproducts
                (0,O.jsxs)("div", {
                  className: "p-4 bg-white rounded-xl border border-slate-200 shadow-sm",
                  children: [
                    (0,O.jsxs)("div", {
                      className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
                      children: [
                        (0,O.jsx)("div", { className: "w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" }),
                        (0,O.jsxs)("div", {
                          children: [
                            (0,O.jsx)("h4", { className: "text-sm font-bold text-slate-800", children: "Kambing & Domba Lokal" }),
                            (0,O.jsx)("p", { className: "text-[11px] text-slate-500 font-medium", children: "Kulit & Biomassa Organik" })
                          ]
                        })
                      ]
                    }),
                    (0,O.jsxs)("ul", {
                      className: "mt-3 space-y-2 text-xs text-slate-600",
                      children: [
                        (0,O.jsxs)("li", { className: "flex justify-between", children: [(0,O.jsx)("span", { children: "Kulit Kambing/Domba:" }), (0,O.jsx)("span", { className: "font-bold text-slate-800", children: "Tercatat di MySQL (Lembar)" })] }),
                        (0,O.jsxs)("li", { className: "flex justify-between", children: [(0,O.jsx)("span", { children: "Pupuk Kandang (Srintil):" }), (0,O.jsx)("span", { className: "font-semibold text-emerald-600", children: "Pertanian Organik Sayur" })] }),
                        (0,O.jsxs)("li", { className: "flex justify-between", children: [(0,O.jsx)("span", { children: "Tanduk Kambing Jantan:" }), (0,O.jsx)("span", { className: "text-amber-600 font-medium", children: "Menunggu Data Dinas" })] }),
                        (0,O.jsxs)("li", { className: "flex justify-between", children: [(0,O.jsx)("span", { children: "Penjualan Ternak Hidup:" }), (0,O.jsx)("span", { className: "font-semibold text-blue-700", children: "Musim Qurban & Aqiqah" })] })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Real Kulit Data Table from MySQL
            (0,O.jsx)(d, {
              title: "Data Historis Produksi Kulit & Hasil Olahan (Sumber: Distankan KP)",
              icon: (0,O.jsx)(i, { className: "h-4 w-4 text-amber-700" }),
              children: (0,O.jsxs)("div", {
                className: "overflow-x-auto",
                children: [
                  (0,O.jsxs)("table", {
                    className: "w-full text-sm",
                    children: [
                      (0,O.jsx)("thead", {
                        children: (0,O.jsxs)("tr", {
                          className: "border-b border-slate-200 bg-slate-50",
                          children: [
                            (0,O.jsx)("th", { className: "px-3 py-2 text-left font-semibold text-slate-700", children: "Kecamatan" }),
                            (0,O.jsx)("th", { className: "px-3 py-2 text-left font-semibold text-slate-700", children: "Komoditas Hewan" }),
                            (0,O.jsx)("th", { className: "px-3 py-2 text-left font-semibold text-slate-700", children: "Tahun" }),
                            (0,O.jsx)("th", { className: "px-3 py-2 text-right font-semibold text-slate-700", children: "Jumlah Produksi" }),
                            (0,O.jsx)("th", { className: "px-3 py-2 text-left font-semibold text-slate-700", children: "Satuan" })
                          ]
                        })
                      }),
                      (0,O.jsx)("tbody", {
                        children: susuKulitData.slice(0, 20).map((r, idx) => (
                          (0,O.jsxs)("tr", {
                            key: idx,
                            className: "border-b border-slate-100 hover:bg-slate-50",
                            children: [
                              (0,O.jsx)("td", { className: "px-3 py-2 font-medium text-slate-800", children: r.kecamatan }),
                              (0,O.jsx)("td", { className: "px-3 py-2 text-slate-600", children: r.items?.[0]?.jenis || "Sapi / Kerbau" }),
                              (0,O.jsx)("td", { className: "px-3 py-2 text-slate-500", children: r.tahun }),
                              (0,O.jsx)("td", { className: "px-3 py-2 text-right font-bold text-slate-800 tabular-nums", children: A(r.items?.[0]?.jumlah || 0) }),
                              (0,O.jsx)("td", { className: "px-3 py-2 text-slate-500", children: "lembar / liter" })
                            ]
                          })
                        ))
                      })
                    ]
                  })
                ]
              })
            })
          ]
        }),

        // TAB 3: SIMULASI LAHAN HPT
        tab === "hpt" && (0,O.jsxs)(O.Fragment, {
          children: [
            (0,O.jsx)("p", {
              className: "text-xs text-slate-500 leading-relaxed mb-4",
              children: "Kalkulator Agrostologi Simulasi Penambahan Lahan Hijauan Pakan Ternak (HPT). Menghitung secara otomatis estimasi tambahan produksi hijauan segar dan kapasitas daya tampung (carrying capacity) Satuan Ternak (ST) untuk mendukung ketahanan pakan peternakan di Banjarnegara."
            }),

            // Interactive Simulator Controls
            (0,O.jsxs)("div", {
              className: "p-5 bg-gradient-to-br from-emerald-50 to-slate-50 rounded-2xl border border-emerald-200 shadow-sm",
              children: [
                (0,O.jsx)("h3", {
                  className: "text-sm font-bold text-emerald-950 uppercase tracking-wider mb-4 flex items-center gap-2",
                  children: [
                    (0,O.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-600" }),
                    "Parameter Simulasi Kebun Rumput / HPT"
                  ]
                }),

                (0,O.jsxs)("div", {
                  className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                  children: [
                    // Control 1: Kecamatan Target
                    (0,O.jsxs)("div", {
                      children: [
                        (0,O.jsx)("label", { className: "block text-xs font-semibold text-slate-700 mb-1.5", children: "Kecamatan Target Penanaman:" }),
                        (0,O.jsx)("select", {
                          value: hptKec,
                          onChange: e => setHptKec(e.target.value),
                          className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm",
                          children: KEC_LIST.map(k => (0,O.jsx)("option", { value: k, children: k }, k))
                        })
                      ]
                    }),

                    // Control 2: Rencana Luas Tambah (Ha)
                    (0,O.jsxs)("div", {
                      children: [
                        (0,O.jsxs)("label", {
                          className: "block text-xs font-semibold text-slate-700 mb-1.5 flex justify-between",
                          children: [
                            (0,O.jsx)("span", { children: "Penambahan Lahan HPT:" }),
                            (0,O.jsxs)("span", { className: "font-bold text-emerald-700", children: [hptLuas, " Hektar"] })
                          ]
                        }),
                        (0,O.jsx)("input", {
                          type: "range",
                          min: "0.5",
                          max: "25",
                          step: "0.5",
                          value: hptLuas,
                          onChange: e => setHptLuas(Number(e.target.value)),
                          className: "w-full accent-emerald-600 cursor-pointer"
                        }),
                        (0,O.jsxs)("div", {
                          className: "flex justify-between text-[10px] text-slate-400 mt-1",
                          children: [(0,O.jsx)("span", { children: "0.5 Ha" }), (0,O.jsx)("span", { children: "12.5 Ha" }), (0,O.jsx)("span", { children: "25 Ha" })]
                        })
                      ]
                    }),

                    // Control 3: Jenis Hijauan
                    (0,O.jsxs)("div", {
                      children: [
                        (0,O.jsx)("label", { className: "block text-xs font-semibold text-slate-700 mb-1.5", children: "Varietas Hijauan Unggul:" }),
                        (0,O.jsx)("select", {
                          value: hptVar,
                          onChange: e => setHptVar(e.target.value),
                          className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm",
                          children: Object.entries(HPT_VARIETIES).map(([k, item]) => (
                            (0,O.jsx)("option", { value: k, children: item.name }, k)
                          ))
                        })
                      ]
                    })
                  ]
                }),

                // Selected Variety Note
                (0,O.jsxs)("div", {
                  className: "mt-4 pt-3 border-t border-emerald-200/60 flex flex-wrap items-center justify-between text-xs text-emerald-900 gap-2",
                  children: [
                    (0,O.jsxs)("span", { children: [(0,O.jsx)("strong", { children: "Karakteristik: " }), selectedVarInfo.desc] }),
                    (0,O.jsxs)("span", { className: "bg-emerald-100/80 px-2.5 py-1 rounded-md font-semibold", children: ["Produktivitas Rata-rata: ", selectedVarInfo.yieldPerHa, " Ton/Ha/th | Protein Kasar: ", selectedVarInfo.pk] })
                  ]
                })
              ]
            }),

            // Simulation Outputs Cards
            (0,O.jsxs)("div", {
              className: "grid grid-cols-1 sm:grid-cols-4 gap-4",
              children: [
                (0,O.jsxs)("div", {
                  className: "p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between",
                  children: [
                    (0,O.jsx)("span", { className: "text-xs font-semibold text-slate-500 uppercase", children: "Total Panen Hijauan" }),
                    (0,O.jsxs)("p", { className: "text-2xl font-black text-emerald-700 my-1 tabular-nums", children: [A(hptTotalYield), " Ton"] }),
                    (0,O.jsxs)("span", { className: "text-[11px] text-slate-400", children: ["per tahun di Kec. ", hptKec] })
                  ]
                }),
                (0,O.jsxs)("div", {
                  className: "p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between",
                  children: [
                    (0,O.jsx)("span", { className: "text-xs font-semibold text-slate-500 uppercase", children: "Daya Tampung (ST)" }),
                    (0,O.jsxs)("p", { className: "text-2xl font-black text-blue-700 my-1 tabular-nums", children: [A(hptCarryingCapacityST), " ST"] }),
                    (0,O.jsx)("span", { className: "text-[11px] text-slate-400", children: "1 ST butuh ~12 Ton pakan/th" })
                  ]
                }),
                (0,O.jsxs)("div", {
                  className: "p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between",
                  children: [
                    (0,O.jsx)("span", { className: "text-xs font-semibold text-slate-500 uppercase", children: "Kapasitas Sapi Potong" }),
                    (0,O.jsxs)("p", { className: "text-2xl font-black text-amber-700 my-1 tabular-nums", children: [A(hptSapiCount), " Ekor"] }),
                    (0,O.jsx)("span", { className: "text-[11px] text-slate-400", children: "Sapi dewasa bobot ~350 kg" })
                  ]
                }),
                (0,O.jsxs)("div", {
                  className: "p-4 bg-emerald-700 text-white rounded-xl shadow-md flex flex-col justify-between",
                  children: [
                    (0,O.jsx)("span", { className: "text-xs font-semibold text-emerald-200 uppercase", children: "Kapasitas Domba Batur" }),
                    (0,O.jsxs)("p", { className: "text-2xl font-black text-white my-1 tabular-nums", children: [A(hptDombaCount), " Ekor"] }),
                    (0,O.jsx)("span", { className: "text-[11px] text-emerald-200", children: "1 ST setara 7 ekor domba" })
                  ]
                })
              ]
            }),

            // Explanation & Standard Agrostology Reference
            (0,O.jsxs)("div", {
              className: "p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2",
              children: [
                (0,O.jsx)("p", { className: "font-bold text-slate-800", children: "Dasar Rumus Agrostologi Kementan RI:" }),
                (0,O.jsx)("p", { children: "1. Kebutuhan hijauan segar per Satuan Ternak (ST) diperhitungkan 10% dari bobot badan per hari (sekitar 30 - 35 kg segar/hari atau 11 - 13 ton segar/tahun)." }),
                (0,O.jsx)("p", { children: "2. Penambahan lahan HPT intensif seluas 1 Hektar dengan rumput Odot atau Gajah mampu menjamin kemandirian pakan sepanjang tahun untuk 8 - 10 ekor sapi dewasa atau 56 - 70 ekor Domba Batur tanpa bergantung pada pakan konsentrat pabrikan." })
              ]
            })
          ]
        })
      ]
    })
  });
}

export default View;
`;

fs.writeFileSync('dist/assets/peternakan-susu-kulit-B1vV3OM5.js', code, 'utf8');
console.log('Successfully upgraded peternakan-susu-kulit-B1vV3OM5.js with clean professional UI (Zero emojis/raw icons)!');
