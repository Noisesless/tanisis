import fs from 'fs';

// Script untuk mengupgrade peternakan-susu-kulit-B1vV3OM5.js
// Memastikan:
// 1. Tombol komoditas saat aktif TIDAK PUTIH di atas putih (menggunakan inline styling solid #047857 & text putih).
// 2. Tampilan terstruktur, bersih, tidak overengineered, tidak membingungkan.
// 3. Menampilkan data faktual real dari MySQL / Distankan KP (bukan dummy).
// 4. Domba Batur bersih dari kelompok daging (hanya ada di populasi ekor /livestock dan hasil ikutan wol).

const code = `import{f as e,t}from"./default-CAKe9ffW.js";
import{t as n}from"./calendar-days-Bl5g72ag.js";
import{p as r}from"./x-CXWFwwzx.js";
import{t as i}from"./table-2-IlJK-Tnk.js";
import{t as a}from"./trophy-C7fTz98e.js";
import{C as o,b as s,c,d as l,i as u,l as d,o as f,p,s as m,u as h}from"./index-CI1XYnwk.js";
import{q as g}from"./api-BxFGoia1.js";

var D=o(s(),1),O=p();

function fmtNum(val){
  return (Number(val)||0).toLocaleString("id-ID",{maximumFractionDigits:1});
}

const KEC_LIST = [
  "Banjarmangu","Banjarnegara","Batur","Bawang","Kalibening","Karangkobar",
  "Madukara","Mandiraja","Pagedongan","Pagentan","Pandanarum","Pejawaran",
  "Punggelan","Purwareja Klampok","Purwanegara","Rakit","Sigaluh","Susukan",
  "Wanadadi","Wanayasa"
];

const UTAMA_SPECIES = {
  // Daging Ternak & Unggas
  daging_sapi: { label: "Daging Sapi", group: "Daging", unit: "kg", api: "/api/v1/peternakan/daging", field: "Sapi" },
  daging_kerbau: { label: "Daging Kerbau", group: "Daging", unit: "kg", api: "/api/v1/peternakan/daging", field: "Kerbau" },
  daging_kambing: { label: "Daging Kambing", group: "Daging", unit: "kg", api: "/api/v1/peternakan/daging", field: "Kambing" },
  daging_domba: { label: "Daging Domba", group: "Daging", unit: "kg", api: "/api/v1/peternakan/daging", field: "Domba" },
  daging_ayam_kampung: { label: "Daging Ayam Kampung", group: "Daging", unit: "kg", api: "/api/v1/peternakan/daging-unggas", field: "Ayam Kampung" },
  daging_ayam_broiler: { label: "Daging Ayam Broiler / Layer", group: "Daging", unit: "kg", api: "/api/v1/peternakan/daging-unggas", field: "Ayam Ras Layer" },
  daging_itik: { label: "Daging Itik / Bebek", group: "Daging", unit: "kg", isSpecial: true },
  daging_kelinci: { label: "Daging Kelinci", group: "Daging", unit: "kg", isSpecial: true },

  // Telur
  telur_layer: { label: "Telur Ayam Ras Layer", group: "Telur", unit: "butir", api: "/api/v1/peternakan/telur", field: "Ayam Ras Layer" },
  telur_kampung: { label: "Telur Ayam Kampung", group: "Telur", unit: "butir", api: "/api/v1/peternakan/telur", field: "Ayam Kampung" },
  telur_itik: { label: "Telur Itik / Bebek", group: "Telur", unit: "butir", api: "/api/v1/peternakan/telur", field: "Itik" },
  telur_puyuh: { label: "Telur Burung Puyuh", group: "Telur", unit: "butir", api: "/api/v1/peternakan/telur", field: "Puyuh" },

  // Susu
  susu_sapi: { label: "Susu Sapi Segar", group: "Susu", unit: "liter", api: "/api/v1/peternakan/susu-kulit", field: "Susu Sapi Segar" },
  susu_kambing: { label: "Susu Kambing (Perah)", group: "Susu", unit: "liter", api: "/api/v1/peternakan/susu-kulit", field: "Susu Kambing" }
};

const IKUTAN_SPECIES = {
  kulit_sapi: { label: "Kulit Sapi", unit: "lembar", field: "Kulit Sapi" },
  kulit_kerbau: { label: "Kulit Kerbau", unit: "lembar", field: "Kulit Kerbau" },
  kulit_kambing: { label: "Kulit Kambing", unit: "lembar", field: "Kulit Kambing" },
  kulit_domba: { label: "Kulit Domba", unit: "lembar", field: "Kulit Domba" },
  kulit_kelinci: { label: "Kulit Kelinci", unit: "lembar", field: "Kulit Kelinci" },
  wol_batur: { label: "Wol Domba Batur", unit: "kg", field: "Wol Domba Batur" },
  tulang_tanduk: { label: "Tulang & Tanduk RPH", unit: "kg", field: "Tulang & Tanduk" },
  pupuk_kandang: { label: "Pupuk Kandang", unit: "ton", isSpecial: true }
};

const HPT_VARIETIES = {
  odot: { name: "Rumput Odot", yieldPerHa: 100, desc: "Produktivitas rata-rata 100 ton/ha/tahun, kadar protein kasar 12-14%" },
  gajah: { name: "Rumput Gajah / Pakchong", yieldPerHa: 120, desc: "Produktivitas rata-rata 120 ton/ha/tahun, kadar protein kasar 9-11%" },
  indigofera: { name: "Leguminosa Indigofera", yieldPerHa: 25, desc: "Produktivitas rata-rata 25 ton bahan kering/ha/tahun, kadar protein kasar 24-28%" }
};

function View() {
  const [tab, setTab] = (0,D.useState)("utama"); // "utama" | "ikutan" | "hpt"
  const [utamaGroupFilter, setUtamaGroupFilter] = (0,D.useState)("Semua"); // "Semua" | "Daging" | "Telur" | "Susu"
  const [utamaKey, setUtamaKey] = (0,D.useState)("daging_sapi");
  const [ikutanKey, setIkutanKey] = (0,D.useState)("kulit_sapi");
  const [selectedKec, setSelectedKec] = (0,D.useState)("");
  const [selectedTahun, setSelectedTahun] = (0,D.useState)("2024");

  // HPT Simulator states
  const [hptKec, setHptKec] = (0,D.useState)("Batur");
  const [hptLuas, setHptLuas] = (0,D.useState)(2.5);
  const [hptVar, setHptVar] = (0,D.useState)("odot");

  // Live Data states dari Backend API Faktual
  const [dagingData, setDagingData] = (0,D.useState)([]);
  const [dagingUnggasData, setDagingUnggasData] = (0,D.useState)([]);
  const [telurData, setTelurData] = (0,D.useState)([]);
  const [susuKulitData, setSusuKulitData] = (0,D.useState)([]);

  (0,D.useEffect)(() => {
    let active = true;
    fetch("/api/v1/peternakan/daging").then(r => r.json()).then(d => { if (active && Array.isArray(d)) setDagingData(d); }).catch(() => {});
    fetch("/api/v1/peternakan/daging-unggas").then(r => r.json()).then(d => { if (active && Array.isArray(d)) setDagingUnggasData(d); }).catch(() => {});
    fetch("/api/v1/peternakan/telur").then(r => r.json()).then(d => { if (active && Array.isArray(d)) setTelurData(d); }).catch(() => {});
    fetch("/api/v1/peternakan/susu-kulit").then(r => r.json()).then(d => { if (active && Array.isArray(d)) setSusuKulitData(d); }).catch(() => {});
    return () => { active = false; };
  }, []);

  // HPT Calculation
  const selectedVarInfo = HPT_VARIETIES[hptVar] || HPT_VARIETIES.odot;
  const hptTotalYield = hptLuas * selectedVarInfo.yieldPerHa;
  const hptCarryingCapacityST = hptTotalYield / 12;
  const hptSapiCount = Math.floor(hptCarryingCapacityST * 1);
  const hptDombaCount = Math.floor(hptCarryingCapacityST * 7);

  // Tab 1 filtering (Filter out zero/empty rows!)
  const curUtama = UTAMA_SPECIES[utamaKey] || UTAMA_SPECIES.daging_sapi;
  let rawUtamaList = [];
  if (curUtama.api === "/api/v1/peternakan/daging") rawUtamaList = dagingData;
  else if (curUtama.api === "/api/v1/peternakan/daging-unggas") rawUtamaList = dagingUnggasData;
  else if (curUtama.api === "/api/v1/peternakan/telur") rawUtamaList = telurData;
  else if (curUtama.api === "/api/v1/peternakan/susu-kulit") rawUtamaList = susuKulitData;

  const filteredUtamaRows = rawUtamaList
    .filter(r => String(r.tahun) === String(selectedTahun) && (!selectedKec || r.kecamatan === selectedKec))
    .map(r => {
      const itm = (r.items || []).find(x => x.jenis === curUtama.field);
      return { kecamatan: r.kecamatan, tahun: r.tahun, jumlah: Number(itm?.jumlah || 0) };
    })
    // STRICT ZERO-EMPTY LAW: Filter out zero values!
    .filter(r => r.jumlah > 0);

  const totalUtamaVol = filteredUtamaRows.reduce((acc, cur) => acc + cur.jumlah, 0);

  // Tab 2 filtering (Kulit & Hasil Ikutan terpilah per jenis hewan)
  const curIkutan = IKUTAN_SPECIES[ikutanKey] || IKUTAN_SPECIES.kulit_sapi;
  const filteredIkutanRows = susuKulitData
    .filter(r => String(r.tahun) === String(selectedTahun) && (!selectedKec || r.kecamatan === selectedKec))
    .map(r => {
      const itm = (r.items || []).find(x => x.jenis === curIkutan.field);
      return { kecamatan: r.kecamatan, tahun: r.tahun, jumlah: Number(itm?.jumlah || 0) };
    })
    // STRICT ZERO-EMPTY LAW: Filter out zero values!
    .filter(r => r.jumlah > 0);

  const totalIkutanVol = filteredIkutanRows.reduce((acc, cur) => acc + cur.jumlah, 0);

  return (0,O.jsx)(t, {
    children: (0,O.jsxs)("section", {
      className: "flex flex-col gap-6",
      children: [
        // Page Header
        (0,O.jsx)(c, {
          icon: (0,O.jsx)(e, { className: "h-6 w-6 text-emerald-700" }),
          title: "Produksi Ternak dan Hasil Ikutan",
          subtitle: "Data produksi daging, telur, susu, dan hasil ikutan pemotongan RPH (kulit, tulang, tanduk) per jenis hewan di Kabupaten Banjarnegara."
        }),

        // Tab Navigation Utama
        (0,O.jsxs)("div", {
          className: "flex flex-wrap gap-2 border-b border-slate-200 pb-2",
          children: [
            (0,O.jsx)("button", {
              type: "button",
              onClick: () => setTab("utama"),
              style: tab === "utama"
                ? { backgroundColor: "#047857", color: "#ffffff", borderColor: "#047857" }
                : { backgroundColor: "#ffffff", color: "#334155", borderColor: "#cbd5e1" },
              className: "px-4 py-2 rounded-lg text-xs font-semibold border shadow-sm transition-colors",
              children: "Produksi Utama (Daging, Telur & Susu)"
            }),
            (0,O.jsx)("button", {
              type: "button",
              onClick: () => setTab("ikutan"),
              style: tab === "ikutan"
                ? { backgroundColor: "#047857", color: "#ffffff", borderColor: "#047857" }
                : { backgroundColor: "#ffffff", color: "#334155", borderColor: "#cbd5e1" },
              className: "px-4 py-2 rounded-lg text-xs font-semibold border shadow-sm transition-colors",
              children: "Hasil Ikutan (Kulit, Tulang & Tanduk)"
            }),
            (0,O.jsx)("button", {
              type: "button",
              onClick: () => setTab("hpt"),
              style: tab === "hpt"
                ? { backgroundColor: "#047857", color: "#ffffff", borderColor: "#047857" }
                : { backgroundColor: "#ffffff", color: "#334155", borderColor: "#cbd5e1" },
              className: "px-4 py-2 rounded-lg text-xs font-semibold border shadow-sm transition-colors",
              children: "Simulasi Lahan Hijauan Pakan Ternak (HPT)"
            })
          ]
        }),

        // TAB 1: PRODUKSI UTAMA
        tab === "utama" && (0,O.jsxs)(O.Fragment, {
          children: [
            // Kotak Pemilihan Komoditas yang Rapi & Jelas
            (0,O.jsxs)("div", {
              className: "bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3.5",
              children: [
                (0,O.jsxs)("div", {
                  className: "flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5",
                  children: [
                    (0,O.jsxs)("div", {
                      className: "flex items-center gap-2",
                      children: [
                        (0,O.jsx)("span", { className: "text-xs font-bold text-slate-800 uppercase tracking-wide", children: "Pilih Komoditas:" }),
                        (0,O.jsxs)("span", {
                          className: "text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full",
                          children: [curUtama.label, " (", curUtama.unit, ")"]
                        })
                      ]
                    }),
                    (0,O.jsxs)("div", {
                      className: "flex gap-1 bg-slate-100 p-1 rounded-lg",
                      children: [
                        { key: "Semua", label: "Semua" },
                        { key: "Daging", label: "Daging" },
                        { key: "Telur", label: "Telur" },
                        { key: "Susu", label: "Susu" }
                      ].map(g => (
                        (0,O.jsx)("button", {
                          type: "button",
                          key: g.key,
                          onClick: () => setUtamaGroupFilter(g.key),
                          style: utamaGroupFilter === g.key
                            ? { backgroundColor: "#047857", color: "#ffffff" }
                            : { backgroundColor: "transparent", color: "#475569" },
                          className: "px-3 py-1 rounded-md text-xs font-semibold transition-all",
                          children: g.label
                        })
                      ))
                    })
                  ]
                }),

                // Grid Buttons Komoditas dengan Inline Style Solid (Anti-Putih di atas Putih)
                (0,O.jsx)("div", {
                  className: "flex flex-wrap gap-2",
                  children: Object.entries(UTAMA_SPECIES)
                    .filter(([, itm]) => utamaGroupFilter === "Semua" || itm.group === utamaGroupFilter)
                    .map(([key, item]) => {
                      const isActive = utamaKey === key;
                      return (0,O.jsxs)("button", {
                        type: "button",
                        key: key,
                        onClick: () => setUtamaKey(key),
                        style: isActive ? {
                          backgroundColor: "#047857",
                          color: "#ffffff",
                          borderColor: "#047857",
                          boxShadow: "0 2px 4px rgba(4, 120, 87, 0.25)"
                        } : {
                          backgroundColor: "#ffffff",
                          color: "#334155",
                          borderColor: "#cbd5e1"
                        },
                        className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:border-emerald-600",
                        children: [
                          (0,O.jsx)("span", {
                            style: { color: isActive ? "#ffffff" : "#1e293b" },
                            children: item.label
                          }),
                          (0,O.jsx)("span", {
                            style: isActive ? {
                              backgroundColor: "rgba(255, 255, 255, 0.25)",
                              color: "#ffffff"
                            } : {
                              backgroundColor: "#f1f5f9",
                              color: "#64748b"
                            },
                            className: "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                            children: item.unit
                          })
                        ]
                      });
                    })
                }),

                // Catatan Khusus Domba Batur
                (0,O.jsxs)("p", {
                  className: "text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between",
                  children: [
                    (0,O.jsx)("span", {
                      children: "* Domba Batur dipasarkan hidup (per ekor) untuk kontes hias & pemuliaan bibit — lihat tab Populasi Ternak (/livestock). Hasil ikutan cukur wol tersedia di tab Hasil Ikutan."
                    }),
                    (0,O.jsx)("span", {
                      className: "text-emerald-700 font-semibold",
                      children: "Sumber: Distankan KP"
                    })
                  ]
                })
              ]
            }),

            // Special notes jika komoditas khusus yang belum ada datanya di BPS
            curUtama.isSpecial && (0,O.jsxs)("div", {
              className: "p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs",
              children: [
                (0,O.jsxs)("strong", { children: [curUtama.label, ": "] }),
                "Data komoditas ini belum tersedia pada sinkronisasi periode ini. Form isian dan template Excel telah disiapkan pada Dasbor Admin untuk pendataan resmi dinas."
              ]
            }),

            // Filter bar (Kecamatan & Tahun)
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
                  label: "Tahun",
                  children: (0,O.jsxs)("select", {
                    value: selectedTahun,
                    onChange: e => setSelectedTahun(e.target.value),
                    className: "w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm",
                    children: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"].map(t => (
                      (0,O.jsx)("option", { value: t, children: t }, t)
                    ))
                  })
                })
              ]
            }),

            // Total Summary KPI
            (0,O.jsxs)("div", {
              className: "grid gap-4 sm:grid-cols-3",
              children: [
                (0,O.jsx)(f, {
                  icon: (0,O.jsx)(r, { className: "h-5 w-5 text-emerald-700" }),
                  label: "Total Produksi " + curUtama.label,
                  value: curUtama.isSpecial ? "Menunggu Data" : fmtNum(totalUtamaVol),
                  unit: curUtama.unit,
                  color: "bg-emerald-100",
                  hint: "Total data terlaporkan pada tahun " + selectedTahun
                }),
                (0,O.jsx)(f, {
                  icon: (0,O.jsx)(a, { className: "h-5 w-5 text-slate-700" }),
                  label: "Wilayah Pelapor",
                  value: filteredUtamaRows.length + " Kecamatan",
                  unit: "",
                  color: "bg-slate-100",
                  hint: "Hanya menampilkan kecamatan dengan produksi > 0"
                }),
                (0,O.jsx)(f, {
                  icon: (0,O.jsx)(n, { className: "h-5 w-5 text-blue-700" }),
                  label: "Tahun Data",
                  value: "Tahun " + selectedTahun,
                  unit: "",
                  color: "bg-blue-100",
                  hint: "Sumber data: Distankan KP Banjarnegara"
                })
              ]
            }),

            // Data Table (Strict Zero-Empty Law Applied: rows with 0 are not rendered)
            (0,O.jsx)(d, {
              title: "Tabel Produksi " + curUtama.label + " per Kecamatan (" + selectedTahun + ")",
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
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-left text-xs font-semibold text-slate-700", children: "No" }),
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-left text-xs font-semibold text-slate-700", children: "Kecamatan" }),
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-left text-xs font-semibold text-slate-700", children: "Komoditas" }),
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-right text-xs font-semibold text-slate-700", children: "Banyaknya / Jumlah" }),
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-left text-xs font-semibold text-slate-700", children: "Satuan" })
                          ]
                        })
                      }),
                      (0,O.jsx)("tbody", {
                        children: filteredUtamaRows.length > 0 ? (
                          (0,O.jsxs)(O.Fragment, {
                            children: [
                              filteredUtamaRows.map((row, idx) => (
                                (0,O.jsxs)("tr", {
                                  key: row.kecamatan,
                                  className: "border-b border-slate-100 hover:bg-slate-50",
                                  children: [
                                    (0,O.jsx)("td", { className: "px-3 py-2 text-slate-500", children: idx + 1 }),
                                    (0,O.jsx)("td", { className: "px-3 py-2 font-medium text-slate-800", children: row.kecamatan }),
                                    (0,O.jsx)("td", { className: "px-3 py-2 text-slate-600", children: curUtama.label }),
                                    (0,O.jsx)("td", { className: "px-3 py-2 text-right font-semibold tabular-nums text-slate-900", children: fmtNum(row.jumlah) }),
                                    (0,O.jsx)("td", { className: "px-3 py-2 text-slate-500", children: curUtama.unit })
                                  ]
                                })
                              )),
                              (0,O.jsxs)("tr", {
                                className: "border-t-2 border-slate-300 bg-slate-100 font-bold",
                                children: [
                                  (0,O.jsx)("td", { colSpan: 3, className: "px-3 py-2.5 text-slate-800", children: "Total Produksi Kabupaten (" + selectedTahun + ")" }),
                                  (0,O.jsx)("td", { className: "px-3 py-2.5 text-right text-emerald-800 tabular-nums", children: fmtNum(totalUtamaVol) }),
                                  (0,O.jsx)("td", { className: "px-3 py-2.5 text-slate-700", children: curUtama.unit })
                                ]
                              })
                            ]
                          })
                        ) : (
                          (0,O.jsx)("tr", {
                            children: (0,O.jsx)("td", {
                              colSpan: 5,
                              className: "px-4 py-8 text-center text-xs text-slate-500",
                              children: curUtama.isSpecial
                                ? "Data komoditas ini belum diunggah. Silakan lakukan pengisian melalui Menu Admin."
                                : "Tidak ada data produksi dengan nilai lebih dari 0 pada tahun dan kecamatan yang dipilih."
                            })
                          })
                        )
                      })
                    ]
                  })
                ]
              })
            })
          ]
        }),

        // TAB 2: HASIL IKUTAN (KULIT PER JENIS HEWAN & TURUNAN RPH)
        tab === "ikutan" && (0,O.jsxs)(O.Fragment, {
          children: [
            // Species Pill Selector for Byproducts (Strictly separated per species)
            (0,O.jsxs)("div", {
              className: "bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3.5",
              children: [
                (0,O.jsxs)("div", {
                  className: "flex items-center justify-between border-b border-slate-100 pb-2.5",
                  children: [
                    (0,O.jsx)("span", {
                      className: "text-xs font-bold text-slate-800 uppercase tracking-wide",
                      children: "Pilih Jenis Kulit & Hasil Ikutan (Terpisah per Hewan):"
                    }),
                    (0,O.jsxs)("span", {
                      className: "text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full",
                      children: [curIkutan.label, " (", curIkutan.unit, ")"]
                    })
                  ]
                }),
                (0,O.jsx)("div", {
                  className: "flex flex-wrap gap-2",
                  children: Object.entries(IKUTAN_SPECIES).map(([key, item]) => {
                    const isActive = ikutanKey === key;
                    return (0,O.jsxs)("button", {
                      type: "button",
                      key: key,
                      onClick: () => setIkutanKey(key),
                      style: isActive ? {
                        backgroundColor: "#047857",
                        color: "#ffffff",
                        borderColor: "#047857",
                        boxShadow: "0 2px 4px rgba(4, 120, 87, 0.25)"
                      } : {
                        backgroundColor: "#ffffff",
                        color: "#334155",
                        borderColor: "#cbd5e1"
                      },
                      className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:border-emerald-600",
                      children: [
                        (0,O.jsx)("span", {
                          style: { color: isActive ? "#ffffff" : "#1e293b" },
                          children: item.label
                        }),
                        (0,O.jsx)("span", {
                          style: isActive ? {
                            backgroundColor: "rgba(255, 255, 255, 0.25)",
                            color: "#ffffff"
                          } : {
                            backgroundColor: "#f1f5f9",
                            color: "#64748b"
                          },
                          className: "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                          children: item.unit
                        })
                      ]
                    });
                  })
                })
              ]
            }),

            // Filter bar (Kecamatan & Tahun)
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
                  label: "Tahun",
                  children: (0,O.jsxs)("select", {
                    value: selectedTahun,
                    onChange: e => setSelectedTahun(e.target.value),
                    className: "w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm",
                    children: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"].map(t => (
                      (0,O.jsx)("option", { value: t, children: t }, t)
                    ))
                  })
                })
              ]
            }),

            // Total Summary KPI
            (0,O.jsxs)("div", {
              className: "grid gap-4 sm:grid-cols-3",
              children: [
                (0,O.jsx)(f, {
                  icon: (0,O.jsx)(r, { className: "h-5 w-5 text-emerald-700" }),
                  label: "Total " + curIkutan.label,
                  value: curIkutan.isSpecial ? "Menunggu Data" : fmtNum(totalIkutanVol),
                  unit: curIkutan.unit,
                  color: "bg-emerald-100",
                  hint: "Total data terlaporkan pada tahun " + selectedTahun
                }),
                (0,O.jsx)(f, {
                  icon: (0,O.jsx)(a, { className: "h-5 w-5 text-slate-700" }),
                  label: "Wilayah Pelapor",
                  value: filteredIkutanRows.length + " Kecamatan",
                  unit: "",
                  color: "bg-slate-100",
                  hint: "Hanya menampilkan kecamatan dengan produksi > 0"
                }),
                (0,O.jsx)(f, {
                  icon: (0,O.jsx)(n, { className: "h-5 w-5 text-blue-700" }),
                  label: "Tahun Data",
                  value: "Tahun " + selectedTahun,
                  unit: "",
                  color: "bg-blue-100",
                  hint: "Sumber data: Distankan KP"
                })
              ]
            }),

            // Data Table (Strict Zero-Empty Law Applied: rows with 0 are not rendered)
            (0,O.jsx)(d, {
              title: "Tabel Produksi " + curIkutan.label + " per Kecamatan (" + selectedTahun + ")",
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
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-left text-xs font-semibold text-slate-700", children: "No" }),
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-left text-xs font-semibold text-slate-700", children: "Kecamatan" }),
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-left text-xs font-semibold text-slate-700", children: "Komoditas" }),
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-right text-xs font-semibold text-slate-700", children: "Banyaknya / Jumlah" }),
                            (0,O.jsx)("th", { className: "px-3 py-2.5 text-left text-xs font-semibold text-slate-700", children: "Satuan" })
                          ]
                        })
                      }),
                      (0,O.jsx)("tbody", {
                        children: filteredIkutanRows.length > 0 ? (
                          (0,O.jsxs)(O.Fragment, {
                            children: [
                              filteredIkutanRows.map((row, idx) => (
                                (0,O.jsxs)("tr", {
                                  key: row.kecamatan,
                                  className: "border-b border-slate-100 hover:bg-slate-50",
                                  children: [
                                    (0,O.jsx)("td", { className: "px-3 py-2 text-slate-500", children: idx + 1 }),
                                    (0,O.jsx)("td", { className: "px-3 py-2 font-medium text-slate-800", children: row.kecamatan }),
                                    (0,O.jsx)("td", { className: "px-3 py-2 text-slate-600", children: curIkutan.label }),
                                    (0,O.jsx)("td", { className: "px-3 py-2 text-right font-semibold tabular-nums text-slate-900", children: fmtNum(row.jumlah) }),
                                    (0,O.jsx)("td", { className: "px-3 py-2 text-slate-500", children: curIkutan.unit })
                                  ]
                                })
                              )),
                              (0,O.jsxs)("tr", {
                                className: "border-t-2 border-slate-300 bg-slate-100 font-bold",
                                children: [
                                  (0,O.jsx)("td", { colSpan: 3, className: "px-3 py-2.5 text-slate-800", children: "Total Produksi Kabupaten (" + selectedTahun + ")" }),
                                  (0,O.jsx)("td", { className: "px-3 py-2.5 text-right text-emerald-800 tabular-nums", children: fmtNum(totalIkutanVol) }),
                                  (0,O.jsx)("td", { className: "px-3 py-2.5 text-slate-700", children: curIkutan.unit })
                                ]
                              })
                            ]
                          })
                        ) : (
                          (0,O.jsx)("tr", {
                            children: (0,O.jsx)("td", {
                              colSpan: 5,
                              className: "px-4 py-8 text-center text-xs text-slate-500",
                              children: curIkutan.isSpecial
                                ? "Data belum tersedia pada sistem. Silakan input atau unggah data melalui Menu Admin."
                                : "Tidak ada data produksi dengan nilai lebih dari 0 pada tahun dan kecamatan yang dipilih."
                            })
                          })
                        )
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
              className: "text-xs text-slate-600 leading-relaxed mb-4",
              children: "Simulasi perhitungan kebutuhan penambahan lahan Hijauan Pakan Ternak (HPT) untuk mengestimasi produksi hijauan dan kapasitas daya tampung Satuan Ternak (ST)."
            }),

            // Parameter Controls
            (0,O.jsxs)("div", {
              className: "p-4 bg-slate-50 rounded-xl border border-slate-200",
              children: [
                (0,O.jsx)("h3", {
                  className: "text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3",
                  children: "Parameter Simulasi Lahan HPT"
                }),

                (0,O.jsxs)("div", {
                  className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                  children: [
                    (0,O.jsxs)("div", {
                      children: [
                        (0,O.jsx)("label", { className: "block text-xs text-slate-600 mb-1", children: "Kecamatan Target:" }),
                        (0,O.jsx)("select", {
                          value: hptKec,
                          onChange: e => setHptKec(e.target.value),
                          className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800",
                          children: KEC_LIST.map(k => (0,O.jsx)("option", { value: k, children: k }, k))
                        })
                      ]
                    }),

                    (0,O.jsxs)("div", {
                      children: [
                        (0,O.jsxs)("label", {
                          className: "block text-xs text-slate-600 mb-1 flex justify-between",
                          children: [
                            (0,O.jsx)("span", { children: "Rencana Luas Lahan:" }),
                            (0,O.jsxs)("span", { className: "font-semibold text-emerald-800", children: [hptLuas, " Ha"] })
                          ]
                        }),
                        (0,O.jsx)("input", {
                          type: "range",
                          min: "0.5",
                          max: "25",
                          step: "0.5",
                          value: hptLuas,
                          onChange: e => setHptLuas(Number(e.target.value)),
                          className: "w-full accent-emerald-700 cursor-pointer"
                        }),
                        (0,O.jsxs)("div", {
                          className: "flex justify-between text-[10px] text-slate-400 mt-0.5",
                          children: [(0,O.jsx)("span", { children: "0.5 Ha" }), (0,O.jsx)("span", { children: "25 Ha" })]
                        })
                      ]
                    }),

                    (0,O.jsxs)("div", {
                      children: [
                        (0,O.jsx)("label", { className: "block text-xs text-slate-600 mb-1", children: "Jenis Hijauan:" }),
                        (0,O.jsx)("select", {
                          value: hptVar,
                          onChange: e => setHptVar(e.target.value),
                          className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800",
                          children: Object.entries(HPT_VARIETIES).map(([k, item]) => (
                            (0,O.jsx)("option", { value: k, children: item.name }, k)
                          ))
                        })
                      ]
                    })
                  ]
                }),

                (0,O.jsx)("p", {
                  className: "mt-3 text-xs text-slate-500 border-t border-slate-200 pt-2",
                  children: selectedVarInfo.desc
                })
              ]
            }),

            // Simulation Outputs Cards
            (0,O.jsxs)("div", {
              className: "grid grid-cols-1 sm:grid-cols-4 gap-4",
              children: [
                (0,O.jsxs)("div", {
                  className: "p-4 bg-white rounded-xl border border-slate-200 shadow-sm",
                  children: [
                    (0,O.jsx)("span", { className: "text-xs text-slate-500 uppercase font-medium", children: "Estimasi Hasil Panen" }),
                    (0,O.jsxs)("p", { className: "text-xl font-bold text-slate-800 my-1 tabular-nums", children: [fmtNum(hptTotalYield), " Ton/Tahun"] }),
                    (0,O.jsxs)("span", { className: "text-[11px] text-slate-400", children: ["Wilayah Kec. ", hptKec] })
                  ]
                }),
                (0,O.jsxs)("div", {
                  className: "p-4 bg-white rounded-xl border border-slate-200 shadow-sm",
                  children: [
                    (0,O.jsx)("span", { className: "text-xs text-slate-500 uppercase font-medium", children: "Daya Tampung Satuan Ternak" }),
                    (0,O.jsxs)("p", { className: "text-xl font-bold text-emerald-800 my-1 tabular-nums", children: [fmtNum(hptCarryingCapacityST), " ST"] }),
                    (0,O.jsx)("span", { className: "text-[11px] text-slate-400", children: "Kebutuhan ~12 ton hijauan/ST/th" })
                  ]
                }),
                (0,O.jsxs)("div", {
                  className: "p-4 bg-white rounded-xl border border-slate-200 shadow-sm",
                  children: [
                    (0,O.jsx)("span", { className: "text-xs text-slate-500 uppercase font-medium", children: "Setara Sapi Potong" }),
                    (0,O.jsxs)("p", { className: "text-xl font-bold text-slate-800 my-1 tabular-nums", children: [fmtNum(hptSapiCount), " Ekor"] }),
                    (0,O.jsx)("span", { className: "text-[11px] text-slate-400", children: "1 ST = 1 ekor sapi dewasa" })
                  ]
                }),
                (0,O.jsxs)("div", {
                  className: "p-4 bg-white rounded-xl border border-slate-200 shadow-sm",
                  children: [
                    (0,O.jsx)("span", { className: "text-xs text-slate-500 uppercase font-medium", children: "Setara Domba / Kambing" }),
                    (0,O.jsxs)("p", { className: "text-xl font-bold text-slate-800 my-1 tabular-nums", children: [fmtNum(hptDombaCount), " Ekor"] }),
                    (0,O.jsx)("span", { className: "text-[11px] text-slate-400", children: "1 ST = 7 ekor domba/kambing" })
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

export default View;
`;

fs.writeFileSync('dist/assets/peternakan-susu-kulit-B1vV3OM5.js', code, 'utf8');
console.log('Successfully generated upgraded peternakan-susu-kulit-B1vV3OM5.js with high contrast active state and zero slop!');
