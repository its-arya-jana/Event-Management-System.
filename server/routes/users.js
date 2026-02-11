const express = require('express');
const { authenticateUser, authenticateAdmin } = require('../middleware/auth');
const db = require('../config/database');
const mysql = require('mysql2/promise');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const connection = await mysql.createConnection(db);
    
    const [rows] = await connection.execute(
      'SELECT id, username, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    await connection.end();
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// Get current user info
router.get('/profile', authenticateUser, (req, res) => {
  res.json(req.user);
});

module.exports = router;