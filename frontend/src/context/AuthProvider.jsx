import React, { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext';
import { api } from '../lib/api';

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('pv_user');
    const parsed = raw ? JSON.parse(raw) : null;
    const token = localStorage.getItem('pv_token');
    if (parsed && !parsed.role && token) {
      const payload = decodeJwtPayload(token);
      if (payload?.role) return { ...parsed, role: payload.role };
    }
    return parsed;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem('pv_user', JSON.stringify(user));
    else localStorage.removeItem('pv_user');
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { token, user } = await api.login({ email, password });
      api.setToken(token);
      const payload = decodeJwtPayload(token);
      const enrichedUser = user?.role || !payload?.role ? user : { ...user, role: payload.role };
      setUser(enrichedUser);
      return { ok: true, user: enrichedUser };
    } catch (e) {
      return { ok: false, message: e?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { token, user } = await api.register({ name, email, password });
      api.setToken(token);
      const payload = decodeJwtPayload(token);
      const enrichedUser = user?.role || !payload?.role ? user : { ...user, role: payload.role };
      setUser(enrichedUser);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook moved to useAuth.js to satisfy Fast Refresh rule
