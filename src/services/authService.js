import api from './api';

export const authService = {
  async login(email, password) {
    try {
      const { data } = await api.post('/login', { email, password });
      return data;
    } catch (err) {
      if (err.success === false) return err;
      return { success: false, message: 'Login gagal.' };
    }
  },

  async me() {
    try {
      const { data } = await api.get('/me');
      return data;
    } catch (err) {
      if (err.success === false) return err;
      return { success: false, message: 'Gagal mengambil profil.' };
    }
  },

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

export default authService;

