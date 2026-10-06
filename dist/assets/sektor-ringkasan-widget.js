import { C as a, b as o, p as s } from "./index-CI1XYnwk.js";

var React = a(o(), 1);
var jsx = s();

function formatRp(val) {
  if (!val || val <= 0) return "Rp 0";
  if (val >= 1e12) return "Rp " + (val / 1e12).toFixed(2).replace(".", ",") + " Triliun";
  if (val >= 1e9) return "Rp " + (val / 1e9).toFixed(2).replace(".", ",") + " Miliar";
  if (val >= 1e6) return "Rp " + (val / 1e6).toFixed(2).replace(".", ",") + " Juta";
  return "Rp " + Number(val).toLocaleString("id-ID");
}

export function SectorEconomicWidget({ sektor, subsektor, tahun }) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!sektor || !tahun) return;
    setLoading(true);
    let url = `/api/v1/ekonomi/sektor-ringkasan?sektor=${sektor}&tahun=${tahun}`;
    if (subsektor) url += `&subsektor=${encodeURIComponent(subsektor)}`;
    fetch(url)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [sektor, subsektor, tahun]);

  if (loading) {
    return (0, jsx.jsx)("div", {
      className: "bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-500 animate-pulse mb-4",
      children: "Memuat komoditas utama dan nilai ekonomi..."
    });
  }

  // Zero Dummy Data: jika status empty atau tidak ada komoditas
  if (!data || data.status === "empty" || !data.items || data.items.length === 0) {
    return (0, jsx.jsxs)("div", {
      className: "bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 mb-4",
      children: [
        (0, jsx.jsxs)("div", {
          className: "flex items-center gap-2.5",
          children: [
            (0, jsx.jsx)("span", { className: "inline-block w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" }),
            (0, jsx.jsxs)("span", {
              children: [
                "Data komoditas utama dan nilai ekonomi sektor untuk tahun ",
                (0, jsx.jsx)("strong", { className: "text-slate-800", children: tahun }),
                " belum tercatat / belum diunggah oleh bidang terkait."
              ]
            })
          ]
        }),
        (0, jsx.jsx)("span", {
          className: "font-semibold text-slate-500 bg-white px-3 py-1 rounded border border-slate-200 tabular-nums shrink-0",
          children: "Rp 0 (Belum Ada Data)"
        })
      ]
    });
  }

  const top1 = data.top1 || data.items[0];
  const totalNilai = data.totalNilaiEkonomiRp || 0;
  const jumlahKomoditas = data.jumlahKomoditas || data.items.length;

  return (0, jsx.jsxs)("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4",
    children: [
      // Card 1: Komoditas Utama (Ranking 1)
      (0, jsx.jsxs)("div", {
        className: "bg-white border border-slate-200 border-l-4 border-l-blue-800 rounded-lg p-4 shadow-sm",
        children: [
          (0, jsx.jsxs)("div", {
            className: "flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1",
            children: [
              (0, jsx.jsxs)("span", { children: ["Komoditas Utama (", tahun, ")"] }),
              (0, jsx.jsx)("span", { className: "text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full font-medium", children: "Ranking #1" })
            ]
          }),
          (0, jsx.jsx)("h3", {
            className: "text-lg font-bold text-slate-900 truncate mt-1",
            title: top1.komoditas,
            children: top1.komoditas
          }),
          (0, jsx.jsxs)("p", {
            className: "text-xs text-slate-500 mt-1",
            children: [
              "Sentra Utama: ",
              (0, jsx.jsx)("strong", { className: "text-slate-800 font-medium", children: top1.kecamatanSentra || "-" })
            ]
          })
        ]
      }),

      // Card 2: Volume Produksi
      (0, jsx.jsxs)("div", {
        className: "bg-white border border-slate-200 border-l-4 border-l-emerald-600 rounded-lg p-4 shadow-sm",
        children: [
          (0, jsx.jsxs)("div", {
            className: "flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1",
            children: [
              (0, jsx.jsx)("span", { children: "Volume Produksi Utama" }),
              (0, jsx.jsx)("span", { className: "text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium", children: "BPS / Dinas" })
            ]
          }),
          (0, jsx.jsxs)("h3", {
            className: "text-lg font-bold text-emerald-700 tabular-nums mt-1",
            children: [Number(top1.volumeProduksi).toLocaleString("id-ID"), " ", top1.satuan]
          }),
          (0, jsx.jsx)("p", {
            className: "text-xs text-slate-500 mt-1",
            children: "Volume produksi tertinggi di " + (subsektor ? "sub-sektor ini" : "sektor ini")
          })
        ]
      }),

      // Card 3: Nilai Ekonomi Sektor / Sub-Sektor
      (0, jsx.jsxs)("div", {
        className: "bg-white border border-slate-200 border-l-4 border-l-amber-600 rounded-lg p-4 shadow-sm",
        children: [
          (0, jsx.jsxs)("div", {
            className: "flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1",
            children: [
              (0, jsx.jsxs)("span", { children: [subsektor ? "Nilai Ekonomi Sub-Sektor (" : "Nilai Ekonomi Sektor (", tahun, ")"] }),
              (0, jsx.jsxs)("span", { className: "text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-medium", children: [jumlahKomoditas, " Komoditas"] })
            ]
          }),
          (0, jsx.jsx)("h3", {
            className: "text-lg font-bold text-slate-900 tabular-nums mt-1",
            children: formatRp(totalNilai)
          }),
          (0, jsx.jsx)("p", {
            className: "text-xs text-slate-500 mt-1",
            children: totalNilai > 0 ? "Volume riil × harga acuan produsen" : "Menunggu penetapan harga resmi dinas"
          })
        ]
      })
    ]
  });
}
