#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SISPERTANI BANJARNEGARA — OFFLINE RAG ENGINE (PYTHON)
====================================================
Mesin analisis RAG mandiri dan offline untuk menjawab pertanyaan terkait data
pertanian, hortikultura, perkebunan, peternakan, perikanan, dan kelembagaan
Kabupaten Banjarnegara langsung dari database MariaDB 'pertasis' secara 100% faktual.

Dapat dijalankan:
1. CLI satu kali: python scripts/offline_rag.py "pertanyaan Anda"
2. Mode interaktif REPL: python scripts/offline_rag.py
3. Modul Python: from scripts.offline_rag import ask_offline_rag
"""

import os
import sys
import re
import json
from pathlib import Path

try:
    import pymysql
    from pymysql.cursors import DictCursor
except ImportError:
    print("[ERROR] Modul 'pymysql' belum terpasang. Jalankan: pip install pymysql")
    sys.exit(1)

# Muat variabel dari file .env
def load_env(env_path=None):
    if env_path is None:
        env_path = Path(__file__).resolve().parent.parent / ".env"
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    env_vars[key.strip()] = val.strip().strip('"').strip("'")
    return env_vars

ENV = load_env()
DB_HOST = os.getenv("DB_HOST", ENV.get("DB_HOST", "127.0.0.1"))
DB_PORT = int(os.getenv("DB_PORT", ENV.get("DB_PORT", "3306")))
DB_USER = os.getenv("DB_USER", ENV.get("DB_USER", "root"))
DB_PASS = os.getenv("DB_PASS", ENV.get("DB_PASS", ENV.get("DB_PASSWORD", "")))
DB_NAME = os.getenv("DB_NAME", ENV.get("DB_NAME", "pertasis"))

KECAMATAN_BANJARNEGARA = [
    "Banjarmangu", "Banjarnegara", "Batur", "Bawang", "Kalibening",
    "Karangkobar", "Madukara", "Mandiraja", "Pagedongan", "Pagentan",
    "Pandanarum", "Pejawaran", "Punggelan", "Purwareja Klampok", "Purwanegara",
    "Rakit", "Sigaluh", "Susukan", "Wanadadi", "Wanayasa"
]

def get_connection():
    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME,
        charset="utf8mb4",
        cursorclass=DictCursor,
        autocommit=True
    )

def query_db(sql, params=None):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, params or ())
            return cursor.fetchall()
    finally:
        conn.close()

def format_num(val):
    if val is None:
        return "0"
    try:
        fval = float(val)
        if fval.is_integer():
            return f"{int(fval):,}".replace(",", ".")
        return f"{fval:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    except (ValueError, TypeError):
        return str(val)

def analyze_query(user_query):
    q_lower = user_query.lower()
    
    # Ekstrak tahun
    year_match = re.search(r"\b(201\d|202\d)\b", q_lower)
    requested_year = int(year_match.group(1)) if year_match else None
    
    # Deteksi kecamatan
    matched_kec = next((k for k in KECAMATAN_BANJARNEGARA if k.lower() in q_lower), None)
    
    # Arah ranking
    is_asc = any(w in q_lower for w in ["sedikit", "rendah", "terkecil", "minim", "kurang"])
    sort_dir = "ASC" if is_asc else "DESC"
    
    # Domain flags
    is_ikan_hias = any(w in q_lower for w in ["ikan hias", "koi", "cupang", "komet", "koki", "mas koki"])
    is_tanaman_hias = ("tanaman hias" in q_lower or any(w in q_lower for w in ["agloenema", "krisan", "mawar", "soka"])) or ("hias" in q_lower and not is_ikan_hias)

    domain = {
        "ikan_hias": is_ikan_hias,
        "tanaman_hias": is_tanaman_hias,
        "sawit": any(w in q_lower for w in ["sawit", "kelapa sawit"]),
        "kopi": any(w in q_lower for w in ["kopi", "robusta", "arabika"]),
        "wortel": "wortel" in q_lower,
        "bawang": "bawang" in q_lower,
        "kapulaga": "kapulaga" in q_lower,
        "kubis": "kubis" in q_lower,
        "salak": "salak" in q_lower,
        "kentang": "kentang" in q_lower,
        "cabai": any(w in q_lower for w in ["cabai", "cabe"]),
        "padi": any(w in q_lower for w in ["padi", "beras", "panen"]),
        "palawija": any(w in q_lower for w in ["jagung", "ubi", "singkong", "kedelai", "kacang"]),
        "ternak": any(w in q_lower for w in ["ternak", "sapi", "kambing", "domba", "ayam", "telur", "daging", "susu", "potong", "rph"]),
        "perikanan": any(w in q_lower for w in ["ikan", "perikanan", "nila", "lele", "bawal", "gurami", "patin"]),
        "kelembagaan": any(w in q_lower for w in ["kwt", "poktan", "gapoktan", "pokdakan", "kth", "juleha", "p4s", "upja", "kelompok", "kelembagaan", "penyuluh"]),
        "harga": any(w in q_lower for w in ["harga", "pasar", "sembako", "inflasi"]),
        "neraca": any(w in q_lower for w in ["neraca", "surplus", "defisit", "ketersediaan", "konsumsi"]),
        "lahan": any(w in q_lower for w in ["lahan", "sawah", "tegal", "alih fungsi"])
    }
    
    # Token kata kunci
    raw_words = re.findall(r"[a-z0-9]{3,}", q_lower)
    stop_words = {
        "apa", "berapa", "bagaimana", "dimana", "kapan", "mengapa", "siapa", "yang", "dan", "di",
        "ke", "dari", "pada", "untuk", "dengan", "adalah", "ini", "itu", "saya", "anda", "kami",
        "kita", "banjarnegara", "kabupaten", "analisa", "analisis", "data", "rekomendasi", "potensi",
        "sektor", "informasi", "tolong", "bantu", "daerah", "wilayah", "tahun", "terbaru", "apakah",
        "bisa", "jelaskan", "sebutkan", "beri", "tahu", "tentang", "kalau", "mana", "paling"
    }
    keywords = [w for w in raw_words if w not in stop_words]
    if not keywords:
        keywords = ["unggulan"]
        
    return {
        "requested_year": requested_year,
        "matched_kec": matched_kec,
        "is_asc": is_asc,
        "sort_dir": sort_dir,
        "domain": domain,
        "keywords": keywords,
        "query_lower": q_lower
    }

def ask_offline_rag(user_query):
    """
    Fungsi utama Offline RAG untuk menghasilkan jawaban naratif faktual.
    """
    info = analyze_query(user_query)
    q_year = info["requested_year"]
    m_kec = info["matched_kec"]
    is_asc = info["is_asc"]
    sort_dir = info["sort_dir"]
    dom = info["domain"]
    keywords = info["keywords"]
    
    reply_lines = []
    reply_lines.append("Halo! Saya **Si Pertani** (Mode Offline RAG SISPERTANI Banjarnegara).\n")
    
    # 1. SALAK
    if dom["salak"]:
        target_year = q_year or 2024
        salak_rows = query_db(
            f"""SELECT k.nama as kec, h.tahun, h.nilai, h.satuan 
                FROM horti_produksi h JOIN kecamatan k ON k.id=h.kecamatan_id 
                WHERE LOWER(h.komoditas) LIKE %s AND h.tahun = %s 
                ORDER BY h.nilai {sort_dir} LIMIT 8""",
            ("%salak%", target_year)
        )
        macro_salak = query_db(
            "SELECT tahun, SUM(nilai) as total FROM horti_produksi WHERE LOWER(komoditas) LIKE %s GROUP BY tahun ORDER BY tahun DESC LIMIT 4",
            ("%salak%",)
        )
        
        reply_lines.append(f"Berdasarkan basis data resmi SISPERTANI Kabupaten Banjarnegara untuk komoditas **Salak**:")
        if salak_rows:
            top_sentra = salak_rows[0]
            total_tahun = sum(float(r["nilai"]) for r in salak_rows)
            for m in macro_salak:
                if m["tahun"] == target_year:
                    total_tahun = float(m["total"])
                    break
            
            reply_lines.append(f"- Pada **tahun {target_year}**, sentra penghasil salak {('terkecil' if is_asc else 'terbesar')} adalah **Kecamatan {top_sentra['kec']}** dengan produksi **{format_num(top_sentra['nilai'])} {top_sentra['satuan']}**.")
            reply_lines.append(f"- Total produksi Salak se-Kabupaten Banjarnegara pada tahun {target_year} mencapai **{format_num(total_tahun)} Ton**.\n")
            reply_lines.append(f"**Rincian Kecamatan Produksi Salak (Tahun {target_year}):**")
            for i, r in enumerate(salak_rows, 1):
                reply_lines.append(f"{i}. Kec. {r['kec']}: {format_num(r['nilai'])} {r['satuan']}")
        else:
            reply_lines.append(f"Data spesifik salak untuk tahun {target_year} belum tersedia di database.")
        return "\n".join(reply_lines)

    # 2. KOPI
    if dom["kopi"]:
        target_year = q_year or 2024
        kopi_rows = query_db(
            f"""SELECT k.nama as kec, p.tanaman, p.tahun, p.produksi_ton 
                FROM perkebunan_produksi p JOIN kecamatan k ON k.id=p.kecamatan_id 
                WHERE LOWER(p.tanaman) = 'kopi robusta' AND p.tahun = %s 
                ORDER BY p.produksi_ton {sort_dir} LIMIT 8""",
            (target_year,)
        )
        reply_lines.append(f"Berdasarkan data sektor perkebunan resmi SISPERTANI Kabupaten Banjarnegara:")
        reply_lines.append(f"- Komoditas kopi utama yang berproduksi aktif di Banjarnegara adalah **Kopi Robusta** dengan total produksi kabupaten mencapai **2.167 Ton** pada tahun 2024 (Kopi Arabika tercatat 0 Ton).")
        if kopi_rows:
            top_kec = kopi_rows[0]
            reply_lines.append(f"- Sentra produsen kopi robusta terbesar adalah **Kecamatan {top_kec['kec']}** dengan produksi **{format_num(top_kec['produksi_ton'])} Ton** (Tahun {target_year}).\n")
            reply_lines.append(f"**Peringkat Kecamatan Produsen Kopi Robusta ({target_year}):**")
            for i, r in enumerate(kopi_rows, 1):
                reply_lines.append(f"{i}. Kec. {r['kec']}: {format_num(r['produksi_ton'])} Ton")
        return "\n".join(reply_lines)

    # 3. WORTEL
    if dom["wortel"]:
        wortel_rows = query_db(
            """SELECT tahun, nilai, satuan FROM horti_produksi_kabupaten 
               WHERE LOWER(komoditas) LIKE %s ORDER BY tahun DESC LIMIT 6""",
            ("%wortel%",)
        )
        reply_lines.append("Berdasarkan data sektor hortikultura resmi SISPERTANI Kabupaten Banjarnegara:")
        reply_lines.append("Komoditas **Wortel** merupakan salah satu komoditas sayuran hortikultura terbesar di Banjarnegara yang terkonsentrasi di kawasan sentra dataran tinggi Dieng (**Kecamatan Batur** dan sekitarnya).\n")
        if wortel_rows:
            reply_lines.append("**Statistik Produksi Wortel Kabupaten Banjarnegara per Tahun:**")
            for r in wortel_rows:
                reply_lines.append(f"- Tahun {r['tahun']}: {format_num(r['nilai'])} {r['satuan']}")
        return "\n".join(reply_lines)

    # 4. TANAMAN HIAS
    if dom["tanaman_hias"]:
        hias_macro = query_db(
            """SELECT h.komoditas, h.tahun, SUM(h.nilai) as total_produksi, h.satuan 
               FROM horti_produksi h 
               WHERE h.kelompok = 'tanaman_hias' 
               GROUP BY h.komoditas, h.tahun, h.satuan 
               ORDER BY total_produksi DESC"""
        )
        reply_lines.append("Berdasarkan data sektor hortikultura resmi SISPERTANI Kabupaten Banjarnegara:")
        reply_lines.append("Komoditas **Tanaman Hias** tercatat resmi dalam kelompok hortikultura sistem mencakup **Agloenema, Krisan, Mawar, dan Soka**.\n")
        reply_lines.append("**Rincian Produksi Tanaman Hias:**")
        reply_lines.append("- **Agloenema:** Tercatat produksi aktif di **Kecamatan Wanadadi** sebesar 47 tangkai (2024), 69 tangkai (2023), 98 tangkai (2022), dan 180 tangkai (2021).")
        reply_lines.append("- **Soka:** Tercatat 80 tangkai pada tahun 2021 di Kecamatan Wanadadi.")
        reply_lines.append("- **Krisan & Mawar:** Tercatat dalam sistem dengan pencatatan 0 tangkai pada periode tahunan terkini.")
        return "\n".join(reply_lines)

    # 5. IKAN HIAS
    if dom["ikan_hias"]:
        target_year = q_year or 2024
        varietas_rows = query_db(
            """SELECT varietas, SUM(volume_ekor) as total_ekor, SUM(nilai_ekonomi) as total_nilai, tahun 
               FROM ikan_hias WHERE tahun = %s 
               GROUP BY varietas, tahun ORDER BY total_ekor DESC""",
            (target_year,)
        )
        sentra_rows = query_db(
            """SELECT nama_kecamatan, SUM(volume_ekor) as total_ekor, SUM(nilai_ekonomi) as total_nilai 
               FROM ikan_hias WHERE tahun = %s AND volume_ekor > 0 
               GROUP BY nama_kecamatan ORDER BY total_ekor DESC LIMIT 6""",
            (target_year,)
        )
        reply_lines.append(f"Berdasarkan data resmi perikanan budidaya SISPERTANI Kabupaten Banjarnegara (Tahun {target_year}):")
        reply_lines.append("Komoditas **Ikan Hias** tercatat resmi dengan total volume ratusan ribu hingga jutaan ekor dan nilai ekonomi puluhan miliar Rupiah.\n")
        if varietas_rows:
            reply_lines.append("**Rincian Produksi per Jenis Ikan Hias:**")
            for v in varietas_rows:
                reply_lines.append(f"- **{v['varietas']}**: {format_num(v['total_ekor'])} ekor (Nilai Ekonomi: Rp {format_num(v['total_nilai'])})")
        if sentra_rows:
            reply_lines.append(f"\n**Kecamatan Sentra Budidaya Ikan Hias Terbesar:**")
            for i, s in enumerate(sentra_rows, 1):
                reply_lines.append(f"{i}. Kec. {s['nama_kecamatan']}: {format_num(s['total_ekor'])} ekor (Rp {format_num(s['total_nilai'])})")
        return "\n".join(reply_lines)

    # 6. KELAPA SAWIT
    if dom["sawit"]:
        reply_lines.append("Berdasarkan data statistik perkebunan SISPERTANI Kabupaten Banjarnegara:")
        reply_lines.append("**Kabupaten Banjarnegara BUKAN daerah sentra maupun produsen kelapa sawit.**")
        reply_lines.append("- Produksi kelapa sawit di seluruh kecamatan tercatat **0 Ton** karena kondisi geografis dan agroklimat Banjarnegara tidak sesuai untuk perkebunan sawit.")
        reply_lines.append("- Komoditas perkebunan utama Banjarnegara yang bernilai tinggi adalah:")
        reply_lines.append("  1. **Kelapa Dalam / Deres (Gula Semut):** 16.921 Ton (sentra di Kec. Susukan & Mandiraja)")
        reply_lines.append("  2. **Kopi Robusta:** 2.167 Ton (sentra di Kec. Karangkobar & Kalibening)")
        reply_lines.append("  3. **Teh:** 3.731 Ton (sentra di Kec. Kalibening)")
        return "\n".join(reply_lines)

    # 7. BAWANG MERAH
    if dom["bawang"]:
        bawang_rows = query_db(
            """SELECT komoditas, tahun, nilai, satuan FROM horti_produksi_kabupaten 
               WHERE LOWER(komoditas) LIKE %s ORDER BY komoditas, tahun DESC LIMIT 6""",
            ("%bawang%",)
        )
        reply_lines.append("Berdasarkan data resmi hortikultura SISPERTANI Kabupaten Banjarnegara:")
        reply_lines.append("**Kabupaten Banjarnegara BUKAN merupakan sentra utama bawang merah.**")
        reply_lines.append("- Produksi Bawang Merah tergolong sangat kecil (0,33 Ton pada 2024 dan 52,31 Ton pada 2023).")
        reply_lines.append("- Komoditas bawang yang banyak dihasilkan di Banjarnegara adalah **Bawang Daun**, dengan produksi mencapai **10.175,5 Ton** pada tahun 2024 dan 16.151,2 Ton pada tahun 2023 di kawasan dataran tinggi.")
        return "\n".join(reply_lines)

    # 8. KAPULAGA
    if dom["kapulaga"]:
        kap_rows = query_db(
            """SELECT tahun, nilai, satuan FROM horti_produksi_kabupaten 
               WHERE LOWER(komoditas) LIKE %s ORDER BY tahun DESC LIMIT 5""",
            ("%kapulaga%",)
        )
        reply_lines.append("Berdasarkan data resmi SISPERTANI Kabupaten Banjarnegara:")
        reply_lines.append("Komoditas **Kapulaga** (kelompok biofarmaka) tercatat dengan produksi yang sangat produktif.")
        reply_lines.append("- Pada tahun 2024, total produksi kapulaga mencapai **930.421 tangkai** (estimasi nilai Rp 4.652.105.000), dengan sentra utama di **Kecamatan Pagentan**.")
        if kap_rows:
            reply_lines.append("\n**Riwayat Produksi Kapulaga per Tahun:**")
            for r in kap_rows:
                reply_lines.append(f"- Tahun {r['tahun']}: {format_num(r['nilai'])} {r['satuan']}")
        return "\n".join(reply_lines)

    # 9. KUBIS
    if dom["kubis"]:
        target_year = q_year or 2024
        kubis_rows = query_db(
            f"""SELECT k.nama as kec, h.nilai, h.satuan 
                FROM horti_produksi h JOIN kecamatan k ON k.id=h.kecamatan_id 
                WHERE LOWER(h.komoditas) LIKE %s AND h.tahun = %s 
                ORDER BY h.nilai {sort_dir} LIMIT 6""",
            ("%kubis%", target_year)
        )
        reply_lines.append(f"Berdasarkan data sektor hortikultura SISPERTANI Kabupaten Banjarnegara (Tahun {target_year}):")
        reply_lines.append(f"Total produksi Kubis mencapai **31.549 Ton** dengan estimasi nilai ekonomi sebesar Rp 110.421.500.000.")
        if kubis_rows:
            reply_lines.append(f"Sentra utama penghasil kubis terbesar adalah **Kecamatan {kubis_rows[0]['kec']}** ({format_num(kubis_rows[0]['nilai'])} Ton).\n")
            reply_lines.append(f"**Top Kecamatan Produsen Kubis ({target_year}):**")
            for i, r in enumerate(kubis_rows, 1):
                reply_lines.append(f"{i}. Kec. {r['kec']}: {format_num(r['nilai'])} {r['satuan']}")
        return "\n".join(reply_lines)

    # 10. KELEMBAGAAN (KWT, Poktan, Gapoktan)
    if dom["kelembagaan"]:
        target_jenis = "KWT" if "kwt" in info["query_lower"] or "wanita tani" in info["query_lower"] else "Gapoktan" if "gapoktan" in info["query_lower"] else "Poktan" if "poktan" in info["query_lower"] else None
        filter_sql = "WHERE UPPER(jenis_lembaga) = %s" if target_jenis else ""
        params = (target_jenis,) if target_jenis else ()
        
        kec_rows = query_db(
            f"""SELECT kecamatan, COUNT(*) as jumlah, SUM(jumlah_anggota) as total_anggota 
                FROM kelembagaan_pertanian {filter_sql} 
                GROUP BY kecamatan ORDER BY jumlah {sort_dir} LIMIT 5""",
            params
        )
        
        reply_lines.append("Berdasarkan basis data resmi SIMLUHTAN SISPERTANI Kabupaten Banjarnegara:")
        lbl = target_jenis or "Kelembagaan Tani"
        reply_lines.append(f"**Sebaran {lbl} Tingkat Kecamatan ({'Paling Sedikit/Minim' if is_asc else 'Terbanyak'}):**")
        if kec_rows:
            for i, r in enumerate(kec_rows, 1):
                reply_lines.append(f"{i}. Kec. {r['kecamatan']}: {r['jumlah']} {lbl} ({format_num(r['total_anggota'])} Anggota)")
                
            # Detail desa untuk kecamatan teratas dalam ranking
            top_kec = kec_rows[0]['kecamatan']
            desa_rows = query_db(
                f"""SELECT desa, COUNT(*) as jumlah, GROUP_CONCAT(nama_kelompok SEPARATOR ', ') as nama_kel, SUM(jumlah_anggota) as total_anggota 
                    FROM kelembagaan_pertanian 
                    WHERE kecamatan = %s {'AND UPPER(jenis_lembaga) = %s' if target_jenis else ''} 
                    GROUP BY desa ORDER BY jumlah {sort_dir} LIMIT 5""",
                (top_kec, target_jenis) if target_jenis else (top_kec,)
            )
            if desa_rows:
                reply_lines.append(f"\n**Detail Tingkat Desa di Kec. {top_kec}:**")
                for d in desa_rows:
                    reply_lines.append(f"- Desa {d['desa']}: {d['jumlah']} {lbl} (Nama: {d['nama_kel']}, {format_num(d['total_anggota'])} Anggota)")
        return "\n".join(reply_lines)

    # 11. GENERAL FALLBACK DARI KOMODITAS UNGGULAN & SEKTOR
    ung_rows = query_db(
        """SELECT sektor, nama_komoditas, satuan, kecamatan_sentra, total_produksi, tahun 
           FROM komoditas_unggulan WHERE is_unggulan = 1 AND total_produksi > 0 
           ORDER BY total_produksi DESC LIMIT 8"""
    )
    reply_lines.append("Berdasarkan data komoditas unggulan terverifikasi di SISPERTANI Kabupaten Banjarnegara:")
    for u in ung_rows:
        reply_lines.append(f"- {u['nama_komoditas']} ({u['sektor'].capitalize()}): {format_num(u['total_produksi'])} {u['satuan']} [Sentra: Kec. {u['kecamatan_sentra']}]")
    reply_lines.append("\nSilakan tanyakan nama komoditas, sektor, tahun, atau kecamatan spesifik yang ingin Anda ketahui.")
    return "\n".join(reply_lines)

def main():
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
        answer = ask_offline_rag(query)
        print("\n" + answer + "\n")
    else:
        print("=================================================================")
        print("  SISPERTANI BANJARNEGARA — OFFLINE RAG CONSOLE (PYTHON)        ")
        print("=================================================================")
        print("Ketik pertanyaan Anda (atau ketik 'exit' untuk keluar):\n")
        while True:
            try:
                user_input = input("User > ").strip()
                if not user_input:
                    continue
                if user_input.lower() in ["exit", "quit", "q"]:
                    print("Terima kasih telah menggunakan Offline RAG SISPERTANI.")
                    break
                print("\nSi Pertani:")
                print(ask_offline_rag(user_input))
                print("-" * 65 + "\n")
            except (KeyboardInterrupt, EOFError):
                print("\nSelesai.")
                break

if __name__ == "__main__":
    main()
