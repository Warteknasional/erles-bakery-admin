import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) await authService.logout();
    } catch {
      // ignore errors on logout
    } finally {
      clearAuth();
    }
  }, [token, clearAuth]);

  // On mount: if token exists, verify it by fetching profile
  useEffect(() => {
    let mounted = true;
    if (token) {
      authService
        .me()
        .then((res) => {
          if (!mounted) return;
          if (res.success) {
            setUser(res.data);
          } else {
            clearAuth();
          }
        })
        .catch(() => {
          if (mounted) clearAuth();
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [token, clearAuth]);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success) {
      const { user: userData, token: newToken } = res.data;
      localStorage.setItem('auth_token', newToken);
      setToken(newToken);
      setUser(userData);
    }
    return res;
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
