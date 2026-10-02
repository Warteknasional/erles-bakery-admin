import { Loader2, Inbox, AlertCircle } from 'lucide-react';

/**
 * Komponen state kosong/loading/error — reusable di semua halaman.
 */

export function LoadingState({ message = 'Memuat data...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        color: '#64748B',
      }}
    >
      <Loader2
        size={36}
        color="#6366F1"
        style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }}
      />
      <span style={{ fontSize: '14px', fontWeight: '500' }}>{message}</span>
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
        color: '#94A3B8',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <Icon size={28} />
      </div>
      <span style={{ fontSize: '14px', fontWeight: '500' }}>{message}</span>
    </div>
  );
}

export function ErrorState({ message = 'Terjadi kesalahan.', onRetry }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        color: '#EF4444',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: '#FEE2E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <AlertCircle size={28} />
      </div>
      <span style={{ fontSize: '14px', fontWeight: '500', color: '#991B1B', marginBottom: '12px' }}>
        {message}
      </span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '8px 20px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            background: 'white',
            color: '#374151',
            fontWeight: '500',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}
