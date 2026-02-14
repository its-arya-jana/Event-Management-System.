import React, { useState, useEffect } from 'react';

const EventRegistration = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    tickets: 1
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // In a real application, this would fetch from the backend
      // For now, we'll simulate some events
      const mockEvents = [
        { id: 1, title: 'Annual Conference', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), location: 'Convention Center', capacity: 500 },
        { id: 2, title: 'Music Festival', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), location: 'Central Park', capacity: 1000 },
        { id: 3, title: 'Tech Workshop', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), location: 'Tech Hub', capacity: 100 }
      ];
      
      setEvents(mockEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
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

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!registrationData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!registrationData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registrationData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!registrationData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!selectedEvent) {
      newErrors.event = 'Please select an event';
    }
    
    if (parseInt(registrationData.tickets) <= 0) {
      newErrors.tickets = 'Number of tickets must be greater than 0';
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
    
    try {
      // Find selected event details
      const selectedEventObj = events.find(event => event.id == selectedEvent);
      
      // Create transaction data
      const transactionData = {
        transaction_type: 'event_registration',
        amount: (selectedEventObj.id * 10 * registrationData.tickets).toString(), // Mock calculation
        description: `Registration for ${selectedEventObj.title} (${registrationData.tickets} ticket${registrationData.tickets > 1 ? 's' : ''})`
      };
      
      // Submit transaction
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(transactionData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccessMessage('Registration completed successfully! Transaction ID: ' + result.id);
        // Reset form
        setRegistrationData({
          name: '',
          email: '',
          phone: '',
          tickets: 1
        });
        setSelectedEvent('');
        setErrors({});
      } else {
        setErrors({ general: result.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      setErrors({ general: 'An error occurred during registration' });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Event Registration</h1>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <h1>Event Registration</h1>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Event Selection */}
        <div>
          <h2>Select an Event</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="event" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Available Events
            </label>
            <select
              id="event"
              value={selectedEvent}
              onChange={handleEventChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.event ? '1px solid red' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <option value="">-- Select an Event --</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title} - {new Date(event.date).toLocaleDateString()} - {event.location}
                </option>
              ))}
            </select>
            {errors.event && <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.event}</div>}
          </div>
          
          {selectedEvent && (
            <div style={{ 
              padding: '1rem', 
              border: '1px solid #ddd', 
              borderRadius: '4px', 
              backgroundColor: '#f8f9fa' 
            }}>
              <h3>Selected Event Details:</h3>
              {(() => {
                const event = events.find(e => e.id == selectedEvent);
                return event ? (
                  <div>
                    <p><strong>Title:</strong> {event.title}</p>
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Capacity:</strong> {event.capacity} people</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
        
        {/* Registration Form */}
        <div>
          <h2>Registration Details</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={registrationData.name}
                onChange={handleInputChange}
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
                value={registrationData.email}
                onChange={handleInputChange}
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
                value={registrationData.phone}
                onChange={handleInputChange}
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
              <label htmlFor="tickets" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Number of Tickets *
              </label>
              <input
                type="number"
                id="tickets"
                name="tickets"
                min="1"
                value={registrationData.tickets}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: errors.tickets ? '1px solid red' : '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              {errors.tickets && <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.tickets}</div>}
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
              Register for Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;