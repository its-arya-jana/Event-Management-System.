import React, { useState, useEffect } from 'react';

const MembershipReport = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, expired, cancelled

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/memberships', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        setError('Failed to fetch members');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('An error occurred while fetching members');
    } finally {
      setLoading(false);
    }
  };

  // Filter members based on selected filter
  const filteredMembers = members.filter(member => {
    if (filter === 'all') return true;
    return member.status === filter;
  });

  // Calculate statistics
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const expiredMembers = members.filter(m => m.status === 'expired').length;
  const cancelledMembers = members.filter(m => m.status === 'cancelled').length;

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Membership Report</h1>
        <p>Loading report...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Membership Report</h1>
      
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
          <h3>Total Members</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalMembers}</p>
        </div>
        <div style={{ 
          backgroundColor: '#d4edda', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '1px solid #c3e6cb',
          textAlign: 'center'
        }}>
          <h3>Active Members</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{activeMembers}</p>
        </div>
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '1px solid #ffeaa7',
          textAlign: 'center'
        }}>
          <h3>Expired Members</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{expiredMembers}</p>
        </div>
        <div style={{ 
          backgroundColor: '#f8d7da', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '1px solid #f5c6cb',
          textAlign: 'center'
        }}>
          <h3>Cancelled Members</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{cancelledMembers}</p>
        </div>
      </div>
      
      {/* Filter Controls */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="filter" style={{ marginRight: '1rem' }}>
          Filter by status:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        >
          <option value="all">All Members</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      {/* Members Table */}
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
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Member Number</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Name</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Email</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Phone</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Membership Type</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Start Date</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>End Date</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <tr key={member.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{member.member_number}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{member.name}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{member.email}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{member.phone}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{member.membership_type.replace('_', ' ').toUpperCase()}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{new Date(member.start_date).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{new Date(member.end_date).toLocaleDateString()}</td>
                  <td style={{ 
                    padding: '0.75rem', 
                    border: '1px solid #dee2e6',
                    backgroundColor: member.status === 'active' ? '#d4edda' : 
                                   member.status === 'cancelled' ? '#f8d7da' : '#fff3cd'
                  }}>
                    {member.status.toUpperCase()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '1rem', border: '1px solid #dee2e6' }}>
                  No members found matching the filter criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembershipReport;