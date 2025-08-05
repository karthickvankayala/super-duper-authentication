import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('/api/users', { withCredentials: true })
      .then(res => setUsers(res.data.users))
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('An error occurred while fetching users.');
        }
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                alignItems: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <h3>All Users</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email}) — {user.job_title} — DOB: {user.dob}
          </li>
        ))}
      </ul>
      <Link to="/">⬅ Back to Home</Link>
    </div>
    
  );
}

export default UserList;
