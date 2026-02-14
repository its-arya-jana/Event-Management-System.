import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  // Don't show navbar on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <header className="header" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem 2rem',
      marginBottom: '2rem',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(45deg, #4CAF50, #45a049)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          🔧
        </div>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: '#333',
            fontSize: '1.8rem'
          }}>
            Event Management System
          </h1>
          <p style={{ 
            margin: 0, 
            color: '#666',
            fontSize: '0.9rem'
          }}>
            Dashboard Navigation
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link 
          to="/chart" 
          className="btn btn-secondary"
          style={{ 
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            background: 'linear-gradient(45deg, #2196F3, #1976D2)',
            color: 'white'
          }}
        >
          Flow Chart
        </Link>
        
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(76, 175, 80, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              color: '#4CAF50',
              fontWeight: '600'
            }}>
              👤 {user.username} ({user.role})
            </div>
            <button 
              onClick={onLogout}
              className="btn btn-danger"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;