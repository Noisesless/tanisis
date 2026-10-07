import { m as e, t, a as tractorIcon, c as mapPinIcon, g as awardIcon, l as leafIcon } from "./default-CAKe9ffW.js";
import { d as n, r as usersIcon, o as shieldCheckIcon, l as fishIcon, n as wheatIcon, u as fileCheckIcon } from "./x-CXWFwwzx.js";
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

  let [activeKlaster, setActiveKlaster] = (0, w.useState)("tani");
  let [dataPertanian, setDataPertanian] = (0, w.useState)([]);
  let [dataKep, setDataKep] = (0, w.useState)([]);
  let [dataPosluhdes, setDataPosluhdes] = (0, w.useState)([]);
  let [dataPps, setDataPps] = (0, w.useState)([]);
  let [dataRekapValidasi, setDataRekapValidasi] = (0, w.useState)([]);
  let [dataPerikanan, setDataPerikanan] = (0, w.useState)([]);
  let [dataJuleha, setDataJuleha] = (0, w.useState)([]);
  let [dataP4s, setDataP4s] = (0, w.useState)([]);
  let [dataUpja, setDataUpja] = (0, w.useState)([]);
  let [loadingEntities, setLoadingEntities] = (0, w.useState)(true);
  let [currentPage, setCurrentPage] = (0, w.useState)(1);
  let [pageSize, setPageSize] = (0, w.useState)(25);

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
      let [resPert, resIkan, resJuleha, resP4s, resUpja, resKep, resPosluh, resPps, resRekap] = await Promise.all([
        fetch("/sispertani-api/v1/kelembagaan/pertanian").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/perikanan").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/juleha").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/p4s").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/upja").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/kep").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/posluhdes").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/pps").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/rekap-validasi").then(r => r.json()).catch(() => ({ data: [] }))
      ]);
      setDataPertanian(resPert.data || resPert.rows || []);
      setDataPerikanan(resIkan.data || resIkan.rows || []);
      setDataJuleha(resJuleha.data || resJuleha.rows || []);
      setDataP4s(resP4s.data || resP4s.rows || []);
      setDataUpja(resUpja.data || resUpja.rows || []);
      setDataKep(resKep.data || resKep.rows || []);
      setDataPosluhdes(resPosluh.data || resPosluh.rows || []);
      setDataPps(resPps.data || resPps.rows || []);
      setDataRekapValidasi(resRekap.data || resRekap.rows || []);
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
    setCurrentPage(1);
  }, [searchQuery, filterJenis, N, activeTab]);

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
  let filteredKep = (0, w.useMemo)(() => {
    return dataKep.filter(item => {
      let matchKec = N === "Semua" || (item.kecamatan && item.kecamatan.toLowerCase() === N.toLowerCase()) || (item.bpp && item.bpp.toLowerCase().includes(N.toLowerCase()));
      let matchJenis = filterJenis === "Semua" || item.bentuk_kep === filterJenis;
      let matchQuery = !searchQuery || [
        item.nama_kep, item.komoditas, item.jenis_usaha, item.penyuluh_pendamping, item.alamat
      ].some(val => val && String(val).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchKec && matchJenis && matchQuery;
    });
  }, [dataKep, N, filterJenis, searchQuery]);

  let filteredPosluhdes = (0, w.useMemo)(() => {
    return dataPosluhdes.filter(item => {
      let matchKec = N === "Semua" || (item.bpp && item.bpp.toLowerCase().includes(N.toLowerCase())) || (item.desa && item.desa.toLowerCase().includes(N.toLowerCase()));
      let matchQuery = !searchQuery || [
        item.nama_posluhdes, item.desa, item.nama_pimpinan, item.penyuluh_swadaya, item.bpp
      ].some(val => val && String(val).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchKec && matchQuery;
    });
  }, [dataPosluhdes, N, searchQuery]);

  let filteredPps = (0, w.useMemo)(() => {
    return dataPps.filter(item => {
      let matchKec = N === "Semua" || (item.unit_kerja && item.unit_kerja.toLowerCase().includes(N.toLowerCase())) || (item.wilayah_kerja && item.wilayah_kerja.toLowerCase().includes(N.toLowerCase()));
      let matchQuery = !searchQuery || [
        item.nama_penyuluh, item.unit_kerja, item.wilayah_kerja, item.pendidikan
      ].some(val => val && String(val).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchKec && matchQuery;
    });
  }, [dataPps, N, searchQuery]);

  let filteredRekapValidasi = (0, w.useMemo)(() => {
    return dataRekapValidasi.filter(item => {
      let matchKec = N === "Semua" || (item.kecamatan && item.kecamatan.toLowerCase() === N.toLowerCase());
      let matchQuery = !searchQuery || (item.kecamatan && item.kecamatan.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchKec && matchQuery;
    });
  }, [dataRekapValidasi, N, searchQuery]);

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
      let matchStatus = filterJenis === "Semua" || (item.status_sertifikasi || "").toLowerCase().includes(filterJenis.toLowerCase());
      let matchQuery = !searchQuery || [
        item.nama_lengkap, item.desa, item.no_sertifikat_halal, item.unit_tugas, item.lembaga_penerbit
      ].some(val => val && String(val).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchKec && matchStatus && matchQuery;
    });
  }, [dataJuleha, N, filterJenis, searchQuery]);

  let filteredP4s = (0, w.useMemo)(() => {
    if (filterJenis !== "Semua" && filterJenis !== "P4S") return [];
    return dataP4s.filter(item => {
      let matchKec = N === "Semua" || (item.kecamatan && item.kecamatan.toLowerCase() === N.toLowerCase());
      let matchQuery = !searchQuery || [
        item.nama_p4s, item.desa, item.pengelola, item.bidang_kejuruan, item.no_register_bppsdmp
      ].some(val => val && String(val).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchKec && matchQuery;
    });
  }, [dataP4s, N, filterJenis, searchQuery]);

  let filteredUpja = (0, w.useMemo)(() => {
    if (filterJenis !== "Semua" && filterJenis !== "UPJA") return [];
    return dataUpja.filter(item => {
      let matchKec = N === "Semua" || (item.kecamatan && item.kecamatan.toLowerCase() === N.toLowerCase());
      let matchQuery = !searchQuery || [
        item.nama_upja, item.desa, item.manajer, item.gapoktan_induk, item.jenis_alsintan_dikelola
      ].some(val => val && String(val).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchKec && matchQuery;
    });
  }, [dataUpja, N, filterJenis, searchQuery]);

  let currentActiveTotal = (0, w.useMemo)(() => {
    if (activeTab === "pertanian") return filteredPertanian.length;
    if (activeTab === "rekap_validasi") return filteredRekapValidasi.length;
    if (activeTab === "kep") return filteredKep.length;
    if (activeTab === "posluhdes") return filteredPosluhdes.length;
    if (activeTab === "pps") return filteredPps.length;
    if (activeTab === "perikanan") return filteredPerikanan.length;
    if (activeTab === "pendukung") return filteredP4s.length + filteredUpja.length;
    if (activeTab === "juleha") return filteredJuleha.length;
    return filteredPertanian.length;
  }, [activeTab, filteredPertanian, filteredRekapValidasi, filteredKep, filteredPosluhdes, filteredPps, filteredPerikanan, filteredP4s, filteredUpja, filteredJuleha]);

  let totalPages = Math.max(1, Math.ceil(currentActiveTotal / pageSize));
  let startIndex = (currentPage - 1) * pageSize;

  let paginatedPertanian = (0, w.useMemo)(() => {
    return filteredPertanian.slice(startIndex, startIndex + pageSize);
  }, [filteredPertanian, startIndex, pageSize]);

  let paginatedKep = (0, w.useMemo)(() => {
    return filteredKep.slice(startIndex, startIndex + pageSize);
  }, [filteredKep, startIndex, pageSize]);

  let paginatedPosluhdes = (0, w.useMemo)(() => {
    return filteredPosluhdes.slice(startIndex, startIndex + pageSize);
  }, [filteredPosluhdes, startIndex, pageSize]);

  let paginatedPps = (0, w.useMemo)(() => {
    return filteredPps.slice(startIndex, startIndex + pageSize);
  }, [filteredPps, startIndex, pageSize]);

  let paginatedRekapValidasi = (0, w.useMemo)(() => {
    return filteredRekapValidasi.slice(startIndex, startIndex + pageSize);
  }, [filteredRekapValidasi, startIndex, pageSize]);




  return (0, T.jsx)(t, {
    children: (0, T.jsxs)("section", {
      className: "flex flex-col gap-6 py-2",
      children: [
        // Header Halaman (Kompak, Elegan, Laptop-First)
        (0, T.jsxs)("header", {
          className: "border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 text-left",
          children: [
            (0, T.jsxs)("div", {
              className: "flex-1",
              children: [
                (0, T.jsxs)("div", {
                  className: "flex items-center gap-2 mb-1.5",
                  children: [
                    (0, T.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-600 animate-pulse" }),
                    (0, T.jsx)("span", { className: "text-xs font-semibold uppercase tracking-wider text-emerald-800", children: "Bidang Kelembagaan & Data" })
                  ]
                }),
                (0, T.jsx)("h1", {
                  className: "text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight",
                  children: "Kelembagaan Tani, Perikanan & JULEHA"
                }),
                (0, T.jsx)("p", {
                  className: "text-xs md:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed",
                  children: "Pencatatan resmi Kelompok Tani (Poktan, Gapoktan, KWT), Kelembagaan Perikanan (Pokdakan, Poklahsar, Pokmaswas), Lembaga Pendukung (P4S, UPJA), serta Juru Sembelih Halal (JULEHA) Kabupaten Banjarnegara."
                })
              ]
            }),
            (0, T.jsxs)("div", {
              className: "flex flex-wrap items-center gap-2 shrink-0",
              children: [
                (0, T.jsx)("span", { className: "px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md", children: "SIMLUHTAN & KUSUKA" }),
                (0, T.jsx)("span", { className: "px-2.5 py-1 text-[11px] font-semibold text-purple-800 bg-purple-50 border border-purple-200 rounded-md", children: "Sertifikasi Halal BNSP" }),
                (0, T.jsx)("span", { className: "px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-md", children: "20 Kecamatan" })
              ]
            })
          ]
        }),

        // Tab Navigation Switcher (5 Sub-tab Utama)
        (0, T.jsxs)("div", {
          className: "flex flex-col gap-3",
          children: [
            // Level 1: Pilihan 3 Klaster Kelembagaan
            (0, T.jsxs)("div", {
              className: "grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 shadow-2xs",
              children: [
                (0, T.jsxs)("button", {
                  type: "button",
                  onClick: () => { setActiveKlaster("tani"); setActiveTab("pertanian"); setFilterJenis("Semua"); setCurrentPage(1); },
                  className: `py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeKlaster === "tani" ? "bg-white text-emerald-900 shadow-xs border border-slate-200" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/60"
                  }`,
                  children: [
                    (0, T.jsx)(wheatIcon, { className: "h-4 w-4 text-emerald-700 shrink-0" }),
                    "Tani & Gapoktan",
                    (0, T.jsx)("span", {
                      className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeKlaster === "tani" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`,
                      children: dataPertanian.length
                    })
                  ]
                }),
                (0, T.jsxs)("button", {
                  type: "button",
                  onClick: () => { setActiveKlaster("ekonomi"); setActiveTab("kep"); setFilterJenis("Semua"); setCurrentPage(1); },
                  className: `py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeKlaster === "ekonomi" ? "bg-white text-blue-900 shadow-xs border border-slate-200" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/60"
                  }`,
                  children: [
                    (0, T.jsx)(usersIcon, { className: "h-4 w-4 text-blue-700 shrink-0" }),
                    "Ekonomi & Penyuluhan",
                    (0, T.jsx)("span", {
                      className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeKlaster === "ekonomi" ? "bg-blue-100 text-blue-800" : "bg-slate-200 text-slate-700"}`,
                      children: dataKep.length + dataPosluhdes.length + dataPps.length
                    })
                  ]
                }),
                (0, T.jsxs)("button", {
                  type: "button",
                  onClick: () => { setActiveKlaster("sektoral"); setActiveTab("perikanan"); setFilterJenis("Semua"); setCurrentPage(1); },
                  className: `py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeKlaster === "sektoral" ? "bg-white text-teal-900 shadow-xs border border-slate-200" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/60"
                  }`,
                  children: [
                    (0, T.jsx)(fishIcon, { className: "h-4 w-4 text-teal-700 shrink-0" }),
                    "Sektoral & Pendukung",
                    (0, T.jsx)("span", {
                      className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeKlaster === "sektoral" ? "bg-teal-100 text-teal-800" : "bg-slate-200 text-slate-700"}`,
                      children: dataPerikanan.length + dataP4s.length + dataUpja.length + dataJuleha.length
                    })
                  ]
                })
              ]
            }),

            // Level 2: Sub-Tab Pills
            (0, T.jsxs)("div", {
              className: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none",
              children: [
                activeKlaster === "tani" && (0, T.jsxs)(T.Fragment, {
                  children: [
                    (0, T.jsxs)("button", {
                      type: "button",
                      onClick: () => { setActiveTab("pertanian"); setFilterJenis("Semua"); setCurrentPage(1); },
                      style: activeTab === "pertanian" ? { backgroundColor: "#047857", color: "#ffffff", borderColor: "#065f46" } : { backgroundColor: "#ffffff", color: "#334155", borderColor: "#e2e8f0" },
                      className: `px-3.5 py-2 text-xs rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${activeTab === "pertanian" ? "shadow-xs font-bold" : "hover:bg-slate-50 font-semibold shadow-2xs"}`,
                      children: [
                        (0, T.jsx)(wheatIcon, { className: "h-3.5 w-3.5 shrink-0" }),
                        "Poktan, KWT & Gapoktan",
                        (0, T.jsx)("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full font-bold border", children: filteredPertanian.length })
                      ]
                    }),
                    (0, T.jsxs)("button", {
                      type: "button",
                      onClick: () => { setActiveTab("rekap_validasi"); setCurrentPage(1); },
                      style: activeTab === "rekap_validasi" ? { backgroundColor: "#047857", color: "#ffffff", borderColor: "#065f46" } : { backgroundColor: "#ffffff", color: "#334155", borderColor: "#e2e8f0" },
                      className: `px-3.5 py-2 text-xs rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${activeTab === "rekap_validasi" ? "shadow-xs font-bold" : "hover:bg-slate-50 font-semibold shadow-2xs"}`,
                      children: [
                        (0, T.jsx)(fileCheckIcon, { className: "h-3.5 w-3.5 shrink-0" }),
                        "Rekapitulasi Validasi SK Kadistan",
                        (0, T.jsx)("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full font-bold border", children: "20 Kecamatan" })
                      ]
                    }),
                    (0, T.jsxs)("button", {
                      type: "button",
                      onClick: () => { setActiveTab("rekap"); },
                      style: activeTab === "rekap" ? { backgroundColor: "#1e293b", color: "#ffffff", borderColor: "#0f172a" } : { backgroundColor: "#ffffff", color: "#334155", borderColor: "#e2e8f0" },
                      className: `px-3.5 py-2 text-xs rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${activeTab === "rekap" ? "shadow-xs font-bold" : "hover:bg-slate-50 font-semibold shadow-2xs"}`,
                      children: [
                        (0, T.jsx)(leafIcon, { className: "h-3.5 w-3.5 shrink-0" }),
                        "Statistik Historis Desa"
                      ]
                    })
                  ]
                }),

                activeKlaster === "ekonomi" && (0, T.jsxs)(T.Fragment, {
                  children: [
                    (0, T.jsxs)("button", {
                      type: "button",
                      onClick: () => { setActiveTab("kep"); setFilterJenis("Semua"); setCurrentPage(1); },
                      style: activeTab === "kep" ? { backgroundColor: "#1d4ed8", color: "#ffffff", borderColor: "#1e40af" } : { backgroundColor: "#ffffff", color: "#334155", borderColor: "#e2e8f0" },
                      className: `px-3.5 py-2 text-xs rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${activeTab === "kep" ? "shadow-xs font-bold" : "hover:bg-slate-50 font-semibold shadow-2xs"}`,
                      children: [
                        (0, T.jsx)(awardIcon, { className: "h-3.5 w-3.5 shrink-0" }),
                        "Ekonomi Petani (KEP)",
                        (0, T.jsx)("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full font-bold border", children: filteredKep.length })
                      ]
                    }),
                    (0, T.jsxs)("button", {
                      type: "button",
                      onClick: () => { setActiveTab("posluhdes"); setCurrentPage(1); },
                      style: activeTab === "posluhdes" ? { backgroundColor: "#1d4ed8", color: "#ffffff", borderColor: "#1e40af" } : { backgroundColor: "#ffffff", color: "#334155", borderColor: "#e2e8f0" },
                      className: `px-3.5 py-2 text-xs rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${activeTab === "posluhdes" ? "shadow-xs font-bold" : "hover:bg-slate-50 font-semibold shadow-2xs"}`,
                      children: [
                        (0, T.jsx)(mapPinIcon, { className: "h-3.5 w-3.5 shrink-0" }),
                        "Pos Penyuluhan Desa (Posluhdes)",
                        (0, T.jsx)("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full font-bold border", children: filteredPosluhdes.length })
                      ]
                    }),
                    (0, T.jsxs)("button", {
                      type: "button",
                      onClick: () => { setActiveTab("pps"); setCurrentPage(1); },
                      style: activeTab === "pps" ? { backgroundColor: "#1d4ed8", color: "#ffffff", borderColor: "#1e40af" } : { backgroundColor: "#ffffff", color: "#334155", borderColor: "#e2e8f0" },
                      className: `px-3.5 py-2 text-xs rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${activeTab === "pps" ? "shadow-xs font-bold" : "hover:bg-slate-50 font-semibold shadow-2xs"}`,
                      children: [
                        (0, T.jsx)(usersIcon, { className: "h-3.5 w-3.5 shrink-0" }),
                        "Penyuluh Pertanian Swadaya (PPS)",
                        (0, T.jsx)("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full font-bold border", children: filteredPps.length })
                      ]
                    })
                  ]
                }),

                activeKlaster === "sektoral" && (0, T.jsxs)(T.Fragment, {
                  children: [
                    (0, T.jsxs)("button", {
                      type: "button",
                      onClick: () => { setActiveTab("perikanan"); setFilterJenis("Semua"); setCurrentPage(1); },
                      style: activeTab === "perikanan" ? { backgroundColor: "#0f766e", color: "#ffffff", borderColor: "#115e59" } : { backgroundColor: "#ffffff", color: "#334155", borderColor: "#e2e8f0" },
                      className: `px-3.5 py-2 text-xs rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${activeTab === "perikanan" ? "shadow-xs font-bold" : "hover:bg-slate-50 font-semibold shadow-2xs"}`,
                      children: [
                        (0, T.jsx)(fishIcon, { className: "h-3.5 w-3.5 shrink-0" }),
                        "Kelembagaan Perikanan",
                        (0, T.jsx)("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full font-bold border", children: filteredPerikanan.length })
                      ]
                    }),
                    (0, T.jsxs)("button", {
                      type: "button",
                      onClick: () => { setActiveTab("pendukung"); setFilterJenis("Semua"); setCurrentPage(1); },
                      style: activeTab === "pendukung" ? { backgroundColor: "#0f766e", color: "#ffffff", borderColor: "#115e59" } : { backgroundColor: "#ffffff", color: "#334155", borderColor: "#e2e8f0" },
                      className: `px-3.5 py-2 text-xs rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${activeTab === "pendukung" ? "shadow-xs font-bold" : "hover:bg-slate-50 font-semibold shadow-2xs"}`,
                      children: [
                        (0, T.jsx)(tractorIcon, { className: "h-3.5 w-3.5 shrink-0" }),
                        "Lembaga Pendukung (UPJA & P4S)",
                        (0, T.jsx)("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full font-bold border", children: (filteredP4s.length + filteredUpja.length) })
                      ]
                    }),
                    (0, T.jsxs)("button", {
                      type: "button",
                      onClick: () => { setActiveTab("juleha"); setFilterJenis("Semua"); setCurrentPage(1); },
                      style: activeTab === "juleha" ? { backgroundColor: "#0f766e", color: "#ffffff", borderColor: "#115e59" } : { backgroundColor: "#ffffff", color: "#334155", borderColor: "#e2e8f0" },
                      className: `px-3.5 py-2 text-xs rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${activeTab === "juleha" ? "shadow-xs font-bold" : "hover:bg-slate-50 font-semibold shadow-2xs"}`,
                      children: [
                        (0, T.jsx)(shieldCheckIcon, { className: "h-3.5 w-3.5 shrink-0" }),
                        "Petugas JULEHA",
                        (0, T.jsx)("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full font-bold border", children: filteredJuleha.length })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }),

        // Filter Controls Bar (12-Kolom Responsive Grid)
        (0, T.jsxs)("div", {
          className: "bg-white border border-slate-200 p-4 rounded-xl shadow-xs text-left",
          children: [
            (0, T.jsxs)("div", {
              className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end",
              children: [
                // Filter Kecamatan
                (0, T.jsxs)("div", {
                  className: activeTab === "rekap" ? "sm:col-span-1 lg:col-span-5 flex flex-col gap-1.5" : "sm:col-span-1 lg:col-span-3 flex flex-col gap-1.5",
                  children: [
                    (0, T.jsx)("label", {
                      className: "text-[11px] font-bold uppercase tracking-wider text-slate-500",
                      children: "Kecamatan"
                    }),
                    (0, T.jsx)("select", {
                      value: N,
                      onChange: e => te(e.target.value),
                      className: "w-full px-3.5 py-2 border border-slate-200 text-xs font-semibold bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 cursor-pointer h-[38px]",
                      children: K.map(item => (0, T.jsx)("option", { value: item, children: item }, item))
                    })
                  ]
                }),

                // Filter Jenis Lembaga (Khusus Tab Pertanian)
                activeTab === "pertanian" && (0, T.jsxs)("div", {
                  className: "sm:col-span-1 lg:col-span-3 flex flex-col gap-1.5",
                  children: [
                    (0, T.jsx)("label", {
                      className: "text-[11px] font-bold uppercase tracking-wider text-slate-500",
                      children: "Jenis Lembaga Pertanian"
                    }),
                    (0, T.jsx)("select", {
                      value: filterJenis,
                      onChange: e => setFilterJenis(e.target.value),
                      className: "w-full px-3 py-2 border border-slate-200 text-xs font-semibold bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 appearance-none cursor-pointer h-[38px]",
                      children: ["Semua", "Poktan", "Gapoktan", "KWT"].map(jns => (
                        (0, T.jsx)("option", { value: jns, children: jns }, jns)
                      ))
                    })
                  ]
                }),

                // Filter Bentuk Usaha (Khusus Tab KEP)
                activeTab === "kep" && (0, T.jsxs)("div", {
                  className: "sm:col-span-1 lg:col-span-3 flex flex-col gap-1.5",
                  children: [
                    (0, T.jsx)("label", {
                      className: "text-[11px] font-bold uppercase tracking-wider text-slate-500",
                      children: "Bentuk Badan Usaha KEP"
                    }),
                    (0, T.jsx)("select", {
                      value: filterJenis,
                      onChange: e => setFilterJenis(e.target.value),
                      className: "w-full px-3 py-2 border border-slate-200 text-xs font-semibold bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 cursor-pointer h-[38px]",
                      children: ["Semua", "Koperasi", "PT", "CV", "BUMDes", "Lainnya"].map(jns => (
                        (0, T.jsx)("option", { value: jns, children: jns }, jns)
                      ))
                    })
                  ]
                }),

                // Filter Jenis Lembaga (Khusus Tab Perikanan)
                activeTab === "perikanan" && (0, T.jsxs)("div", {
                  className: "sm:col-span-1 lg:col-span-3 flex flex-col gap-1.5",
                  children: [
                    (0, T.jsx)("label", {
                      className: "text-[11px] font-bold uppercase tracking-wider text-slate-500",
                      children: "Jenis Lembaga Perikanan"
                    }),
                    (0, T.jsx)("select", {
                      value: filterJenis,
                      onChange: e => setFilterJenis(e.target.value),
                      className: "w-full px-3 py-2 border border-slate-200 text-xs font-semibold bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 appearance-none cursor-pointer h-[38px]",
                      children: ["Semua", "Pokdakan", "Poklahsar", "Pokmaswas"].map(jns => (
                        (0, T.jsx)("option", { value: jns, children: jns }, jns)
                      ))
                    })
                  ]
                }),

                // Filter Kategori (Khusus Tab Lembaga Pendukung)
                activeTab === "pendukung" && (0, T.jsxs)("div", {
                  className: "sm:col-span-1 lg:col-span-3 flex flex-col gap-1.5",
                  children: [
                    (0, T.jsx)("label", {
                      className: "text-[11px] font-bold uppercase tracking-wider text-slate-500",
                      children: "Kategori Lembaga Pendukung"
                    }),
                    (0, T.jsx)("select", {
                      value: filterJenis,
                      onChange: e => setFilterJenis(e.target.value),
                      className: "w-full px-3 py-2 border border-slate-200 text-xs font-semibold bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 appearance-none cursor-pointer h-[38px]",
                      children: ["Semua", "P4S", "UPJA"].map(jns => (
                        (0, T.jsx)("option", { value: jns, children: jns === "P4S" ? "P4S (Pusat Pelatihan)" : jns === "UPJA" ? "UPJA (Jasa Alsintan)" : "Semua Lembaga Pendukung" }, jns)
                      ))
                    })
                  ]
                }),

                // Filter Status Sertifikasi (Khusus Tab JULEHA)
                activeTab === "juleha" && (0, T.jsxs)("div", {
                  className: "sm:col-span-1 lg:col-span-3 flex flex-col gap-1.5",
                  children: [
                    (0, T.jsx)("label", {
                      className: "text-[11px] font-bold uppercase tracking-wider text-slate-500",
                      children: "Status Sertifikasi JULEHA"
                    }),
                    (0, T.jsx)("select", {
                      value: filterJenis,
                      onChange: e => setFilterJenis(e.target.value),
                      className: "w-full px-3 py-2 border border-slate-200 text-xs font-semibold bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700/20 focus:border-purple-700 appearance-none cursor-pointer h-[38px]",
                      children: ["Semua", "Tersertifikasi", "Dalam Pelatihan"].map(jns => (
                        (0, T.jsx)("option", { value: jns, children: jns === "Semua" ? "Semua Status Sertifikasi" : jns }, jns)
                      ))
                    })
                  ]
                }),

                // Filter Tahun untuk Tab Rekap
                activeTab === "rekap" && (0, T.jsxs)("div", {
                  className: "sm:col-span-1 lg:col-span-5 flex flex-col gap-1.5",
                  children: [
                    (0, T.jsx)("label", {
                      className: "text-[11px] font-bold uppercase tracking-wider text-slate-500",
                      children: "Tahun Data Rekap"
                    }),
                    (0, T.jsxs)("div", {
                      className: "relative",
                      children: [
                        (0, T.jsx)(e, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" }),
                        (0, T.jsx)("select", {
                          value: j ?? "",
                          onChange: e => M(e.target.value),
                          disabled: j === null,
                          className: "w-full pl-8 pr-3 py-2 border border-slate-200 text-xs font-semibold bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700/20 focus:border-slate-700 appearance-none cursor-pointer h-[38px] disabled:opacity-50",
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
                  className: "sm:col-span-2 lg:col-span-4 flex flex-col gap-1.5",
                  children: [
                    (0, T.jsx)("label", {
                      className: "text-[11px] font-bold uppercase tracking-wider text-slate-500",
                      children: "Pencarian Cepat"
                    }),
                    (0, T.jsx)("input", {
                      type: "text",
                      placeholder: activeTab === "juleha" ? "Cari nama juru sembelih, sertifikat, unit tugas..." : activeTab === "pendukung" ? "Cari nama P4S / UPJA, pengelola, alsintan..." : "Cari nama kelompok, no register/SK, ketua, desa...",
                      value: searchQuery,
                      onChange: e => setSearchQuery(e.target.value),
                      className: "w-full px-3.5 py-2 border border-slate-200 text-xs text-slate-800 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 h-[38px]"
                    })
                  ]
                }),

                // Tombol Sinkronisasi Data
                (0, T.jsxs)("div", {
                  className: "sm:col-span-2 lg:col-span-2 flex flex-col gap-1.5",
                  children: [
                    (0, T.jsx)("label", { className: "text-[11px] font-bold uppercase tracking-wider text-transparent select-none hidden lg:block", children: "Aksi" }),
                    (0, T.jsxs)("button", {
                      type: "button",
                      onClick: B,
                      disabled: P || I || loadingEntities,
                      className: "inline-flex items-center justify-center gap-1.5 w-full h-[38px] border border-slate-200 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all rounded-lg disabled:opacity-50 cursor-pointer shadow-2xs",
                      children: [
                        (0, T.jsx)(r, { className: "h-3.5 w-3.5 text-slate-500" }),
                        I || loadingEntities ? "Memuat..." : "Sinkronkan"
                      ]
                    })
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
                /* Banner template admin dinonaktifkan di halaman publik */
                // Ringkasan Kartu Pertanian
                (0, T.jsxs)("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-amber-800 uppercase tracking-wide", children: "Kelompok Tani (Poktan)" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-amber-50 text-amber-700", children: (0, T.jsx)(wheatIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [$(filteredPertanian.filter(x => x.jenis_lembaga === "Poktan").length), " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "unit" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Basis petani pangan, horti & perkebunan" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-emerald-800 uppercase tracking-wide", children: "Gabungan Poktan (Gapoktan)" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-emerald-50 text-emerald-700", children: (0, T.jsx)(fileCheckIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [$(filteredPertanian.filter(x => x.jenis_lembaga === "Gapoktan").length), " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "unit" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Aliansi poktan tingkat desa / kelurahan" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-rose-800 uppercase tracking-wide", children: "Kelompok Wanita Tani (KWT)" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-rose-50 text-rose-700", children: (0, T.jsx)(usersIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [$(filteredPertanian.filter(x => x.jenis_lembaga === "KWT").length), " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "unit" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Pemberdayaan wanita tani & pekarangan" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-slate-600 uppercase tracking-wide", children: "Total Anggota Terdaftar" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-slate-50 text-slate-700", children: (0, T.jsx)(usersIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [$(filteredPertanian.reduce((acc, c) => acc + (Number(c.jumlah_anggota) || 0), 0)), " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "orang" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Terdata di SIMLUHTAN Kementan" })
                      ]
                    })
                  ]
                }),

                // Tabel Register Kelembagaan Pertanian
                (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2 bg-slate-50/70",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h4", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: "Buku Register Kelembagaan Pertanian (SIMLUHTAN & SK)" }),
                            (0, T.jsx)("p", { className: "text-xs text-slate-500 mt-0.5", children: "Pencatatan legalitas, nomor register Simluhtan Kementan, SK pengukuhan, dan ketua kelompok." })
                          ]
                        }),
                        (0, T.jsxs)("span", {
                          className: "text-xs font-bold text-slate-700 px-2.5 py-1 bg-white border border-slate-200 rounded-md shadow-2xs",
                          children: [`Menampilkan `, filteredPertanian.length, ` entri data`]
                        })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "overflow-x-auto max-h-[520px] custom-scrollbar",
                      children: (0, T.jsxs)("table", {
                        className: "w-full text-left text-xs border-collapse",
                        children: [
                          (0, T.jsx)("thead", {
                            className: "bg-slate-100/90 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-600 sticky top-0 z-10 backdrop-blur-xs",
                            children: (0, T.jsxs)("tr", {
                              children: [
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-center w-12", children: "No" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 min-w-[180px]", children: "Nama Kelompok" }),
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
                              paginatedPertanian.map((item, idx) => (
                                (0, T.jsxs)("tr", {
                                  className: "hover:bg-slate-50 transition-colors",
                                  children: [
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-center font-bold text-slate-500", children: startIndex + idx + 1 }),
                                    (0, T.jsxs)("td", {
                                      className: "p-3 border-r border-slate-200 font-bold text-slate-900",
                                      children: [item.nama_kelompok, item.tahun_berdiri ? (0, T.jsx)("span", { className: "text-[10px] text-slate-400 font-normal block mt-0.5", children: `Est. ${item.tahun_berdiri}` }) : null]
                                    }),
                                    (0, T.jsx)("td", {
                                      className: "p-3 border-r border-slate-200",
                                      children: (0, T.jsx)("span", {
                                        className: `px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                          item.jenis_lembaga === "Poktan" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                                          item.jenis_lembaga === "Gapoktan" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                                          "bg-rose-100 text-rose-800 border border-rose-200"
                                        }`,
                                        children: item.jenis_lembaga
                                      })
                                    }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200", children: item.id_simluhtan ? (0, T.jsx)("span", { className: "font-semibold text-[11px] tabular-nums tracking-tight bg-slate-100/90 text-slate-800 px-2 py-0.5 rounded border border-slate-200/80", children: item.id_simluhtan }) : "-" }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-600", children: item.no_sk_pengukuhan || "-" }),
                                    (0, T.jsxs)("td", {
                                      className: "p-3 border-r border-slate-200",
                                      children: [(0, T.jsx)("span", { className: "font-semibold text-slate-800", children: item.desa || "-" }), ", ", item.kecamatan]
                                    }),
                                    (0, T.jsxs)("td", {
                                      className: "p-3 border-r border-slate-200",
                                      children: [
                                        (0, T.jsx)("span", { className: item.nama_ketua === "Belum Terdata" ? "text-slate-400 italic text-[11px]" : "font-semibold text-slate-900", children: item.nama_ketua || "-" }),
                                        (item.kontak_hp && item.kontak_hp !== "-" && item.kontak_hp !== "Belum terdata")
                                          ? (0, T.jsx)("span", { className: "text-[10px] text-slate-600 font-mono block mt-0.5", children: item.kontak_hp })
                                          : (0, T.jsx)("span", { className: "text-[10px] text-slate-400 italic block mt-0.5", children: "Belum terdata" })
                                      ]
                                    }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-medium text-slate-700", children: item.kelas_kemampuan || "-" }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-600", children: item.subsektor_utama || "-" }),
                                    (0, T.jsxs)("td", {
                                      className: "p-3 border-r border-slate-200 text-right font-bold tabular-nums text-slate-900",
                                      children: Number(item.jumlah_anggota) > 0 ? [$(item.jumlah_anggota), " org"] : (0, T.jsx)("span", { className: "text-[10px] text-slate-400 font-normal italic", children: "Dalam pemutakhiran" })
                                    }),
                                    (0, T.jsx)("td", {
                                      className: "p-3 text-center",
                                      children: (0, T.jsx)("span", {
                                        className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                          item.status_aktif === "Aktif" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                                          item.status_aktif === "Tidak Aktif" ? "bg-rose-50 text-rose-800 border border-rose-200" :
                                          "bg-amber-50 text-amber-800 border border-amber-200"
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
                    }),
                    // Kontrol Paginasi Sederhana & Resmi
                    (0, T.jsxs)("div", {
                      className: "p-3 border-t border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "text-slate-600 font-medium flex items-center gap-2",
                          children: [
                            `Menampilkan `,
                            (0, T.jsx)("span", { className: "font-bold text-slate-900", children: filteredPertanian.length === 0 ? 0 : startIndex + 1 }),
                            `–`,
                            (0, T.jsx)("span", { className: "font-bold text-slate-900", children: Math.min(startIndex + pageSize, filteredPertanian.length) }),
                            ` dari `,
                            (0, T.jsx)("span", { className: "font-bold text-slate-900", children: filteredPertanian.length }),
                            ` data`
                          ]
                        }),
                        (0, T.jsxs)("div", {
                          className: "flex items-center gap-2",
                          children: [
                            (0, T.jsxs)("div", {
                              className: "flex items-center gap-1.5 text-slate-500 mr-2",
                              children: [
                                "Baris:",
                                (0, T.jsxs)("select", {
                                  value: pageSize,
                                  onChange: e => { setPageSize(Number(e.target.value)); setCurrentPage(1); },
                                  className: "border border-slate-300 rounded bg-white px-2 py-1 text-xs font-semibold text-slate-700",
                                  children: [
                                    (0, T.jsx)("option", { value: 25, children: "25" }),
                                    (0, T.jsx)("option", { value: 50, children: "50" }),
                                    (0, T.jsx)("option", { value: 100, children: "100" })
                                  ]
                                })
                              ]
                            }),
                            (0, T.jsx)("button", {
                              type: "button",
                              disabled: currentPage <= 1,
                              onClick: () => setCurrentPage(p => Math.max(1, p - 1)),
                              className: "px-3 py-1 bg-white border border-slate-300 rounded text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-2xs",
                              children: "Sebelumnya"
                            }),
                            (0, T.jsxs)("span", {
                              className: "px-2 text-slate-600 font-medium",
                              children: [`Halaman `, (0, T.jsx)("strong", { className: "text-slate-900", children: currentPage }), ` dari `, totalPages]
                            }),
                            (0, T.jsx)("button", {
                              type: "button",
                              disabled: currentPage >= totalPages,
                              onClick: () => setCurrentPage(p => Math.min(totalPages, p + 1)),
                              className: "px-3 py-1 bg-white border border-slate-300 rounded text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-2xs",
                              children: "Berikutnya"
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // =========================================================================
            // TAB REKAPITULASI VALIDASI SK KADISTAN
            // =========================================================================
            activeTab === "rekap_validasi" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-6",
              children: [
                (0, T.jsxs)("div", {
                  className: "bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      children: [
                        (0, T.jsx)("h3", { className: "text-sm font-bold text-emerald-950", children: "Rekapitulasi Validasi Kemampuan Kelas Kelompok Tani" }),
                        (0, T.jsx)("p", { className: "text-xs text-emerald-800 mt-0.5", children: "Penetapan resmi Kepala Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara (20 Kecamatan)" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "flex items-center gap-3 shrink-0",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-center",
                          children: [
                            (0, T.jsx)("div", { className: "text-[10px] text-slate-500 font-bold uppercase", children: "Total Poktan" }),
                            (0, T.jsx)("div", { className: "text-sm font-extrabold text-emerald-900", children: "2.398" })
                          ]
                        }),
                        (0, T.jsxs)("div", {
                          className: "bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-center",
                          children: [
                            (0, T.jsx)("div", { className: "text-[10px] text-slate-500 font-bold uppercase", children: "Total Gapoktan" }),
                            (0, T.jsx)("div", { className: "text-sm font-extrabold text-emerald-900", children: "277" })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                (0, T.jsx)("div", {
                  className: "bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden",
                  children: (0, T.jsx)("div", {
                    className: "overflow-x-auto",
                    children: (0, T.jsxs)("table", {
                      className: "w-full text-left text-xs border-collapse",
                      children: [
                        (0, T.jsx)("thead", {
                          className: "bg-slate-50 border-b border-slate-200 text-slate-700 font-bold",
                          children: (0, T.jsxs)("tr", {
                            children: [
                              (0, T.jsx)("th", { className: "px-3.5 py-3 text-center w-12", children: "No" }),
                              (0, T.jsx)("th", { className: "px-4 py-3", children: "Kecamatan" }),
                              (0, T.jsx)("th", { className: "px-3 py-3 text-right", children: "Jumlah Desa" }),
                              (0, T.jsx)("th", { className: "px-3 py-3 text-right", children: "Jumlah Gapoktan" }),
                              (0, T.jsx)("th", { className: "px-3 py-3 text-right", children: "Jumlah Poktan" }),
                              (0, T.jsx)("th", { className: "px-3 py-3 text-right bg-amber-50/60 text-amber-900", children: "Pemula (P)" }),
                              (0, T.jsx)("th", { className: "px-3 py-3 text-right bg-blue-50/60 text-blue-900", children: "Lanjut (L)" }),
                              (0, T.jsx)("th", { className: "px-3 py-3 text-right bg-emerald-50/60 text-emerald-900", children: "Madya (M)" }),
                              (0, T.jsx)("th", { className: "px-3 py-3 text-right bg-purple-50/60 text-purple-900", children: "Utama (U)" })
                            ]
                          })
                        }),
                        (0, T.jsxs)("tbody", {
                          className: "divide-y divide-slate-100",
                          children: [
                            paginatedRekapValidasi.map((item, idx) => (
                              (0, T.jsxs)("tr", {
                                className: "hover:bg-slate-50/80 transition-colors",
                                children: [
                                  (0, T.jsx)("td", { className: "px-3.5 py-2.5 text-center text-slate-500 font-mono", children: startIndex + idx + 1 }),
                                  (0, T.jsx)("td", { className: "px-4 py-2.5 font-bold text-slate-900", children: item.kecamatan }),
                                  (0, T.jsx)("td", { className: "px-3 py-2.5 text-right font-medium text-slate-700", children: item.jumlah_desa }),
                                  (0, T.jsx)("td", { className: "px-3 py-2.5 text-right font-medium text-slate-700", children: item.jumlah_gapoktan }),
                                  (0, T.jsx)("td", { className: "px-3 py-2.5 text-right font-bold text-slate-900", children: item.jumlah_poktan }),
                                  (0, T.jsx)("td", { className: "px-3 py-2.5 text-right font-semibold text-amber-800 bg-amber-50/30", children: item.kelas_pemula }),
                                  (0, T.jsx)("td", { className: "px-3 py-2.5 text-right font-semibold text-blue-800 bg-blue-50/30", children: item.kelas_lanjut }),
                                  (0, T.jsx)("td", { className: "px-3 py-2.5 text-right font-semibold text-emerald-800 bg-emerald-50/30", children: item.kelas_madya }),
                                  (0, T.jsx)("td", { className: "px-3 py-2.5 text-right font-bold text-purple-800 bg-purple-50/30", children: item.kelas_utama })
                                ]
                              }, item.kecamatan || idx)
                            )),
                            (0, T.jsxs)("tr", {
                              className: "bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300",
                              children: [
                                (0, T.jsx)("td", { className: "px-3.5 py-3 text-center", children: "Σ" }),
                                (0, T.jsx)("td", { className: "px-4 py-3 uppercase tracking-wider", children: "Total Kabupaten Banjarnegara" }),
                                (0, T.jsx)("td", { className: "px-3 py-3 text-right", children: "278" }),
                                (0, T.jsx)("td", { className: "px-3 py-3 text-right", children: "277" }),
                                (0, T.jsx)("td", { className: "px-3 py-3 text-right text-emerald-950 font-extrabold", children: "2.398" }),
                                (0, T.jsx)("td", { className: "px-3 py-3 text-right text-amber-900", children: "622" }),
                                (0, T.jsx)("td", { className: "px-3 py-3 text-right text-blue-900", children: "1.133" }),
                                (0, T.jsx)("td", { className: "px-3 py-3 text-right text-emerald-900", children: "592" }),
                                (0, T.jsx)("td", { className: "px-3 py-3 text-right text-purple-900", children: "51" })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  })
                })
              ]
            }),

            // =========================================================================
            // TAB KELOMPOK EKONOMI PETANI (KEP)
            // =========================================================================
            activeTab === "kep" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-6",
              children: [
                (0, T.jsxs)("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs",
                      children: [
                        (0, T.jsx)("div", { className: "text-[11px] font-bold text-blue-800 uppercase tracking-wide", children: "Total Unit KEP" }),
                        (0, T.jsx)("div", { className: "text-2xl font-black text-slate-900 mt-1", children: dataKep.length }),
                        (0, T.jsx)("div", { className: "text-[11px] text-slate-500 mt-1", children: "Kelembagaan Ekonomi Petani" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs",
                      children: [
                        (0, T.jsx)("div", { className: "text-[11px] font-bold text-emerald-800 uppercase tracking-wide", children: "Total Aset / Modal Usaha" }),
                        (0, T.jsx)("div", { className: "text-lg font-black text-slate-900 mt-1", children: "Rp 2,20 Miliar" }),
                        (0, T.jsx)("div", { className: "text-[11px] text-slate-500 mt-1", children: "Akumulasi Modal KEP Kabupaten" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs",
                      children: [
                        (0, T.jsx)("div", { className: "text-[11px] font-bold text-amber-800 uppercase tracking-wide", children: "Status Keaktifan" }),
                        (0, T.jsx)("div", { className: "text-2xl font-black text-slate-900 mt-1", children: `${dataKep.filter(k => k.status_aktif === 'Aktif').length} Aktif` }),
                        (0, T.jsx)("div", { className: "text-[11px] text-slate-500 mt-1", children: "Unit beroperasi resmi" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs",
                      children: [
                        (0, T.jsx)("div", { className: "text-[11px] font-bold text-purple-800 uppercase tracking-wide", children: "Pendampingan BPP" }),
                        (0, T.jsx)("div", { className: "text-2xl font-black text-slate-900 mt-1", children: "17 BPP" }),
                        (0, T.jsx)("div", { className: "text-[11px] text-slate-500 mt-1", children: "Wilayah binaan penyuluh" })
                      ]
                    })
                  ]
                }),

                (0, T.jsx)("div", {
                  className: "bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden",
                  children: (0, T.jsx)("div", {
                    className: "overflow-x-auto",
                    children: (0, T.jsxs)("table", {
                      className: "w-full text-left text-xs border-collapse",
                      children: [
                        (0, T.jsx)("thead", {
                          className: "bg-slate-50 border-b border-slate-200 text-slate-700 font-bold",
                          children: (0, T.jsxs)("tr", {
                            children: [
                              (0, T.jsx)("th", { className: "px-3.5 py-3 text-center w-12", children: "No" }),
                              (0, T.jsx)("th", { className: "px-4 py-3", children: "Nama KEP" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "Bentuk Usaha" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "Komoditas" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "BPP / Kecamatan" }),
                              (0, T.jsx)("th", { className: "px-3 py-3 text-right", children: "Modal/Aset (Rp)" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "Penyuluh Pendamping" }),
                              (0, T.jsx)("th", { className: "px-3 py-3 text-center", children: "Status" })
                            ]
                          })
                        }),
                        (0, T.jsx)("tbody", {
                          className: "divide-y divide-slate-100",
                          children: paginatedKep.map((item, idx) => (
                            (0, T.jsxs)("tr", {
                              className: "hover:bg-slate-50/80 transition-colors",
                              children: [
                                (0, T.jsx)("td", { className: "px-3.5 py-2.5 text-center text-slate-500 font-mono", children: startIndex + idx + 1 }),
                                (0, T.jsxs)("td", {
                                  className: "px-4 py-2.5 font-bold text-slate-900",
                                  children: [
                                    item.nama_kep,
                                    (0, T.jsx)("div", { className: "text-[10px] text-slate-500 font-normal", children: item.alamat || "-" })
                                  ]
                                }),
                                (0, T.jsx)("td", { className: "px-3 py-2.5 text-slate-700", children: item.bentuk_kep || "-" }),
                                (0, T.jsx)("td", { className: "px-3 py-2.5 font-semibold text-slate-800", children: item.komoditas || "-" }),
                                (0, T.jsx)("td", { className: "px-3 py-2.5 text-slate-600", children: item.bpp || item.kecamatan || "-" }),
                                (0, T.jsx)("td", { className: "px-3 py-2.5 text-right font-mono font-semibold text-emerald-800", children: item.modal_usaha_aset ? Number(item.modal_usaha_aset).toLocaleString("id-ID") : "-" }),
                                (0, T.jsxs)("td", {
                                  className: "px-3 py-2.5 text-slate-700",
                                  children: [
                                    item.penyuluh_pendamping || "-",
                                    item.penyuluh_hp && item.penyuluh_hp !== "-" && (0, T.jsx)("div", { className: "text-[10px] text-slate-400 font-mono", children: item.penyuluh_hp })
                                  ]
                                }),
                                (0, T.jsx)("td", {
                                  className: "px-3 py-2.5 text-center",
                                  children: (0, T.jsx)("span", {
                                    className: `text-[10px] px-2 py-0.5 rounded-full font-bold ${item.status_aktif === 'Aktif' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`,
                                    children: item.status_aktif || "Aktif"
                                  })
                                })
                              ]
                            }, item.id || idx)
                          ))
                        })
                      ]
                    })
                  })
                })
              ]
            }),

            // =========================================================================
            // TAB POS PENYULUHAN DESA (POSLUHDES)
            // =========================================================================
            activeTab === "posluhdes" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-6",
              children: [
                (0, T.jsxs)("div", {
                  className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs",
                      children: [
                        (0, T.jsx)("div", { className: "text-[11px] font-bold text-blue-800 uppercase tracking-wide", children: "Total Posluhdes" }),
                        (0, T.jsx)("div", { className: "text-2xl font-black text-slate-900 mt-1", children: dataPosluhdes.length }),
                        (0, T.jsx)("div", { className: "text-[11px] text-slate-500 mt-1", children: "Pos Penyuluhan Desa Terdaftar" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs",
                      children: [
                        (0, T.jsx)("div", { className: "text-[11px] font-bold text-emerald-800 uppercase tracking-wide", children: "Cakupan Desa" }),
                        (0, T.jsx)("div", { className: "text-2xl font-black text-slate-900 mt-1", children: `${new Set(dataPosluhdes.map(p => p.desa)).size} Desa` }),
                        (0, T.jsx)("div", { className: "text-[11px] text-slate-500 mt-1", children: "Desa dengan Posluhdes aktif" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs",
                      children: [
                        (0, T.jsx)("div", { className: "text-[11px] font-bold text-amber-800 uppercase tracking-wide", children: "Wilayah BPP" }),
                        (0, T.jsx)("div", { className: "text-2xl font-black text-slate-900 mt-1", children: `${new Set(dataPosluhdes.map(p => p.bpp)).size} BPP` }),
                        (0, T.jsx)("div", { className: "text-[11px] text-slate-500 mt-1", children: "Pusat koordinasi penyuluhan" })
                      ]
                    })
                  ]
                }),

                (0, T.jsx)("div", {
                  className: "bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden",
                  children: (0, T.jsx)("div", {
                    className: "overflow-x-auto",
                    children: (0, T.jsxs)("table", {
                      className: "w-full text-left text-xs border-collapse",
                      children: [
                        (0, T.jsx)("thead", {
                          className: "bg-slate-50 border-b border-slate-200 text-slate-700 font-bold",
                          children: (0, T.jsxs)("tr", {
                            children: [
                              (0, T.jsx)("th", { className: "px-3.5 py-3 text-center w-12", children: "No" }),
                              (0, T.jsx)("th", { className: "px-4 py-3", children: "Nama Posluhdes" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "Desa" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "Wilayah BPP" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "Pimpinan Posluhdes" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "Penyuluh Swadaya" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "Kontak" })
                            ]
                          })
                        }),
                        (0, T.jsx)("tbody", {
                          className: "divide-y divide-slate-100",
                          children: paginatedPosluhdes.map((item, idx) => (
                            (0, T.jsxs)("tr", {
                              className: "hover:bg-slate-50/80 transition-colors",
                              children: [
                                (0, T.jsx)("td", { className: "px-3.5 py-2.5 text-center text-slate-500 font-mono", children: startIndex + idx + 1 }),
                                (0, T.jsxs)("td", {
                                  className: "px-4 py-2.5 font-bold text-slate-900",
                                  children: [
                                    item.nama_posluhdes,
                                    item.no_ba_pengukuhan && item.no_ba_pengukuhan !== "-" && (0, T.jsx)("div", { className: "text-[10px] text-slate-500 font-normal", children: `BA: ${item.no_ba_pengukuhan}` })
                                  ]
                                }),
                                (0, T.jsx)("td", { className: "px-3 py-2.5 font-semibold text-slate-800", children: item.desa }),
                                (0, T.jsx)("td", { className: "px-3 py-2.5 text-slate-600", children: item.bpp }),
                                (0, T.jsx)("td", { className: "px-3 py-2.5 text-slate-800 font-medium", children: item.nama_pimpinan || "-" }),
                                (0, T.jsx)("td", { className: "px-3 py-2.5 text-slate-700", children: item.penyuluh_swadaya || "-" }),
                                (0, T.jsx)("td", { className: "px-3 py-2.5 text-slate-600 font-mono", children: item.kontak_hp || "-" })
                              ]
                            }, item.id || idx)
                          ))
                        })
                      ]
                    })
                  })
                })
              ]
            }),

            // =========================================================================
            // TAB PENYULUH PERTANIAN SWADAYA (PPS)
            // =========================================================================
            activeTab === "pps" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-6",
              children: [
                (0, T.jsxs)("div", {
                  className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs",
                      children: [
                        (0, T.jsx)("div", { className: "text-[11px] font-bold text-blue-800 uppercase tracking-wide", children: "Total Penyuluh Swadaya" }),
                        (0, T.jsx)("div", { className: "text-2xl font-black text-slate-900 mt-1", children: dataPps.length }),
                        (0, T.jsx)("div", { className: "text-[11px] text-slate-500 mt-1", children: "Tenaga PPS Kabupaten Banjarnegara" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs",
                      children: [
                        (0, T.jsx)("div", { className: "text-[11px] font-bold text-emerald-800 uppercase tracking-wide", children: "Distribusi Unit Kerja" }),
                        (0, T.jsx)("div", { className: "text-2xl font-black text-slate-900 mt-1", children: `${new Set(dataPps.map(p => p.unit_kerja)).size} BPP` }),
                        (0, T.jsx)("div", { className: "text-[11px] text-slate-500 mt-1", children: "Kecamatan wilayah koordinasi" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs",
                      children: [
                        (0, T.jsx)("div", { className: "text-[11px] font-bold text-purple-800 uppercase tracking-wide", children: "Keahlian Lintas Sektor" }),
                        (0, T.jsx)("div", { className: "text-2xl font-black text-slate-900 mt-1", children: "TP, Horti, Ternak, Bun" }),
                        (0, T.jsx)("div", { className: "text-[11px] text-slate-500 mt-1", children: "Kompetensi lapangan terdaftar" })
                      ]
                    })
                  ]
                }),

                (0, T.jsx)("div", {
                  className: "bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden",
                  children: (0, T.jsx)("div", {
                    className: "overflow-x-auto",
                    children: (0, T.jsxs)("table", {
                      className: "w-full text-left text-xs border-collapse",
                      children: [
                        (0, T.jsx)("thead", {
                          className: "bg-slate-50 border-b border-slate-200 text-slate-700 font-bold",
                          children: (0, T.jsxs)("tr", {
                            children: [
                              (0, T.jsx)("th", { className: "px-3.5 py-3 text-center w-12", children: "No" }),
                              (0, T.jsx)("th", { className: "px-4 py-3", children: "Nama Penyuluh" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "Unit Kerja BPP" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "Wilayah Kerja" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "Bidang Keahlian" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "Pendidikan" }),
                              (0, T.jsx)("th", { className: "px-3 py-3", children: "Kontak" })
                            ]
                          })
                        }),
                        (0, T.jsx)("tbody", {
                          className: "divide-y divide-slate-100",
                          children: paginatedPps.map((item, idx) => (
                            (0, T.jsxs)("tr", {
                              className: "hover:bg-slate-50/80 transition-colors",
                              children: [
                                (0, T.jsx)("td", { className: "px-3.5 py-2.5 text-center text-slate-500 font-mono", children: startIndex + idx + 1 }),
                                (0, T.jsxs)("td", {
                                  className: "px-4 py-2.5 font-bold text-slate-900",
                                  children: [
                                    item.nama_penyuluh,
                                    item.tempat_tgl_lahir && item.tempat_tgl_lahir !== "-" && (0, T.jsx)("div", { className: "text-[10px] text-slate-500 font-normal", children: item.tempat_tgl_lahir })
                                  ]
                                }),
                                (0, T.jsx)("td", { className: "px-3 py-2.5 font-semibold text-slate-800", children: item.unit_kerja }),
                                (0, T.jsx)("td", { className: "px-3 py-2.5 text-slate-600", children: item.wilayah_kerja || "-" }),
                                (0, T.jsxs)("td", {
                                  className: "px-3 py-2.5",
                                  children: [
                                    item.keahlian_tp && (0, T.jsx)("span", { className: "inline-block text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 mr-1 font-bold", children: "TP" }),
                                    item.keahlian_horti && (0, T.jsx)("span", { className: "inline-block text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 mr-1 font-bold", children: "Horti" }),
                                    item.keahlian_nak && (0, T.jsx)("span", { className: "inline-block text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 mr-1 font-bold", children: "Ternak" }),
                                    item.keahlian_bun && (0, T.jsx)("span", { className: "inline-block text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 mr-1 font-bold", children: "Perkebunan" }),
                                    !item.keahlian_tp && !item.keahlian_horti && !item.keahlian_nak && !item.keahlian_bun && (0, T.jsx)("span", { className: "text-slate-400", children: "-" })
                                  ]
                                }),
                                (0, T.jsx)("td", { className: "px-3 py-2.5 text-slate-700", children: item.pendidikan || "-" }),
                                (0, T.jsx)("td", { className: "px-3 py-2.5 text-slate-600 font-mono", children: item.kontak_hp || "-" })
                              ]
                            }, item.id || idx)
                          ))
                        })
                      ]
                    })
                  })
                })
              ]
            }),

            // =========================================================================
            // TAB 2: KELEMBAGAAN PERIKANAN (Pokdakan, Poklahsar, Pokmaswas)
            // =========================================================================
            activeTab === "perikanan" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-6",
              children: [

                // Ringkasan Kartu Perikanan
                (0, T.jsxs)("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-blue-800 uppercase tracking-wide", children: "Pokdakan (Pembudidaya)" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-blue-50 text-blue-700", children: (0, T.jsx)(fishIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [$(filteredPerikanan.filter(x => x.jenis_lembaga === "Pokdakan").length), " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "unit" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Budidaya kolam, mina, dan karamba" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-cyan-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-cyan-800 uppercase tracking-wide", children: "Poklahsar (Pengolah)" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-cyan-50 text-cyan-700", children: (0, T.jsx)(awardIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [$(filteredPerikanan.filter(x => x.jenis_lembaga === "Poklahsar").length), " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "unit" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Hilirisasi olahan & pemasar ikan" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-teal-800 uppercase tracking-wide", children: "Pokmaswas (Pengawas)" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-teal-50 text-teal-700", children: (0, T.jsx)(shieldCheckIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [$(filteredPerikanan.filter(x => x.jenis_lembaga === "Pokmaswas").length), " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "unit" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Kelompok pengawas masyarakat perairan" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-slate-600 uppercase tracking-wide", children: "Total Anggota Terdaftar" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-slate-50 text-slate-700", children: (0, T.jsx)(usersIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [$(filteredPerikanan.reduce((acc, c) => acc + (Number(c.jumlah_anggota) || 0), 0)), " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "orang" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Terdata di KUSUKA KKP" })
                      ]
                    })
                  ]
                }),

                // Tabel Register Kelembagaan Perikanan
                (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2 bg-slate-50/70",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h4", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: "Buku Register Kelembagaan Perikanan (KUSUKA KKP)" }),
                            (0, T.jsx)("p", { className: "text-xs text-slate-500 mt-0.5", children: "Pencatatan legalitas kelompok perikanan, nomor identitas KUSUKA, komoditas budidaya, dan kontak ketua." })
                          ]
                        }),
                        (0, T.jsxs)("span", {
                          className: "text-xs font-bold text-slate-700 px-2.5 py-1 bg-white border border-slate-200 rounded-md shadow-2xs",
                          children: [`Menampilkan `, filteredPerikanan.length, ` entri data`]
                        })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "overflow-x-auto max-h-[520px] custom-scrollbar",
                      children: (0, T.jsxs)("table", {
                        className: "w-full text-left text-xs border-collapse",
                        children: [
                          (0, T.jsx)("thead", {
                            className: "bg-slate-100/90 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-600 sticky top-0 z-10 backdrop-blur-xs",
                            children: (0, T.jsxs)("tr", {
                              children: [
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-center w-12", children: "No" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 min-w-[180px]", children: "Nama Kelompok" }),
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
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-center font-bold text-slate-500", children: idx + 1 }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold text-slate-900", children: item.nama_kelompok }),
                                    (0, T.jsx)("td", {
                                      className: "p-3 border-r border-slate-200",
                                      children: (0, T.jsx)("span", {
                                        className: `px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                          item.jenis_lembaga === "Pokdakan" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                                          item.jenis_lembaga === "Poklahsar" ? "bg-cyan-100 text-cyan-800 border border-cyan-200" :
                                          "bg-teal-100 text-teal-800 border border-teal-200"
                                        }`,
                                        children: item.jenis_lembaga
                                      })
                                    }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200", children: item.id_kusuka ? (0, T.jsx)("span", { className: "font-semibold text-[11px] tabular-nums tracking-tight bg-slate-100/90 text-slate-800 px-2 py-0.5 rounded border border-slate-200/80", children: item.id_kusuka }) : "-" }),
                                    (0, T.jsxs)("td", {
                                      className: "p-3 border-r border-slate-200",
                                      children: [(0, T.jsx)("span", { className: "font-semibold text-slate-800", children: item.desa || "-" }), ", ", item.kecamatan]
                                    }),
                                    (0, T.jsxs)("td", {
                                      className: "p-3 border-r border-slate-200",
                                      children: [(0, T.jsx)("span", { className: "font-semibold text-slate-900", children: item.nama_ketua || "-" }), (0, T.jsx)("span", { className: "text-[10px] text-slate-500 block mt-0.5", children: item.kontak_hp || "-" })]
                                    }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-800 font-medium", children: item.komoditas_utama || "-" }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-600", children: item.kelas_kemampuan || "-" }),
                                    (0, T.jsxs)("td", { className: "p-3 border-r border-slate-200 text-right font-bold tabular-nums text-slate-900", children: [$(item.jumlah_anggota), " org"] }),
                                    (0, T.jsx)("td", {
                                      className: "p-3 text-center",
                                      children: (0, T.jsx)("span", {
                                        className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                          item.status_aktif === "Aktif" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
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


                // KPI Ringkasan Kartu Lembaga Pendukung
                (0, T.jsxs)("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-emerald-800 uppercase tracking-wide", children: "P4S Swadaya Petani" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-emerald-50 text-emerald-700", children: (0, T.jsx)(awardIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [filteredP4s.length, " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "unit" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Pusat pelatihan pertanian & perdesaan" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-teal-800 uppercase tracking-wide", children: "Akreditasi BPPSDMP" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-teal-50 text-teal-700", children: (0, T.jsx)(shieldCheckIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [filteredP4s.filter(x => (x.klasifikasi_akreditasi || "").toLowerCase().includes("akreditasi") || (x.klasifikasi_akreditasi || "").toLowerCase().includes("terdaftar")).length, " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "lembaga" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Terakreditasi resmi Kementan" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-amber-800 uppercase tracking-wide", children: "UPJA Jasa Alsintan" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-amber-50 text-amber-700", children: (0, T.jsx)(tractorIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [filteredUpja.length, " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "unit" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Pengelola sewa alsintan per kecamatan" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-slate-600 uppercase tracking-wide", children: "Total Alsintan Dikelola" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-slate-50 text-slate-700", children: (0, T.jsx)(tractorIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [$(filteredUpja.reduce((acc, c) => acc + (Number(c.jumlah_alsintan) || 0), 0)), " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "unit" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Traktor, combine & transplanter" })
                      ]
                    })
                  ]
                }),

                // Bagian P4S
                (filterJenis === "Semua" || filterJenis === "P4S") && (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "p-4 border-b border-slate-200 bg-emerald-50/60 flex flex-wrap justify-between items-center gap-2",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h4", { className: "text-sm font-bold text-emerald-950 uppercase tracking-wide", children: "P4S — Pusat Pelatihan Pertanian dan Perdesaan Swadaya" }),
                            (0, T.jsx)("p", { className: "text-xs text-emerald-800 mt-0.5", children: "Kelembagaan pelatihan mandiri petani terakreditasi BPPSDMP Kementan." })
                          ]
                        }),
                        (0, T.jsxs)("span", { className: "text-xs font-bold text-emerald-800 px-2.5 py-1 bg-emerald-100/90 rounded-md shadow-2xs", children: [filteredP4s.length, " Unit P4S Terdaftar"] })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "overflow-x-auto max-h-[460px] custom-scrollbar",
                      children: (0, T.jsxs)("table", {
                        className: "w-full text-left text-xs border-collapse",
                        children: [
                          (0, T.jsx)("thead", {
                            className: "bg-slate-100/90 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-600 sticky top-0 z-10 backdrop-blur-xs",
                            children: (0, T.jsxs)("tr", {
                              children: [
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-center w-12", children: "No" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 min-w-[180px]", children: "Nama P4S" }),
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
                            children: filteredP4s.length === 0 ? (
                              (0, T.jsx)("tr", {
                                children: (0, T.jsx)("td", { colSpan: 8, className: "p-6 text-center text-slate-400 font-medium", children: "Belum ada data P4S yang cocok dengan filter pencarian." })
                              })
                            ) : (
                              filteredP4s.map((item, idx) => (
                                (0, T.jsxs)("tr", {
                                  className: "hover:bg-slate-50 transition-colors",
                                  children: [
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-center font-bold text-slate-500", children: idx + 1 }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold text-slate-900", children: item.nama_p4s }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-semibold text-slate-800", children: item.pengelola || "-" }),
                                    (0, T.jsxs)("td", { className: "p-3 border-r border-slate-200", children: [(0, T.jsx)("span", { className: "font-semibold text-slate-800", children: item.desa || "-" }), ", ", item.kecamatan] }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-700", children: item.bidang_kejuruan || "-" }),
                                    (0, T.jsx)("td", {
                                      className: "p-3 border-r border-slate-200",
                                      children: (0, T.jsx)("span", {
                                        className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase",
                                        children: item.klasifikasi_akreditasi || "Terdaftar"
                                      })
                                    }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200", children: item.no_register_bppsdmp ? (0, T.jsx)("span", { className: "font-semibold text-[11px] tabular-nums tracking-tight bg-slate-100/90 text-slate-800 px-2 py-0.5 rounded border border-slate-200/80", children: item.no_register_bppsdmp }) : "-" }),
                                    (0, T.jsx)("td", { className: "p-3 text-slate-600", children: item.kontak || "-" })
                                  ]
                                }, item.id || idx)
                              ))
                            )
                          })
                        ]
                      })
                    })
                  ]
                }),

                // Bagian UPJA
                (filterJenis === "Semua" || filterJenis === "UPJA") && (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "p-4 border-b border-slate-200 bg-amber-50/60 flex flex-wrap justify-between items-center gap-2",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h4", { className: "text-sm font-bold text-amber-950 uppercase tracking-wide", children: "UPJA — Usaha Pelayanan Jasa Alsintan" }),
                            (0, T.jsx)("p", { className: "text-xs text-amber-800 mt-0.5", children: "Lembaga pengelolaan dan sewa alsintan (traktor, combine, transplanter, pompa) per kecamatan." })
                          ]
                        }),
                        (0, T.jsxs)("span", { className: "text-xs font-bold text-amber-900 px-2.5 py-1 bg-amber-100/90 rounded-md shadow-2xs", children: [filteredUpja.length, " Unit UPJA Terdaftar"] })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "overflow-x-auto max-h-[460px] custom-scrollbar",
                      children: (0, T.jsxs)("table", {
                        className: "w-full text-left text-xs border-collapse",
                        children: [
                          (0, T.jsx)("thead", {
                            className: "bg-slate-100/90 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-600 sticky top-0 z-10 backdrop-blur-xs",
                            children: (0, T.jsxs)("tr", {
                              children: [
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-center w-12", children: "No" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 min-w-[180px]", children: "Nama UPJA" }),
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
                            children: filteredUpja.length === 0 ? (
                              (0, T.jsx)("tr", {
                                children: (0, T.jsx)("td", { colSpan: 8, className: "p-6 text-center text-slate-400 font-medium", children: "Belum ada data UPJA yang cocok dengan filter pencarian." })
                              })
                            ) : (
                              filteredUpja.map((item, idx) => (
                                (0, T.jsxs)("tr", {
                                  className: "hover:bg-slate-50 transition-colors",
                                  children: [
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-center font-bold text-slate-500", children: idx + 1 }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold text-slate-900", children: item.nama_upja }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-semibold text-slate-800", children: item.manajer || "-" }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-600", children: item.gapoktan_induk || "-" }),
                                    (0, T.jsxs)("td", { className: "p-3 border-r border-slate-200", children: [(0, T.jsx)("span", { className: "font-semibold text-slate-800", children: item.desa || "-" }), ", ", item.kecamatan] }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-700", children: item.jenis_alsintan_dikelola || "-" }),
                                    (0, T.jsxs)("td", { className: "p-3 border-r border-slate-200 text-right font-bold tabular-nums text-slate-900", children: [$(item.jumlah_alsintan), " unit"] }),
                                    (0, T.jsx)("td", {
                                      className: "p-3 text-center",
                                      children: (0, T.jsx)("span", {
                                        className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                          item.status_operasional === "Aktif Beroperasi" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"
                                        }`,
                                        children: item.status_operasional || "Aktif"
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
            // TAB 4: JURU SEMBELIH HALAL (JULEHA)
            // =========================================================================
            activeTab === "juleha" && (0, T.jsxs)("div", {
              className: "flex flex-col gap-6",
              children: [


                // KPI Ringkasan Kartu JULEHA
                (0, T.jsxs)("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-purple-900 uppercase tracking-wide", children: "Total JULEHA Terdaftar" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-purple-50 text-purple-700", children: (0, T.jsx)(usersIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [filteredJuleha.length, " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "personel" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Juru sembelih halal Kabupaten Banjarnegara" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-emerald-800 uppercase tracking-wide", children: "Tersertifikasi Kompetensi" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-emerald-50 text-emerald-700", children: (0, T.jsx)(shieldCheckIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [filteredJuleha.filter(x => (x.status_sertifikasi || "").toLowerCase().includes("tersertifikasi")).length, " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "orang" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Sertifikasi resmi BNSP / BPJPH / MUI" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-blue-800 uppercase tracking-wide", children: "Unit Tugas RPH & RPU" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-blue-50 text-blue-700", children: (0, T.jsx)(awardIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [new Set(filteredJuleha.map(x => x.unit_tugas).filter(Boolean)).size, " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "lokasi" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "RPH ruminansia & RPU unggas daerah" })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-slate-600 uppercase tracking-wide", children: "Cakupan Domisili" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-slate-50 text-slate-700", children: (0, T.jsx)(mapPinIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [new Set(filteredJuleha.map(x => x.kecamatan).filter(Boolean)).size, " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "kecamatan" })] }),
                        (0, T.jsx)("p", { className: "text-[11px] text-slate-500 mt-1.5", children: "Sebaran domisili tenaga potong halal" })
                      ]
                    })
                  ]
                }),

                // Tabel JULEHA
                (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "p-4 border-b border-slate-200 bg-purple-50/60 flex flex-wrap justify-between items-center gap-2",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsx)("h4", { className: "text-sm font-bold text-purple-950 uppercase tracking-wide", children: "Register Juru Sembelih Halal (JULEHA) Tersertifikasi" }),
                            (0, T.jsx)("p", { className: "text-xs text-purple-800 mt-0.5", children: "Petugas potong hewan tersertifikasi kompetensi halal (BNSP / BPJPH / MUI) pada RPH dan RPU Kabupaten Banjarnegara." })
                          ]
                        }),
                        (0, T.jsxs)("span", { className: "text-xs font-bold text-purple-900 px-2.5 py-1 bg-purple-100/90 rounded-md shadow-2xs", children: [filteredJuleha.length, " Personel Terdaftar"] })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "overflow-x-auto max-h-[520px] custom-scrollbar",
                      children: (0, T.jsxs)("table", {
                        className: "w-full text-left text-xs border-collapse",
                        children: [
                          (0, T.jsx)("thead", {
                            className: "bg-slate-100/90 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-600 sticky top-0 z-10 backdrop-blur-xs",
                            children: (0, T.jsxs)("tr", {
                              children: [
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-center w-12", children: "No" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 min-w-[180px]", children: "Nama Juru Sembelih" }),
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
                            children: filteredJuleha.length === 0 ? (
                              (0, T.jsx)("tr", {
                                children: (0, T.jsx)("td", { colSpan: 8, className: "p-6 text-center text-slate-400 font-medium", children: "Belum ada data JULEHA yang cocok dengan filter pencarian." })
                              })
                            ) : (
                              filteredJuleha.map((item, idx) => (
                                (0, T.jsxs)("tr", {
                                  className: "hover:bg-slate-50 transition-colors",
                                  children: [
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-center font-bold text-slate-500", children: idx + 1 }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold text-slate-900", children: item.nama_lengkap }),
                                    (0, T.jsxs)("td", { className: "p-3 border-r border-slate-200", children: [(0, T.jsx)("span", { className: "font-semibold text-slate-800", children: item.desa || "-" }), ", ", item.kecamatan] }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-semibold text-slate-800", children: item.unit_tugas || "-" }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200", children: item.no_sertifikat_halal ? (0, T.jsx)("span", { className: "font-semibold text-[11px] tabular-nums tracking-tight bg-purple-50 text-purple-900 border border-purple-200/80 px-2 py-0.5 rounded", children: item.no_sertifikat_halal }) : "-" }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-slate-600", children: item.lembaga_penerbit || "-" }),
                                    (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-center font-semibold tabular-nums text-slate-800", children: item.tahun_kelulusan || "-" }),
                                    (0, T.jsx)("td", {
                                      className: "p-3 text-center",
                                      children: (0, T.jsx)("span", {
                                        className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                          item.status_sertifikasi === "Tersertifikasi" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                                          item.status_sertifikasi === "Dalam Pelatihan" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                                          "bg-rose-50 text-rose-800 border border-rose-200"
                                        }`,
                                        children: item.status_sertifikasi || "Tersertifikasi"
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
            // TAB 5: REKAP DESA & STATISTIK EKSISTING
            // =========================================================================
            activeTab === "rekap" && (0, T.jsxs)(T.Fragment, {
              children: [
                (0, T.jsxs)("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-amber-800 uppercase tracking-wide", children: "Kelompok Tani (Poktan)" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-amber-50 text-amber-700", children: (0, T.jsx)(wheatIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [$(J.kelompokTani), " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "unit" })] }),
                        (0, T.jsxs)("p", { className: "text-[11px] font-semibold text-amber-700 mt-1.5", children: [$(J.anggotaTani), " anggota terdaftar"] })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-blue-800 uppercase tracking-wide", children: "Kelompok Perikanan (Pokkan)" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-blue-50 text-blue-700", children: (0, T.jsx)(fishIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [$(J.kelompokPerikanan), " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "unit" })] }),
                        (0, T.jsxs)("p", { className: "text-[11px] font-semibold text-blue-700 mt-1.5", children: [$(J.anggotaPerikanan), " anggota terdaftar"] })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-emerald-800 uppercase tracking-wide", children: "Gabungan Poktan (Gapoktan)" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-emerald-50 text-emerald-700", children: (0, T.jsx)(fileCheckIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [$(J.gapoktan), " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "gabungan" })] }),
                        (0, T.jsxs)("p", { className: "text-[11px] font-semibold text-emerald-700 mt-1.5", children: [$(J.anggotaGapoktan), " pengurus/anggota"] })
                      ]
                    }),
                    (0, T.jsxs)("div", {
                      className: "bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all",
                      children: [
                        (0, T.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            (0, T.jsx)("span", { className: "text-[11px] font-bold text-teal-800 uppercase tracking-wide", children: "Kelompok Tani Hutan (KTH)" }),
                            (0, T.jsx)("span", { className: "p-1.5 rounded-lg bg-teal-50 text-teal-700", children: (0, T.jsx)(leafIcon, { className: "h-4 w-4" }) })
                          ]
                        }),
                        (0, T.jsxs)("h4", { className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums", children: [$(X.kelompok), " ", (0, T.jsx)("span", { className: "text-xs font-medium text-slate-500", children: "unit" })] }),
                        (0, T.jsxs)("p", { className: "text-[11px] font-semibold text-teal-700 mt-1.5", children: [X.desa, " desa · ", X.pemula, "p / ", X.madya, "m / ", X.utama, "u"] })
                      ]
                    })
                  ]
                }),

                Z.desa > 0 && (0, T.jsxs)("div", {
                  className: "bg-slate-50 border border-slate-200 p-4 text-left flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl text-xs",
                  children: [
                    (0, T.jsx)("span", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-500", children: "Konteks BPS · Sensus Pertanian 2023" }),
                    (0, T.jsx)("span", { className: "font-bold text-slate-800", children: N === "Semua" ? "Kabupaten Banjarnegara (20 kec)" : `Kec. ${N}` }),
                    (0, T.jsxs)("span", { className: "text-slate-600", children: [(0, T.jsx)("b", { className: "text-slate-900 tabular-nums", children: $(Z.petani) }), " petani (orang)"] }),
                    (0, T.jsxs)("span", { className: "text-slate-600", children: [(0, T.jsx)("b", { className: "text-slate-900 tabular-nums", children: $(Z.rtAnggotaKelompok) }), " RTUP anggota kelompok tani/peternak/nelayan"] }),
                    (0, T.jsxs)("span", { className: "text-slate-600", children: [(0, T.jsx)("b", { className: "text-slate-900 tabular-nums", children: $(Z.rtup) }), " RTUP total"] }),
                    (0, T.jsxs)("span", { className: "text-[11px] text-slate-500 ml-auto font-medium", children: [Z.desa, " desa/kelurahan"] })
                  ]
                }),

                // Grafik Garis Tren Keanggotaan
                (0, T.jsxs)("div", {
                  className: "bg-white border border-slate-200 p-6 shadow-xs rounded-xl text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "mb-4 text-left border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2",
                      children: [
                        (0, T.jsxs)("h4", {
                          className: "text-base font-bold text-slate-800 flex items-center gap-2 tracking-tight",
                          children: [
                            (0, T.jsx)(wheatIcon, { className: "text-emerald-700 h-4 w-4" }),
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
                          className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md text-[10px] font-bold text-amber-800 uppercase tracking-wider",
                          children: [(0, T.jsx)(n, { className: "h-3 w-3" }), " 2026: Prediksi Regresi Linier"]
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
                            (0, T.jsx)(_, { strokeDasharray: "3 3", stroke: "#e2e8f0", vertical: false }),
                            (0, T.jsx)(h, { dataKey: "tahun", tick: { fill: "#475569", fontSize: 11, fontWeight: 500 }, axisLine: { stroke: "#cbd5e1", strokeWidth: 1 }, tickLine: { stroke: "#cbd5e1" } }),
                            (0, T.jsx)(b, { tick: { fill: "#475569", fontSize: 10, fontWeight: 500 }, axisLine: { stroke: "#cbd5e1", strokeWidth: 1 }, tickLine: { stroke: "#cbd5e1" }, tickFormatter: e => $(e) }),
                            (0, T.jsx)(m, { contentStyle: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "12px", fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }, formatter: (e, t, n) => { let r = n?.payload?.isPrediction ? `${t} (Prediksi)` : t; return [$(Number(e)), r]; }, labelFormatter: (e, t) => t?.[0]?.payload?.isPrediction ? `${e} (Prediksi)` : e }),
                            (0, T.jsx)(x, { verticalAlign: "top", height: 36, wrapperStyle: { fontSize: "11px", fontWeight: 500 } }),
                            (0, T.jsx)(S, { x: "2026", stroke: "#f59e0b", strokeDasharray: "5 5", strokeOpacity: 0.5, label: { value: "Prediksi", position: "top", fill: "#d97706", fontSize: 10, fontWeight: 600 } }),
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
                  className: "bg-white border border-slate-200 p-6 shadow-xs rounded-xl text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "flex flex-col mb-4 border-b border-slate-200 pb-3 text-left",
                      children: [
                        (0, T.jsxs)("h4", { className: "text-base font-bold text-slate-800 flex items-center gap-2 tracking-tight", children: [(0, T.jsx)(r, { className: "text-emerald-700 h-4 w-4" }), `Sebaran Unit Kelembagaan per Kecamatan (`, j, `)`] }),
                        (0, T.jsx)("p", { className: "text-xs text-slate-500 mt-0.5", children: "Kontribusi unit Poktan, Pokkan, dan Gapoktan per wilayah administratif" })
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
                            (0, T.jsx)(_, { strokeDasharray: "3 3", stroke: "#e2e8f0", vertical: false }),
                            (0, T.jsx)(h, { dataKey: "name", tick: { fill: "#475569", fontSize: 10, fontWeight: 500 }, axisLine: { stroke: "#cbd5e1", strokeWidth: 1 }, tickLine: { stroke: "#cbd5e1" }, interval: 0, angle: -45, textAnchor: "end", height: 70 }),
                            (0, T.jsx)(b, { width: 70, tick: { fill: "#475569", fontSize: 10, fontWeight: 500 }, axisLine: { stroke: "#cbd5e1", strokeWidth: 1 }, tickLine: { stroke: "#cbd5e1" } }),
                            (0, T.jsx)(m, { contentStyle: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "12px", fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" } }),
                            (0, T.jsx)(x, { verticalAlign: "top", height: 36, wrapperStyle: { fontSize: "11px", fontWeight: 500 } }),
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
                  className: "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs text-left",
                  children: [
                    (0, T.jsxs)("div", {
                      className: "p-4 border-b border-slate-200 flex justify-between items-center flex-wrap gap-2 bg-slate-50/70",
                      children: [
                        (0, T.jsxs)("div", {
                          children: [
                            (0, T.jsxs)("h4", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: [`Tabel Rincian Poktan, Gapoktan & KTH (`, j, `)`] }),
                            (0, T.jsx)("p", { className: "text-xs text-slate-500 mt-0.5", children: "Detail sebaran desa/kelurahan, poktan, pokkan, gapoktan, dan kelompok tani hutan di Kabupaten Banjarnegara" })
                          ]
                        }),
                        q.length === 0 && (0, T.jsxs)("div", {
                          className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-slate-200 text-xs font-semibold text-rose-800 rounded-lg",
                          children: [
                            (0, T.jsx)(a, { className: "h-3.5 w-3.5 shrink-0" }),
                            (0, T.jsx)("span", { children: N === "Semua" ? `Data kelembagaan Dinas untuk tahun ${j} belum tersedia.` : `Data kelembagaan Dinas belum tersedia untuk Kec. ${N} — lihat konteks BPS ST2023 di atas.` })
                          ]
                        }),
                        ne && (0, T.jsxs)("div", {
                          className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 rounded-lg",
                          children: [
                            (0, T.jsx)(a, { className: "h-3.5 w-3.5 shrink-0" }),
                            (0, T.jsxs)("span", { children: [`Semua nilai Kec. `, N, ` tercatat nol pada snapshot Dinas (belum terisi) — ST2023 BPS: `, $(Z.petani), ` petani.`] })
                          ]
                        })
                      ]
                    }),
                    (0, T.jsx)("div", {
                      className: "overflow-x-auto max-h-[500px] custom-scrollbar",
                      children: (0, T.jsxs)("table", {
                        className: "w-full text-left text-xs border-collapse",
                        children: [
                          (0, T.jsx)("thead", {
                            className: "bg-slate-100/90 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-600 sticky top-0 z-10 backdrop-blur-xs",
                            children: (0, T.jsxs)("tr", {
                              children: [
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-center w-12", children: "No" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 min-w-[140px]", children: "Desa/Kelurahan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200", children: "Kecamatan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-right", children: "Poktan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-right", children: "Anggota Poktan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-right", children: "Pokkan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-right", children: "Anggota Pokkan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-right", children: "Gapoktan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-right", children: "Anggota Gapoktan" }),
                                (0, T.jsx)("th", { className: "p-3 border-r border-slate-200 text-right", children: "KTH ('26)" }),
                                (0, T.jsx)("th", { className: "p-3", children: "Detail KTH" })
                              ]
                            })
                          }),
                          (0, T.jsx)("tbody", {
                            className: "divide-y divide-slate-100",
                            children: q.map((e, t) => (
                              (0, T.jsxs)("tr", {
                                className: "hover:bg-slate-50 transition-colors",
                                children: [
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-center font-bold text-slate-500", children: t + 1 }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-bold uppercase text-slate-800", children: e.desa }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 font-medium uppercase text-slate-700", children: V(e.kecamatan) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right tabular-nums", children: $(e.kelompokTani) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right text-amber-700 font-bold tabular-nums", children: $(e.anggotaTani) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right tabular-nums", children: $(e.kelompokPerikanan) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right text-blue-700 font-bold tabular-nums", children: $(e.anggotaPerikanan) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right tabular-nums", children: $(e.gapoktan) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right text-emerald-700 font-bold tabular-nums", children: $(e.anggotaGapoktan) }),
                                  (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right text-teal-700 font-bold tabular-nums", children: $(e.kelompokTaniHutan || 0) }),
                                  (0, T.jsxs)("td", {
                                    className: "p-3 text-[11px] text-slate-600 min-w-[200px]",
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
                            className: "border-t-2 border-slate-300 bg-slate-50 font-bold sticky bottom-0 text-slate-800",
                            children: (0, T.jsxs)("tr", {
                              children: [
                                (0, T.jsxs)("td", { className: "p-3 border-r border-slate-200 uppercase", colSpan: 3, children: [`TOTAL `, N === "Semua" ? "KABUPATEN" : `KEC. ${N.toUpperCase()}`, ` (`, q.length, ` desa)`] }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right tabular-nums", children: $(J.kelompokTani) }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right text-amber-700 tabular-nums", children: $(J.anggotaTani) }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right tabular-nums", children: $(J.kelompokPerikanan) }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right text-blue-700 tabular-nums", children: $(J.anggotaPerikanan) }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right tabular-nums", children: $(J.gapoktan) }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right text-emerald-700 tabular-nums", children: $(J.anggotaGapoktan) }),
                                (0, T.jsx)("td", { className: "p-3 border-r border-slate-200 text-right text-teal-700 tabular-nums", children: $(J.kelompokTaniHutan) }),
                                (0, T.jsx)("td", { className: "p-3 text-[10px] text-slate-500", children: "Snapshot SIMLUH 2026" })
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
          className: "text-[11px] text-slate-400 leading-relaxed text-left",
          children: "Sumber: Data Kelembagaan Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara; Sistem Informasi Penyuluhan Pertanian (SIMLUHTAN Kementan); Kartu Pelaku Usaha Kelautan dan Perikanan (KUSUKA KKP); serta Badan Penyelenggara Jaminan Produk Halal (BPJPH/BNSP)."
        })
      ]
    })
  });
}

export { FarmersPage as default };