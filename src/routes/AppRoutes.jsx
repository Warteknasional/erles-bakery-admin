import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PesananPage from '../pages/PesananPage';
import KeuanganPage from '../pages/KeuanganPage';
import ProdukPage from '../pages/ProdukPage';
import StokBahanPage from '../pages/StokBahanPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rute Terproteksi (Wajib Login Backend) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/pesanan" element={<PesananPage />} />
          <Route path="/keuangan" element={<KeuanganPage />} />
          <Route path="/produk" element={<ProdukPage />} />
          <Route path="/stok-bahan" element={<StokBahanPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
