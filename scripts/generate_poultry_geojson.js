import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'pertasis'
  });

  const [rows] = await conn.query(`
    SELECT p.id, p.nama_toko, p.jenis_layanan, p.alamat, p.koordinat, p.kontak, k.nama as kecamatan
    FROM ternak_poultry_shop p
    JOIN kecamatan k ON k.id = p.kecamatan_id
    ORDER BY k.nama ASC, p.nama_toko ASC
  `);

  await conn.end();

  const features = [];

  for (const r of rows) {
    if (!r.koordinat) continue;
    const parts = r.koordinat.split(',').map(s => parseFloat(s.trim()));
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) continue;

    const lat = parts[0];
    const lng = parts[1];

    features.push({
      type: "Feature",
      properties: {
        name: r.nama_toko,
        kategori: "Poultry Shop",
        jenis_layanan: r.jenis_layanan || "Pakan & Sapronak Ternak",
        alamat: r.alamat || `Kecamatan ${r.kecamatan}`,
        kecamatan: r.kecamatan,
        kontak: r.kontak || "—"
      },
      geometry: {
        type: "Point",
        coordinates: [lng, lat]
      }
    });
  }

  const geojson = {
    type: "FeatureCollection",
    name: "poultry-banjarnegara",
    features
  };

  const distDir = path.resolve('dist/data');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const targetPath = path.join(distDir, 'poultry-banjarnegara.geojson');
  fs.writeFileSync(targetPath, JSON.stringify(geojson, null, 2), 'utf8');
  console.log(`Successfully generated ${features.length} poultry shop points in ${targetPath}`);

  // Also check public/data if exists
  const publicDir = path.resolve('public/data');
  if (fs.existsSync(path.resolve('public'))) {
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    fs.writeFileSync(path.join(publicDir, 'poultry-banjarnegara.geojson'), JSON.stringify(geojson, null, 2), 'utf8');
    console.log(`Also written to public/data/poultry-banjarnegara.geojson`);
  }
}

main().catch(console.error);
