import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Clock, CheckCircle, XCircle, AlertCircle,
  TrendingUp, Wallet, ArrowUpRight, ArrowDownRight,
  Package, Boxes, ShoppingBag, ArrowRight, ExternalLink,
  ChevronRight, Store, Smartphone, Globe
} from 'lucide-react';

// ─── Dummy Data Dashboard ──────────────────────────────────────────────────────

const statsData = [
  {
    label: 'Total Pesanan Hari Ini',
    value: '24',
    subtext: '+12% dibanding kemarin',
    icon: ShoppingCart,
    accent: '#6366F1',
    bg: '#EEF2FF',
    trend: +12,
  },
  {
    label: 'Pesanan Aktif',
    value: '8',
    subtext: '3 konfirmasi, 5 diproses',
    icon: Clock,
    accent: '#F59E0B',
    bg: '#FFFBEB',
    trend: +2,
  },
  {
    label: 'Pendapatan Hari Ini',
    value: 'Rp 3.450.000',
    subtext: 'dari 19 transaksi lunas',
    icon: TrendingUp,
    accent: '#10B981',
    bg: '#ECFDF5',
    trend: +8.5,
  },
  {
    label: 'Saldo Kas Operasional',
    value: 'Rp 14.850.000',
    subtext: 'Pemasukan - Pengeluaran',
    icon: Wallet,
    accent: '#8B5CF6',
    bg: '#F5F3FF',
    trend: +4.2,
  },
];

// Data Tren Pendapatan 7 Hari Terakhir
const incomeTrendData = [
  { day: 'Senin',   date: '23 Sep', nominal: 2850000 },
  { day: 'Selasa',  date: '24 Sep', nominal: 3100000 },
  { day: 'Rabu',    date: '25 Sep', nominal: 2950000 },
  { day: 'Kamis',   date: '26 Sep', nominal: 3600000 },
  { day: 'Jumat',   date: '27 Sep', nominal: 4200000 },
  { day: 'Sabtu',   date: '28 Sep', nominal: 4850000 },
  { day: 'Minggu',  date: '29 Sep', nominal: 3450000 },
];

const statusSummaryData = [
  {
    key: 'menunggu_konfirmasi',
    label: 'Menunggu Konfirmasi',
    count: 3,
    color: '#F59E0B',
    bg: '#FEF3C7',
    icon: Clock,
  },
  {
    key: 'diproses',
    label: 'Sedang Diproses',
    count: 5,
    color: '#3B82F6',
    bg: '#DBEAFE',
    icon: AlertCircle,
  },
  {
    key: 'selesai',
    label: 'Pesanan Selesai',
    count: 15,
    color: '#10B981',
    bg: '#D1FAE5',
    icon: CheckCircle,
  },
  {
    key: 'dibatalkan',
    label: 'Dibatalkan',
    count: 1,
    color: '#EF4444',
    bg: '#FEE2E2',
    icon: XCircle,
  },
];

const recentOrders = [
  {
    id: 'ORD-20240115-001',
    customer: 'Budi Santoso',
    source: 'WhatsApp',
    sourceIcon: Smartphone,
    items: 'Roti Tawar Jumbo (x3), Croissant (x5)',
    total: 250000,
    status: 'menunggu_konfirmasi',
    time: '10 menit lalu',
  },
  {
    id: 'ORD-20240115-002',
    customer: 'Siti Aminah',
    source: 'Toko Offline',
    sourceIcon: Store,
    items: 'Bolu Kukus Pandan (x2), Kue Sus (x12)',
    total: 180000,
    status: 'diproses',
    time: '25 menit lalu',
  },
  {
    id: 'ORD-20240115-003',
    customer: 'Ahmad Fauzi',
    source: 'Website',
    sourceIcon: Globe,
    items: 'Hampers Pernikahan Premium (x1)',
    total: 450000,
    status: 'selesai',
    time: '1 jam lalu',
  },
  {
    id: 'ORD-20240115-004',
    customer: 'Dewi Lestari',
    source: 'WhatsApp',
    sourceIcon: Smartphone,
    items: 'Donat Glazed (x12), Roti Coklat (x6)',
    total: 120000,
    status: 'dibatalkan',
    time: '2 jam lalu',
  },
  {
    id: 'ORD-20240115-005',
    customer: 'Rina Wati',
    source: 'Website',
    sourceIcon: Globe,
    items: 'Kue Ulang Tahun 20cm, Lilin Dekorasi',
    total: 350000,
    status: 'diproses',
    time: '3 jam lalu',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(num);
}

function getTodayFormatted() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('id-ID', options);
}

function getStatusBadgeConfig(status) {
  switch (status) {
    case 'menunggu_konfirmasi':
      return { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B', label: 'Menunggu Konfirmasi' };
    case 'diproses':
      return { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6', label: 'Diproses' };
    case 'selesai':
      return { bg: '#D1FAE5', text: '#065F46', dot: '#10B981', label: 'Selesai' };
    case 'dibatalkan':
      return { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444', label: 'Dibatalkan' };
    default:
      return { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8', label: status };
  }
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function StatCard({ stat }) {
  const isUp = stat.trend > 0;
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;
  const trendColor = isUp ? '#16A34A' : '#DC2626';
  const trendBg = isUp ? '#DCFCE7' : '#FEE2E2';

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '22px 24px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        borderLeft: `4px solid ${stat.accent}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>
          {stat.label}
        </span>
        <div style={{
          background: stat.bg,
          borderRadius: '10px',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <stat.icon size={20} color={stat.accent} />
        </div>
      </div>

      <div>
        <div style={{ fontSize: '26px', fontWeight: '800', color: '#1E1B4B', letterSpacing: '-0.4px', marginBottom: '4px' }}>
          {stat.value}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '2px',
            background: trendBg, borderRadius: '12px', padding: '2px 6px',
            fontSize: '11px', fontWeight: '700', color: trendColor,
          }}>
            <TrendIcon size={12} />
            {Math.abs(stat.trend)}%
          </div>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>
            {stat.subtext}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const todayStr = useMemo(() => getTodayFormatted(), []);

  // Hitung max nominal untuk kalkulasi grafik tren
  const maxNominal = Math.max(...incomeTrendData.map(d => d.nominal));
  const totalMingguIni = incomeTrendData.reduce((sum, d) => sum + d.nominal, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }}>

      {/* ── [A] HEADER DASHBOARD ─────────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px 28px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12.5px', color: '#6366F1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Admin Panel
            </span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>
              {todayStr}
            </span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
            Dashboard Admin Erles Bakery
          </h1>
          <p style={{ color: '#64748B', fontSize: '13.5px', margin: 0 }}>
            Selamat datang di Erles Bakery Admin Panel. Pantau kinerja penjualan, status pesanan, dan arus keuangan toko.
          </p>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/pesanan')}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 16px', borderRadius: '10px',
              background: '#6366F1', color: '#FFFFFF', border: 'none',
              fontSize: '13px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(99,102,241,0.25)',
              transition: 'all 0.15s ease', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <ShoppingCart size={15} />
            Lihat Pesanan
          </button>

          <button
            onClick={() => navigate('/keuangan')}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 16px', borderRadius: '10px',
              background: '#FFFFFF', color: '#334155', border: '1.5px solid #E2E8F0',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.15s ease', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
          >
            <Wallet size={15} color="#6366F1" />
            Lihat Keuangan
          </button>

          <button
            onClick={() => navigate('/produk')}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 16px', borderRadius: '10px',
              background: '#FFFFFF', color: '#334155', border: '1.5px solid #E2E8F0',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.15s ease', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
          >
            <ShoppingBag size={15} color="#10B981" />
            Lihat Produk
          </button>

          <button
            onClick={() => navigate('/stok-bahan')}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 16px', borderRadius: '10px',
              background: '#FFFFFF', color: '#334155', border: '1.5px solid #E2E8F0',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.15s ease', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
          >
            <Boxes size={15} color="#F59E0B" />
            Lihat Stok
          </button>
        </div>
      </div>

      {/* ── [B] 4 STAT CARDS ────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px',
      }}>
        {statsData.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </div>

      {/* ── [C] GRAFIK TREN PENDAPATAN & RINGKASAN STATUS PESANAN ────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px',
      }}>
        {/* 1. Grafik Tren Pendapatan 7 Hari Terakhir */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '22px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="#10B981" />
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', margin: 0 }}>
                  Tren Pendapatan 7 Hari Terakhir
                </h3>
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
                Total pendapatan minggu ini: <strong style={{ color: '#0F172A' }}>{formatRupiah(totalMingguIni)}</strong>
              </div>
            </div>
            <button
              onClick={() => navigate('/keuangan')}
              style={{
                background: '#EEF2FF', border: 'none', color: '#6366F1',
                padding: '4px 10px', borderRadius: '8px', fontSize: '12px',
                fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              Laporan Keuangan <ChevronRight size={13} />
            </button>
          </div>

          {/* Bar Chart Visualizer */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '12px',
            height: '180px',
            paddingTop: '20px',
            borderBottom: '1px solid #F1F5F9',
          }}>
            {incomeTrendData.map((item, idx) => {
              const heightPct = Math.round((item.nominal / maxNominal) * 100);
              const isToday = idx === incomeTrendData.length - 1;

              return (
                <div key={idx} style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  height: '100%', justifyContent: 'flex-end',
                }}>
                  {/* Tooltip nominal on hover/static */}
                  <span style={{
                    fontSize: '10px', fontWeight: '700',
                    color: isToday ? '#6366F1' : '#64748B',
                    whiteSpace: 'nowrap',
                  }}>
                    {(item.nominal / 1000000).toFixed(1)}jt
                  </span>

                  {/* Bar */}
                  <div style={{
                    width: '100%', maxWidth: '38px',
                    height: `${heightPct}%`,
                    minHeight: '8px',
                    borderRadius: '6px 6px 0 0',
                    background: isToday
                      ? 'linear-gradient(180deg, #6366F1 0%, #4338CA 100%)'
                      : 'linear-gradient(180deg, #A5B4FC 0%, #C7D2FE 100%)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.filter = 'brightness(1.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.filter = 'none';
                  }}
                  />

                  {/* Label Hari */}
                  <div style={{ textAlign: 'center', marginTop: '4px' }}>
                    <div style={{ fontSize: '12px', fontWeight: isToday ? '700' : '500', color: isToday ? '#1E1B4B' : '#64748B' }}>
                      {item.day.slice(0, 3)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '11.5px', color: '#94A3B8' }}>
            <span>* Diperbarui otomatis dari catatan transaksi penjualan</span>
            <span style={{ color: '#10B981', fontWeight: '600' }}>✓ Rata-rata harian: {formatRupiah(Math.round(totalMingguIni / 7))}</span>
          </div>
        </div>

        {/* 2. Ringkasan Status Pesanan */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '22px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} color="#6366F1" />
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', margin: 0 }}>
                Ringkasan Status Pesanan
              </h3>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#6366F1', background: '#EEF2FF', padding: '3px 8px', borderRadius: '10px' }}>
              Total 24 Pesanan
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {statusSummaryData.map((item) => {
              const totalOrders = 24;
              const pct = Math.round((item.count / totalOrders) * 100);

              return (
                <div key={item.key} style={{
                  background: '#F8FAFC', borderRadius: '12px',
                  padding: '12px 14px', border: '1px solid #F1F5F9',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>
                        {item.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: item.color }}>
                        {item.count}
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                        ({pct}%)
                      </span>
                    </div>
                  </div>

                  {/* Mini Progress Bar */}
                  <div style={{ width: '100%', height: '5px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: item.color, borderRadius: '10px',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <button
              onClick={() => navigate('/pesanan')}
              style={{
                width: '100%', padding: '9px', borderRadius: '8px',
                border: '1.5px solid #E2E8F0', background: '#FFFFFF',
                color: '#475569', fontSize: '12.5px', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; }}
            >
              Buka Manajemen Pesanan Lengkap
            </button>
          </div>
        </div>
      </div>

      {/* ── [D] PESANAN TERBARU ───────────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: '0 0 2px' }}>
              Pesanan Masuk Terbaru
            </h3>
            <span style={{ fontSize: '12.5px', color: '#64748B' }}>
              Daftar transaksi pesanan terkini dari berbagai saluran penjualan
            </span>
          </div>

          <button
            onClick={() => navigate('/pesanan')}
            style={{
              background: 'none', border: 'none', color: '#6366F1',
              fontSize: '13px', fontWeight: '700', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontFamily: 'inherit',
            }}
          >
            Lihat Semua Pesanan <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '12px 18px', textAlign: 'left', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>ID Pesanan</th>
                <th style={{ padding: '12px 18px', textAlign: 'left', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Pelanggan</th>
                <th style={{ padding: '12px 18px', textAlign: 'left', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Sumber</th>
                <th style={{ padding: '12px 18px', textAlign: 'left', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Ringkasan Item</th>
                <th style={{ padding: '12px 18px', textAlign: 'right', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Total</th>
                <th style={{ padding: '12px 18px', textAlign: 'center', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => {
                const badge = getStatusBadgeConfig(order.status);
                const SourceIcon = order.sourceIcon;

                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAFF'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                  >
                    {/* ID */}
                    <td style={{ padding: '13px 18px', fontWeight: '700', color: '#6366F1', whiteSpace: 'nowrap' }}>
                      {order.id}
                    </td>

                    {/* Pelanggan */}
                    <td style={{ padding: '13px 18px', fontWeight: '600', color: '#1E293B', whiteSpace: 'nowrap' }}>
                      {order.customer}
                    </td>

                    {/* Sumber */}
                    <td style={{ padding: '13px 18px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '3px 8px', borderRadius: '6px',
                        background: '#F1F5F9', color: '#475569', fontSize: '12px', fontWeight: '600',
                      }}>
                        <SourceIcon size={12} color="#6366F1" />
                        {order.source}
                      </span>
                    </td>

                    {/* Item */}
                    <td style={{ padding: '13px 18px', color: '#64748B', maxWidth: '240px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.items}
                      </div>
                    </td>

                    {/* Total */}
                    <td style={{ padding: '13px 18px', textAlign: 'right', fontWeight: '800', color: '#0F172A', whiteSpace: 'nowrap' }}>
                      {formatRupiah(order.total)}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '13px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 10px', borderRadius: '20px',
                        background: badge.bg, color: badge.text,
                        fontSize: '11.5px', fontWeight: '700',
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.dot }} />
                        {badge.label}
                      </span>
                    </td>

                    {/* Waktu */}
                    <td style={{ padding: '13px 18px', textAlign: 'right', color: '#94A3B8', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {order.time}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
