import { useState, useEffect } from 'react';
import { Bell, Wifi, ChevronDown } from 'lucide-react';

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
        height: '64px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 4px rgba(99, 102, 241, 0.06)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '28px',
        paddingRight: '28px',
        gap: '16px',
      }}
    >
      {/* ── Spacer ───────────────────────────────────────── */}
      <div style={{ flex: 1 }} />

      {/* ── WhatsApp Status ──────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          background: '#ECFDF5',
          border: '1px solid #6EE7B7',
          borderRadius: '20px',
          padding: '5px 13px',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              display: 'block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10B981',
              animation: 'navbarPulse 2s infinite',
            }}
          />
        </span>
        <Wifi size={13} color="#059669" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#065F46' }}>
          WhatsApp Order: Aktif
        </span>
        <style>{`
          @keyframes navbarPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: 0.45; transform: scale(1.35); }
          }
        `}</style>
      </div>

      {/* ── Date ─────────────────────────────────────────── */}
      <div
        style={{
          fontSize: '12.5px',
          color: '#64748B',
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
        title="Notifikasi"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: '#64748B',
          transition: 'background 0.15s, color 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#EEF2FF';
          e.currentTarget.style.color = '#6366F1';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#64748B';
        }}
      >
        <Bell size={20} />
        {hasNotif && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#EF4444',
              border: '1.5px solid #FFFFFF',
            }}
          />
        )}
      </button>

      {/* ── Admin Profile ────────────────────────────────── */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setProfileOpen(prev => !prev)}
          title="Profil Admin"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'transparent',
            border: '1.5px solid transparent',
            borderRadius: '10px',
            padding: '5px 8px 5px 5px',
            cursor: 'pointer',
            transition: 'border-color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#F1F5F9';
            e.currentTarget.style.borderColor = '#E2E8F0';
          }}
          onMouseLeave={e => {
            if (!profileOpen) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #312E81)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '700',
              flexShrink: 0,
              letterSpacing: '0.5px',
            }}
          >
            EB
          </div>

          {/* Name & role */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B', lineHeight: 1.3 }}>
              Admin Erles
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.3 }}>
              Super Admin
            </div>
          </div>

          <ChevronDown
            size={14}
            color="#94A3B8"
            style={{
              transition: 'transform 0.2s',
              transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        {/* Dropdown */}
        {profileOpen && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 99 }}
              onClick={() => setProfileOpen(false)}
            />
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                zIndex: 200,
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(30, 27, 75, 0.12)',
                minWidth: '180px',
                overflow: 'hidden',
                animation: 'dropdownIn 0.15s ease',
              }}
            >
              <style>{`
                @keyframes dropdownIn {
                  from { opacity: 0; transform: translateY(-6px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
              `}</style>

              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>
                  Admin Erles
                </div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                  admin@erlesbakery.com
                </div>
              </div>

              {[
                { label: 'Pengaturan Akun' },
                { label: 'Keluar', danger: true },
              ].map(item => (
                <button
                  key={item.label}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '13px',
                    color: item.danger ? '#EF4444' : '#374151',
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = item.danger ? '#FEF2F2' : '#F8FAFC';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  onClick={() => setProfileOpen(false)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
