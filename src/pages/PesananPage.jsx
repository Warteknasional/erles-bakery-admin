import { useState, useMemo } from 'react';
import {
  Package, ChevronDown, Search, Filter,
  Plus, X, Eye, ShoppingCart,
  TrendingUp, Clock, AlertCircle,
  Phone, Calendar, User, FileText,
  RotateCcw,
} from 'lucide-react';

// ─── Dummy Data ────────────────────────────────────────────────────────────────

const dummyOrders = [
  {
    id: 1, kode: 'ORD-20240115-001', customer: 'Budi Santoso', phone: '081234567890',
    total: 250000, status: 'pending', date: '2024-01-15',
    items: [{ nama: 'Roti Tawar Jumbo', qty: 3, harga: 45000 }, { nama: 'Croissant', qty: 5, harga: 25000 }],
    catatan: 'Tolong bungkus rapi, untuk kado.',
  },
  {
    id: 2, kode: 'ORD-20240115-002', customer: 'Siti Aminah', phone: '081298765432',
    total: 180000, status: 'diproses', date: '2024-01-15',
    items: [{ nama: 'Bolu Kukus Pandan', qty: 2, harga: 60000 }, { nama: 'Kue Sus', qty: 12, harga: 5000 }],
    catatan: '',
  },
  {
    id: 3, kode: 'ORD-20240114-003', customer: 'Ahmad Fauzi', phone: '085612345678',
    total: 450000, status: 'selesai', date: '2024-01-14',
    items: [{ nama: 'Hampers Pernikahan Premium', qty: 1, harga: 450000 }],
    catatan: 'Antar ke Jl. Melati No. 12 jam 10 pagi.',
  },
  {
    id: 4, kode: 'ORD-20240114-004', customer: 'Dewi Lestari', phone: '087812345678',
    total: 120000, status: 'dibatalkan', date: '2024-01-14',
    items: [{ nama: 'Donat Glazed', qty: 12, harga: 8000 }, { nama: 'Roti Coklat', qty: 6, harga: 4000 }],
    catatan: 'Customer minta batal karena ada acara mendadak.',
  },
  {
    id: 5, kode: 'ORD-20240113-005', customer: 'Rina Wati', phone: '082112345678',
    total: 350000, status: 'pending', date: '2024-01-13',
    items: [{ nama: 'Kue Ulang Tahun 20cm', qty: 1, harga: 280000 }, { nama: 'Lilin Dekorasi', qty: 1, harga: 70000 }],
    catatan: 'Tolong tulis "Happy Birthday Rina" di kuenya.',
  },
  {
    id: 6, kode: 'ORD-20240113-006', customer: 'Hendra Gunawan', phone: '083312345678',
    total: 540000, status: 'selesai', date: '2024-01-13',
    items: [{ nama: 'Brownies Panggang Loyang', qty: 3, harga: 120000 }, { nama: 'Cookies Box', qty: 3, harga: 60000 }],
    catatan: '',
  },
  {
    id: 7, kode: 'ORD-20240112-007', customer: 'Maya Putri', phone: '084412345678',
    total: 195000, status: 'diproses', date: '2024-01-12',
    items: [{ nama: 'Roti Sobek Keju', qty: 3, harga: 35000 }, { nama: 'Pisang Bolen', qty: 12, harga: 10000 }],
    catatan: 'Ambil sendiri jam 3 sore.',
  },
  {
    id: 8, kode: 'ORD-20240112-008', customer: 'Rizky Pratama', phone: '085512345678',
    total: 680000, status: 'selesai', date: '2024-01-12',
    items: [{ nama: 'Tart Strawberry 24cm', qty: 1, harga: 380000 }, { nama: 'Cupcake Box 12pcs', qty: 2, harga: 150000 }],
    catatan: 'Pesanan untuk acara syukuran.',
  },
  {
    id: 9, kode: 'ORD-20240111-009', customer: 'Lina Marlina', phone: '086612345678',
    total: 96000, status: 'pending', date: '2024-01-11',
    items: [{ nama: 'Roti Gandum Slice', qty: 4, harga: 18000 }, { nama: 'Selai Coklat 200gr', qty: 2, harga: 15000 }],
    catatan: '',
  },
  {
    id: 10, kode: 'ORD-20240111-010', customer: 'Doni Setiawan', phone: '087712345678',
    total: 420000, status: 'diproses', date: '2024-01-11',
    items: [{ nama: 'Hampers Lebaran Medium', qty: 2, harga: 210000 }],
    catatan: 'Dikirim ke dua alamat berbeda.',
  },
  {
    id: 11, kode: 'ORD-20240110-011', customer: 'Ayu Rahayu', phone: '088812345678',
    total: 310000, status: 'selesai', date: '2024-01-10',
    items: [{ nama: 'Chiffon Cake Pandan', qty: 2, harga: 95000 }, { nama: 'Bolu Gulung Moka', qty: 2, harga: 60000 }],
    catatan: '',
  },
  {
    id: 12, kode: 'ORD-20240110-012', customer: 'Fajar Nugroho', phone: '089912345678',
    total: 165000, status: 'dibatalkan', date: '2024-01-10',
    items: [{ nama: 'Mochi Ice Cream Box', qty: 3, harga: 55000 }],
    catatan: 'Batal karena stok habis.',
  },
];

const statusConfig = {
  pending: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B', label: 'Pending' },
  diproses: { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6', label: 'Diproses' },
  selesai: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981', label: 'Selesai' },
  dibatalkan: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444', label: 'Dibatalkan' },
};

const allStatuses = ['pending', 'diproses', 'selesai', 'dibatalkan'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(num);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({ icon: Icon, label, value, accent, bg }) {
  return (
    <div style={{
      background: 'white', borderRadius: '12px',
      padding: '18px 20px', border: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      borderLeft: `4px solid ${accent}`,
      display: 'flex', alignItems: 'center', gap: '14px',
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(99,102,241,0.10)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
      }}
    >
      <div style={{ background: bg, borderRadius: '10px', padding: '10px', display: 'flex', flexShrink: 0 }}>
        <Icon size={20} color={accent} />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500', marginBottom: '3px' }}>{label}</div>
        <div style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B' }}>{value}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 11px', borderRadius: '20px',
      background: cfg.bg, color: cfg.text,
      fontSize: '12px', fontWeight: '700',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

// ─── Modal Detail ─────────────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose, onStatusChange }) {
  if (!order) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          animation: 'fadeIn 0.15s ease',
        }}
      />
      <style>{`
        @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp  { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Modal */}
      <div style={{
        position: 'fixed', zIndex: 1000,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(560px, calc(100vw - 48px))',
        maxHeight: 'calc(100vh - 80px)',
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(30, 27, 75, 0.20)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        animation: 'slideUp 0.2s ease',
      }}>

        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#A5B4FC', fontWeight: '500', marginBottom: '3px' }}>
              Detail Pesanan
            </div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF' }}>
              {order.kode}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '8px',
            width: '34px', height: '34px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'white',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>

          {/* Info rows */}
          {[
            { icon: User, label: 'Pelanggan', value: order.customer },
            { icon: Phone, label: 'Telepon', value: order.phone },
            { icon: Calendar, label: 'Tanggal', value: order.date },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '14px',
            }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '9px',
                background: '#EEF2FF', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
              }}>
                <row.icon size={16} color="#6366F1" />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '500' }}>{row.label}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>{row.value}</div>
              </div>
            </div>
          ))}

          {/* Status selector */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '20px',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: '#EEF2FF', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}>
              <AlertCircle size={16} color="#6366F1" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '500', marginBottom: '5px' }}>Status</div>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <select
                  value={order.status}
                  onChange={e => onStatusChange(order.id, e.target.value)}
                  style={{
                    padding: '6px 30px 6px 12px',
                    borderRadius: '20px', border: 'none',
                    fontSize: '13px', fontWeight: '700',
                    cursor: 'pointer', appearance: 'none',
                    backgroundColor: statusConfig[order.status].bg,
                    color: statusConfig[order.status].text,
                    outline: 'none',
                  }}
                >
                  {allStatuses.map(s => (
                    <option key={s} value={s}>{statusConfig[s].label}</option>
                  ))}
                </select>
                <ChevronDown size={13} style={{
                  position: 'absolute', right: '9px', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none',
                  color: statusConfig[order.status].text,
                }} />
              </div>
            </div>
          </div>

          {/* Items list */}
          <div style={{
            background: '#F8FAFC', borderRadius: '12px',
            border: '1px solid #E2E8F0', overflow: 'hidden',
            marginBottom: '16px',
          }}>
            <div style={{
              padding: '12px 16px', borderBottom: '1px solid #E2E8F0',
              display: 'flex', alignItems: 'center', gap: '7px',
            }}>
              <Package size={15} color="#6366F1" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B' }}>
                Item Pesanan
              </span>
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 16px',
                borderBottom: idx < order.items.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#1E293B' }}>{item.nama}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>
                    {item.qty} × {formatRupiah(item.harga)}
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#6366F1' }}>
                  {formatRupiah(item.qty * item.harga)}
                </div>
              </div>
            ))}
            {/* Total row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px',
              background: '#EEF2FF', borderTop: '1px solid #C7D2FE',
            }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#4338CA' }}>Total</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#4338CA' }}>
                {formatRupiah(order.total)}
              </span>
            </div>
          </div>

          {/* Catatan */}
          {order.catatan && (
            <div style={{
              background: '#FFFBEB', border: '1px solid #FDE68A',
              borderRadius: '10px', padding: '12px 14px',
              display: 'flex', gap: '9px', alignItems: 'flex-start',
            }}>
              <FileText size={15} color="#D97706" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <div style={{ fontSize: '11px', color: '#92400E', fontWeight: '600', marginBottom: '2px' }}>Catatan</div>
                <div style={{ fontSize: '13px', color: '#78350F' }}>{order.catatan}</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid #F1F5F9',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} style={{
            padding: '10px 24px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #6366F1, #312E81)',
            color: 'white', border: 'none', fontWeight: '700',
            fontSize: '14px', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(99,102,241,0.30)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            fontFamily: 'inherit',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.40)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,0.30)'; }}
          >
            Tutup
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PesananPage() {
  const [orders, setOrders] = useState(dummyOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );
    // Sync with modal if open
    setSelectedOrder(prev => prev?.id === orderId ? { ...prev, status: newStatus } : prev);
  };

  const hasActiveFilter = searchTerm || filterStatus || filterDate;

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterDate('');
  };

  const filteredOrders = useMemo(() => orders.filter(order => {
    const matchSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus ? order.status === filterStatus : true;
    const matchDate = filterDate ? order.date === filterDate : true;
    return matchSearch && matchStatus && matchDate;
  }), [orders, searchTerm, filterStatus, filterDate]);

  // Summary stats
  const totalPesanan = orders.length;
  const totalPending = orders.filter(o => o.status === 'pending').length;
  const totalDiproses = orders.filter(o => o.status === 'diproses').length;
  const nilaiTotal = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── [A] Header ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1, #312E81)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.30)',
          }}>
            <Package size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1E1B4B', margin: 0, letterSpacing: '-0.3px' }}>
              Kelola Pesanan
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
              {totalPesanan} pesanan terdaftar
            </p>
          </div>
        </div>

        <button
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #6366F1, #312E81)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            boxShadow: '0 3px 10px rgba(99,102,241,0.30)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(99,102,241,0.40)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 10px rgba(99,102,241,0.30)'; }}
        >
          <Plus size={17} />
          Tambah Pesanan
        </button>
      </div>

      {/* ── [B] Summary Cards ───────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
      }}>
        <SummaryCard icon={ShoppingCart} label="Total Pesanan" value={totalPesanan} accent="#6366F1" bg="#E0E7FF" />
        <SummaryCard icon={Clock} label="Pending" value={totalPending} accent="#F59E0B" bg="#FEF3C7" />
        <SummaryCard icon={AlertCircle} label="Diproses" value={totalDiproses} accent="#3B82F6" bg="#DBEAFE" />
        <SummaryCard icon={TrendingUp} label="Nilai Total" value={formatRupiah(nilaiTotal)} accent="#10B981" bg="#D1FAE5" />
      </div>

      {/* ── [C] Filter Bar ──────────────────────────────────────────── */}
      <div style={{
        background: 'white', borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '16px 20px',
        display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Cari kode atau nama pelanggan..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 38px',
              border: '1.5px solid #E2E8F0', borderRadius: '9px',
              fontSize: '13.5px', outline: 'none', boxSizing: 'border-box',
              transition: 'border-color 0.15s',
              fontFamily: 'inherit',
            }}
            onFocus={e => e.target.style.borderColor = '#6366F1'}
            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
          />
        </div>

        {/* Filter Status */}
        <div style={{ position: 'relative', minWidth: '150px' }}>
          <Filter size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 34px',
              border: '1.5px solid #E2E8F0', borderRadius: '9px',
              fontSize: '13.5px', outline: 'none', appearance: 'none',
              background: 'white', cursor: 'pointer',
              fontFamily: 'inherit',
              color: filterStatus ? '#1E293B' : '#94A3B8',
            }}
          >
            <option value="">Semua Status</option>
            {allStatuses.map(s => (
              <option key={s} value={s}>{statusConfig[s].label}</option>
            ))}
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }} />
        </div>

        {/* Filter Tanggal */}
        <div style={{ position: 'relative', minWidth: '155px' }}>
          <Calendar size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', zIndex: 1 }} />
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 34px',
              border: '1.5px solid #E2E8F0', borderRadius: '9px',
              fontSize: '13.5px', outline: 'none', boxSizing: 'border-box',
              background: 'white', cursor: 'pointer',
              fontFamily: 'inherit',
              color: filterDate ? '#1E293B' : '#94A3B8',
            }}
          />
        </div>

        {/* Reset */}
        {hasActiveFilter && (
          <button
            onClick={resetFilters}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 14px', borderRadius: '9px',
              border: '1.5px solid #EEF2FF',
              background: '#EEF2FF', color: '#6366F1',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#E0E7FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#EEF2FF'}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        )}

        {/* Result count */}
        <div style={{ marginLeft: 'auto', fontSize: '13px', color: '#94A3B8', whiteSpace: 'nowrap' }}>
          {filteredOrders.length} dari {orders.length} pesanan
        </div>
      </div>

      {/* ── [D] Tabel ───────────────────────────────────────────────── */}
      <div style={{
        background: 'white', borderRadius: '14px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Kode Pesanan', 'Pelanggan', 'Item', 'Total', 'Status', 'Tanggal', 'Aksi'].map(h => (
                  <th key={h} style={{
                    padding: '13px 16px', textAlign: 'left',
                    fontWeight: '700', color: '#64748B', fontSize: '12px',
                    borderBottom: '1px solid #E2E8F0',
                    whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.4px',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '56px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '14px',
                        background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Search size={24} color="#CBD5E1" />
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#94A3B8' }}>Tidak ada pesanan ditemukan</div>
                      <div style={{ fontSize: '13px', color: '#CBD5E1' }}>Coba ubah filter atau kata kunci pencarian.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id}
                    style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAFF'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    {/* Kode */}
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: '#6366F1', whiteSpace: 'nowrap' }}>
                      {order.kode}
                    </td>

                    {/* Pelanggan */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '13.5px' }}>{order.customer}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>{order.phone}</div>
                    </td>

                    {/* Item preview */}
                    <td style={{ padding: '14px 16px', minWidth: '160px' }}>
                      <div style={{ fontSize: '13px', color: '#1E293B', fontWeight: '500' }}>
                        {order.items[0].nama}
                      </div>
                      {order.items.length > 1 && (
                        <div style={{
                          display: 'inline-block', marginTop: '3px',
                          fontSize: '11px', color: '#6366F1', fontWeight: '700',
                          background: '#EEF2FF', borderRadius: '20px', padding: '1px 8px',
                        }}>
                          +{order.items.length - 1} item lainnya
                        </div>
                      )}
                    </td>

                    {/* Total */}
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: '#1E1B4B', whiteSpace: 'nowrap' }}>
                      {formatRupiah(order.total)}
                    </td>

                    {/* Status (editable) */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          style={{
                            padding: '5px 26px 5px 10px',
                            borderRadius: '20px', border: 'none',
                            fontSize: '12px', fontWeight: '700',
                            cursor: 'pointer', appearance: 'none',
                            backgroundColor: statusConfig[order.status].bg,
                            color: statusConfig[order.status].text,
                            outline: 'none',
                          }}
                        >
                          {allStatuses.map(s => (
                            <option key={s} value={s}>{statusConfig[s].label}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} style={{
                          position: 'absolute', right: '7px', top: '50%',
                          transform: 'translateY(-50%)', pointerEvents: 'none',
                          color: statusConfig[order.status].text,
                        }} />
                      </div>
                    </td>

                    {/* Tanggal */}
                    <td style={{ padding: '14px 16px', color: '#64748B', whiteSpace: 'nowrap', fontSize: '13px' }}>
                      {order.date}
                    </td>

                    {/* Aksi */}
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        title="Lihat detail"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '6px 13px', borderRadius: '8px',
                          border: '1.5px solid #E0E7FF',
                          background: '#EEF2FF', color: '#6366F1',
                          fontSize: '12px', fontWeight: '700',
                          cursor: 'pointer', fontFamily: 'inherit',
                          transition: 'background 0.12s, border-color 0.12s',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#E0E7FF'; e.currentTarget.style.borderColor = '#A5B4FC'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.borderColor = '#E0E7FF'; }}
                      >
                        <Eye size={13} />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredOrders.length > 0 && (
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#FAFAFA',
          }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>
              Menampilkan {filteredOrders.length} dari {orders.length} pesanan
            </span>
            <span style={{ fontSize: '12.5px', color: '#6366F1', fontWeight: '700' }}>
              Subtotal: {formatRupiah(filteredOrders.reduce((s, o) => s + o.total, 0))}
            </span>
          </div>
        )}
      </div>

      {/* ── [E] Modal Detail ─────────────────────────────────────────── */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
