import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '56px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E6DED4',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '28px',
        paddingRight: '28px',
        gap: '16px',
        color: '#241B14',
      }}
    >
      {/* ── Spacer ───────────────────────────────────────── */}
      <div style={{ flex: 1 }} />

      {/* ── Profile Dropdown ─────────────────────────────── */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setProfileOpen(prev => !prev)}
          title="Profil Admin"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 6px',
            cursor: 'pointer',
          }}
        >
          {/* Avatar Monogram */}
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: '#241B14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: '700',
              flexShrink: 0,
            }}
          >
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'EB'}
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#241B14', lineHeight: 1.2 }}>
              {user?.name || 'Admin Erles'}
            </div>
            <div style={{ fontSize: '10.5px', color: '#8C7A6B', lineHeight: 1.2 }}>
              {user?.role ? user.role.toUpperCase() : 'Kitchen Manager'}
            </div>
          </div>

          <ChevronDown
            size={13}
            color="#8C7A6B"
            style={{
              transition: 'transform 0.15s',
              transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        {/* Dropdown Menu */}
        {profileOpen && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 99 }}
              onClick={() => setProfileOpen(false)}
            />
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                zIndex: 200,
                background: '#FFFFFF',
                border: '1px solid #E6DED4',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(36, 27, 20, 0.10)',
                minWidth: '180px',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #EFEAE3' }}>
                <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#241B14' }}>
                  {user?.name || 'Admin Erles Bakery'}
                </div>
                <div style={{ fontSize: '11px', color: '#8C7A6B', marginTop: '1px' }}>
                  {user?.email || 'admin@erlesbakery.com'}
                </div>
              </div>

              <button
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 14px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '12.5px',
                  color: '#DC2626',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
              >
                Keluar Akun
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
