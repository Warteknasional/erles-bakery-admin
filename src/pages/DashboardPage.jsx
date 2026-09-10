import { Package, Wallet, TrendingUp, ShoppingCart } from 'lucide-react';

const stats = [
  { label: 'Total Pesanan', value: '24', icon: ShoppingCart, color: '#6366F1', bg: '#E0E7FF' },
  { label: 'Pesanan Aktif', value: '8', icon: Package, color: '#F59E0B', bg: '#FEF3C7' },
  { label: 'Pemasukan Bulan Ini', value: 'Rp 12.5 jt', icon: TrendingUp, color: '#10B981', bg: '#D1FAE5' },
  { label: 'Saldo Kas', value: 'Rp 8.2 jt', icon: Wallet, color: '#8B5CF6', bg: '#EDE9FE' },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ color: '#64748B', marginBottom: '32px', fontSize: '14px' }}>Selamat datang di Erles Bakery Admin Panel</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map(stat => (
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
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B', marginBottom: '12px' }}>Aktivitas Terbaru</h3>
        <p style={{ color: '#94A3B8', fontSize: '14px' }}>Data akan ditampilkan setelah terhubung ke backend API.</p>
      </div>
    </div>
  );
}
