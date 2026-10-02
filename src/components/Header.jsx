import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Header({ onMenuToggle, isMobile }) {
  const { user } = useAuth();
  const initial = user?.name?.charAt(0).toUpperCase() || 'A';

  return (
    <header
      style={{
        height: 'var(--header-height, 64px)',
        background: 'white',
        borderBottom: '1px solid var(--color-border, #E2E8F0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isMobile && (
          <button
            onClick={onMenuToggle}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              color: '#64748B',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = '#F1F5F9')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'none')
            }
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>
        )}
        {isMobile && (
          <span
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1E293B',
            }}
          >
            🍞 Erles Bakery
          </span>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            color: '#64748B',
            position: 'relative',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = '#F1F5F9')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'none')
          }
          aria-label="Notifikasi"
        >
          <Bell size={20} />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
            }}
          >
            {initial}
          </div>
          {!isMobile && user && (
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
              {user.name}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
