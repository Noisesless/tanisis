import urllib.request
import json

base = "http://127.0.0.1:5173/sispertani-api/v1/kelembagaan"
endpoints = [
    "/pertanian",
    "/kep",
    "/posluhdes",
    "/pps",
    "/rekap-validasi",
    "/perikanan",
    "/p4s",
    "/upja",
    "/juleha",
    "/summary"
]

print("=== VERIFIKASI ENDPOINT KELEMBAGAAN ===")
all_ok = True
for ep in endpoints:
    url = base + ep
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            status = resp.status
            total = len(data.get('data') or data.get('rows') or [])
            if ep == "/summary":
                print(f"[OK 200] {ep} -> Status: {data.get('status')}, Pertanian types: {len(data.get('pertanian', []))}")
            else:
                print(f"[OK {status}] {ep} -> Total records: {total}")
    except Exception as e:
        print(f"[FAIL] {ep} -> Error: {e}")
        all_ok = False

if all_ok:
    print("SEMUA ENDPOINT KELEMBAGAAN BERFUNGSI 100%!")
