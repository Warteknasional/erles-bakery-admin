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
        background:
          'linear-gradient(180deg, #1E1B4B 0%, #312E81 50%, #3730A3 100%)',
        padding: '20px 16px',
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
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          padding: '4px 8px',
        }}
      >
        <div>
          <h2
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
              letterSpacing: '-0.3px',
            }}
          >
            🍞 Erles Bakery
          </h2>
          <span
            style={{
              color: '#A5B4FC',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            Admin Dashboard
          </span>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              color: '#C7D2FE',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')
            }
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
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
              fontWeight: '500',
              color: isActive ? 'white' : '#C7D2FE',
              background: isActive
                ? 'rgba(99, 102, 241, 0.35)'
                : 'transparent',
              transition: 'all 150ms ease',
              boxShadow: isActive
                ? '0 2px 8px rgba(99, 102, 241, 0.2)'
                : 'none',
            })}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '16px',
          marginTop: '16px',
        }}
      >
        {/* User info */}
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(99,102,241,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                flexShrink: 0,
              }}
            >
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  color: 'white',
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
                  color: '#A5B4FC',
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
            padding: '12px 16px',
            borderRadius: '10px',
            border: 'none',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#FCA5A5',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
          }}
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
