import { q } from "../src/db.js";

async function patchKomoditasUnggulan() {
  console.log("=== SINKRONISASI DATA KOMODITAS UNGGULAN DENGAN DATA RESMI KABUPATEN ===");

  // 1. Perbarui Jagung berdasarkan data resmi palawija_produksi 2024
  // Sentra: Purwanegara (20.993 Ton), Total Kabupaten: 51.146 Ton
  await q(`
    UPDATE komoditas_unggulan 
    SET total_produksi = 51146, 
        kecamatan_sentra = 'Purwanegara', 
        nilai_ekonomi_estimasi = 255730000000, 
        is_unggulan = 1
    WHERE LOWER(nama_komoditas) = 'jagung' AND tahun = 2024
  `);
  console.log("[OK] Jagung disinkronkan ke 51.146 Ton (Sentra Purwanegara)");

  // 2. Perbarui Ubi Kayu berdasarkan data resmi palawija_produksi 2024
  // Sentra: Purwanegara (39.229 Ton), Total Kabupaten: 78.886 Ton
  await q(`
    UPDATE komoditas_unggulan 
    SET total_produksi = 78886, 
        kecamatan_sentra = 'Purwanegara', 
        nilai_ekonomi_estimasi = 157772000000, 
        is_unggulan = 1
    WHERE LOWER(nama_komoditas) = 'ubi kayu' AND tahun = 2024
  `);
  console.log("[OK] Ubi Kayu disinkronkan ke 78.886 Ton (Sentra Purwanegara)");

  // 3. Perbarui Wortel berdasarkan data resmi horti_produksi_kabupaten 2024 (48.031 Ton)
  // Kawasan sentra dataran tinggi: Batur (Dieng)
  await q(`
    UPDATE komoditas_unggulan 
    SET total_produksi = 48031, 
        kecamatan_sentra = 'Batur', 
        nilai_ekonomi_estimasi = 192124000000, 
        is_unggulan = 1
    WHERE LOWER(nama_komoditas) = 'wortel' AND tahun = 2024
  `);
  console.log("[OK] Wortel disinkronkan ke 48.031 Ton (Sentra Batur)");

  // 4. Perbarui Kapulaga berdasarkan data resmi biofarmaka 2024 (930.421 tangkai)
  // Sentra biofarmaka: Pagentan / Banjarmangu
  await q(`
    UPDATE komoditas_unggulan 
    SET total_produksi = 930421, 
        satuan = 'tangkai', 
        kecamatan_sentra = 'Pagentan', 
        nilai_ekonomi_estimasi = 4652105000, 
        is_unggulan = 1
    WHERE LOWER(nama_komoditas) = 'kapulaga' AND tahun = 2024
  `);
  console.log("[OK] Kapulaga disinkronkan ke 930.421 tangkai");

  // 5. Untuk komoditas non-unggulan / bernilai 0 di Banjarnegara (Cengkeh, Tebu, Kopi Arabika, Bawang Merah non-sentra):
  // Set is_unggulan = 0 agar tidak menjadi false-flag komoditas unggulan
  await q(`
    UPDATE komoditas_unggulan 
    SET is_unggulan = 0 
    WHERE total_produksi = 0
  `);
  console.log("[OK] Komoditas dengan produksi 0 dinonaktifkan dari status unggulan (is_unggulan = 0)");

  // Verifikasi hasil
  const hasil = await q("SELECT nama_komoditas, total_produksi, satuan, kecamatan_sentra, is_unggulan FROM komoditas_unggulan WHERE is_unggulan = 1 ORDER BY total_produksi DESC");
  console.log("=== DAFTAR KOMODITAS UNGGULAN AKTIF (FAKTUAL) ===");
  console.table(hasil);
}

patchKomoditasUnggulan().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
