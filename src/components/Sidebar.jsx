import { NavLink, useNavigate } from 'react-router-dom';
import { Package, Wallet, LayoutDashboard, LogOut, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pesanan', label: 'Pesanan', icon: Package },
  { to: '/keuangan', label: 'Keuangan', icon: Wallet },
];

export default function Sidebar({ isOpen, isMobile, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      style={{
        width: 'var(--sidebar-width, 260px)',
        minWidth: 'var(--sidebar-width, 260px)',
        minHeight: '100vh',
        background: 'var(--sidebar-bg, #2C1D11)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 250ms ease',
        overflowY: 'auto',
        borderRight: '1px solid var(--sidebar-border, rgba(232, 217, 197, 0.12))',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          padding: '0 8px',
        }}
      >
        <div>
          <h2
            style={{
              color: 'var(--sidebar-text, #FAF6F0)',
              fontSize: '20px',
              fontWeight: '700',
              fontFamily: 'var(--font-display)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Erles Bakery
          </h2>
          <span
            style={{
              color: 'var(--sidebar-text-muted, #D9C5B2)',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            Admin Panel
          </span>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              background: 'rgba(250, 246, 240, 0.1)',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              color: '#FAF6F0',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(250, 246, 240, 0.2)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'rgba(250, 246, 240, 0.1)')
            }
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: 1,
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={isMobile ? onClose : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '500',
              color: isActive ? '#FAF6F0' : 'var(--sidebar-text-muted, #D9C5B2)',
              background: isActive
                ? 'var(--color-primary, #D97748)'
                : 'transparent',
              transition: 'all 150ms ease',
              boxShadow: isActive
                ? '0 2px 8px rgba(217, 119, 72, 0.35)'
                : 'none',
            })}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div
        style={{
          borderTop: '1px solid var(--sidebar-border, rgba(232, 217, 197, 0.12))',
          paddingTop: '16px',
          marginTop: '16px',
        }}
      >
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 8px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'var(--color-primary, #D97748)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'var(--font-display)',
                flexShrink: 0,
              }}
            >
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  color: 'var(--sidebar-text, #FAF6F0)',
                  fontSize: '13px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  color: 'var(--sidebar-text-muted, #D9C5B2)',
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.email}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            background: 'rgba(185, 28, 28, 0.15)',
            color: '#FCA5A5',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(185, 28, 28, 0.28)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(185, 28, 28, 0.15)';
          }}
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
