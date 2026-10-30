import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import FormField from '../components/common/FormField';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [rateLimitError, setRateLimitError] = useState('');

  // If already logged in, navigate away
  const from = location.state?.from?.pathname || '/';
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});
    setRateLimitError('');

    if (!email.trim() || !password) {
      setGeneralError('Harap isi email dan password.');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      showToast('Login berhasil! Selamat datang di Erles Bakery.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 422) {
          setGeneralError(data.message || 'Validasi data gagal.');
          if (data.errors) {
            setFieldErrors(data.errors);
          }
        } else if (status === 429) {
          setRateLimitError(
            data.message || 'Terlalu banyak percobaan login. Silakan tunggu 1 menit lalu coba kembali.'
          );
        } else if (status === 401) {
          setGeneralError(data.message || 'Email atau password yang Anda masukkan salah.');
        } else {
          setGeneralError(data.message || `Terjadi kesalahan dari server backend (Kode: ${status}).`);
        }
      } else if (err.request) {
        setGeneralError('Tidak dapat terhubung ke server backend API (http://localhost:8000). Pastikan backend aktif.');
      } else {
        setGeneralError('Terjadi kesalahan saat memproses login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F1610',
        padding: '24px 16px',
        backgroundImage: 'radial-gradient(ellipse at 50% 20%, rgba(194, 94, 52, 0.18) 0%, transparent 65%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '36px 32px',
          border: '1px solid #E6DED4',
          boxShadow: '0 20px 45px rgba(15, 10, 7, 0.35)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: '#2D2017',
              border: '1px solid #3F2E22',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              marginBottom: '14px',
            }}
          >
            🍞
          </div>
          <h1 style={{ fontSize: '21px', fontWeight: '700', color: '#241B14', margin: 0, letterSpacing: '-0.02em' }}>
            Erles Bakery
          </h1>
          <p style={{ fontSize: '12.5px', color: '#8C7A6B', marginTop: '4px' }}>
            Bakehouse & Kitchen • Portal Administrasi
          </p>
        </div>

        {/* 429 Rate Limit Alert */}
        {rateLimitError && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              color: '#92400E',
              fontSize: '12.5px',
              marginBottom: '20px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>Akses Dibatasi (429)</div>
              <div>{rateLimitError}</div>
            </div>
          </div>
        )}

        {/* General Error Alert */}
        {generalError && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              fontSize: '12.5px',
              marginBottom: '20px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{generalError}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <FormField
            label="Email Akun"
            required
            error={fieldErrors.email}
            htmlFor="email"
          >
            <div style={{ position: 'relative' }}>
              <Mail
                size={17}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9C8B7E',
                }}
              />
              <input
                id="email"
                type="email"
                placeholder="admin@erlesbakery.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: fieldErrors.email ? '1px solid #DC2626' : '1px solid #E6DED4',
                  fontSize: '13.5px',
                  color: '#241B14',
                  backgroundColor: '#FAF7F2',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </FormField>

          <FormField
            label="Kata Sandi"
            required
            error={fieldErrors.password}
            htmlFor="password"
          >
            <div style={{ position: 'relative' }}>
              <Lock
                size={17}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9C8B7E',
                }}
              />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: fieldErrors.password ? '1px solid #DC2626' : '1px solid #E6DED4',
                  fontSize: '13.5px',
                  color: '#241B14',
                  backgroundColor: '#FAF7F2',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </FormField>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#C25E34',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
              boxShadow: '0 2px 4px rgba(194, 94, 52, 0.25)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#A84A22'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#C25E34'; }}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    borderTopColor: '#FFFFFF',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                  }}
                />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Sistem</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #F3EDE6',
            textAlign: 'center',
            fontSize: '12px',
            color: '#8C7A6B',
          }}
        >
          Masuk dengan akun admin atau kasir yang terdaftar di database Laravel.
        </div>
      </div>
    </div>
  );
}
