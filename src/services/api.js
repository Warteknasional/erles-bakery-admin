import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem('auth_token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (status === 422) {
        return Promise.reject({
          success: false,
          message: data.message || 'Validasi gagal.',
          errors: data.errors || {},
        });
      }

      return Promise.reject({
        success: false,
        message: data.message || `Error ${status}`,
      });
    }

    return Promise.reject({
      success: false,
      message: 'Tidak dapat terhubung ke server. Periksa koneksi internet.',
    });
  }
);

export default api;
