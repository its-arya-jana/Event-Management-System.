import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '0 2rem', marginBottom: '2rem' }}>
        <h1 style={{ 
          margin: 0, 
          color: '#333',
          fontSize: '1.8rem',
          textAlign: 'center'
        }}>
          Dashboard
        </h1>
        <p style={{ 
          margin: '0.5rem 0 0', 
          color: '#666',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          Event Management System
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '2rem',
        padding: '0 2rem 2rem'
      }}>
        {/* Maintenance Module (Admin only) */}
        {user.role === 'admin' && (
          <div className="card" style={{
            animation: 'fadeInUp 0.6s ease-out 0.1s both'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(45deg, #FF9800, #F57C00)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                marginRight: '1rem'
              }}>
                🔧
              </div>
              <h2 style={{ margin: 0, color: '#333' }}>Maintenance</h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link 
                  to="/maintenance/membership" 
                  className="btn btn-secondary"
                  style={{ 
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none'
                  }}
                >
                  <span>📝</span>
                  Add/Update Membership
                </Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link 
                  to="/maintenance/members" 
                  className="btn btn-secondary"
                  style={{ 
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none'
                  }}
                >
                  <span>📋</span>
                  Member List
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Reports Module (All users) */}
        <div className="card" style={{
          animation: 'fadeInUp 0.6s ease-out 0.2s both'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(45deg, #2196F3, #1976D2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              marginRight: '1rem'
            }}>
              📊
            </div>
            <h2 style={{ margin: 0, color: '#333' }}>Reports</h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.75rem' }}>
              <Link 
                to="/reports/membership" 
                className="btn btn-secondary"
                style={{ 
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                <span>👥</span>
                Membership Report
              </Link>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <Link 
                to="/reports/transactions" 
                className="btn btn-secondary"
                style={{ 
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                <span>💰</span>
                Transaction Report
              </Link>
            </li>
          </ul>
        </div>

        {/* Transactions Module (All users) */}
        <div className="card" style={{
          animation: 'fadeInUp 0.6s ease-out 0.3s both'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(45deg, #4CAF50, #45a049)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              marginRight: '1rem'
            }}>
              💳
            </div>
            <h2 style={{ margin: 0, color: '#333' }}>Transactions</h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.75rem' }}>
              <Link 
                to="/transactions/register" 
                className="btn btn-secondary"
                style={{ 
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                <span>📅</span>
                Event Registration
              </Link>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <Link 
                to="/transactions/payment" 
                className="btn btn-secondary"
                style={{ 
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                <span>💵</span>
                Payment Processing
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;