import { AlertTriangle, X } from 'lucide-react';

/**
 * Modal konfirmasi — digunakan sebelum aksi destruktif/penting.
 * Props: open, title, message, confirmLabel, cancelLabel, variant, onConfirm, onCancel, loading
 */
export default function ConfirmModal({
  open,
  title = 'Konfirmasi',
  message = 'Apakah kamu yakin?',
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'primary', // primary | danger
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  const colors = {
    primary: {
      bg: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      shadow: 'rgba(99,102,241,0.3)',
      iconBg: '#E0E7FF',
      iconColor: '#6366F1',
    },
    danger: {
      bg: 'linear-gradient(135deg, #EF4444, #DC2626)',
      shadow: 'rgba(239,68,68,0.3)',
      iconBg: '#FEE2E2',
      iconColor: '#EF4444',
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
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 200ms ease',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          animation: 'slideUp 200ms ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: c.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={20} color={c.iconColor} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B', margin: 0 }}>{title}</h3>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '4px',
              display: 'flex',
              borderRadius: '6px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
          {message}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '10px 20px',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              background: 'white',
              color: '#374151',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 150ms',
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
              borderRadius: '10px',
              background: loading ? '#94A3B8' : c.bg,
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : `0 4px 12px ${c.shadow}`,
              transition: 'all 150ms',
            }}
          >
            {loading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
