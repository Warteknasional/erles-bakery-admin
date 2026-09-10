import { useState } from 'react';
import { Package, ChevronDown, Search, Filter } from 'lucide-react';

const dummyOrders = [
  { id: 1, kode: 'ORD-20240101-001', customer: 'Budi Santoso', phone: '081234567890', total: 250000, status: 'pending', date: '2024-01-15' },
  { id: 2, kode: 'ORD-20240101-002', customer: 'Siti Aminah', phone: '081298765432', total: 180000, status: 'diproses', date: '2024-01-15' },
  { id: 3, kode: 'ORD-20240101-003', customer: 'Ahmad Fauzi', phone: '085612345678', total: 450000, status: 'selesai', date: '2024-01-14' },
  { id: 4, kode: 'ORD-20240101-004', customer: 'Dewi Lestari', phone: '087812345678', total: 120000, status: 'dibatalkan', date: '2024-01-14' },
  { id: 5, kode: 'ORD-20240101-005', customer: 'Rina Wati', phone: '082112345678', total: 350000, status: 'pending', date: '2024-01-13' },
];

const statusColors = {
  pending: { bg: '#FEF3C7', text: '#92400E', label: 'Pending' },
  diproses: { bg: '#DBEAFE', text: '#1E40AF', label: 'Diproses' },
  selesai: { bg: '#D1FAE5', text: '#065F46', label: 'Selesai' },
  dibatalkan: { bg: '#FEE2E2', text: '#991B1B', label: 'Dibatalkan' },
};

const allStatuses = ['pending', 'diproses', 'selesai', 'dibatalkan'];

export default function PesananPage() {
  const [orders, setOrders] = useState(dummyOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus ? order.status === filterStatus : true;
    return matchesSearch && matchesFilter;
  });

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Package size={28} color="#6366F1" />
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: 0 }}>Kelola Pesanan</h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Cari kode pesanan atau nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 40px', border: '1px solid #E2E8F0',
              borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ position: 'relative', minWidth: '160px' }}>
          <Filter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 40px', border: '1px solid #E2E8F0',
              borderRadius: '8px', fontSize: '14px', outline: 'none', appearance: 'none',
              background: 'white', cursor: 'pointer',
            }}
          >
            <option value="">Semua Status</option>
            {allStatuses.map(s => (
              <option key={s} value={s}>{statusColors[s].label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Kode Pesanan', 'Pelanggan', 'Telepon', 'Total', 'Status', 'Tanggal'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <td style={{ padding: '14px 16px', fontWeight: '500', color: '#6366F1' }}>{order.kode}</td>
                <td style={{ padding: '14px 16px', color: '#1E293B' }}>{order.customer}</td>
                <td style={{ padding: '14px 16px', color: '#64748B' }}>{order.phone}</td>
                <td style={{ padding: '14px 16px', fontWeight: '600', color: '#1E293B' }}>{formatRupiah(order.total)}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: '6px 28px 6px 12px', borderRadius: '20px', border: 'none', fontSize: '12px',
                        fontWeight: '600', cursor: 'pointer', appearance: 'none',
                        backgroundColor: statusColors[order.status].bg,
                        color: statusColors[order.status].text,
                      }}
                    >
                      {allStatuses.map(s => (
                        <option key={s} value={s}>{statusColors[s].label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: statusColors[order.status].text }} />
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: '#64748B' }}>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
