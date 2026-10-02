import api from './api';

/**
 * Auth service — login, me, logout.
 */
export const authService = {
  /**
   * POST /api/login
   * @returns {{ success, message, data: { user, token, token_type } }}
   */
  async login(email, password) {
    try {
      const { data } = await api.post('/login', { email, password });
      return data;
    } catch (err) {
      // err sudah diformat oleh interceptor
      if (err.success === false) return err;
      return { success: false, message: 'Login gagal.' };
    }
  },

  /**
   * GET /api/me
   * @returns {{ success, message, data: { id, name, email, phone, role } }}
   */
  async me() {
    try {
      const { data } = await api.get('/me');
      return data;
    } catch (err) {
      if (err.success === false) return err;
      return { success: false, message: 'Gagal mengambil profil.' };
    }
  },

  /**
   * POST /api/logout
   */
  async logout() {
    try {
      const { data } = await api.post('/logout');
      return data;
    } catch (err) {
      if (err.success === false) return err;
      return { success: false, message: 'Logout gagal.' };
    }
  },
};
