import { Routes, Route } from 'react-router-dom';
import PesananPage from '../pages/PesananPage';
import KeuanganPage from '../pages/KeuanganPage';
import DashboardPage from '../pages/DashboardPage';
import ProdukPage from '../pages/ProdukPage';
import StokBahanPage from '../pages/StokBahanPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/pesanan" element={<PesananPage />} />
      <Route path="/keuangan" element={<KeuanganPage />} />
      <Route path="/produk" element={<ProdukPage />} />
      <Route path="/stok-bahan" element={<StokBahanPage />} />
    </Routes>
  );
}
