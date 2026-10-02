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
        background: 'linear-gradient(135deg, #F1F5F9, #E2E8F0)',
        padding: '20px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div
          style={{
            fontSize: '120px',
            fontWeight: '800',
            lineHeight: '1',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#1E293B',
            marginBottom: '8px',
          }}
        >
          Halaman Tidak Ditemukan
        </h1>
        <p
          style={{
            color: '#64748B',
            fontSize: '15px',
            marginBottom: '32px',
            lineHeight: '1.6',
          }}
        >
          Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.
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
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              border: '2px solid #E2E8F0',
              background: 'white',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6366F1';
              e.currentTarget.style.color = '#6366F1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.color = '#374151';
            }}
          >
            <ArrowLeft size={18} /> Kembali
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'translateY(-1px)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = 'translateY(0)')
            }
          >
            <Home size={18} /> Ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
