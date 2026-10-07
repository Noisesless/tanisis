# -*- coding: utf-8 -*-
"""
Skrip Rekonstruksi Penuh Halaman Direktori Kelembagaan SISPERTANI
- Membaca basis bersih dari dist/assets/farmers-RBAkXoyn.js.clean_bak
- Menggantikan tombol tab lama dengan Sistem 3 Klaster + Sub-Tab
- Menambahkan state, fetch, filter, dan render tabel untuk KEP, Posluhdes, PPS, dan Rekapitulasi SK Kadistan
"""

with open("dist/assets/farmers-RBAkXoyn.js.clean_bak", "r", encoding="utf-8") as f:
    code = f.read()

# ---------------------------------------------------------------------------
# 1. TAMBAHKAN STATE BARU
# ---------------------------------------------------------------------------
old_state = 'let [dataPertanian, setDataPertanian] = (0, w.useState)([]);'
new_state = '''let [activeKlaster, setActiveKlaster] = (0, w.useState)("tani");
  let [dataPertanian, setDataPertanian] = (0, w.useState)([]);
  let [dataKep, setDataKep] = (0, w.useState)([]);
  let [dataPosluhdes, setDataPosluhdes] = (0, w.useState)([]);
  let [dataPps, setDataPps] = (0, w.useState)([]);
  let [dataRekapValidasi, setDataRekapValidasi] = (0, w.useState)([]);'''

assert old_state in code, "old_state not found"
code = code.replace(old_state, new_state, 1)
print("Step 1: State berhasil ditambahkan.")

# ---------------------------------------------------------------------------
# 2. PERBARUI fetchEntities
# ---------------------------------------------------------------------------
old_fetch = '''      let [resPert, resIkan, resJuleha, resP4s, resUpja] = await Promise.all([
        fetch("/sispertani-api/v1/kelembagaan/pertanian").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/perikanan").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/juleha").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/p4s").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/sispertani-api/v1/kelembagaan/upja").then(r => r.json()).catch(() => ({ data: [] }))
      ]);
      setDataPertanian(resPert.data || resPert.rows || []);
      setDataPerikanan(resIkan.data || resIkan.rows || []);
      setDataJuleha(resJuleha.data || resJuleha.rows || []);
      setDataP4s(resP4s.data || resP4s.rows || []);
      setDataUpja(resUpja.data || resUpja.rows || []);'''

new_fetch = '''      let [resPert, resIkan, resJuleha, resP4s, resUpja, resKep, resPosluh, resPps, resRekap] = await Promise.all([
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
      setDataRekapValidasi(resRekap.data || resRekap.rows || []);'''

assert old_fetch in code, "old_fetch not found"
code = code.replace(old_fetch, new_fetch, 1)
print("Step 2: fetchEntities berhasil diperbarui.")

# ---------------------------------------------------------------------------
# 3. FILTERING & PAGINATION HOOKS
# ---------------------------------------------------------------------------
old_filter_anchor = 'let filteredPertanian = (0, w.useMemo)(() => {'
new_filters = '''let filteredKep = (0, w.useMemo)(() => {
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

  ''' + old_filter_anchor

assert old_filter_anchor in code, "old_filter_anchor not found"
code = code.replace(old_filter_anchor, new_filters, 1)
print("Step 3: Filter hooks berhasil ditambahkan.")

# ---------------------------------------------------------------------------
# 4. PAGINASI DINAMIS UNIVERSAL
# ---------------------------------------------------------------------------
old_pagination = '''  let totalPages = Math.max(1, Math.ceil(filteredPertanian.length / pageSize));
  let startIndex = (currentPage - 1) * pageSize;
  let paginatedPertanian = (0, w.useMemo)(() => {
    return filteredPertanian.slice(startIndex, startIndex + pageSize);
  }, [filteredPertanian, startIndex, pageSize]);'''

new_pagination = '''  let currentActiveTotal = (0, w.useMemo)(() => {
    if (activeTab === "pertanian") return filteredPertanian.length;
    if (activeTab === "rekap_validasi") return filteredRekapValidasi.length;
    if (activeTab === "kep") return filteredKep.length;
    if (activeTab === "posluhdes") return filteredPosluhdes.length;
    if (activeTab === "pps") return filteredPps.length;
    if (activeTab === "perikanan") return filteredPerikanan.length;
    if (activeTab === "pendukung") return filteredPendukung.length;
    if (activeTab === "juleha") return filteredJuleha.length;
    return filteredPertanian.length;
  }, [activeTab, filteredPertanian, filteredRekapValidasi, filteredKep, filteredPosluhdes, filteredPps, filteredPerikanan, filteredPendukung, filteredJuleha]);

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
  }, [filteredRekapValidasi, startIndex, pageSize]);'''

assert old_pagination in code, "old_pagination not found"
code = code.replace(old_pagination, new_pagination, 1)
print("Step 4: Paginasi dinamis universal berhasil diterapkan.")

# ---------------------------------------------------------------------------
# 5. GANTI TOMBOL TAB LAMA DENGAN SISTEM 3 KLASTER + SUB-TAB
# ---------------------------------------------------------------------------
idx_anchor = code.find('setActiveTab("pertanian")')
idx_tab_start = code.rfind('(0, T.jsxs)("div", {', 0, idx_anchor)
idx_filter_bar = code.find('// Filter Controls Bar (12-Kolom Responsive Grid)', idx_anchor)
idx_tab_end = code.rfind('}),', idx_anchor, idx_filter_bar) + 3

old_tabs_chunk = code[idx_tab_start:idx_tab_end]
print(f"Old tabs chunk len: {len(old_tabs_chunk)}")
assert len(old_tabs_chunk) > 5000, "Old tabs chunk extracted incorrectly!"

new_tabs_chunk = '''(0, T.jsxs)("div", {
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
                        (0, T.jsx)("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full font-bold border", children: filteredPendukung.length })
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
        })'''

code = code[:idx_tab_start] + new_tabs_chunk + code[idx_tab_end:]
print("Step 5: Tombol navigasi 3 klaster berhasil dipasang.")

# ---------------------------------------------------------------------------
# 6. TAMBAHKAN FILTER BENTUK KEP DI FILTER BAR
# ---------------------------------------------------------------------------
old_filter_perikanan_anchor = '// Filter Jenis Lembaga (Khusus Tab Perikanan)'
new_filter_kep = '''// Filter Bentuk Usaha (Khusus Tab KEP)
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

                ''' + old_filter_perikanan_anchor

assert old_filter_perikanan_anchor in code, "old_filter_perikanan_anchor not found"
code = code.replace(old_filter_perikanan_anchor, new_filter_kep, 1)
print("Step 6: Filter KEP berhasil ditambahkan ke filter bar.")

# ---------------------------------------------------------------------------
# 7. TAMBAHKAN VIEW TABEL BARU
# ---------------------------------------------------------------------------
old_tab_perikanan_anchor = '// =========================================================================\n            // TAB 2: KELEMBAGAAN PERIKANAN'
if old_tab_perikanan_anchor not in code:
    old_tab_perikanan_anchor = 'activeTab === "perikanan" && (0, T.jsxs)("div", {\n              className: "flex flex-col gap-6",'

new_tables_code = '''// =========================================================================
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

            ''' + old_tab_perikanan_anchor

assert old_tab_perikanan_anchor in code, "old_tab_perikanan_anchor not found"
code = code.replace(old_tab_perikanan_anchor, new_tables_code, 1)
print("Step 7: Render tabel baru berhasil dipasang.")

# ---------------------------------------------------------------------------
# TULIS KE dist/assets/farmers-RBAkXoyn.js
# ---------------------------------------------------------------------------
with open("dist/assets/farmers-RBAkXoyn.js", "w", encoding="utf-8") as f:
    f.write(code)

print("SUKSES: File dist/assets/farmers-RBAkXoyn.js berhasil diperbarui.")
