import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Header({ onMenuToggle, isMobile }) {
  const { user } = useAuth();
  const initial = user?.name?.charAt(0).toUpperCase() || 'A';

  return (
    <header
      style={{
        height: 'var(--header-height, 64px)',
        background: 'var(--color-surface, #FFFFFF)',
        borderBottom: '1px solid var(--color-border, #E8D9C5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
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
              color: 'var(--color-text, #3D2817)',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'var(--color-bg, #FAF6F0)')
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
              fontSize: '18px',
              fontWeight: '700',
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text, #3D2817)',
            }}
          >
            Erles Bakery
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            color: 'var(--color-text-secondary, #705847)',
            position: 'relative',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'var(--color-bg, #FAF6F0)')
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
              background: 'var(--color-primary, #D97748)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'var(--font-display)',
              boxShadow: '0 2px 6px rgba(217, 119, 72, 0.25)',
            }}
          >
            {initial}
          </div>
          {!isMobile && user && (
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text, #3D2817)' }}>
              {user.name}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
