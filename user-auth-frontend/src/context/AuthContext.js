import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Export custom hook
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in

  // Create axios instance with base URL from .env
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
  });

  // Load user on mount (optional: fetch from /me endpoint)
  useEffect(() => {
    api
      .get('/api/users/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null)); // Not logged in
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post('/api/auth/logout', {});
    setUser(null);
  };

  const remove = async (email) => {
    await api.put('/api/users/deactivate', { email });
  };

  const activate = async (email) => {
    await api.put('/api/users/activate', { email });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, remove, activate }}>
      {children}
    </AuthContext.Provider>
  );
};
