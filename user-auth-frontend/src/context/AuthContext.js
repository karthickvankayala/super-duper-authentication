import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Export custom hook
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in

  // Load user on mount (optional: fetch from /me endpoint)
  useEffect(() => {
    axios
      .get('/api/users/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null)); // Not logged in
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(
      '/api/auth/login',
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data.user);
  };

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  const remove = async (email) => {
    await axios.put('/api/users/deactivate', {email}, { withCredentials: true });
  };

  const activate = async (email) => {
    await axios.put('/api/users/activate', {email}, { withCredentials: true });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, remove, activate }}>
      {children}
    </AuthContext.Provider>
  );
};
