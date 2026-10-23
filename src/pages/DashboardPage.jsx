import { useState, useEffect } from 'react';
import { Package, Wallet, TrendingUp, ShoppingBag, AlertCircle, ArrowUpRight, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { financeService } from '../services/financeService';
import { orderService } from '../services/orderService';
import { formatRupiah } from '../utils/formatters';
import { LoadingState } from '../components/StateDisplay';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOfflineData, setIsOfflineData] = useState(false);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError(null);
      try {
        const [finRes, orderRes] = await Promise.all([
          financeService.summary(),
          orderService.list({ per_page: 1 }),
        ]);

        const totalOrders = orderRes.success ? (orderRes.meta?.total || 0) : 0;
        const isOffline = !!(finRes?.isOffline || orderRes?.isOffline);
        setIsOfflineData(isOffline);

        let activeOrders = 0;
        try {
          const [pendingRes, diprosesRes] = await Promise.all([
            orderService.list({ status: 'pending', per_page: 1 }),
            orderService.list({ status: 'diproses', per_page: 1 }),
          ]);
          activeOrders =
            (pendingRes.success ? (pendingRes.meta?.total || 0) : 0) +
            (diprosesRes.success ? (diprosesRes.meta?.total || 0) : 0);
        } catch {
          activeOrders = 0;
        }

        setStats({
          totalOrders,
          activeOrders,
          pemasukan: finRes.success ? (finRes.data?.total_pemasukan || 0) : 0,
          saldo: finRes.success ? (finRes.data?.saldo || 0) : 0,
        });
      } catch {
        setError('Gagal memuat data ringkasan dashboard.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingState message="Memuat ringkasan toko..." />;
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 20px',
        background: 'var(--color-surface, #FFFFFF)',
        borderRadius: 'var(--radius-lg, 12px)',
        border: '1px solid var(--color-border, #E8D9C5)',
      }}>
        <AlertCircle size={36} color="var(--color-danger, #B91C1C)" style={{ marginBottom: '12px' }} />
        <p style={{ color: 'var(--color-danger-text, #991B1B)', fontWeight: '600', marginBottom: '8px' }}>{error}</p>
        <p style={{ color: 'var(--color-text-secondary, #705847)', fontSize: '14px' }}>Pastikan server backend Laravel aktif di port 8000.</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Seluruh Pesanan',
      value: String(stats?.totalOrders || 0),
      suffix: 'pesanan',
      icon: ShoppingBag,
      color: 'var(--color-primary, #D97748)',
      bg: 'var(--color-primary-subtle, #FDF0EA)',
    },
    {
      label: 'Pesanan Perlu Diproses',
      value: String(stats?.activeOrders || 0),
      suffix: 'aktif',
      icon: Package,
      color: 'var(--color-warning, #9A6700)',
      bg: 'var(--color-warning-bg, #FFF8E1)',
    },
    {
      label: 'Pemasukan Periode Ini',
      value: formatRupiah(stats?.pemasukan || 0),
      icon: TrendingUp,
      color: 'var(--color-success, #2E7D32)',
      bg: 'var(--color-success-bg, #E8F5E9)',
    },
    {
      label: 'Saldo Kas Saat Ini',
      value: formatRupiah(stats?.saldo || 0),
      icon: Wallet,
      color: stats?.saldo >= 0 ? 'var(--color-primary, #D97748)' : 'var(--color-danger, #B91C1C)',
      bg: stats?.saldo >= 0 ? 'var(--color-primary-subtle, #FDF0EA)' : 'var(--color-danger-bg, #FEF2F2)',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text, #3D2817)',
          marginBottom: '6px',
        }}>
          Ringkasan Toko
        </h1>
        <p style={{ color: 'var(--color-text-secondary, #705847)', fontSize: '14px' }}>
          Pantau pesanan roti, hampers, dan catatan keuangan harian Erles Bakery.
        </p>
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
          <AlertTriangle size={20} color="var(--color-warning, #9A6700)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
            <strong>Mode Data Contoh (Offline):</strong> Backend API tidak dapat dijangkau. Data yang ditampilkan saat ini adalah data cadangan/simulasi.
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '28px',
      }}>
        {statCards.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'var(--color-surface, #FFFFFF)',
              borderRadius: 'var(--radius-lg, 12px)',
              padding: '22px 24px',
              border: '1px solid var(--color-border, #E8D9C5)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minWidth: 0,
              overflow: 'hidden',
              transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <span style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary, #705847)',
                fontWeight: '500',
              }}>
                {stat.label}
              </span>
              <div style={{
                background: stat.bg,
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <stat.icon size={18} color={stat.color} />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              minWidth: 0,
            }}>
              <div style={{
                fontSize: 'clamp(20px, 2vw, 24px)',
                fontWeight: '700',
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text, #3D2817)',
                lineHeight: '1.2',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                minWidth: 0,
              }}>
                {stat.value}
              </div>
              {stat.suffix && (
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted, #6E5645)', fontWeight: '500' }}>
                  {stat.suffix}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
      }}>
        <div style={{
          background: 'var(--color-surface, #FFFFFF)',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: '24px',
          border: '1px solid var(--color-border, #E8D9C5)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text, #3D2817)',
            marginBottom: '12px',
          }}>
            Panduan Operasional Harian
          </h2>
          <p style={{
            color: 'var(--color-text-secondary, #705847)',
            fontSize: '14px',
            lineHeight: '1.6',
            marginBottom: '16px',
          }}>
            Selamat datang di ruang kelola Erles Bakery. Di sini Anda dapat mengawasi alur pesanan pelanggan yang perlu diproduksi, mengatur jadwal pengambilan kue, serta mencatat belanja bahan baku dan rekap kas harian.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingTop: '12px',
            borderTop: '1px solid var(--color-border-subtle, #F5EDE4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary, #705847)' }}>
              <Clock size={16} color="var(--color-primary, #D97748)" />
              <span>Periksa menu <strong>Pesanan</strong> untuk pesanan berstatus pending atau siap ambil.</span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--color-surface, #FFFFFF)',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: '24px',
          border: '1px solid var(--color-border, #E8D9C5)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '700',
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text, #3D2817)',
              marginBottom: '12px',
            }}>
              Akses Cepat
            </h2>
            <p style={{
              color: 'var(--color-text-secondary, #705847)',
              fontSize: '14px',
              lineHeight: '1.6',
              marginBottom: '20px',
            }}>
              Kelola aktivitas toko roti langsung ke menu terkait:
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/pesanan"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md, 8px)',
                background: 'var(--color-primary, #D97748)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary-hover, #C26336)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary, #D97748)')}
            >
              Lihat Daftar Pesanan <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/keuangan"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md, 8px)',
                background: 'var(--color-bg, #FAF6F0)',
                color: 'var(--color-text, #3D2817)',
                border: '1px solid var(--color-border, #E8D9C5)',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'border-color var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary, #D97748)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border, #E8D9C5)')}
            >
              Catat Keuangan <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
