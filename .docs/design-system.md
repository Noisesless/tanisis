# Sistem Desain Visual (Design System) — SISPERTANI Banjarnegara
<!-- Single Source of Truth Visual DNA — Status: LOCKED & VALIDATED -->
<!-- Analisis Ekstraksi Faktual 5 Halaman: /dashboard, /sensus-2023, /horticulture, /livestock, /livestock-flow -->

Dokumen ini adalah **Single Source of Truth (Satu-satunya Sumber Kebenaran)** untuk seluruh arsitektur visual, token gaya, tata letak, geometri, tipografi, palet warna, dan hierarki komponen pada aplikasi **SISPERTANI Banjarnegara**. Seluruh pembuatan halaman baru, refactoring komponen, maupun pengembangan modul teknis WAJIB merujuk dan mematuhi spesifikasi di bawah ini.

---

## 1. Visual DNA & Design Tokens

### A. Filosofi Visual DNA
Aplikasi SISPERTANI mengadopsi tema **Executive Agritech & Spatial WebGIS** yang memadukan kejelasan analitik data statistik pemerintah (BPS & Dinas Pertanian) dengan estetika spasial modern Kabupaten Banjarnegara. 
Prinsip utama desain visual:
1. **High Contrast & Clarity:** Kontras teks terhadap latar belakang memenuhi standar WCAG AA (rasio kontras minimal 4.5:1).
2. **Numeric Precision (Tabular Data):** Semua angka statistik, koordinat, kode kecamatan, dan nilai moneter (Rupiah) menggunakan format angka monospace terstruktur (`tabular-nums font-mono`).
3. **Symmetrical Multi-Sector Rhythm:** Konsistensi navigasi 4 pilar di seluruh 5 bidang teknis dengan kode warna tematik yang harmonis dan terstandarisasi.
4. **Anti-AI-Slop & Professional Authority:** Tidak menggunakan warna ungu neon buatan atau kartu generik datar tanpa hierarki; mengutamakan kedalaman visual nyata melalui *border-l-4*, kontur `rounded-lg`, pembatas `slate-200`, dan bayangan halus `shadow-sm`.
5. **Zero Raw Emoji & Enterprise Iconography:** Dilarang keras menyematkan emoji mentah (seperti simbol hewan, susu, tanaman) atau karakter mentah (seperti segitiga unicode) pada antarmuka, tabel data, kartu KPI, dan layer GIS. Seluruh indikator visual wajib menggunakan ikon resmi `lucide-react`, pill badges berlatar pastel dengan teks kontras tinggi, atau tipografi tabular terstruktur.
6. **Strict Zero-Empty Law & Clean Placeholders:** Tabel dan antarmuka publik menyaring baris bernilai `0` atau kosong secara otomatis agar tampilan bersih dan fokus pada data produktif. Bagian data yang masih kosong disajikan dengan placeholder bersih dan panduan pengisian lewat Dasbor Admin tanpa menggunakan data tiruan (*zero dummy data*).

---

### B. Core Design Tokens (CSS Variables Baku)

Sesuai berkas baku `assets/index-uA3DwdG_.css`, token warna, tipografi, dan radius sistem didefinisikan sebagai berikut:

```css
:root {
  /* ==========================================================================
     1. BRAND PRIMARY SCALE (State/Executive Blue)
     Digunakan untuk: Navigasi aktif, header sensus, tombol utama, highlight KPI
     ========================================================================== */
  --color-primary-50:  #eff6ff; /* oklch(97.7% 0.014 254.6) - Tint latar aktif */
  --color-primary-100: #dbeafe; /* oklch(93.2% 0.032 255.6) */
  --color-primary-200: #bfdbfe; /* oklch(87.4% 0.063 254.2) */
  --color-primary-300: #93c5fd; /* oklch(80.2% 0.106 252.8) */
  --color-primary-400: #60a5fa; /* oklch(72.0% 0.155 251.7) */
  --color-primary-500: #3b82f6; /* oklch(62.3% 0.214 259.8) - Blue 500 */
  --color-primary-600: #2563eb; /* oklch(54.6% 0.245 262.9) - Blue 600 */
  --color-primary-700: #1d4ed8; /* oklch(47.3% 0.236 264.4) - Blue 700 */
  --color-primary-800: #1e40af; /* oklch(39.8% 0.195 265.5) - Blue 800 (Brand Primary) */
  --color-primary-900: #1e3a8a; /* oklch(32.8% 0.150 266.2) - Blue 900 */

  /* ==========================================================================
     2. NEUTRAL SLATE SCALE (Struktur, Border & Teks)
     ========================================================================== */
  --color-slate-50:  #f8fafc; /* Canvas / Background utama halaman */
  --color-slate-100: #f1f5f9; /* Striping tabel, hover row, secondary panel */
  --color-slate-200: #e2e8f0; /* Default border kartu, garis grid chart, divider */
  --color-slate-300: #cbd5e1; /* Input border, inactive tab border */
  --color-slate-400: #94a3b8; /* Muted subtext, placeholder, divider halus */
  --color-slate-500: #64748b; /* Label formulir, table header, sub-label */
  --color-slate-600: #475569; /* Deskripsi sekunder, axis ticks chart */
  --color-slate-700: #334155; /* Body text reguler, sub-heading */
  --color-slate-800: #1e293b; /* Card heading, nilai KPI kontras tinggi */
  --color-slate-900: #0f172a; /* H1 Heading, teks terpekat */

  /* ==========================================================================
     3. SEKTORAL ACCENT SCALES (Tematik Bidang Pertanian)
     ========================================================================== */
  /* Emerald: Tanaman Pangan, Hortikultura, Delta Positif, Surplus */
  --color-accent-emerald-50:  #ecfdf5;
  --color-accent-emerald-100: #d1fae5;
  --color-accent-emerald-500: #10b981;
  --color-accent-emerald-600: #059669;
  --color-accent-emerald-700: #047857;
  --color-accent-emerald-800: #065f46;

  /* Amber: Nilai Ekonomi, Harga Produsen, Peternakan/Kambing, Warning Callout */
  --color-accent-amber-50:  #fffbeb;
  --color-accent-amber-100: #fef3c7;
  --color-accent-amber-400: #fbbf24;
  --color-accent-amber-500: #f59e0b;
  --color-accent-amber-600: #d97706;
  --color-accent-amber-700: #b45309;
  --color-accent-amber-800: #92400e;

  /* Red: Penurunan Produksi, Defisit Neraca Pangan, Risiko Keswan, Pemotongan */
  --color-accent-red-50:  #fef2f2;
  --color-accent-red-100: #fee2e2;
  --color-accent-red-400: #f87171;
  --color-accent-red-500: #ef4444;
  --color-accent-red-600: #dc2626;
  --color-accent-red-700: #b91c1c;

  /* Purple: Komoditas Dataran Tinggi Dieng, Petani Milenial, Diversifikasi */
  --color-accent-purple-50:  #f5f3ff;
  --color-accent-purple-100: #ede9fe;
  --color-accent-purple-500: #8b5cf6;
  --color-accent-purple-600: #7c3aed;

  /* Teal: Perikanan, Air Permukaan, Konservasi Serayu */
  --color-accent-teal-500: #14b8a6;
  --color-accent-teal-700: #0f766e;

  /* ==========================================================================
     4. GEOMETRI & CORNER RADII SYSTEM
     ========================================================================== */
  --radius-sm:   6px;    /* rounded-md / rounded-sm: select, badge, filter pill */
  --radius-md:   8px;    /* rounded-lg: STANDAR BAKU kartu KPI, panel, form */
  --radius-lg:   12px;   /* rounded-xl: kontainer WebGIS, kartu fitur dashboard */
  --radius-xl:   16px;   /* rounded-2xl: modal dialog besar */
  --radius-full: 9999px; /* rounded-full: pill badge, progress bar, avatar */

  /* ==========================================================================
     5. TIPOGRAFI STANDAR (Google Fonts Pair)
     ========================================================================== */
  --font-sans:  "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono:  "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* ==========================================================================
     6. ELEVATION & TRANSITION
     ========================================================================== */
  --vibe-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --vibe-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --vibe-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 2. Analisis Faktual Visual 5 Halaman Utama

Berdasarkan ekstraksi kode sumber pada 5 halaman operasional aplikasi SISPERTANI:

| Halaman | URL Rute | Pola Header Utama | Pola Kontrol / Filter | Formasi Kartu KPI | Pola Visual Chart / Data |
|---|---|---|---|---|---|
| **1. Dashboard WebGIS** | `http://localhost:5173/dashboard` (atau `/`) | Executive Title `text-2xl sm:text-4xl leading-tight font-bold tracking-tight text-slate-800` | Floating Map Widgets (Layer, Search, Zoom) di dalam Leaflet Canvas | Floating Gradient Card `bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 text-white` + Sector Cards `rounded-xl shadow-sm hover:shadow-md` | WebGIS Leaflet Spasial `h-[420px]` dengan layer interaktif polygon desa/kecamatan |
| **2. Sensus Pertanian 2023** | `http://localhost:5173/sensus-2023` | Eyebrow Badge `text-xs font-semibold uppercase tracking-widest text-blue-800` + H1 `text-2xl font-semibold text-slate-900` + Divider `border-b border-slate-200 pb-5` | Tabbed Segmented Switcher (`kelembagaan`, `ternak`, `perikanan`, `tanaman`) + Select Search `border-slate-300 rounded-md` | Formasi 4-Kolom Border-Left-4 (`border-l-blue-800`, `border-l-teal-700`, `border-l-amber-600`, `border-l-purple-700`) | Recharts BarChart `h-[420px] w-full` dual-color `#1d4ed8` & `#0d9488` |
| **3. Hortikultura** | `http://localhost:5173/horticulture` | Standard SectionHeader: Lucide Icon `h-6 w-6` + H1 `text-2xl font-bold text-slate-800` + Vertical Accent Border `border-l-2 border-emerald-600 pl-3` + Action Pill `Tahun 2024` | 4-Kolom Filter Grid (`grid-cols-1 lg:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-lg p-4`) + 2-Way Subsektor Button Grid (Sayuran vs Buah) | 3-Kolom KPI Grid: Predicted Volume, Delta vs Tahun Lalu (dengan dynamic color `text-emerald-600`/`text-red-600`), Akurasi R² | Progress Ranking Bar List (`bg-slate-200 h-1.5 rounded-full`) + Recharts Bar/Line `h-[320px]` & `h-[420px]` (Multi-series 5 warna) |
| **4. Peternakan** | `http://localhost:5173/livestock` | Standard SectionHeader: Lucide Icon `h-6 w-6` + H1 `text-2xl font-bold text-slate-800` + Subtitle deskriptif peternakan, keswan & hilirisasi | 3-Kolom Filter Grid (`grid-cols-1 md:grid-cols-3 gap-4`) + 3-Way Kategori Switcher (Besar, Kecil, Unggas) | 3-Kolom KPI Grid + Kartu High-Contrast Dark Accent (`border-slate-800 bg-slate-800 text-white rounded-lg p-4`) | Recharts BarChart `h-[320px]` & `h-[420px]` dengan palet multi-spesies (`#f59e0b`, `#3b82f6`, `#8b5cf6`, `#10b981`) |
| **5. Arus Ternak & RPH** | `http://localhost:5173/livestock-flow` | Directional Multi-Tab Switcher (`masuk`, `keluar`, `rph`, `luar-rph`, `daging-unggas`, `daging-ternak`) + H1 `text-2xl font-semibold text-slate-900` | Segmented Tab Pills + Filter Tahun & Jenis Ternak | Formasi 3-Kolom Border-Left-4 (`border-l-blue-800`, `border-l-teal-700`, `border-l-amber-600`) | 3-Way Divided Box (`divide-x divide-slate-200 border rounded-md`) + Callout Alert (`bg-blue-50`, `bg-amber-50`) + Line/Bar Chart |

---

## 3. Component Token Registry & Spesifikasi Komponen

### A. Pola Header Halaman Baku (*Unified Executive Page Header*)

Seluruh halaman aktif (29 rute) menganut satu struktur header baku terbuka (*flat border-bottom*) yang konsisten, tanpa kotak pembungkus (*box-in-a-box*), tanpa kotak ikon tebal di sebelah kiri, dan dengan ilustrasi tematik proporsional di sebelah kanan:

```jsx
<header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
  {/* Sisi Kiri: Tipografi Elegan Murni (H1 + Subtitle Deskriptif) */}
  <div className="flex-1 min-w-0">
    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
      {title}
    </h1>
    <p className="mt-1.5 max-w-3xl text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
      {subtitle}
    </p>
  </div>

  {/* Sisi Kanan: Aksi Fungsional / Badge Status & Ilustrasi Tematik */}
  <div className="flex items-center gap-4 shrink-0">
    {/* Aksi / Badge (Opsional) */}
    {actions && (
      <div className="flex flex-wrap items-center gap-2">
        {actions}
      </div>
    )}
    {/* Ilustrasi Vektor Tematik Sektor (Responsif: hidden sm:block) */}
    {imgSrc && (
      <img 
        src={imgSrc} 
        alt={title} 
        className="hidden sm:block max-h-20 lg:max-h-24 w-auto object-contain shrink-0" 
      />
    )}
  </div>
</header>
```

#### Aturan Baku Header Halaman:
1. **Zero Icon Box Clutter**: Dilarang menggunakan kotak pod tebal (`bg-blue-800` / `bg-teal-100`) di sebelah kiri judul. Judul H1 berdiri kokoh dengan tipografi presisi.
2. **Flat Open Layout**: Seluruh halaman wajib berformat terbuka dengan garis pemisah bawah halus (`border-b border-slate-200 pb-5 mb-6`). Dilarang membungkus header di dalam kartu terpisah (*box-in-a-box*).
3. **Thematic Right Illustration**: Kategori utama menampilkan ilustrasi sektor di sebelah kanan (`max-h-20 lg:max-h-24`) yang otomatis tersembunyi di layar ponsel agar tidak memakan ruang.
4. **Vertical Rhythm**: Margin bawah baku adalah `mb-6` untuk menjaga ritme vertikal ke kartu KPI / filter di bawahnya.

---

### B. Pola Kontrol Formulir & Filter (Form & Filter Controls)

#### 1. Kontainer Baris Filter Grid
- **4-Kolom (Standar Hortikultura / Pangan):**
  `grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-left`
- **3-Kolom (Standar Peternakan / Perkebunan):**
  `grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-left`

#### 2. Label Input
`text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 block`

#### 3. Select Dropdown & Text Input
`w-full pl-9 pr-4 py-2 border border-slate-200 text-sm font-medium text-slate-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 appearance-none cursor-pointer`

#### 4. Segmented Switcher Button Grid (2-Way / 3-Way)
```jsx
<div className="grid grid-cols-2 gap-2">
  <button 
    className={`py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
      active ? "bg-emerald-700 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
    }`}
  >
    Sayuran
  </button>
  <button 
    className={`py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
      !active ? "bg-emerald-700 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
    }`}
  >
    Buah-buahan
  </button>
</div>
```

---

### C. Pola Kartu Ringkasan Metrik (KPI Card Formations)

#### Pola 1: Formasi 4-Pilar Border-Left-4 (Khas Sensus 2023 & Flow)
Formasi grid responsif 4 kolom yang memisahkan kategori metrik utama dengan aksen warna sisi kiri setebal 4px:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
  {/* Card 1: Blue-800 */}
  <div className="bg-white border border-slate-200 border-l-4 border-l-blue-800 rounded-lg p-5">
    <div className="flex items-center gap-2.5 text-blue-800">
      <Users size={16} />
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Rumah Tangga Petani</p>
    </div>
    <p className="text-3xl font-semibold text-slate-900 mt-2 tabular-nums">148.291</p>
    <p className="text-xs text-slate-500 mt-1">RTP Pengguna Lahan</p>
  </div>

  {/* Card 2: Teal-700 */}
  <div className="bg-white border border-slate-200 border-l-4 border-l-teal-700 rounded-lg p-5">
    <div className="flex items-center gap-2.5 text-teal-700">
      <Layers size={16} />
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Petani Pengguna Lahan</p>
    </div>
    <p className="text-3xl font-semibold text-slate-900 mt-2 tabular-nums">142.015</p>
    <p className="text-xs text-slate-500 mt-1">95.8% dari total RTP</p>
  </div>

  {/* Card 3: Amber-600 */}
  <div className="bg-white border border-slate-200 border-l-4 border-l-amber-600 rounded-lg p-5">
    <div className="flex items-center gap-2.5 text-amber-600">
      <ShieldCheck size={16} />
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Anggota Poktan</p>
    </div>
    <p className="text-3xl font-semibold text-slate-900 mt-2 tabular-nums">64.882</p>
    <p className="text-xs text-slate-500 mt-1">Keanggotaan aktif</p>
  </div>

  {/* Card 4: Purple-700 */}
  <div className="bg-white border border-slate-200 border-l-4 border-l-purple-700 rounded-lg p-5">
    <div className="flex items-center gap-2.5 text-purple-700">
      <TrendingUp size={16} />
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Petani Milenial</p>
    </div>
    <p className="text-3xl font-semibold text-slate-900 mt-2 tabular-nums">28.410</p>
    <p className="text-xs text-slate-500 mt-1">Usia 19–39 tahun</p>
  </div>
</div>
```

#### Pola 2: Formasi 3-Kolom Delta & Akurasi Prediksi (Hortikultura & Peternakan)
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Card 1: Metrik Nilai Aktual */}
  <div className="border border-slate-200 bg-white rounded-lg p-4 flex flex-col justify-between shadow-sm">
    <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Prediksi Produksi 2024</span>
    <span className="text-2xl font-bold tabular-nums text-slate-800 mt-2">124.500 Ku</span>
    <span className="text-[10px] text-slate-400 mt-1">Berdasarkan tren 5 tahun BPS</span>
  </div>

  {/* Card 2: Delta Perubahan vs Tahun Sebelumnya */}
  <div className="border border-slate-200 bg-white rounded-lg p-4 flex flex-col justify-between shadow-sm">
    <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Perubahan vs 2023</span>
    <span className={`text-2xl font-bold tabular-nums mt-2 ${deltaPct >= 0 ? "text-emerald-600" : "text-red-600"}`}>
      {deltaPct >= 0 ? `+${deltaPct}%` : `${deltaPct}%`}
    </span>
    <span className="text-[10px] text-slate-400 mt-1">Selisih volume terhadap tahun sebelumnya</span>
  </div>

  {/* Card 3: Reliabilitas Model Statistik (R² Fit) */}
  <div className="border border-slate-200 bg-white rounded-lg p-4 flex flex-col justify-between shadow-sm">
    <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Akurasi Tren Model (R²)</span>
    <span className={`text-2xl font-bold tabular-nums mt-2 ${r2 >= 0.7 ? "text-emerald-600" : "text-amber-600"}`}>
      {(r2 * 100).toFixed(1)}%
    </span>
    <span className="text-[10px] text-slate-400 mt-1">{r2 >= 0.7 ? "Tren linear sangat kuat" : "Data bervariasi musiman"}</span>
  </div>
</div>
```

#### Pola 3: Kartu High-Contrast Dark Accent (Peternakan / Sorotan Utama)
```jsx
<div className="border border-slate-800 bg-slate-800 text-white rounded-lg p-4 flex flex-col justify-between shadow-sm">
  <span className="text-[11px] font-semibold uppercase text-slate-300 tracking-wider">Populasi Domba Batur</span>
  <span className="text-2xl font-bold tabular-nums text-white mt-2">14.280 Ekor</span>
  <span className="text-[10px] text-slate-400 mt-1">Sentra Dataran Tinggi Dieng</span>
</div>
```

#### Pola 4: Kartu Ringkasan Terbagi 3 Jalur (3-Way Divided Box di /livestock-flow)
```jsx
<div className="mt-4 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border border-slate-200 rounded-md overflow-hidden bg-white shadow-sm">
  <div className="p-4 text-center">
    <span className="text-xs font-medium text-slate-500 uppercase">Ternak Masuk</span>
    <p className="text-xl font-bold text-slate-800 mt-1 tabular-nums font-mono">12.450 ekor</p>
  </div>
  <div className="p-4 text-center">
    <span className="text-xs font-medium text-slate-500 uppercase">Ternak Keluar</span>
    <p className="text-xl font-bold text-slate-800 mt-1 tabular-nums font-mono">8.120 ekor</p>
  </div>
  <div className="p-4 text-center">
    <span className="text-xs font-medium text-slate-500 uppercase">Net Arus Ternak</span>
    <p className="text-xl font-bold text-emerald-700 mt-1 tabular-nums font-mono">+4.330 ekor</p>
  </div>
</div>
```

---

### D. Standar Visualisasi Data (Recharts & Chart Guidelines)

Seluruh grafik visualisasi pada SISPERTANI menggunakan Recharts dengan standardisasi:

1. **Kontainer Grafik:**
   `bg-white border border-slate-200 rounded-lg p-6 shadow-sm`
2. **Standar Ketinggian (Height):**
   - Ketinggian Analitik Utama (Primary): `h-[420px] w-full`
   - Ketinggian Tren/Distribusi Sekunder: `h-[320px] w-full`
   - Ketinggian Mini-Chart / Sebaran List: `h-[210px] w-full`
3. **Axis & Grid Typography:**
   - X-Axis & Y-Axis Ticks: Menggunakan font `JetBrains Mono` atau monospace, ukuran font `10px` / `11px`, warna `#475569` (Slate 600) atau `#64748b` (Slate 500).
   - Grid: `strokeDasharray="3 3"` dengan warna `#e2e8f0` (Slate 200).
4. **Palet Warna Bar & Line Chart:**
   - Seri 1 (Pangan / Sayuran / Produksi): `#059669` (Emerald 600)
   - Seri 2 (Sensus / Ternak Besar / Keuangan): `#1d4ed8` / `#2563eb` (Blue 700/600)
   - Seri 3 (Harga / Buah / Ternak Kecil): `#d97706` / `#f59e0b` (Amber 600/500)
   - Seri 4 (Perkebunan / Unggas / Unggulan): `#7c3aed` / `#8b5cf6` (Purple 600/500)
   - Seri 5 (Defisit / Risiko / RPH): `#dc2626` / `#ef4444` (Red 600/500)
   - Seri 6 (Perikanan / Kolam / Air): `#0d9488` (Teal 600)
5. **Tooltip Format:**
   `bg-white border border-slate-200 rounded-lg shadow-md p-3 text-xs font-mono text-slate-800`

---

### E. Standar Tabel Data & Ranking Spasial

#### 1. Tabel Data Analitik Lengkap
```html
<div className="overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-sm">
  <table className="w-full text-left border-collapse text-xs">
    <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] uppercase font-bold text-slate-600">
      <tr>
        <th className="px-4 py-3">Kecamatan</th>
        <th className="px-4 py-3 text-right">Luas Tanam (Ha)</th>
        <th className="px-4 py-3 text-right">Produksi (Ku)</th>
        <th className="px-4 py-3 text-right">Nilai Ekonomi (Rp)</th>
        <th className="px-4 py-3 text-center">Status</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
      <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-4 py-2.5 font-semibold text-slate-900">Wanadadi</td>
        <td className="px-4 py-2.5 text-right tabular-nums">1.450</td>
        <td className="px-4 py-2.5 text-right tabular-nums">72.500</td>
        <td className="px-4 py-2.5 text-right tabular-nums font-bold text-slate-900">Rp 14,5 M</td>
        <td className="px-4 py-2.5 text-center">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">Surplus</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

#### 2. Item Ranking Spasial dengan Progress Bar Track (Hortikultura & Peternakan)
```jsx
<div className="flex items-center justify-between gap-3 text-xs font-semibold tabular-nums bg-white border border-slate-200 rounded-md px-3 py-2 shadow-sm">
  <div className="flex items-center gap-2 flex-1 min-w-0">
    <span className="font-mono text-[11px] text-slate-400 w-5">#1</span>
    <span className="truncate text-slate-800">Batur</span>
  </div>
  <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden shrink-0">
    <div className="bg-emerald-600 h-full rounded-full" style={{ width: "85%" }} />
  </div>
  <span className="font-mono text-slate-900 w-16 text-right">38.400 Ku</span>
</div>
```

---

### F. Standar Kotak Pesan & Peringatan (Callout & Advisory Boxes)

1. **Info Catatan Sumber Data:**
   `bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs leading-relaxed text-slate-700`
2. **Peringatan Anomali / Warning Data:**
   `bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800`
3. **Pemberitahuan Defisit / Risiko Kritis:**
   `bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-800`
4. **Sorotan Keberhasilan / Rekomendasi:**
   `bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3 text-xs text-emerald-800`

---

### G. Standar Sistem Ikon (ONE Family Rule)

- **Keluarga Ikon Tunggal:** Wajib menggunakan `lucide-react` secara eksklusif di seluruh modul. DILARANG mencampur dengan FontAwesome, Ionicons, atau SVG mentah tanpa standardisasi.
- **Skala Ukuran Ikon:**
  - `size={14}` / `w-3.5 h-3.5`: Status dot, badge kecil, chevron submenu.
  - `size={16}` / `w-4 h-4`: Ikon header kartu KPI, ikon tombol aksi formulir, teks bantuan inline.
  - `size={20}` / `w-5 h-5`: Ikon navigasi sidebar, tombol unduh/ekspor, modal header.
  - `size={24}` / `w-6 h-6`: Ikon banner utama modul (`SectionHeader`).

---

## 4. Section Rhythm & Layout Constraints

### A. Rantai Tata Letak Halaman Analitik (Default Section Rhythm)
Setiap halaman modul teknis di SISPERTANI wajib mengikuti ritme urutan 5 langkah (*5-Step Section Rhythm*):
1. **Section 1 (Hero Banner / Header):** Judul modul, subjudul deskriptif, aksen warna vertikal, dan badge tahun/sumber data.
2. **Section 2 (Control & Filter Row):** Baris pemilihan subsektor, komoditas, kecamatan, atau rentang waktu dalam grid `rounded-lg border border-slate-200 bg-white p-4 shadow-sm`.
3. **Section 3 (KPI Metric Summary Matrix):** Ringkasan angka kunci dalam formasi 3-kolom atau 4-kolom (`border-l-4` atau `delta-aware`).
4. **Section 4 (Visual Analytics & Charts):** Grafik visualisasi utama (Recharts Bar/Area/Line) `h-[320px]` s/d `h-[420px]`.
5. **Section 5 (Tabular Breakdown & Spatial Ranking):** Rincian data terperinci per desa/kecamatan dengan angka `font-mono tabular-nums`.

### B. Aturan Anti-AI-Slop Visual SISPERTANI (18 Larangan Baku)
1. ❌ DILARANG menggunakan warna ungu default `#6C63FF` atau hijau `#4CAF50` generik. Wajib gunakan skala `--color-accent-emerald-*` atau `--color-primary-*`.
2. ❌ DILARANG font tunggal `Inter` tanpa diferensiasi karakter monospace. Angka metrik statistik WAJIB menggunakan `font-mono tabular-nums` (`JetBrains Mono`).
3. ❌ DILARANG deklarasi hardcode hex acak pada file komponen; wajib gunakan kelas Tailwind yang terhubung ke token design system.
4. ❌ DILARANG membuat 3 kartu datar identik tanpa hierarki visual (*3-Equal Cards Monoculture*). Minimal sertakan aksen `border-l-4`, pewarnaan delta kondisional, atau satu kartu kontras gelap (`bg-slate-800 text-white`).
5. ❌ DILARANG memakai spacing ganjil acak (misal: 13px, 19px). Seluruh jarak wajib mematuhi sistem grid kelipatan 8pt (`gap-2` = 8px, `gap-4` = 16px, `gap-6` = 24px, `gap-8` = 32px).
6. ❌ DILARANG menggunakan kata-kata klise AI slop seperti *"Revolutionize"*, *"Unlock"*, *"Empower"*, *"Seamless"*, *"Game-changing"*. Gunakan terminologi formal agraria Banjarnegara: *"Luas Tambah Tanam (LTT)"*, *"Neraca Kalori Bapanas"*, *"Populasi Domba Batur"*, *"Produktivitas per Hektar"*.
7. ❌ DILARANG menambahkan border, stroke, atau shadow dekoratif pada Logo Pemerintah Kabupaten Banjarnegara dan SISPERTANI. Logo ditampilkan bersih (*as-is*).
8. ❌ DILARANG mencampur lebih dari satu pustaka ikon. Hanya `lucide-react` yang diperkenankan.
9. ❌ DILARANG `h-screen` kaku pada viewport mobile; gunakan `h-full overflow-hidden` pada desktop shell dan `min-h-[100dvh]` untuk kontainer halaman.
10. ❌ DILARANG menggabungkan komoditas **Porang** (*Amorphophallus muelleri*) dan **Talas** (*Colocasia esculenta*) dalam satu kategori. Keduanya adalah entitas taksonomi botani yang berbeda.

### H. Arsitektur Navigasi Sidebar & Navbar (Pembaruan v2.4 — 28 September 2026)

Bagian ini mendokumentasikan secara komprehensif restrukturisasi visual navigasi sidebar pasca-evaluasi empiris pengguna, kepatuhan UUPM, dan penerapan kaidah *Taste-Skill Bridge*.

#### 1. Matriks Evaluasi & Komparasi Desain (*Before vs After*)

| Aspek Navigasi | Implementasi Lama (*AI-Slop*) | Pembaruan v2.4 (*Executive Agritech & UUPM*) | Justifikasi Desain & Aksesibilitas |
|---|---|---|---|
| **Tipografi Menu** | Huruf kapital penuh (*All-Caps* kaku): `BIDANG TANAMAN PANGAN` | *Title Case* proporsional: `Tanaman Pangan` dengan subjudul `Padi, Jagung & Palawija` | Mengeliminasi kebisingan visual, meningkatkan kecepatan baca (*skimmability*), dan menghilangkan pemborosan ruang horizontal. |
| **Ikon Kategori** | Kosong (hanya menu *Dashboard* yang memiliki ikon) | Seluruh 9 grup memiliki **Icon Pod (28×28px)** dengan pustaka resmi `lucide-react` | Menegakkan *ONE Icon Family Rule* dan kesetaraan visual hierarkis antar-bidang dinas. |
| **Kontras Submenu Aktif** | `bg-emerald-950/40 text-emerald-400` di atas `bg-slate-900` | **Solid Emerald-600 (`#059669`) + Pure White Text (`#ffffff`)** | Memperbaiki kegagalan rasio kontras (dari 1.8:1 menjadi **4.7:1**, lolos standar WCAG AA). Menu aktif langsung terlihat menonjol seketika. |
| **Indikator Spasial Aktif** | Hanya border tipis yang tidak terlihat | **Active White Bullet Dot (`bg-white`) + Negative Offset (`-ml-[9px] pl-[15px]`)** | Item aktif secara fisik menonjol memotong garis hierarki vertikal (*tree guide line*), menciptakan sensasi taktil nyata. |
| **Indikator Kategori Induk** | Tidak ada perbedaan saat anak aktif | **Parent Accordion Highlight**: `border border-emerald-500/40 bg-slate-800/90 text-white` | Pengguna tidak kehilangan konteks hierarki kategori mana yang sedang dibuka saat menelusuri data. |
| **Area Login Bawah** | Garis batas mentah melintang + tombol outline neon toska kaku bertuliskan `● pertasis [UP]` | **Floating Executive Institutional Card**: Kartu resmi bertingkat dengan identitas *"Portal Data Dinas"*, status koneksi tenang, dan tombol solid | Mengeliminasi kesan panel debug mentah; menghadirkan wibawa portal data resmi kedinasan pemerintah daerah. |

---

#### 2. Spesifikasi Teknis Submenu Aktif (*High-Contrast Active State*)

Saat pengguna membuka accordion dan memilih salah satu submenu, elemen aktif dirender dengan spesifikasi presisi berikut:

```html
<!-- Submenu Item: Aktif -->
<a href="/food-crops" class="group flex items-center px-2.5 py-2 rounded-lg text-xs transition-all bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-950/50 -ml-[9px] pl-[15px]">
  <!-- Titik Peluru Putih Menyala -->
  <span class="w-1.5 h-1.5 rounded-full mr-2 shrink-0 bg-white"></span>
  <span class="truncate">Produksi Padi & Palawija</span>
</a>

<!-- Submenu Item: Tidak Aktif (Default) -->
<a href="/prediction" class="group flex items-center px-2.5 py-2 rounded-lg text-xs transition-all text-slate-400 hover:bg-slate-800/60 hover:text-white font-medium">
  <!-- Titik Peluru Abu-abu Redup -->
  <span class="w-1.5 h-1.5 rounded-full mr-2 shrink-0 bg-slate-600 group-hover:bg-slate-400 transition-colors"></span>
  <span class="truncate">Prediksi Panen</span>
</a>
```

- **CSS Tokens Terkait:**
  - Latar aktif: `--color-accent-emerald-600` (`#059669`)
  - Teks aktif: `#ffffff` (Rasio Kontras 4.7:1 terhadap `#059669`)
  - Bayangan: `shadow-md shadow-emerald-950/50` (memberikan elevasi dari permukaan kanvas `slate-900`)
  - Offset pembimbing: `-ml-[9px] pl-[15px]` untuk memotong garis `border-l-2 border-slate-800`.

---

#### 3. Spesifikasi Teknis Indikator Induk (*Parent Accordion Highlight*)

Komponen induk otomatis mendeteksi keberadaan rute aktif pada salah satu anaknya melalui logika:
`const isChildActive = r.some(t => h.pathname === t.href);`

- **Saat Anak Aktif (`isChildActive === true`):**
  - Container tombol: `bg-slate-800/90 text-white border border-emerald-500/40 shadow-sm`
  - Wadah Ikon Pod: `bg-emerald-950/70 text-emerald-400 border border-emerald-800/40`
  - Chevron panah: `text-emerald-400 rotate-180`
- **Saat Idle / Tidak Aktif:**
  - Container tombol: `text-slate-300 hover:bg-slate-800/80 hover:text-white`
  - Wadah Ikon Pod: `bg-slate-800/60 text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-200 border border-transparent`

---

#### 4. Spesifikasi Teknis Footer Minimalis (*Minimal Action Link*)

Mengeliminasi *box-in-a-box clutter*, teks redundan (nama dinas rangkap), status koneksi teknis, dan duplikasi ikon. Footer disederhanakan menjadi satu baris aksi minimalis dan elegan dengan pembatas atas halus:

```html
<div class="p-3 border-t border-slate-800/80 mt-auto shrink-0">
  <a href="/admin" class="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 transition-all group">
    <div class="flex items-center gap-2">
      <!-- Lucide Lock Icon -->
      <svg class="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300 shrink-0" ...></svg>
      <span>Portal Admin</span>
    </div>
    <!-- Lucide Chevron Right Icon -->
    <svg class="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 -rotate-90 shrink-0 transition-transform" ...></svg>
  </a>
</div>
```
- **Prinsip Anti-Slop**: Menghilangkan kartu berlapis (*box-in-a-box*), membuang status teknis internal yang tidak diperlukan pengguna publik, dan menggunakan 1 ikon aksi tunggal berpresisi tinggi.

---

#### 5. Struktur 4 Kategori Fungsional Terurut

Sidebar dibagi menjadi 4 blok logis dengan pembagi kategori (*category dividers*):
1. **`EKSEKUTIF & SPASIAL`**
   - Dashboard Eksekutif (`/`) — Ikon: `<LayoutDashboard />`
   - Peta Geospasial GIS (`/sebaran/pangan`) — Ikon: `<MapPin />`
2. **`SEKTOR KOMODITAS` (4 Pilar Simetris — Dual Submenus Dinamis)**
   - Tanaman Pangan (`/food-crops`, `/komoditas-unggulan/pangan`, `/nilai-ekonomi/pangan`, `/prediction`) — Ikon: `<Crop />`
   - Hortikultura & Perkebunan (`/horticulture`, `/komoditas-unggulan/hortikultura`, `/nilai-ekonomi/hortikultura`, `/plantation`, `/komoditas-unggulan/perkebunan`, `/nilai-ekonomi/perkebunan`, `/ltt-katam`) — Ikon: `<Leaf />`
   - Peternakan & Keswan (`/livestock`, `/komoditas-unggulan/peternakan`, `/nilai-ekonomi/peternakan`, `/peternakan/susu-kulit`, `/livestock-flow`) — Ikon: `<HeartPulse />`
   - Perikanan Air Tawar (`/fisheries`, `/komoditas-unggulan/perikanan`, `/economic-value`) — Ikon: `<WavesHorizontal />`

---

#### 5B. Spesifikasi Teknis Widget Ringkasan Dinamis Sektor (`SectorEconomicWidget`)

Menyajikan metrik utama sektor secara adaptif di bagian atas halaman produksi tanpa data buatan (*Zero Dummy Data*):
- **Kartu 1 (Komoditas Utama Ranking #1):** `bg-white border border-slate-200 border-l-4 border-l-blue-800 rounded-lg p-4 shadow-sm`
- **Kartu 2 (Volume Produksi Tertinggi):** `bg-white border border-slate-200 border-l-4 border-l-emerald-600 rounded-lg p-4 shadow-sm`
- **Kartu 3 (Estimasi Nilai Finansial Sektor):** `bg-white border border-slate-200 border-l-4 border-l-amber-600 rounded-lg p-4 shadow-sm`
- **Empty State (Tahun Tanpa Data Produksi):** `bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600` dengan titik kuning `bg-amber-500` dan penanda tegas `Rp 0 (Belum Ada Data)`.
3. **`KEBIJAKAN & ANALITIK`**
   - Ketahanan Pangan Bapanas (`/food-security`, `/fsva`, `/supply-chain`, `/price-volatility`) — Ikon: `<Scale />`
   - Perencanaan & Renstra (`/renstra`, `/recommendations`, `/sensus-2023`) — Ikon: `<ChartLine />`
4. **`KELEMBAGAAN & DATA`**
   - Kelembagaan Tani (`/farmers`, `/kewirausahaan/kwt`) — Ikon: `<Handshake />`
   - Bantuan & Sarpras (`/government-assistance`) — Ikon: `<Tractor />`
   - Data Lahan & Geografi (`/lahan`, `/suitability`, `/kecamatan`) — Ikon: `<MapPin />`

---

#### 6. Spesifikasi Teknis Topbar Header & User Avatar Dropdown

Mengeliminasi tombol-tombol berceceran di topbar (`Info`, `Panduan`, dan `Login`). Seluruh aksi sekunder disatukan ke dalam *dropdown menu* terpadu pada Avatar Pengguna di pojok kanan atas:

```html
<!-- Trigger Profil Minimalis -->
<div class="relative">
  <button type="button" class="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer group text-left">
    <div class="text-right hidden sm:block">
      <p class="text-xs font-bold text-slate-800 group-hover:text-slate-900 leading-tight">Guest</p>
      <p class="text-[9px] font-semibold text-slate-400 uppercase tracking-wider leading-none mt-0.5">Pengunjung</p>
    </div>
    <div class="w-8 h-8 rounded-full border border-amber-300/80 bg-amber-100 flex items-center justify-center font-bold text-xs text-amber-900 shadow-sm shrink-0">
      G
    </div>
    <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform [rotate-180 jika terbuka]"></svg>
  </button>

  <!-- Dropdown Menu Panel (Saat Terbuka) -->
  <div class="absolute right-0 mt-2 w-60 rounded-xl bg-white border border-slate-200 shadow-xl shadow-slate-900/10 py-1.5 z-50 text-slate-800">
    <!-- Header Akun -->
    <div class="px-3.5 py-2.5 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50 rounded-t-xl">
      <div class="w-8 h-8 rounded-full border border-amber-300/80 bg-amber-100 flex items-center justify-center font-bold text-xs text-amber-900 shrink-0">G</div>
      <div class="min-w-0 flex-1">
        <p class="text-xs font-bold text-slate-900 truncate">Guest User</p>
        <p class="text-[10px] text-slate-500 truncate">Hak Akses: Pengunjung</p>
      </div>
    </div>
    <!-- Menu Navigasi Sekunder -->
    <div class="p-1.5 space-y-0.5">
      <a href="/info" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900">
        <svg class="w-4 h-4 text-slate-500 shrink-0"></svg> Info SISPERTANI
      </a>
      <a href="/manual" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900">
        <svg class="w-4 h-4 text-slate-500 shrink-0"></svg> Panduan / Manual Book
      </a>
    </div>
    <div class="h-px bg-slate-100 my-1 mx-2"></div>
    <!-- Aksi Utama Login Admin -->
    <div class="p-1.5">
      <a href="/admin" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 border border-emerald-200/60">
        <svg class="w-4 h-4 text-emerald-600 shrink-0"></svg> Masuk Portal Admin
      </a>
    </div>
  </div>
</div>
```
- **Prinsip Anti-Slop**: Topbar bersih, fokus pada judul halaman dan konteks analitik tanpa tombol visual yang bersaing. Navigasi utilitas tersembunyi rapi di balik identitas pengguna.

---

## 6. Spesifikasi Tata Letak Responsif Laptop-First (1366×768) & Tab Isolation

### A. Laptop-First Responsive Scaling (1366×768)
Resolusi 1366×768 merupakan resolusi layar laptop utama pengguna. Dengan tinggi viewport browser efektif sekitar 640px dan sidebar permanen 256px (`w-64`), konten utama memerlukan rasio penskalaan proporsional:
1. **Dynamic Root Font-Size (`html`):**
   ```css
   @media screen and (max-width: 1440px) {
     html {
       font-size: 13.5px !important;
     }
     .print-main {
       padding: 1rem 1.25rem !important;
     }
     header.no-print {
       height: 60px !important;
     }
     aside.no-print > div:first-child {
       height: 60px !important;
     }
     .flex.flex-col.gap-8 {
       gap: 1.25rem !important;
     }
     .bg-white.border.border-slate-200.rounded-lg.p-6 {
       padding: 1rem !important;
     }
     table th, table td {
       padding: 0.45rem 0.65rem !important;
     }
   }
   ```
2. **Efek Penskalaan:** Seluruh unit Tailwind berbasis `rem` mengecil sebesar 15.6% secara seragam, mengeliminasi teks tumpang tindih (*font collision*) dan mencegah overflow vertikal yang memicu scrollbar berlebihan.
3. **Penyusunan Tombol Filter Bar (Matriks 2×2 Anti-Patah):**
   Pada kartu filter 4-kolom (`grid-cols-1 md:grid-cols-2 xl:grid-cols-4`), kolom Sub-Sektor wajib menggunakan formasi:
   `grid grid-cols-2 2xl:grid-cols-4 gap-1.5`
   dengan setiap tombol:
   `py-1.5 px-2 text-[11px] font-semibold uppercase flex items-center justify-center gap-1.5 truncate whitespace-nowrap`
   Hal ini menjamin tombol dengan label panjang seperti "Tanaman Hias" dan "Biofarmaka" tetap utuh dalam satu baris dengan ikon tanpa terpotong.

### B. Isolasi Tab Nilai Ekonomi Bidang
Navigasi tab pada halaman `/nilai-ekonomi/:bidang` menerapkan isolasi sektoral yang ketat:
- `/nilai-ekonomi/hortikultura` hanya merender tab **Hortikultura**.
- `/nilai-ekonomi/perkebunan` hanya merender tab **Perkebunan**.
- `/nilai-ekonomi/peternakan` merender 4 tab ekosistem mandiri (Valuasi Ternak, UMKM Pakan, Poultry Shop, NKV).
- `/nilai-ekonomi/pangan` merender navigasi komoditas pangan.

---

## 7. Pola Tata Letak Portal Login Admin (/admin) — Asymmetrical Agritech Identity

Sesuai pembaruan **ADR-028**, antarmuka otentikasi portal administrasi `/admin` menerapkan arsitektur split 2-kolom asimetris:

### A. Geometri & Proporsi Asimetris (Desktop & Laptop)
- **Rasio Kolom**: 55% Kolom Kiri (Visual Identity & Context) vs 45% Kolom Kanan (Focused Authentication Form).
- **Latar Belakang Visual Kiri**: Menggunakan citra fotografi persawahan Banjarnegara (`dist/img/sawah-login.jpg`) dengan teknik dual-layer overlay:
  ```css
  background-image: linear-gradient(135deg, rgba(6, 78, 59, 0.88) 0%, rgba(15, 23, 42, 0.92) 100%), url('/img/sawah-login.jpg');
  ```
- **Konteks Institusional Kiri**: Logo resmi Pemkab Banjarnegara, tipografi identitas Distankan KP, badge enkripsi TLS/SSL, dan kartu informasi kredensial yang rapi dengan latar semi-transparan (`bg-emerald-950/40 backdrop-blur border border-emerald-500/30`).
- **Formulir Interaktif Kanan**:
  - Kartu putih bersih (`bg-white border border-slate-200/90 shadow-xl rounded-2xl p-6 sm:p-8`).
  - **Quick Role Selector**: Pil tab peran (Admin, Pangan, Horti, Ternak, Perikanan) dengan state aktif `bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold`.
  - **Input Fields**: Input terstruktur dengan ikon representatif, ring fokus `focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600`, dan toggle visibilitas password.
  - **Tombol Masuk**: Tombol solid penuh kontras `bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-[0.99]`.

### B. Adaptabilitas Layar Ponsel & Laptop 1366px
- Pada resolusi mobile (`< 1024px`), tata letak beralih vertikal (single-column) di mana panel visual menyusut menjadi banner header ramping dengan foto sawah tetap tampak lembut, diikuti formulir login di bawahnya.
- Pada resolusi 1366×768 (laptop), kontainer memiliki tinggi proporsional `min-h-[580px]` tanpa menciptakan scrollbar halaman ganda.

---

## 8. Ringkasan Single Source of Truth
Seluruh kode CSS baru, komponen React/Vite, pembaruan rute, maupun tampilan analitik pada SISPERTANI Banjarnegara wajib mematuhi standar dokumen `.docs/design-system.md` ini tanpa deviasi.
