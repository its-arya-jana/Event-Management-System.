import React, { useState } from 'react';

const PaymentProcessing = () => {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    description: '',
    paymentMethod: 'credit_card'
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!paymentData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Submit transaction
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          transaction_type: 'payment',
          amount: paymentData.amount,
          description: paymentData.description
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccessMessage('Payment processed successfully! Transaction ID: ' + result.id);
        // Reset form
        setPaymentData({
          amount: '',
          description: '',
          paymentMethod: 'credit_card'
        });
        setErrors({});
      } else {
        setErrors({ general: result.message || 'Payment processing failed' });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setErrors({ general: 'An error occurred during payment processing' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Payment Processing</h1>
      
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

      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <h2>Process Payment</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="amount" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Amount *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              min="0.01"
              step="0.01"
              value={paymentData.amount}
              onChange={handleInputChange}
              required
              placeholder="0.00"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.amount ? '1px solid red' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            {errors.amount && <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.amount}</div>}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={paymentData.description}
              onChange={handleInputChange}
              required
              rows="3"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.description ? '1px solid red' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            ></textarea>
            {errors.description && <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.description}</div>}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Payment Method
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[
                { value: 'credit_card', label: 'Credit Card' },
                { value: 'debit_card', label: 'Debit Card' },
                { value: 'paypal', label: 'PayPal' },
                { value: 'bank_transfer', label: 'Bank Transfer' }
              ].map(method => (
                <label key={method.value} style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentData.paymentMethod === method.value}
                    onChange={handleInputChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {method.label}
                </label>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing...' : 'Process Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentProcessing;