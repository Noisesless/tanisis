<!-- app-context.md v2.1 — MACHINE-OPTIMIZED CONTEXT SNAPSHOT -->
<!-- Last: 2026-10-05T11:26:00+07:00 | Phase: Clean Release | Build: OK -->

## [APP]
name=SISPERTANI slug=pertanian_main type=web stack=node|express|mysql|vanilla-js
pkg=npm port=5173 url=http://127.0.0.1:5173

## [PALETTE] IMMUTABLE
bg=#ffffff surface=#f8fafc text=#0f172a accent1=#16a34a accent2=#0284c7
font_head=Inter font_body=Inter radius=8px nav=topbar theme=light

## [STATE]
phase=Clean Release done=ALL last=Pembersihan total leftover code, dead assets, arsip zip, file scraper _tmp, dan file analisa usang (206 MB dibebaskan)
build=OK issues=0

## [VISUAL_GATE]
icon_lib=lucide
🔴 SVG mentah→icon_lib | border logo→as-is | hardcode hex→var(--vibe-*)
🔴 font tunggal→2 font | bg:white hardcode→var(--vibe-background)
🔴 spacing acak→8pt grid | campur icon lib→ONE family
🔴 emoji / simbol mentah (🐄, 🌾, ▲, ▼, dll) = FORBIDDEN (Anti-AI-Slop Law) — gunakan Lucide resmi & pill badge
🔴 [Design Read]+Three Dials sebelum halaman baru
🔴 kontras text vs bg ≥ 4.5:1 | baca taste-skill sebelum visual
🔴 scratchpad_dom=FORBIDDEN | browser_gate=STRICT

## [FLOWS]
[API-Health]=GET /api/health→db check→status JSON
[Sektor-Ringkasan]=GET /api/v1/ekonomi/sektor-ringkasan?sektor=&tahun=→komoditas ranking + nilai ekonomi riil (Zero Dummy Data)
[Komoditas-Unggulan]=GET /api/v1/komoditas-unggulan→daftar dinamis per bidang dari MySQL komoditas_unggulan (Zero Dummy Data)
[Komoditas-Per-Kecamatan]=GET /api/v1/komoditas-unggulan/per-kecamatan?tahun=→top per kecamatan dinamis dari tabel produksi
[Nilai-Ekonomi]=GET /api/v1/ekonomi/nilai-ekonomi?bidang=→valuasi riil per bidang dari MySQL nilai_ekonomi_tahunan
[AI-Chat]=POST /api/v1/ai/chat→Rate limit→Dynamic RAG Query (MySQL + CKAN)→Gemini stream proxy→Direct Factual SSE
[Frontend]=GET /→express.static(dist)→SPA fallback index.html

## [PAGES] BUILT
/=SISPERTANI Banjarnegara=public=STABLE
/recommendations=Rekomendasi & Chatbot Si Pertani=public=STABLE
/komoditas-unggulan/:bidang=Komoditas Unggulan Dinamis per Bidang=public=STABLE
/nilai-ekonomi/:bidang=Valuasi Nilai Ekonomi Dinamis per Bidang=public=STABLE
/nilai-ekonomi/peternakan=4 Tab Ekosistem Usaha (Valuasi, UMKM Pakan, Poultry Shop Maps, Usaha Ber-NKV)=public=STABLE
/peternakan/susu-kulit=Produksi Utama & Hasil Ikutan per Spesies + Simulasi Lahan HPT=public=STABLE
/peternakan/populasi=Populasi Ternak Murni + Domba Batur + Ternak Dijual Hidup=public=STABLE
/ltt-katam=LTT & Kalender Tanam (Pangan)=public=STABLE

## [SCHEMA]
pertasis(bantuan,ekonomi,hortikultura,kelembagaan,lahan,padi,palawija,perikanan,ikan_produksi_jenis,perkebunan,peternakan,st2023,komoditas_unggulan,nilai_ekonomi_tahunan,kwt_kelompok_wanita_tani,ltt_katam)

## [ADR]
[ADR-001] Express static + API dual mount: /api dan /sispertani-api dilayani oleh single server di port 5173
[ADR-002] Zero Dummy Data Law: komoditas/tahun tanpa data mengembalikan status empty tanpa mock array
[ADR-003] Sector Economic Widget: Komoditas utama & nilai ekonomi terpadu per sektor dinamis 100% dari MySQL/OpenData
[ADR-004] Dual Submenus Per Sektor: Setiap bidang memiliki 2 submenu mandiri di sidebar
[ADR-005] AI Gateway Security & Dynamic RAG: API key murni di .env, RAG mengambil live data MySQL pertasis & CKAN OpenData secara dinamis di dev dan production, tanpa template penolakan generik
[ADR-006] Zero Dummy Fish Species: Menghapus data sintetis jenis ikan di komoditas_unggulan & nilai_ekonomi_tahunan karena pendataan resmi Distankan KP hanya mencatat metode budidaya & alat tangkap
[ADR-007] Development View Architecture: Menggunakan build development rapi dengan Avatar Dropdown menu (default-CAKe9ffW.js), header ringkas 72px, 86 bundle aktif, serta pemindahan submenu LTT & Kalender Tanam ke Tanaman Pangan.
[ADR-008] Strict Zero-Empty Filter: Kategori, alat, atau kecamatan dengan data 0/kosong disembunyikan otomatis; modul Ikan Hias menampilkan status jujur menunggu upload data dinas tanpa angka tiruan.
[ADR-009] Single Source of Truth for Flagship Commodities (Anti-Over-Engineering Law): Komoditas Unggulan BUKAN form upload terpisah untuk klien/dinas, melainkan HASIL KALKULASI OTOMATIS aplikasi dari data produksi mentah (padi, palawija, horti, kebun, ternak, 10 jenis ikan). Form upload komoditas-unggulan di Admin resmi dihapus untuk mengeliminasi redundansi beban kerja dinas, risiko data ganda, dan inkonsistensi.
[ADR-010] Pragmatic Regional Scope & Sparse Data Tolerance: Lingkup data dibatasi pragmatis pada tingkat perkecamatan dan rekapitulasi kabupaten (anti-over-engineering). Data kosong/belum diunggah dinas ditampilkan jujur sebagai empty state tanpa angka fiktif.
[ADR-011] Production-Ready Reactive Session Sync & Header Avatar: Token dan sesi auth admin disimpan secara dual (localStorage & sessionStorage) dengan broadcast event 'sispertani:auth-change'. Layout master publik (default-CAKe9ffW.js) secara reaktif merender profil admin yang sedang login (nama bidang, role, status online sesi aktif, tombol dasbor admin, dan tombol logout instan), serta fallback aman ke Guest/Pengunjung saat belum login.
[ADR-012] Species-Centric Livestock Refactoring & Professional Clean UI:
- Pemisahan tegas data Populasi vs Produksi (menghilangkan tabel telur dari halaman populasi).
- Submenu Susu & Kulit diubah menjadi Produksi Utama & Hasil Ikutan (daging, telur, susu, kulit, tulang, tanduk, pupuk kandang, dan wol) yang dipilah per jenis hewan.
- Rumpun asli khas Domba Batur Banjarnegara (SK Mentan No. 2916/2011) disiapkan modular terpisah dari Domba Biasa/Lokal.
- Modul Agrostologi Simulasi Penambahan Lahan HPT (Hijauan Pakan Ternak) dengan kalkulasi otomatis kapasitas Satuan Ternak (ST), sapi potong, dan Domba Batur.
- Submenu Nilai Ekonomi Peternakan (/nilai-ekonomi/peternakan) dikhususkan pada 4 tab mandiri: Valuasi Nilai Ekonomi Peternakan, Direktori UMKM Pakan Ternak Mandiri, Sebaran Toko Peternakan/Poultry Shop (Maps), dan Registrasi Unit Usaha Ber-NKV (Nomor Kontrol Veteriner).
- Anti-AI-Slop Law: Pembersihan menyeluruh terhadap seluruh emoji mentah dan simbol tiruan di seluruh tampilan antarmuka sistem.

## [CREDS] DEV
admin=admin=C9145qbSjR
mysql=root=

## [NEXT]
[x] Pembersihan total leftover code, dead assets, dan scraper _tmp (206 MB dibebaskan)
[x] Refaktorisasi Perikanan Pragmatis: 10 jenis ikan riil (2020-2025), alat tangkap Bubu, placeholder benih & ikan hias
[x] Perbaikan sistem session dan dynamic avatar publik (cross-tab sync, dual-storage, reaktif logout)
[x] Refaktorisasi Bidang Peternakan & Keswan (Populasi Murni, Produksi per Spesies, Simulasi HPT, 4 Tab Nilai Ekonomi)
[x] Pembersihan total emoji mentah dan simbol AI-slop dari antarmuka
[x] Sinkronisasi dokumentasi utama (.docs & app-context.md)
[/] Push commit ke GitHub remote repository (https://github.com/Noisesless/tanisis)




