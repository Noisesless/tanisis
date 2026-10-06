// scripts/seed_ternak_ecosystem.js
import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'pertasis'
  });

  console.log('Connected to pertasis DB.');

  const [kecRows] = await conn.query('SELECT id, nama FROM kecamatan');
  const kecMap = {};
  kecRows.forEach(k => { kecMap[k.nama] = k.id; });

  // 1. UMKM Pakan
  const pakanData = [
    { kecamatan: "Purwanegara", nama_usaha: "Poktan Sumber Rejeki", jenis_pakan: "Silase Tebon Jagung", kapasitas_ton_bulan: 15, alamat: "Desa Merden, Purwanegara", kontak: "0812-2831-xxxx" },
    { kecamatan: "Batur", nama_usaha: "Dieng Sheep Feed / Mandiri", jenis_pakan: "Konsentrat Domba Batur & Mineral Blok", kapasitas_ton_bulan: 8, alamat: "Desa Batur, Kec. Batur", kontak: "0852-9102-xxxx" },
    { kecamatan: "Rakit", nama_usaha: "Silase Barokah Mandiri", jenis_pakan: "Silase Tebon Jagung & Rumput Odot", kapasitas_ton_bulan: 20, alamat: "Desa Luwung, Rakit", kontak: "0813-9120-xxxx" },
    { kecamatan: "Purwareja Klampok", nama_usaha: "Kelompok Ternak Lembu Makmur", jenis_pakan: "Fermentasi Jerami & Konsentrat Sapi", kapasitas_ton_bulan: 12, alamat: "Desa Klampok, Purwareja Klampok", kontak: "0877-3819-xxxx" },
    { kecamatan: "Bawang", nama_usaha: "Kandang Lestari Feed", jenis_pakan: "Konsentrat Kambing & Silase Hijauan", kapasitas_ton_bulan: 10, alamat: "Desa Gemuruh, Bawang", kontak: "0821-3450-xxxx" },
    { kecamatan: "Wanayasa", nama_usaha: "Poktan Gunung Barokah", jenis_pakan: "Silase Tebon & Konsentrat Domba", kapasitas_ton_bulan: 7, alamat: "Desa Wanayasa, Kec. Wanayasa", kontak: "0857-4123-xxxx" },
    { kecamatan: "Madukara", nama_usaha: "Berkah Feed Mill Rakyat", jenis_pakan: "Konsentrat Unggas & Ruminansia", kapasitas_ton_bulan: 9, alamat: "Desa Kutayasa, Madukara", kontak: "0813-2789-xxxx" },
    { kecamatan: "Susukan", nama_usaha: "Koperasi Pakan Serayu Mandiri", jenis_pakan: "Silase Jagung & Pakan Fermentasi", kapasitas_ton_bulan: 14, alamat: "Desa Gumelem Kulon, Susukan", kontak: "0822-4211-xxxx" }
  ];

  await conn.query('DELETE FROM ternak_umkm_pakan WHERE sumber = "manual"');
  for (const item of pakanData) {
    const kecId = kecMap[item.kecamatan];
    if (kecId) {
      await conn.query(
        `INSERT INTO ternak_umkm_pakan (kecamatan_id, tahun, nama_usaha, jenis_pakan, kapasitas_ton_bulan, alamat, kontak, sumber)
         VALUES (?, 2024, ?, ?, ?, ?, ?, 'manual')`,
        [kecId, item.nama_usaha, item.jenis_pakan, item.kapasitas_ton_bulan, item.alamat, item.kontak]
      );
    }
  }
  console.log(`Seeded ${pakanData.length} ternak_umkm_pakan.`);

  // 2. Poultry Shop
  const poultryData = [
    { kecamatan: "Purwareja Klampok", nama_toko: "Poultry Shop Tani Jaya Klampok", jenis_layanan: "Pakan Unggas, Sapronak & Obat Hewan", alamat: "Jl. Raya Klampok No. 42", kontak: "0812-2611-xxxx" },
    { kecamatan: "Banjarnegara", nama_toko: "Toko Ternak Barokah Kota", jenis_layanan: "Obat Hewan, Vitamin, Konsentrat & Vaksin", alamat: "Jl. Veteran No. 18, Krandegan", kontak: "0852-2710-xxxx" },
    { kecamatan: "Batur", nama_toko: "Kios Sapronak Dieng Farm", jenis_layanan: "Pakan, Mineral Blok & Obat Domba Batur", alamat: "Komplek Pasar Batur", kontak: "0813-9102-xxxx" },
    { kecamatan: "Mandiraja", nama_toko: "Poultry Shop Subur Makmur", jenis_layanan: "Pakan Broiler, Layer, DOC & Peralatan", alamat: "Jl. Raya Mandiraja No. 85", kontak: "0878-3921-xxxx" },
    { kecamatan: "Bawang", nama_toko: "Kios Ternak Serayu Feed", jenis_layanan: "Sapronak, Konsentrat Sapi & Kambing", alamat: "Jl. Raya Pucang, Bawang", kontak: "0821-3344-xxxx" },
    { kecamatan: "Rakit", nama_toko: "Poultry Shop Berkah Abadi Rakit", jenis_layanan: "Pakan Unggas Rakyat & Sapronak", alamat: "Pasar Rakit Kios No. 12", kontak: "0856-4780-xxxx" },
    { kecamatan: "Karangkobar", nama_toko: "Kios Sapronak Karangkobar", jenis_layanan: "Pakan Ternak, Dedak & Vitamin Hewan", alamat: "Jl. Raya Karangkobar", kontak: "0812-9011-xxxx" },
    { kecamatan: "Kalibening", nama_toko: "Poultry Shop Kalibening Jaya", jenis_layanan: "Pakan Unggas, Kambing & Desinfektan", alamat: "Komplek Pasar Kalibening", kontak: "0823-1122-xxxx" }
  ];

  await conn.query('DELETE FROM ternak_poultry_shop WHERE sumber = "manual"');
  for (const item of poultryData) {
    const kecId = kecMap[item.kecamatan];
    if (kecId) {
      await conn.query(
        `INSERT INTO ternak_poultry_shop (kecamatan_id, tahun, nama_toko, jenis_layanan, alamat, kontak, sumber)
         VALUES (?, 2024, ?, ?, ?, ?, 'manual')`,
        [kecId, item.nama_toko, item.jenis_layanan, item.alamat, item.kontak]
      );
    }
  }
  console.log(`Seeded ${poultryData.length} ternak_poultry_shop.`);

  // 3. NKV
  const nkvData = [
    { kecamatan: "Banjarnegara", nama_unit_usaha: "RPH-Ruminansia Banjarnegara", nomor_nkv: "RPH-3304-001", kategori: "Rumah Potong Hewan Ruminansia (RPH-R)", status_verifikasi: "Tersertifikasi (Level II)" },
    { kecamatan: "Purwanegara", nama_unit_usaha: "Farm Ayam Layer Barokah Telur", nomor_nkv: "UPT-3304-002", kategori: "Budidaya Unggas Petelur (Komersial)", status_verifikasi: "Tersertifikasi (Level II)" },
    { kecamatan: "Batur", nama_unit_usaha: "Sentra Olahan Ternak Dieng Mandiri", nomor_nkv: "UPS-3304-003", kategori: "Pengolahan Produk Hewan & Susu Kambing", status_verifikasi: "Tersertifikasi (Level III)" },
    { kecamatan: "Purwareja Klampok", nama_unit_usaha: "Kios Daging Segar Pasar Klampok", nomor_nkv: "KDS-3304-004", kategori: "Kios Daging Ruminansia Bersertifikat", status_verifikasi: "Tersertifikasi (Level II)" },
    { kecamatan: "Rakit", nama_unit_usaha: "Peternakan Broiler Kemitraan Sejahtera", nomor_nkv: "UPB-3304-005", kategori: "Budidaya Unggas Pedaging (Broiler)", status_verifikasi: "Dalam Verifikasi Lapangan" },
    { kecamatan: "Bawang", nama_unit_usaha: "Unit Penampungan Susu Segar Gemuruh", nomor_nkv: "TPS-3304-006", kategori: "Tempat Penampungan Susu (TPS)", status_verifikasi: "Tersertifikasi (Level III)" }
  ];

  await conn.query('DELETE FROM ternak_nkv WHERE sumber = "manual"');
  for (const item of nkvData) {
    const kecId = kecMap[item.kecamatan];
    if (kecId) {
      await conn.query(
        `INSERT INTO ternak_nkv (kecamatan_id, tahun, nama_unit_usaha, nomor_nkv, kategori, status_verifikasi, sumber)
         VALUES (?, 2024, ?, ?, ?, ?, 'manual')`,
        [kecId, item.nama_unit_usaha, item.nomor_nkv, item.kategori, item.status_verifikasi]
      );
    }
  }
  console.log(`Seeded ${nkvData.length} ternak_nkv.`);

  await conn.end();
  console.log('Seeder selesai dengan sukses.');
}

main().catch(console.error);
