import api from './api';

/**
 * Order service — list, detail, update status.
 * Semua fungsi mengembalikan object dengan format envelope API.
 */
export const orderService = {
  /**
   * GET /api/orders
   * @param {{ status?, search?, tanggal_mulai?, tanggal_akhir?, page?, per_page? }} params
   */
  async list(params = {}) {
    try {
      const { data } = await api.get('/orders', { params });
      return data;
    } catch (err) {
      if (err.success === false) return err;
      return { success: false, message: 'Gagal memuat daftar pesanan.' };
    }
  },

  /**
   * GET /api/orders/{id}
   */
  async detail(id) {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    } catch (err) {
      if (err.success === false) return err;
      return { success: false, message: 'Gagal memuat detail pesanan.' };
    }
  },

  /**
   * PUT /api/orders/{id}/status
   * @param {number} id
   * @param {string} status — 'pending' | 'diproses' | 'selesai' | 'dibatalkan'
   */
  async updateStatus(id, status) {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      return data;
    } catch (err) {
      if (err.success === false) return err;
      return { success: false, message: 'Gagal mengubah status pesanan.' };
    }
  },
};
