import openpyxl
import json

wb = openpyxl.load_workbook('dist/kelembagaan/rekapitulasi.xlsx', data_only=True)
s = wb.active

data = []
for i in range(7, 27): # baris 7 s.d. 26 di excel (1-indexed)
    r = [s.cell(row=i, column=col).value for col in range(1, 10)]
    if not r[1] or str(r[1]).strip() == 'JUMLAH':
        continue
    no_str = str(r[0] or '').replace('.', '').strip()
    no = int(no_str) if no_str.isdigit() else (i - 6)
    kec = str(r[1]).strip()
    desa = int(r[2] or 0)
    gapoktan = int(r[3] or 0)
    poktan = int(r[4] or 0)
    p = int(r[5] or 0)
    l = int(r[6] or 0)
    m = int(r[7] or 0)
    u = int(r[8] or 0)

    data.append({
        "no": no,
        "kecamatan": kec,
        "desa": desa,
        "gapoktan": gapoktan,
        "poktan": poktan,
        "pemula": p,
        "lanjut": l,
        "madya": m,
        "utama": u
    })

print(f"Total kecamatan diekstrak: {len(data)}")
with open('dist/kelembagaan/rekapitulasi_cleaned.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Saved to dist/kelembagaan/rekapitulasi_cleaned.json")
