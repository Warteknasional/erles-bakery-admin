import { useState, useMemo } from 'react';
import {
  Package, ChevronDown, Search, Plus, X, Eye, ShoppingCart,
  Clock, AlertCircle, Phone, Calendar, User, FileText,
  RotateCcw, CheckCircle2, XCircle
} from 'lucide-react';
import Pagination from '../components/common/Pagination';

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
  pending: { bg: '#FEF9C3', text: '#854D0E', dot: '#CA8A04', label: 'Menunggu' },
  diproses: { bg: '#FFF7ED', text: '#9A3412', dot: '#EA580C', label: 'Diproses' },
  selesai: { bg: '#F0FDF4', text: '#166534', dot: '#16A34A', label: 'Selesai' },
  dibatalkan: { bg: '#FEF2F2', text: '#991B1B', dot: '#DC2626', label: 'Dibatalkan' },
};

const allStatuses = ['pending', 'diproses', 'selesai', 'dibatalkan'];

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(num);
}

// ─── Modal Detail Pesanan ─────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose, onStatusChange }) {
  if (!order) return null;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 1099,
        background: 'rgba(36, 27, 20, 0.45)', backdropFilter: 'blur(2px)',
      }} />
      <div style={{
        position: 'fixed', zIndex: 1100,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(480px, calc(100vw - 32px))',
        maxHeight: '90vh',
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E6DED4',
        boxShadow: '0 16px 40px rgba(36, 27, 20, 0.14)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #EFEAE3',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#8C7A6B', fontWeight: '600', letterSpacing: '0.04em' }}>
              RINCIAN PESANAN
            </div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#241B14' }}>
              {order.kode}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#8C7A6B',
            cursor: 'pointer', padding: '4px', borderRadius: '4px',
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Customer Metadata Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px',
            background: '#FAF7F2', padding: '12px 14px', borderRadius: '8px', border: '1px solid #EAE4DC',
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#8C7A6B' }}>Nama Pelanggan</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#241B14', marginTop: '2px' }}>{order.customer}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#8C7A6B' }}>Kontak WhatsApp</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#241B14', marginTop: '2px' }}>{order.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#8C7A6B' }}>Tanggal Pesanan</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#241B14', marginTop: '2px' }}>{order.date}</div>
            </div>
          </div>

          {/* Quick Status Control */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#5C4A3C' }}>Status Pesanan Saat Ini:</span>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <select
                value={order.status}
                onChange={e => onStatusChange(order.id, e.target.value)}
                style={{
                  padding: '5px 26px 5px 10px',
                  borderRadius: '4px', border: '1px solid #D4C5B9',
                  fontSize: '12px', fontWeight: '600',
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
                position: 'absolute', right: '8px', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
                color: statusConfig[order.status].text,
              }} />
            </div>
          </div>

          {/* Items breakdown list */}
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#241B14', marginBottom: '8px' }}>
              Daftar Item Roti & Kue:
            </div>
            <div style={{
              borderRadius: '8px', border: '1px solid #E6DED4', overflow: 'hidden',
            }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px',
                  borderBottom: idx < order.items.length - 1 ? '1px solid #F3EDE6' : 'none',
                  background: '#FFFFFF',
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#241B14' }}>{item.nama}</div>
                    <div style={{ fontSize: '11.5px', color: '#8C7A6B' }}>
                      {item.qty} × {formatRupiah(item.harga)}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#241B14', fontVariantNumeric: 'tabular-nums' }}>
                    {formatRupiah(item.qty * item.harga)}
                  </div>
                </div>
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px',
                background: '#FAF7F2',
                borderTop: '1px solid #E6DED4',
              }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#5C4A3C' }}>Total Pembayaran</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#241B14', fontVariantNumeric: 'tabular-nums' }}>
                  {formatRupiah(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Catatan Pelanggan */}
          {order.catatan && (
            <div style={{
              background: '#FEF9C3', border: '1px solid #FDE047',
              borderRadius: '8px', padding: '10px 12px',
            }}>
              <div style={{ fontSize: '11px', color: '#854D0E', fontWeight: '600', marginBottom: '2px' }}>
                Catatan Khusus Pelanggan:
              </div>
              <div style={{ fontSize: '12.5px', color: '#713F12' }}>{order.catatan}</div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid #EFEAE3',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} style={{
            padding: '8px 16px', borderRadius: '8px',
            background: '#241B14', color: '#FFFFFF', border: 'none',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          }}>
            Tutup
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function PesananPage() {
  const [orders, setOrders] = useState(dummyOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );
    setSelectedOrder(prev => prev?.id === orderId ? { ...prev, status: newStatus } : prev);
  };

  const hasActiveFilter = searchTerm || filterStatus || filterDate;

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterDate('');
    setCurrentPage(1);
  };

  const filteredOrders = useMemo(() => orders.filter(order => {
    const matchSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus ? order.status === filterStatus : true;
    const matchDate = filterDate ? order.date === filterDate : true;
    return matchSearch && matchStatus && matchDate;
  }), [orders, searchTerm, filterStatus, filterDate]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  // Metrics
  const totalPesanan  = orders.length;
  const totalPending  = orders.filter(o => o.status === 'pending').length;
  const totalDiproses = orders.filter(o => o.status === 'diproses').length;
  const totalSelesai  = orders.filter(o => o.status === 'selesai').length;
  const nilaiTotal    = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      color: '#241B14',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>

      {/* ── [1] HEADER ──────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '4px',
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#8C7A6B',
            fontWeight: '600',
            letterSpacing: '0.02em',
            marginBottom: '4px',
          }}>
            <span>ERLES BAKERY</span>
            <span style={{ color: '#D4C5B9' }}>/</span>
            <span>MANAJEMEN PESANAN</span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#241B14',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em',
          }}>
            Daftar Pesanan Pelanggan
          </h1>

          <div style={{ fontSize: '13px', color: '#6E5D4F' }}>
            {totalPending > 0 ? (
              <span style={{ color: '#B45309', fontWeight: '600' }}>
                {totalPending} pesanan menunggu konfirmasi dapur
              </span>
            ) : (
              <span style={{ color: '#166534', fontWeight: '500' }}>
                ✓ Tidak ada pesanan tertunda
              </span>
            )}
            <span style={{ color: '#D4C5B9', margin: '0 8px' }}>•</span>
            <span>Total omzet terdaftar {formatRupiah(nilaiTotal)}</span>
          </div>
        </div>

        <button
          onClick={() => {
            // Bisa membuka drawer atau tambah pesanan baru
            alert('Formulir pencatatan pesanan baru siap ditambahkan.');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: 'none',
            background: '#241B14',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#3D2D22'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#241B14'; }}
        >
          <Plus size={15} />
          Tambah Pesanan
        </button>
      </div>

      {/* ── [2] UNIFIED METRIC STRIP ─────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E6DED4',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
      }}>
        {/* Metric 1: Total Pesanan */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Total Pesanan
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {totalPesanan} <span style={{ fontSize: '14px', fontWeight: '500', color: '#8C7A6B' }}>nota</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Seluruh transaksi yang terdaftar
          </div>
        </div>

        {/* Metric 2: Menunggu Konfirmasi */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Menunggu Dapur
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: totalPending > 0 ? '#B45309' : '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {totalPending} <span style={{ fontSize: '14px', fontWeight: '500', color: '#8C7A6B' }}>antrean</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Butuh verifikasi jadwal oven
          </div>
        </div>

        {/* Metric 3: Sedang Diproses */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Sedang Dikerjakan
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {totalDiproses} <span style={{ fontSize: '14px', fontWeight: '500', color: '#8C7A6B' }}>pesanan</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Dalam tahap baking & packing
          </div>
        </div>

        {/* Metric 4: Nilai Total Omzet */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Akumulasi Nilai Pesanan
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {formatRupiah(nilaiTotal)}
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            {totalSelesai} pesanan telah selesai dikirim
          </div>
        </div>
      </div>

      {/* ── [3] FILTER CONTROLS ──────────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E6DED4',
        padding: '14px 18px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center',
        boxShadow: '0 1px 2px rgba(36,27,20,0.02)',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9C8B7E' }} />
          <input
            type="text"
            placeholder="Cari kode pesanan atau nama pelanggan..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              border: '1px solid #E6DED4',
              borderRadius: '7px',
              fontSize: '13px',
              color: '#241B14',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#FAF7F2',
            }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ minWidth: '150px' }}>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid #E6DED4',
              borderRadius: '7px',
              fontSize: '12.5px',
              color: '#4A3B30',
              background: '#FAF7F2',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="">Semua Status</option>
            {allStatuses.map(s => (
              <option key={s} value={s}>{statusConfig[s].label}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            style={{
              padding: '7px 9px',
              border: '1px solid #E6DED4',
              borderRadius: '7px',
              fontSize: '12px',
              color: '#4A3B30',
              background: '#FAF7F2',
            }}
          />
        </div>

        {/* Reset Filter */}
        {hasActiveFilter && (
          <button
            onClick={resetFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '7px 11px',
              borderRadius: '7px',
              border: '1px solid #E6DED4',
              background: '#FFFFFF',
              color: '#7D6B5C',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}

        {/* Counter */}
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#8C7A6B' }}>
          {filteredOrders.length} dari {orders.length} pesanan
        </div>
      </div>

      {/* ── [4] TABEL PESANAN (Clean, Sentence-case & Tabular Nums) ────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E6DED4',
        boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            textAlign: 'left',
          }}>
            <thead>
              <tr style={{
                background: '#FAF7F2',
                borderBottom: '1px solid #E6DED4',
                color: '#6E5D4F',
                fontSize: '12px',
                fontWeight: '600',
              }}>
                <th style={{ padding: '11px 18px' }}>Kode Pesanan</th>
                <th style={{ padding: '11px 18px' }}>Pelanggan</th>
                <th style={{ padding: '11px 18px' }}>Rincian Item</th>
                <th style={{ padding: '11px 18px', textAlign: 'right' }}>Total Bayar</th>
                <th style={{ padding: '11px 18px', textAlign: 'center' }}>Status Pesanan</th>
                <th style={{ padding: '11px 18px' }}>Tanggal</th>
                <th style={{ padding: '11px 18px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <Package size={28} color="#D4C5B9" />
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#7D6B5C' }}>
                        Tidak ada pesanan yang sesuai
                      </div>
                      <div style={{ fontSize: '12px', color: '#9C8B7E' }}>
                        Sesuaikan kata kunci pencarian atau reset filter status.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map(order => {
                  const badge = statusConfig[order.status];

                  return (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: '1px solid #F3EDE6',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAF7F2'}
                      onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                    >
                      {/* Kode Pesanan */}
                      <td style={{
                        padding: '12px 18px',
                        fontWeight: '600',
                        color: '#6E5D4F',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}>
                        {order.kode}
                      </td>

                      {/* Pelanggan */}
                      <td style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: '600', color: '#241B14' }}>{order.customer}</div>
                        <div style={{ fontSize: '11.5px', color: '#9C8B7E', marginTop: '2px' }}>{order.phone}</div>
                      </td>

                      {/* Rincian Item */}
                      <td style={{ padding: '12px 18px', minWidth: '180px', color: '#6E5D4F' }}>
                        <div style={{ fontWeight: '500', color: '#241B14' }}>
                          {order.items[0].nama}
                        </div>
                        {order.items.length > 1 && (
                          <div style={{ fontSize: '11.5px', color: '#8C7A6B', marginTop: '2px' }}>
                            +{order.items.length - 1} item lainnya
                          </div>
                        )}
                      </td>

                      {/* Total */}
                      <td style={{
                        padding: '12px 18px',
                        textAlign: 'right',
                        fontWeight: '700',
                        color: '#241B14',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}>
                        {formatRupiah(order.total)}
                      </td>

                      {/* Status Dropdown/Badge */}
                      <td style={{ padding: '12px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <select
                            value={order.status}
                            onChange={e => handleStatusChange(order.id, e.target.value)}
                            style={{
                              padding: '3px 22px 3px 8px',
                              borderRadius: '4px',
                              border: '1px solid transparent',
                              fontSize: '11.5px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              appearance: 'none',
                              backgroundColor: badge.bg,
                              color: badge.text,
                              outline: 'none',
                            }}
                          >
                            {allStatuses.map(s => (
                              <option key={s} value={s}>{statusConfig[s].label}</option>
                            ))}
                          </select>
                          <ChevronDown size={11} style={{
                            position: 'absolute', right: '6px', top: '50%',
                            transform: 'translateY(-50%)', pointerEvents: 'none',
                            color: badge.text,
                          }} />
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td style={{ padding: '12px 18px', color: '#8C7A6B', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {order.date}
                      </td>

                      {/* Aksi Detail */}
                      <td style={{ padding: '12px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 9px',
                            borderRadius: '4px',
                            border: '1px solid #E6DED4',
                            background: '#FFFFFF',
                            color: '#5C4A3C',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background 0.12s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#FAF7F2'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; }}
                        >
                          <Eye size={12} />
                          Rincian
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination 10 items/page */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredOrders.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ── [5] MODAL DETAIL PESANAN ─────────────────────────────────── */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
