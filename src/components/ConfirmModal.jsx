import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  open,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin ingin melanjutkan?',
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'primary',
  onConfirm,
  onCancel,
  loading = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open && !loading) {
        onCancel();
      }
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const colors = {
    primary: {
      btnBg: 'var(--color-primary, #D97748)',
      btnHover: 'var(--color-primary-hover, #C26336)',
      iconBg: 'var(--color-primary-subtle, #FDF0EA)',
      iconColor: 'var(--color-primary, #D97748)',
    },
    danger: {
      btnBg: 'var(--color-danger, #B91C1C)',
      btnHover: '#991B1B',
      iconBg: 'var(--color-danger-bg, #FEF2F2)',
      iconColor: 'var(--color-danger, #B91C1C)',
    },
  };
  const c = colors[variant] || colors.primary;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(44, 29, 17, 0.6)',
      }}
      onClick={loading ? undefined : onCancel}
    >
      <div
        style={{
          background: 'var(--color-surface, #FFFFFF)',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: '28px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border, #E8D9C5)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: c.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} color={c.iconColor} />
            </div>
            <h3 id="modal-title" style={{ fontSize: '17px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--color-text, #3D2817)', margin: 0 }}>
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: 'var(--color-text-muted, #6E5645)',
              padding: '4px',
              display: 'flex',
              borderRadius: '6px',
            }}
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--color-text-secondary, #705847)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '10px 18px',
              border: '1px solid var(--color-border, #E8D9C5)',
              borderRadius: 'var(--radius-md, 8px)',
              background: 'var(--color-bg, #FAF6F0)',
              color: 'var(--color-text, #3D2817)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'border-color var(--transition-fast)',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: 'var(--radius-md, 8px)',
              background: loading ? '#CBD5E1' : c.btnBg,
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = c.btnHover;
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = c.btnBg;
            }}
          >
            {loading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
