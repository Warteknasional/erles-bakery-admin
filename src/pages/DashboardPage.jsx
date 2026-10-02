import { useState, useEffect } from 'react';
import { Package, Wallet, TrendingUp, ShoppingCart, AlertCircle } from 'lucide-react';
import { financeService } from '../services/financeService';
import { orderService } from '../services/orderService';
import { formatRupiah } from '../utils/formatters';
import { LoadingState } from '../components/StateDisplay';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError(null);
      try {
        const [finRes, orderRes] = await Promise.all([
          financeService.summary(),
          orderService.list({ per_page: 1 }), // just to get total count
        ]);

        const totalOrders = orderRes.success ? orderRes.meta.total : 0;

        // Count active orders (pending + diproses)
        let activeOrders = 0;
        try {
          const [pendingRes, diprosesRes] = await Promise.all([
            orderService.list({ status: 'pending', per_page: 1 }),
            orderService.list({ status: 'diproses', per_page: 1 }),
          ]);
          activeOrders =
            (pendingRes.success ? pendingRes.meta.total : 0) +
            (diprosesRes.success ? diprosesRes.meta.total : 0);
        } catch {
          // ignore
        }

        setStats({
          totalOrders,
          activeOrders,
          pemasukan: finRes.success ? finRes.data.total_pemasukan : 0,
          saldo: finRes.success ? finRes.data.saldo : 0,
        });
      } catch {
        setError('Gagal memuat data dashboard.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingState message="Memuat dashboard..." />;
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px' }}>
        <AlertCircle size={36} color="#EF4444" style={{ marginBottom: '12px' }} />
        <p style={{ color: '#991B1B', fontWeight: '500' }}>{error}</p>
      </div>
    );
  }

  const cards = [
    { label: 'Total Pesanan', value: String(stats?.totalOrders || 0), icon: ShoppingCart, color: '#6366F1', bg: '#E0E7FF' },
    { label: 'Pesanan Aktif', value: String(stats?.activeOrders || 0), icon: Package, color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Pemasukan Bulan Ini', value: formatRupiah(stats?.pemasukan || 0), icon: TrendingUp, color: '#10B981', bg: '#D1FAE5' },
    { label: 'Saldo Kas', value: formatRupiah(stats?.saldo || 0), icon: Wallet, color: '#8B5CF6', bg: '#EDE9FE' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ color: '#64748B', marginBottom: '32px', fontSize: '14px' }}>Selamat datang di Erles Bakery Admin Panel</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {cards.map(stat => (
          <div key={stat.label} style={{
            background: 'white', borderRadius: '12px', padding: '24px',
            border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>{stat.label}</span>
              <div style={{ background: stat.bg, borderRadius: '8px', padding: '8px', display: 'flex' }}>
                <stat.icon size={20} color={stat.color} />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1E293B' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B', marginBottom: '12px' }}>Ringkasan</h3>
        <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6' }}>
          Dashboard menampilkan data real-time dari API. Gunakan menu <strong>Pesanan</strong> untuk mengelola pesanan
          dan menu <strong>Keuangan</strong> untuk mencatat transaksi.
        </p>
      </div>
    </div>
  );
}
