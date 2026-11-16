import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, CheckCircle2, AlertCircle, XCircle,
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Store, Smartphone, Globe, ArrowRight, RefreshCw,
  Plus, Check, ChevronRight, Flame
} from 'lucide-react';
import Pagination from '../components/common/Pagination';
import dashboardService from '../services/dashboardService';
import orderService from '../services/orderService';
import useToast from '../hooks/useToast';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num || 0);
}

function getTodayFormatted() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('id-ID', options);
}

function getStatusStyle(status) {
  switch (status) {
    case 'pending':
    case 'menunggu_konfirmasi':
      return {
        bg: '#FEF9C3',
        text: '#854D0E',
        dot: '#CA8A04',
        label: 'Perlu Konfirmasi',
      };
    case 'confirmed':
      return {
        bg: '#E0F2FE',
        text: '#0369A1',
        dot: '#0284C7',
        label: 'Terkonfirmasi',
      };
    case 'processing':
    case 'diproses':
      return {
        bg: '#FFF7ED',
        text: '#9A3412',
        dot: '#EA580C',
        label: 'Sedang Diproses',
      };
    case 'ready':
      return {
        bg: '#F3E8FF',
        text: '#6B21A8',
        dot: '#9333EA',
        label: 'Siap Diambil/Kirim',
      };
    case 'completed':
    case 'selesai':
      return {
        bg: '#F0FDF4',
        text: '#166534',
        dot: '#16A34A',
        label: 'Selesai',
      };
    case 'cancelled':
    case 'dibatalkan':
      return {
        bg: '#FEF2F2',
        text: '#991B1B',
        dot: '#DC2626',
        label: 'Dibatalkan',
      };
    default:
      return {
        bg: '#F5F5F4',
        text: '#57534E',
        dot: '#78716C',
        label: status,
      };
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter independen untuk Tren Penjualan
  const [filterPenjualan, setFilterPenjualan] = useState('seminggu'); // 'seminggu' | 'bulan'
  const [selectedTahunPenjualan, setSelectedTahunPenjualan] = useState(new Date().getFullYear());
  const [metricPenjualan, setMetricPenjualan] = useState('qty'); // 'qty' (Pcs Terjual) | 'omzet' (Rupiah)

  // Filter independen untuk Produk Terlaris
  const [filterProduk, setFilterProduk] = useState('seminggu'); // 'seminggu' | 'bulan' | 'all'
  const ITEMS_PER_PAGE = 10;

  const todayStr = useMemo(() => getTodayFormatted(), []);

  // Muat data dari Backend API dengan filter independen
  const fetchDashboardData = useCallback(async (
    isSilent = false,
    rentang = filterPenjualan,
    tahun = selectedTahunPenjualan,
    rentangProduk = filterProduk
  ) => {
    if (!isSilent && !dashboardData) setLoading(true);
    try {
      const response = await dashboardService.getDashboard({
        rentang,
        tahun,
        rentang_produk: rentangProduk,
      });
      if (response && response.data) {
        setDashboardData((prev) => ({
          ...prev,
          ...response.data,
          ringkasan: {
            ...(prev?.ringkasan || {}),
            ...(response.data.ringkasan || {}),
          },
        }));
        const mappedOrders = (response.data.pesanan_terbaru || []).map((o) => ({
          id: o.kode_pesanan || `ORD-${o.id}`,
          orderDbId: o.id,
          customer: o.customer_name || 'Pelanggan Umum',
          source: 'Website / WhatsApp',
          sourceIcon: Globe,
          items: Array.isArray(o.items) && o.items.length > 0
            ? o.items.map((i) => `${i.product_name} (x${i.qty})`).join(', ')
            : 'Pesanan Produk Bakery',
          total: Number(o.total_price) || 0,
          status: o.status,
          time: o.tanggal_ambil ? `Ambil: ${o.tanggal_ambil}` : 'Hari ini',
        }));
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.error('Gagal mengambil data dashboard:', err);
      showToast('Gagal memuat data dari server backend.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast, dashboardData, filterPenjualan, selectedTahunPenjualan, filterProduk]);

  useEffect(() => {
    fetchDashboardData(Boolean(dashboardData), filterPenjualan, selectedTahunPenjualan, filterProduk);
  }, [filterPenjualan, selectedTahunPenjualan, filterProduk]);

  // Konfirmasi pesanan langsung di tabel ke backend API
  const handleConfirmOrder = async (orderDbId, displayId) => {
    try {
      await orderService.updateStatus(orderDbId, 'confirmed', 'Dikonfirmasi langsung melalui Dashboard');
      showToast(`Pesanan ${displayId} berhasil dikonfirmasi!`, 'success');
      // Update state lokal dan refresh data di background
      setOrders((prev) =>
        prev.map((o) => (o.orderDbId === orderDbId ? { ...o, status: 'confirmed' } : o))
      );
      fetchDashboardData(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengubah status pesanan.';
      showToast(msg, 'error');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData(true);
  };

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return orders.slice(start, start + ITEMS_PER_PAGE);
  }, [orders, currentPage]);

  const ringkasan = dashboardData?.ringkasan || {};
  const pendingCount = ringkasan.active_orders ?? orders.filter((o) => o.status === 'pending').length;
  const totalOmzetBulanIni = ringkasan.pemasukan_bulan_ini ?? ringkasan.omzet ?? 0;
  const saldoKas = ringkasan.saldo ?? ringkasan.laba ?? 0;
  const totalPesananMasuk = ringkasan.total_orders ?? orders.length;

  // Tren Penjualan Data (Nominal Omzet & Qty Pcs)
  const trendHarian = useMemo(() => {
    if (dashboardData?.trend_harian && dashboardData.trend_harian.length > 0) {
      return dashboardData.trend_harian.map((t) => ({
        day: t.hari || 'Hari',
        date: t.tanggal || '',
        nominal: Number(t.pemasukan) || 0,
        qty: Number(t.qty) || 0,
      }));
    }
    return [
      { day: 'Sen', date: '', nominal: 0, qty: 0 },
      { day: 'Sel', date: '', nominal: 0, qty: 0 },
      { day: 'Rab', date: '', nominal: 0, qty: 0 },
      { day: 'Kam', date: '', nominal: 0, qty: 0 },
      { day: 'Jum', date: '', nominal: 0, qty: 0 },
      { day: 'Sab', date: '', nominal: 0, qty: 0 },
      { day: 'Min', date: '', nominal: 0, qty: 0 },
    ];
  }, [dashboardData]);

  const isMetricQty = metricPenjualan === 'qty';
  const totalQty = useMemo(() => trendHarian.reduce((sum, d) => sum + d.qty, 0), [trendHarian]);
  const totalOmzet = useMemo(() => trendHarian.reduce((sum, d) => sum + d.nominal, 0), [trendHarian]);
  const avgQty = Math.round(totalQty / Math.max(trendHarian.length, 1));
  const avgOmzet = Math.round(totalOmzet / Math.max(trendHarian.length, 1));

  const currentTotal = isMetricQty ? totalQty : totalOmzet;
  const currentAvg = isMetricQty ? avgQty : avgOmzet;

  // Konfigurasi Sumbu Y & Garis Grid Proporsional (Skala Standar Bakery: 0 - 200 pcs)
  const yAxisConfig = useMemo(() => {
    if (isMetricQty) {
      const rawMax = Math.max(...trendHarian.map((d) => d.qty), 0);
      let step = 40;
      let maxVal = 200;
      if (rawMax > 200) {
        step = Math.ceil(rawMax / 5 / 20) * 20;
        maxVal = step * 5;
      }
      const ticks = [0, step, step * 2, step * 3, step * 4, maxVal];
      return {
        maxVal,
        ticks,
        formatTick: (v) => `${v} pcs`,
      };
    } else {
      const rawMax = Math.max(...trendHarian.map((d) => d.nominal), 0);
      const baseMax = Math.max(rawMax, 1000000);
      const step = Math.ceil(baseMax / 5 / 50000) * 50000;
      const maxVal = step * 5;
      const ticks = [0, step, step * 2, step * 3, step * 4, maxVal];
      return {
        maxVal,
        ticks,
        formatTick: (v) => (v === 0 ? 'Rp 0' : v >= 1000000 ? `${(v / 1000000).toFixed(1)}jt` : `${Math.round(v / 1000)}rb`),
      };
    }
  }, [isMetricQty, trendHarian]);

  // Produk Terlaris untuk Monitor Dapur & Penjualan
  const produkTerlaris = dashboardData?.produk_terlaris || [];

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
      {/* ── [1] PAGE HEADER ───────────── */}
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
            <span>OVERVIEW OPERASIONAL</span>
            <span style={{ color: '#D4C5B9' }}>•</span>
            <span style={{ color: '#665343' }}>{todayStr}</span>
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
            Dashboard Toko & Produksi
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: '#6E5D4F',
            }}
          >
            {pendingCount > 0 ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#B45309',
                  fontWeight: '600',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#D97706',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
                {pendingCount} pesanan aktif dalam sistem
              </span>
            ) : (
              <span style={{ color: '#15803D', fontWeight: '500' }}>
                ✓ Semua pesanan telah ditangani
              </span>
            )}
            <span style={{ color: '#D4C5B9' }}>•</span>
            <span>Data tersinkronisasi langsung dari backend ERP</span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleRefresh}
            title="Muat ulang data dari server"
            disabled={refreshing}
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
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!refreshing) {
                e.currentTarget.style.background = '#FAF7F2';
                e.currentTarget.style.borderColor = '#D1C4B5';
              }
            }}
            onMouseLeave={(e) => {
              if (!refreshing) {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#E2D9CE';
              }
            }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Memperbarui...' : 'Perbarui'}
          </button>
        </div>
      </div>

      {/* ── [2] UNIFIED METRIC STRIP ───── */}
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
        {/* KPI 1: Pendapatan Bulan Ini */}
        <div
          style={{
            padding: '20px 24px',
            borderRight: '1px solid #EFEAE3',
          }}
        >
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#7D6B5C',
              marginBottom: '8px',
            }}
          >
            Total Pemasukan / Omzet
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
            {loading ? 'Memuat...' : formatRupiah(totalOmzetBulanIni)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: '#166534',
                fontWeight: '600',
                background: '#F0FDF4',
                padding: '1px 5px',
                borderRadius: '4px',
              }}
            >
              <ArrowUpRight size={13} />
              Aktif
            </span>
            <span style={{ color: '#8C7A6B' }}>Tercatat di modul Keuangan</span>
          </div>
        </div>

        {/* KPI 2: Total Pesanan Masuk */}
        <div
          style={{
            padding: '20px 24px',
            borderRight: '1px solid #EFEAE3',
          }}
        >
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#7D6B5C',
              marginBottom: '8px',
            }}
          >
            Total Pesanan Masuk
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
            {loading ? '...' : totalPesananMasuk}{' '}
            <span style={{ fontSize: '15px', fontWeight: '500', color: '#8C7A6B' }}>
              pesanan
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span style={{ color: '#8C7A6B' }}>
              {ringkasan.completed_orders || 0} selesai • {ringkasan.active_orders || 0} aktif
            </span>
          </div>
        </div>

        {/* KPI 3: Pesanan Perlu Konfirmasi */}
        <div
          style={{
            padding: '20px 24px',
            borderRight: '1px solid #EFEAE3',
          }}
        >
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#7D6B5C',
              marginBottom: '8px',
            }}
          >
            Pesanan Sedang Aktif
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
            {loading ? '...' : pendingCount}{' '}
            <span style={{ fontSize: '15px', fontWeight: '500', color: '#8C7A6B' }}>
              antrean
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Membutuhkan tindak lanjut produksi dapur
          </div>
        </div>

        {/* KPI 4: Kas / Saldo Bersih */}
        <div
          style={{
            padding: '20px 24px',
          }}
        >
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#7D6B5C',
              marginBottom: '8px',
            }}
          >
            Saldo Bersih Toko
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: saldoKas >= 0 ? '#241B14' : '#DC2626',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: '6px',
            }}
          >
            {loading ? 'Memuat...' : formatRupiah(saldoKas)}
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Pemasukan dikurangi pengeluaran operasional
          </div>
        </div>
      </div>

      {/* ── [3] DUA KOLOM: TREN PENDAPATAN & PRODUK TERLARIS ────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '20px',
          alignItems: 'stretch',
        }}
      >
        {/* Kolom Kiri: Tren Penjualan (Pcs Terjual / Omzet Rp) */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E6DED4',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
          }}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '10px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#241B14',
                    margin: 0,
                  }}
                >
                  Tren Penjualan {filterPenjualan === 'bulan' ? `Tahun ${selectedTahunPenjualan} (Bulanan)` : '7 Hari Terakhir'}
                </h2>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#6E5D4F',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  Total:{' '}
                  <strong style={{ color: '#241B14' }}>
                    {isMetricQty ? `${currentTotal} Pcs Terjual` : formatRupiah(currentTotal)}
                  </strong>
                  {' • '}
                  Rata-rata: <strong style={{ color: '#241B14' }}>{isMetricQty ? `${currentAvg} pcs` : formatRupiah(currentAvg)}</strong>
                  {' / '}{filterPenjualan === 'bulan' ? 'bulan' : 'hari'}
                </span>
              </div>

              {/* Kontrol Filter & Switcher Metrik */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Switcher Metrik: Pcs Terjual vs Omzet Rp */}
                <div
                  style={{
                    display: 'flex',
                    background: '#FAF7F2',
                    borderRadius: '8px',
                    border: '1px solid #D4C5B9',
                    padding: '2px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setMetricPenjualan('qty')}
                    title="Tampilkan berdasarkan jumlah unit/pcs roti yang laku"
                    style={{
                      padding: '3px 9px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: isMetricQty ? '#C25E34' : 'transparent',
                      color: isMetricQty ? '#FFFFFF' : '#6E5D4F',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    Pcs Terjual
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetricPenjualan('omzet')}
                    title="Tampilkan berdasarkan total nominal pendapatan (Rp)"
                    style={{
                      padding: '3px 9px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: !isMetricQty ? '#C25E34' : 'transparent',
                      color: !isMetricQty ? '#FFFFFF' : '#6E5D4F',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    Omzet (Rp)
                  </button>
                </div>

                {/* Filter Waktu Khusus Tren Penjualan */}
                <select
                  value={filterPenjualan}
                  onChange={(e) => setFilterPenjualan(e.target.value)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: '1px solid #D4C5B9',
                    background: '#FAF7F2',
                    color: '#4A2E17',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="seminggu">7 Hari Terakhir</option>
                  <option value="bulan">Bulanan (Jan - Des)</option>
                </select>

                {/* Dropdown Pilihan Tahun (2026 - 2030) jika mode Bulan */}
                {filterPenjualan === 'bulan' && (
                  <select
                    value={selectedTahunPenjualan}
                    onChange={(e) => setSelectedTahunPenjualan(Number(e.target.value))}
                    style={{
                      padding: '5px 8px',
                      borderRadius: '8px',
                      border: '1px solid #D4C5B9',
                      background: '#FFFFFF',
                      color: '#4A2E17',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {[2026, 2027, 2028, 2029, 2030].map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Container Grafik dengan Sumbu X dan Sumbu Y Lengkap */}
            <div
              style={{
                flex: 1,
                minHeight: '280px',
                position: 'relative',
                marginTop: '10px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {(() => {
                const svgW = 660;
                const svgH = 275;
                const padL = 60; // Ruang bersih untuk skala Sumbu Y di sisi kiri
                const padR = 20;
                const padT = 16;
                const padB = 24; // Ruang label Sumbu X di bawah
                const uW = svgW - padL - padR;
                const uH = svgH - padT - padB;
                const count = Math.max(trendHarian.length, 1);
                const maxVal = Math.max(yAxisConfig.maxVal, 1);

                const points = trendHarian.map((item, idx) => {
                  const val = isMetricQty ? item.qty : item.nominal;
                  const x = padL + (idx / Math.max(count - 1, 1)) * uW;
                  const y = padT + uH - (val / maxVal) * uH;
                  return { ...item, val, x, y };
                });

                const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
                const areaD = `${lineD} L ${points[points.length - 1].x.toFixed(1)} ${padT + uH} L ${points[0].x.toFixed(1)} ${padT + uH} Z`;
                const avgY = padT + uH - (currentAvg / maxVal) * uH;

                return (
                  <svg
                    viewBox={`0 0 ${svgW} ${svgH}`}
                    style={{ width: '100%', height: '100%', minHeight: '280px', overflow: 'visible' }}
                  >
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C25E34" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#C25E34" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* ── [A] SUMBU Y: Garis Grid Horizontal & Skala Angka Sisi Kiri ── */}
                    {yAxisConfig.ticks.map((tick, tIdx) => {
                      const yPos = padT + uH - (tick / maxVal) * uH;
                      const isBaseline = tick === 0;

                      return (
                        <g key={tIdx}>
                          {/* Garis Horizontal Grid */}
                          <line
                            x1={padL}
                            y1={yPos}
                            x2={padL + uW}
                            y2={yPos}
                            stroke={isBaseline ? '#D9CFC4' : '#F0EBE1'}
                            strokeDasharray={isBaseline ? 'none' : '3 3'}
                            strokeWidth={isBaseline ? 1.5 : 1}
                          />
                          {/* Label Angka Sumbu Y */}
                          <text
                            x={padL - 10}
                            y={yPos + 3.5}
                            textAnchor="end"
                            fontSize="10.5"
                            fill="#8C7A6B"
                            fontWeight="500"
                          >
                            {yAxisConfig.formatTick(tick)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Garis batas rata-rata */}
                    {currentAvg > 0 && (
                      <g>
                        <line
                          x1={padL}
                          y1={avgY}
                          x2={padL + uW}
                          y2={avgY}
                          stroke="#C25E34"
                          strokeDasharray="4 4"
                          strokeOpacity="0.75"
                        />
                        <text
                          x={padL + uW}
                          y={avgY - 4}
                          textAnchor="end"
                          fontSize="9.5"
                          fill="#C25E34"
                          fontWeight="600"
                        >
                          Rata-rata: {isMetricQty ? `${currentAvg} pcs` : formatRupiah(currentAvg)}
                        </text>
                      </g>
                    )}

                    {/* ── [B] BODY GRAFIK: Line Chart Presisi ── */}
                    {/* Area gradien & Garis tren */}
                    <path d={areaD} fill="url(#trendGradient)" />
                    <path
                      d={lineD}
                      fill="none"
                      stroke="#C25E34"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Titik data interaktif */}
                    {points.map((p, idx) => {
                      const isHovered = hoveredPointIndex === idx;

                      return (
                        <g key={idx}>
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={16}
                            fill="transparent"
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHoveredPointIndex(idx)}
                            onMouseLeave={() => setHoveredPointIndex(null)}
                          />
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={isHovered ? 6 : 4}
                            fill={isHovered ? '#C25E34' : '#FFFFFF'}
                            stroke="#C25E34"
                            strokeWidth="2.5"
                            style={{ pointerEvents: 'none', transition: 'all 0.15s ease' }}
                          />
                        </g>
                      );
                    })}

                    {/* ── [C] SUMBU X: Label Waktu di Bawah Garis Dasar ── */}
                    {points.map((p, idx) => {
                      const isHovered = hoveredPointIndex === idx;
                      const labelText = p.day.length > 4 ? p.day.slice(0, 3) : p.day;

                      return (
                        <text
                          key={idx}
                          x={p.x}
                          y={svgH - 6}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight={isHovered ? '700' : '500'}
                          fill={isHovered ? '#C25E34' : '#7D6B5C'}
                          style={{ pointerEvents: 'none' }}
                        >
                          {labelText}
                        </text>
                      );
                    })}

                    {/* ── [D] FLOATING TOOLTIP ── */}
                    {hoveredPointIndex !== null && points[hoveredPointIndex] && (
                      (() => {
                        const p = points[hoveredPointIndex];
                        const boxW = 160;
                        const boxH = 28;
                        const tooltipX = Math.min(Math.max(p.x - boxW / 2, padL), svgW - boxW - padR);
                        const tooltipY = Math.max(p.y - boxH - 8, 4);

                        return (
                          <g style={{ pointerEvents: 'none' }}>
                            <rect
                              x={tooltipX}
                              y={tooltipY}
                              width={boxW}
                              height={boxH}
                              rx={6}
                              fill="#241B14"
                              opacity={0.95}
                            />
                            <text
                              x={tooltipX + boxW / 2}
                              y={tooltipY + 18}
                              textAnchor="middle"
                              fill="#FFFFFF"
                              fontSize="11"
                              fontWeight="600"
                            >
                              {p.day}: {p.qty} Pcs ({formatRupiah(p.nominal)})
                            </text>
                          </g>
                        );
                      })()
                    )}
                  </svg>
                );
              })()}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '4px',
              paddingTop: '6px',
              fontSize: '12px',
              color: '#8C7A6B',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '3px', background: '#C25E34', borderRadius: '2px' }} />
                Tren Penjualan ({isMetricQty ? 'Pcs Roti Terjual' : 'Omzet Penjualan Rp'})
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '14px', height: '0', borderBottom: '1px dashed #C25E34' }} />
                Rata-rata Periode
              </span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Produk Terlaris / Monitor Penjualan (Filter Mandiri) */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E6DED4',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={16} color="#C25E34" />
                <h2
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#241B14',
                    margin: 0,
                  }}
                >
                  Produk Terlaris
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Filter Mandiri Khusus Produk Terlaris */}
                <select
                  value={filterProduk}
                  onChange={(e) => setFilterProduk(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #D4C5B9',
                    background: '#FAF7F2',
                    color: '#4A2E17',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="seminggu">7 Hari</option>
                  <option value="bulan">Bulan Ini</option>
                  <option value="all">Semua Waktu</option>
                </select>

                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#7D6B5C',
                    background: '#F7F3EE',
                    padding: '2px 7px',
                    borderRadius: '4px',
                  }}
                >
                  Top Penjualan
                </span>
              </div>
            </div>
            <p
              style={{
                fontSize: '12px',
                color: '#8C7A6B',
                margin: '0 0 16px 0',
              }}
            >
              Statistik produk dengan volume pesanan tertinggi dari database
            </p>

            {/* List Item Bakery */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {produkTerlaris.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#8C7A6B', fontSize: '13px' }}>
                  Belum ada data produk terlaris.
                </div>
              ) : (
                produkTerlaris.slice(0, 5).map((item, idx) => {
                  const maxTerjual = Math.max(...produkTerlaris.map((p) => p.total_terjual || 1));
                  const pct = Math.round(((item.total_terjual || 0) / maxTerjual) * 100);

                  return (
                    <div
                      key={idx}
                      style={{
                        paddingBottom: '10px',
                        borderBottom:
                          idx < Math.min(produkTerlaris.length, 5) - 1 ? '1px solid #F3EDE6' : 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          justifyContent: 'space-between',
                          marginBottom: '4px',
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#241B14',
                            }}
                          >
                            {item.product_name}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#9C8B7E',
                              marginLeft: '6px',
                            }}
                          >
                            Omzet: {formatRupiah(item.total_omzet)}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            fontVariantNumeric: 'tabular-nums',
                            color: '#6E5D4F',
                            fontWeight: '600',
                          }}
                        >
                          {item.total_terjual} terjual
                        </div>
                      </div>

                      {/* Minimal Progress Bar */}
                      <div
                        style={{
                          height: '5px',
                          background: '#EFEAE3',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          marginTop: '4px',
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: '#8C5A37',
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/produk')}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #E2D9CE',
              background: '#FAF7F2',
              color: '#5C4A3C',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F0E9DF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FAF7F2';
            }}
          >
            Kelola Stok & Katalog Produk <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* ── [4] PESANAN MASUK TERBARU ───────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E6DED4',
          boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
          overflow: 'hidden',
        }}
      >
        {/* Table Header Row */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #EFEAE3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '15px',
                fontWeight: '700',
                color: '#241B14',
                margin: '0 0 2px 0',
              }}
            >
              Pesanan Masuk Terbaru
            </h2>
            <p
              style={{
                fontSize: '12px',
                color: '#8C7A6B',
                margin: 0,
              }}
            >
              Daftar transaksi pesanan terkini yang tersimpan di database backend
            </p>
          </div>

          <button
            onClick={() => navigate('/pesanan')}
            style={{
              background: 'none',
              border: 'none',
              color: '#8C5A37',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: 0,
            }}
          >
            Buka Semua Pesanan <ArrowRight size={14} />
          </button>
        </div>

        {/* Table Content */}
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
                <th style={{ padding: '10px 18px' }}>ID Pesanan</th>
                <th style={{ padding: '10px 18px' }}>Pelanggan</th>
                <th style={{ padding: '10px 18px' }}>Saluran</th>
                <th style={{ padding: '10px 18px' }}>Rincian Item</th>
                <th style={{ padding: '10px 18px', textAlign: 'right' }}>Total</th>
                <th style={{ padding: '10px 18px', textAlign: 'center' }}>Status</th>
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
                    Belum ada pesanan yang tercatat.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const badge = getStatusStyle(order.status);
                  const SourceIcon = order.sourceIcon || Globe;
                  const isPending = order.status === 'pending';

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
                      {/* ID */}
                      <td
                        style={{
                          padding: '12px 18px',
                          fontWeight: '600',
                          color: '#6E5D4F',
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {order.id}
                      </td>

                      {/* Pelanggan */}
                      <td
                        style={{
                          padding: '12px 18px',
                          fontWeight: '600',
                          color: '#241B14',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {order.customer}
                      </td>

                      {/* Sumber */}
                      <td style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '12px',
                            color: '#6E5D4F',
                          }}
                        >
                          <SourceIcon size={13} color="#8C7A6B" />
                          {order.source}
                        </span>
                      </td>

                      {/* Item */}
                      <td
                        style={{
                          padding: '12px 18px',
                          color: '#6E5D4F',
                          maxWidth: '260px',
                        }}
                      >
                        <div
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {order.items}
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
                        {order.time}
                      </td>

                      {/* Quick Action Button */}
                      <td style={{ padding: '12px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {isPending ? (
                          <button
                            onClick={() => handleConfirmOrder(order.orderDbId, order.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 9px',
                              borderRadius: '4px',
                              border: '1px solid #CA8A04',
                              background: '#FEF9C3',
                              color: '#854D0E',
                              fontSize: '11.5px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#FEF08A';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#FEF9C3';
                            }}
                            title="Konfirmasi pesanan ini agar masuk ke antrean dapur"
                          >
                            <Check size={12} />
                            Konfirmasi
                          </button>
                        ) : (
                          <span style={{ color: '#C4B5A5', fontSize: '11px' }}>—</span>
                        )}
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
          totalItems={orders.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
