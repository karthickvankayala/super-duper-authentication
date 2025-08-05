import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function UserSearch() {
  const { user } = useAuth();

  const [query, setQuery] = useState(user?.role === 'admin' ? '' : user?.email || '');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const handleSearch = () => {
    if (!query && (user.role !== 'admin' || user.role !== 'audit')) {
      setError('Non-admins must enter their email.');
      return;
    }

    setLoading(true);
    setError('');

    axios
      .get(`/api/users?email=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, {
        withCredentials: true,
      })
      .then(res => {
        setUsers(res.data.users);
        setTotal(res.data.total);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching users.');
        setUsers([]);
        setTotal(0);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (query || user.role === 'admin' || user.role === 'audit') {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const resetSearch = () => {
    setQuery(user?.role === 'admin' ? '' : user?.email || '');
    setUsers([]);
    setTotal(0);
    setPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                alignItems: 'center', minHeight: '100vh', textAlign: 'center' }}>
      
      <h3>User Search</h3>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter email to search"
          disabled={(user.role !== 'admin' && user.role !== 'audit')}
        />
        <button
          onClick={() => {
            setPage(1);
            handleSearch();
          }}
          style={{ marginLeft: '0.5rem' }}
        >
          Search
        </button>
        <button onClick={resetSearch} style={{ marginLeft: '0.5rem' }}>
          Clear
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : users.length > 0 ? (
        <>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>
              Users per page:{' '}
              <select
                value={limit}
                onChange={e => {
                  setLimit(parseInt(e.target.value));
                  setPage(1);
                }}
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </label>
          </div>

          <ul>
            {users.map(u => (
              <li key={u.id}>
                {u.name} ({u.email}) — {u.job_title} — DOB: {u.dob}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
              Prev
            </button>
            <span style={{ margin: '0 1rem' }}>
              Page {page} of {totalPages}
            </span>
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      ) : (
        query && <p>No users found.</p>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Link to="/">⬅ Back to Home</Link>
      </div>
    </div>
  );
}

export default UserSearch;
