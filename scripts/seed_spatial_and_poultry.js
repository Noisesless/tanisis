/**
 * scripts/seed_spatial_and_poultry.js
 * Runner idempoten untuk membuat skema & mengisi data spasial 36 Pasar Tradisional
 * dan 15 Toko Pakan / Poultry Shop resmi Kabupaten Banjarnegara ke MariaDB/MySQL produksi.
 */
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const POULTRY_SHOPS_DATA = [
  {
    kecamatan: "Purwareja Klampok",
    nama_toko: "Toko Pakan Ternak \"Iman\"",
    alamat: "Klampok, Kec. Purwareja Klampok",
    jenis_layanan: "Pakan Ternak, Unggas & Sapronak",
    koordinat: "-7.459866, 109.440366",
    kontak: "—",
    catatan: "Terverifikasi profil bisnis Google Maps Klampok"
  },
  {
    kecamatan: "Purwareja Klampok",
    nama_toko: "Manyoel ABS K3",
    alamat: "Klampok / Kaliwinasuh, Kec. Purwareja Klampok",
    jenis_layanan: "Pakan Ternak & Sarana Produksi Peternakan",
    koordinat: "-7.461357, 109.452326",
    kontak: "—",
    catatan: "Terverifikasi profil bisnis Google Maps"
  },
  {
    kecamatan: "Purwareja Klampok",
    nama_toko: "Toko Sidodadi PS",
    alamat: "Sirkandi, Kec. Purwareja Klampok",
    jenis_layanan: "Pakan Hewan, Unggas, Telur & Kebutuhan Peternakan",
    koordinat: "-7.473699, 109.429035",
    kontak: "—",
    catatan: "Terverifikasi profil bisnis Google Maps"
  },
  {
    kecamatan: "Mandiraja",
    nama_toko: "Adam Poultry Shop",
    alamat: "Jl. Raya Mandiraja, Kec. Mandiraja",
    jenis_layanan: "Pakan Unggas, DOC, Vitamin & Sapronak",
    koordinat: "-7.465383, 109.472353",
    kontak: "—",
    catatan: "Terverifikasi profil bisnis Google Maps Mandiraja"
  },
  {
    kecamatan: "Purwanegara",
    nama_toko: "Reza Poultry Shop",
    alamat: "Jl. Raya Purwanegara, Kec. Purwanegara",
    jenis_layanan: "Pakan Ternak, Sapronak Unggas & Obat Hewan",
    koordinat: "-7.433529, 109.557089",
    kontak: "—",
    catatan: "Terverifikasi profil bisnis Google Maps Purwanegara"
  },
  {
    kecamatan: "Bawang",
    nama_toko: "Tani Jaya PS",
    alamat: "Jl. Raya Bawang / Pucang, Kec. Bawang",
    jenis_layanan: "Pakan Ayam, Bebek, Pakan Ikan & Obat Hewan",
    koordinat: "-7.400807, 109.619157",
    kontak: "—",
    catatan: "Terverifikasi profil bisnis Google Maps Bawang"
  },
  {
    kecamatan: "Bawang",
    nama_toko: "BARA PETSHOP 1",
    alamat: "Jl. Raya Bawang, Kec. Bawang",
    jenis_layanan: "Pakan Hewan, Vitamin, Obat & Perlengkapan Peternakan",
    koordinat: "-7.400662, 109.620955",
    kontak: "—",
    catatan: "Terverifikasi profil bisnis Google Maps Bawang"
  },
  {
    kecamatan: "Susukan",
    nama_toko: "JOGLO PS - Animal Food & Plastik",
    alamat: "Kawasan Susukan, Kec. Susukan",
    jenis_layanan: "Pakan Ternak, Animal Food & Kebutuhan Unggas",
    koordinat: "-7.497117, 109.390476",
    kontak: "—",
    catatan: "Terverifikasi profil bisnis Google Maps Susukan"
  },
  {
    kecamatan: "Susukan",
    nama_toko: "Toko Sumber Pakan",
    alamat: "Wilayah Brengkok / Susukan, Kec. Susukan",
    jenis_layanan: "Pakan Ternak, Konsentrat & Pakan Unggas",
    koordinat: "-7.486154, 109.419044",
    kontak: "—",
    catatan: "Terverifikasi profil bisnis Google Maps Susukan"
  },
  {
    kecamatan: "Banjarnegara",
    nama_toko: "Pioneer Poultry Shop",
    alamat: "Jl. Jend. Sudirman No. 166, Krandegan, Kec. Banjarnegara",
    jenis_layanan: "Pakan Unggas, DOC, Vaksin, Vitamin & Sapronak Peternakan",
    koordinat: "-7.398412, 109.697420",
    kontak: "0811-2616-199",
    catatan: "Terverifikasi profil bisnis Google Maps (Rating 4.6, 67 ulasan)"
  },
  {
    kecamatan: "Banjarnegara",
    nama_toko: "Sekawan Animal Food (PT. Kanaan Makmur Sejahtera)",
    alamat: "Jl. Jend. Sudirman No. 196, Krandegan, Kec. Banjarnegara",
    jenis_layanan: "Pakan Ternak, Pakan Ikan, Konsentrat & Perlengkapan Peternakan",
    koordinat: "-7.398850, 109.699130",
    kontak: "0812-2299-9039",
    catatan: "Terverifikasi profil bisnis Google Maps (Rating 4.1, 235 ulasan)"
  },
  {
    kecamatan: "Banjarnegara",
    nama_toko: "(TRIO PUTRA) Herry PS Banjarnegara",
    alamat: "Jl. Mayjend Soetojo No. 7, Krandegan, Kec. Banjarnegara",
    jenis_layanan: "Pakan Unggas, Konsentrat Ayam & Burung, Obat Ternak",
    koordinat: "-7.394150, 109.695810",
    kontak: "0882-2783-8741",
    catatan: "Terverifikasi profil bisnis Google Maps (Rating 5.0)"
  },
  {
    kecamatan: "Banjarnegara",
    nama_toko: "Iqbal Jaya Poultry Shop",
    alamat: "Jl. Sunan Gripit, Kutabanjarnegara, Kec. Banjarnegara",
    jenis_layanan: "Pakan Ayam, Bebek, Unggas & Obat-obatan Hewan",
    koordinat: "-7.393420, 109.691150",
    kontak: "0857-4774-4417",
    catatan: "Terverifikasi profil bisnis Google Maps (Rating 4.7)"
  },
  {
    kecamatan: "Banjarnegara",
    nama_toko: "Sri Jaya PS",
    alamat: "Area Krandegan, Kec. Banjarnegara",
    jenis_layanan: "Pakan Ternak, Konsentrat Unggas & Sapronak",
    koordinat: "-7.396500, 109.696200",
    kontak: "0815-4237-4898",
    catatan: "Terverifikasi profil bisnis Google Maps (Rating 3.9)"
  },
  {
    kecamatan: "Banjarnegara",
    nama_toko: "PS. Berkah (Pakan Hewan & Burung)",
    alamat: "Jl. Serma Mukhlas No. 1, Kutabanjarnegara, Kec. Banjarnegara",
    jenis_layanan: "Pakan Ternak, Pakan Unggas, Burung & Ikan",
    koordinat: "-7.398100, 109.689200",
    kontak: "0857-346-976",
    catatan: "Terverifikasi profil bisnis Google Maps (Rating 5.0)"
  }
];

export async function seedSpatialAndPoultry() {
  const envHost = process.env.DB_HOST || "127.0.0.1";
  const envPort = Number(process.env.DB_PORT || 3306);
  const envUser = process.env.DB_USER || "root";
  const envPass = process.env.DB_PASS || process.env.DB_PASSWORD || "";
  const envName = process.env.DB_NAME || "pertasis";

  console.log(`[Spatial & Poultry Seeder] Menghubungkan ke ${envUser}@${envHost}:${envPort}/${envName}...`);

  const conn = await mysql.createConnection({
    host: envHost,
    port: envPort,
    user: envUser,
    password: envPass,
    database: envName,
  });

  try {
    // 1. Skema & Data pasar_banjarnegara
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`pasar_banjarnegara\` (
        \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
        \`nama\` varchar(150) NOT NULL,
        \`kategori\` varchar(50) NOT NULL,
        \`kecamatan_id\` tinyint(3) unsigned DEFAULT NULL,
        \`kecamatan\` varchar(50) DEFAULT NULL,
        \`alamat\` text DEFAULT NULL,
        \`latitude\` decimal(10,7) NOT NULL,
        \`longitude\` decimal(10,7) NOT NULL,
        \`koordinat\` varchar(60) NOT NULL,
        \`sumber\` varchar(100) DEFAULT 'GeoJSON Pemkab Banjarnegara',
        \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
        \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (\`id\`),
        KEY \`idx_kecamatan_id\` (\`kecamatan_id\`),
        KEY \`idx_kategori\` (\`kategori\`),
        KEY \`idx_nama\` (\`nama\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Dapatkan pemetaan kecamatan
    const [kecRows] = await conn.query("SELECT id, nama FROM kecamatan");
    const kecMap = {};
    for (const k of kecRows) {
      kecMap[k.nama.toLowerCase()] = k.id;
    }

    const [pasarCount] = await conn.query("SELECT COUNT(*) AS cnt FROM pasar_banjarnegara");
    if (pasarCount[0].cnt === 0) {
      console.log(`[Spatial & Poultry Seeder] Mengisi data 36 pasar tradisional resmi Banjarnegara...`);
      const geojsonPath = path.resolve(process.cwd(), "dist/data/pasar-banjarnegara.geojson");
      if (fs.existsSync(geojsonPath)) {
        const raw = fs.readFileSync(geojsonPath, "utf8");
        const geojson = JSON.parse(raw);
        for (const f of geojson.features || []) {
          const props = f.properties || {};
          const coords = f.geometry?.coordinates || [0, 0];
          const lng = Number(coords[0]);
          const lat = Number(coords[1]);
          const nama = props.name || props.NAMOBJ || "Pasar";
          const kategori = props.kategori || "Pasar Tradisional";
          const alamat = props.alamat || "";

          let matchedKecId = null;
          let matchedKecNama = null;
          const match = alamat.match(/(?:kec\.|kecamatan)\s+([a-zA-Z\s]+?)(?:,|\.|$)/i);
          if (match) {
            const rawKec = match[1].trim().toLowerCase();
            for (const [kName, kId] of Object.entries(kecMap)) {
              if (rawKec.includes(kName) || kName.includes(rawKec)) {
                matchedKecId = kId;
                matchedKecNama = kName.replace(/\b\w/g, (c) => c.toUpperCase());
                break;
              }
            }
          }
          if (!matchedKecId && props.kecamatan) {
            const rawKec = props.kecamatan.toLowerCase();
            matchedKecId = kecMap[rawKec] || null;
            matchedKecNama = props.kecamatan;
          }

          await conn.query(
            `INSERT INTO pasar_banjarnegara (nama, kategori, kecamatan_id, kecamatan, alamat, latitude, longitude, koordinat, sumber)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'GeoJSON Pemkab Banjarnegara')`,
            [nama, kategori, matchedKecId, matchedKecNama, alamat, lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`]
          );
        }
      }
    }
    const [finalPasar] = await conn.query("SELECT COUNT(*) AS cnt FROM pasar_banjarnegara");
    console.log(`✅ [Spatial & Poultry Seeder] Tabel pasar_banjarnegara: ${finalPasar[0].cnt} pasar tersimpan.`);

    // 2. Skema & Data ternak_poultry_shop
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`ternak_poultry_shop\` (
        \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
        \`kecamatan_id\` tinyint(3) unsigned NOT NULL,
        \`tahun\` smallint(5) unsigned NOT NULL DEFAULT 2024,
        \`bulan\` varchar(20) DEFAULT NULL,
        \`nama_toko\` varchar(100) NOT NULL,
        \`alamat\` varchar(255) DEFAULT NULL,
        \`jenis_layanan\` varchar(100) DEFAULT 'Pakan, Obat & Sapronak',
        \`koordinat\` varchar(60) DEFAULT NULL,
        \`kontak\` varchar(100) DEFAULT NULL,
        \`catatan\` varchar(255) DEFAULT NULL,
        \`sumber\` enum('csv','ckan','manual') DEFAULT 'manual',
        \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
        \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (\`id\`),
        KEY \`idx_kec_thn\` (\`kecamatan_id\`,\`tahun\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // Insert 15 Poultry Shops jika belum ada
    let seededPoultry = 0;
    for (const shop of POULTRY_SHOPS_DATA) {
      const kecId = kecMap[shop.kecamatan.toLowerCase()];
      if (!kecId) continue;

      const [exist] = await conn.query(
        "SELECT id FROM ternak_poultry_shop WHERE nama_toko = ? AND kecamatan_id = ?",
        [shop.nama_toko, kecId]
      );
      if (exist.length > 0) {
        // Update koordinat & kontak agar presisi
        await conn.query(
          `UPDATE ternak_poultry_shop
           SET koordinat = ?, kontak = ?, jenis_layanan = ?, alamat = ?, catatan = ?
           WHERE id = ?`,
          [shop.koordinat, shop.kontak, shop.jenis_layanan, shop.alamat, shop.catatan, exist[0].id]
        );
        continue;
      }

      await conn.query(
        `INSERT INTO ternak_poultry_shop (
           kecamatan_id, tahun, nama_toko, jenis_layanan, alamat, koordinat, kontak, catatan, sumber
         ) VALUES (?, 2024, ?, ?, ?, ?, ?, ?, 'manual')`,
        [kecId, shop.nama_toko, shop.jenis_layanan, shop.alamat, shop.koordinat, shop.kontak, shop.catatan]
      );
      seededPoultry++;
    }

    const [finalPoultry] = await conn.query("SELECT COUNT(*) AS cnt FROM ternak_poultry_shop");
    console.log(`✅ [Spatial & Poultry Seeder] Tabel ternak_poultry_shop: ${finalPoultry[0].cnt} toko pakan tersimpan.`);
  } finally {
    await conn.end();
  }
}

if (process.argv[1]?.endsWith("seed_spatial_and_poultry.js")) {
  seedSpatialAndPoultry().catch((err) => {
    console.error("Gagal menjalankan spatial & poultry seeder:", err);
    process.exit(1);
  });
}
