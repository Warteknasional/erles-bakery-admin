/**
 * Mock data keuangan — bentuk response sesuai kontrak API backend.
 * Envelope: { success, message, data, meta }
 * Field: id, tipe, nominal, kategori, catatan, tanggal, user_id, order_id, created_at
 */

let nextId = 11;

const mockTransactions = [
  { id: 1, tipe: 'pemasukan', nominal: 545000, kategori: 'Penjualan', catatan: 'Pembayaran pesanan ORD-20261001-0001', tanggal: '2026-10-01', user_id: 1, order_id: 1, created_at: '2026-10-01T08:30:00.000000Z' },
  { id: 2, tipe: 'pengeluaran', nominal: 350000, kategori: 'Bahan Baku', catatan: 'Beli tepung terigu 25kg', tanggal: '2026-10-01', user_id: 1, order_id: null, created_at: '2026-10-01T09:00:00.000000Z' },
  { id: 3, tipe: 'pemasukan', nominal: 450000, kategori: 'Penjualan', catatan: 'Pembayaran pesanan ORD-20261001-0003', tanggal: '2026-10-01', user_id: 1, order_id: 3, created_at: '2026-10-01T10:00:00.000000Z' },
  { id: 4, tipe: 'pengeluaran', nominal: 150000, kategori: 'Operasional', catatan: 'Biaya listrik bulan Oktober', tanggal: '2026-10-01', user_id: 1, order_id: null, created_at: '2026-10-01T11:00:00.000000Z' },
  { id: 5, tipe: 'pemasukan', nominal: 180000, kategori: 'Penjualan', catatan: 'Pembayaran pesanan ORD-20261001-0002', tanggal: '2026-10-02', user_id: 1, order_id: 2, created_at: '2026-10-02T07:30:00.000000Z' },
  { id: 6, tipe: 'pengeluaran', nominal: 200000, kategori: 'Bahan Baku', catatan: 'Beli mentega wisman 2 kaleng', tanggal: '2026-10-02', user_id: 1, order_id: null, created_at: '2026-10-02T08:00:00.000000Z' },
  { id: 7, tipe: 'pengeluaran', nominal: 1200000, kategori: 'Gaji', catatan: 'Gaji karyawan bagian produksi', tanggal: '2026-10-02', user_id: 1, order_id: null, created_at: '2026-10-02T09:00:00.000000Z' },
  { id: 8, tipe: 'pemasukan', nominal: 625000, kategori: 'Penjualan', catatan: 'Pembayaran pesanan ORD-20261002-0006', tanggal: '2026-10-03', user_id: 1, order_id: 6, created_at: '2026-10-03T08:00:00.000000Z' },
  { id: 9, tipe: 'pengeluaran', nominal: 85000, kategori: 'Packaging', catatan: 'Beli box hampers 50 pcs', tanggal: '2026-10-03', user_id: 1, order_id: null, created_at: '2026-10-03T09:00:00.000000Z' },
  { id: 10, tipe: 'pemasukan', nominal: 190000, kategori: 'Penjualan', catatan: 'Pembayaran pesanan ORD-20261003-0008', tanggal: '2026-10-03', user_id: 1, order_id: 8, created_at: '2026-10-03T10:00:00.000000Z' },
];

function simulateDelay() {
  return new Promise((resolve) =>
    setTimeout(resolve, 300 + Math.random() * 300)
  );
}

function envelope(data, message = 'Berhasil.', meta = null) {
  const result = { success: true, message, data };
  if (meta) result.meta = meta;
  return result;
}

/**
 * GET /api/finance  — list transaksi keuangan dengan filter, search, pagination.
 */
export async function getTransactions({ tipe, kategori, tanggal_mulai, tanggal_akhir, search, page = 1, per_page = 5 } = {}) {
  await simulateDelay();

  let filtered = [...mockTransactions].sort((a, b) => b.id - a.id);

  if (tipe) filtered = filtered.filter((t) => t.tipe === tipe);
  if (kategori) filtered = filtered.filter((t) => t.kategori === kategori);
  if (tanggal_mulai) filtered = filtered.filter((t) => t.tanggal >= tanggal_mulai);
  if (tanggal_akhir) filtered = filtered.filter((t) => t.tanggal <= tanggal_akhir);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        (t.catatan && t.catatan.toLowerCase().includes(q)) ||
        t.kategori.toLowerCase().includes(q)
    );
  }

  // Summary of filtered data
  const total_pemasukan = filtered.filter((t) => t.tipe === 'pemasukan').reduce((s, t) => s + t.nominal, 0);
  const total_pengeluaran = filtered.filter((t) => t.tipe === 'pengeluaran').reduce((s, t) => s + t.nominal, 0);

  const total = filtered.length;
  const last_page = Math.max(1, Math.ceil(total / per_page));
  const safePage = Math.min(Math.max(1, page), last_page);
  const start = (safePage - 1) * per_page;
  const data = filtered.slice(start, start + per_page);

  return envelope(data, 'Daftar transaksi keuangan berhasil diambil.', {
    current_page: safePage,
    last_page,
    per_page,
    total,
    summary: {
      total_pemasukan,
      total_pengeluaran,
      saldo: total_pemasukan - total_pengeluaran,
    },
  });
}

/**
 * GET /api/finance/summary  — ringkasan keuangan.
 */
export async function getFinanceSummary({ bulan, tahun } = {}) {
  await simulateDelay();

  let filtered = [...mockTransactions];
  if (bulan) filtered = filtered.filter((t) => new Date(t.tanggal).getMonth() + 1 === Number(bulan));
  if (tahun) filtered = filtered.filter((t) => new Date(t.tanggal).getFullYear() === Number(tahun));

  const total_pemasukan = filtered.filter((t) => t.tipe === 'pemasukan').reduce((s, t) => s + t.nominal, 0);
  const total_pengeluaran = filtered.filter((t) => t.tipe === 'pengeluaran').reduce((s, t) => s + t.nominal, 0);

  return envelope({
    total_pemasukan,
    total_pengeluaran,
    saldo: total_pemasukan - total_pengeluaran,
  }, 'Ringkasan keuangan berhasil diambil.');
}

/**
 * POST /api/finance  — catat transaksi baru.
 */
export async function createTransaction(data) {
  await simulateDelay();

  // Validasi sederhana
  const errors = {};
  if (!data.tipe) errors.tipe = ['Tipe transaksi wajib diisi.'];
  if (!data.nominal || Number(data.nominal) <= 0) errors.nominal = ['Nominal harus lebih dari 0.'];
  if (!data.kategori) errors.kategori = ['Kategori wajib diisi.'];
  if (!data.tanggal) errors.tanggal = ['Tanggal wajib diisi.'];

  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'Validasi gagal.', errors };
  }

  const newTx = {
    id: nextId++,
    tipe: data.tipe,
    nominal: Number(data.nominal),
    kategori: data.kategori,
    catatan: data.catatan || null,
    tanggal: data.tanggal,
    user_id: 1,
    order_id: null,
    created_at: new Date().toISOString(),
  };
  mockTransactions.unshift(newTx);

  return envelope(newTx, 'Transaksi keuangan berhasil dicatat.');
}

/**
 * PUT /api/finance/{id}  — update transaksi.
 */
export async function updateTransaction(id, data) {
  await simulateDelay();
  const tx = mockTransactions.find((t) => t.id === Number(id));
  if (!tx) return { success: false, message: 'Transaksi tidak ditemukan.' };

  if (data.tipe) tx.tipe = data.tipe;
  if (data.nominal) tx.nominal = Number(data.nominal);
  if (data.kategori) tx.kategori = data.kategori;
  if (data.catatan !== undefined) tx.catatan = data.catatan;
  if (data.tanggal) tx.tanggal = data.tanggal;

  return envelope(tx, 'Transaksi keuangan berhasil diperbarui.');
}

/**
 * DELETE /api/finance/{id}  — hapus transaksi.
 */
export async function deleteTransaction(id) {
  await simulateDelay();
  const idx = mockTransactions.findIndex((t) => t.id === Number(id));
  if (idx === -1) return { success: false, message: 'Transaksi tidak ditemukan.' };

  mockTransactions.splice(idx, 1);
  return envelope(null, 'Transaksi keuangan berhasil dihapus.');
}
