import api from './api';

/**
 * Finance service — list, summary, CRUD transaksi.
 * Semua fungsi mengembalikan object dengan format envelope API.
 */
export const financeService = {
  /**
   * GET /api/finance
   * @param {{ tipe?, kategori?, tanggal_mulai?, tanggal_akhir?, search?, page?, per_page? }} params
   */
  async list(params = {}) {
    try {
      const { data } = await api.get('/finance', { params });
      return data;
    } catch (err) {
      if (err.success === false) return err;
      return { success: false, message: 'Gagal memuat daftar transaksi.' };
    }
  },

  /**
   * GET /api/finance/summary
   * @param {{ bulan?, tahun? }} params
   */
  async summary(params = {}) {
    try {
      const { data } = await api.get('/finance/summary', { params });
      return data;
    } catch (err) {
      if (err.success === false) return err;
      return { success: false, message: 'Gagal memuat ringkasan keuangan.' };
    }
  },

  /**
   * POST /api/finance
   * @param {{ tipe, nominal, kategori, catatan?, tanggal }} body
   */
  async create(body) {
    try {
      const { data } = await api.post('/finance', body);
      return data;
    } catch (err) {
      if (err.success === false) return err;
      return { success: false, message: 'Gagal menyimpan transaksi.' };
    }
  },

  /**
   * PUT /api/finance/{id}
   */
  async update(id, body) {
    try {
      const { data } = await api.put(`/finance/${id}`, body);
      return data;
    } catch (err) {
      if (err.success === false) return err;
      return { success: false, message: 'Gagal memperbarui transaksi.' };
    }
  },

  /**
   * DELETE /api/finance/{id}
   */
  async delete(id) {
    try {
      const { data } = await api.delete(`/finance/${id}`);
      return data;
    } catch (err) {
      if (err.success === false) return err;
      return { success: false, message: 'Gagal menghapus transaksi.' };
    }
  },
};
