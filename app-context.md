<!-- app-context.md v2.0 — MACHINE-OPTIMIZED CONTEXT SNAPSHOT -->
<!-- Last: 2026-09-30T15:28:00+07:00 | Phase: 2/2 | Build: OK -->

## [APP]
name=SISPERTANI slug=pertanian_main type=web stack=node|express|mysql|vanilla-js
pkg=npm port=5173 url=http://127.0.0.1:5173

## [PALETTE] IMMUTABLE
bg=#ffffff surface=#f8fafc text=#0f172a accent1=#16a34a accent2=#0284c7
font_head=Inter font_body=Inter radius=8px nav=topbar theme=light

## [STATE]
phase=2 done=2/2 last=Pembersihan total 1.885 berkas duplikat usang di dist/assets (hanya tersisa 86 berkas aktif bersih), sinkronisasi normalisasi avatar header ke origin main
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
[AI-Chat]=POST /api/v1/ai/chat→Rate limit→Dynamic RAG Query (MySQL + CKAN)→Gemini stream proxy→Direct Factual SSE
[Frontend]=GET /→express.static(dist)→SPA fallback index.html

## [PAGES] BUILT
/=SISPERTANI Banjarnegara=public=STABLE
/recommendations=Rekomendasi & Chatbot Si Pertani=public=STABLE
/komoditas-unggulan/:bidang=Komoditas Unggulan Dinamis per Bidang=public=STABLE
/nilai-ekonomi/:bidang=Valuasi Nilai Ekonomi Dinamis per Bidang=public=STABLE

## [SCHEMA]
pertasis(bantuan,ekonomi,hortikultura,kelembagaan,lahan,padi,palawija,perikanan,perkebunan,peternakan,st2023,komoditas_unggulan,nilai_ekonomi_tahunan)

## [ADR]
[ADR-001] Express static + API dual mount: /api dan /sispertani-api dilayani oleh single server di port 5173
[ADR-002] Zero Dummy Data Law: komoditas/tahun tanpa data mengembalikan status empty tanpa mock array
[ADR-003] Sector Economic Widget: Komoditas utama & nilai ekonomi terpadu per sektor dinamis 100% dari MySQL/OpenData
[ADR-004] Dual Submenus Per Sektor: Setiap bidang memiliki 2 submenu mandiri di sidebar
[ADR-005] AI Gateway Security & Dynamic RAG: API key murni di .env, RAG mengambil live data MySQL pertasis & CKAN OpenData secara dinamis di dev dan production, tanpa template penolakan generik
[ADR-006] Zero Dummy Fish Species: Menghapus data sintetis jenis ikan di komoditas_unggulan & nilai_ekonomi_tahunan karena pendataan resmi Distankan KP hanya mencatat metode budidaya & alat tangkap

## [CREDS] DEV
admin=admin=C9145qbSjR
mysql=root=

## [NEXT]
[x] Konfigurasi Gemini API Key aman di backend (.env) dan isolasi dari frontend build
[x] Penanganan error stream & socket termination remote host (Node Readable stream piping)
[x] Implementasi multi-model fallback (gemini-flash-lite-latest, gemini-3.5-flash-lite, dll.) untuk mitigasi 503 high demand
[x] Rate limiter & payload sanitization untuk pencegahan eksploitasi pihak luar
[x] Dynamic Live RAG Engine (Dev & Production) langsung query database pertasis & CKAN OpenData
[x] Eliminasi template penolakan generik chatbot agar menjawab langsung data riil secara lugas
[x] Pembersihan data dummy jenis ikan pada tabel komoditas_unggulan dan nilai_ekonomi_tahunan
[ ] Menunggu arahan dan pengujian lanjutan dari pengguna
