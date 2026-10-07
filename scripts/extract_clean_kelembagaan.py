import os
import sys
import pandas as pd
import numpy as np
import json

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"E:\Project\pertanian_main\dist\kelembagaan"

# 1. FILE 1: POKTAN & GAPOKTAN
p1 = os.path.join(base_dir, "KELEMBAGAAN Kelompok Tani KAB. BANJARNEGARA.xlsx")
df1 = pd.read_excel(p1, header=None)
raw1 = df1.iloc[7:].copy().reset_index(drop=True)

# Forward fill kolom hirarkis
raw1[1] = raw1[1].ffill().astype(str).str.strip() # Kecamatan
raw1[2] = raw1[2].ffill().astype(str).str.strip() # Desa
raw1[3] = raw1[3].ffill().astype(str).str.strip() # Gapoktan
raw1[4] = raw1[4].ffill() # Reg Gapoktan

is_subtotal = pd.to_numeric(raw1[5], errors='coerce').notna()
poktan = raw1[raw1[5].notna() & ~is_subtotal].copy().reset_index(drop=True)

poktan_list = []
for idx, r in poktan.iterrows():
    nama = str(r[5]).strip()
    is_kwt = "KWT" in nama.upper() or "WANITA" in nama.upper()
    jenis = "KWT" if is_kwt else "Poktan"

    # No reg poktan
    reg_p = str(r[6]).strip() if pd.notna(r[6]) and str(r[6]).strip().lower() != 'nan' else None

    # Kelas kemampuan
    kelas = "Belum Dinilai"
    if pd.notna(r[13]) and str(r[13]).strip() not in ['', 'nan']:
        kelas = "Pemula"
    elif pd.notna(r[14]) and str(r[14]).strip() not in ['', 'nan']:
        kelas = "Lanjut"
    elif pd.notna(r[15]) and str(r[15]).strip() not in ['', 'nan']:
        kelas = "Madya"
    elif pd.notna(r[16]) and str(r[16]).strip() not in ['', 'nan']:
        kelas = "Utama"

    # Subsektor
    subsektor = "Tanaman Pangan"
    if pd.notna(r[7]) and str(r[7]).strip() not in ['', 'nan']:
        subsektor = "Tanaman Pangan"
    elif pd.notna(r[8]) and str(r[8]).strip() not in ['', 'nan']:
        subsektor = "Hortikultura"
    elif pd.notna(r[10]) and str(r[10]).strip() not in ['', 'nan']:
        subsektor = "Peternakan"
    elif pd.notna(r[9]) and str(r[9]).strip() not in ['', 'nan']:
        subsektor = "Perkebunan"
    elif pd.notna(r[11]) and str(r[11]).strip() not in ['', 'nan']:
        subsektor = "Campuran"

    # Luas lahan
    try:
        luas = float(r[17]) if pd.notna(r[17]) else 0.0
    except:
        luas = 0.0

    # Anggota
    try:
        anggota = int(r[20]) if pd.notna(r[20]) else 0
    except:
        anggota = 0

    # Ketua & HP
    ketua = str(r[21]).strip() if pd.notna(r[21]) and str(r[21]).strip().lower() != 'nan' else "Belum Terdata"
    hp = str(r[22]).strip() if pd.notna(r[22]) and str(r[22]).strip().lower() != 'nan' else None

    # Penyuluh & HP
    penyuluh = str(r[23]).strip() if pd.notna(r[23]) and str(r[23]).strip().lower() != 'nan' else None
    penyuluh_hp = str(r[24]).strip() if pd.notna(r[24]) and str(r[24]).strip().lower() != 'nan' else None

    # Gapoktan Induk
    gapoktan = str(r[3]).strip() if pd.notna(r[3]) and str(r[3]).strip().lower() != 'nan' else None

    poktan_list.append({
        "kecamatan": str(r[1]).title(),
        "desa": str(r[2]),
        "jenis_lembaga": jenis,
        "nama_kelompok": nama,
        "gapoktan_induk": gapoktan,
        "id_simluhtan": reg_p,
        "no_sk_pengukuhan": None,
        "nama_ketua": ketua,
        "kontak_hp": hp,
        "kelas_kemampuan": kelas,
        "subsektor_utama": subsektor,
        "jumlah_anggota": anggota,
        "luas_lahan_ha": round(luas, 2),
        "penyuluh_pendamping": penyuluh,
        "penyuluh_hp": penyuluh_hp,
        "tahun_berdiri": None,
        "status_aktif": "Aktif"
    })

# 2. GAPOKTAN DARI FILE 1 & FILE 5
# Kumpulkan Gapoktan unik dari File 1
gapoktan_map = {}
for p in poktan_list:
    g_name = p["gapoktan_induk"]
    if g_name and g_name != '-' and g_name.lower() != 'nan':
        key = (p["kecamatan"], p["desa"], g_name)
        if key not in gapoktan_map:
            gapoktan_map[key] = {
                "kecamatan": p["kecamatan"],
                "desa": p["desa"],
                "jenis_lembaga": "Gapoktan",
                "nama_kelompok": g_name,
                "gapoktan_induk": None,
                "id_simluhtan": None,
                "no_sk_pengukuhan": None,
                "nama_ketua": "Pengurus Gapoktan",
                "kontak_hp": None,
                "kelas_kemampuan": "Madya",
                "subsektor_utama": "Tanaman Pangan",
                "jumlah_anggota": 0,
                "luas_lahan_ha": 0.0,
                "penyuluh_pendamping": p["penyuluh_pendamping"],
                "penyuluh_hp": p["penyuluh_hp"],
                "tahun_berdiri": None,
                "status_aktif": "Aktif"
            }

gapoktan_list = list(gapoktan_map.values())

# 3. FILE 2: KEP
p2 = os.path.join(base_dir, "KEP.xlsx")
df2 = pd.read_excel(p2, header=None)
raw2 = df2.iloc[5:].copy().reset_index(drop=True)
raw2 = raw2[raw2[3].notna() & ~raw2[3].astype(str).str.upper().str.contains("TOTAL|JUMLAH")].copy()

kep_list = []
for idx, r in raw2.iterrows():
    try:
        modal = float(r[16]) if pd.notna(r[16]) else 0.0
    except:
        modal = 0.0
    try:
        pengurus = int(r[13]) if pd.notna(r[13]) else 0
    except:
        pengurus = 0
    try:
        anggota = int(r[14]) if pd.notna(r[14]) else 0
    except:
        anggota = 0
    try:
        poktan_terlibat = int(r[15]) if pd.notna(r[15]) else 0
    except:
        poktan_terlibat = 0

    # r[1] is Kabupaten, r[2] is BPP (Kecamatan)
    bpp_name = str(r[2]).strip().title() if pd.notna(r[2]) and str(r[2]).strip().lower() != 'nan' else "Banjarnegara"
    kep_list.append({
        "kecamatan": bpp_name,
        "bpp": bpp_name,
        "nama_kep": str(r[3]).strip(),
        "alamat": str(r[4]).strip() if pd.notna(r[4]) else None,
        "penyuluh_pendamping": str(r[5]).strip() if pd.notna(r[5]) else None,
        "penyuluh_hp": str(r[6]).strip() if pd.notna(r[6]) else None,
        "bentuk_kep": str(r[7]).strip() if pd.notna(r[7]) else "LKM",
        "dasar_hukum": str(r[8]).strip() if pd.notna(r[8]) and str(r[8]).strip().lower() != 'nan' else None,
        "ada_struktur": "Ada" if "ada" in str(r[9]).lower() else "Tidak",
        "ada_ad_art": "Ada" if "ada" in str(r[10]).lower() else "Tidak",
        "komoditas": str(r[11]).strip() if pd.notna(r[11]) else None,
        "jenis_usaha": str(r[12]).strip() if pd.notna(r[12]) else None,
        "jumlah_pengurus": pengurus,
        "jumlah_anggota": anggota,
        "poktan_terlibat": poktan_terlibat,
        "modal_usaha_aset": modal,
        "status_aktif": "Aktif"
    })

# 4. FILE 3: POSLUHDES
p3 = os.path.join(base_dir, "posluhdes.xlsx")
df3 = pd.read_excel(p3, header=None)
raw3 = df3.iloc[5:].copy().reset_index(drop=True)
raw3 = raw3[raw3[4].notna() & ~raw3[4].astype(str).str.upper().str.contains("TOTAL|JUMLAH")].copy()

posluhdes_list = []
for idx, r in raw3.iterrows():
    posluhdes_list.append({
        "kabupaten": "Banjarnegara",
        "bpp": str(r[2]).strip(),
        "desa": str(r[3]).strip(),
        "nama_posluhdes": str(r[4]).strip(),
        "alamat": str(r[5]).strip() if pd.notna(r[5]) else None,
        "nama_pimpinan": str(r[6]).strip() if pd.notna(r[6]) else None,
        "no_ba_pengukuhan": str(r[7]).strip() if pd.notna(r[7]) and str(r[7]).strip().lower() != 'nan' else None,
        "penyuluh_swadaya": str(r[8]).strip() if pd.notna(r[8]) else None,
        "alamat_penyuluh": str(r[9]).strip() if pd.notna(r[9]) else None,
        "kontak_hp": str(r[10]).strip() if pd.notna(r[10]) and str(r[10]).strip().lower() != 'nan' else None
    })

# 5. FILE 4: PPS
p4 = os.path.join(base_dir, "PPS.xlsx")
df4 = pd.read_excel(p4, header=None)
raw4 = df4.iloc[5:].copy().reset_index(drop=True)
raw4 = raw4[raw4[1].notna() & ~raw4[1].astype(str).str.upper().str.contains("TOTAL|JUMLAH")].copy()

pps_list = []
for idx, r in raw4.iterrows():
    def c_mark(val):
        return 1 if pd.notna(val) and str(val).strip() not in ['', 'nan'] else 0

    pps_list.append({
        "nama_penyuluh": str(r[1]).strip(),
        "tempat_tgl_lahir": str(r[2]).strip() if pd.notna(r[2]) else None,
        "unit_kerja": str(r[3]).strip(),
        "pendidikan": str(r[4]).strip() if pd.notna(r[4]) else None,
        "keahlian_tp": c_mark(r[5]),
        "keahlian_nak": c_mark(r[6]),
        "keahlian_bun": c_mark(r[7]),
        "keahlian_horti": c_mark(r[8]),
        "keahlian_lainnya": c_mark(r[9]),
        "wilayah_kerja": str(r[10]).strip() if pd.notna(r[10]) else None,
        "kontak_hp": str(r[11]).strip() if pd.notna(r[11]) and str(r[11]).strip().lower() != 'nan' else None
    })

output_data = {
    "poktan": poktan_list,
    "gapoktan": gapoktan_list,
    "kep": kep_list,
    "posluhdes": posluhdes_list,
    "pps": pps_list
}

out_path = os.path.join(base_dir, "data_kelembagaan_cleaned.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print(f"Ekstraksi Selesai! Data disimpan di {out_path}")
print(f"Poktan: {len(poktan_list)}")
print(f"Gapoktan: {len(gapoktan_list)}")
print(f"KEP: {len(kep_list)}")
print(f"Posluhdes: {len(posluhdes_list)}")
print(f"PPS: {len(pps_list)}")
