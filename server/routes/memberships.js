const express = require('express');
const { authenticateUser, authenticateAdmin } = require('../middleware/auth');
const { validateAddMembership, validateUpdateMembership } = require('../utils/validation');
const db = require('../config/database');
const mysql = require('mysql2/promise');

const router = express.Router();

// Add new membership (admin only)
router.post('/add', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, phone, membershipType } = req.body;
    
    // Validate input
    const errors = validateAddMembership({ name, email, phone, membershipType });
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const connection = await mysql.createConnection(db);
    
    // Generate unique member number
    const memberNumber = `MEM${Date.now()}`;
    
    // Calculate end date based on membership type
    const startDate = new Date();
    let endDate = new Date();
    
    switch(membershipType) {
      case '6_months':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case '1_year':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case '2_years':
        endDate.setFullYear(endDate.getFullYear() + 2);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 6); // Default to 6 months
    }
    
    // Insert new membership
    const [result] = await connection.execute(
      'INSERT INTO memberships (member_number, name, email, phone, membership_type, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [memberNumber, name, email, phone, membershipType, startDate, endDate, 'active']
    );
    
    await connection.end();
    
    res.json({
      id: result.insertId,
      member_number: memberNumber,
      name,
      email,
      phone,
      membership_type: membershipType,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
      message: 'Membership added successfully'
    });
  } catch (error) {
    console.error('Error adding membership:', error);
    res.status(500).json({ message: 'Server error while adding membership' });
  }
});

// Update membership (admin only)
router.put('/update/:memberNumber', authenticateAdmin, async (req, res) => {
  try {
    const { memberNumber } = req.params;
    const { action } = req.body;
    
    // Validate input
    const errors = validateUpdateMembership({ memberNumber, action });
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const connection = await mysql.createConnection(db);
    
    // Get current membership
    const [currentMembers] = await connection.execute(
      'SELECT id, name, email, phone, membership_type, start_date, end_date, status FROM memberships WHERE member_number = ?',
      [memberNumber]
    );
    
    if (currentMembers.length === 0) {
      await connection.end();
      return res.status(404).json({ message: 'Membership not found' });
    }
    
    const currentMembership = currentMembers[0];
    
    if (action === 'cancel') {
      // Cancel membership
      await connection.execute(
        'UPDATE memberships SET status = ? WHERE member_number = ?',
        ['cancelled', memberNumber]
      );
      
      await connection.end();
      
      res.json({
        message: 'Membership cancelled successfully',
        membership: { ...currentMembership, status: 'cancelled' }
      });
    } else if (action === 'extend') {
      // Extend membership by 6 months
      const newEndDate = new Date(currentMembership.end_date);
      newEndDate.setMonth(newEndDate.getMonth() + 6);
      
      await connection.execute(
        'UPDATE memberships SET end_date = ?, status = ? WHERE member_number = ?',
        [newEndDate, 'active', memberNumber]
      );
      
      await connection.end();
      
      res.json({
        message: 'Membership extended successfully',
        membership: { ...currentMembership, end_date: newEndDate }
      });
    } else {
      await connection.end();
      return res.status(400).json({ message: 'Invalid action. Use "extend" or "cancel".' });
    }
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ message: 'Server error while updating membership' });
  }
});

// Get membership by number (admin only)
router.get('/number/:memberNumber', authenticateAdmin, async (req, res) => {
  try {
    const { memberNumber } = req.params;
    
    const connection = await mysql.createConnection(db);
    
    const [rows] = await connection.execute(
      'SELECT * FROM memberships WHERE member_number = ?',
      [memberNumber]
    );
    
    await connection.end();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Membership not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching membership:', error);
    res.status(500).json({ message: 'Server error while fetching membership' });
  }
});

// Get all memberships (admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const connection = await mysql.createConnection(db);
    
    const [rows] = await connection.execute(
      'SELECT * FROM memberships ORDER BY created_at DESC'
    );
    
    await connection.end();
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ message: 'Server error while fetching memberships' });
  }
});

module.exports = router;