import { Routes, Route } from 'react-router-dom';
import PesananPage from '../pages/PesananPage';
import KeuanganPage from '../pages/KeuanganPage';
import DashboardPage from '../pages/DashboardPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/pesanan" element={<PesananPage />} />
      <Route path="/keuangan" element={<KeuanganPage />} />
    </Routes>
  );
}
