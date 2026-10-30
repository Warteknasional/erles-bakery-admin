import { useState, useEffect } from 'react';
import { Bell, Wifi, ChevronDown } from 'lucide-react';
import useAuth from '../hooks/useAuth';

function getFormattedDate() {
  const now = new Date();
  return now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [date, setDate] = useState(getFormattedDate());
  const [hasNotif, setHasNotif] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(getFormattedDate());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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
      {/* ── Status Toko Badge ────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: '#6E5D4F',
      }}>
        <span style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: '#16A34A',
        }} />
        <span style={{ fontWeight: '600' }}>Toko Buka:</span>
        <span>07:00 – 21:00 WIB</span>
      </div>

      {/* ── Spacer ───────────────────────────────────────── */}
      <div style={{ flex: 1 }} />

      {/* ── WhatsApp Status ──────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#F0FDF4',
          border: '1px solid #DCFCE7',
          borderRadius: '6px',
          padding: '4px 10px',
          whiteSpace: 'nowrap',
        }}
      >
        <Wifi size={12} color="#166534" />
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#166534' }}>
          WhatsApp Order: Siap Terima Pesanan
        </span>
      </div>

      {/* ── Tanggal Hari Ini ─────────────────────────────── */}
      <div
        style={{
          fontSize: '12px',
          color: '#8C7A6B',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          padding: '0 4px',
        }}
      >
        {date}
      </div>

      {/* ── Notification Bell ────────────────────────────── */}
      <button
        onClick={() => setHasNotif(false)}
        title="Notifikasi Masuk"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '34px',
          height: '34px',
          borderRadius: '6px',
          border: '1px solid #E6DED4',
          background: '#FAF7F2',
          cursor: 'pointer',
          color: '#6E5D4F',
          transition: 'background 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#F0E9DF'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#FAF7F2'; }}
      >
        <Bell size={16} />
        {hasNotif && (
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#DC2626',
            }}
          />
        )}
      </button>

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
                  color: '#5C4A3C',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FAF7F2'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                onClick={() => setProfileOpen(false)}
              >
                Pengaturan Toko
              </button>

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
