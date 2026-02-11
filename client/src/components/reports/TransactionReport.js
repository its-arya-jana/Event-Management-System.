import React, { useState, useEffect } from 'react';

const TransactionReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setCurrentUser(data.user);
        fetchTransactions(data.user);
      }
    } catch (error) {
      console.error('Error fetching user session:', error);
    }
  };

  const fetchTransactions = async (user) => {
    try {
      setLoading(true);
      let url;
      
      if (user.role === 'admin') {
        url = '/api/transactions'; // Admin can see all transactions
      } else {
        url = `/api/transactions/user/${user.id}`; // Regular user sees only their transactions
      }
      
      const response = await fetch(url, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('An error occurred while fetching transactions');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Transaction Report</h1>
        <p>Loading report...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Transaction Report</h1>
      
      {error && (
        <div style={{
          color: 'red',
          padding: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid red',
          borderRadius: '4px',
          backgroundColor: '#f8d7da'
        }}>
          {error}
        </div>
      )}
      
      {/* Statistics Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <h3>Total Transactions</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalTransactions}</p>
        </div>
        <div style={{ 
          backgroundColor: '#cce5ff', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '1px solid #b3d9ff',
          textAlign: 'center'
        }}>
          <h3>Total Amount</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${totalAmount.toFixed(2)}</p>
        </div>
        <div style={{ 
          backgroundColor: '#d4edda', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '1px solid #c3e6cb',
          textAlign: 'center'
        }}>
          <h3>Completed</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{completedTransactions}</p>
        </div>
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '1px solid #ffeaa7',
          textAlign: 'center'
        }}>
          <h3>Pending</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pendingTransactions}</p>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '1rem'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f8f9fa',
              borderBottom: '2px solid #dee2e6'
            }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>ID</th>
              {currentUser?.role === 'admin' && (
                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>User</th>
              )}
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Type</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Amount</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Description</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Date</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map(transaction => (
                <tr key={transaction.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{transaction.id}</td>
                  {currentUser?.role === 'admin' && (
                    <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{transaction.username || transaction.user_id}</td>
                  )}
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{transaction.transaction_type}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>${parseFloat(transaction.amount).toFixed(2)}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{transaction.description}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{new Date(transaction.date).toLocaleString()}</td>
                  <td style={{ 
                    padding: '0.75rem', 
                    border: '1px solid #dee2e6',
                    backgroundColor: transaction.status === 'completed' ? '#d4edda' : 
                                   transaction.status === 'pending' ? '#fff3cd' : '#f8d7da'
                  }}>
                    {transaction.status.toUpperCase()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={currentUser?.role === 'admin' ? 7 : 6} style={{ textAlign: 'center', padding: '1rem', border: '1px solid #dee2e6' }}>
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionReport;