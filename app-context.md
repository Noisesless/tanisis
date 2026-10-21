<!-- app-context.md v3.9 — MACHINE-OPTIMIZED CONTEXT SNAPSHOT -->
<!-- Last: 2026-10-21T14:10:00+07:00 | Phase: Fase 16 Audit Gap Menyeluruh Frontend-Backend-Database Selesai | Build: OK -->

## [APP]
name=SISPERTANI slug=pertanian_main type=web stack=node|express|mysql|vanilla-js|python
pkg=npm port=5173 url=http://127.0.0.1:5173

## [PALETTE] IMMUTABLE
bg=#ffffff surface=#f8fafc text=#0f172a accent1=#16a34a accent2=#0284c7
font_head=Inter font_body=Inter radius=8px nav=topbar theme=light

## [STATE]
phase=Fase 16: Audit Mendalam Seluruh Aplikasi (Frontend, Backend, Database) & Eliminasi Seluruh Gap Faktual (ADR-080) done=ALL last=Menjalankan pemindaian faktual 73 tabel MySQL pertasis, 29 berkas backend src/, dan 84 bundle frontend dist/assets/; memperbaiki gap kolom SQL LOWER(tanaman) -> LOWER(komoditas) pada palawija_produksi (src/routes/ai.js); menambahkan handler GET /api/v1/ai/chat informatif (mencegah 404); mengintegrasikan endpoint GET /api/v1/kewirausahaan/kwt dengan data riil 232 KWT dan Pokdakan/Poklahsar dari MySQL; serta memvalidasi 67 endpoint frontend dengan tingkat kelulusan 100% OK. next=Pemeliharaan berkala dan deployment
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
[Komoditas-Unggulan]=GET /api/v1/komoditas-unggulan→kalkulasi dinamis real-time multi-sektor dari tabel operasional MySQL (ternak_populasi, ternak_daging, ikan_produksi_jenis, padi, horti, perkebunan) dengan tahun & satuan adaptif (Zero Hardcode, Zero Dummy Law)
[Komoditas-Per-Kecamatan]=GET /api/v1/komoditas-unggulan/per-kecamatan?tahun=→top per kecamatan dinamis dari tabel produksi
[Nilai-Ekonomi]=GET /api/v1/ekonomi/nilai-ekonomi?bidang=→valuasi riil per bidang dari MySQL nilai_ekonomi_tahunan
[Pasar-Titik]=GET /api/v1/ekonomi/pasar-titik?kecamatan=&kategori=→36 pasar fisik terverifikasi Banjarnegara dari MySQL pasar_banjarnegara
[Renstra-Target]=GET /api/v1/renstra/target?periode=&jenis=&sektor=→target indikator resmi 2019–2022 & 2025–2029 dari MySQL renstra_target
[Renstra-Evaluasi]=GET /api/v1/renstra/evaluasi?periode=→matriks perbandingan target vs realisasi Th-1 s/d Th-4 Model A
[Renstra-Pagu]=GET /api/v1/renstra/pagu?periode=→alokasi pagu APBD Murni & Perubahan per program dinas
[AI-Chat]=POST /api/v1/ai/chat→Rate limit→Dynamic RAG Query (MySQL + CKAN + pasar + poultry + renstra)→Gemini stream proxy→Direct Factual SSE
[Readiness-Audit]=GET /api/v1/admin/readiness→audit agregat baris DB 16 domain operasional, latest data year, status publik vs fallback disk/CKAN (Anti-Over-Engineering)
[Sumber-Data-Audit]=GET /api/v1/admin/sumber-data→pemetaan dinamis status asal data (unggahan Distankan KP vs pembanding luar BAPANAS/BPS/Kementan) per domain dan rute publik (ADR-063)
[Frontend]=GET /→express.static(dist)→SPA fallback index.html

## [PAGES] BUILT
/=SISPERTANI Banjarnegara=public=STABLE
/renstra=Perencanaan & Renstra Distankan (5-Segmented Tab Model A)=public=STABLE
/recommendations=Rekomendasi & Chatbot Si Pertani=public=STABLE
/komoditas-unggulan/:bidang=Komoditas Unggulan Dinamis per Bidang=public=STABLE
/nilai-ekonomi/:bidang=Valuasi Nilai Ekonomi Dinamis per Bidang=public=STABLE
/nilai-ekonomi/peternakan=4 Tab Ekosistem Usaha (Valuasi, UMKM Pakan, Poultry Shop Maps, Usaha Ber-NKV)=public=STABLE
/peternakan/susu-kulit=Produksi Utama & Hasil Ikutan per Spesies + Simulasi Lahan HPT=public=STABLE
/peternakan/populasi=Populasi Ternak Murni + Domba Batur + Ternak Dijual Hidup=public=STABLE
/ltt-katam=LTT & Kalender Tanam (Pangan)=public=STABLE

## [SCHEMA]
pertasis(bantuan,ekonomi,pasar_banjarnegara,hortikultura,kelembagaan,kelembagaan_pertanian,lahan,padi,palawija,perikanan,ikan_produksi_jenis,perkebunan,peternakan,ternak_poultry_shop,st2023,komoditas_unggulan,nilai_ekonomi_tahunan,ltt_katam,psat_pduk,harga_pasar_banjarnegara,fsva_desa_indikator,neraca_pangan_komposit,renstra_target,activity_logs,sync_log)

## [ADR]
[ADR-079] Penyempurnaan Chatbot AI Si Pertani RAG dengan Grounding Spasial Pasar & Typo Tolerance:
- Menambahkan modul typo tolerance pada deteksi kueri pasar dan lokasi (`"pasa ikan"`, `"psar"`, `"kios"`, `"bazar"`) serta kueri poultry shop (`"poultry"`, `"pakan ternak"`, `"toko ternak"`, `"sapronak"`).
- Menyuntikkan 36 titik pasar dari tabel `pasar_banjarnegara` dan 15 toko pakan dari `ternak_poultry_shop` ke prompt sistem AI dengan direktif tegas agar AI menyebutkan nama pasar, kecamatan, dan alamat resmi serta dilarang mengklaim titik fisik tidak tercatat.
- Melengkapi generator bahasa alami lokal (`src/lib/ai-nlg.js`) dengan format narasi pasar dan poultry shop untuk ketersediaan offline tanpa ketergantungan koneksi upstream.
[ADR-078] Integrasi Faktual Pasar Tradisional (36 Titik) & Layer Spasial Poultry Shop pada Peta Eksekutif:
- Membuat tabel database `pasar_banjarnegara` (36 titik) yang memigrasikan seluruh entitas dari `dist/data/pasar-banjarnegara.geojson` lengkap dengan nama pasar, kategori spesifik (Pasar Buah, Pasar Hewan, Pasar Ikan, Pasar Unggas, Pasar Tradisional), kecamatan_id, kecamatan, alamat, dan koordinat GPS latitude/longitude.
- Menghadirkan endpoint publik `GET /api/v1/ekonomi/pasar-titik` (?kecamatan= & ?kategori=) untuk melayani data pasar secara langsung dari database tanpa rekaan.
- Memperluas mesin Dynamic RAG AI Si Pertani (`src/routes/ai.js`) dengan deteksi domain pasar (`isPasar`) dan poultry shop (`isPoultry`), memungkinkan chatbot menjawab kueri pasar dan toko peternakan secara faktual langsung dari tabel database `pasar_banjarnegara` dan `ternak_poultry_shop`.
- Menambahkan layer overlay spasial baru "Poultry Shop & Pakan" (`/data/poultry-banjarnegara.geojson`, warna ungu `#7c3aed`) pada Leaflet Map Dashboard Eksekutif (`/` - `pages-BdW-ZTL4.js`), menyajikan titik sebaran toko peternakan terverifikasi secara interaktif berdampingan dengan layer Pasar.
- Penyajian Dynamic GeoJSON Live di `src/server.js`: Rute `/data/poultry-banjarnegara.geojson` dan `/data/pasar-banjarnegara.geojson` meng-generate FeatureCollection secara real-time langsung dari query database MySQL (dengan fallback ke file statis), sehingga setiap data toko atau pasar baru yang diinput ke basis data akan langsung muncul di peta secara instan.
[ADR-077] Implementasi Model A Evaluasi Kinerja Renstra & Pagu Anggaran APBD (Tabel 4.3):
- Menghadirkan sistem 5-Segmented Tab Model A pada antarmuka `/renstra`: [Target], [Realisasi], [Prosentase], [Ringkasan], dan [Pagu Anggaran] dengan sub-filter [Indikator Sasaran] vs [Indikator Program] (Opsi 1A).
- Membangun modul analitik dinamis `src/lib/renstra-evaluasi.js` yang secara matematis menghitung rasio ketercapaian antara target resmi `renstra_target` (87 indikator) dengan data transaksi statistik riil di MySQL `pertasis` (Padi, Palawija, Hortikultura, Peternakan, Perikanan, dan FSVA).
- Menegakkan prinsip Zero Dummy Data Law (ADR-002) dan Sparse Data Tolerance (ADR-010): indikator yang belum memiliki data riil di database atau tahun yang belum berjalan menampilkan tanda tenang "—" (muted dash) tanpa nilai rekaan dan tanpa galat pembagian nol / NaN (Opsi 2A).
- Mengintegrasikan data Pagu Anggaran APBD resmi per Program dan Kegiatan utama dari Tabel 4.3 Renstra 2025–2029 (11 program) dan Bab VI Renstra 2019–2022 (7 program) dengan format rupiah tabular (Opsi 3A).
- Mendaftarkan endpoint publik baru `GET /api/v1/renstra/evaluasi` dan `GET /api/v1/renstra/pagu`, serta memperbarui bundel antarmuka `dist/assets/renstra-v242.js` via `scripts/build_renstra_view.js` dengan verifikasi 100% lolos linting dan bebas error runtime.
[ADR-074] Resolusi Tuntas Peta Choropleth & Deadlock 'Memuat Data Lahan' pada Dashboard Eksekutif:
- Mengidentifikasi akar masalah: `Promise.all([b(), C(), w()])` mengikat data desa dengan upstream CKAN Pemkab (`opendata.banjarnegarakab.go.id`) yang kerap timeout (>10s), menahan state desa pada `[]` dan membuat poligon peta abu-abu serta Top 15 Desa dan Analisa Lahan macet di "Memuat data...".
- Memisahkan pemanggilan data lahan desa `C()` agar berjalan mandiri (46ms) dengan proteksi fallback instan ke `/data/lahan-fallback.json` jika data kosong atau network gagal. Panggilan CKAN dan kabupaten dijalankan independen tanpa memblokir dashboard.
- Memasang validasi anti-empty cache di `api-BxFGoia1.js`: data dengan `Array.isArray(data) && data.length < 50` otomatis dibuang dari `localStorage`, memecah deadlock cache poisoning.
- Menghapus penimbunan 2,63 MB GeoJSON dari `localStorage` (`geojson_desa_cache`) yang melampaui kuota 5 MB browser (QuotaExceededError) dan menyerahkannya ke browser HTTP Cache resmi (`Cache-Control: public, max-age=86400`).
- Menurunkan timeout proksi CKAN di `src/server.js` ke 4s dengan fallback anggun ke snapshot terverifikasi [dist/data/snapshots/ckan-catalog.json](file:///d:/Project/pertanian_main/dist/data/snapshots/ckan-catalog.json) (170 dataset).
[ADR-073] Resolusi Tuntas Minified React Error #321, Reconciler DOM & Pembersihan Teks Lebai Renstra:
- Mengidentifikasi akar masalah Minified React error #321 (Invalid Hook Call): seluruh 76 berkas chunk di `dist/assets/` mengimpor `from "./index-CI1XYnwk.js"`. Pengalihan HTTP 301 ke `index-v241.js` menyebabkan peramban (Chrome/V8) menginstansiasi modul React sekunder sehingga `ReactCurrentDispatcher.current` bernilai null saat `useState` dipanggil.
- Menetapkan `dist/assets/index-CI1XYnwk.js` sebagai berkas modul utama yang disajikan langsung (HTTP 200 OK) dan mengarahkan `<script type="module" src="/assets/index-CI1XYnwk.js">` di `dist/index.html`. Menghapus redirect 301 untuk modul root dari `src/server.js`, menjamin 100% singleton instance React tanpa duplikasi.
- Menghilangkan error sekunder `removeChild: The node to be removed is not a child of this node` yang terjadi saat ErrorBoundary mencoba meng-unmount Suspense fallback di tengah kegagalan render.
- Memperbaiki microcopy 3 kartu KPI Renstra 2025–2029 (menghapus teks aneh "Tahun 2025" / "Target tahun 2025"):
  1. Indikator Sasaran: 9 Indikator (Sasaran kinerja utama dinas)
  2. Indikator Program: 18 Indikator (Target program sektoral dinas)
  3. Periode Perencanaan: 2025–2029 (5 tahun pelaksanaan Renstra)
- Memperjelas subjudul tabel secara dinamis: "Indikator Sasaran (IKU) tahun 2025 sampai 2030" vs "Indikator Program (IKK) tahun 2025 sampai 2030", menghilangkan seluruh kata-kata lebai/slop birokrasi.
[ADR-072] Implementasi Dual-Periode Renstra (2025–2029 & 2019–2022) Anti-Slop & Resolusi Reconciler DOM:
- Menyediakan selektor dropdown periode pada header halaman `/renstra`: `Renstra 2025–2029` dan `Renstra 2019–2022` (membersihkan seluruh label AI slop: "tahun berjalan", "periode berjalan", "arsip historis", serta menghapus kapsul status redundan sesuai COPY_RULES.md).
- Memisahkan tampilan ke dua sub-komponen terisolasi ber-key stabil (`<Renstra2025View key="view-renstra-2025" />` dan `<Renstra2019View key="view-renstra-2019" />`) serta memberikan key unik pada setiap baris tabel; mengatasi bug React reconciler `Failed to execute 'removeChild' on 'Node'` akibat pertukaran anak DOM tanpa key.
- Renstra 2025–2029: Mengintegrasikan 9 Indikator Kinerja Utama (IKU Tabel 4.5) dan 18 Indikator Kinerja Kunci (IKK Tabel 4.7) hasil verifikasi faktual PDF resmi (77 halaman), dilengkapi filter sektoral interaktif.
- Renstra 2019–2022: Mempertahankan evaluasi 4 indikator historis (Padi, Sapi, Domba/Kambing, Perikanan) terhadap realisasi riil kompilasi statistik sektoral 2022.
- Harmonisasi 5-Slot Antarmuka: Kedua periode memiliki struktur identik (Slot 1 Header & Dropdown, Slot 2 Tiga Kartu KPI Border-Left-4, Slot 3 Empat Pilar Sasaran Strategis 01-04, Slot 4 Tabel Indikator Kinerja, Slot 5 Catatan Regulasi & Unduh PDF dinamis: `renstra-2025-2029.pdf` dan `renstra.pdf`).
- Menerapkan bundle chunk baru `dist/assets/renstra-v242.js`, mendaftarkannya pada `index-v241.js`, dan memasang pengalihan otomatis HTTP 301 di `src/server.js`.
[ADR-071] Eliminasi Dead Code, Pembersihan File .bak & Cache-Busting Terisolasi v241:
- Menghapus seluruh berkas backup mentah (`manual-DxZ1PSew.js.bak`, `pages-BdW-ZTL4.js.bak`, `suitability-BoKTpxZD.js.bak`) dari folder publik `dist/assets/`.
- Menghapus 7 berkas bundle chunk usang yang telah disubstitusi (`admin-C9Dakcgq.js`, `fisheries-5_2RapTI.js`, `food-crops-BebUD7KU.js`, `food-security-Dw2-7ErS.js`, `horticulture-CCLLXyU1.js`, `index-CI1XYnwk.js`, `ltt-katam-DHFMKiIG.js`).
- Menerapkan arsitektur bundle versi terisolasi `v241` pada `index.html` dan seluruh dynamic chunk import, sehingga browser klien dipaksa mengunduh versi termutakhir tanpa tertahan di disk cache.
- Menambahkan middleware Anti-Stale Asset Guard di `src/server.js` (HTTP 301 dari URL aset lama ke `v241`), header `max-age=0` pada aset kode, dan mengalihkan rute usang `/ltt` langsung ke `/ltt-katam` (HTTP 302 & SPA router).
[ADR-070] Eliminasi Dummy Data & Desain Bersih Empty State LTT Katam:
- Mengeliminasi 15 baris data contoh fiktif `F=[]`, menghapus banner placeholder kuning, dan menghubungkan endpoint riil `GET /api/v1/ltt-katam`.
- Menghadirkan tampilan Empty State elegan yang lapang dan manusiawi saat data resmi dari dinas belum diunggah ke database.
[ADR-069] Eliminasi Tab Redundan & Optimasi Font Tombol Komoditas Food Crops:
- Menghapus elemen wadah 2-tab navigasi atas (*"Produksi & Luas Panen"* dan *"LTT & Kalender Tanam"*) pada `/food-crops` karena redundan dengan menu navigasi sidebar yang sudah memisahkan kedua tautan tersebut.
- Mengoptimalkan teks label tombol kelompok komoditas menjadi: **`Padi`**, **`Jagung & Umbi`**, dan **`Kacang-kacangan`** dengan ukuran font responsif `text-[11px] xl:text-xs font-semibold` dan atribut `title={w[e].label}` sehingga nama lengkap resmi tetap dapat dibaca saat kursor diarahkan, menghilangkan anomali teks terpotong (*"agung & Umbi-umbia"*).
[ADR-068] Standardisasi Desain Filter Card Perikanan (/fisheries) Seragam dengan Hortikultura:
- Menstandarkan kembali tata letak filter card `/fisheries` ke format baku 4-kolom sejajar (`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-left`) yang identik dengan hortikultura dan tanaman pangan.
- Memberikan rentang 2 kolom (`md:col-span-2 xl:col-span-2`) untuk 5 tombol Kategori Perikanan (`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-1.5`) sehingga seluruh nama kategori tampil rapi 1 baris tanpa terpotong.
- Mengubah warna tombol aktif dari biru elektrik (`bg-blue-600`) menjadi hijau institusional `bg-emerald-700 text-white shadow-xs`, inaktif `bg-white text-slate-800 hover:bg-slate-100 shadow-xs border border-slate-200 rounded-md`, dan tipografi Title Case.
- Menyelaraskan kontras warna ikon di dalam tombol kategori (aktif: `text-emerald-100`, inaktif: `text-emerald-600`) serta menyelaraskan dropdown Tahun Data dan Pilih Kecamatan.
[ADR-067] Standardisasi Desain Filter Card Padi & Palawija (/food-crops) Seragam dengan Hortikultura:
- Menstandarkan kembali tata letak filter card `/food-crops` ke format baku 4-kolom sejajar (`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-left`) yang identik dengan hortikultura.
- Mengeliminasi pembungkus kapsul segmented control abu-abu dan menggantinya dengan grid 3-kolom tombol individual ber-state aktif `bg-emerald-700 text-white shadow-xs`.
- Mempertahankan seluruh opsi indikator dan komoditas tanpa perubahan fungsi (`Luas Panen`, `Produksi`, `Produktivitas`, serta `Padi Sawah·Ladang`, `Jagung & Umbi-umbian`, `Kacang-kacangan`).
- Menyelaraskan dropdown pemilih Tahun Data dan Pilih Kecamatan serta menghapus baris footer status redundan di bawah filter card.
[ADR-066] Penyelarasan Matriks Metrik Sub-Sektor Buah (Luas Ha, Produksi Ton, T/Ha):
- Membuka kunci metrik analisis pada sub-sektor Buah di `/horticulture` sehingga memiliki 3 tombol pilihan metrik baku: `Luas (Ha)`, `Produksi`, dan `T / Ha` yang seragam dengan Sayuran, Biofarmaka, dan Tanaman Hias.
- Menghubungkan kalkulasi agronomis standar BPS Distankan KP untuk tanaman buah tahunan (Salak 22 T/Ha, Pisang 25 T/Ha, Durian 10 T/Ha, Mangga 12 T/Ha, Pepaya 40 T/Ha, Jeruk Besar 16 T/Ha, Jeruk Siam 18 T/Ha) pada dataset frontend `Ee`.
- Menambahkan endpoint `GET /api/v1/hortikultura/buah-luas` dan memperbarui endpoint `/rekap-global` agar estimasi luas panen buah (11.229,72 Ha pada 2024) dihitung secara dinamis.
- Memperbarui kartu statistik total, kartu peringkat kecamatan tertinggi, komposisi komoditas, dan grafik tren/batang agar merespons dinamis tanpa nilai NaN atau terkunci pada Ton.
[ADR-065] Transformasi Dinamis Neraca Pangan Komposit (Non-Beras) & Integrasi Panen Lokal:
- Mengubah tab Neraca Komposit di `/food-security` dari konstanta memori statis menjadi pemanggilan API reaktif `GET /api/v1/ketahanan/neraca-komposit?tahun=`.
- Sisi backend mengagregasi data panen lokal Distankan KP Banjarnegara (Jagung 51.146 Ton, Ubi Kayu 78.886 Ton, Kedelai 19 Ton, Daging Sapi 1.859 Ton, Telur Ayam 70.701 Ton) dari tabel `palawija_produksi`, `ternak_daging`, dan `ternak_telur` sebagai referensi pembanding faktual.
- Menyediakan dropdown pemilih tahun data (`select`) yang terisi otomatis dari `availableYears` basis data.
- Kartu komoditas secara reaktif menyesuaikan badge warna dan nilai surplus/defisit jika admin mengunggah berkas Excel NBM melalui dasbor `/admin`.
[ADR-064] Redesign Filter Card Hortikultura, Kontekstualisasi Ikon Sektoral & Eliminasi AI-Slop:
- Menstandarkan kembali tata letak filter card `/horticulture` ke format baku 4-kolom sejajar (`grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-lg p-4 shadow-sm`) agar 100% konsisten dengan halaman lain (`plantation`, `food-crops`, `livestock`).
- Mengeliminasi total kapsul redundant "● Aktif: Sayuran" (AI slop) dan menghapus footer status teks bawah yang merusak konsistensi desain.
- Menerapkan ikon resmi Lucide: Wortel (`Carrot`) untuk Sayuran, Apel (`Apple`) untuk Buah, Tunas (`Sprout`) untuk Biofarmaka, dan Bunga (`Flower-2`) untuk Tanaman Hias (bebas dari ikon pizza slice).
- Menyelaraskan kartu ringkasan total (`Total`) di bawah filter agar ikonnya dinamis mengikuti sub-sektor yang sedang aktif (Wortel, Apel, Sprout, atau Bunga).
- Mengubah styling tombol aktif dari biru elektrik generik (`bg-blue-800`) menjadi hijau institusional `bg-emerald-700 text-white font-semibold shadow-xs` serta mengubah kapitalisasi kaku ALL CAPS menjadi Title Case yang tenang dan manusiawi.
[ADR-063] Integrasi Status Sumber Data Halaman Publik & Pintasan Verifikasi Langsung di Dasbor Admin:
- Membangun `src/lib/data-sources.js` yang memetakan 16 domain sektor ke URL halaman publik dan sumber pembanding eksternal (BAPANAS, BPS, Kementan) dengan narasi faktual lugas tanpa jargon backend.
- Mendaftarkan endpoint `GET /api/v1/admin/sumber-data` di `src/routes/admin.js` dengan pengamanan RBAC sesuai bidang tugas pengguna.
- Menambahkan tab switcher `[Katalog Berkas & Unggahan]` dan `[Sumber Data Halaman Publik]` di dasbor admin untuk melihat ringkasan status tayang.
- Menyediakan tombol `[Lihat di Publik ↗]` di setiap kartu domain agar staf dinas dapat langsung memverifikasi visual tampilan publik tanpa harus berpindah manual.
[ADR-062] Resolusi Konsistensi Status Readiness Multi-Role Dasbor Admin & Penataan Layout Kartu PSAT:
- Mengubah guard `/api/v1/admin/readiness` dari `requireAdminRole` menjadi `requireAdmin` (terotentikasi) agar seluruh operator bidang teknis mendapatkan metadata keterisian baris dan tahun data terbaru.
- Menghapus pembatas `if (!n) return;` pada `build_admin_view.js` sebelum fetch readiness, menyelesaikan anomali badge "Belum Ada Data" palsu saat login sebagai akun non-admin.
- Menata ulang layout daftar tabel/kunci pada kartu domain dengan `flex-1` pada nama sheet dan `max-w-[140px] truncate` pada kunci natural, mencegah nama sheet PSAT-PDUK tertekan hilang.
- Mendaftarkan domain `harga-produsen` pada pemetaan styling warna `B` dan array kategori navigasi admin.
[ADR-061] Registrasi Akun Bidang Ketahanan Pangan ke Basis Data & Konfigurasi RBAC:
- Mendaftarkan akun `ketahanan-pangan` ke tabel `users` MySQL dengan peran `admin_ketahanan_pangan`, status aktif, dan password ter-hash SHA-256.
- Menambahkan variabel `PASS_KETAHANAN_PANGAN=KetahananPangan.2026` pada berkas `.env` dan template `.env.example`.
- Menyelaraskan daftar peran di `src/lib/users.js` dengan menyertakan alias `admin_ketahanan` untuk kompatibilitas ganda, serta memperbarui `database/production_migration_patch.sql` dan menyediakan script seed idempoten `scripts/seed_ketahanan_pangan.js`.
- Akun berhak mengelola 6 domain operasional: `harga-pasar`, `fsva-desa`, `neraca-pangan`, `psat-pduk`, `lumbung`, dan `harga-produsen`.
[ADR-060] Refinement RAG Graceful Local Fallback dengan Rule-Based NLG & Offline Agricultural KB:
- Mengeliminasi keluaran fallback raw data dump SQL kaku, digantikan dengan engine sintesis bahasa alami berbasis aturan (`src/lib/ai-nlg.js`) yang mengubah baris data produksi, luas panen, kelembagaan, dan FSVA menjadi narasi percakapan yang santun, luwes, dan terstruktur.
- Membangun modul Offline Agricultural Knowledge Base (`src/lib/ai-offline-kb.js`) berisi profil komoditas khas Banjarnegara (Salak Pondoh, Kopi Robusta Karangkobar, Domba Batur, Sayuran Dieng, Gula Kelapa Deres), SOP teknis pengendalian hama (WBC padi, patek cabai, tikus sawah), serta panduan pendaftaran kelembagaan (SIMLUHTAN & proposal alsintan).
- Mengintegrasikan micro-chunk pacing generator pada streaming Server-Sent Events (SSE) saat fallback lokal aktif, memberikan efek animasi pengetikan halus (*smooth typing pacing*) tanpa lag atau beban memori berlebih.
- Menguji ketahanan dengan rangkaian unit test komprehensif (`tests/ai-fallback.test.js` dan `tests/endpoint.test.js`) dengan hasil 100% lolos (zero crash, validasi status 200 OK non-stream & stream).
[ADR-059] Standarisasi Berkas Normalisasi BPS ke Murni CSV & Pembersihan Dev Info UI Admin:
- Standarisasi Penyimpanan Data 39 Folder Distankan: Seluruh 83 berkas normalisasi statistik di `dist/14. Distankan KP/` dibakukan dalam format murni CSV (wide format `<folder> CSV.csv` dan tidy/long format `tidy/<folder> tidy.csv`) tanpa ketergantungan berkas `.xlsx`/`.xls`.
- Pembaruan Peta Database: Memperbarui dokumentasi `dist/14. Distankan KP/PETA_DATABASE.md` untuk mencerminkan arsitektur murni CSV.
- Pembersihan Dev Info & Tech Leaks di UI Admin: Menghapus kartu status sistem (Layanan API v1, MySQL, JWT, TLS/SSL), kartu rekapitulasi otomatis (ADR-009), label internal DB (Mandiri DB, MariaDB, Penyangga Disk), dan info kunci tabel skema dari tampilan dasbor `/admin`.
[ADR-058] Penegakan ADR-009 & Eliminasi Domain Redundan Komoditas Unggulan dari Katalog Impor:
- Menghapus domain `komoditas-unggulan` dari konfigurasi `DOMAINS` di `src/lib/domains.js` dan peran bidang teknis di `src/lib/users.js` guna menegakkan prinsip Single Source of Truth ADR-009.
- Mengonfirmasi bahwa `komoditas_unggulan` adalah tabel derivatif/agregasi otomatis dari data transaksi produksi fisik (`padi_produksi`, `palawija_produksi`, `horti_produksi`, `perkebunan_produksi`, `ternak_populasi`, `ternak_daging`, `ikan_budidaya`) dan acuan `harga_produsen` yang dieksekusi via `src/lib/komoditas-rekap.js` saat startup dan setiap kali impor data sektor dilakukan.
- Menstandarkan jumlah domain operasional import/export menjadi 16 domain murni, dengan skor keterisian basis data faktual 100% mandiri (16/16).
- Antarmuka dasbor `/admin` dibersihkan dari seluruh metadata developer, nomor referensi ADR, dan kartu build status internal yang tidak perlu ditampilkan ke pengguna dinas.
[ADR-057] Penyelarasan Bentuk & Geometri Dasbor Admin dengan Design System & KPI Kesiapan:
- Redesign Header Terbuka & Ilustrasi Organik: Mengubah header dasbor admin menjadi Flat Open Header terbuka (`border-b border-slate-200 pb-5 mb-6`) dengan H1 `text-2xl sm:text-3xl font-bold tracking-tight text-slate-900`, mengeliminasi badge klise "Super Administrator", dan menyematkan ilustrasi kanonikal unboxed `dashboard.png` (`h-14 sm:h-16 w-auto object-contain select-none max-h-[60px]`) di sisi kanan sesuai standar `design-system.md §3.A & §8`.
- Pembersihan AI Slop & Tombol Redundan: Menghapus teks "100% Siap Publik" digantikan metrik faktual "17 / 17 Sektor Terisi" (Keterisian Basis Data) serta mengeliminasi tombol duplikat "Lihat Rincian Sektor" pada kotak alert pembaruan data usang karena sudah ada tombol toggle "Tampilkan/Sembunyikan Matriks" di header section.
- 4-Pilar Border-Left-4 KPI: Menstandarkan 4 kartu ringkasan KPI ke pola pilar `border-l-4` (Emerald, Blue, Amber, Purple) dengan angka `font-mono tabular-nums text-3xl font-bold text-slate-900` (`design-system.md §3.C Pola 1`).
- Pola 4 Divided Box pada Ringkasan Bantuan: Merefaktor kartu ringkasan bantuan pemerintah dari list `dl` generik menjadi kontainer `rounded-lg` terintegrasi dengan 2-kolom blok metrik terbagi (`divide-x divide-slate-100`) untuk Total Alokasi dan Penerima Manfaat (`font-mono tabular-nums text-xl font-bold`), baris metadata terstruktur, dan footer aksi dengan `ExternalLink` (`design-system.md §3.C Pola 4`).
- Matriks Eksekutif 2×2 Informasi Sistem: Merefaktor kartu status sistem menjadi matriks 2×2 terbagi (`grid grid-cols-2 divide-x divide-y divide-slate-100`) dengan titik indikator live hijau berdenyut (`animate-pulse`) untuk API dan DB MySQL, rincian masa sesi JWT, status cadangan snapshot, serta footer verifikasi keamanan berikon `Shield` (`design-system.md §1.A.4 & §7.A`).
- Pill Filter Cepat & Badge Status Tahun per Domain: Menambahkan pil filter `⚠️ Perlu Pembaruan (9)` pada bilah kategori serta menyematkan badge status tahun (`Mutakhir` atau `Perlu Update`) langsung di header setiap kartu domain katalog.
- Harmonisasi Geometri: Menstandarkan seluruh radius kartu dan panel ke `--radius-md` (8px / `rounded-lg`) dan tombol aksi ke `--radius-sm` (`rounded-md`).
[ADR-056] Eliminasi Deadcode & Leftover Ad-hoc Patch Scripts:
- Audit Komprehensif Bundel Frontend: Analisis graf dependensi entry point `dist/assets/index-CI1XYnwk.js` mengonfirmasi 100% 84 berkas bundel JS di `dist/assets/` terhubung aktif (0 bundel mati / orphaned).
- Eliminasi Skrip Patch Sekali Pakai: Menghapus 8 berkas skrip migrasi/patch ad-hoc di direktori `scripts/` (`fix_farmers_image.js`, `fix_index_ft.js`, `mount_domain_images.js`, `remove_card_wrappers.js`, `uniformize_header_images.js`, `apply_all_domain_images.js`, `sync_kulit_domba.js`, `analyze_deadcode.js`) guna mencegah risiko regresi unboxed UI jika dijalankan kembali.
- Sanitasi Berkas Pengujian: Membersihkan 69 berkas sampah pengujian sementara di `scratch/*` dan menyelaraskan seluruh query SQL kalkulasi komoditas.
[ADR-055] Favicon Multi-Resolusi Baku & Resiliensi Chatbot AI Si Pertani:
- Favicon 100% Identik Logo Aplikasi: Meng-generate multi-resolusi `.ico` asli (16×16 hingga 256×256) serta varian PNG (16×16, 32×32, 48×48, 64×64, 192×192, 512×512) langsung dari master `dist/logo.png`.
- Eliminasi Cache Stale Favicon: Memperbarui `<link>` tags di `dist/index.html` dengan cache-buster kanonikal `?v=logo` dan menyelaraskan seluruh shortcut icon browser.
- Resolusi ISSUE-040 Chatbot AI Si Pertani: Memperbaiki kesalahan referensi `kecamatanParam` &rarr; `matchedKec`, memperbarui `SUPPORTED_MODELS` ke model aktif resmi (`gemini-3.5-flash-lite`, `gemini-flash-lite-latest`, `gemini-flash-latest`), dan memperkuat fallback streaming SSE lokal (HTTP 200) saat upstream AI mengalami lonjakan beban sehingga antarmuka tidak pernah terputus.
[ADR-054] Penyelarasan Judul Navbar vs Halaman & Unifikasi Tab Baku:
- 100% Sinkronisasi 36 Judul Rute: Menyeragamkan seluruh menu navigasi sidebar (`site-B5h-x_N5.js`) dan tag `<h1>` halaman ke nama kanonikal baku.
- Unifikasi Tab ke Executive Segmented Pill: Menstandarkan seluruh tab ke kontainer `flex flex-wrap items-center gap-1.5 p-1 rounded-lg border border-slate-200 bg-slate-100/90 shadow-sm w-fit` dengan item aktif `rounded-md px-3.5 py-1.5 text-xs font-bold bg-white text-slate-900 shadow-sm` dan inaktif `text-slate-600 hover:text-slate-900 hover:bg-slate-200/60`, serta menghapus seluruh inline hex styling.
- Pembersihan Kartu Pembungkus Global `Ft`: Mengubah komponen `Ft` di `index-CI1XYnwk.js` menjadi unboxed murni (`h-14 sm:h-16 w-auto object-contain select-none max-h-[60px]`) dan spacing `border-b border-slate-200 pb-5 mb-6`.
- Harmonisasi `/livestock-flow` & `/sensus`: Menghubungkan PageHeader `Ft` dengan ilustrasi unboxed `livestock.png` dan `farmers.png`, serta mengelevasi tab Jenis Data dan Aspek Data ke posisi navigasi utama.
- Favicon Resmi Terpadu: Meng-generate multi-resolusi `.ico` dan `.png` langsung dari master `dist/logo.png` (2480×2480 RGBA) dan menghubungkannya di `dist/index.html`.
[ADR-053] Resolusi GeometryCollection Leaflet & Restorasi Peta Dashboard Eksekutif:
- Root Cause: Skrip pemangkas presisi koordinat `scripts/optimize_geojson.js` hanya memetakan properti `coordinates` dan mengabaikan `geometries`. Akibatnya, 3 desa bertipe `GeometryCollection` (Desa Gemuruh ID 68, Desa Gumelemkulon ID 201, Desa Petambakan ID 239) di `dist/peta_desa_v3.geojson` kehilangan array poligonnya sehingga Leaflet melempar `TypeError: can't access property "length", n.geometries is undefined`.
- Solusi Komprehensif:
  * Memperbaiki `scripts/optimize_geojson.js` untuk secara rekursif memetakan dan membulatkan koordinat pada seluruh elemen array `geometries`.
  * Memulihkan geometri asli 3 desa terdampak pada `dist/peta_desa_v3.geojson` dengan presisi 6 desimal (sub-meter) yang hemat bandwidth (2,51 MB).
  * Menambahkan defensive guard pada Leaflet di `dist/assets/pages-BdW-ZTL4.js`: `(n.geometries ? n.geometries.length : 0)` untuk perlindungan fail-safe permanen dari kemungkinan anomali data spasial.
[ADR-052] Integrasi & Penyeragaman 13 Ilustrasi Domain Header (Anti-Slop Clean Illustration):
- Mengonsolidasikan seluruh 13 aset ilustrasi sektor domain secara eksklusif ke direktori kanonikal `dist/img/domain/` (`dashboard.png`, `prediction.png`, `horticulture.png`, `plantation.png`, `livestock.png`, `fisheries.png`, `food-security.png`, `supply-chain.png`, `price-volatility.png`, `farmers.png`, `economic-value.png`, `Irrigation512px.png`, `suitability.png`) tanpa menduplikasi file keluar.
- Mengompresi berkas `dashboard.png` dari 1,06 MB (22 megapixel) menjadi 125 KB (-88,2%) dengan resolusi Retina 512px yang tetap tajam dan cepat dimuat.
- Menghapus 100% pembungkus kartu buatan (`bg-white border border-slate-200 rounded-xl shadow-sm`) yang dinilai melanggar estetika profesional dan mengadopsi prinsip *Unboxed Natural Illustration*: gambar disajikan murni, menyatu dengan latar belakang header, dengan ukuran `h-14 sm:h-16 w-auto object-contain select-none` (ketinggian dibatasi maksimal `60px`).
- Menyeragamkan tinggi seluruh header halaman di SISPERTANI (~72–80px) dan mengeliminasi pergeseran tata letak vertikal (*zero layout shift*) saat navigasi antar-menu.
- Mengintegrasikan gambar secara otomatis pada komponen PageHeader `Ft` di `dist/assets/index-CI1XYnwk.js` (Hortikultura, Perkebunan, Peternakan, Lahan) serta template individual (`/farmers`, `/prediction`, `/suitability`, dll).
- Memvalidasi seluruh 84 berkas bundle JS di `dist/assets/` dengan parser Node.js (`Checked 84 JS bundles. Custom errors: 0`) dan memverifikasi seluruh 13 endpoint gambar domain mengembalikan HTTP 200 OK.
[ADR-051] Optimasi Berkas GeoJSON & True-Lazy Loading Layer Peta Dashboard Eksekutif:
- Mengidentifikasi akar penyebab pemuatan lambat peta di produksi: total payload GeoJSON mentah mencapai 23,30 MB tanpa kompresi gzip (akibat bypass kompresi di src/server.js untuk mencegah ERR_HTTP2_PROTOCOL_ERROR pada Nginx) dan pemuatan preload serentak (setTimeout 2,2s) untuk seluruh layer yang tidak dicentang di frontend.
- Membangun skrip optimasi deterministik `scripts/optimize_geojson.js` (`npm run geojson:optimize`): memangkas koordinat floating-point ke 6 desimal (~11 cm akurasi), mengeliminasi ketinggian Z elevasi 0 (2D flattening), serta membersihkan atribut metadata shapefile mentah yang tidak digunakan (METADATA, SRS_ID, PUDATE, AQDATE, KODLCO, SHAPE_Leng, SHAPE_Area).
- Hasil optimasi memangkas ukuran total dari 23,30 MB menjadi 13,72 MB (-41,1% / hemat 9,57 MB); peta_desa_v3.geojson terpangkas dari 4,25 MB ke 2,48 MB (-41,5%) sehingga muat aman dalam kuota localStorage 5 MB browser tanpa QuotaExceededError.
- Menerapkan strategi True-Lazy Loading pada `dist/assets/pages-BdW-ZTL4.js` via `scripts/patch_pages_lazy_layers.js`: menghapus preload massal latar belakang 18 MB dan menginisialisasi layer unchecked dengan FeatureCollection kosong. Layer tematik berat (Jaringan Jalan, Sawah, Kebun, Ladang) kini diunduh secara on-demand via event 'overlayadd' Leaflet hanya saat pengguna mencentang toggle layer bersangkutan.
- Beban transfer awal peta turun drastis dari 23,3 MB menjadi ~3,3 MB (-85,8%), menjamin peta dashboard terbuka instan pada koneksi seluler 4G/3G dan jaringan kantor tanpa memicu saturasi bandwidth maupun pembatalan stream HTTP/2.
[ADR-050] Rekonstruksi Halaman Kesesuaian Lahan (/suitability) Multi-Sektor (Pangan, Hortikultura, Perkebunan):
- Mengeliminasi pembatasan monokultur 8 sayuran dan mengintegrasikan 3 sektor penuh secara terpadu: Tanaman Pangan (padi sawah/ladang & palawija), Hortikultura (sayuran, buah tahunan, biofarmaka), dan Perkebunan Rakyat (kopi robusta, teh, kelapa, cengkeh, dll.).
- Mengimplementasikan modul evaluasi `src/lib/kesesuaian.js` dan endpoint `GET /api/v1/lahan/kesesuaian` terhubung langsung ke MariaDB `pertasis` (Zero Dummy Data, performa < 40ms).
- Menghubungkan korelasi tutupan lahan fisik kecamatan (`lahan_desa`: Luas Sawah vs Bukan Sawah/Tegalan) serta klasifikasi kesesuaian agraria standar (S1 Sangat Sesuai, S2 Cukup Sesuai, S3 Marjinal, N Tidak Diusahakan) tanpa bias volume ton mentah.
- Memperbarui bundle antarmuka `dist/assets/suitability-BoKTpxZD.js`: 4 Tab Navigasi Sektor, selektor kecamatan & tahun simetris, 4 KPI cards border-l-4, radar karakteristik adaptif, diagram batang komparasi volume, dan tabel matriks interaktif dengan pencarian dan paginasi bersih bebas AI-slop.
- Mengatasi galat module export Recharts (`The requested module './BarChart-CCPNsfhB.js' does not provide an export named 'Ne'`) dengan menyatukan kembali preamble radar charts asli chunk dan mengadaptasikan alias ekspor minified (`f as Ne` untuk Bar, `t as it` untuk BarChart, `in as Re` untuk ResponsiveContainer) melalui script build otomatis `scripts/build_suitability_view.js` dan verifikasi 100% via `scripts/verify_imports.js`.
[ADR-049] Resolusi Loading Lambat Peta Eksekutif & net::ERR_HTTP2_PROTOCOL_ERROR:
- Mengatasi galat `ERR_HTTP2_PROTOCOL_ERROR` dan `AbortError` pada Dashboard Eksekutif/Peta: mengaktifkan middleware `compression()` di `src/server.js` (menghemat bandwidth transfer GeoJSON hingga 81.2%, misal `jalan.geojson` dari 8.2MB menjadi 1.47MB).
- Mengonfigurasi `Cache-Control: public, max-age=86400` untuk aset statis berat (`.geojson`, `.png`, `fallback.json`) sehingga peramban meng-cache berkas spasial di memori lokal dan kunjungan berikutnya langsung instan (0 ms).
- Mengamankan pemuatan layer GeoJSON tambahan di `pages-BdW-ZTL4.js` agar tidak menjejali `localStorage` (>5MB limit) dan menangani kegagalan tiap layer secara independen tanpa memblokir render peta utama ("memuat halaman...").
- Menyediakan berkas `dist/dashboard.png` (sebelumnya hanya di `dist/img/dashboard.png`), dan menaikkan timeout fetch di `api-BxFGoia1.js` dari 10 detik ke 30 detik agar koneksi lambat tidak mengalami abort prematur.
[ADR-048] Verifikasi Faktual Upload Seluruh 17 Domain & Toleransi Parsial 1 Sheet:
- Memvalidasi secara faktual bahwa arsitektur impor Excel mendukung toleransi *partial sheet upload*: jika pengguna hanya mengunggah 1 sheet pada domain multi-sheet (misal: hanya sheet Padi pada `tanaman-pangan`, atau hanya sheet Poktan pada `kelembagaan`), baris pada sheet tersebut tetap 100% diproses dan tersimpan ke database, sedangkan sheet lain yang tidak ada dalam berkas diabaikan secara aman (`missing: true`, 0 error).
- Menguji secara nyata simulasi upload ke seluruh 17 domain aktif (`bantuan`, `tanaman-pangan`, `hortikultura`, `perkebunan`, `peternakan`, `perikanan`, `lahan`, `lumbung`, `ekonomi`, `kelembagaan`, `renstra`, `harga-pasar`, `fsva-desa`, `neraca-pangan`, `psat-pduk`, `komoditas-unggulan`, `harga-produsen`): hasil 17 dari 17 domain LULUS UJI (100%).
- Memperbaiki potensi duplikasi kolom khusus (`kode_kec`, `desa_id`, `nama_kecamatan`) di `src/lib/excel.js` dan memendekkan nama sheet `Statistik Poktan (ST2023)` agar tidak melebihi batas 31 karakter Excel.
[ADR-047] Pemisahan Bantuan Uang vs Barang (Paket) & Eliminasi Seluruh Redundansi Domain Admin:
- Menambahkan kolom `jenis_bantuan` (ENUM 'Uang','Barang'), `jumlah_barang` (DECIMAL), dan `satuan_barang` (VARCHAR) pada tabel `bantuan_program`, serta mengizinkan `nilai_rupiah` bernilai 0 / NULL saat bantuan berupa paket fisik barang.
- Mengintegrasikan kolom baru tersebut ke dalam template Excel, skema ekspor, dan parser impor domain `bantuan` di `src/lib/domains.js` serta respon API di `src/routes/bantuan.js`.
- Mengeliminasi seluruh domain ganda/redundansi di dasbor admin: menyatukan `st2023_desa` ke dalam `kelembagaan` (menghapus duplikasi kartu ST2023), menyatukan `bantuan-program`/`alokasi`/`korelasi` ke dalam `bantuan`, dan menyatukan `padi`/`palawija`/`ltt-katam` ke dalam `tanaman-pangan`, menghasilkan 17 domain sektoral bersih (kesiapan mandiri 94%).
[ADR-046] Unifikasi 4 Domain Kelembagaan Menjadi Domain Tunggal kelembagaan Multi-Sheet:
- Mengeliminasi pecahan 4 domain (`kelembagaan-pertanian`, `kelembagaan-perikanan`, `kelembagaan-pendukung`, dan `kelembagaan`) menjadi 1 domain tunggal `kelembagaan` (Kelembagaan & Penyuluhan) berisi 10 sheet terpadu.
- Menyesuaikan pembacaan dan upsert tabel pada `src/lib/excel.js` agar mendukung tabel dengan kolom teks `kecamatan` maupun `kecamatan_id` relasional secara otomatis tanpa galat SQL.
- Menyederhanakan total domain di portal `/admin` dari 25 menjadi 22 domain yang ringkas tanpa merusak skema tabel database maupun rute frontend publik.
[ADR-045] Otomatisasi Rekapitulasi Sentra Komoditas Unggulan (Materialized View Table Pattern):
- Menjawab kritik arsitektur data redundan: mengimplementasikan modul otomatisasi `src/lib/komoditas-rekap.js` yang secara otomatis mengagregasi data produksi riil per kecamatan (padi, palawija, horti, perkebunan, peternakan, perikanan) dan mengaitkannya dengan `harga_produsen` untuk mengisi tabel `komoditas_unggulan`.
- Mengisi 366 baris rekapitulasi historis (2018-2024) secara instan dan mengeliminasi beban ganda admin menginput manual.
- Menambahkan auto-trigger rekapitulasi saat admin mengimpor data sektor di `src/routes/admin.js`, saat startup server di `src/server.js`, serta menyediakan endpoint manual `POST /api/v1/admin/sync-komoditas-unggulan`.
- Mempertahankan domain `komoditas-unggulan` di portal admin agar admin dapat mengunduh berkas rekapitulasi Excel resminya dan tetap berstatus Mandiri (80% kesiapan).
[ADR-044] Self-Healing Tabel Activity Logs & Penambahan 2 Domain Admin Baru (Total 25 Domain):
- Mengimplementasikan `ensureActivityLogsTable()` di `src/routes/admin.js` yang secara otomatis menjalankan `CREATE TABLE IF NOT EXISTS activity_logs` saat aplikasi atau endpoint dipanggil, menuntaskan isu log login/logout yang belum muncul di server produksi tanpa perlu migrasi manual.
- Menormalisasi status log `failed` dan `warning` agar 100% patuh terhadap konstrain tipe kolom ENUM MariaDB.
- Mendaftarkan 2 domain baru di portal `/admin` (`komoditas-unggulan` dan `harga-produsen`) lengkap dengan generator template Excel, kunci upsert, dan pemetaan peran RBAC di `src/lib/users.js`, meningkatkan kesiapan mandiri produksi hingga 80% (20 dari 25 domain berstatus Mandiri).
[ADR-043] Normalisasi URL Modul Aset JS & Proteksi React Singleton:
- Mengeliminasi parameter query (?v=...) pada entry point script bundel Vite guna menjamin modul inti React dievaluasi sebagai single instance tunggal oleh peramban, mengeliminasi galat React Error #321 secara tuntas.
- Mengimplementasikan middleware normalisasi di `src/server.js` yang secara otomatis mengalihkan (HTTP 302) permintaan aset JS ber-query string ke URL kanonikal bersih.
- Menambahkan proteksi `notranslate` pada root HTML untuk mencegah intervensi Google Translate yang memanipulasi node DOM React dan memicu `removeChild`.
[ADR-042] Pemulihan Integritas Native Chunk Vite & Investigasi Caching Dasbor Admin (/admin):
- Mengembalikan integritas bundler native Vite pada berkas `dist/assets/admin-C9Dakcgq.js` dan membatalkan percobaan penulisan ulang hash chunk manual (`admin-E2N4xL8p.js`), guna mencegah kesalahan DOM runtime React (`removeChild`).
- Mencatat `ISSUE-034` terkait penundaan render komponen Matriks Kesiapan Data Sektoral di peramban klien akibat caching HTTP Nginx (`max-age=31536000`) dan memandu pengosongan cache peramban klien.
[ADR-041] Auto-Resolve Relasi Impor Excel & SQL Patch Produksi Mandiri:
- Mengotomatisasi resolusi `desa_id` dari `kode_desa` / pasangan `(kecamatan_id + nama_desa)` dan `kode_kec` dari `kecamatan_id` pada `src/lib/excel.js`. Kolom `desa_id` dikecualikan dari template (`SKIP_COLS`) agar tidak membebani pengguna dengan input ID angka mentah.
- Menyiapkan berkas SQL patch produksi mandiri `database/patch_production_normalization_2026.sql` yang idempotent untuk drop `fsva_indikator_kabupaten`, penambahan kolom `kode` & `tipe`, foreign keys 278 desa, serta pembuatan tabel `activity_logs`.
- Menambahkan skrip NPM `npm run db:normalize` untuk mempermudah eksekusi deployment di lingkungan server produksi.
[ADR-040] Dasbor Admin Dual-Tab Log & Server-Side Pagination:
- Mengintegrasikan tabel `activity_logs` (log audit aktivitas pengguna) berdampingan dengan `sync_log` (riwayat pembaruan/impor) dalam antarmuka dual-tab bersih pada `/admin`.
- Menerapkan paginasi server-side ringan (10 entri per halaman via LIMIT & OFFSET) pada endpoint `GET /api/v1/admin/sync-log` dan `GET /api/v1/admin/activity-log` untuk mencegah bottleneck DOM dan memastikan pemuatan dasbor cepat tanpa beban render massal.
[ADR-039] Normalisasi Relasional Kecamatan-Desa-FSVA & Eliminasi fsva_indikator_kabupaten:
- Drop tabel usang `fsva_indikator_kabupaten` (12 baris null, artefak lama) dan arahkan domain Admin ke `fsva-desa` (278 desa terdata, tabel aktif `fsva_desa_indikator`).
- Normalisasi skema master: tambahkan kolom `kode` (Kode BPS resmi) ke tabel `kecamatan` (20 kecamatan) dan `desa` (278 desa/kelurahan), serta kolom `tipe` (Desa/Kelurahan).
- Tambahkan foreign key `kecamatan_id` (tinyint unsigned) dan `desa_id` (smallint unsigned) pada `fsva_desa_indikator`, menjamin integritas referensial 100% cocok dengan master geografi.
- Endpoint `GET /api/v1/ketahanan/fsva-desa` kini mendukung filter relasional `?kecamatan_id=` dan `?desa_id=` dengan output `kecamatanId` dan `desaId`.
[ADR-038] Unifikasi Kelembagaan KWT ke Master `kelembagaan_pertanian`:
- Menghapus tabel kosong dan domain redundan `kwt_kelompok_wanita_tani` (0 baris data, artefak seeder usang).
- Menyatukan seluruh Kelompok Wanita Tani (232 KWT binaan) ke dalam satu Single Source of Truth: tabel `kelembagaan_pertanian` bersama 2.177 Poktan dan 278 Gapoktan (total 2.687 register resmi dari SK Kadistan & Simluhtan).
- Katalog portal Admin hanya menyediakan 1 domain terpadu: `kelembagaan-pertanian` dengan enum `jenis_lembaga`: Poktan, Gapoktan, KWT. Menghilangkan redundansi template Excel dan menaikkan persentase kesiapan data publik ke 78%.
[ADR-037] FSVA Desa Single Source of Truth & 16-Variable Dynamic Integration:
- Tabel `fsva_desa_indikator` di MariaDB menyimpan 16 variabel lengkap (10 fisik & demografi riil: Luas Sawah Ha, Sarpras Pangan Unit, Penduduk Miskin DTKS Jiwa, Status Akses, RT Tanpa Air Bersih, Jumlah Tenaga Kesehatan, Luas Wilayah Ha, Penduduk Jiwa, RT, Kepadatan; 5 rasio FSVA Tiga Pilar; IKP 0–100, komposit prioritas 1–6, ranking) dari 5 berkas validasi Bapanas & Distankan KP untuk 278 desa.
- Menghapus tab kedua 12 indikator dummy/placeholder AI yang membingungkan klien, menyatukan halaman `/fsva` menjadi dashboard peta spasial interaktif terpadu.
- Endpoint `GET /api/v1/ketahanan/fsva-desa` & `GET /api/v1/ketahanan/fsva-desa/ringkasan` melayani data langsung dari MariaDB.
- Skrip ETL `scripts/import_fsva_desa.js` (`npm run db:import-fsva`) siap menerima file tahun berikutnya (--tahun=2025) secara dinamis tanpa mengubah source code.
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
[ADR-012] Species-Centric Livestock Refactoring, Zero-Empty Law & Admin Entry:
- Pemisahan tegas data Populasi vs Produksi (halaman populasi murni ternak hidup).
- Submenu Produksi Utama & Hasil Ikutan dipilah per jenis hewan definitif: Daging (Sapi, Kerbau, Kambing, Domba Lokal, Ayam Kampung, Ayam Broiler, Itik, Puyuh, Kelinci), Telur (Ayam Layer, Ayam Kampung, Itik, Puyuh), Susu (Sapi Segar, Susu Kambing), dan Hasil Ikutan (Kulit Sapi, Kulit Kerbau, Kulit Kambing, Kulit Domba, Kulit Kelinci, Wol Domba Batur, Tulang & Tanduk). Domba Batur secara eksklusif diposisikan pada Populasi Ekor (sebagai ternak hias & bibit unggul yang dipasarkan per ekor hidup, bukan komoditas daging potong). Kulit Sapi dan Kerbau dipisah tegas tanpa kategori gabungan.
- Strict Zero-Empty Law: Baris data produksi bernilai 0 atau kosong difilter out dan tidak ditampilkan di tabel antarmuka publik.
- Anti-Bloat & Anti-AI-Slop Law: Menghilangkan seluruh kata lebay, buzzwords, dan emoji mentah dari seluruh halaman dan layer GIS.
- Nilai Ekonomi Peternakan & Ekosistem Usaha (4 Tab Mandiri): 1. Nilai Ekonomi Ternak, 2. UMKM Pakan Ternak, 3. Toko Peternakan & Poultry Shop, 4. Unit Usaha Ber-NKV dengan Zero Dummy Data (placeholder bersih yang siap menerima data riil).
- Admin Entry & 10-Sheet Excel Template: Menambahkan endpoint POST /api/v1/peternakan/entry dan 10 sheet template Excel di Dasbor Admin (/admin) yang memfasilitasi isian jumlah, banyaknya, wilayah kecamatan, tahun/bulan untuk seluruh komponen peternakan yang kosong.

[ADR-013] Laptop-First (1366x768) Responsive Scaling, Sector Tab Isolation & Horti Matrix:
- Tab Nilai Ekonomi Bidang: Halaman /nilai-ekonomi/hortikultura hanya menampilkan tab Hortikultura; /nilai-ekonomi/perkebunan hanya menampilkan tab Perkebunan.
- Responsivitas Layar 1366×768: Font scale dinamis html { font-size: 13.5px !important; } pada @media (max-width: 1440px) memastikan seluruh elemen rem mengecil proporsional (-15.6%) dan tidak saling berhimpitan pada laptop. Padding utama .print-main dirampingkan ke 1rem 1.25rem, tinggi header/brand disesuaikan ke 60px, dan padding sel tabel dibuat kompak.
- Tata Letak Filter Hortikultura: Grid tombol Sub-Sektor ditata menjadi matriks 2×2 (grid-cols-2 2xl:grid-cols-4 gap-1.5) dengan tombol selebar ~115px dan whitespace-nowrap, menjamin tombol "Tanaman Hias" & "Biofarmaka" muat rapi dalam satu baris tanpa terpotong atau tumpang tindih dengan ikon.
- Modul Hortikultura Sinkron: Integrasi Biofarmaka (m², kg) & Tanaman Hias (m², tangkai) terhubung ke API backend riil, dan sinkronisasi tahun agregat kabupaten mengikuti filter tahun utama.
[ADR-014] Dynamic Sub-Sector Economic Synchronization & Pure Sector Breadcrumb Isolation:
- Endpoint /api/v1/ekonomi/sektor-ringkasan mendukung parameter query subsektor (sayuran, buah, biofarmaka, tanaman_hias) untuk memfilter ranking #1 dan nilai ekonomi secara reaktif mengikuti tombol filter sub-sektor di /horticulture.
- Pemisahan tegas sektor Hortikultura dan Perkebunan di breadcrumb header bar ('HORTIKULTURA / Produksi Sayuran & Buah' vs 'PERKEBUNAN / Produksi Perkebunan') menggantikan label generik 'SEKTOR KOMODITAS', serta sanitasi teks usang gabungan.

[ADR-015] Unified Core Business Data Architecture & Production DB Harmonization:
- Klarifikasi Alur Data: MySQL/MariaDB adalah Single Source of Truth (SSOT). Data eksternal (CKAN OpenData, Bapanas) diakses on-demand/proxy untuk widget & AI RAG tanpa cron ingestion berlebih (Zero Bloat). Data operasional murni bersumber dari upload/import Excel Admin dan master statistik MariaDB.
- Harmonisasi DB Prod vs Dev: Sinkronisasi dua arah berhasil dilakukan. Data riil 2025 lahan_penggunaan dan ternak_telur (Itik) dari dump production berhasil dimerge ke basis data lokal; skema baru dev (14 tabel: RBAC users/roles, komoditas, harga_produsen, 10 jenis ikan, ekosistem peternakan) dibungkus ke dalam 'dist/production_migration_patch.sql' (patch non-destruktif) dan 'dist/dump_production_pertanian_updated.sql' (dump penuh terpadu 1,24 MB).

[ADR-016] Universal Kecamatan Filter on Nilai Ekonomi (Hortikultura & Perkebunan):
- Dropdown Kecamatan kini selalu aktif dan dapat diakses di submenu Nilai Ekonomi (/nilai-ekonomi/:bidang), menghapus penyembunyian selektor saat data resmi dinas terdeteksi.
- Dual-Scope Rendering: Pilihan 'Semua Kecamatan' menampilkan agregat resmi kabupaten dari dinas (disertai grafik sebaran 20 kecamatan); sementara pemilihan kecamatan spesifik (misal Batur, Kalibening, Banjarmangu, Pejawaran) menampilkan estimasi rincian nilai ekonomi komoditas kecamatan tersebut (volume produksi BPS Distankan × harga referensi pasar/petani).
- Multi-Year Horizon: Dropdown tahun menggabungkan seluruh horizon tahun yang tersedia dari dataset produksi BPS (2017–2024) dan tabel dinas.

[ADR-017] Universal Kecamatan Filter & Ecosystem Synchronization on Nilai Ekonomi Peternakan:
- Dropdown Kecamatan & Tahun diposisikan universal di atas seluruh 4 subtab Peternakan & Keswan (/nilai-ekonomi/peternakan), selalu tampak dan aktif (memuat 20 kecamatan resmi Banjarnegara + Semua Kecamatan tanpa terkunci/disabled).
- Multi-Subtab Reactive Synchronization:
  * Subtab 1 (Valuasi): Menyaring valuasi populasi ternak (BPS × bobot × harga pasar) per kecamatan terpilih vs agregat resmi kabupaten.
  * Subtab 2 (UMKM Pakan): Menyaring direktori pelaku usaha pakan ternak mandiri per kecamatan terpilih dengan badge counter unit.
  * Subtab 3 (Poultry Shop): Menyaring sebaran toko sapronak & obat hewan per kecamatan terpilih dengan badge counter unit.
  * Subtab 4 (Usaha Ber-NKV): Menyaring register unit usaha ber-NKV per kecamatan terpilih dengan badge counter unit.
- Friendly Empty State: Menyediakan pemberitahuan yang jelas jika suatu kecamatan belum memiliki pelaku usaha tertentu disertai tombol pintas [Lihat Semua] untuk kembali ke cakupan kabupaten.

[ADR-018] Pure Sector Tab Isolation & Pragmatic Source Attribution (Anti-Buzzword Law):
- Sector Tab Isolation: Di setiap submenu Nilai Ekonomi (/nilai-ekonomi/:bidang), navigasi tab kini 100% terisolasi hanya menampilkan sektor yang sedang dibuka (Pangan hanya menampilkan tab Pangan, menyembunyikan tab Horti/Perkebunan/Peternakan/Perikanan).
- Pragmatic Source Attribution: Menghapus label hiperbolis dan buzzword ("Resmi · Dinas", "data resmi Dinas", "input Dinas") dari seluruh kartu metrik, filter bar, dan tabel.
  * Jika bersumber dari basis data internal MariaDB: ditulis lugas "Aplikasi SISPERTANI" (database MariaDB tabel nilai_ekonomi_tahunan).
  * Jika bersumber dari data eksternal: secara eksplisit menyebutkan situs web rujukan resmi asalnya, yaitu "BPS Banjarnegara (banjarnegarakab.bps.go.id)", "Bappebti (bappebti.go.id)", atau "Satu Data Banjarnegara (opendata.banjarnegarakab.go.id)".

[ADR-019] Tanaman Pangan Restructuring (Komoditas, Produktivitas & LTT-Katam Sub-Navigation):
- Pengelompokan Komoditas: Mengganti 4 pasangan kaku lama menjadi 3 kelompok komoditas terpadu:
  1. Padi Sawah & Padi Ladang (tetap)
  2. Jagung & Umbi-umbian: Jagung, Ubi Kayu, Ubi Jalar, Talas, Porang (5 komoditas)
  3. Kacang-kacangan: Kacang Tanah, Kedelai, Kacang Hijau (3 komoditas)
- Endpoint Backend Dinamis: /api/v1/palawija/jagung-ubi dan /api/v1/palawija/kacang mendukung komoditas jamak dengan penjaminan ketersediaan properti tiap komoditas tanpa crash.
- Nomenklatur Produktivitas: Mengganti istilah 'Rata-rata Produksi' menjadi 'Produktivitas' dan 'Produktivitas (Ku/Ha)' sesuai standar Ditjen Tanaman Pangan Kementan.
- Navigasi Sub-Tab LTT & Katam: Menambahkan tab navigasi terpadu di bagian atas halaman Produksi Pangan (/food-crops) dan LTT & Kalender Tanam (/ltt-katam) untuk peralihan 1-klik tanpa overengineering.
[ADR-020] Ketahanan Pangan Enhancement & Keamanan Pangan Segar (PSAT-PDUK):
- Submenu Keamanan Pangan (/psat-pduk): Terhubung ke basis data MariaDB tabel psat_pduk dan Express API /v1/psat-pduk. Mengakomodasi 2 pilar pengawasan OKKPD: (1) Uji petik acak pasar/pedagang (rapid test residu pestisida, pemutih, formalin), dan (2) Akreditasi/registrasi izin edar pangan segar asal tumbuhan usaha kecil (PSAT-PDUK).
- FSVA 12 Indikator Bapanas (/fsva): Sub-tab switcher antara Peta FSVA Desa (6 Indikator) dan 12 Indikator Kabupaten Standar Bapanas (3 Pilar: Ketersediaan, Keterjangkauan, Pemanfaatan Pangan) berstatus transparan "Menunggu Data Integrasi Bapanas / OPD" (Zero Dummy Data Law).
- Data Harga Banjarnegara (/price-volatility): Tab switcher Pasar Lokal Banjarnegara (4 pasar pantauan: Banjarnegara, Karangkobar, Mandiraja, Klampok) berstatus "Menunggu Input Petugas Pasar" vs Referensi Bapanas Jateng.
- Rantai Pasok (/supply-chain): Banner status pemetaan koridor awal menunggu survei volume tonase logistik lapangan dinas.
- Ketersediaan Pangan Daerah (/food-security): Sub-tab Neraca Bahan Makanan (NBM) komposit 8 komoditas non-beras berstatus dinamis menunggu data dinas.

[ADR-022] Overhaul Kontainer, Grid Filter 12-Kolom & Tipografi Halaman Kelembagaan (/farmers):
- Eliminasi Monospace: Menghapus seluruh font-mono pada nomor register SIMLUHTAN, KUSUKA, BPPSDMP, dan sertifikat halal JULEHA, digantikan tipografi Inter dengan atribut tabular-nums dan badge kontur bersih.
- Grid Filter 12-Kolom Simetris: Penyelarasan form filter di seluruh tab (Pertanian, Perikanan, Pendukung, JULEHA, Rekap) sehingga sejajar rapi dalam 1 baris tanpa pergeseran elemen antartab.
- Filter Selektif Lembaga Pendukung & JULEHA: Penambahan dropdown kategori Lembaga Pendukung (Semua / P4S / UPJA) dan Status Sertifikasi JULEHA (Semua / Tersertifikasi / Dalam Pelatihan).
- KPI Cards Mandiri: 4 kartu statistik baru untuk Lembaga Pendukung (P4S Swadaya, Akreditasi BPPSDMP, UPJA Alsintan, Total Alsintan) dan 4 kartu untuk JULEHA (Total Personel, Tersertifikasi BNSP, Unit Tugas RPH/RPU, Cakupan Domisili).
- Desain Laptop-First (1366x768): Header halaman dirampingkan dengan badge metadata resmi, grafik dengan tick Inter tabular-nums, dan tabel ber-header sticky backdrop-blur dengan scrollbar kustom.

[ADR-023] Integrasi Basis Data Kelembagaan Tani Distankan KP & Dynamic Admin Excel Pipeline:
- Data Valid Primer Dinas: Mengintegrasikan seluruh data resmi kabupaten (2.409 Poktan termasuk 232 KWT, 278 Gapoktan, 137 KEP, 36 Posluhdes, dan 156 PPS) ke MariaDB pertasis via skrip ekstraksi ETL (scripts/extract_clean_kelembagaan.py & scripts/seed_kelembagaan_distankan.js) dengan penyaringan 299 baris subtotal.
- Patch Skema Database Non-Destruktif: Memperkaya kelembagaan_pertanian (+gapoktan_induk, +luas_lahan_ha, +penyuluh_pendamping, +penyuluh_hp) serta membuat tabel baru kelembagaan_kep, kelembagaan_posluhdes, dan kelembagaan_pps.
- Placeholder Semantik & Anti-Buzzword: Field kontak tanpa nomor telepon diberi badge resmi "Belum terdata", luas lahan kosong ditampilkan "-", kelompok tanpa angka anggota diberi badge "Dalam pemutakhiran" tanpa kata-kata lebay atau angka fiktif.
- Arsitektur Admin Dinamis: Domain kelembagaan-pertanian dan kelembagaan-pendukung di src/lib/domains.js mencakup seluruh tabel baru, memungkinkan admin Distankan KP mengunduh data terbaru, menyunting kontak/luasan di Excel, dan mengimpor ulang kapan saja secara mandiri.
- Perapian Navigasi Sidebar & Paginasi Tabel (/farmers):
  * Konsolidasi Submenu: Menghapus submenu redundan 'Kewirausahaan KWT' (yang sebelumnya hanya berisi 19 mock data contoh usang) dan menyatukannya ke dalam 'Direktori Kelembagaan Tani' (/farmers) yang memuat 2.409 kelompok terverifikasi (termasuk 232 KWT resmi). URL lawas /kewirausahaan/kwt secara otomatis diarahkan ke /farmers.
  * Paginasi Ringan & Dinamis: Menambahkan kontrol paginasi client-side di tabel register (25, 50, 100 baris per halaman) dengan penghitungan indeks 'Menampilkan X–Y dari Z data' serta tombol navigasi Sebelum/Berikutnya, mencegah lag render DOM dan menjaga antarmuka tetap responsif di laptop 1366px.

[ADR-024] Rekonstruksi Layout Navigasi 3 Klaster Kelembagaan Kabupaten (/farmers):
- Penyelesaian Tab Overload: Menata 8 entitas kelembagaan menjadi sistem navigasi terstruktur 2 tingkat:
  * Klaster 1: Tani & Gapoktan (SIMLUHTAN) -> Sub-tab: Poktan/KWT/Gapoktan (2.687 data), Rekapitulasi Validasi SK Kadistan (20 Kecamatan), dan Statistik Historis Desa.
  * Klaster 2: Ekonomi & Penyuluhan (Bina Usaha & Ketenagaan) -> Sub-tab: Kelompok Ekonomi Petani/KEP (137 unit), Pos Penyuluhan Desa/Posluhdes (36 unit), dan Penyuluh Pertanian Swadaya/PPS (156 orang).
  * Klaster 3: Sektoral & Pendukung -> Sub-tab: Kelembagaan Perikanan/Pokdakan (4 data placeholder), Lembaga Pendukung UPJA & P4S (4 data placeholder), dan Petugas JULEHA (4 data placeholder).
- Integrasi Penuh Berkas Dinas: Menambahkan tabel `kelembagaan_rekap_kecamatan` dan endpoint API `/v1/kelembagaan/rekap-validasi` untuk 20 kecamatan SK Kadistan (2.398 Poktan, 277 Gapoktan, kelas Pemula, Lanjut, Madya, Utama).
- Filter Selektif & Paginasi Terpadu: Penambahan dropdown bentuk badan usaha KEP, sinkronisasi penghitungan paginasi dinamis di semua tab, serta perapian dropdown kecamatan tanpa ikon tumpang-tindih.
- Konsistensi Permintaan Dinas: Mempertahankan seluruh skema dan view sektoral perikanan, UPJA/P4S, dan Juleha sesuai arahan Dispertan KP.

[ADR-025] Isolasi Tampilan Submenu Kelembagaan Navbar (/farmers):
- Eliminasi Penukaran 3-Tombol di Halaman: Menghilangkan kontainer tombol pengalih 3 klaster horizontal pada tampilan halaman view (/farmers) sesuai arahan pengguna.
- Akses Terisolasi Melalui Navbar: Pemilihan modul kelembagaan dilakukan eksklusif dari sidebar navigasi ('Tani, Gapoktan & KWT', 'Ekonomi & Penyuluhan', 'Sektoral & Pendukung').
- Sinkronisasi Header & Subtab Adaptif: Halaman secara otomatis mengenali query `?klaster=` untuk menampilkan judul modul, badge resmi, subtab Level 2 (misal KEP/Posluhdes/PPS pada Ekonomi, atau Poktan/Rekap SK/Statistik pada Tani), dan tabel yang relevan secara eksklusif.

[ADR-026] Harmonisasi Layout & Bentuk View Renstra & Rekomendasi Kebijakan (/renstra & /recommendations):
- Eliminasi Batasan Sempit: Menghapus pembatas kolom sempit `max-w-5xl mx-auto` sehingga halaman memanfaatkan ruang tata letak penuh (`w-full`) di dalam wadah master `.print-main` secara konsisten dengan halaman dashboard dan sektoral lainnya.
- Penyelarasan Geometri & Radius: Menerapkan standar `--radius-md: 8px` (`rounded-lg`) pada seluruh kartu metrik, panel ringkasan eksekutif, tabel evaluasi, dan kotak callout. Menghilangkan bentuk kotak bersudut tajam tanpa rounded.
- Kartu KPI Berstandar Border-Left-4: Menggantikan latar blok pastel pekat dengan kartu putih beraksen garis sisi kiri (`border-l-4 border-l-emerald-600`, `border-l-amber-500`, `border-l-blue-800`) dan tipografi berbobot resmi sesuai `design-system.md §3C`.
- Integrasi Tabel Seri Tahunan: Menyatukan kontainer tabel tren tahunan ke dalam alur kontainer utama (mengeliminasi perpecahan lebar layar ganda pada halaman rekomendasi).
- Tipografi Elegan & Bebas Harsh Uppercase: Merapikan hierarki tipografi teks menjadi gaya Executive Agritech yang natural dan mudah dibaca.

[ADR-027] Eliminasi AI Slop Eyebrow Badge & Pulsing Dot (/renstra, /recommendations, /farmers):
- Penghapusan Total Indikator Slop: Menghapus elemen tag eyebrow huruf kapital disertai pulsing dot hijau (`● PERENCANAAN & EVALUASI KINERJA DAERAH`, `● KEBIJAKAN & ANALITIKA PERTANIAN`, `● BIDANG SEKTORAL & LEMBAGA PENDUKUNG`) di atas judul <h1> pada halaman /renstra, /recommendations, dan /farmers.
- Penyelarasan Hierarki Header: Judul <h1> kini langsung menempati posisi teratas header kolom secara bersih, tenang, dan selaras dengan standar tata letak halaman lainnya (seperti /food-crops, /livestock, /plantation, /dashboard).

[ADR-028] Redesign Login Admin Portal (/admin) — Asymmetrical Layout & Agritech Photographic Identity:
- Komposisi Asimetris Seimbang: Mengubah tata letak form login `/admin` menjadi arsitektur split 2 kolom di mana sisi kiri lebih dominan (~55%) menyajikan identitas visual dan konteks institusional, sedangkan sisi kanan (~45%) menyediakan antarmuka formulir yang kompak, bersih, dan fokus.
- Citra Fotografi Pertanian Lokal: Menggantikan latar gandum/stok foto generic dengan fotografi persawahan Banjarnegara (`dist/img/sawah-login.jpg`) yang dipadukan dengan overlay gradien emerald-slate elegan serta kartu informasi kredensial yang rapi.
- Quick Role Selector & Form Interaktif: Menyediakan pemilih peran cepat (Administrator, Tanaman Pangan, Hortikultura & Perkebunan, Peternakan, Perikanan), toggle sembunyikan/tampilkan kata sandi, indikator keamanan SSL terenkripsi, dan feedback status login yang jernih.
- Kepatuhan Anti-AI-Slop & Responsivitas Layar: Mengeliminasi teks hiperbolis dan buzzword, menerapkan tipografi Inter tabular-nums, serta adaptif mulus mulai dari layar laptop 1366×768 hingga smartphone Android 3M (360/393/412px).

[ADR-029] React Router v6 Path Scoring & Client-Side Redirect Elimination (/kecamatan):
- Root Cause: Di file bundle 'dist/assets/index-CI1XYnwk.js', terdapat rute redirect '<Route path="/kecamatan/" element={<Navigate to="/kecamatan" replace />} />' tepat sebelum '<Route path="/kecamatan" element={<KecamatanPage />} />'. Dalam algoritma scoring React Router v6, rute bertrailing slash mendapat skor lebih tinggi (15 vs 13) dan dicocokkan lebih awal dengan regex yang sama, memicu infinite client-side redirect loop pada dirinya sendiri saat pengguna mengakses /kecamatan (menjadikan container #root kosong 0 byte).
- Solusi: Menghapus rute redirect redundan /kecamatan/ di sisi React Router. Normalisasi trailing-slash (/kecamatan/ -> /kecamatan) secara aman dan definitif telah ditangani di layer Express HTTP server (src/server.js: 302 redirect), sehingga halaman profil 20 kecamatan beserta peta spasial MapLibre kini ter-render sempurna tanpa blocking.

[ADR-030] Login Asymmetric Cross-Resolution Stabilization, Variable Shadowing Immunity & Dev DB Snapshot:
- Variable Shadowing Immunity: Me-refactor seluruh penamaan variabel state komponen admin ('dist/assets/admin-C9Dakcgq.js' & 'scripts/build_admin_view.js') ke identifier deskriptif ('token', 'sessionUser', 'isAdmin', 'loginUser', 'loginPass', 'loginErr', 'domsData', 'healthData', 'bantuanData', 'syncData', 'paketData', 'busyAction', 'actionErr', 'importResult'). Menghilangkan bentrok variabel 'f' (password vs icon users) dan 'd' (user setter vs icon clipboard) yang memicu galat 'createElement("")' saat pengguna login dengan akun bidang teknis non-admin.
- Cross-Resolution Layout Hardening: Menurunkan breakpoint panel visual kiri (latar foto sawah Banjarnegara) dari ≥1024px ke ≥768px (50:50 pada mode split window/tablet, 60:40 pada laptop 1366px+). Mengisolasi wadah formulir dalam kelas CSS khusus '.sispertani-form-card' ('max-width: 380px'), mencegah form merenggang 100% pada resolusi layar/jendela di bawah 1024px tanpa ketergantungan pada arbitrary classes Tailwind yang tidak terkompilasi.
- Database Dev Snapshot: Menghasilkan dump skema dan data MySQL/MariaDB dev 'pertasis' mutakhir dalam format UTF-8 standar ('database/dump_production_pertanian_updated.sql', 1.89 MB) mencakup seluruh 57 tabel terintegrasi.

[ADR-031] SQL Patch Portability & Unprivileged User Compatibility:
- Eliminasi Error 1227 (SET USER privilege): Menghapus klausa DEFINER=`root`@`localhost` dari VIEW log_aktivitas pada berkas patch dan dump basis data sehingga user standar cPanel/hosting ('pertalit') dapat mengimpor basis data tanpa membutuhkan privilege SUPER / root.
- Eliminasi Error 1292 (Incorrect datetime value): Mengonversi 653 kemunculan string format JavaScript 'Date().toString()' ('Wed Sep 23 2026...') menjadi format standar SQL datetime 'YYYY-MM-DD HH:MM:SS'.
- Eliminasi Error 1906 (Generated column value rejected): Mengeluarkan kolom kalkulasi otomatis 'nilai_rp' ('GENERATED ALWAYS AS (volume * harga_produsen) STORED') dari klausul INSERT tabel 'nilai_ekonomi_tahunan' agar dihitung secara otomatis oleh MariaDB tanpa pelanggaran strict SQL mode, serta menambahkan proteksi 'SQL_MODE=NO_AUTO_VALUE_ON_ZERO'.
- Verifikasi Produksi: Patch basis data berhasil diuji dan dieksekusi 100% tuntas di server produksi nargaroth ('pertanian.sistemdata.id').

[ADR-032] API Security Hardening, Write Protection & Clean Minimalist Footer:
- Proteksi Autentikasi Rute Tulis: Menambahkan guard `requireAdmin` (Bearer token) pada rute `POST /api/v1/peternakan/entry` dan `POST /api/v1/psat-pduk` serta verifikasi peran (SP-006 & SP-024) sehingga operasi tulis tidak dapat diakses anonim.
- Sanitasi Input & Eliminasi Kebocoran Database: Mengganti parsing nilai `Number()` dengan helper `toIntOrNull()` pada parameter `tahun` dan `kecamatan_id` di modul peternakan, ekonomi, dan ketahanan untuk mencegah nilai `NaN` diteruskan ke SQL driver (SP-026). Standardisasi wrapper `route()` agar galat status 500 mengembalikan pesan internal generik tanpa membocorkan pesan/struktur SQL ke client (SP-019).
- Browser Security Headers: Mengaktifkan middleware proteksi global `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, dan `Permissions-Policy` (SP-011, SP-023).
- Isolasi Host Proksi CKAN (Anti-SSRF): Memvalidasi target URL proksi CKAN `/3/*` agar strictly terkunci pada host resmi `opendata.banjarnegarakab.go.id` (SP-020).
- Koreksi Resolusi Path Paket Ekspor: Memperbaiki kalkulasi path traversal `PAKET_ROOT` di `routes/admin.js` agar tepat mengarah ke direktori `./database/template-import-export/`.
- Perampingan Footer Anti-AI-Slop: Menghilangkan tumpukan informasi berlebih dan tautan institusional verbose pada footer publik (`default-CAKe9ffW.js`), menggantinya dengan komposisi ringkas elegan: `© 2026 SISPERTANI Kab. Banjarnegara` | `v2.4.0`.

[ADR-033] Chatbot AI Resilience, Google Gemini Key Integration & Local RAG Fallback:
- Kredensial Valid & Model Resmi: Mengintegrasikan Google Gemini API Key resmi dan memperbarui daftar model yang didukung (`gemini-flash-lite-latest`, `gemini-3.5-flash-lite`, `gemini-flash-latest`, `gemini-3.5-flash`) untuk koneksi cepat dan stabil.
- Penyelarasan Skema Kolom RAG: Menyelaraskan query RAG ke tabel `komoditas_unggulan` (`kecamatan`, `produksi`, `nilai_ekonomi`), `horti_produksi` (`COALESCE(produksi_ton, nilai)`), dan `nilai_ekonomi_tahunan` (`nilai_rp`), mengeliminasi galat 1054 kolom tidak ditemukan.
- Smart Local/Offline RAG Streaming Fallback: Mengimplementasikan mekanisme fallback SSE cerdas di mana jika upstream AI mengalami kelebihan beban atau gangguan jaringan, backend tetap merangkum data statistik resmi dari MySQL `pertasis` dan mengalirkannya secara langsung ke UI chatbot, mencegah galat 'kesalahan koneksi'.

[ADR-034] Pragmatic Data Readiness Matrix & Audit Radar for Super Admin (/admin):
- Non-Over-Engineered Architecture: Menolak penambahan tabel database audit baru atau daemon terpisah. Seluruh status kelengkapan data dihitung on-demand dari tabel operasional yang sudah terdaftar di `DOMAINS` melalui kueri agregat `COUNT(*)` per tabel (< 50ms).
- Tri-State Data Health Classification:
  * 🟢 Mandiri (Lokal DB): Seluruh tabel penopang menu frontend telah memiliki data riil di MariaDB pertasis (> 0 baris).
  * 🟡 Penyangga (Fallback Snapshot): Tampilan publik berjalan menggunakan berkas disk cadangan (mis. padi-2025.csv, inflasi, pasar) atau proksi CKAN, memerlukan impor berkas definitif dinas.
  * 🔴 Belum Tersedia (0 Baris): Tabel kosong dan belum ada data aktif di DB (membutuhkan setoran Excel segera dari bidang).
- Actionable Data Request Memo Generator: Menyediakan generator disposisi/tagihan 1-klik yang menyalin rincian kebutuhan data spesifik per bidang ke clipboard untuk komunikasi kedinasan (WhatsApp / nota dinas) serta tombol pintas langsung ke filter domain template Excel terkait.

[ADR-035] Dynamic Year-Aware RAG Engine & Offline Python Assistant (Zero False Hallucination):
- Dynamic Year Extraction & Cross-Year Retrievability: Menyelesaikan masalah filter tahun tunggal di mana kueri spesifik tahun (contoh: "kalau 2023 salak paling banyak dari mana?") mengekstrak tahun secara regex `\b(201\d|202\d)\b` dan menyaring tabel `horti_produksi`, `padi_produksi`, `palawija_produksi`, `perkebunan_produksi`, `ternak_populasi`, `ikan_produksi_jenis`, dan `horti_produksi_kabupaten` dengan tahun faktual yang diminta.
- Anti-Data-Poisoning di Komoditas Unggulan: Eliminasi baris dummy 0 Ton seeder lama (Jagung, Ubi Kayu, Wortel, Kapulaga, Kopi Arabika, Cengkeh, Tebu) dengan filter ketat `total_produksi > 0 AND is_unggulan = 1` serta patch data faktual via `scripts/patch_komoditas_unggulan.js`.
- Spesialisasi Domain Sektoral:
  * Kelompok Tanaman Hias: Mendeteksi Agloenema, Krisan, Mawar, dan Soka di `horti_produksi` (kelompok = 'tanaman_hias').
  * Budidaya Ikan Hias: Mengintegrasikan tabel `ikan_hias` (Ikan Koi, Mas Koki, Komet, Cupang) dengan volume ekor, estimasi nilai ekonomi, dan sentra kecamatan (Rakit, Punggelan, Wanadadi).
  * Hortikultura Dataran Tinggi & Semusim: Wortel (~48.000-51.000 Ton di sentra Batur/Dieng), Bawang Daun (10.175 Ton), serta penegasan bahwa Banjarnegara bukan sentra Bawang Merah (0,33 Ton) dan bukan sentra Kelapa Sawit (0 Ton).
  * Kopi Robusta: Menampilkan 2.167 Ton kopi robusta aktif di sentra Karangkobar & Kalibening, mengklarifikasi Kopi Arabika 0 Ton.
  * Kelembagaan Spasial: Filter KWT, Poktan, Gapoktan, Pokdakan, UPJA, P4S, Juleha per kecamatan & desa sesuai arah sorting (paling sedikit/banyak).
- Standalone Offline Python RAG (`scripts/offline_rag.py`): Menyediakan asisten RAG mandiri berbasis Python (`pymysql`) yang dapat dijalankan via CLI (`npm run rag:offline` atau `python scripts/offline_rag.py "<query>"`) untuk analisis offline 100% tanpa internet/API key.

[ADR-036] Zero-Downtime Resilience & Direct Factual RAG Fallback on AI Gateway:
- Eliminasi Kegagalan Kredensial Tunggal: Menangani kasus ketiadaan `GEMINI_API_KEY` di server produksi tanpa menghasilkan galat HTTP 500 pada rute `/api/v1/ai/chat`.
- Live Context Pre-Retrieval: Ekstraksi konteks faktual MariaDB `pertasis` dijalankan sebelum evaluasi API key.
- Graceful Direct Streaming: Jika `GEMINI_API_KEY` belum terpasang atau upstream Google Gemini mengalami limitasi/overload, server mengalirkan data faktual database secara langsung via Server-Sent Events (SSE) dengan status HTTP 200 sehingga antarmuka pengguna tidak pernah menampilkan "kesalahan koneksi".
- Full Dual-Mode Execution: Menjamin sistem tetap berjalan interaktif baik dalam mode AI generatif penuh (saat API key aktif) maupun mode retrieval faktual langsung (fallback mandiri).



## [CREDS] DEV
admin=admin=C9145qbSjR
mysql=root=

## [NEXT]
[x] Analisis core bisnis sumber data & alur pengambilan data
[x] Komparasi mendalam dump_production_pertanian.sql vs MariaDB lokal
[x] Sinkronisasi data riil unggul dari production ke lokal (lahan 2025, telur Itik, presisi horti)
[x] Pembuatan production_migration_patch.sql & dump_production_pertanian_updated.sql (teruji 100% lulus uji)
[x] Penambahan dropdown kecamatan dan kalkulasi per kecamatan pada Nilai Ekonomi Hortikultura & Perkebunan
[x] Penambahan dropdown kecamatan universal dan sinkronisasi ekosistem usaha pada Nilai Ekonomi Peternakan & Keswan (4 Subtab)
[x] Isolasi tab sektor tunggal Pangan & pembersihan label sumber data (Aplikasi SISPERTANI / URL website resmi eksternal)
[x] Restrukturisasi kelompok komoditas pangan (Padi, Jagung & Umbi-umbian, Kacang-kacangan)
[x] Penyesuaian nomenklatur 'Produktivitas' dan integrasi sub-navigasi LTT & Kalender Tanam
[x] Submenu Keamanan Pangan (PSAT-PDUK): skema uji petik acak pasar & registrasi izin edar (DB + API + UI)
[x] FSVA: 12 Indikator Bapanas dengan status placeholder dinamis & rumus teknis lugas
[x] Fluktuasi Harga: Pemisahan data harga 4 pasar lokal Banjarnegara vs Bapanas Jateng
[x] Rantai Pasok & Ketersediaan: Integrasi status survei logistik lapangan & neraca pangan komposit
[x] Kelembagaan Tani & Perikanan: Pemisahan Pertanian (Poktan/Gapoktan/KWT) vs Perikanan (Pokdakan/Poklahsar/Pokmaswas)
[x] Juru Sembelih Halal (JULEHA): Registrasi tersertifikasi kompetensi halal RPH/RPU di MariaDB & UI
[x] Lembaga Pendukung: Integrasi data P4S (akreditasi BPPSDMP) & UPJA (inventaris alsintan)
[x] Placeholder Dinamis & Admin Excel Template: 3 domain admin, form upload dinamis, YAGNI, zero buzzword
[x] Redesign View Dasbor Admin (/admin): Layout responsif & role-aware, Quick Role selector pada form login, Tab Kategori & Live Search untuk 20 domain, Ruang Kerja Bidang tanpa alert sempit, YAGNI, zero buzzword
[x] Perbaikan Font & Kontainer Kelembagaan (/farmers): Poktan, Gapoktan, KWT, Juleha, P4S, UPJA, Perikanan (Anti-AI-Slop, no-mono, 12-col grid, laptop-first)
[x] Integrasi Data Kelembagaan Valid Distankan KP: 2.409 Poktan, 278 Gapoktan, 137 KEP, 36 Posluhdes, 156 PPS (ETL Seeder, DB Patch, API Endpoint, Placeholder Resmi, Admin Excel Sync)
[x] Pemisahan 3 Submenu Kelembagaan Tani di Navbar & Sinkronisasi URL Dua Arah (/farmers?klaster=tani, /farmers?klaster=ekonomi, /farmers?klaster=sektoral)
[x] Perbaikan Peta Blank /sebaran/ & /kecamatan/ (Penyediaan Web Worker maplibre-gl, Seeding Padi 2025 & Palawija, Peta Spasial 20 Kecamatan)
[x] Isolasi Tampilan View Kelembagaan Sesuai Submenu Navbar Terpilih (Penghapusan Switcher 3-Tombol di Halaman)
[x] Harmonisasi Layout, Lebar & Geometri Halaman /renstra & /recommendations Sesuai design-system.md
[x] Eliminasi AI Slop Eyebrow Badge & Pulsing Dot pada Header /renstra, /recommendations, dan /farmers
[x] Redesign Halaman Login Admin (/admin) Asimetris dengan Latar Foto Sawah Banjarnegara & Form Ringkas Resmi (ADR-028)
[x] Eliminasi Infinite Client-Side Redirect Loop /kecamatan/ pada React Router v6 Bundle (ADR-029)
[x] Resolusi Variable Shadowing Role Dashboard & Layout Asimetris Login Responsif Cross-Resolution (ADR-030)
[x] Pembaruan Dump Database Development MariaDB pertasis UTF-8 (dump_production_pertanian_updated.sql)
[x] Eksekusi & Validasi Migrasi Basis Data di Server Produksi (ADR-031: Status 100% Aman & Terverifikasi)
[x] Audit Keamanan & Hardening Endpoint API (SP Compliance 100% Lolos Uji)
[x] Perampingan Footer Non-Slop (Minimalis, Elegan, Versi 2.4.0)
[x] Penyusunan Dokumentasi Keamanan Sistem (.docs/security-audit.md)
[x] Verifikasi Normalisasi Basis Data Dev & Patch Runner MariaDB (Total 66 tabel aktif, 100% lolos via scripts/apply_production_patch.js / npm run db:patch)
[x] Invalidation Cache Metrik Capaian Pertanian 2025 di /recommendations (dist/assets/api-BxFGoia1.js: 178.610 Ton, 25.871 Ha, Mandiraja tampil riil)
[x] Rekayasa Live RAG & System Instruction Si Pertani (src/routes/ai.js: Agregasi Padi 2025, integrasi harga pasar, FSVA, neraca komposit, kelembagaan tani, pengawasan PSAT)
[x] Pembaruan Dokumentasi Utama (.docs/database.md, .docs/deployment.md, .docs/routes.md, app-context.md) untuk Kesiapan Rilis Produksi
[x] Implementasi Faktual 3-Tier Rate Limiting (Tier 1: General API 120/min, Tier 2: AI Chat 30/min, Tier 3: Admin Auth 5 fails/15 min lockout + 400ms delay) & Debug Mode Off (SP-019 Safe Error Masking + Express Global Error Handler)
[x] Integrasi Dasbor Admin 24 Domain & Role Ketahanan Pangan (Pendaftaran domain harga-pasar, fsva-kabupaten, neraca-pangan, psat-pduk, akun RBAC ketahanan-pangan, quick role selector, dan kategori filter UI)
[x] Eliminasi AI Slop Badges, Tech-Leaks & Buzzwords pada Antarmuka Dasbor Admin (/admin)
[x] Impor 7 Dataset BPS Distankan KP Baru (2.845 baris ke ternak_flow, ternak_pemotongan, ternak_daging, horti_luas_kabupaten, horti_produksi_kabupaten)
[x] Optimasi Penuh Dynamic Year-Aware RAG Engine (src/routes/ai.js: Salak 2023, Kopi Robusta 2024, Wortel Dieng, Kapulaga biofarmaka, Tanaman Hias Wanadadi, Ikan Hias Rakit/Punggelan, Kelembagaan KWT per desa/kecamatan)
[x] Pembangunan Standalone Offline RAG Python Engine (scripts/offline_rag.py, CLI + REPL + library mandiri berbasis pymysql)
[x] Patch Sinkronisasi Komoditas Unggulan Faktual (scripts/patch_komoditas_unggulan.js) & Integrasi ke scripts/apply_production_patch.js
[x] Verifikasi Pengujian Akurasi Faktual 100% Lulus Uji Dev & Siap Rilis Produksi
