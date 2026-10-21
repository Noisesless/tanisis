import mysql from 'mysql2/promise';

const kotaShops = [
  {
    kecamatan: "Banjarnegara",
    nama_toko: "Pioneer Poultry Shop",
    jenis_layanan: "Pakan Unggas, DOC, Vaksin, Vitamin & Sapronak Peternakan",
    alamat: "Jl. Jend. Sudirman No. 166, Krandegan, Kec. Banjarnegara",
    koordinat: "-7.398412, 109.697420",
    kontak: "0811-2616-199",
    catatan: "Terverifikasi profil bisnis Google Maps (Rating 4.6, 67 ulasan)"
  },
  {
    kecamatan: "Banjarnegara",
    nama_toko: "Sekawan Animal Food (PT. Kanaan Makmur Sejahtera)",
    jenis_layanan: "Pakan Ternak, Pakan Ikan, Konsentrat & Perlengkapan Peternakan",
    alamat: "Jl. Jend. Sudirman No. 196, Krandegan, Kec. Banjarnegara",
    koordinat: "-7.398850, 109.699130",
    kontak: "0812-2299-9039",
    catatan: "Terverifikasi profil bisnis Google Maps (Rating 4.1, 235 ulasan)"
  },
  {
    kecamatan: "Banjarnegara",
    nama_toko: "(TRIO PUTRA) Herry PS Banjarnegara",
    jenis_layanan: "Pakan Unggas, Konsentrat Ayam & Burung, Obat Ternak",
    alamat: "Jl. Mayjend Soetojo No. 7, Krandegan, Kec. Banjarnegara",
    koordinat: "-7.394150, 109.695810",
    kontak: "0882-2783-8741",
    catatan: "Terverifikasi profil bisnis Google Maps (Rating 5.0)"
  },
  {
    kecamatan: "Banjarnegara",
    nama_toko: "Iqbal Jaya Poultry Shop",
    jenis_layanan: "Pakan Ayam, Bebek, Unggas & Obat-obatan Hewan",
    alamat: "Jl. Sunan Gripit, Kutabanjarnegara, Kec. Banjarnegara",
    koordinat: "-7.393420, 109.691150",
    kontak: "0857-4774-4417",
    catatan: "Terverifikasi profil bisnis Google Maps (Rating 4.7)"
  },
  {
    kecamatan: "Banjarnegara",
    nama_toko: "Sri Jaya PS",
    jenis_layanan: "Pakan Ternak, Konsentrat Unggas & Sapronak",
    alamat: "Area Krandegan, Kec. Banjarnegara",
    koordinat: "-7.396500, 109.696200",
    kontak: "0815-4237-4898",
    catatan: "Terverifikasi profil bisnis Google Maps (Rating 3.9)"
  },
  {
    kecamatan: "Banjarnegara",
    nama_toko: "PS. Berkah (Pakan Hewan & Burung)",
    jenis_layanan: "Pakan Ternak, Pakan Unggas, Burung & Ikan",
    alamat: "Jl. Serma Mukhlas No. 1, Kutabanjarnegara, Kec. Banjarnegara",
    koordinat: "-7.398100, 109.689200",
    kontak: "0857-346-976",
    catatan: "Terverifikasi profil bisnis Google Maps (Rating 5.0)"
  }
];

async function main() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'pertasis'
  });

  const [kecRows] = await conn.query("SELECT id, nama FROM kecamatan WHERE nama = 'Banjarnegara'");
  if (kecRows.length === 0) {
    console.error("Kecamatan Banjarnegara tidak ditemukan di database!");
    process.exit(1);
  }
  const kecId = kecRows[0].id;

  let inserted = 0;
  for (const shop of kotaShops) {
    // Check if shop already exists
    const [exist] = await conn.query(
      "SELECT id FROM ternak_poultry_shop WHERE nama_toko = ? AND kecamatan_id = ?",
      [shop.nama_toko, kecId]
    );
    if (exist.length > 0) {
      console.log(`Toko ${shop.nama_toko} sudah ada, dilewati.`);
      continue;
    }

    await conn.query(`
      INSERT INTO ternak_poultry_shop (
        kecamatan_id, tahun, nama_toko, jenis_layanan, alamat, koordinat, kontak, catatan, sumber
      ) VALUES (?, 2024, ?, ?, ?, ?, ?, ?, 'manual')
    `, [
      kecId,
      shop.nama_toko,
      shop.jenis_layanan,
      shop.alamat,
      shop.koordinat,
      shop.kontak,
      shop.catatan
    ]);
    inserted++;
  }

  console.log(`Berhasil menambahkan ${inserted} toko pakan ternak / poultry shop riil di Kota Banjarnegara!`);

  const [totalRows] = await conn.query(`
    SELECT p.id, k.nama as kecamatan, p.nama_toko, p.alamat, p.koordinat, p.kontak
    FROM ternak_poultry_shop p
    JOIN kecamatan k ON k.id = p.kecamatan_id
    ORDER BY k.nama ASC, p.nama_toko ASC
  `);
  console.log(`Total toko poultry shop di seluruh Banjarnegara sekarang: ${totalRows.length}`);
  console.log(totalRows);

  await conn.end();
}

main().catch(console.error);
