/**
 * Mock data pesanan — bentuk response sesuai kontrak API backend.
 * Envelope: { success, message, data, meta }
 * Field: id, kode_pesanan, customer_name, customer_phone, alamat, catatan,
 *        tanggal_ambil, total_price, status, items[], created_at
 */

const mockOrders = [
  {
    id: 1,
    kode_pesanan: 'ORD-20261001-0001',
    customer_name: 'Budi Santoso',
    customer_phone: '081234567890',
    alamat: 'Jl. Merpati No. 12, Bandung',
    catatan: 'Tolong dikemas rapi',
    tanggal_ambil: '2026-10-05',
    total_price: 545000,
    status: 'pending',
    items: [
      {
        id: 1, product_id: 12, qty: 2, unit_price: 250000, subtotal: 500000,
        product: { id: 12, nama: 'Hampers Lebaran Classic', harga: 250000 },
      },
      {
        id: 2, product_id: 5, qty: 1, unit_price: 45000, subtotal: 45000,
        product: { id: 5, nama: 'Brownies Panggang', harga: 45000 },
      },
    ],
    created_at: '2026-10-01T08:30:00.000000Z',
  },
  {
    id: 2,
    kode_pesanan: 'ORD-20261001-0002',
    customer_name: 'Siti Aminah',
    customer_phone: '081298765432',
    alamat: 'Jl. Kenanga No. 7, Jakarta Selatan',
    catatan: null,
    tanggal_ambil: '2026-10-06',
    total_price: 180000,
    status: 'diproses',
    items: [
      {
        id: 3, product_id: 3, qty: 2, unit_price: 55000, subtotal: 110000,
        product: { id: 3, nama: 'Nastar Premium', harga: 55000 },
      },
      {
        id: 4, product_id: 8, qty: 1, unit_price: 70000, subtotal: 70000,
        product: { id: 8, nama: 'Red Velvet Cake Mini', harga: 70000 },
      },
    ],
    created_at: '2026-10-01T09:15:00.000000Z',
  },
  {
    id: 3,
    kode_pesanan: 'ORD-20261001-0003',
    customer_name: 'Ahmad Fauzi',
    customer_phone: '085612345678',
    alamat: 'Jl. Mawar No. 4, Jakarta Selatan',
    catatan: 'Kirim sebelum jam 10 pagi',
    tanggal_ambil: '2026-10-04',
    total_price: 450000,
    status: 'selesai',
    items: [
      {
        id: 5, product_id: 12, qty: 1, unit_price: 250000, subtotal: 250000,
        product: { id: 12, nama: 'Hampers Lebaran Classic', harga: 250000 },
      },
      {
        id: 6, product_id: 1, qty: 4, unit_price: 50000, subtotal: 200000,
        product: { id: 1, nama: 'Roti Sobek Coklat', harga: 50000 },
      },
    ],
    created_at: '2026-10-01T10:00:00.000000Z',
  },
  {
    id: 4,
    kode_pesanan: 'ORD-20261002-0004',
    customer_name: 'Dewi Lestari',
    customer_phone: '087812345678',
    alamat: 'Jl. Anggrek No. 22, Bogor',
    catatan: 'Dibatalkan oleh pelanggan',
    tanggal_ambil: '2026-10-07',
    total_price: 120000,
    status: 'dibatalkan',
    items: [
      {
        id: 7, product_id: 2, qty: 3, unit_price: 40000, subtotal: 120000,
        product: { id: 2, nama: 'Roti Tawar Gandum', harga: 40000 },
      },
    ],
    created_at: '2026-10-02T07:00:00.000000Z',
  },
  {
    id: 5,
    kode_pesanan: 'ORD-20261002-0005',
    customer_name: 'Rina Wati',
    customer_phone: '082112345678',
    alamat: 'Jl. Dahlia No. 9, Depok',
    catatan: 'Minta kantong kertas',
    tanggal_ambil: '2026-10-08',
    total_price: 350000,
    status: 'pending',
    items: [
      {
        id: 8, product_id: 10, qty: 1, unit_price: 350000, subtotal: 350000,
        product: { id: 10, nama: 'Hampers Spesial Ramadhan', harga: 350000 },
      },
    ],
    created_at: '2026-10-02T08:30:00.000000Z',
  },
  {
    id: 6,
    kode_pesanan: 'ORD-20261002-0006',
    customer_name: 'Joko Widodo',
    customer_phone: '081345678901',
    alamat: 'Jl. Sudirman No. 100, Jakarta Pusat',
    catatan: null,
    tanggal_ambil: '2026-10-09',
    total_price: 625000,
    status: 'diproses',
    items: [
      {
        id: 9, product_id: 12, qty: 2, unit_price: 250000, subtotal: 500000,
        product: { id: 12, nama: 'Hampers Lebaran Classic', harga: 250000 },
      },
      {
        id: 10, product_id: 4, qty: 1, unit_price: 125000, subtotal: 125000,
        product: { id: 4, nama: 'Kue Lapis Legit', harga: 125000 },
      },
    ],
    created_at: '2026-10-02T09:45:00.000000Z',
  },
  {
    id: 7,
    kode_pesanan: 'ORD-20261002-0007',
    customer_name: 'Maria Sari',
    customer_phone: '082234567890',
    alamat: 'Jl. Melati No. 15, Tangerang',
    catatan: 'Untuk acara ulang tahun',
    tanggal_ambil: '2026-10-10',
    total_price: 285000,
    status: 'pending',
    items: [
      {
        id: 11, product_id: 8, qty: 2, unit_price: 70000, subtotal: 140000,
        product: { id: 8, nama: 'Red Velvet Cake Mini', harga: 70000 },
      },
      {
        id: 12, product_id: 6, qty: 1, unit_price: 145000, subtotal: 145000,
        product: { id: 6, nama: 'Tart Ulang Tahun Custom', harga: 145000 },
      },
    ],
    created_at: '2026-10-02T11:00:00.000000Z',
  },
  {
    id: 8,
    kode_pesanan: 'ORD-20261003-0008',
    customer_name: 'Hendra Gunawan',
    customer_phone: '085698765432',
    alamat: 'Jl. Pahlawan No. 33, Bekasi',
    catatan: null,
    tanggal_ambil: '2026-10-11',
    total_price: 190000,
    status: 'selesai',
    items: [
      {
        id: 13, product_id: 3, qty: 2, unit_price: 55000, subtotal: 110000,
        product: { id: 3, nama: 'Nastar Premium', harga: 55000 },
      },
      {
        id: 14, product_id: 7, qty: 2, unit_price: 40000, subtotal: 80000,
        product: { id: 7, nama: 'Donat Gula Halus', harga: 40000 },
      },
    ],
    created_at: '2026-10-03T07:30:00.000000Z',
  },
];

/**
 * Simulasi delay jaringan (300-600ms).
 */
function simulateDelay() {
  return new Promise((resolve) =>
    setTimeout(resolve, 300 + Math.random() * 300)
  );
}

/**
 * Bungkus data dalam envelope standar API.
 */
function envelope(data, message = 'Berhasil.', meta = null) {
  const result = { success: true, message, data };
  if (meta) result.meta = meta;
  return result;
}

/**
 * GET /api/orders  — list pesanan dengan filter, search, pagination.
 */
export async function getOrders({ status, search, page = 1, per_page = 5 } = {}) {
  await simulateDelay();

  let filtered = [...mockOrders];

  if (status) {
    filtered = filtered.filter((o) => o.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.kode_pesanan.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q)
    );
  }

  const total = filtered.length;
  const last_page = Math.max(1, Math.ceil(total / per_page));
  const safePage = Math.min(Math.max(1, page), last_page);
  const start = (safePage - 1) * per_page;
  const data = filtered.slice(start, start + per_page);

  return envelope(data, 'Daftar pesanan berhasil diambil.', {
    current_page: safePage,
    last_page,
    per_page,
    total,
  });
}

/**
 * GET /api/orders/{id}  — detail pesanan.
 */
export async function getOrderDetail(id) {
  await simulateDelay();
  const order = mockOrders.find((o) => o.id === Number(id));
  if (!order) {
    return { success: false, message: 'Pesanan tidak ditemukan.' };
  }
  return envelope(order, 'Detail pesanan berhasil diambil.');
}

/**
 * PUT /api/orders/{id}/status  — ubah status pesanan.
 */
export async function updateOrderStatus(id, newStatus) {
  await simulateDelay();
  const order = mockOrders.find((o) => o.id === Number(id));
  if (!order) {
    return { success: false, message: 'Pesanan tidak ditemukan.' };
  }
  order.status = newStatus;
  return envelope(order, `Status pesanan berhasil diperbarui menjadi '${newStatus}'.`);
}
