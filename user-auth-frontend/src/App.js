import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import Home from './components/Home';
import UserSearch from './components/UserSearch';
import UserList from './components/UserList';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/logout" element={user ? <Logout /> : <Navigate to="/" />} />
        <Route 
          path="/search" 
          element={(user?.role === 'admin') || (user?.role === 'audit')  ? <UserSearch /> : <Navigate to="/" />} />
        <Route
          path="/users"
          element={(user?.role === 'admin') || (user?.role === 'audit') ? <UserList /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
