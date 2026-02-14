import React from 'react';
import { Link } from 'react-router-dom';

const ChartPage = () => {
  return (
    <div className="app-container" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '2rem' }}>System Flow Chart</h1>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555' }}>
            This page displays the navigation chart for the Event Management System.
          </p>
        </div>

        <div style={{ 
          border: '2px dashed #ccc', 
          borderRadius: '12px', 
          padding: '3rem', 
          backgroundColor: '#f9f9f9',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h2 style={{ color: '#333', marginBottom: '1rem' }}>System Navigation Flow</h2>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: '2rem' }}>
            Flow chart visualization of the Event Management System
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem', 
            width: '100%',
            marginTop: '2rem'
          }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '8px',
              border: '1px solid #bbdefb'
            }}>
              <strong>Login</strong><br />
              <small>/login</small>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#e8f5e9', 
              borderRadius: '8px',
              border: '1px solid #c8e6c9'
            }}>
              <strong>Dashboard</strong><br />
              <small>/dashboard</small>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#fff3e0', 
              borderRadius: '8px',
              border: '1px solid #ffe0b2'
            }}>
              <strong>Maintenance</strong><br />
              <small>/maintenance/*</small>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#fce4ec', 
              borderRadius: '8px',
              border: '1px solid #f8bbd0'
            }}>
              <strong>Reports</strong><br />
              <small>/reports/*</small>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f3e5f5', 
              borderRadius: '8px',
              border: '1px solid #e1bee7'
            }}>
              <strong>Transactions</strong><br />
              <small>/transactions/*</small>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;