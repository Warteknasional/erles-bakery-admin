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
      setError('Gagal terhubung ke server.');
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
        background:
          'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4338CA 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(99,102,241,0.3), transparent)',
          top: '-100px',
          right: '-100px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(139,92,246,0.2), transparent)',
          bottom: '-80px',
          left: '-60px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '28px',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
            }}
          >
            🍞
          </div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#1E293B',
              marginBottom: '4px',
            }}
          >
            Erles Bakery
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px' }}>
            Masuk ke panel admin
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: '#FEE2E2',
              color: '#991B1B',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '6px',
              }}
            >
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                }}
              />
              <input
                type="email"
                placeholder="admin@erlesbakery.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 44px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 150ms ease',
                  background: '#F8FAFC',
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = '#6366F1')
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = '#E2E8F0')
                }
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
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
                  color: '#94A3B8',
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 44px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 150ms ease',
                  background: '#F8FAFC',
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = '#6366F1')
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = '#E2E8F0')
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94A3B8',
                  display: 'flex',
                  padding: '2px',
                }}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading
                ? '#94A3B8'
                : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 150ms ease',
              boxShadow: loading
                ? 'none'
                : '0 4px 14px rgba(99, 102, 241, 0.35)',
            }}
            onMouseEnter={(e) => {
              if (!loading)
                e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '12px',
            color: '#94A3B8',
          }}
        >
          © 2026 Erles Bakery — Panel Admin
        </p>
      </div>
    </div>
  );
}
