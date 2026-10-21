import fs from 'fs';
import mysql from 'mysql2/promise';

async function main() {
  const geojsonPath = 'dist/data/pasar-banjarnegara.geojson';
  const rawData = fs.readFileSync(geojsonPath, 'utf8');
  const geojson = JSON.parse(rawData);

  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'pertasis'
  });

  const [kecRows] = await conn.query('SELECT id, nama FROM kecamatan');
  const kecMap = {};
  kecRows.forEach(k => { kecMap[k.nama.toLowerCase()] = { id: k.id, nama: k.nama }; });

  await conn.query('TRUNCATE TABLE pasar_banjarnegara');

  let inserted = 0;
  for (const feature of geojson.features) {
    const props = feature.properties || {};
    const geom = feature.geometry || {};
    const coords = geom.coordinates || [0, 0];
    const lng = Number(coords[0]);
    const lat = Number(coords[1]);

    const nama = props.name || props.NAMOBJ || 'Pasar';
    const kategori = props.kategori || 'Pasar Tradisional';
    const alamat = props.alamat || '';

    // Match kecamatan using regex: Kec. <Name> or Kecamatan <Name>
    let matchedKecId = null;
    let matchedKecNama = null;

    const kecRegex = /(?:kec\.|kecamatan)\s+([a-zA-Z\s]+?)(?:,|\.|$)/i;
    const match = alamat.match(kecRegex);

    if (match && match[1]) {
      const extracted = match[1].trim().toLowerCase();
      // Try exact or partial match with kecMap
      for (const [kLower, kObj] of Object.entries(kecMap)) {
        if (extracted === kLower || extracted.startsWith(kLower)) {
          matchedKecId = kObj.id;
          matchedKecNama = kObj.nama;
          break;
        }
      }
    }

    // Fallback if not matched via "Kec.": inspect specific keywords in alamat or nama
    if (!matchedKecId) {
      const combined = `${nama} ${alamat}`.toLowerCase();
      if (combined.includes('klampok')) {
        matchedKecId = kecMap['purwareja klampok'].id;
        matchedKecNama = kecMap['purwareja klampok'].nama;
      } else if (combined.includes('purwonegoro') || combined.includes('purwanegara') || combined.includes('gumiwang') || combined.includes('merden')) {
        matchedKecId = kecMap['purwanegara'].id;
        matchedKecNama = kecMap['purwanegara'].nama;
      } else if (combined.includes('batur')) {
        matchedKecId = kecMap['batur'].id;
        matchedKecNama = kecMap['batur'].nama;
      } else if (combined.includes('punggelan') || combined.includes('jembangan') || combined.includes('danakerta') || combined.includes('tlaga')) {
        matchedKecId = kecMap['punggelan'].id;
        matchedKecNama = kecMap['punggelan'].nama;
      } else if (combined.includes('rakit') || combined.includes('badamita') || combined.includes('lengkong')) {
        matchedKecId = kecMap['rakit'].id;
        matchedKecNama = kecMap['rakit'].nama;
      } else if (combined.includes('mandiraja')) {
        matchedKecId = kecMap['mandiraja'].id;
        matchedKecNama = kecMap['mandiraja'].nama;
      } else if (combined.includes('wanadadi')) {
        matchedKecId = kecMap['wanadadi'].id;
        matchedKecNama = kecMap['wanadadi'].nama;
      } else if (combined.includes('pagedongan') || combined.includes('kebutuhduwur') || combined.includes('lebakwangi')) {
        matchedKecId = kecMap['pagedongan'].id;
        matchedKecNama = kecMap['pagedongan'].nama;
      } else if (combined.includes('bawang') || combined.includes('pucang') || combined.includes('mantrianom') || combined.includes('wanadri')) {
        matchedKecId = kecMap['bawang'].id;
        matchedKecNama = kecMap['bawang'].nama;
      } else if (combined.includes('madukara') || combined.includes('petambakan')) {
        matchedKecId = kecMap['madukara'].id;
        matchedKecNama = kecMap['madukara'].nama;
      } else if (combined.includes('sigaluh') || combined.includes('bandingan') || combined.includes('tunggara')) {
        matchedKecId = kecMap['sigaluh'].id;
        matchedKecNama = kecMap['sigaluh'].nama;
      } else if (combined.includes('karangkobar')) {
        matchedKecId = kecMap['karangkobar'].id;
        matchedKecNama = kecMap['karangkobar'].nama;
      } else if (combined.includes('kalibening')) {
        matchedKecId = kecMap['kalibening'].id;
        matchedKecNama = kecMap['kalibening'].nama;
      } else if (combined.includes('pagentan') || combined.includes('aribaya')) {
        matchedKecId = kecMap['pagentan'].id;
        matchedKecNama = kecMap['pagentan'].nama;
      } else if (combined.includes('banjarmangu') || combined.includes('gripit') || combined.includes('beji')) {
        matchedKecId = kecMap['banjarmangu'].id;
        matchedKecNama = kecMap['banjarmangu'].nama;
      } else {
        matchedKecId = kecMap['banjarnegara'].id;
        matchedKecNama = kecMap['banjarnegara'].nama;
      }
    }

    const koordinatStr = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    await conn.query(`
      INSERT INTO pasar_banjarnegara (
        nama, kategori, kecamatan_id, kecamatan, alamat, latitude, longitude, koordinat, sumber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'GeoJSON Pemkab Banjarnegara (dist/data/pasar-banjarnegara.geojson)')
    `, [
      nama,
      kategori,
      matchedKecId,
      matchedKecNama,
      alamat,
      lat,
      lng,
      koordinatStr
    ]);

    inserted++;
  }

  console.log(`Successfully re-seeded ${inserted} markets with accurate kecamatan distribution.`);

  const [kecSummary] = await conn.query(`
    SELECT kecamatan, COUNT(*) as count 
    FROM pasar_banjarnegara 
    GROUP BY kecamatan 
    ORDER BY count DESC
  `);
  console.log('Accurate summary by kecamatan:');
  console.log(kecSummary);

  await conn.end();
}

main().catch(console.error);
