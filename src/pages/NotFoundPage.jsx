import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg, #FAF6F0)',
        padding: '24px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '440px',
          background: 'var(--color-surface, #FFFFFF)',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: '40px 32px',
          border: '1px solid var(--color-border, #E8D9C5)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          style={{
            fontSize: '84px',
            fontWeight: '800',
            fontFamily: 'var(--font-display)',
            lineHeight: '1',
            color: 'var(--color-primary, #D97748)',
            marginBottom: '16px',
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: '700',
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text, #3D2817)',
            marginBottom: '8px',
          }}
        >
          Halaman Tidak Ditemukan
        </h1>
        <p
          style={{
            color: 'var(--color-text-secondary, #705847)',
            fontSize: '14px',
            marginBottom: '28px',
            lineHeight: '1.6',
          }}
        >
          Maaf, halaman yang Anda cari tidak tersedia atau tautan sudah berpindah.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md, 8px)',
              border: '1px solid var(--color-border, #E8D9C5)',
              background: '#FFFFFF',
              color: 'var(--color-text, #3D2817)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'border-color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary, #D97748)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border, #E8D9C5)')}
          >
            <ArrowLeft size={16} /> Kembali
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md, 8px)',
              border: 'none',
              background: 'var(--color-primary, #D97748)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary-hover, #C26336)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary, #D97748)')}
          >
            <Home size={16} /> Ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
