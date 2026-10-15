import crypto from "node:crypto";
import { q } from "../src/db.js";

async function main() {
  const password = process.env.PASS_KETAHANAN_PANGAN || "KetahananPangan.2026";
  const hash = crypto.createHash("sha256").update(password).digest("hex");

  console.log("=== Mendaftarkan Akun ketahanan-pangan ke Database ===");
  console.log("Username   : ketahanan-pangan");
  console.log("Password   :", password);
  console.log("Hash SHA256:", hash);

  const res = await q(
    `INSERT INTO users (username, password_hash, nama_lengkap, nip, email, role_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash),
       nama_lengkap = VALUES(nama_lengkap),
       nip = VALUES(nip),
       email = VALUES(email),
       role_id = VALUES(role_id),
       status = 'aktif',
       updated_at = CURRENT_TIMESTAMP`,
    [
      "ketahanan-pangan",
      hash,
      "Admin Bidang Ketahanan Pangan",
      "198904142015031005",
      "ketahanan.pangan@distankan.banjarnegarakab.go.id",
      "admin_ketahanan_pangan",
      "aktif"
    ]
  );

  console.log("Status SQL : Berhasil (Affected Rows: " + res.affectedRows + ")");

  const rows = await q("SELECT id, username, nama_lengkap, role_id, status FROM users WHERE username IN ('ketahanan-pangan', 'admin_ketahanan')");
  console.log("\nVerifikasi Data di Database:");
  console.table(rows);

  process.exit(0);
}

main().catch((err) => {
  console.error("Gagal mendaftarkan akun:", err);
  process.exit(1);
});
