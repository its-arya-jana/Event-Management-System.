const express = require('express');
const { authenticateUser, authenticateAdmin } = require('../middleware/auth');
const db = require('../config/database');
const mysql = require('mysql2/promise');

const router = express.Router();

// Get all transactions (admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const connection = await mysql.createConnection(db);
    
    const [rows] = await connection.execute(
      'SELECT t.*, u.username FROM transactions t LEFT JOIN users u ON t.user_id = u.id ORDER BY t.date DESC'
    );
    
    await connection.end();
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error while fetching transactions' });
  }
});

// Get user transactions (admin and user)
router.get('/user/:userId', authenticateUser, async (req, res) => {
  try {
    // Allow admin to view any user's transactions, regular user can only view own
    if (req.user.role !== 'admin' && parseInt(req.params.userId) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: Cannot view other users\' transactions' });
    }
    
    const connection = await mysql.createConnection(db);
    
    const [rows] = await connection.execute(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
      [req.params.userId]
    );
    
    await connection.end();
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    res.status(500).json({ message: 'Server error while fetching user transactions' });
  }
});

// Add new transaction (admin and user)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { transaction_type, amount, description } = req.body;
    
    if (!transaction_type || !amount || !description) {
      return res.status(400).json({ message: 'Transaction type, amount, and description are required' });
    }
    
    const connection = await mysql.createConnection(db);
    
    const [result] = await connection.execute(
      'INSERT INTO transactions (user_id, transaction_type, amount, description, date, status) VALUES (?, ?, ?, ?, NOW(), ?)',
      [req.user.id, transaction_type, amount, description, 'completed']
    );
    
    await connection.end();
    
    res.json({
      id: result.insertId,
      user_id: req.user.id,
      transaction_type,
      amount,
      description,
      date: new Date(),
      status: 'completed',
      message: 'Transaction added successfully'
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ message: 'Server error while adding transaction' });
  }
});

module.exports = router;