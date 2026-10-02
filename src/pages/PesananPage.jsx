import { useState, useEffect, useCallback } from 'react';
import { Package, Search, Filter, ChevronDown, Eye, X } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatRupiah, formatTanggal } from '../utils/formatters';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import { LoadingState, EmptyState, ErrorState } from '../components/StateDisplay';

const statusColors = {
  pending:    { bg: '#FEF3C7', text: '#92400E', label: 'Pending' },
  diproses:   { bg: '#DBEAFE', text: '#1E40AF', label: 'Diproses' },
  selesai:    { bg: '#D1FAE5', text: '#065F46', label: 'Selesai' },
  dibatalkan: { bg: '#FEE2E2', text: '#991B1B', label: 'Dibatalkan' },
};

const allStatuses = ['pending', 'diproses', 'selesai', 'dibatalkan'];

export default function PesananPage() {
  // Data & pagination
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detail modal
  const [detailOrder, setDetailOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Status change confirmation
  const [statusConfirm, setStatusConfirm] = useState(null); // { orderId, currentStatus, newStatus }
  const [statusLoading, setStatusLoading] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderService.list({
        status: filterStatus || undefined,
        search: debouncedSearch || undefined,
        page,
        per_page: 5,
      });
      if (res.success) {
        setOrders(res.data);
        setMeta(res.meta);
      } else {
        setError(res.message);
      }
    } catch {
      setError('Gagal memuat data pesanan.');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, debouncedSearch, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Open detail
  const openDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await orderService.detail(id);
      if (res.success) setDetailOrder(res.data);
    } catch {
      // ignore
    } finally {
      setDetailLoading(false);
    }
  };

  // Status change request → show confirmation
  const requestStatusChange = (orderId, currentStatus, newStatus) => {
    setStatusConfirm({ orderId, currentStatus, newStatus });
  };

  // Confirm status change
  const confirmStatusChange = async () => {
    if (!statusConfirm) return;
    setStatusLoading(true);
    try {
      const res = await orderService.updateStatus(statusConfirm.orderId, statusConfirm.newStatus);
      if (res.success) {
        fetchOrders();
        // If detail modal is open for this order, update it
        if (detailOrder && detailOrder.id === statusConfirm.orderId) {
          setDetailOrder(res.data);
        }
      }
    } catch {
      // ignore
    } finally {
      setStatusLoading(false);
      setStatusConfirm(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Package size={28} color="#6366F1" />
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: 0 }}>
            Kelola Pesanan
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
            {meta.total} pesanan ditemukan
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Cari kode pesanan, nama, atau telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 40px', border: '1px solid #E2E8F0',
              borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              transition: 'border-color 150ms',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#6366F1')}
            onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
          />
        </div>
        <div style={{ position: 'relative', minWidth: '160px' }}>
          <Filter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            style={{
              width: '100%', padding: '10px 12px 10px 40px', border: '1px solid #E2E8F0',
              borderRadius: '8px', fontSize: '14px', outline: 'none', appearance: 'none',
              background: 'white', cursor: 'pointer',
            }}
          >
            <option value="">Semua Status</option>
            {allStatuses.map((s) => (
              <option key={s} value={s}>{statusColors[s].label}</option>
            ))}
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', overflow: 'hidden' }}>
        {loading ? (
          <LoadingState message="Memuat pesanan..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchOrders} />
        ) : orders.length === 0 ? (
          <EmptyState message="Tidak ada pesanan ditemukan." icon={Package} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Kode Pesanan', 'Pelanggan', 'Total', 'Status', 'Tgl Ambil', 'Aksi'].map((h) => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#64748B', borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 150ms' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: '500', color: '#6366F1', whiteSpace: 'nowrap' }}>
                      {order.kode_pesanan}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: '#1E293B', fontWeight: '500' }}>{order.customer_name}</div>
                      <div style={{ color: '#94A3B8', fontSize: '12px' }}>{order.customer_phone}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '600', color: '#1E293B', whiteSpace: 'nowrap' }}>
                      {formatRupiah(order.total_price)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <select
                          value={order.status}
                          onChange={(e) => requestStatusChange(order.id, order.status, e.target.value)}
                          style={{
                            padding: '6px 28px 6px 12px', borderRadius: '20px', border: 'none',
                            fontSize: '12px', fontWeight: '600', cursor: 'pointer', appearance: 'none',
                            backgroundColor: statusColors[order.status].bg,
                            color: statusColors[order.status].text,
                          }}
                        >
                          {allStatuses.map((s) => (
                            <option key={s} value={s}>{statusColors[s].label}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: statusColors[order.status].text }} />
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {formatTanggal(order.tanggal_ambil)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => openDetail(order.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '6px 14px', borderRadius: '8px',
                          border: '1px solid #E2E8F0', background: 'white',
                          color: '#6366F1', fontSize: '12px', fontWeight: '600',
                          cursor: 'pointer', transition: 'all 150ms',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#E0E7FF'; e.currentTarget.style.borderColor = '#6366F1'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                      >
                        <Eye size={14} /> Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9' }}>
            <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Status change confirmation */}
      <ConfirmModal
        open={!!statusConfirm}
        title="Ubah Status Pesanan"
        message={
          statusConfirm
            ? `Ubah status pesanan dari "${statusColors[statusConfirm.currentStatus]?.label}" menjadi "${statusColors[statusConfirm.newStatus]?.label}"?`
            : ''
        }
        confirmLabel="Ya, Ubah Status"
        variant={statusConfirm?.newStatus === 'dibatalkan' ? 'danger' : 'primary'}
        onConfirm={confirmStatusChange}
        onCancel={() => { setStatusConfirm(null); fetchOrders(); }}
        loading={statusLoading}
      />

      {/* Detail Modal */}
      {(detailOrder || detailLoading) && (
        <OrderDetailModal
          order={detailOrder}
          loading={detailLoading}
          onClose={() => setDetailOrder(null)}
          onStatusChange={requestStatusChange}
        />
      )}
    </div>
  );
}

/* ─── Order Detail Modal ──────────────────────── */

function OrderDetailModal({ order, loading, onClose, onStatusChange }) {
  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '40px' }}>
          <LoadingState message="Memuat detail pesanan..." />
        </div>
      </div>
    );
  }

  if (!order) return null;

  const sc = statusColors[order.status];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px',
          maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          animation: 'slideUp 200ms ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #E2E8F0',
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', margin: 0 }}>
              {order.kode_pesanan}
            </h2>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              Dibuat: {formatTanggal(order.created_at)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
              background: sc.bg, color: sc.text,
            }}>
              {sc.label}
            </span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', padding: '4px', borderRadius: '6px' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Customer Info */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            Info Pelanggan
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <InfoItem label="Nama" value={order.customer_name} />
            <InfoItem label="Telepon" value={order.customer_phone} />
            <InfoItem label="Alamat" value={order.alamat || '-'} />
            <InfoItem label="Tgl Ambil" value={formatTanggal(order.tanggal_ambil)} />
          </div>
          {order.catatan && (
            <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: '#FEF3C7', fontSize: '13px', color: '#92400E' }}>
              <strong>Catatan:</strong> {order.catatan}
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ padding: '20px 24px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            Item Pesanan
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {order.items?.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 14px', borderRadius: '8px', background: '#F8FAFC',
                }}
              >
                <div>
                  <div style={{ fontWeight: '500', color: '#1E293B', fontSize: '14px' }}>
                    {item.product?.nama || `Produk #${item.product_id}`}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                    {item.qty} × {formatRupiah(item.unit_price)}
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '14px' }}>
                  {formatRupiah(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: '16px', padding: '14px 16px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #E0E7FF, #EDE9FE)',
          }}>
            <span style={{ fontWeight: '600', color: '#4338CA', fontSize: '14px' }}>Total</span>
            <span style={{ fontWeight: '700', color: '#4338CA', fontSize: '18px' }}>
              {formatRupiah(order.total_price)}
            </span>
          </div>
        </div>

        <style>{`
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to   { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '14px', color: '#1E293B', fontWeight: '500' }}>{value}</div>
    </div>
  );
}
