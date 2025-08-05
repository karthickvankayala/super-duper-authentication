import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
  const { user, login, remove, activate } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [deleteEmail, setDeleteEmail] = useState('');
  const [activateEmail, setActivateEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setError('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleDelete = async e => {
    e.preventDefault();
    try {
      await remove(deleteEmail);
      setError('');
      setDeleteEmail('');
    } catch (err) {
      const message = err.response?.data?.message || 'Account could not be deactivated';
      setError(message);
      setDeleteEmail('');
    }
  };

  const handleActivate = async e => {
    e.preventDefault();
    try {
      await activate(activateEmail);
      setError('');
      setActivateEmail('');
    } catch (err) {
      const message = err.response?.data?.message || 'Account could not be deactivated';
      setError(message);
      setActivateEmail('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                alignItems: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <h2>Welcome to ACME User Portal</h2>

      {!user ? (
        <>
          <h3>Already with us?</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            /><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            /><br />
            <button type="submit">Login</button>
          </form>
          <br />
          <p><Link to="/register"><h3>Register here</h3></Link> 
          (if you don't have an account)</p>
        </>
      ) : (
        <>
          <p>Hello, {user.email} ({user.role})</p>
          {(user.role === 'admin' || user.role === 'audit') && (
            <>
              <Link to="/search">🔍 Search Users</Link>
              <br />
              <Link to="/users">📋 View All Users</Link>
              <br />
            </>
          )}
          {user.role === 'admin' && (
            <>
              <form onSubmit={handleDelete}>
                <input
                  type="email"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  placeholder="Email"
                  required
                  disabled={user.role !== 'admin'}
                />
                <button type="submit">Deactivate</button>
              </form>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <br />
              <form onSubmit={handleActivate}>
                <input
                  type="email"
                  value={activateEmail}
                  onChange={(e) => setActivateEmail(e.target.value)}
                  placeholder="Email"
                  required
                  disabled={user.role !== 'admin'}
                />
                <button type="submit">Activate</button>
              </form>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <br />
            </>
          )}
          <Link to="/logout">Logout</Link>
        </>
      )}
    </div>
  );
}

export default Home;