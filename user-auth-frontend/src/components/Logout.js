import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout().then(() => navigate('/'));
  }, [logout, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                alignItems: 'center', minHeight: '100vh', textAlign: 'center' }}>
      
      <h2>Logging out...</h2>

    </div>
  )
}

export default Logout;
