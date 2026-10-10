/**
 * lib/users.js — pengguna & peran (RBAC) untuk dasbor data SISPERTANI.
 *
 * Setiap bidang teknis Dinas Distankan KP mendapat satu akun yang hanya boleh
 * mengunggah / mengelola domain BIDANGNYA sendiri. Satu akun `admin` melihat &
 * mengelola SEMUA domain (15 domain) + fitur sinkronisasi (sync-log & paket).
 *
 *   admin             → semua domain (null) + sync-log + paket
 *   tanaman-pangan    → padi, palawija, ltt-katam
 *   horti-perkebunan  → hortikultura, perkebunan
 *   peternakan        → peternakan
 *   perikanan         → perikanan
 *
 * Kata sandi TIDAK ditulis di sumber kode — disimpan di backend/.env lewat
 * variabel passEnv (ADMIN_PASS, PASS_TANAMAN_PANGAN, dst). Nama pengguna & peran
 * didaftarkan di sini sebagai sumber kebenaran bersama.
 */

export const ROLES = {
  admin: { label: "Administrator", domains: null }, // null = SEMUA domain
  "tanaman-pangan": { label: "Bidang Tanaman Pangan", domains: ["padi", "palawija", "ltt-katam", "kelembagaan", "komoditas-unggulan", "harga-produsen"] },
  "horti-perkebunan": { label: "Bidang Hortikultura & Perkebunan", domains: ["hortikultura", "perkebunan", "kelembagaan", "komoditas-unggulan", "harga-produsen"] },
  peternakan: { label: "Bidang Peternakan", domains: ["peternakan", "kelembagaan", "komoditas-unggulan", "harga-produsen"] },
  perikanan: { label: "Bidang Perikanan", domains: ["perikanan", "kelembagaan", "komoditas-unggulan", "harga-produsen"] },
  "ketahanan-pangan": { label: "Bidang Ketahanan Pangan", domains: ["harga-pasar", "fsva-desa", "neraca-pangan", "psat-pduk", "lumbung", "harga-produsen"] },
};

// Daftar akun terdaftar. `passEnv` menunjuk nama variabel lingkungan tempat
// kata sandi akun tersebut disimpan.
export const USERS = [
  { user: "admin", role: "admin", passEnv: "ADMIN_PASS" },
  { user: "tanaman-pangan", role: "tanaman-pangan", passEnv: "PASS_TANAMAN_PANGAN" },
  { user: "horti-perkebunan", role: "horti-perkebunan", passEnv: "PASS_HORTI_PERKEBUNAN" },
  { user: "peternakan", role: "peternakan", passEnv: "PASS_PETERNAKAN" },
  { user: "perikanan", role: "perikanan", passEnv: "PASS_PERIKANAN" },
  { user: "ketahanan-pangan", role: "ketahanan-pangan", passEnv: "PASS_KETAHANAN_PANGAN" },
];

/** Apakah peran berhak atas domain tertentu? admin = semua; peran tak dikenal = tidak. */
export function roleAllowsDomain(role, domain) {
  const r = ROLES[role];
  if (!r) return false;
  if (r.domains === null) return true;
  return r.domains.includes(domain);
}

/** Label ramah untuk peran (fallback = nama peran mentah). */
export function roleLabel(role) {
  return ROLES[role]?.label ?? String(role ?? "?");
}
