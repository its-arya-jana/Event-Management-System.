import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import MembershipManagement from './components/maintenance/MembershipManagement';
import MemberList from './components/maintenance/MemberList';
import MembershipReport from './components/reports/MembershipReport';
import TransactionReport from './components/reports/TransactionReport';
import EventRegistration from './components/transactions/EventRegistration';
import PaymentProcessing from './components/transactions/PaymentProcessing';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Add global styles
  const globalStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    body {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .btn-primary {
      background: linear-gradient(45deg, #4CAF50, #45a049);
      color: white;
    }
    
    .btn-primary:hover {
      background: linear-gradient(45deg, #45a049, #3d8b40);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }
    
    .btn-secondary {
      background: linear-gradient(45deg, #2196F3, #1976D2);
      color: white;
    }
    
    .btn-secondary:hover {
      background: linear-gradient(45deg, #1976D2, #1565C0);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
    }
    
    .btn-danger {
      background: linear-gradient(45deg, #f44336, #d32f2f);
      color: white;
    }
    
    .btn-danger:hover {
      background: linear-gradient(45deg, #d32f2f, #c62828);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    }
    
    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }
    
    .header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 1rem 2rem;
    }
    
    /* Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    /* Link styles */
    a {
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: none;
    }
  `;
  
  // Inject global styles
  if (typeof document !== 'undefined') {
    let styleSheet = document.getElementById('global-styles');
    if (!styleSheet) {
      styleSheet = document.createElement('style');
      styleSheet.id = 'global-styles';
      styleSheet.innerHTML = globalStyles;
      document.head.appendChild(styleSheet);
    }
  }

  // Check session on app load
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      
      if (data.authenticated) {
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={currentUser ? <Navigate to="/dashboard" /> : <Login onLogin={setCurrentUser} />} 
          />
          <Route 
            path="/dashboard" 
            element={currentUser ? <Dashboard user={currentUser} /> : <Navigate to="/login" />} 
          />
          
          {/* Maintenance routes (Admin only) */}
          <Route 
            path="/maintenance/membership" 
            element={
              currentUser && currentUser.role === 'admin' ? 
              <MembershipManagement /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/maintenance/members" 
            element={
              currentUser && currentUser.role === 'admin' ? 
              <MemberList /> : 
              <Navigate to="/login" />
            } 
          />
          
          {/* Reports routes (Admin and User) */}
          <Route 
            path="/reports/membership" 
            element={
              currentUser ? 
              <MembershipReport /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/reports/transactions" 
            element={
              currentUser ? 
              <TransactionReport /> : 
              <Navigate to="/login" />
            } 
          />
          
          {/* Transactions routes (Admin and User) */}
          <Route 
            path="/transactions/register" 
            element={
              currentUser ? 
              <EventRegistration /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/transactions/payment" 
            element={
              currentUser ? 
              <PaymentProcessing /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;