import fs from "node:fs";
import path from "node:path";
import { q } from "../src/db.js";

async function seedKelembagaan() {
  console.log("=== MEMULAI SEEDER KELEMBAGAAN TANI DISTANKAN KP ===");
  const jsonPath = path.resolve("./dist/kelembagaan/data_kelembagaan_cleaned.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`File ${jsonPath} tidak ditemukan!`);
  }

  const raw = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw);

  // 1. SEED KELEMBAGAAN PERTANIAN (Poktan, KWT, Gapoktan)
  console.log("\n1. Mengisi tabel kelembagaan_pertanian...");
  await q("TRUNCATE TABLE kelembagaan_pertanian");

  const allPertanian = [...data.poktan, ...data.gapoktan];
  console.log(`Total baris kelembagaan pertanian: ${allPertanian.length} (${data.poktan.length} Poktan/KWT + ${data.gapoktan.length} Gapoktan)`);

  const batchSize = 300;
  for (let i = 0; i < allPertanian.length; i += batchSize) {
    const chunk = allPertanian.slice(i, i + batchSize);
    const values = [];
    const placeholders = [];

    for (const r of chunk) {
      placeholders.push("(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      values.push(
        r.kecamatan,
        r.desa,
        r.jenis_lembaga,
        r.nama_kelompok,
        r.gapoktan_induk || null,
        r.id_simluhtan || null,
        r.no_sk_pengukuhan || null,
        r.nama_ketua || "Belum Terdata",
        r.kontak_hp || null,
        r.penyuluh_pendamping || null,
        r.penyuluh_hp || null,
        r.kelas_kemampuan || "Belum Dinilai",
        r.subsektor_utama || "Tanaman Pangan",
        r.jumlah_anggota || 0,
        r.luas_lahan_ha || 0.0,
        r.tahun_berdiri || null,
        r.status_aktif || "Aktif"
      );
    }

    const sql = `
      INSERT INTO kelembagaan_pertanian (
        kecamatan, desa, jenis_lembaga, nama_kelompok, gapoktan_induk,
        id_simluhtan, no_sk_pengukuhan, nama_ketua, kontak_hp,
        penyuluh_pendamping, penyuluh_hp, kelas_kemampuan, subsektor_utama,
        jumlah_anggota, luas_lahan_ha, tahun_berdiri, status_aktif
      ) VALUES ${placeholders.join(", ")}
    `;
    await q(sql, values);
    process.stdout.write(`\rTersimpan: ${Math.min(i + batchSize, allPertanian.length)} / ${allPertanian.length}`);
  }
  console.log("\n✓ Tabel kelembagaan_pertanian berhasil diisi!");

  // 2. SEED KEP (Kelembagaan Ekonomi Petani)
  console.log("\n2. Mengisi tabel kelembagaan_kep...");
  await q("TRUNCATE TABLE kelembagaan_kep");
  console.log(`Total KEP: ${data.kep.length}`);

  for (const k of data.kep) {
    await q(`
      INSERT INTO kelembagaan_kep (
        kecamatan, bpp, nama_kep, alamat, penyuluh_pendamping, penyuluh_hp,
        bentuk_kep, dasar_hukum, ada_struktur, ada_ad_art, komoditas,
        jenis_usaha, jumlah_pengurus, jumlah_anggota, poktan_terlibat,
        modal_usaha_aset, status_aktif
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      k.kecamatan,
      k.bpp,
      k.nama_kep,
      k.alamat,
      k.penyuluh_pendamping,
      k.penyuluh_hp,
      k.bentuk_kep,
      k.dasar_hukum,
      k.ada_struktur,
      k.ada_ad_art,
      k.komoditas,
      k.jenis_usaha,
      k.jumlah_pengurus,
      k.jumlah_anggota,
      k.poktan_terlibat,
      k.modal_usaha_aset,
      k.status_aktif
    ]);
  }
  console.log("✓ Tabel kelembagaan_kep berhasil diisi!");

  // 3. SEED POSLUHDES (Pos Penyuluhan Desa)
  console.log("\n3. Mengisi tabel kelembagaan_posluhdes...");
  await q("TRUNCATE TABLE kelembagaan_posluhdes");
  console.log(`Total Posluhdes: ${data.posluhdes.length}`);

  for (const p of data.posluhdes) {
    await q(`
      INSERT INTO kelembagaan_posluhdes (
        kabupaten, bpp, desa, nama_posluhdes, alamat, nama_pimpinan,
        no_ba_pengukuhan, penyuluh_swadaya, alamat_penyuluh, kontak_hp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      p.kabupaten,
      p.bpp,
      p.desa,
      p.nama_posluhdes,
      p.alamat,
      p.nama_pimpinan,
      p.no_ba_pengukuhan,
      p.penyuluh_swadaya,
      p.alamat_penyuluh,
      p.kontak_hp
    ]);
  }
  console.log("✓ Tabel kelembagaan_posluhdes berhasil diisi!");

  // 4. SEED PPS (Penyuluh Pertanian Swadaya)
  console.log("\n4. Mengisi tabel kelembagaan_pps...");
  await q("TRUNCATE TABLE kelembagaan_pps");
  console.log(`Total PPS: ${data.pps.length}`);

  for (const s of data.pps) {
    await q(`
      INSERT INTO kelembagaan_pps (
        nama_penyuluh, tempat_tgl_lahir, unit_kerja, pendidikan,
        keahlian_tp, keahlian_nak, keahlian_bun, keahlian_horti, keahlian_lainnya,
        wilayah_kerja, kontak_hp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      s.nama_penyuluh,
      s.tempat_tgl_lahir,
      s.unit_kerja,
      s.pendidikan,
      s.keahlian_tp,
      s.keahlian_nak,
      s.keahlian_bun,
      s.keahlian_horti,
      s.keahlian_lainnya,
      s.wilayah_kerja,
      s.kontak_hp
    ]);
  }
  console.log("✓ Tabel kelembagaan_pps berhasil diisi!");

  // 5. SEED REKAPITULASI KECAMATAN (SK Kadistan Validasi)
  console.log("\n5. Mengisi tabel kelembagaan_rekap_kecamatan...");
  const rekapPath = path.resolve("./dist/kelembagaan/rekapitulasi_cleaned.json");
  if (fs.existsSync(rekapPath)) {
    const rawRekap = fs.readFileSync(rekapPath, "utf-8");
    const rekapData = JSON.parse(rawRekap);
    await q("TRUNCATE TABLE kelembagaan_rekap_kecamatan");
    console.log(`Total Kecamatan Rekapitulasi: ${rekapData.length}`);

    for (const d of rekapData) {
      await q(`
        INSERT INTO kelembagaan_rekap_kecamatan 
        (no_urut, kecamatan, jumlah_desa, jumlah_gapoktan, jumlah_poktan, kelas_pemula, kelas_lanjut, kelas_madya, kelas_utama)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        d.no,
        d.kecamatan,
        d.desa,
        d.gapoktan,
        d.poktan,
        d.pemula,
        d.lanjut,
        d.madya,
        d.utama
      ]);
    }
    console.log("✓ Tabel kelembagaan_rekap_kecamatan berhasil diisi!");
  }

  console.log("\n=== SEEDING BERHASIL 100%! SEMUA DATA RESMI TELAH MASUK KE DATABASE ===");
  process.exit(0);
}

seedKelembagaan().catch(err => {
  console.error("Gagal melakukan seeding:", err);
  process.exit(1);
});
