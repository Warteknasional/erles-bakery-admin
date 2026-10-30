import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Package, ChevronDown, Search, Plus, X, Eye, ShoppingCart,
  Clock, AlertCircle, Phone, Calendar, User, FileText,
  RotateCcw, CheckCircle2, XCircle, RefreshCw, CreditCard
} from 'lucide-react';
import Pagination from '../components/common/Pagination';
import orderService from '../services/orderService';
import useToast from '../hooks/useToast';

// ─── Status Definitions ────────────────────────────────────────────────────────

const statusConfig = {
  pending: { bg: '#FEF9C3', text: '#854D0E', dot: '#CA8A04', label: 'Menunggu' },
  confirmed: { bg: '#E0F2FE', text: '#0369A1', dot: '#0284C7', label: 'Dikonfirmasi' },
  processing: { bg: '#FFF7ED', text: '#9A3412', dot: '#EA580C', label: 'Diproses' },
  ready: { bg: '#F3E8FF', text: '#6B21A8', dot: '#9333EA', label: 'Siap Ambil/Kirim' },
  completed: { bg: '#F0FDF4', text: '#166534', dot: '#16A34A', label: 'Selesai' },
  cancelled: { bg: '#FEF2F2', text: '#991B1B', dot: '#DC2626', label: 'Dibatalkan' },
};

const allStatuses = ['pending', 'confirmed', 'processing', 'ready', 'completed', 'cancelled'];

const paymentStatusConfig = {
  unpaid: { bg: '#FEF2F2', text: '#991B1B', label: 'Belum Bayar' },
  partial: { bg: '#FEF9C3', text: '#854D0E', label: 'DP / Sebagian' },
  paid: { bg: '#F0FDF4', text: '#166534', label: 'Lunas' },
};

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(num || 0);
}

// ─── Modal Detail & Kelola Pesanan ───────────────────────────────────────────

function OrderDetailModal({ order, onClose, onStatusChange, onPaymentAdded }) {
  const { showToast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(order?.sisa_pembayaran || 0);
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [paymentType, setPaymentType] = useState('lunas');
  const [paying, setPaying] = useState(false);

  if (!order) return null;

  const handleStatusSelect = async (newStatus) => {
    setUpdating(true);
    await onStatusChange(order.id, newStatus);
    setUpdating(false);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const nominal = Number(paymentAmount);
    if (!nominal || nominal <= 0) {
      showToast('Nominal pembayaran harus lebih dari 0.', 'error');
      return;
    }
    if (nominal > (order.sisa_pembayaran || order.total)) {
      showToast('Nominal pembayaran melebihi sisa tagihan pesanan.', 'error');
      return;
    }

    setPaying(true);
    try {
      await orderService.addPayment(order.id, {
        nominal,
        metode: paymentMethod,
        tipe: paymentType,
        tanggal: new Date().toISOString().split('T')[0],
        catatan: `Pembayaran ${paymentType} via ${paymentMethod} oleh admin`,
      });
      showToast('Pembayaran berhasil dicatat!', 'success');
      setShowPaymentForm(false);
      onPaymentAdded();
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mencatat pembayaran.';
      showToast(msg, 'error');
    } finally {
      setPaying(false);
    }
  };

  const pBadge = paymentStatusConfig[order.payment_status] || paymentStatusConfig.unpaid;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1099,
          background: 'rgba(36, 27, 20, 0.45)', backdropFilter: 'blur(2px)',
        }}
      />
      <div
        style={{
          position: 'fixed', zIndex: 1100,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(520px, calc(100vw - 32px))',
          maxHeight: '90vh',
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E6DED4',
          boxShadow: '0 16px 40px rgba(36, 27, 20, 0.14)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #EFEAE3',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#8C7A6B', fontWeight: '600', letterSpacing: '0.04em' }}>
              RINCIAN PESANAN
            </div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#241B14' }}>
              {order.kode}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: '#8C7A6B',
              cursor: 'pointer', padding: '4px', borderRadius: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Customer Metadata Grid */}
          <div
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px',
              background: '#FAF7F2', padding: '12px 14px', borderRadius: '8px', border: '1px solid #EAE4DC',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#8C7A6B' }}>Nama Pelanggan</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#241B14', marginTop: '2px' }}>{order.customer}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#8C7A6B' }}>Kontak / Telepon</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#241B14', marginTop: '2px' }}>{order.phone || '-'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#8C7A6B' }}>Jadwal Ambil</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#241B14', marginTop: '2px' }}>{order.date || '-'}</div>
            </div>
          </div>

          {/* Quick Status Control */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#5C4A3C' }}>Status Alur Pesanan:</span>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <select
                  disabled={updating || order.status === 'completed' || order.status === 'cancelled'}
                  value={order.status}
                  onChange={(e) => handleStatusSelect(e.target.value)}
                  style={{
                    padding: '6px 28px 6px 12px',
                    borderRadius: '6px', border: '1px solid #D4C5B9',
                    fontSize: '12.5px', fontWeight: '600',
                    cursor: updating ? 'not-allowed' : 'pointer', appearance: 'none',
                    backgroundColor: statusConfig[order.status]?.bg || '#FAF7F2',
                    color: statusConfig[order.status]?.text || '#241B14',
                    outline: 'none',
                  }}
                >
                  {allStatuses.map((s) => {
                    const isCurrent = s === order.status;
                    const allowedForCurrent = {
                      pending: ['confirmed', 'processing', 'cancelled'],
                      confirmed: ['processing', 'cancelled'],
                      processing: ['ready', 'completed', 'cancelled'],
                      ready: ['completed', 'cancelled'],
                      completed: [],
                      cancelled: [],
                    }[order.status] || [];

                    const isValid = isCurrent || allowedForCurrent.includes(s);

                    return (
                      <option key={s} value={s} disabled={!isValid}>
                        {statusConfig[s]?.label || s} {!isValid ? '(Lewati tahap)' : ''}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown
                  size={12}
                  style={{
                    position: 'absolute', right: '8px', top: '50%',
                    transform: 'translateY(-50%)', pointerEvents: 'none',
                    color: statusConfig[order.status]?.text || '#241B14',
                  }}
                />
              </div>
            </div>

            {/* Visual Workflow Hint */}
            <div
              style={{
                fontSize: '11px',
                color: '#8C7A6B',
                background: '#FAF7F2',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #EFEAE3',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontWeight: '600', color: '#5C4A3C' }}>Alur Resmi:</span>
              <span style={{ color: order.status === 'pending' ? '#B45309' : '#8C7A6B', fontWeight: order.status === 'pending' ? '700' : '400' }}>Menunggu</span>
              <span>➔</span>
              <span style={{ color: order.status === 'confirmed' ? '#0369A1' : '#8C7A6B', fontWeight: order.status === 'confirmed' ? '700' : '400' }}>Dikonfirmasi</span>
              <span>➔</span>
              <span style={{ color: order.status === 'processing' ? '#9A3412' : '#8C7A6B', fontWeight: order.status === 'processing' ? '700' : '400' }}>Diproses Dapur</span>
              <span>➔</span>
              <span style={{ color: order.status === 'ready' ? '#6B21A8' : '#8C7A6B', fontWeight: order.status === 'ready' ? '700' : '400' }}>Siap Diambil</span>
              <span>➔</span>
              <span style={{ color: order.status === 'completed' ? '#166534' : '#8C7A6B', fontWeight: order.status === 'completed' ? '700' : '400' }}>Selesai</span>
            </div>
          </div>

          {/* Items breakdown list */}
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#241B14', marginBottom: '8px' }}>
              Daftar Item Pesanan:
            </div>
            <div style={{ borderRadius: '8px', border: '1px solid #E6DED4', overflow: 'hidden' }}>
              {order.items.length === 0 ? (
                <div style={{ padding: '12px', textAlign: 'center', color: '#8C7A6B', fontSize: '12px' }}>
                  Tidak ada item terdaftar.
                </div>
              ) : (
                order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 14px',
                      borderBottom: idx < order.items.length - 1 ? '1px solid #F3EDE6' : 'none',
                      background: '#FFFFFF',
                    }}
                  >
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
                ))
              )}

              {/* Total & Status Pembayaran */}
              <div
                style={{
                  padding: '12px 14px',
                  background: '#FAF7F2',
                  borderTop: '1px solid #E6DED4',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#5C4A3C' }}>Total Tagihan</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#241B14', fontVariantNumeric: 'tabular-nums' }}>
                    {formatRupiah(order.total)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: '#8C7A6B' }}>
                    Status Pembayaran: <strong style={{ color: pBadge.text }}>{pBadge.label}</strong>
                  </span>
                  <span style={{ color: '#8C7A6B' }}>
                    Sudah Bayar: {formatRupiah(order.paid_amount || 0)} (Sisa: {formatRupiah(order.sisa_pembayaran || 0)})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Catatan Pelanggan */}
          {order.catatan && (
            <div style={{ background: '#FEF9C3', border: '1px solid #FDE047', borderRadius: '8px', padding: '10px 12px' }}>
              <div style={{ fontSize: '11px', color: '#854D0E', fontWeight: '600', marginBottom: '2px' }}>
                Catatan Khusus Pelanggan:
              </div>
              <div style={{ fontSize: '12.5px', color: '#713F12' }}>{order.catatan}</div>
            </div>
          )}

          {/* Form Tambah Pembayaran */}
          {order.payment_status !== 'paid' && (
            <div style={{ borderTop: '1px solid #EFEAE3', paddingTop: '12px' }}>
              {!showPaymentForm ? (
                <button
                  onClick={() => setShowPaymentForm(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #D4C5B9',
                    background: '#FAF7F2',
                    color: '#5C4A3C',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  <CreditCard size={14} /> Catat Pembayaran / DP
                </button>
              ) : (
                <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#241B14' }}>
                    Pencatatan Pembayaran
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '600', color: '#7D6B5C' }}>Nominal (Rp)</label>
                      <input
                        type="number"
                        min="1"
                        max={order.sisa_pembayaran || order.total}
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        style={{
                          width: '100%', padding: '6px 8px', borderRadius: '6px',
                          border: '1px solid #E6DED4', fontSize: '12.5px', boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '600', color: '#7D6B5C' }}>Metode</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{
                          width: '100%', padding: '6px 8px', borderRadius: '6px',
                          border: '1px solid #E6DED4', fontSize: '12.5px', boxSizing: 'border-box',
                        }}
                      >
                        <option value="transfer">Transfer Bank</option>
                        <option value="cash">Tunai (Cash)</option>
                        <option value="qris">QRIS</option>
                        <option value="debit">Kartu Debit</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setShowPaymentForm(false)}
                      style={{
                        padding: '6px 12px', borderRadius: '6px', border: '1px solid #E6DED4',
                        background: '#FFF', fontSize: '12px', cursor: 'pointer',
                      }}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={paying}
                      style={{
                        padding: '6px 14px', borderRadius: '6px', border: 'none',
                        background: '#166534', color: '#FFF', fontSize: '12px', fontWeight: '600',
                        cursor: paying ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {paying ? 'Menyimpan...' : 'Simpan Pembayaran'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #EFEAE3', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px', borderRadius: '8px',
              background: '#241B14', color: '#FFFFFF', border: 'none',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function PesananPage() {
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [activeModalOrder, setActiveModalOrder] = useState(null);

  // Load Pesanan dari Backend API
  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders({ per_page: 100 });
      if (response?.data) {
        const mapped = response.data.map((o) => ({
          id: o.id,
          kode: o.kode_pesanan || `ORD-${o.id}`,
          customer: o.customer_name || 'Pelanggan Umum',
          phone: o.customer_phone || '-',
          total: Number(o.total_price) || 0,
          status: o.status || 'pending',
          payment_status: o.payment_status || 'unpaid',
          paid_amount: Number(o.paid_amount) || 0,
          sisa_pembayaran: Number(o.sisa_pembayaran) || 0,
          date: o.tanggal_ambil || (o.created_at ? o.created_at.split('T')[0] : '-'),
          catatan: o.catatan || '',
          items: Array.isArray(o.items)
            ? o.items.map((i) => ({
                nama: i.product?.nama || i.product_name || `Produk #${i.product_id}`,
                qty: Number(i.qty) || 1,
                harga: Number(i.unit_price) || 0,
              }))
            : [],
        }));
        setOrders(mapped);
      }
    } catch (err) {
      console.error('Gagal mengambil daftar pesanan:', err);
      showToast('Gagal memuat pesanan dari server backend.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Update Status Pesanan ke Backend API
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus, `Diubah melalui portal admin`);
      showToast(`Status pesanan berhasil diubah menjadi "${statusConfig[newStatus]?.label || newStatus}"`, 'success');
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (activeModalOrder && activeModalOrder.id === orderId) {
        setActiveModalOrder((prev) => ({ ...prev, status: newStatus }));
      }
      loadOrders();
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengubah status pesanan.';
      showToast(msg, 'error');
    }
  };

  // Metrics
  const totalPesanan = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const processingCount = orders.filter((o) => o.status === 'confirmed' || o.status === 'processing').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const totalOmzetPesanan = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.total, 0);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm);
      const matchStatus = selectedStatus === 'all' ? true : order.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const hasFilter = searchTerm || selectedStatus !== 'all';

  const resetFilter = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        color: '#241B14',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* ── [1] HEADER ──────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '4px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#8C7A6B',
              fontWeight: '600',
              letterSpacing: '0.02em',
              marginBottom: '4px',
            }}
          >
            <span>ERLES BAKERY</span>
            <span style={{ color: '#D4C5B9' }}>/</span>
            <span>MANAJEMEN PESANAN</span>
          </div>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#241B14',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
            }}
          >
            Daftar Pesanan & Produksi
          </h1>

          <p style={{ fontSize: '13px', color: '#6E5D4F', margin: 0 }}>
            Pantau alur status pesanan, pembayaran pelanggan, dan jadwal produksi
          </p>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={loadOrders}
            title="Muat ulang pesanan"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #E2D9CE',
              background: '#FFFFFF',
              color: '#5C4A3C',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Muat Ulang
          </button>
        </div>
      </div>

      {/* ── [2] METRIC STRIP ────────────────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E6DED4',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
        }}
      >
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Total Pesanan
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#241B14',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: '6px',
            }}
          >
            {totalPesanan} <span style={{ fontSize: '15px', fontWeight: '500', color: '#8C7A6B' }}>nota</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Nilai: {formatRupiah(totalOmzetPesanan)}
          </div>
        </div>

        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Perlu Konfirmasi
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: pendingCount > 0 ? '#B45309' : '#241B14',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: '6px',
            }}
          >
            {pendingCount} <span style={{ fontSize: '15px', fontWeight: '500', color: '#8C7A6B' }}>menunggu</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>Pesanan baru masuk dari website/pelanggan</div>
        </div>

        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Sedang Dikerjakan Dapur
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#9A3412',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: '6px',
            }}
          >
            {processingCount} <span style={{ fontSize: '15px', fontWeight: '500', color: '#8C7A6B' }}>aktif</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>Terkonfirmasi & dalam produksi</div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Pesanan Selesai
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#166534',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: '6px',
            }}
          >
            {completedCount} <span style={{ fontSize: '15px', fontWeight: '500', color: '#8C7A6B' }}>selesai</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>Telah diambil atau diantar</div>
        </div>
      </div>

      {/* ── [3] FILTER & PENCARIAN ────────────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E6DED4',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '220px', maxWidth: '300px', flex: 1 }}>
            <Search
              size={14}
              color="#8C7A6B"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Cari ID pesanan, nama, kontak..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '7px 10px 7px 30px',
                borderRadius: '8px',
                border: '1px solid #E6DED4',
                background: '#FAF7F2',
                fontSize: '12.5px',
                color: '#241B14',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '7px 10px',
              borderRadius: '8px',
              border: '1px solid #E6DED4',
              background: '#FAF7F2',
              fontSize: '12.5px',
              color: '#5C4A3C',
              fontWeight: '500',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all">Semua Status</option>
            {allStatuses.map((s) => (
              <option key={s} value={s}>
                {statusConfig[s]?.label || s}
              </option>
            ))}
          </select>

          {hasFilter && (
            <button
              onClick={resetFilter}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: '#F5EFEB',
                color: '#6E5D4F',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>

        <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
          Menampilkan <strong>{filteredOrders.length}</strong> pesanan
        </div>
      </div>

      {/* ── [4] TABEL PESANAN ────────────────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E6DED4',
          boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  background: '#FAF7F2',
                  borderBottom: '1px solid #E6DED4',
                  color: '#6E5D4F',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                <th style={{ padding: '10px 18px' }}>Kode Pesanan</th>
                <th style={{ padding: '10px 18px' }}>Pelanggan</th>
                <th style={{ padding: '10px 18px' }}>Item Roti/Kue</th>
                <th style={{ padding: '10px 18px', textAlign: 'right' }}>Total</th>
                <th style={{ padding: '10px 18px', textAlign: 'center' }}>Pembayaran</th>
                <th style={{ padding: '10px 18px', textAlign: 'center' }}>Status Alur</th>
                <th style={{ padding: '10px 18px' }}>Jadwal</th>
                <th style={{ padding: '10px 18px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#8C7A6B' }}>
                    Memuat daftar pesanan dari server backend...
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#8C7A6B' }}>
                    Tidak ada pesanan yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const badge = statusConfig[order.status] || {
                    bg: '#FAF7F2',
                    text: '#5C4A3C',
                    dot: '#8C7A6B',
                    label: order.status,
                  };
                  const pBadge = paymentStatusConfig[order.payment_status] || paymentStatusConfig.unpaid;

                  return (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: '1px solid #F3EDE6',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF7F2')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                    >
                      {/* Kode */}
                      <td
                        style={{
                          padding: '12px 18px',
                          fontWeight: '600',
                          color: '#6E5D4F',
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {order.kode}
                      </td>

                      {/* Pelanggan */}
                      <td style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: '600', color: '#241B14' }}>{order.customer}</div>
                        <div style={{ fontSize: '11px', color: '#8C7A6B' }}>{order.phone}</div>
                      </td>

                      {/* Item */}
                      <td style={{ padding: '12px 18px', maxWidth: '240px' }}>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6E5D4F',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {order.items.length > 0
                            ? order.items.map((i) => `${i.nama} (${i.qty})`).join(', ')
                            : 'Produk Bakery'}
                        </div>
                      </td>

                      {/* Total */}
                      <td
                        style={{
                          padding: '12px 18px',
                          textAlign: 'right',
                          fontWeight: '600',
                          color: '#241B14',
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatRupiah(order.total)}
                      </td>

                      {/* Pembayaran Badge */}
                      <td style={{ padding: '12px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            background: pBadge.bg,
                            color: pBadge.text,
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {pBadge.label}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '12px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: badge.bg,
                            color: badge.text,
                            fontSize: '11.5px',
                            fontWeight: '600',
                          }}
                        >
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              background: badge.dot,
                            }}
                          />
                          {badge.label}
                        </span>
                      </td>

                      {/* Jadwal */}
                      <td
                        style={{
                          padding: '12px 18px',
                          color: '#9C8B7E',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {order.date}
                      </td>

                      {/* Aksi */}
                      <td style={{ padding: '12px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => setActiveModalOrder(order)}
                          title="Lihat Detail Pesanan"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid #E2D9CE',
                            background: '#FFFFFF',
                            color: '#5C4A3C',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          <Eye size={13} />
                          Detail
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

      {/* Modal Detail Pesanan */}
      {activeModalOrder && (
        <OrderDetailModal
          order={activeModalOrder}
          onClose={() => setActiveModalOrder(null)}
          onStatusChange={handleStatusChange}
          onPaymentAdded={loadOrders}
        />
      )}
    </div>
  );
}
