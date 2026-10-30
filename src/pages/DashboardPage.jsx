import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, CheckCircle2, AlertCircle, XCircle,
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Store, Smartphone, Globe, ArrowRight, RefreshCw,
  Plus, Check, ChevronRight, Flame
} from 'lucide-react';

// ─── Data Toko & Metrik ────────────────────────────────────────────────────────

const initialOrders = [
  {
    id: 'ORD-20240115-001',
    customer: 'Budi Santoso',
    source: 'WhatsApp',
    sourceIcon: Smartphone,
    items: 'Roti Tawar Jumbo (x3), Croissant (x5)',
    total: 250000,
    status: 'menunggu_konfirmasi',
    time: '10 mnt lalu',
  },
  {
    id: 'ORD-20240115-002',
    customer: 'Siti Aminah',
    source: 'Toko Offline',
    sourceIcon: Store,
    items: 'Bolu Kukus Pandan (x2), Kue Sus (x12)',
    total: 180000,
    status: 'diproses',
    time: '25 mnt lalu',
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

const incomeTrendData = [
  { day: 'Senin', date: '23 Sep', nominal: 2850000 },
  { day: 'Selasa', date: '24 Sep', nominal: 3100000 },
  { day: 'Rabu', date: '25 Sep', nominal: 2950000 },
  { day: 'Kamis', date: '26 Sep', nominal: 3600000 },
  { day: 'Jumat', date: '27 Sep', nominal: 4200000 },
  { day: 'Sabtu', date: '28 Sep', nominal: 4850000 },
  { day: 'Minggu', date: '29 Sep', nominal: 3450000 },
];

// Signature element untuk Bakery: Live Sell-out & Batch Status
const bakerySellOutData = [
  {
    name: 'Donat Glazed Klasik',
    batch: 'Batch 1 (06:00)',
    baked: 48,
    sold: 48,
    status: 'Habis (Sold Out)',
    badge: 'sold-out',
  },
  {
    name: 'Roti Tawar Gandum Jumbo',
    batch: 'Batch 1 (06:30)',
    baked: 30,
    sold: 28,
    status: 'Sisa 2 pcs',
    badge: 'critical',
  },
  {
    name: 'Croissant Butter Artisan',
    batch: 'Batch 2 (09:00)',
    baked: 50,
    sold: 42,
    status: 'Sisa 8 pcs',
    badge: 'normal',
  },
  {
    name: 'Bolu Kukus Pandan Suji',
    batch: 'Batch 2 (10:30)',
    baked: 20,
    sold: 14,
    status: 'Sisa 6 pcs',
    badge: 'normal',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
}

function getTodayFormatted() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('id-ID', options);
}

function getStatusStyle(status) {
  switch (status) {
    case 'menunggu_konfirmasi':
      return {
        bg: '#FEF9C3',
        text: '#854D0E',
        dot: '#CA8A04',
        label: 'Perlu Konfirmasi',
      };
    case 'diproses':
      return {
        bg: '#FFF7ED',
        text: '#9A3412',
        dot: '#EA580C',
        label: 'Sedang Diproses',
      };
    case 'selesai':
      return {
        bg: '#F0FDF4',
        text: '#166534',
        dot: '#16A34A',
        label: 'Selesai',
      };
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
  const [orders, setOrders] = useState(initialOrders);
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  const todayStr = useMemo(() => getTodayFormatted(), []);

  // Konfirmasi pesanan langsung di tabel
  const handleConfirmOrder = (orderId) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: 'diproses' } : o)
    );
  };

  const pendingCount = orders.filter(o => o.status === 'menunggu_konfirmasi').length;
  const processingCount = orders.filter(o => o.status === 'diproses').length;
  const completedCount = orders.filter(o => o.status === 'selesai').length;

  const maxNominal = Math.max(...incomeTrendData.map(d => d.nominal));
  const totalMingguIni = incomeTrendData.reduce((sum, d) => sum + d.nominal, 0);
  const avgHarian = Math.round(totalMingguIni / incomeTrendData.length);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

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

      {/* ── [1] PAGE HEADER (Clear Context, Finding & Action) ───────────── */}
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
            <span>OVERVIEW OPERASIONAL</span>
            <span style={{ color: '#D4C5B9' }}>•</span>
            <span style={{ color: '#665343' }}>{todayStr}</span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#241B14',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em',
          }}>
            Dashboard Toko & Produksi
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#6E5D4F',
          }}>
            {pendingCount > 0 ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: '#B45309',
                fontWeight: '600',
              }}>
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#D97706',
                  animation: 'pulse 1.5s infinite',
                }} />
                {pendingCount} pesanan membutuhkan konfirmasi dapur
              </span>
            ) : (
              <span style={{ color: '#15803D', fontWeight: '500' }}>
                ✓ Semua pesanan telah dikonfirmasi
              </span>
            )}
            <span style={{ color: '#D4C5B9' }}>•</span>
            <span>Pendapatan hari ini berjalan di atas rata-rata (+8.5%)</span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleRefresh}
            title="Muat ulang data"
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
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FAF7F2'; e.currentTarget.style.borderColor = '#D1C4B5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.borderColor = '#E2D9CE'; }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Perbarui
          </button>

          <button
            onClick={() => navigate('/pesanan')}
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
            Catat Pesanan
          </button>
        </div>
      </div>

      {/* ── [2] UNIFIED METRIC STRIP (Data-first, No Cheesy Circles) ───── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E6DED4',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
      }}>
        {/* KPI 1: Pendapatan Hari Ini (Primary Focal Metric) */}
        <div style={{
          padding: '20px 24px',
          borderRight: '1px solid #EFEAE3',
        }}>
          <div style={{
            fontSize: '12.5px',
            fontWeight: '600',
            color: '#7D6B5C',
            marginBottom: '8px',
          }}>
            Pendapatan Hari Ini
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            Rp 3.450.000
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: '#166534',
              fontWeight: '600',
              background: '#F0FDF4',
              padding: '1px 5px',
              borderRadius: '4px',
            }}>
              <ArrowUpRight size={13} />
              +8.5%
            </span>
            <span style={{ color: '#8C7A6B' }}>vs kemarin (19 nota lunas)</span>
          </div>
        </div>

        {/* KPI 2: Total Pesanan Masuk */}
        <div style={{
          padding: '20px 24px',
          borderRight: '1px solid #EFEAE3',
        }}>
          <div style={{
            fontSize: '12.5px',
            fontWeight: '600',
            color: '#7D6B5C',
            marginBottom: '8px',
          }}>
            Total Pesanan Masuk
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            24 <span style={{ fontSize: '15px', fontWeight: '500', color: '#8C7A6B' }}>pesanan</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: '#166534',
              fontWeight: '600',
              background: '#F0FDF4',
              padding: '1px 5px',
              borderRadius: '4px',
            }}>
              <ArrowUpRight size={13} />
              +12%
            </span>
            <span style={{ color: '#8C7A6B' }}>19 selesai • 5 aktif</span>
          </div>
        </div>

        {/* KPI 3: Pesanan Perlu Konfirmasi (Queue needing attention) */}
        <div style={{
          padding: '20px 24px',
          borderRight: '1px solid #EFEAE3',
        }}>
          <div style={{
            fontSize: '12.5px',
            fontWeight: '600',
            color: '#7D6B5C',
            marginBottom: '8px',
          }}>
            Antrean Dapur & Konfirmasi
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: pendingCount > 0 ? '#B45309' : '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {pendingCount} <span style={{ fontSize: '15px', fontWeight: '500', color: '#8C7A6B' }}>menunggu</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            {processingCount} pesanan sedang dalam pengerjaan
          </div>
        </div>

        {/* KPI 4: Kas Operasional Toko */}
        <div style={{
          padding: '20px 24px',
        }}>
          <div style={{
            fontSize: '12.5px',
            fontWeight: '600',
            color: '#7D6B5C',
            marginBottom: '8px',
          }}>
            Kas Operasional Toko
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            Rp 14.850.000
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Pemasukan tunai & transfer hari ini tercatat
          </div>
        </div>
      </div>

      {/* ── [3] DUA KOLOM: TREN PENDAPATAN & SELL-OUT STRIP ────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: '20px',
        alignItems: 'stretch',
      }}>
        {/* Kolom Kiri: Tren Pendapatan 7 Hari */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E6DED4',
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}>
              <h2 style={{
                fontSize: '15px',
                fontWeight: '700',
                color: '#241B14',
                margin: 0,
              }}>
                Tren Penjualan 7 Hari Terakhir
              </h2>
              <span style={{
                fontSize: '12.5px',
                color: '#6E5D4F',
                fontVariantNumeric: 'tabular-nums',
              }}>
                Total: <strong style={{ color: '#241B14' }}>{formatRupiah(totalMingguIni)}</strong>
              </span>
            </div>
            <p style={{
              fontSize: '12px',
              color: '#8C7A6B',
              margin: '0 0 20px 0',
            }}>
              Rata-rata penjualan harian {formatRupiah(avgHarian)} • Puncak penjualan di hari Sabtu
            </p>

            {/* Crisp Column Chart */}
            <div style={{
              height: '175px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '12px',
              paddingBottom: '26px',
              borderBottom: '1px solid #EFEAE3',
              position: 'relative',
            }}>
              {/* Reference Baseline Guide */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: `${Math.round((avgHarian / maxNominal) * 149) + 26}px`,
                borderBottom: '1px dashed #D9CFC4',
                pointerEvents: 'none',
              }}>
                <span style={{
                  position: 'absolute',
                  right: 0,
                  bottom: '2px',
                  fontSize: '10px',
                  color: '#9C8B7E',
                  background: '#FFFFFF',
                  paddingLeft: '4px',
                }}>
                  Rata-rata {formatRupiah(avgHarian)}
                </span>
              </div>

              {incomeTrendData.map((item, idx) => {
                const heightPx = Math.round((item.nominal / maxNominal) * 140);
                const isToday = idx === incomeTrendData.length - 1;
                const isHovered = hoveredBarIndex === idx;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    style={{
                      flex: 1,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div style={{
                        position: 'absolute',
                        top: '-32px',
                        background: '#241B14',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '3px 7px',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap',
                        zIndex: 10,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      }}>
                        {item.day}: {formatRupiah(item.nominal)}
                      </div>
                    )}

                    {/* Column Bar */}
                    <div style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${heightPx}px`,
                      borderRadius: '4px 4px 0 0',
                      background: isToday
                        ? '#C25E34' // Bakery Terracotta Accent for Today
                        : isHovered
                          ? '#A47E65'
                          : '#D4C3B3', // Muted crust tone for prior days
                      transition: 'background 0.15s, height 0.2s',
                    }} />

                    {/* Day Label */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-22px',
                      fontSize: '11.5px',
                      fontWeight: isToday ? '700' : '500',
                      color: isToday ? '#C25E34' : '#7D6B5C',
                    }}>
                      {item.day.slice(0, 3)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '14px',
            fontSize: '12px',
            color: '#8C7A6B',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '9px', height: '9px', background: '#C25E34', borderRadius: '2px' }} />
                Hari Ini
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '9px', height: '9px', background: '#D4C3B3', borderRadius: '2px' }} />
                Hari Sebelumnya
              </span>
            </div>
            <button
              onClick={() => navigate('/keuangan')}
              style={{
                background: 'none',
                border: 'none',
                color: '#8C5A37',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0,
              }}
            >
              Rincian Kas <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Bakery Signature Element - Sell-Out Strip & Batch Monitor */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E6DED4',
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={16} color="#C25E34" />
                <h2 style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#241B14',
                  margin: 0,
                }}>
                  Status Produksi & Penjualan Roti
                </h2>
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#7D6B5C',
                background: '#F7F3EE',
                padding: '2px 7px',
                borderRadius: '4px',
              }}>
                Batch Hari Ini
              </span>
            </div>
            <p style={{
              fontSize: '12px',
              color: '#8C7A6B',
              margin: '0 0 16px 0',
            }}>
              Pantauan pergerakan stok etalase untuk jadwal pemanggangan berikutnya
            </p>

            {/* List Item Bakery */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {bakerySellOutData.map((item, idx) => {
                const pct = Math.round((item.sold / item.baked) * 100);
                const isSoldOut = item.badge === 'sold-out';
                const isCritical = item.badge === 'critical';

                return (
                  <div key={idx} style={{
                    paddingBottom: '10px',
                    borderBottom: idx < bakerySellOutData.length - 1 ? '1px solid #F3EDE6' : 'none',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}>
                      <div>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#241B14',
                        }}>
                          {item.name}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: '#9C8B7E',
                          marginLeft: '6px',
                        }}>
                          {item.batch}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontVariantNumeric: 'tabular-nums',
                        color: isSoldOut ? '#DC2626' : isCritical ? '#B45309' : '#6E5D4F',
                        fontWeight: '600',
                      }}>
                        {item.sold}/{item.baked} <span style={{ fontWeight: '400', color: '#9C8B7E' }}>({pct}%)</span>
                      </div>
                    </div>

                    {/* Minimal Progress Bar */}
                    <div style={{
                      height: '5px',
                      background: '#EFEAE3',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      marginTop: '4px',
                    }}>
                      <div style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: isSoldOut
                          ? '#DC2626'
                          : isCritical
                            ? '#D97706'
                            : '#8C5A37',
                        borderRadius: '3px',
                      }} />
                    </div>
                  </div>
                );
              })}
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
            onMouseEnter={e => { e.currentTarget.style.background = '#F0E9DF'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FAF7F2'; }}
          >
            Kelola Stok & Katalog Produk <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* ── [4] PESANAN MASUK TERBARU (Honest Rules & Alignment) ───────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E6DED4',
        boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
        overflow: 'hidden',
      }}>
        {/* Table Header Row */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #EFEAE3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#241B14',
              margin: '0 0 2px 0',
            }}>
              Pesanan Masuk Terbaru
            </h2>
            <p style={{
              fontSize: '12px',
              color: '#8C7A6B',
              margin: 0,
            }}>
              Daftar transaksi pesanan hari ini dari WhatsApp, website, dan gerai toko
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
                <th style={{ padding: '10px 18px' }}>ID Pesanan</th>
                <th style={{ padding: '10px 18px' }}>Pelanggan</th>
                <th style={{ padding: '10px 18px' }}>Saluran</th>
                <th style={{ padding: '10px 18px' }}>Rincian Item</th>
                <th style={{ padding: '10px 18px', textAlign: 'right' }}>Total</th>
                <th style={{ padding: '10px 18px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '10px 18px' }}>Waktu</th>
                <th style={{ padding: '10px 18px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const badge = getStatusStyle(order.status);
                const SourceIcon = order.sourceIcon;
                const isPending = order.status === 'menunggu_konfirmasi';

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
                    {/* ID */}
                    <td style={{
                      padding: '12px 18px',
                      fontWeight: '600',
                      color: '#6E5D4F',
                      fontVariantNumeric: 'tabular-nums',
                      whiteSpace: 'nowrap',
                    }}>
                      {order.id}
                    </td>

                    {/* Pelanggan */}
                    <td style={{
                      padding: '12px 18px',
                      fontWeight: '600',
                      color: '#241B14',
                      whiteSpace: 'nowrap',
                    }}>
                      {order.customer}
                    </td>

                    {/* Sumber */}
                    <td style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        color: '#6E5D4F',
                      }}>
                        <SourceIcon size={13} color="#8C7A6B" />
                        {order.source}
                      </span>
                    </td>

                    {/* Item */}
                    <td style={{
                      padding: '12px 18px',
                      color: '#6E5D4F',
                      maxWidth: '260px',
                    }}>
                      <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {order.items}
                      </div>
                    </td>

                    {/* Total (Right-aligned, tabular nums) */}
                    <td style={{
                      padding: '12px 18px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#241B14',
                      fontVariantNumeric: 'tabular-nums',
                      whiteSpace: 'nowrap',
                    }}>
                      {formatRupiah(order.total)}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '12px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: badge.bg,
                        color: badge.text,
                        fontSize: '11.5px',
                        fontWeight: '600',
                      }}>
                        <span style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: badge.dot,
                        }} />
                        {badge.label}
                      </span>
                    </td>

                    {/* Waktu */}
                    <td style={{
                      padding: '12px 18px',
                      color: '#9C8B7E',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                    }}>
                      {order.time}
                    </td>

                    {/* Quick Action Button */}
                    <td style={{ padding: '12px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {isPending ? (
                        <button
                          onClick={() => handleConfirmOrder(order.id)}
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
                          onMouseEnter={e => { e.currentTarget.style.background = '#FEF08A'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#FEF9C3'; }}
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
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
