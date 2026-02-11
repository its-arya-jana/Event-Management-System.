const express = require('express');
const bcrypt = require('bcryptjs');
const { validateLoginForm } = require('../utils/validation');
const db = require('../config/database');
const mysql = require('mysql2/promise');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    const errors = validateLoginForm(username, password);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Connect to database
    const connection = await mysql.createConnection(db);
    
    // Query user from database
    const [rows] = await connection.execute(
      'SELECT id, username, password, role FROM users WHERE username = ?',
      [username]
    );
    
    await connection.end();
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = rows[0];
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Store user in session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Check session route
router.get('/session', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ user: req.session.user, authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;