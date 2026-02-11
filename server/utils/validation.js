const validateLoginForm = (username, password) => {
  const errors = [];
  
  if (!username || username.trim().length === 0) {
    errors.push('Username is required');
  }
  
  if (!password || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters');
  }
  
  return errors;
};

const validateAddMembership = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.phone || data.phone.trim().length === 0) {
    errors.push('Phone number is required');
  }
  
  if (!data.membershipType || !['6_months', '1_year', '2_years'].includes(data.membershipType)) {
    errors.push('Valid membership type is required (6_months, 1_year, 2_years)');
  }
  
  return errors;
};

const validateUpdateMembership = (data) => {
  const errors = [];
  
  if (!data.memberNumber || data.memberNumber.trim().length === 0) {
    errors.push('Membership number is required');
  }
  
  if (data.action && !['extend', 'cancel'].includes(data.action)) {
    errors.push('Action must be either extend or cancel');
  }
  
  return errors;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateLoginForm,
  validateAddMembership,
  validateUpdateMembership
};