import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(form.email, form.password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Email atau password salah.');
      }
    } catch {
      setError('Gagal terhubung ke server backend API.');
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
        background: 'var(--color-bg, #FAF6F0)',
        padding: '24px',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--color-surface, #FFFFFF)',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border, #E8D9C5)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'var(--color-primary-subtle, #FDF0EA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '1px solid var(--color-primary-light, #F5CEBC)',
            }}
          >
            <Lock size={26} color="var(--color-primary, #D97748)" />
          </div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '700',
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text, #3D2817)',
              margin: '0 0 6px',
            }}
          >
            Erles Bakery
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary, #705847)',
              fontSize: '14px',
              margin: 0,
            }}
          >
            Masuk ke Dashboard Admin Toko
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md, 8px)',
              background: 'var(--color-danger-bg, #FEF2F2)',
              border: '1px solid var(--color-danger-border, #FECACA)',
              color: 'var(--color-danger-text, #991B1B)',
              fontSize: '13px',
              marginBottom: '20px',
              fontWeight: '500',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--color-text, #3D2817)',
                marginBottom: '6px',
              }}
            >
              Email Admin
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary, #705847)',
                }}
              />
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@erlesbakery.com"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  border: '1px solid var(--color-border, #E8D9C5)',
                  borderRadius: 'var(--radius-md, 8px)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  color: 'var(--color-text, #3D2817)',
                  background: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--color-text, #3D2817)',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary, #705847)',
                }}
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  border: '1px solid var(--color-border, #E8D9C5)',
                  borderRadius: 'var(--radius-md, 8px)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  color: 'var(--color-text, #3D2817)',
                  background: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary, #705847)',
                  padding: '4px',
                  display: 'flex',
                }}
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md, 8px)',
              border: 'none',
              background: loading ? '#CBD5E1' : 'var(--color-primary, #D97748)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background var(--transition-fast)',
              boxShadow: '0 2px 6px rgba(217, 119, 72, 0.25)',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = 'var(--color-primary-hover, #C26336)';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = 'var(--color-primary, #D97748)';
            }}
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md, 8px)',
            background: 'var(--color-bg, #FAF6F0)',
            border: '1px solid var(--color-border-subtle, #F5EDE4)',
            fontSize: '12px',
            color: 'var(--color-text-secondary, #705847)',
            lineHeight: '1.5',
          }}
        >
          <strong>Kredensial Default (Seeder):</strong><br />
          Email: <code style={{ color: 'var(--color-primary-dark, #9E471F)' }}>admin@erlesbakery.com</code><br />
          Password: <code style={{ color: 'var(--color-primary-dark, #9E471F)' }}>password</code>
        </div>
      </div>
    </div>
  );
}
