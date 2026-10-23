import { Loader2, Inbox, AlertCircle } from 'lucide-react';

export function LoadingState({ message = 'Memuat data...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        color: 'var(--color-text-secondary, #705847)',
      }}
      role="status"
    >
      <Loader2
        size={36}
        color="var(--color-primary, #D97748)"
        style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }}
      />
      <span style={{ fontSize: '14px', fontWeight: '600' }}>{message}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function EmptyState({ message = 'Belum ada data.', icon: Icon = Inbox }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        color: 'var(--color-text-muted, #9E8776)',
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '12px',
          background: 'var(--color-bg, #FAF6F0)',
          border: '1px solid var(--color-border-subtle, #F5EDE4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          color: 'var(--color-text-muted, #9E8776)',
        }}
      >
        <Icon size={26} />
      </div>
      <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-secondary, #705847)' }}>
        {message}
      </span>
    </div>
  );
}

export function ErrorState({ message = 'Terjadi kesalahan saat memuat data.', onRetry }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
      }}
      role="alert"
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '12px',
          background: 'var(--color-danger-bg, #FEF2F2)',
          border: '1px solid var(--color-danger-border, #FECACA)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <AlertCircle size={26} color="var(--color-danger, #B91C1C)" />
      </div>
      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-danger-text, #991B1B)', marginBottom: '14px', textAlign: 'center' }}>
        {message}
      </span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '8px 18px',
            border: '1px solid var(--color-border, #E8D9C5)',
            borderRadius: 'var(--radius-md, 8px)',
            background: '#FFFFFF',
            color: 'var(--color-text, #3D2817)',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'border-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary, #D97748)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border, #E8D9C5)')}
        >
          Coba Muat Ulang
        </button>
      )}
    </div>
  );
}
