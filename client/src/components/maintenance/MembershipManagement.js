import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MembershipManagement = () => {
  const navigate = useNavigate();
  
  // State for Add Membership form
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: '6_months' // Default to 6 months
  });
  
  // State for Update Membership form
  const [updateFormData, setUpdateFormData] = useState({
    memberNumber: '',
    name: '',
    email: '',
    phone: '',
    membershipType: '',
    startDate: '',
    endDate: '',
    status: '',
    action: 'extend' // Default to extend
  });
  
  // State for form errors
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'update'

  // Handle input changes for Add Membership
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle input changes for Update Membership
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'memberNumber') {
      setUpdateFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Fetch membership details when member number is entered
      if (value.length >= 3) { // Only fetch when at least 3 characters are entered
        fetchMembershipDetails(value);
      }
    } else {
      setUpdateFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Fetch membership details by member number
  const fetchMembershipDetails = async (memberNumber) => {
    try {
      const response = await fetch(`/api/memberships/number/${memberNumber}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUpdateFormData(prev => ({
          ...prev,
          name: data.name,
          email: data.email,
          phone: data.phone,
          membershipType: data.membership_type,
          startDate: data.start_date,
          endDate: data.end_date,
          status: data.status
        }));
        setErrors({});
      } else {
        // Clear form if member not found
        setUpdateFormData(prev => ({
          ...prev,
          name: '',
          email: '',
          phone: '',
          membershipType: '',
          startDate: '',
          endDate: '',
          status: ''
        }));
      }
    } catch (error) {
      console.error('Error fetching membership details:', error);
    }
  };

  // Validate form data
  const validateForm = (formData, formType) => {
    const newErrors = {};
    
    if (formType === 'add') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone is required';
      }
      
      if (!formData.membershipType) {
        newErrors.membershipType = 'Membership type is required';
      }
    } else if (formType === 'update') {
      if (!formData.memberNumber.trim()) {
        newErrors.memberNumber = 'Membership number is required';
      }
    }
    
    return newErrors;
  };

  // Handle Add Membership submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm(addFormData, 'add');
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      // Debug: Check current session
      const sessionResponse = await fetch('/api/debug/session', {
        credentials: 'include'
      });
      const sessionData = await sessionResponse.json();
      console.log('Session data before membership add:', sessionData);
      
      const response = await fetch('/api/memberships/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(addFormData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccessMessage(result.message || 'Membership added successfully!');
        setAddFormData({
          name: '',
          email: '',
          phone: '',
          membershipType: '6_months'
        });
        setErrors({});
      } else {
        setErrors({ general: result.message || 'Failed to add membership' });
      }
    } catch (error) {
      console.error('Error adding membership:', error);
      setErrors({ general: 'An error occurred while adding membership' });
    }
  };

  // Handle Update Membership submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm(updateFormData, 'update');
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const response = await fetch(`/api/memberships/update/${updateFormData.memberNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: updateFormData.action
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccessMessage(result.message || 'Membership updated successfully!');
        setUpdateFormData({
          memberNumber: '',
          name: '',
          email: '',
          phone: '',
          membershipType: '',
          startDate: '',
          endDate: '',
          status: '',
          action: 'extend'
        });
        setErrors({});
      } else {
        setErrors({ general: result.message || 'Failed to update membership' });
      }
    } catch (error) {
      console.error('Error updating membership:', error);
      setErrors({ general: 'An error occurred while updating membership' });
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Membership Management</h1>
      
      {/* Tab Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('add')}
          style={{
            marginRight: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'add' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'add' ? 'white' : '#495057',
            border: '1px solid #dee2e6',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer'
          }}
        >
          Add Membership
        </button>
        <button
          onClick={() => setActiveTab('update')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'update' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'update' ? 'white' : '#495057',
            border: '1px solid #dee2e6',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer'
          }}
        >
          Update Membership
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          color: 'green',
          padding: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid green',
          borderRadius: '4px',
          backgroundColor: '#d4edda'
        }}>
          {successMessage}
        </div>
      )}

      {/* Errors */}
      {errors.general && (
        <div style={{
          color: 'red',
          padding: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid red',
          borderRadius: '4px',
          backgroundColor: '#f8d7da'
        }}>
          {errors.general}
        </div>
      )}

      {/* Add Membership Form */}
      {activeTab === 'add' && (
        <form onSubmit={handleAddSubmit} style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Add New Membership</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={addFormData.name}
              onChange={handleAddChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.name ? '1px solid red' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            {errors.name && <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.name}</div>}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={addFormData.email}
              onChange={handleAddChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.email ? '1px solid red' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            {errors.email && <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.email}</div>}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={addFormData.phone}
              onChange={handleAddChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.phone ? '1px solid red' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            {errors.phone && <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.phone}</div>}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Membership Duration * (Default: 6 months)
            </label>
            <div style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '2px solid #007bff', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
              {[
                { value: '6_months', label: '6 Months' },
                { value: '1_year', label: '1 Year' },
                { value: '2_years', label: '2 Years' }
              ].map(option => (
                <label key={option.value} style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  <input
                    type="radio"
                    name="membershipType"
                    value={option.value}
                    checked={addFormData.membershipType === option.value}
                    onChange={handleAddChange}
                    style={{ 
                      marginRight: '0.5rem',
                      transform: 'scale(1.2)',
                      accentColor: '#007bff'
                    }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {errors.membershipType && <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.membershipType}</div>}
          </div>
          
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add Membership
          </button>
        </form>
      )}

      {/* Update Membership Form */}
      {activeTab === 'update' && (
        <form onSubmit={handleUpdateSubmit} style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Update Membership</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="memberNumber" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Membership Number * (Enter to auto-populate)
            </label>
            <input
              type="text"
              id="memberNumber"
              name="memberNumber"
              value={updateFormData.memberNumber}
              onChange={handleUpdateChange}
              required
              placeholder="Enter membership number to auto-populate fields"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.memberNumber ? '1px solid red' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            {errors.memberNumber && <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.memberNumber}</div>}
          </div>
          
          {/* Display populated fields */}
          {updateFormData.name && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={updateFormData.name}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={updateFormData.email}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={updateFormData.phone}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Membership Type
                </label>
                <input
                  type="text"
                  value={updateFormData.membershipType.replace('_', ' ').toUpperCase()}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={updateFormData.startDate.split('T')[0]}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={updateFormData.endDate.split('T')[0]}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Status
                </label>
                <input
                  type="text"
                  value={updateFormData.status}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: updateFormData.status === 'active' ? '#d4edda' : 
                                   updateFormData.status === 'cancelled' ? '#f8d7da' : '#fff3cd'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  Action * (Default: Extend 6 months)
                </label>
                <div style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '2px solid #28a745', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>
                    <input
                      type="radio"
                      name="action"
                      value="extend"
                      checked={updateFormData.action === 'extend'}
                      onChange={handleUpdateChange}
                      style={{ 
                        marginRight: '0.5rem',
                        transform: 'scale(1.2)',
                        accentColor: '#28a745'
                      }}
                    />
                    Extend Membership (6 months)
                  </label>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>
                    <input
                      type="radio"
                      name="action"
                      value="cancel"
                      checked={updateFormData.action === 'cancel'}
                      onChange={handleUpdateChange}
                      style={{ 
                        marginRight: '0.5rem',
                        transform: 'scale(1.2)',
                        accentColor: '#dc3545'
                      }}
                    />
                    Cancel Membership
                  </label>
                </div>
              </div>
            </>
          )}
          
          <button
            type="submit"
            disabled={!updateFormData.memberNumber}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !updateFormData.memberNumber ? 'not-allowed' : 'pointer'
            }}
          >
            Update Membership
          </button>
        </form>
      )}
    </div>
  );
};

export default MembershipManagement;