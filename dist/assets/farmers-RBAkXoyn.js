import { m as e, t } from "./default-CAKe9ffW.js";
import { i as n } from "./x-CXWFwwzx.js";
import { t as r } from "./file-spreadsheet-R11Sgu_C.js";
import { t as i } from "./funnel-DPwG6jvG.js";
import { t as a } from "./shield-alert-CgAkH6h8.js";
import { C as o, b as s, p as c, s as l } from "./index-CI1XYnwk.js";
import { V as u, m as d, p as f, r as p } from "./api-BxFGoia1.js";
import { Z as m, d as h, f as g, g as _, in as v, t as y, u as b } from "./BarChart-CCPNsfhB.js";
import { t as x } from "./Legend-DA0d5fUM.js";
import { t as S } from "./ReferenceLine-C2bQas7I.js";
import { n as C, t as ee } from "./LineChart-BhctH1ao.js";

var w = o(s(), 1);
var T = c();
var E = [
  "Banjarmangu", "Banjarnegara", "Batur", "Bawang", "Kalibening",
  "Karangkobar", "Madukara", "Mandiraja", "Pagedongan", "Pagentan",
  "Pandanarum", "Pejawaran", "Punggelan", "Purwanegara", "Purwareja Klampok",
  "Rakit", "Sigaluh", "Susukan", "Wanadadi", "Wanayasa"
];

function D(e, t) {
  let n = e.length;
  if (n === 0) return 0;
  if (n === 1) return Math.round(e[0].y);
  let r = e.reduce((e, t) => e + t.x, 0),
    i = e.reduce((e, t) => e + t.y, 0),
    a = e.reduce((e, t) => e + t.x * t.y, 0),
    o = e.reduce((e, t) => e + t.x * t.x, 0),
    s = (n * a - r * i) / (n * o - r * r),
    c = (i - s * r) / n;
  return Math.max(0, Math.round(s * t + c));
}

function FarmersPage() {
  // State untuk Data Agregat Eksisting
  let [o, s] = (0, w.useState)([]);
  let [c, O] = (0, w.useState)([]);
  let [k, A] = (0, w.useState)([]);
  let [j, M] = (0, w.useState)(null);
  let [N, te] = (0, w.useState)("Semua");
  let [P, F] = (0, w.useState)(true);
  let [I, L] = (0, w.useState)(false);
  let [R, z] = (0, w.useState)(null);

  // State untuk Tab Navigasi & Data Baru
  let [activeTab, setActiveTab] = (0, w.useState)("pertanian");
  let [searchQuery, setSearchQuery] = (0, w.useState)("");
  let [filterJenis, setFilterJenis] = (0, w.useState)("Semua");

  let [dataPertanian, setDataPertanian] = (0, w.useState)([]);
  let [dataPerikanan, setDataPerikanan] = (0, w.useState)([]);
  let [dataJuleha, setDataJuleha] = (0, w.useState)([]);
  let [dataP4s, setDataP4s] = (0, w.useState)([]);
  let [dataUpja, setDataUpja] = (0, w.useState)([]);
  let [loadingEntities, setLoadingEntities] = (0, w.useState)(true);

  // Load Data Agregat
  (0, w.useEffect)(() => {
    (async () => {
      z(null);
      try {
        let [e, t, n] = await Promise.all([f(), d(), u()]);
        s(e);
        O(t);
        A(n);
      } catch (e) {
        let t = e instanceof Error ? e.message : String(e);
        console.error("Gagal memuat data kelompok tani:", e);
        z(t);
      } finally {
        F(false);
      }
    })();
  }, []);

  // Load Data Entitas Terperinci (Pertanian, Perikanan, JULEHA, P4S, UPJA)
  let fetchEntities = async () => {
    setLoadingEntities(true);
    try {
      let [resPert, resIkan, resJuleha, resP4s, resUpja] = await Promise.all([
        fetch("/sispertani-api/v1/kelembagaan/pertanian").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/perikanan").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/juleha").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/p4s").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/upja").then(r => r.json()).catch(() => ({ data: [] }))
      ]);
      setDataPertanian(resPert.data || []);
      setDataPerikanan(resIkan.data || []);
      setDataJuleha(resJuleha.data || []);
      setDataP4s(resP4s.data || []);
      setDataUpja(resUpja.data || []);
    } catch (err) {
      console.error("Gagal memuat entitas kelembagaan terperinci:", err);
    } finally {
      setLoadingEntities(false);
    }
  };

  (0, w.useEffect)(() => {
    fetchEntities();
  }, []);

  (0, w.useEffect)(() => {
    if (!P && j === null) {
      let e = o.map(e => e.tahun).filter(e => e && /^\d{4}$/.test(e) && parseInt(e) <= 2025);
      let t = Array.from(new Set(e)).sort((e, t) => t.localeCompare(e));
      t.length > 0 && M(t[0]);
    }
  }, [P, o, j]);

  let B = () => {
    if (I) return;
    L(true);
    p("kelompok_tani");
    F(true);
    s([]);
    z(null);
    (async () => {
      try {
        let [e, t, n] = await Promise.all([f(), d(), u()]);
        s(e);
        O(t);
        A(n);
        await fetchEntities();
      } catch (e) {
        let t = e instanceof Error ? e.message : String(e);
        console.error("Gagal memuat ulang data kelompok tani:", e);
        z(t);
      } finally {
        F(false);
        L(false);
      }
    })();
  };

  let V = e => e || "Unknown";
  let H = (0, w.useMemo)(() => {
    let e = new Map();
    o.forEach(t => {
      t.tahun && /^\d{4}$/.test(t.tahun) && e.set(t.tahun, (e.get(t.tahun) || 0) + 1);
    });
    return e;
  }, [o]);

  let U = (0, w.useMemo)(() => {
    if (H.size === 0) return new Set();
    let e = Math.max(...H.values());
    return new Set(Array.from(H.entries()).filter(([, t]) => t < e * 0.6).map(([e]) => e));
  }, [H]);

  let W = (0, w.useMemo)(() => Array.from(H.keys()).sort((e, t) => t.localeCompare(e)), [H]);
  (0, w.useEffect)(() => {
    j !== null && W.length > 0 && !W.includes(j) && M(W[0]);
  }, [W, j]);

  let G = (0, w.useMemo)(() => o.filter(e => e.tahun === j), [o, j]);
  let K = (0, w.useMemo)(() => ["Semua", ...E], []);
  let q = (0, w.useMemo)(() => N === "Semua" ? G : G.filter(e => V(e.kecamatan) === N), [G, N]);

  let J = (0, w.useMemo)(() => {
    let e = 0, t = 0, n = 0, r = 0, i = 0, a = 0, o = 0, s = -1, c = "-", l = new Map();
    q.forEach(s => {
      e += s.kelompokTani;
      t += s.anggotaTani;
      n += s.kelompokPerikanan;
      r += s.anggotaPerikanan;
      i += s.gapoktan;
      a += s.anggotaGapoktan;
      o += s.kelompokTaniHutan || 0;
      let c = V(s.kecamatan),
        u = s.kelompokTani + s.kelompokPerikanan + s.gapoktan + (s.kelompokTaniHutan || 0);
      l.set(c, (l.get(c) || 0) + u);
    });
    l.forEach((e, t) => {
      if (e > s) { s = e; c = t; }
    });
    return {
      kelompokTani: e,
      anggotaTani: t,
      kelompokPerikanan: n,
      anggotaPerikanan: r,
      gapoktan: i,
      anggotaGapoktan: a,
      kelompokTaniHutan: o,
      topDistrict: c,
      maxGroups: s
    };
  }, [q]);

  let Y = (0, w.useMemo)(() => {
    let e = new Map();
    q.forEach(t => {
      let n = V(t.kecamatan);
      if (!e.has(n)) e.set(n, { name: n, "Kelompok Tani": 0, "Anggota Tani": 0, "Kelompok Perikanan": 0, "Anggota Perikanan": 0, Gapoktan: 0, "Anggota Gapoktan": 0, "Kelompok Tani Hutan": 0, totalKelompok: 0 });
      let r = e.get(n);
      r["Kelompok Tani"] += t.kelompokTani;
      r["Anggota Tani"] += t.anggotaTani;
      r["Kelompok Perikanan"] += t.kelompokPerikanan;
      r["Anggota Perikanan"] += t.anggotaPerikanan;
      r.Gapoktan += t.gapoktan;
      r["Anggota Gapoktan"] += t.anggotaGapoktan;
      r["Kelompok Tani Hutan"] += t.kelompokTaniHutan || 0;
      r.totalKelompok += t.kelompokTani + t.kelompokPerikanan + t.gapoktan + (t.kelompokTaniHutan || 0);
    });
    return Array.from(e.values()).sort((e, t) => t.totalKelompok - e.totalKelompok);
  }, [q]);

  let X = (0, w.useMemo)(() => {
    let e = N === "Semua" ? c : c.filter(e => V(e.kecamatan) === N);
    return {
      kelompok: e.reduce((e, t) => e + (t.kelompokTaniHutan || 0), 0),
      desa: e.filter(e => (e.kelompokTaniHutan || 0) > 0).length,
      pemula: e.reduce((e, t) => e + (t.kthPemula || 0), 0),
      madya: e.reduce((e, t) => e + (t.kthMadya || 0), 0),
      utama: e.reduce((e, t) => e + (t.kthUtama || 0), 0)
    };
  }, [c, N]);

  let Z = (0, w.useMemo)(() => {
    let e = N === "Semua" ? k : k.filter(e => (e.kecamatan || "").toUpperCase() === N.toUpperCase());
    return {
      petani: e.reduce((e, t) => e + (t.petani || 0), 0),
      rtAnggotaKelompok: e.reduce((e, t) => e + (t.rtAnggotaKelompok || 0), 0),
      rtup: e.reduce((e, t) => e + (t.rtup || 0), 0),
      desa: e.length
    };
  }, [k, N]);

  let ne = (0, w.useMemo)(() => {
    if (N === "Semua" || q.length === 0) return false;
    return q.every(e => (e.kelompokTani || 0) === 0 && (e.anggotaTani || 0) === 0 && (e.kelompokPerikanan || 0) === 0 && (e.gapoktan || 0) === 0);
  }, [q, N]);

  let Q = (0, w.useMemo)(() => {
    let e = N === "Semua" ? o : o.filter(e => V(e.kecamatan) === N);
    let t = new Map();
    e.forEach(e => {
      let n = e.tahun;
      if (!n || parseInt(n) > 2025 || U.has(n)) return;
      if (!t.has(n)) t.set(n, { tahun: n, "Kelompok Tani": 0, "Anggota Tani": 0, "Kelompok Perikanan": 0, "Anggota Perikanan": 0, Gapoktan: 0, "Anggota Gapoktan": 0, totalKelompok: 0, totalAnggota: 0, isPrediction: false });
      let r = t.get(n);
      r["Kelompok Tani"] += e.kelompokTani;
      r["Anggota Tani"] += e.anggotaTani;
      r["Kelompok Perikanan"] += e.kelompokPerikanan;
      r["Anggota Perikanan"] += e.anggotaPerikanan;
      r.Gapoktan += e.gapoktan;
      r["Anggota Gapoktan"] += e.anggotaGapoktan;
      r.totalKelompok += e.kelompokTani + e.kelompokPerikanan + e.gapoktan;
      r.totalAnggota += e.anggotaTani + e.anggotaPerikanan + e.anggotaGapoktan;
    });
    let n = Array.from(t.values()).sort((e, t) => e.tahun.localeCompare(t.tahun));
    if (!n.some(e => e.tahun === "2026" && !e.isPrediction) && n.length >= 3) {
      let e = ["totalAnggota", "Anggota Tani", "Anggota Perikanan", "Anggota Gapoktan", "Kelompok Tani", "Kelompok Perikanan", "Gapoktan", "totalKelompok"];
      let t = { tahun: "2026", isPrediction: true };
      e.forEach(e => {
        t[e] = D(n.map(t => ({ x: parseInt(t.tahun), y: t[e] })), 2026);
      });
      n.push(t);
    }
    return n;
  }, [o, N, U]);

  let $ = e => new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(e || 0);

  // Filter Data Tab Terperinci
  let filteredPertanian = (0, w.useMemo)(() => {
    return dataPertanian.filter(item => {
      let matchKec = N === "Semua" || (item.kecamatan && item.kecamatan.toLowerCase() === N.toLowerCase());
      let matchJenis = filterJenis === "Semua" || item.jenis_lembaga === filterJenis;
      let matchQuery = !searchQuery || [
        item.nama_kelompok, item.desa, item.id_simluhtan, item.nama_ketua, item.subsektor_utama
      ].some(val => val && String(val).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchKec && matchJenis && matchQuery;
    });
  }, [dataPertanian, N, filterJenis, searchQuery]);

  let filteredPerikanan = (0, w.useMemo)(() => {
    return dataPerikanan.filter(item => {
      let matchKec = N === "Semua" || (item.kecamatan && item.kecamatan.toLowerCase() === N.toLowerCase());
      let matchJenis = filterJenis === "Semua" || item.jenis_lembaga === filterJenis;
      let matchQuery = !searchQuery || [
        item.nama_kelompok, item.desa, item.id_kusuka, item.nama_ketua, item.komoditas_utama
      ].some(val => val && String(val).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchKec && matchJenis && matchQuery;
    });
  }, [dataPerikanan, N, filterJenis, searchQuery]);

  let filteredJuleha = (0, w.useMemo)(() => {
    return dataJuleha.filter(item => {
      let matchKec = N === "Semua" || (item.kecamatan && item.kecamatan.toLowerCase() === N.toLowerCase());
      let matchQuery = !searchQuery || [
        item.nama_lengkap, item.desa, item.no_sertifikat_halal, item.unit_tugas, item.lembaga_penerbit
      ].some(val => val && String(val).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchKec && matchQuery;
    });
  }, [dataJuleha, N, searchQuery]);

  let filteredP4s = (0, w.useMemo)(() => {
    return dataP4s.filter(item => {
      let matchKec = N === "Semua" || (item.kecamatan && item.kecamatan.toLowerCase() === N.toLowerCase());
      let matchQuery = !searchQuery || [
        item.nama_p4s, item.desa, item.pengelola, item.bidang_kejuruan, item.no_register_bppsdmp
      ].some(val => val && String(val).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchKec && matchQuery;
    });
  }, [dataP4s, N, searchQuery]);

  let filteredUpja = (0, w.useMemo)(() => {
    return dataUpja.filter(item => {
      let matchKec = N === "Semua" || (item.kecamatan && item.kecamatan.toLowerCase() === N.toLowerCase());
      let matchQuery = !searchQuery || [
        item.nama_upja, item.desa, item.manajer, item.gapoktan_induk, item.jenis_alsintan_dikelola
      ].some(val => val && String(val).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchKec && matchQuery;
    });
  }, [dataUpja, N, searchQuery]);

  // Placeholder Banner Component
  let PlaceholderBanner = ({ title, domainSlug, count }) => (
    (0, T.jsxs)("div", {
      className: "bg-amber-50/80 border border-amber-200/90 rounded-lg p-4 mb-6 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs",
      children: [
        (0, T.jsxs)("div", {
          className: "flex items-start gap-3",
          children: [
            (0, T.jsx)("span", {
              className: "p-1.5 bg-amber-100 text-amber-800 rounded-md shrink-0 mt-0.5",
              children: (0, T.jsx)(n, { className: "h-4 w-4" })
            }),
            (0, T.jsxs)("div", {
              children: [
                (0, T.jsxs)("h5", {
                  className: "text-xs font-bold text-amber-900 uppercase tracking-wide",
                  children: ["Status Data: Menunggu Finalisasi List Resmi Dinas (", count, " Terdaftar)"]
                }),
                (0, T.jsx)("p", {
                  className: "text-xs text-amber-800/90 mt-0.5 leading-relaxed",
                  children: "Data saat ini merupakan register awal terverifikasi. Untuk pembaruan massal dan sinkronisasi berkas resmi dinas, admin dapat mengunduh template Excel dan mengunggahnya langsung melalui dasbor."
                })
              ]
            })
          ]
        }),
        (0, T.jsxs)("a", {
          href: "/admin",
          className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-md whitespace-nowrap transition-colors",
          children: [
            (0, T.jsx)(r, { className: "h-3.5 w-3.5" }),
            "Template Excel di Dasbor Admin"
          ]
        })
      ]
    })
  );

  return (0, T.jsx)(t, {
    children: (0, T.jsxs)("section", {
      className: "flex flex-col gap-6 py-2",
      children: [
        // Header Halaman
        (0, T.jsxs)("section", {
          className: "relative text-left animate-fade-in py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200 pb-6",
          children: [
            (0, T.jsxs)("div", {
              className: "relative z-10 flex-1",
              children: [
                (0, T.jsx)("h2", {
                  className: "text-2xl sm:text-3xl leading-tight font-bold tracking-tight text-slate-800",
                  children: "Kelembagaan Tani & Perikanan"
                }),
                (0, T.jsx)("p", {
                  className: "text-xs md:text-sm font-medium text-slate-500 mt-2 max-w-2xl border-l-2 border-emerald-500 pl-3",
                  children: "Pencatatan Kelompok Tani (Poktan, Gapoktan, KWT), Kelembagaan Perikanan (Pokdakan, Poklahsar, Pokmaswas), Lembaga Pendukung (P4S, UPJA), serta Juru Sembelih Halal (JULEHA) Kabupaten Banjarnegara."
                })
              ]
            }),
            (0, T.jsx)("div", {
              className: "w-full md:w-48 lg:w-56 shrink-0 flex items-center justify-center",
              children: (0, T.jsx)("img", {
                src: "/img/farmers.png",
                alt: "Kelembagaan Tani",
                className: "w-full max-h-28 md:max-h-32 object-contain"
              })
            })
          ]
        }),

        // Tab Navigation Switcher (5 Sub-tab Utama)
        (0, T.jsxs)("div", {
          className: "flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar text-left",
          children: [
            (0, T.jsxs)("button", {
              type: "button",
              onClick: () => { setActiveTab("pertanian"); setFilterJenis("Semua"); },
              className: `px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "pertanian"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`,
              children: [
                "Kelembagaan Pertanian",
                (0, T.jsx)("span", {
                  className: `text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === "pertanian" ? "bg-amber-700 text-amber-100" : "bg-slate-200 text-slate-600"
                  }`,
                  children: dataPertanian.length
                })
              ]
            }),
            (0, T.jsxs)("button", {
              type: "button",
              onClick: () => { setActiveTab("perikanan"); setFilterJenis("Semua"); },
              className: `px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "perikanan"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`,
              children: [
                "Kelembagaan Perikanan",
                (0, T.jsx)("span", {
                  className: `text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === "perikanan" ? "bg-blue-700 text-blue-100" : "bg-slate-200 text-slate-600"
                  }`,
                  children: dataPerikanan.length
                })
              ]
            }),
            (0, T.jsxs)("button", {
              type: "button",
              onClick: () => { setActiveTab("pendukung"); setFilterJenis("Semua"); },
              className: `px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "pendukung"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`,
              children: [
                "Lembaga Pendukung (P4S & UPJA)",
                (0, T.jsx)("span", {
                  className: `text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === "pendukung" ? "bg-emerald-700 text-emerald-100" : "bg-slate-200 text-slate-600"
                  }`,
                  children: dataP4s.length + dataUpja.length
                })
              ]
            }),
            (0, T.jsxs)("button", {
              type: "button",
              onClick: () => { setActiveTab("juleha"); setFilterJenis("Semua"); },
              className: `px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "juleha"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`,
              children: [
                "Juru Sembelih Halal (JULEHA)",
                (0, T.jsx)("span", {
                  className: `text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === "juleha" ? "bg-purple-700 text-purple-100" : "bg-slate-200 text-slate-600"
                  }`,
                  children: dataJuleha.length
                })
              ]
            }),
            (0, T.jsxs)("button", {
              type: "button",
              onClick: () => { setActiveTab("rekap"); },
              className: `px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "rekap"
                  ? "bg-slate-800 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`,
              children: [
                "Rekap Desa & Statistik",
                (0, T.jsx)("span", {
                  className: `text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === "rekap" ? "bg-slate-900 text-slate-200" : "bg-slate-200 text-slate-600"
                  }`,
                  children: q.length > 0 ? `${q.length} desa` : "Statistik"
                })
              ]
            })
          ]
        }),

        // Filter Controls Bar
        (0, T.jsxs)("div", {
          className: "grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-slate-200 p-4 rounded-lg shadow-xs text-left",
          children: [
            // Filter Kecamatan
            (0, T.jsxs)("div", {
              className: "flex flex-col gap-1.5",
              children: [
                (0, T.jsx)("label", {
                  className: "text-[11px] font-bold uppercase text-slate-500",
                  children: "Kecamatan"
                }),
                (0, T.jsxs)("div", {
                  className: "relative",
                  children: [
                    (0, T.jsx)(i, { className: "absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" }),
                    (0, T.jsx)("select", {
                      value: N,
                      onChange: e => te(e.target.value),
                      className: "w-full pl-9 pr-4 py-2 border border-slate-200 text-xs font-bold bg-white rounded-md focus:outline-none",
                      children: K.map(item => (0, T.jsx)("option", { value: item, children: item }, item))
                    })
                  ]
                })
              ]
            }),

            // Filter Jenis Lembaga (Khusus Tab Pertanian & Perikanan)
            activeTab === "pertanian" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-1.5",
              children: [
                (0, T.jsx)("label", {
                  className: "text-[11px] font-bold uppercase text-slate-500",
                  children: "Jenis Lembaga Pertanian"
                }),
                (0, T.jsx)("select", {
                  value: filterJenis,
                  onChange: e => setFilterJenis(e.target.value),
                  className: "w-full px-3 py-2 border border-slate-200 text-xs font-bold bg-white rounded-md focus:outline-none",
                  children: ["Semua", "Poktan", "Gapoktan", "KWT"].map(jns => (
                    (0, T.jsx)("option", { value: jns, children: jns }, jns)
                  ))
                })
              ]
            }),

            activeTab === "perikanan" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-1.5",
              children: [
                (0, T.jsx)("label", {
                  className: "text-[11px] font-bold uppercase text-slate-500",
                  children: "Jenis Lembaga Perikanan"
                }),
                (0, T.jsx)("select", {
                  value: filterJenis,
                  onChange: e => setFilterJenis(e.target.value),
                  className: "w-full px-3 py-2 border border-slate-200 text-xs font-bold bg-white rounded-md focus:outline-none",
                  children: ["Semua", "Pokdakan", "Poklahsar", "Pokmaswas"].map(jns => (
                    (0, T.jsx)("option", { value: jns, children: jns }, jns)
                  ))
                })
              ]
            }),

            // Filter Tahun untuk Tab Rekap
            activeTab === "rekap" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-1.5",
              children: [
                (0, T.jsx)("label", {
                  className: "text-[11px] font-bold uppercase text-slate-500",
                  children: "Tahun Data Rekap"
                }),
                (0, T.jsxs)("div", {
                  className: "relative",
                  children: [
                    (0, T.jsx)(e, { className: "absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" }),
                    (0, T.jsx)("select", {
                      value: j ?? "",
                      onChange: e => M(e.target.value),
                      disabled: j === null,
                      className: "w-full pl-9 pr-4 py-2 border border-slate-200 text-xs font-bold bg-white rounded-md focus:outline-none disabled:opacity-50",
                      children: W.map(item => (
                        (0, T.jsx)("option", { value: item, children: U.has(item) ? `${item} (parsial)` : item }, item)
                      ))
                    })
                  ]
                })
              ]
            }),

            // Search Bar Cepat (untuk tab selain rekap)
            activeTab !== "rekap" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-1.5 md:col-span-2",
              children: [
                (0, T.jsx)("label", {
                  className: "text-[11px] font-bold uppercase text-slate-500",
                  children: "Pencarian Cepat"
                }),
                (0, T.jsx)("input", {
                  type: "text",
                  placeholder: "Cari nama kelompok, no register / SK, ketua, desa...",
                  value: searchQuery,
                  onChange: e => setSearchQuery(e.target.value),
                  className: "w-full px-3 py-2 border border-slate-200 text-xs bg-white rounded-md focus:outline-none focus:border-emerald-500"
                })
              ]
            }),

            // Tombol Sinkronisasi Data
            (0, T.jsxs)("div", {
              className: "flex flex-col gap-1.5 justify-end",
              children: [
                (0, T.jsxs)("button", {
                  type: "button",
                  onClick: B,
                  disabled: P || I || loadingEntities,
                  className: "inline-flex items-center justify-center gap-2 w-full px-4 h-[38px] border border-slate-200 text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all rounded-md disabled:opacity-50",
                  children: [
                    (0, T.jsx)(r, { className: "h-3.5 w-3.5 text-slate-500" }),
                    I || loadingEntities ? "Memuat..." : "Sinkronkan Data"
                  ]
                })
              ]
            })
          ]
        }),

        // Loading State Utama
        (P || loadingEntities) ? (0, T.jsx)(l, { label: "Memuat basis data kelembagaan pertanian & perikanan..." }) : (0, T.jsxs)(T.Fragment, {
          children: [
            // =========================================================================
            // TAB 1: KELEMBAGAAN PERTANIAN (Poktan, Gapoktan, KWT)
            // =========================================================================
            activeTab === "pertanian" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-6",
              children: [
                (0, T.jsx)(PlaceholderBanner, {
                  title: "Kelembagaan Pertanian",
                  domainSlug: "kelembagaan-pertanian",
                  count: filteredPertanian.length
                }),
                // Ringkasan Kartu
                (0, T.jsxs)("div", {
                  className: "grid grid-cols-1 sm:grid-cols-4 gap-4 text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "bg-amber-50 border border-amber-200 p-4 rounded-lg",
                      children: [
                        (0, T.jsx)("span", { className: "text-[11px] font-bold text-amber-800 uppercase", children: "Kelompok Tani (Poktan)" }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-800 mt-1", children: [$(filteredPertanian.filter(x => x.jenis_lembaga === "Poktan").length), " unit"] })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-emerald-50 border border-emerald-200 p-4 rounded-lg",
                      children: [
                        (0, T.jsx)("span", { className: "text-[11px] font-bold text-emerald-800 uppercase", children: "Gapoktan" }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-800 mt-1", children: [$(filteredPertanian.filter(x => x.jenis_lembaga === "Gapoktan").length), " unit"] })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-rose-50 border border-rose-200 p-4 rounded-lg",
                      children: [
                        (0, T.jsx)("span", { className: "text-[11px] font-bold text-rose-800 uppercase", children: "Kelompok Wanita Tani (KWT)" }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-800 mt-1", children: [$(filteredPertanian.filter(x => x.jenis_lembaga === "KWT").length), " unit"] })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-slate-50 border border-slate-200 p-4 rounded-lg",
                      children: [
                        (0, T.jsx)("span", { className: "text-[11px] font-bold text-slate-600 uppercase", children: "Total Anggota Terdaftar" }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-800 mt-1", children: [$(filteredPertanian.reduce((acc, c) => acc + (Number(c.jumlah_anggota) || 0), 0)), " orang"] })
                      ]
                    })
                  ]
                }),

                // Tabel Register Kelembagaan Pertanian
                (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h4", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: "Buku Register Kelembagaan Pertanian (Simluhtan & SK)" }),
                            (0, T.jsx)("p", { className: "text-xs text-slate-500 mt-0.5", children: "Pencatatan legalitas, nomor register Simluhtan Kementan, SK pengukuhan, dan ketua kelompok." })
                          ]
                        }),
                        (0, T.jsxs)("span", {
                          className: "text-xs font-bold text-slate-600 px-2.5 py-1 bg-slate-100 rounded-md",
                          children: [`Menampilkan `, filteredPertanian.length, ` data`]
                        })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "overflow-x-auto",
                      children: (0, T.jsxs)("table", {
                        className: "w-full text-left text-xs border-collapse",
                        children: [
                          (0, T.jsx)("thead", {
                            className: "bg-slate-100 border-b border-slate-200 font-bold uppercase text-slate-600",
                            children: (0, T.jsxs)("tr", {
                              children: [
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "No" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Nama Kelompok" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Jenis" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "ID Simluhtan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "No. SK Pengukuhan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Wilayah (Desa, Kec)" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Ketua & Kontak" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Kelas" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Subsektor" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-right", children: "Anggota" }),
                                (0, T.jsx)("th", { className: "p-3 text-center", children: "Status" })
                              ]
                            })
                          }),
                          (0, T.jsx)("tbody", {
                            className: "divide-y divide-slate-100",
                            children: filteredPertanian.length === 0 ? (
                              (0, T.jsx)("tr", {
                                children: (0, T.jsx)("td", {
                                  colSpan: 11,
                                  className: "p-8 text-center text-slate-400 font-medium",
                                  children: "Belum ada data kelembagaan pertanian yang cocok dengan filter pencarian."
                                })
                              })
                            ) : (
                              filteredPertanian.map((item, idx) => (
                                (0, T.jsxs)("tr", {
                                  className: "hover:bg-slate-50 transition-colors",
                                  children: [
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold text-slate-500", children: idx + 1 }),
                                    (0, T.jsxs)("td", {
                                      className: "p-3 border-r border-slate-200 font-bold text-slate-800",
                                      children: [item.nama_kelompok, item.tahun_berdiri ? (0, T.jsx)("span", { className: "text-[10px] text-slate-400 font-normal block", children: `Est. ${item.tahun_berdiri}` }) : null]
                                    }),
                                    (0, T.jsx)("td", {
                                      className: "p-3 border-r border-slate-200",
                                      children: (0, T.jsx)("span", {
                                        className: `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                          item.jenis_lembaga === "Poktan" ? "bg-amber-100 text-amber-800" :
                                          item.jenis_lembaga === "Gapoktan" ? "bg-emerald-100 text-emerald-800" :
                                          "bg-rose-100 text-rose-800"
                                        }`,
                                        children: item.jenis_lembaga
                                      })
                                    }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-mono text-slate-700", children: item.id_simluhtan || "-" }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-600", children: item.no_sk_pengukuhan || "-" }),
                                    (0, T.jsxs)("td", {
                                      className: "p-3 border-r border-slate-200",
                                      children: [(0, T.jsx)("span", { className: "font-semibold text-slate-700", children: item.desa || "-" }), ", ", item.kecamatan]
                                    }),
                                    (0, T.jsxs)("td", {
                                      className: "p-3 border-r border-slate-200",
                                      children: [(0, T.jsx)("span", { className: "font-medium text-slate-800", children: item.nama_ketua || "-" }), (0, T.jsx)("span", { className: "text-[10px] text-slate-400 block", children: item.kontak_hp || "-" })]
                                    }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200", children: item.kelas_kemampuan || "-" }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-600", children: item.subsektor_utama || "-" }),
                                    (0, T.jsxs)("td", { className: "p-3 border-r border-slate-200 text-right font-bold text-slate-700", children: [$(item.jumlah_anggota), " org"] }),
                                    (0, T.jsx)("td", {
                                      className: "p-3 text-center",
                                      children: (0, T.jsx)("span", {
                                        className: `px-2 py-0.5 rounded text-[10px] font-bold ${
                                          item.status_aktif === "Aktif" ? "bg-emerald-100 text-emerald-800" :
                                          item.status_aktif === "Tidak Aktif" ? "bg-rose-100 text-rose-800" :
                                          "bg-amber-100 text-amber-800"
                                        }`,
                                        children: item.status_aktif || "Terdaftar"
                                      })
                                    })
                                  ]
                                }, item.id || idx)
                              ))
                            )
                          })
                        ]
                      })
                    })
                  ]
                })
              ]
            }),

            // =========================================================================
            // TAB 2: KELEMBAGAAN PERIKANAN (Pokdakan, Poklahsar, Pokmaswas)
            // =========================================================================
            activeTab === "perikanan" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-6",
              children: [
                (0, T.jsx)(PlaceholderBanner, {
                  title: "Kelembagaan Perikanan",
                  domainSlug: "kelembagaan-perikanan",
                  count: filteredPerikanan.length
                }),
                // Ringkasan Kartu Perikanan
                (0, T.jsxs)("div", {
                  className: "grid grid-cols-1 sm:grid-cols-4 gap-4 text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "bg-blue-50 border border-blue-200 p-4 rounded-lg",
                      children: [
                        (0, T.jsx)("span", { className: "text-[11px] font-bold text-blue-800 uppercase", children: "Pokdakan (Pembudidaya Ikan)" }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-800 mt-1", children: [$(filteredPerikanan.filter(x => x.jenis_lembaga === "Pokdakan").length), " unit"] })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-cyan-50 border border-cyan-200 p-4 rounded-lg",
                      children: [
                        (0, T.jsx)("span", { className: "text-[11px] font-bold text-cyan-800 uppercase", children: "Poklahsar (Pengolah & Pemasar)" }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-800 mt-1", children: [$(filteredPerikanan.filter(x => x.jenis_lembaga === "Poklahsar").length), " unit"] })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-teal-50 border border-teal-200 p-4 rounded-lg",
                      children: [
                        (0, T.jsx)("span", { className: "text-[11px] font-bold text-teal-800 uppercase", children: "Pokmaswas (Pengawas Masyarakat)" }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-800 mt-1", children: [$(filteredPerikanan.filter(x => x.jenis_lembaga === "Pokmaswas").length), " unit"] })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-slate-50 border border-slate-200 p-4 rounded-lg",
                      children: [
                        (0, T.jsx)("span", { className: "text-[11px] font-bold text-slate-600 uppercase", children: "Total Anggota Terdaftar" }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-800 mt-1", children: [$(filteredPerikanan.reduce((acc, c) => acc + (Number(c.jumlah_anggota) || 0), 0)), " orang"] })
                      ]
                    })
                  ]
                }),

                // Tabel Register Kelembagaan Perikanan
                (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h4", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: "Buku Register Kelembagaan Perikanan (KUSUKA KKP)" }),
                            (0, T.jsx)("p", { className: "text-xs text-slate-500 mt-0.5", children: "Pencatatan legalitas kelompok perikanan, nomor identitas KUSUKA, komoditas budidaya, dan kontak ketua." })
                          ]
                        }),
                        (0, T.jsxs)("span", {
                          className: "text-xs font-bold text-slate-600 px-2.5 py-1 bg-slate-100 rounded-md",
                          children: [`Menampilkan `, filteredPerikanan.length, ` data`]
                        })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "overflow-x-auto",
                      children: (0, T.jsxs)("table", {
                        className: "w-full text-left text-xs border-collapse",
                        children: [
                          (0, T.jsx)("thead", {
                            className: "bg-slate-100 border-b border-slate-200 font-bold uppercase text-slate-600",
                            children: (0, T.jsxs)("tr", {
                              children: [
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "No" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Nama Kelompok" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Jenis Lembaga" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "No. Register KUSUKA KKP" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Wilayah (Desa, Kec)" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Ketua & Kontak" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Komoditas / Usaha" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Kelas" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-right", children: "Anggota" }),
                                (0, T.jsx)("th", { className: "p-3 text-center", children: "Status" })
                              ]
                            })
                          }),
                          (0, T.jsx)("tbody", {
                            className: "divide-y divide-slate-100",
                            children: filteredPerikanan.length === 0 ? (
                              (0, T.jsx)("tr", {
                                children: (0, T.jsx)("td", {
                                  colSpan: 10,
                                  className: "p-8 text-center text-slate-400 font-medium",
                                  children: "Belum ada data kelembagaan perikanan yang cocok dengan filter pencarian."
                                })
                              })
                            ) : (
                              filteredPerikanan.map((item, idx) => (
                                (0, T.jsxs)("tr", {
                                  className: "hover:bg-slate-50 transition-colors",
                                  children: [
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold text-slate-500", children: idx + 1 }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold text-slate-800", children: item.nama_kelompok }),
                                    (0, T.jsx)("td", {
                                      className: "p-3 border-r border-slate-200",
                                      children: (0, T.jsx)("span", {
                                        className: `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                          item.jenis_lembaga === "Pokdakan" ? "bg-blue-100 text-blue-800" :
                                          item.jenis_lembaga === "Poklahsar" ? "bg-cyan-100 text-cyan-800" :
                                          "bg-teal-100 text-teal-800"
                                        }`,
                                        children: item.jenis_lembaga
                                      })
                                    }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-mono text-slate-700", children: item.id_kusuka || "-" }),
                                    (0, T.jsxs)("td", {
                                      className: "p-3 border-r border-slate-200",
                                      children: [(0, T.jsx)("span", { className: "font-semibold text-slate-700", children: item.desa || "-" }), ", ", item.kecamatan]
                                    }),
                                    (0, T.jsxs)("td", {
                                      className: "p-3 border-r border-slate-200",
                                      children: [(0, T.jsx)("span", { className: "font-medium text-slate-800", children: item.nama_ketua || "-" }), (0, T.jsx)("span", { className: "text-[10px] text-slate-400 block", children: item.kontak_hp || "-" })]
                                    }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-700 font-medium", children: item.komoditas_utama || "-" }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200", children: item.kelas_kemampuan || "-" }),
                                    (0, T.jsxs)("td", { className: "p-3 border-r border-slate-200 text-right font-bold text-slate-700", children: [$(item.jumlah_anggota), " org"] }),
                                    (0, T.jsx)("td", {
                                      className: "p-3 text-center",
                                      children: (0, T.jsx)("span", {
                                        className: `px-2 py-0.5 rounded text-[10px] font-bold ${
                                          item.status_aktif === "Aktif" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                                        }`,
                                        children: item.status_aktif || "Aktif"
                                      })
                                    })
                                  ]
                                }, item.id || idx)
                              ))
                            )
                          })
                        ]
                      })
                    })
                  ]
                })
              ]
            }),

            // =========================================================================
            // TAB 3: LEMBAGA PENDUKUNG (P4S & UPJA)
            // =========================================================================
            activeTab === "pendukung" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-6",
              children: [
                (0, T.jsx)(PlaceholderBanner, {
                  title: "Lembaga Pendukung Pertanian (P4S & UPJA)",
                  domainSlug: "kelembagaan-pendukung",
                  count: filteredP4s.length + filteredUpja.length
                }),

                // Bagian P4S
                (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "p-4 border-b border-slate-200 bg-emerald-50/50 flex justify-between items-center",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h4", { className: "text-sm font-bold text-emerald-950 uppercase tracking-wide", children: "P4S — Pusat Pelatihan Pertanian dan Perdesaan Swadaya" }),
                            (0, T.jsx)("p", { className: "text-xs text-emerald-800 mt-0.5", children: "Kelembagaan pelatihan mandiri petani terakreditasi BPPSDMP Kementan." })
                          ]
                        }),
                        (0, T.jsxs)("span", { className: "text-xs font-bold text-emerald-800 px-2.5 py-1 bg-emerald-100 rounded-md", children: [filteredP4s.length, " Unit P4S"] })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "overflow-x-auto",
                      children: (0, T.jsxs)("table", {
                        className: "w-full text-left text-xs border-collapse",
                        children: [
                          (0, T.jsx)("thead", {
                            className: "bg-slate-100 border-b border-slate-200 font-bold uppercase text-slate-600",
                            children: (0, T.jsxs)("tr", {
                              children: [
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "No" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Nama P4S" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Pengelola" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Wilayah (Desa, Kec)" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Bidang Kejuruan / Pelatihan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Akreditasi" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "No. Register BPPSDMP" }),
                                (0, T.jsx)("th", { className: "p-3", children: "Kontak" })
                              ]
                            })
                          }),
                          (0, T.jsx)("tbody", {
                            className: "divide-y divide-slate-100",
                            children: filteredP4s.map((item, idx) => (
                              (0, T.jsxs)("tr", {
                                className: "hover:bg-slate-50 transition-colors",
                                children: [
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold text-slate-500", children: idx + 1 }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold text-slate-800", children: item.nama_p4s }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-medium text-slate-700", children: item.pengelola || "-" }),
                                  (0, T.jsxs)("td", { className: "p-3 border-r border-slate-200", children: [(0, T.jsx)("span", { className: "font-semibold text-slate-700", children: item.desa || "-" }), ", ", item.kecamatan] }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-600", children: item.bidang_kejuruan || "-" }),
                                  (0, T.jsx)("td", {
                                    className: "p-3 border-r border-slate-200",
                                    children: (0, T.jsx)("span", {
                                      className: "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase",
                                      children: item.klasifikasi_akreditasi || "Terdaftar"
                                    })
                                  }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-mono text-slate-600", children: item.no_register_bppsdmp || "-" }),
                                  (0, T.jsx)("td", { className: "p-3 text-slate-600", children: item.kontak || "-" })
                                ]
                              }, item.id || idx)
                            ))
                          })
                        ]
                      })
                    })
                  ]
                }),

                // Bagian UPJA
                (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "p-4 border-b border-slate-200 bg-amber-50/50 flex justify-between items-center",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h4", { className: "text-sm font-bold text-amber-950 uppercase tracking-wide", children: "UPJA — Usaha Pelayanan Jasa Alsintan" }),
                            (0, T.jsx)("p", { className: "text-xs text-amber-800 mt-0.5", children: "Lembaga pengelolaan dan sewa alsintan (traktor, combine, transplanter, pompa) per kecamatan." })
                          ]
                        }),
                        (0, T.jsxs)("span", { className: "text-xs font-bold text-amber-800 px-2.5 py-1 bg-amber-100 rounded-md", children: [filteredUpja.length, " Unit UPJA"] })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "overflow-x-auto",
                      children: (0, T.jsxs)("table", {
                        className: "w-full text-left text-xs border-collapse",
                        children: [
                          (0, T.jsx)("thead", {
                            className: "bg-slate-100 border-b border-slate-200 font-bold uppercase text-slate-600",
                            children: (0, T.jsxs)("tr", {
                              children: [
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "No" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Nama UPJA" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Manajer" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Gapoktan Induk" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Wilayah (Desa, Kec)" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Alsintan yang Dikelola" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-right", children: "Jumlah Alsintan" }),
                                (0, T.jsx)("th", { className: "p-3 text-center", children: "Status Operasional" })
                              ]
                            })
                          }),
                          (0, T.jsx)("tbody", {
                            className: "divide-y divide-slate-100",
                            children: filteredUpja.map((item, idx) => (
                              (0, T.jsxs)("tr", {
                                className: "hover:bg-slate-50 transition-colors",
                                children: [
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold text-slate-500", children: idx + 1 }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold text-slate-800", children: item.nama_upja }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-medium text-slate-700", children: item.manajer || "-" }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-600", children: item.gapoktan_induk || "-" }),
                                  (0, T.jsxs)("td", { className: "p-3 border-r border-slate-200", children: [(0, T.jsx)("span", { className: "font-semibold text-slate-700", children: item.desa || "-" }), ", ", item.kecamatan] }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-700", children: item.jenis_alsintan_dikelola || "-" }),
                                  (0, T.jsxs)("td", { className: "p-3 border-r border-slate-200 text-right font-bold text-slate-800", children: [$(item.jumlah_alsintan), " unit"] }),
                                  (0, T.jsx)("td", {
                                    className: "p-3 text-center",
                                    children: (0, T.jsx)("span", {
                                      className: `px-2 py-0.5 rounded text-[10px] font-bold ${
                                        item.status_operasional === "Aktif Beroperasi" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                      }`,
                                      children: item.status_operasional || "Aktif"
                                    })
                                  })
                                ]
                              }, item.id || idx)
                            ))
                          })
                        ]
                      })
                    })
                  ]
                })
              ]
            }),

            // =========================================================================
            // TAB 4: JURU SEMBELIH HALAL (JULEHA)
            // =========================================================================
            activeTab === "juleha" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-6",
              children: [
                (0, T.jsx)(PlaceholderBanner, {
                  title: "Juru Sembelih Halal (JULEHA)",
                  domainSlug: "kelembagaan-pendukung",
                  count: filteredJuleha.length
                }),
                (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "p-4 border-b border-slate-200 bg-purple-50/50 flex justify-between items-center",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h4", { className: "text-sm font-bold text-purple-950 uppercase tracking-wide", children: "Register Juru Sembelih Halal (JULEHA) Tersertifikasi" }),
                            (0, T.jsx)("p", { className: "text-xs text-purple-800 mt-0.5", children: "Petugas potong hewan tersertifikasi kompetensi halal (BNSP/MUI/BPJPH) pada RPH dan RPU Kabupaten Banjarnegara." })
                          ]
                        }),
                        (0, T.jsxs)("span", { className: "text-xs font-bold text-purple-800 px-2.5 py-1 bg-purple-100 rounded-md", children: [filteredJuleha.length, " Personel JULEHA"] })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "overflow-x-auto",
                      children: (0, T.jsxs)("table", {
                        className: "w-full text-left text-xs border-collapse",
                        children: [
                          (0, T.jsx)("thead", {
                            className: "bg-slate-100 border-b border-slate-200 font-bold uppercase text-slate-600",
                            children: (0, T.jsxs)("tr", {
                              children: [
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "No" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Nama Juru Sembelih" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Domisili (Desa, Kec)" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Unit Tugas / Lokasi Potong" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "No. Sertifikat Halal" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Lembaga Penerbit" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-center", children: "Tahun Lulus" }),
                                (0, T.jsx)("th", { className: "p-3 text-center", children: "Status Sertifikasi" })
                              ]
                            })
                          }),
                          (0, T.jsx)("tbody", {
                            className: "divide-y divide-slate-100",
                            children: filteredJuleha.map((item, idx) => (
                              (0, T.jsxs)("tr", {
                                className: "hover:bg-slate-50 transition-colors",
                                children: [
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold text-slate-500", children: idx + 1 }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold text-slate-800", children: item.nama_lengkap }),
                                  (0, T.jsxs)("td", { className: "p-3 border-r border-slate-200", children: [(0, T.jsx)("span", { className: "font-semibold text-slate-700", children: item.desa || "-" }), ", ", item.kecamatan] }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-medium text-slate-700", children: item.unit_tugas || "-" }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-mono text-purple-700 font-semibold", children: item.no_sertifikat_halal || "-" }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-600", children: item.lembaga_penerbit || "-" }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-center font-bold text-slate-700", children: item.tahun_kelulusan || "-" }),
                                  (0, T.jsx)("td", {
                                    className: "p-3 text-center",
                                    children: (0, T.jsx)("span", {
                                      className: `px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                        item.status_sertifikasi === "Tersertifikasi" ? "bg-emerald-100 text-emerald-800" :
                                        item.status_sertifikasi === "Dalam Pelatihan" ? "bg-amber-100 text-amber-800" :
                                        "bg-rose-100 text-rose-800"
                                      }`,
                                      children: item.status_sertifikasi || "Tersertifikasi"
                                    })
                                  })
                                ]
                              }, item.id || idx)
                            ))
                          })
                        ]
                      })
                    })
                  ]
                })
              ]
            }),

            // =========================================================================
            // TAB 5: REKAP DESA & STATISTIK EKSISTING (LENGKAP)
            // =========================================================================
            activeTab === "rekap" && (0, T.jsxs)(T.Fragment, {
              children: [
                (0, T.jsxs)("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "bg-amber-50 border border-slate-200 p-5 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h5", { className: "text-[10px] font-bold text-slate-500 uppercase", children: "Kelompok Tani (Poktan)" }),
                            (0, T.jsxs)("h3", { className: "text-2xl font-semibold uppercase text-slate-800 mt-1", children: [$(J.kelompokTani), " ", (0, T.jsx)("span", { className: "text-xs font-normal lowercase", children: "unit" })] }),
                            (0, T.jsxs)("p", { className: "text-[11px] font-bold text-amber-700 mt-2", children: [$(J.anggotaTani), " anggota terdaftar"] })
                          ]
                        }),
                        (0, T.jsx)("div", { className: "mt-4 pt-2 border-t border-slate-200 text-[9px] text-slate-400 uppercase", children: "Poktan Pertanian / Pekebun" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-blue-50 border border-slate-200 p-5 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h5", { className: "text-[10px] font-bold text-slate-500 uppercase", children: "Kelompok Perikanan (Pokkan)" }),
                            (0, T.jsxs)("h3", { className: "text-2xl font-semibold uppercase text-slate-800 mt-1", children: [$(J.kelompokPerikanan), " ", (0, T.jsx)("span", { className: "text-xs font-normal lowercase", children: "unit" })] }),
                            (0, T.jsxs)("p", { className: "text-[11px] font-bold text-blue-700 mt-2", children: [$(J.anggotaPerikanan), " anggota terdaftar"] })
                          ]
                        }),
                        (0, T.jsx)("div", { className: "mt-4 pt-2 border-t border-slate-200 text-[9px] text-slate-400 uppercase", children: "Pembudidaya Ikan lokal" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-emerald-50 border border-slate-200 p-5 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h5", { className: "text-[10px] font-bold text-slate-500 uppercase", children: "Gabungan Poktan (Gapoktan)" }),
                            (0, T.jsxs)("h3", { className: "text-2xl font-semibold uppercase text-slate-800 mt-1", children: [$(J.gapoktan), " ", (0, T.jsx)("span", { className: "text-xs font-normal lowercase", children: "gabungan" })] }),
                            (0, T.jsxs)("p", { className: "text-[11px] font-bold text-emerald-700 mt-2", children: [$(J.anggotaGapoktan), " pengurus/anggota"] })
                          ]
                        }),
                        (0, T.jsx)("div", { className: "mt-4 pt-2 border-t border-slate-200 text-[9px] text-slate-400 uppercase", children: "Aliansi Poktan Tingkat Desa" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-green-50 border border-slate-200 p-5 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h5", { className: "text-[10px] font-bold text-slate-500 uppercase", children: "Kelompok Tani Hutan (KTH)" }),
                            (0, T.jsxs)("h3", { className: "text-2xl font-semibold uppercase text-slate-800 mt-1", children: [$(X.kelompok), " ", (0, T.jsx)("span", { className: "text-xs font-normal lowercase", children: "unit" })] }),
                            (0, T.jsxs)("p", { className: "text-[11px] font-bold text-green-700 mt-2", children: [X.desa, " desa · kelas: ", X.pemula, " pemula / ", X.madya, " madya / ", X.utama, " utama"] })
                          ]
                        }),
                        (0, T.jsx)("div", { className: "mt-4 pt-2 border-t border-slate-200 text-[9px] text-slate-400 uppercase", children: "Snapshot SIMLUH per 2026 — bukan data tahunan" })
                      ]
                    })
                  ]
                }),

                Z.desa > 0 && (0, T.jsxs)("div", {
                  className: "bg-slate-50 border border-slate-200 p-4 text-left flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg",
                  children: [
                    (0, T.jsx)("span", { className: "text-[10px] font-bold uppercase text-slate-400", children: "Konteks BPS · Sensus Pertanian 2023" }),
                    (0, T.jsx)("span", { className: "text-xs font-bold text-slate-700", children: N === "Semua" ? "Kabupaten Banjarnegara (20 kec)" : `Kec. ${N}` }),
                    (0, T.jsxs)("span", { className: "text-xs text-slate-600", children: [(0, T.jsx)("b", { className: "text-slate-800", children: $(Z.petani) }), " petani (orang)"] }),
                    (0, T.jsxs)("span", { className: "text-xs text-slate-600", children: [(0, T.jsx)("b", { className: "text-slate-800", children: $(Z.rtAnggotaKelompok) }), " RTUP anggota kelompok tani/peternak/nelayan"] }),
                    (0, T.jsxs)("span", { className: "text-xs text-slate-600", children: [(0, T.jsx)("b", { className: "text-slate-800", children: $(Z.rtup) }), " RTUP total"] }),
                    (0, T.jsxs)("span", { className: "text-[10px] text-slate-400 ml-auto", children: [Z.desa, " desa/kelurahan"] })
                  ]
                }),

                // Grafik Garis Tren Keanggotaan
                (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 p-6 shadow-sm rounded-lg text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "mb-4 text-left border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2",
                      children: [
                        (0, T.jsxs)("h4", {
                          className: "text-lg font-bold uppercase flex items-center gap-2 tracking-wide",
                          children: [
                            (0, T.jsx)(n, { className: "text-amber-600" }),
                            `Tren Keanggotaan Lembaga Tani (`,
                            (() => {
                              let e = Q.filter(e => !e.isPrediction);
                              return e.length === 0 ? "" : `${e[0].tahun}–${e[e.length - 1].tahun}`;
                            })(),
                            `)`,
                            N === "Semua" ? "" : ` · ${N}`
                          ]
                        }),
                        (0, T.jsxs)("span", {
                          className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md text-[10px] font-bold text-amber-700 uppercase",
                          children: [(0, T.jsx)(n, { size: 11 }), " 2026: Prediksi Regresi Linier"]
                        })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "h-[320px] w-full",
                      children: (0, T.jsx)(v, {
                        width: "100%",
                        height: "100%",
                        children: (0, T.jsxs)(ee, {
                          data: Q,
                          margin: { top: 10, right: 20, left: 0, bottom: 0 },
                          children: [
                            (0, T.jsx)(_, { strokeDasharray: "3 3", stroke: "#64748b", strokeOpacity: 0.1, vertical: false }),
                            (0, T.jsx)(h, { dataKey: "tahun", tick: { fill: "#475569", fontSize: 11, fontFamily: "monospace", fontWeight: "bold" }, axisLine: { stroke: "#cbd5e1", strokeWidth: 1 }, tickLine: { stroke: "#cbd5e1" } }),
                            (0, T.jsx)(b, { tick: { fill: "#475569", fontSize: 10, fontFamily: "monospace", fontWeight: "bold" }, axisLine: { stroke: "#cbd5e1", strokeWidth: 1 }, tickLine: { stroke: "#cbd5e1" }, tickFormatter: e => $(e) }),
                            (0, T.jsx)(m, { contentStyle: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "monospace", fontSize: "12px", fontWeight: "bold", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }, formatter: (e, t, n) => { let r = n?.payload?.isPrediction ? `${t} (Prediksi)` : t; return [$(Number(e)), r]; }, labelFormatter: (e, t) => t?.[0]?.payload?.isPrediction ? `${e} (Prediksi)` : e }),
                            (0, T.jsx)(x, { verticalAlign: "top", height: 36, wrapperStyle: { fontFamily: "monospace", fontSize: "10px", fontWeight: "bold" } }),
                            (0, T.jsx)(S, { x: "2026", stroke: "#f59e0b", strokeDasharray: "5 5", strokeOpacity: 0.5, label: { value: "Prediksi", position: "top", fill: "#d97706", fontSize: 10, fontFamily: "monospace", fontWeight: "bold" } }),
                            (0, T.jsx)(C, { type: "monotone", dataKey: "totalAnggota", name: "Total Anggota (Jiwa)", stroke: "#64748b", strokeWidth: 3, dot: e => { let { cx: t, cy: n, payload: r } = e; return r?.isPrediction ? (0, T.jsx)("circle", { cx: t, cy: n, r: 6, fill: "#fff", stroke: "#64748b", strokeWidth: 2 }) : (0, T.jsx)("circle", { cx: t, cy: n, r: 4, fill: "#475569" }); }, activeDot: { r: 6 } }),
                            (0, T.jsx)(C, { type: "monotone", dataKey: "Anggota Tani", name: "Anggota Poktan", stroke: "#d97706", strokeWidth: 2 }),
                            (0, T.jsx)(C, { type: "monotone", dataKey: "Anggota Perikanan", name: "Anggota Pokkan", stroke: "#2563eb", strokeWidth: 2 }),
                            (0, T.jsx)(C, { type: "monotone", dataKey: "Anggota Gapoktan", name: "Anggota Gapoktan", stroke: "#059669", strokeWidth: 2 })
                          ]
                        })
                      })
                    })
                  ]
                }),

                // Grafik Batang Sebaran Kecamatan
                (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 p-6 shadow-sm rounded-lg text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "flex flex-col mb-6 border-b border-slate-200 pb-3 text-left",
                      children: [
                        (0, T.jsxs)("h4", { className: "text-lg font-bold uppercase flex items-center gap-2 tracking-wide", children: [(0, T.jsx)(r, { className: "text-emerald-600" }), `Sebaran Unit Kelembagaan per Kecamatan (`, j, `)`] }),
                        (0, T.jsx)("p", { className: "text-xs font-bold text-slate-500 uppercase mt-1", children: "Kontribusi unit Poktan, Pokkan, dan Gapoktan per wilayah" })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "h-[420px] w-full",
                      children: (0, T.jsx)(v, {
                        width: "100%",
                        height: "100%",
                        children: (0, T.jsxs)(y, {
                          data: Y,
                          margin: { top: 10, right: 10, left: 0, bottom: 90 },
                          children: [
                            (0, T.jsx)(_, { strokeDasharray: "3 3", stroke: "#64748b", strokeOpacity: 0.1, vertical: false }),
                            (0, T.jsx)(h, { dataKey: "name", tick: { fill: "#475569", fontSize: 10, fontFamily: "monospace", fontWeight: "bold" }, axisLine: { stroke: "#cbd5e1", strokeWidth: 1 }, tickLine: { stroke: "#cbd5e1" }, interval: 0, angle: -45, textAnchor: "end", height: 70 }),
                            (0, T.jsx)(b, { width: 70, tick: { fill: "#475569", fontSize: 10, fontFamily: "monospace", fontWeight: "bold" }, axisLine: { stroke: "#cbd5e1", strokeWidth: 1 }, tickLine: { stroke: "#cbd5e1" } }),
                            (0, T.jsx)(m, { contentStyle: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "monospace", fontSize: "12px", fontWeight: "bold" } }),
                            (0, T.jsx)(x, { verticalAlign: "top", height: 36, wrapperStyle: { fontFamily: "monospace", fontSize: "10px", fontWeight: "bold" } }),
                            (0, T.jsx)(g, { dataKey: "Kelompok Tani", stackId: "a", fill: "#f59e0b", stroke: "#64748b", strokeWidth: 1 }),
                            (0, T.jsx)(g, { dataKey: "Kelompok Perikanan", stackId: "a", fill: "#3b82f6", stroke: "#64748b", strokeWidth: 1 }),
                            (0, T.jsx)(g, { dataKey: "Gapoktan", stackId: "a", fill: "#10b981", stroke: "#64748b", strokeWidth: 1 })
                          ]
                        })
                      })
                    })
                  ]
                }),

                // Tabel Rekapitulasi Desa Eksisting
                (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 p-6 shadow-sm rounded-lg text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "mb-4 text-left border-b border-slate-200 pb-2 flex justify-between items-center flex-wrap gap-2",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsxs)("h4", { className: "text-md font-bold uppercase tracking-wide", children: [`Tabel Rincian Poktan, Gapoktan & KTH (`, j, `)`] }),
                            (0, T.jsx)("p", { className: "text-[10px] font-bold text-slate-500 uppercase mt-1", children: "Detail sebaran desa/kelurahan, poktan, pokkan, gapoktan, dan kelompok tani hutan di Kabupaten Banjarnegara" })
                          ]
                        }),
                        q.length === 0 && (0, T.jsxs)("div", {
                          className: "inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 border border-slate-200 text-[10px] font-bold text-rose-800 uppercase max-w-full rounded-md",
                          children: [
                            (0, T.jsx)(a, { size: 14, className: "flex-shrink-0" }),
                            (0, T.jsx)("span", { children: N === "Semua" ? `Data kelembagaan Dinas untuk tahun ${j} belum tersedia.` : `Data kelembagaan Dinas belum tersedia untuk Kec. ${N} — lihat konteks BPS ST2023 di atas.` })
                          ]
                        }),
                        ne && (0, T.jsxs)("div", {
                          className: "inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-800 uppercase max-w-full rounded-md",
                          children: [
                            (0, T.jsx)(a, { size: 14, className: "flex-shrink-0" }),
                            (0, T.jsxs)("span", { children: [`Semua nilai Kec. `, N, ` tercatat nol pada snapshot Dinas (belum terisi) — ST2023 BPS: `, $(Z.petani), ` petani.`] })
                          ]
                        })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "overflow-x-auto max-h-[450px]",
                      children: (0, T.jsxs)("table", {
                        className: "w-full text-left text-sm border-collapse",
                        children: [
                          (0, T.jsx)("thead", {
                            children: (0, T.jsxs)("tr", {
                              className: "border-b border-slate-200 bg-slate-100 sticky top-0 z-10",
                              children: [
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 font-bold uppercase text-xs", children: "No" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 font-bold uppercase text-xs", children: "Desa/Kelurahan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 font-bold uppercase text-xs", children: "Kecamatan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 font-bold uppercase text-xs text-right", children: "Poktan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 font-bold uppercase text-xs text-right", children: "Anggota Poktan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 font-bold uppercase text-xs text-right", children: "Pokkan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 font-bold uppercase text-xs text-right", children: "Anggota Pokkan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 font-bold uppercase text-xs text-right", children: "Gapoktan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 font-bold uppercase text-xs text-right", children: "Anggota Gapoktan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 font-bold uppercase text-xs text-right", children: "KTH (SIMLUH '26)" }),
                                (0, T.jsx)("th", { className: "p-3 font-bold uppercase text-xs", children: "Detail KTH" })
                              ]
                            })
                          }),
                          (0, T.jsx)("tbody", {
                            children: q.map((e, t) => (
                              (0, T.jsxs)("tr", {
                                className: "border-b border-slate-200 hover:bg-slate-50",
                                children: [
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs font-bold", children: t + 1 }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs font-bold uppercase", children: e.desa }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs font-bold uppercase", children: V(e.kecamatan) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right", children: $(e.kelompokTani) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right text-amber-700 font-bold", children: $(e.anggotaTani) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right", children: $(e.kelompokPerikanan) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right text-blue-700 font-bold", children: $(e.anggotaPerikanan) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right", children: $(e.gapoktan) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right text-emerald-700 font-bold", children: $(e.anggotaGapoktan) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right text-green-700 font-bold", children: $(e.kelompokTaniHutan || 0) }),
                                  (0, T.jsxs)("td", {
                                    className: "p-3 text-[10px] text-slate-600 min-w-[220px]",
                                    children: [
                                      (e.kelompokTaniHutanList || []).slice(0, 3).map(e => e.namaKelompok).join(", ") || "-",
                                      (e.kelompokTaniHutanList?.length || 0) > 3 ? ` +${(e.kelompokTaniHutanList?.length || 0) - 3} lainnya` : ""
                                    ]
                                  })
                                ]
                              }, `${e.desa}_${t}`)
                            ))
                          }),
                          q.length > 0 && (0, T.jsx)("tfoot", {
                            children: (0, T.jsxs)("tr", {
                              className: "border-t-2 border-slate-300 bg-slate-50 font-bold sticky bottom-0",
                              children: [
                                (0, T.jsxs)("td", { className: "p-3 border-r border-slate-200 text-xs", colSpan: 3, children: [`TOTAL `, N === "Semua" ? "KABUPATEN" : `KEC. ${N.toUpperCase()}`, ` (`, q.length, ` desa)`] }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right", children: $(J.kelompokTani) }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right text-amber-700", children: $(J.anggotaTani) }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right", children: $(J.kelompokPerikanan) }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right text-blue-700", children: $(J.anggotaPerikanan) }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right", children: $(J.gapoktan) }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right text-emerald-700", children: $(J.anggotaGapoktan) }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-xs text-right text-green-700", children: $(J.kelompokTaniHutan) }),
                                (0, T.jsx)("td", { className: "p-3 text-[10px] text-slate-500", children: "KTH: snapshot SIMLUH" })
                              ]
                            })
                          })
                        ]
                      })
                    })
                  ]
                })
              ]
            })
          ]
        }),

        // Catatan Kaki & Sumber Data Resmi
        (0, T.jsx)("p", {
          className: "text-[10px] text-slate-400 leading-relaxed text-left",
          children: "Sumber: Data Kelembagaan Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara; Sistem Informasi Penyuluhan Pertanian (SIMLUHTAN Kementan); Kartu Pelaku Usaha Kelautan dan Perikanan (KUSUKA KKP); serta Badan Penyelenggara Jaminan Produk Halal (BPJPH/BNSP)."
        })
      ]
    })
  });
}

export { FarmersPage as default };