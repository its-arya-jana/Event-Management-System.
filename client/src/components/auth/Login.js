import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for session cookies
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Debug: Check session after login
        const sessionCheck = await fetch('/api/debug/session', {
          credentials: 'include'
        });
        const sessionData = await sessionCheck.json();
        console.log('Session after login:', sessionData);
        
        onLogin(data.user);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1rem 2rem',
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
              Login Portal
            </p>
          </div>
        </div>
        <a 
          href="/chart" 
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
        </a>
      </div>
      <div style={{ 
        flex: 1,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '1rem'
      }}>
      <form onSubmit={handleSubmit} className="card" style={{
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center',
        animation: 'fadeInUp 0.6s ease-out'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'linear-gradient(45deg, #4CAF50, #45a049)',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            EMS
          </div>
          <h2 style={{ 
            color: '#333', 
            marginBottom: '0.5rem',
            fontSize: '1.8rem'
          }}>
            Event Management System
          </h2>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Professional Event Management Platform
          </p>
        </div>
        
        {error && (
          <div style={{
            color: '#d32f2f',
            padding: '1rem',
            marginBottom: '1.5rem',
            border: '1px solid #ffcdd2',
            borderRadius: '8px',
            backgroundColor: '#ffebee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="username" style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            color: '#555',
            fontWeight: '600',
            textAlign: 'left'
          }}>
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
            placeholder="Enter your username"
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="password" style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            color: '#555',
            fontWeight: '600',
            textAlign: 'left'
          }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
            placeholder="Enter your password"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary ${loading ? 'disabled' : ''}`}
          style={{
            width: '100%',
            fontSize: '1.1rem',
            padding: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #ffffff40',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Logging in...
            </div>
          ) : 'Login to Dashboard'}
        </button>
      </form>
      </div>
    </div>
  );
};

export default Login;