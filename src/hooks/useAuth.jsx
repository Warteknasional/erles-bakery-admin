import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true); // true while checking initial auth

  // On mount: if token exists, verify it by fetching profile
  useEffect(() => {
    if (token) {
      authService
        .me()
        .then((res) => {
          if (res.success) {
            setUser(res.data);
          } else {
            // Token invalid
            logout();
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const logout = useCallback(async () => {
    try {
      if (token) await authService.logout();
    } catch {
      // ignore errors on logout
    } finally {
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    }
  }, [token]);

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
