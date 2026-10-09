# TODO: SISPERTANI — Data Readiness & Audit Dashboard

## Status: Siap Eksekusi (Pragmatic & Anti-Over-Engineering)
Fitur monitoring kesiapan data (Data Readiness Radar) untuk Super Admin guna memantau kelengkapan data database per bidang/menu publik dan mempermudah rekonsiliasi data.

---

### Fase 1: Backend Audit Kesiapan Data (/api/v1/admin/readiness)
- [ ] Buat fungsi audit `getReadinessAudit()` di `src/lib/domains.js` yang menghitung baris tabel-tabel di `DOMAINS` secara batch via `COUNT(*)` dan mendeteksi ketersediaan fallback disk
- [ ] Daftarkan endpoint `GET /api/v1/admin/readiness` di `src/routes/admin.js` dengan guard `requireAdmin` + `requireAdminRole`
- [ ] Lakukan verifikasi faktual respon JSON endpoint via script/curl (memastikan response time < 50ms)

### Fase 2: Antarmuka Dasbor Super Admin (scripts/build_admin_view.js)
- [ ] Tambahkan pemanggilan `fetch('/api/v1/admin/readiness')` saat sesi `isAdmin === true`
- [ ] Rancang 4 kartu ringkasan kesiapan (Persentase Kesiapan Publik, Sektor Mandiri, Sektor Penyangga/Fallback, Sektor Belum Ada Data)
- [ ] Rancang tabel matriks status sektor yang memetakan menu frontend, status data (🟢 Mandiri / 🟡 Penyangga / 🔴 Belum Ada), jumlah baris, tombol filter katalog, dan tombol salin format tagihan data ke clipboard
- [ ] Kompilasi ulang aset admin ke `dist/assets/admin-C9Dakcgq.js` via `node scripts/build_admin_view.js`

### Fase 3: Verifikasi Faktual & Sinkronisasi Dokumentasi
- [ ] Uji fungsionalitas dan tampilan dasbor di `http://127.0.0.1:5173/admin`
- [ ] Verifikasi kepatuhan anti-slop (bahasa lugas, tanpa jargon berlebihan, responsif 1366x768 & mobile)
- [ ] Perbarui dokumentasi `.docs/routes.md`, `.docs/api-spec.md`, `.docs/architecture.md`, dan `app-context.md`
- [ ] Git commit dan push ke repositori GitHub
