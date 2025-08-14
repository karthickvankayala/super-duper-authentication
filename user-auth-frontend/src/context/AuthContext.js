import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

const initialBase = '/api'

// One axios instance for the app
const api = axios.create({
  baseURL: initialBase,
  withCredentials: true, // send/receive cookies
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load current user (cookie-based)
  useEffect(() => {
    api
      .get('/users/me')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.user) {
      setUser(res.data.user);
    } else {
      const me = await api.get('/users/me');
      setUser(me.data);
    }
  };

  const logout = async () => {
    await api.post('/auth/logout', {});
    setUser(null);
  };

  const remove = async (email) => {
    await api.put('/users/deactivate', { email });
    if (user?.email === email) setUser(null);
  };

  const activate = async (email) => {
    await api.put('/users/activate', { email });
  };

  const value = useMemo(
    () => ({ user, setUser, login, logout, remove, activate, api }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
