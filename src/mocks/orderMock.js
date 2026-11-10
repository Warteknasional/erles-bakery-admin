/**
 * Mock data pesanan Erles Bakery — bentuk response sesuai kontrak API backend.
 * Envelope: { success, message, data, meta }
 * Produk: Sourdough Country Boule, Olive & Rosemary Ciabatta, French Baguette Tradisi,
 *         Donat Kentang Gula Halus, Donat Coklat Almond Panggang, Hampers Lebaran Deluxe.
 */

const mockOrders = [
  {
    id: 1,
    kode_pesanan: 'ORD-20261001-0001',
    customer_name: 'Budi Santoso',
    customer_phone: '081234567890',
    alamat: 'Jl. Soekarno Hatta No. 12, Lowokwaru, Malang',
    catatan: 'Tolong dikemas rapi untuk sarapan keluarga',
    tanggal_ambil: '2026-10-05',
    total_price: 395000,
    status: 'pending',
    items: [
      {
        id: 1, product_id: 6, qty: 1, unit_price: 350000, subtotal: 350000,
        product: { id: 6, nama: 'Hampers Lebaran Deluxe', harga: 350000 },
      },
      {
        id: 2, product_id: 1, qty: 1, unit_price: 45000, subtotal: 45000,
        product: { id: 1, nama: 'Sourdough Country Boule', harga: 45000 },
      },
    ],
    created_at: '2026-10-01T08:30:00.000000Z',
  },
  {
    id: 2,
    kode_pesanan: 'ORD-20261001-0002',
    customer_name: 'Siti Aminah',
    customer_phone: '081298765432',
    alamat: 'Jl. Ijen No. 25, Klojen, Kota Malang',
    catatan: 'Kirim via kurir instan Malang',
    tanggal_ambil: '2026-10-06',
    total_price: 92000,
    status: 'diproses',
    items: [
      {
        id: 3, product_id: 2, qty: 1, unit_price: 32000, subtotal: 32000,
        product: { id: 2, nama: 'Olive & Rosemary Ciabatta', harga: 32000 },
      },
      {
        id: 4, product_id: 5, qty: 5, unit_price: 12000, subtotal: 60000,
        product: { id: 5, nama: 'Donat Coklat Almond Panggang', harga: 12000 },
      },
    ],
    created_at: '2026-10-01T09:15:00.000000Z',
  },
  {
    id: 3,
    kode_pesanan: 'ORD-20261001-0003',
    customer_name: 'Ahmad Fauzi',
    customer_phone: '085612345678',
    alamat: 'Jl. Bendungan Sigura-gura No. 18, Sukun, Malang',
    catatan: 'Ambil di dapur jam 07.30 pagi',
    tanggal_ambil: '2026-10-04',
    total_price: 136000,
    status: 'selesai',
    items: [
      {
        id: 5, product_id: 3, qty: 2, unit_price: 28000, subtotal: 56000,
        product: { id: 3, nama: 'French Baguette Tradisi', harga: 28000 },
      },
      {
        id: 6, product_id: 4, qty: 10, unit_price: 8000, subtotal: 80000,
        product: { id: 4, nama: 'Donat Kentang Gula Halus', harga: 8000 },
      },
    ],
    created_at: '2026-10-01T10:00:00.000000Z',
  },
  {
    id: 4,
    kode_pesanan: 'ORD-20261002-0004',
    customer_name: 'Dewi Lestari',
    customer_phone: '087812345678',
    alamat: 'Jl. Kalpataru No. 45, Lowokwaru, Malang',
    catatan: 'Dibatalkan oleh pelanggan',
    tanggal_ambil: '2026-10-07',
    total_price: 90000,
    status: 'dibatalkan',
    items: [
      {
        id: 7, product_id: 1, qty: 2, unit_price: 45000, subtotal: 90000,
        product: { id: 1, nama: 'Sourdough Country Boule', harga: 45000 },
      },
    ],
    created_at: '2026-10-02T07:00:00.000000Z',
  },
  {
    id: 5,
    kode_pesanan: 'ORD-20261002-0005',
    customer_name: 'Rina Wati',
    customer_phone: '082112345678',
    alamat: 'Jl. Danau Toba Raya G6, Sawojajar, Malang',
    catatan: 'Tambahkan kartu ucapan kustom',
    tanggal_ambil: '2026-10-08',
    total_price: 350000,
    status: 'pending',
    items: [
      {
        id: 8, product_id: 6, qty: 1, unit_price: 350000, subtotal: 350000,
        product: { id: 6, nama: 'Hampers Lebaran Deluxe', harga: 350000 },
      },
    ],
    created_at: '2026-10-02T08:30:00.000000Z',
  },
];

/**
 * Simulasi delay jaringan (300-600ms).
 */
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockOrderService = {
  async getOrders(params = {}) {
    await delay();
    let filtered = [...mockOrders];

    if (params.status && params.status !== 'semua') {
      filtered = filtered.filter((o) => o.status === params.status);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.kode_pesanan.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.includes(q)
      );
    }

    const perPage = params.per_page || 10;
    const page = params.page || 1;
    const total = filtered.length;
    const lastPage = Math.ceil(total / perPage) || 1;
    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);

    return {
      success: true,
      message: 'Data pesanan berhasil diambil',
      data: paginated,
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total,
      },
    };
  },

  async getOrder(id) {
    await delay();
    const order = mockOrders.find((o) => o.id === Number(id));
    if (!order) {
      const err = new Error('Pesanan tidak ditemukan');
      err.response = { status: 404, data: { success: false, message: 'Pesanan tidak ditemukan' } };
      throw err;
    }
    return { success: true, message: 'Detail pesanan berhasil diambil', data: order };
  },

  async updateOrderStatus(id, status) {
    await delay();
    const order = mockOrders.find((o) => o.id === Number(id));
    if (!order) {
      const err = new Error('Pesanan tidak ditemukan');
      err.response = { status: 404, data: { success: false, message: 'Pesanan tidak ditemukan' } };
      throw err;
    }
    order.status = status;
    return { success: true, message: 'Status pesanan berhasil diperbarui', data: order };
  },
};

export default mockOrderService;
