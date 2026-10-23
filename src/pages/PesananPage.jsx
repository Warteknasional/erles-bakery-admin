import { useState, useEffect, useCallback } from 'react';
import { Package, Search, Filter, ChevronDown, Eye, X, AlertTriangle } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatRupiah, formatTanggal } from '../utils/formatters';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import { LoadingState, EmptyState, ErrorState } from '../components/StateDisplay';

const statusColors = {
  pending:    { bg: 'var(--color-warning-bg, #FFF8E1)', text: 'var(--color-warning-text, #78350F)', border: 'var(--color-warning-border, #FFE082)', label: 'Pending' },
  diproses:   { bg: 'var(--color-info-bg, #FDF0EA)', text: 'var(--color-info-text, #7C2D12)', border: 'var(--color-info-border, #F5CEBC)', label: 'Diproses' },
  selesai:    { bg: 'var(--color-success-bg, #E8F5E9)', text: 'var(--color-success-text, #1B5E20)', border: 'var(--color-success-border, #C8E6C9)', label: 'Selesai' },
  dibatalkan: { bg: 'var(--color-danger-bg, #FEF2F2)', text: 'var(--color-danger-text, #991B1B)', border: 'var(--color-danger-border, #FECACA)', label: 'Dibatalkan' },
};

const allStatuses = ['pending', 'diproses', 'selesai', 'dibatalkan'];

export default function PesananPage() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [isOfflineData, setIsOfflineData] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [detailOrder, setDetailOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [statusConfirm, setStatusConfirm] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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

      setIsOfflineData(!!res?.isOffline);

      if (res.success) {
        setOrders(res.data);
        setMeta(res.meta || { current_page: 1, last_page: 1, total: res.data.length });
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

  const openDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await orderService.detail(id);
      if (res.success) setDetailOrder(res.data);
    } catch {
      // API error handled silently, detail modal remains closed
    } finally {
      setDetailLoading(false);
    }
  };

  const requestStatusChange = (orderId, currentStatus, newStatus) => {
    setStatusConfirm({ orderId, currentStatus, newStatus });
  };

  const confirmStatusChange = async () => {
    if (!statusConfirm) return;
    setStatusLoading(true);
    try {
      const res = await orderService.updateStatus(statusConfirm.orderId, statusConfirm.newStatus);
      if (res.success) {
        fetchOrders();
        if (detailOrder && detailOrder.id === statusConfirm.orderId) {
          setDetailOrder(res.data);
        }
      }
    } catch {
      // API error handled silently
    } finally {
      setStatusLoading(false);
      setStatusConfirm(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: 'var(--color-primary-subtle, #FDF0EA)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Package size={24} color="var(--color-primary, #D97748)" />
        </div>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--color-text, #3D2817)', margin: 0 }}>
            Kelola Pesanan
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #705847)', margin: 0 }}>
            {meta.total} pesanan tercatat
          </p>
        </div>
      </div>

      {isOfflineData && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--color-warning-bg, #FFF8E1)',
          border: '1px solid var(--color-warning-border, #FFE082)',
          borderRadius: 'var(--radius-md, 8px)',
          padding: '12px 16px',
          marginBottom: '24px',
          color: 'var(--color-warning-text, #78350F)',
        }}>
          <AlertTriangle size={20} color="var(--color-warning, #9A6700)" />
          <span style={{ fontSize: '13px' }}>Mode Data Contoh (Offline) — Hubungkan backend Laravel untuk sinkronisasi pesanan riil.</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary, #705847)' }} />
          <input
            type="text"
            placeholder="Cari kode pesanan, nama pelanggan, atau telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid var(--color-border, #E8D9C5)',
              borderRadius: 'var(--radius-md, 8px)',
              fontSize: '14px',
              background: '#FFFFFF',
              color: 'var(--color-text, #3D2817)',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ position: 'relative', minWidth: '160px' }}>
          <Filter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary, #705847)' }} />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid var(--color-border, #E8D9C5)',
              borderRadius: 'var(--radius-md, 8px)',
              fontSize: '14px',
              appearance: 'none',
              background: '#FFFFFF',
              color: 'var(--color-text, #3D2817)',
              cursor: 'pointer',
            }}
          >
            <option value="">Semua Status</option>
            {allStatuses.map((s) => (
              <option key={s} value={s}>{statusColors[s].label}</option>
            ))}
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary, #705847)', pointerEvents: 'none' }} />
        </div>
      </div>

      <div style={{ borderRadius: 'var(--radius-lg, 12px)', border: '1px solid var(--color-border, #E8D9C5)', background: '#FFFFFF', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {loading ? (
          <LoadingState message="Memuat daftar pesanan..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchOrders} />
        ) : orders.length === 0 ? (
          <EmptyState message="Tidak ada pesanan yang sesuai filter." icon={Package} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg, #FAF6F0)' }}>
                  {['Kode Pesanan', 'Pelanggan', 'Total Harga', 'Status Pesanan', 'Tgl Ambil', 'Aksi'].map((h) => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-secondary, #705847)', borderBottom: '1px solid var(--color-border, #E8D9C5)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const sc = statusColors[order.status] || statusColors.pending;
                  return (
                    <tr
                      key={order.id}
                      style={{ borderBottom: '1px solid var(--color-border-subtle, #F5EDE4)', transition: 'background var(--transition-fast)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg, #FAF6F0)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--color-primary, #D97748)', whiteSpace: 'nowrap' }}>
                        {order.kode_pesanan}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: 'var(--color-text, #3D2817)', fontWeight: '600' }}>{order.customer_name}</div>
                        <div style={{ color: 'var(--color-text-secondary, #705847)', fontSize: '12px' }}>{order.customer_phone}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--color-text, #3D2817)', whiteSpace: 'nowrap' }}>
                        {formatRupiah(order.total_price)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <select
                            value={order.status}
                            onChange={(e) => requestStatusChange(order.id, order.status, e.target.value)}
                            style={{
                              padding: '6px 28px 6px 12px',
                              borderRadius: '6px',
                              border: `1px solid ${sc.border}`,
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              appearance: 'none',
                              backgroundColor: sc.bg,
                              color: sc.text,
                            }}
                            aria-label={`Ubah status pesanan ${order.kode_pesanan}`}
                          >
                            {allStatuses.map((s) => (
                              <option key={s} value={s}>{statusColors[s].label}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: sc.text }} />
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text-secondary, #705847)', whiteSpace: 'nowrap' }}>
                        {formatTanggal(order.tanggal_ambil)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => openDetail(order.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--color-border, #E8D9C5)',
                            background: '#FFFFFF',
                            color: 'var(--color-text, #3D2817)',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-primary, #D97748)';
                            e.currentTarget.style.color = 'var(--color-primary, #D97748)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-border, #E8D9C5)';
                            e.currentTarget.style.color = 'var(--color-text, #3D2817)';
                          }}
                        >
                          <Eye size={14} /> Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border-subtle, #F5EDE4)' }}>
            <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!statusConfirm}
        title="Ubah Status Pesanan"
        message={
          statusConfirm
            ? `Ubah status pesanan ${orders.find(o => o.id === statusConfirm.orderId)?.kode_pesanan || ''} dari "${statusColors[statusConfirm.currentStatus]?.label}" menjadi "${statusColors[statusConfirm.newStatus]?.label}"?`
            : ''
        }
        confirmLabel="Ya, Ubah Status"
        variant={statusConfirm?.newStatus === 'dibatalkan' ? 'danger' : 'primary'}
        onConfirm={confirmStatusChange}
        onCancel={() => { setStatusConfirm(null); fetchOrders(); }}
        loading={statusLoading}
      />

      {(detailOrder || detailLoading) && (
        <OrderDetailModal
          order={detailOrder}
          loading={detailLoading}
          onClose={() => setDetailOrder(null)}
        />
      )}
    </div>
  );
}

function OrderDetailModal({ order, loading, onClose }) {
  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(44, 29, 17, 0.6)' }}>
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg, 12px)', padding: '40px', border: '1px solid var(--color-border, #E8D9C5)' }}>
          <LoadingState message="Memuat rincian pesanan..." />
        </div>
      </div>
    );
  }

  if (!order) return null;

  const sc = statusColors[order.status] || statusColors.pending;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(44, 29, 17, 0.6)',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg, 12px)',
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border, #E8D9C5)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border, #E8D9C5)',
          background: 'var(--color-bg, #FAF6F0)',
        }}>
          <div>
            <h2 id="order-detail-title" style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--color-text, #3D2817)', margin: 0 }}>
              {order.kode_pesanan}
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary, #705847)' }}>
              Dipesan pada: {formatTanggal(order.created_at)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              background: sc.bg,
              color: sc.text,
              border: `1px solid ${sc.border}`,
            }}>
              {sc.label}
            </span>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary, #705847)', display: 'flex', padding: '4px' }}
              aria-label="Tutup detail"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border-subtle, #F5EDE4)' }}>
          <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-secondary, #705847)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            Informasi Pemesan
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <InfoItem label="Nama Pemesan" value={order.customer_name} />
            <InfoItem label="No. Telepon / WhatsApp" value={order.customer_phone} />
            <InfoItem label="Alamat Pengiriman / Toko" value={order.alamat || 'Ambil Langsung di Toko'} />
            <InfoItem label="Jadwal Pengambilan" value={formatTanggal(order.tanggal_ambil)} />
          </div>
          {order.catatan && (
            <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '8px', background: 'var(--color-warning-bg, #FFF8E1)', border: '1px solid var(--color-warning-border, #FFE082)', fontSize: '13px', color: 'var(--color-warning-text, #78350F)' }}>
              <strong>Catatan Khusus:</strong> {order.catatan}
            </div>
          )}
        </div>

        <div style={{ padding: '20px 24px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-secondary, #705847)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            Rincian Produk Roti / Hampers
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {order.items?.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'var(--color-bg, #FAF6F0)',
                  border: '1px solid var(--color-border-subtle, #F5EDE4)',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--color-text, #3D2817)', fontSize: '14px' }}>
                    {item.product?.nama || `Produk #${item.product_id}`}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary, #705847)' }}>
                    {item.qty} × {formatRupiah(item.unit_price)}
                  </div>
                </div>
                <div style={{ fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--color-text, #3D2817)', fontSize: '14px' }}>
                  {formatRupiah(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '18px',
            padding: '14px 18px',
            borderRadius: '8px',
            background: 'var(--color-primary-subtle, #FDF0EA)',
            border: '1px solid var(--color-primary-light, #F5CEBC)',
          }}>
            <span style={{ fontWeight: '600', color: 'var(--color-primary-dark, #9E471F)', fontSize: '14px' }}>Total Tagihan</span>
            <span style={{ fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--color-primary-dark, #9E471F)', fontSize: '18px' }}>
              {formatRupiah(order.total_price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary, #705847)', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '14px', color: 'var(--color-text, #3D2817)', fontWeight: '600' }}>{value}</div>
    </div>
  );
}
