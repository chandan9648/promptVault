import React, { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext';
import { api } from '../lib/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('pv_user');
    return raw ? JSON.parse(raw) : null;
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
      setUser(user);
      return { ok: true };
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
      setUser(user);
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
