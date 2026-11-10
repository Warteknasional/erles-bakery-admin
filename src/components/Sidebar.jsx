import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Package, Wallet, LayoutDashboard, ShoppingBag, Boxes } from 'lucide-react';
import orderService from '../services/orderService';
import productService from '../services/productService';
import { ingredientService } from '../services/ingredientService';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pesanan', label: 'Pesanan', icon: Package },
  { to: '/keuangan', label: 'Keuangan', icon: Wallet },
  { to: '/produk', label: 'Produk', icon: ShoppingBag },
  { to: '/stok-bahan', label: 'Stok Bahan', icon: Boxes },
];

export default function Sidebar() {
  const [counts, setCounts] = useState({
    pendingOrders: 0,
    unpaidOrders: 0,
    lowStockProducts: 0,
    criticalIngredients: 2,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchAllBadges = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // 1. Pesanan baru (status: pending)
        const pendingRes = await orderService.getOrders({ status: 'pending', per_page: 1 });
        const pendingTotal = pendingRes?.meta?.total ?? (Array.isArray(pendingRes?.data) ? pendingRes.data.length : 0);

        // 2. Tagihan belum lunas (payment_status: unpaid)
        const unpaidRes = await orderService.getOrders({ payment_status: 'unpaid', per_page: 1 });
        const unpaidTotal = unpaidRes?.meta?.total ?? (Array.isArray(unpaidRes?.data) ? unpaidRes.data.length : 0);

        // 3. Produk stok menipis (stok <= 10)
        let lowStockTotal = 0;
        try {
          const prodRes = await productService.getProducts({ all: true });
          const prods = Array.isArray(prodRes?.data) ? prodRes.data : [];
          lowStockTotal = prods.filter(p => p.is_active && Number(p.stok) <= 10).length;
        } catch (_) {}

        // 4. Bahan baku kritis (stok <= minimum_stok * 0.5)
        let criticalBahanTotal = 0;
        try {
          const ingRes = await ingredientService.getIngredients({ status: 'Kritis' });
          criticalBahanTotal = ingRes?.meta?.total ?? (Array.isArray(ingRes?.data) ? ingRes.data.length : 0);
        } catch (_) {}

        if (isMounted) {
          setCounts({
            pendingOrders: pendingTotal,
            unpaidOrders: unpaidTotal,
            lowStockProducts: lowStockTotal,
            criticalIngredients: criticalBahanTotal,
          });
        }
      } catch (err) {
        // Abaikan error jaringan saat logout
      }
    };

    fetchAllBadges();
    const interval = setInterval(fetchAllBadges, 8000);
    window.addEventListener('focus', fetchAllBadges);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', fetchAllBadges);
    };
  }, []);

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: '#1F1610',
      borderRight: '1px solid #2C2017',
      padding: '24px 14px',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 101,
    }}>
      {/* Brand Header */}
      <div style={{ marginBottom: '32px', padding: '0 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/logo.jpg"
            alt="Erles Bakery"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
              border: '1.5px solid rgba(255,255,255,0.18)',
            }}
          />
          <div>
            <h2 style={{
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '700',
              letterSpacing: '0.01em',
              margin: 0,
            }}>
              Erles Bakery
            </h2>
            <div style={{
              color: '#9C8B7E',
              fontSize: '11px',
              letterSpacing: '0.03em',
              marginTop: '1px',
            }}>
              Bakehouse & Kitchen
            </div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div style={{
          fontSize: '10.5px',
          fontWeight: '700',
          color: '#6E5D4F',
          letterSpacing: '0.06em',
          padding: '6px 12px',
          textTransform: 'uppercase',
        }}>
          Menu Utama
        </div>

        {navItems.map(item => {
          let badge = null;

          if (item.to === '/pesanan' && counts.pendingOrders > 0) {
            badge = {
              label: `${counts.pendingOrders} Baru`,
              bg: '#DC2626',
              tooltip: `${counts.pendingOrders} pesanan baru menunggu konfirmasi`,
            };
          } else if (item.to === '/keuangan' && counts.unpaidOrders > 0) {
            badge = {
              label: `${counts.unpaidOrders} Tagihan`,
              bg: '#EA580C',
              tooltip: `${counts.unpaidOrders} pesanan belum lunas`,
            };
          } else if (item.to === '/produk' && counts.lowStockProducts > 0) {
            badge = {
              label: `${counts.lowStockProducts} Menipis`,
              bg: '#D97706',
              tooltip: `${counts.lowStockProducts} produk stok mendekati batas minimum`,
            };
          } else if (item.to === '/stok-bahan' && counts.criticalIngredients > 0) {
            badge = {
              label: `${counts.criticalIngredients} Kritis`,
              bg: '#92400E',
              tooltip: `${counts.criticalIngredients} bahan baku mencapai batas kritis`,
            };
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '11px',
                padding: '10px 12px',
                borderRadius: '7px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? '#FFFFFF' : '#B8A89A',
                background: isActive ? '#2D2017' : 'transparent',
                transition: 'background 0.12s, color 0.12s',
                position: 'relative',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      left: '2px',
                      top: '25%',
                      bottom: '25%',
                      width: '3px',
                      borderRadius: '2px',
                      background: '#C25E34',
                    }} />
                  )}
                  <item.icon size={17} color={isActive ? '#C25E34' : '#8C7A6B'} />
                  <span>{item.label}</span>
                  {badge && (
                    <span
                      title={badge.tooltip}
                      style={{
                        marginLeft: 'auto',
                        background: badge.bg,
                        color: '#FFFFFF',
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '2px 7px',
                        borderRadius: '10px',
                        boxShadow: `0 0 8px ${badge.bg}66`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: '#FFFFFF',
                          display: 'inline-block',
                        }}
                      />
                      {badge.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Store Badge */}
      <div style={{
        marginTop: 'auto',
        padding: '12px 10px',
        borderTop: '1px solid #2C2017',
      }}>
        <div style={{
          fontSize: '11px',
          color: '#8C7A6B',
          lineHeight: 1.4,
        }}>
          <div>Cabang Utama • Jl. Melati</div>
          <div style={{ color: '#665343', marginTop: '2px' }}>v1.2.0 • Online Mode</div>
        </div>
      </div>
    </aside>
  );
}
