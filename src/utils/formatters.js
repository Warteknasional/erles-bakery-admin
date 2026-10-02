/**
 * Format angka ke Rupiah (Rp 1.500.000)
 */
export function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
}

/**
 * Format tanggal ISO ke format lokal Indonesia (15 Jan 2026)
 */
export function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format tanggal ISO ke format lengkap (Rabu, 15 Januari 2026)
 */
export function formatTanggalLengkap(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
