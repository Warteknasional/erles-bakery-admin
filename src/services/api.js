import axios from 'axios';

/**
 * Instance axios terpusat untuk seluruh request API.
 *
 * - baseURL dari VITE_API_BASE_URL (default: http://localhost:8000/api)
 * - Interceptor request: sisipkan Bearer token dari localStorage
 * - Interceptor response:
 *   • 401 → hapus token & redirect ke /login
 *   • 422 → teruskan error validasi ke caller
 *   • network error → bungkus dalam format standar
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // withCredentials tidak diperlukan untuk token-based auth,
  // tapi diaktifkan untuk kompatibilitas jika backend pakai cookie session juga.
  withCredentials: true,
});

// ─── Request Interceptor ──────────────────────────
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

// ─── Response Interceptor ─────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 401 Unauthorized → token expired/invalid
      if (status === 401) {
        localStorage.removeItem('auth_token');
        // Redirect ke login, tapi hanya kalau belum di halaman login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      // 422 Validation Error → teruskan data error agar caller bisa tampilkan per field
      if (status === 422) {
        return Promise.reject({
          success: false,
          message: data.message || 'Validasi gagal.',
          errors: data.errors || {},
        });
      }

      // Error lainnya (403, 404, 500, dll)
      return Promise.reject({
        success: false,
        message: data.message || `Error ${status}`,
      });
    }

    // Network error / timeout
    return Promise.reject({
      success: false,
      message: 'Tidak dapat terhubung ke server. Periksa koneksi internet.',
    });
  }
);

export default api;
