import React, { useState, useEffect } from 'react';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Member List</h1>
        <p>Loading members...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Member List</h1>
      
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
            {members.length > 0 ? (
              members.map(member => (
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
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;