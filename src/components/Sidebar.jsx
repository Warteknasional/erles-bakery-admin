import { NavLink } from 'react-router-dom';
import { Package, Wallet, LayoutDashboard, ShoppingBag, Boxes } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pesanan', label: 'Pesanan', icon: Package },
  { to: '/keuangan', label: 'Keuangan', icon: Wallet },
  { to: '/produk', label: 'Produk', icon: ShoppingBag },
  { to: '/stok-bahan', label: 'Stok Bahan', icon: Boxes },
];

export default function Sidebar() {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🍞</span>
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

        {navItems.map(item => (
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
              </>
            )}
          </NavLink>
        ))}
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
