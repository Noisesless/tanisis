<!-- app-context.md v2.0 — MACHINE-OPTIMIZED CONTEXT SNAPSHOT -->
<!-- Last: 2026-09-28T13:55:00+07:00 | Phase: 2/2 | Build: OK -->

## [APP]
name=SISPERTANI slug=pertanian_main type=web stack=node|express|mysql|vanilla-js
pkg=npm port=5173 url=http://127.0.0.1:5173

## [PALETTE] IMMUTABLE
bg=#ffffff surface=#f8fafc text=#0f172a accent1=#16a34a accent2=#0284c7
font_head=Inter font_body=Inter radius=8px nav=topbar theme=light

## [STATE]
phase=2 done=2/2 last=Penambahan 2 submenu dinamis ("Komoditas Unggulan" & "Nilai Ekonomi") di setiap bidang pada sidebar navigasi + endpoint /api/v1/komoditas-unggulan (Zero Dummy Data)
build=OK issues=0

## [VISUAL_GATE]
icon_lib=lucide
🔴 SVG mentah→icon_lib | border logo→as-is | hardcode hex→var(--vibe-*)
🔴 font tunggal→2 font | bg:white hardcode→var(--vibe-background)
🔴 spacing acak→8pt grid | campur icon lib→ONE family
🔴 [Design Read]+Three Dials sebelum halaman baru
🔴 kontras text vs bg ≥ 4.5:1 | baca taste-skill sebelum visual
🔴 scratchpad_dom=FORBIDDEN | browser_gate=STRICT

## [FLOWS]
[API-Health]=GET /api/health→db check→status JSON
[Sektor-Ringkasan]=GET /api/v1/ekonomi/sektor-ringkasan?sektor=&tahun=→komoditas ranking + nilai ekonomi riil (Zero Dummy Data)
[Komoditas-Unggulan]=GET /api/v1/komoditas-unggulan→daftar dinamis per bidang dari MySQL komoditas_unggulan (Zero Dummy Data)
[Nilai-Ekonomi]=GET /api/v1/ekonomi/nilai-ekonomi?bidang=→valuasi riil per bidang dari MySQL nilai_ekonomi_tahunan
[Frontend]=GET /→express.static(dist)→SPA fallback index.html

## [PAGES] BUILT
/=SISPERTANI Banjarnegara=public=STABLE
/komoditas-unggulan/:bidang=Komoditas Unggulan Dinamis per Bidang=public=STABLE
/nilai-ekonomi/:bidang=Valuasi Nilai Ekonomi Dinamis per Bidang=public=STABLE

## [SCHEMA]
pertasis(bantuan,ekonomi,hortikultura,kelembagaan,lahan,padi,palawija,perikanan,perkebunan,peternakan,st2023,komoditas_unggulan,nilai_ekonomi_tahunan)

## [ADR]
[ADR-001] Express static + API dual mount: /api dan /sispertani-api dilayani oleh single server di port 5173
[ADR-002] Zero Dummy Data Law: komoditas/tahun tanpa data mengembalikan status empty tanpa mock array
[ADR-003] Sector Economic Widget: Komoditas utama & nilai ekonomi terpadu per sektor dinamis 100% dari MySQL/OpenData
[ADR-004] Dual Submenus Per Sektor: Setiap bidang memiliki 2 submenu mandiri (Komoditas Unggulan & Nilai Ekonomi) di sidebar

## [CREDS] DEV
admin=admin=C9145qbSjR
mysql=root=

## [NEXT]
[x] Integrasi widget ringkasan dinamis ke 5 halaman sektor (/food-crops, /horticulture, /plantation, /livestock, /fisheries)
[x] Penambahan 2 submenu mandiri di setiap bidang pada navigasi sidebar (/komoditas-unggulan/:bidang & /nilai-ekonomi/:bidang)
[x] Implementasi backend endpoint /api/v1/komoditas-unggulan dengan filter produksi > 0 (Zero Dummy Data)
[x] Sinkronisasi menyeluruh dokumentasi .docs (routes, api-spec, architecture, database, dependency-graph, issues)
[ ] Menunggu arahan dan diskusi lanjutan terkait fitur atau analitik baru dari pengguna
