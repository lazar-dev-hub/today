import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import api, { me } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      if (!token) {
        setUser(null);
        return;
      }
      const res = await me();
      setUser(res.user);
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await bootstrap();
      } catch {
        // ignore
      }
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [bootstrap]);


  const login = useCallback(async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    const nextToken = res.data.token;
    localStorage.setItem('token', nextToken);
    setToken(nextToken);
    const meRes = await api.get('/auth/me', { headers: { Authorization: `Bearer ${nextToken}` } });
    setUser(meRes.data.user);
    return meRes.data.user;
  }, []);

  const register = useCallback(async (payload) => {
    await api.post('/auth/register', payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ token, user, loading, login, register, logout, setUser }), [token, user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

