const express = require('express');
const db = require('../db');
const router = express.Router();
const { authenticateToken, authorizeAdmin, authorizeAdminOrAudit } = require('../middleware/auth');

// List all users for an admin authenticated user
router.get('/', authenticateToken, authorizeAdminOrAudit, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const email = req.query.email;

  try {
    let users = [], total = 0;

    if (email && email.trim() !== '') {
      const searchQuery = `%${email.trim()}%`;

      users = db.prepare(`
        SELECT id, name, email, dob, job_title, role 
        FROM users 
        WHERE email LIKE ? AND is_active = 1
        LIMIT ? OFFSET ?
      `).all(searchQuery, limit, offset);

      total = db.prepare(`
        SELECT COUNT(*) as count
        FROM users
        WHERE email LIKE ? AND is_active = 1
      `).get(searchQuery).count;

      return res.json({ users, total });
    }

    // Full list is only for admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can list all users.' });
    }

    users = db.prepare(`
      SELECT id, name, email, dob, job_title, role 
      FROM users
      WHERE is_active = 1
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    total = db.prepare(`
      SELECT COUNT(*) as count FROM users
      WHERE is_active = 1
    `).get().count;

    return res.json({ users, total });

  } catch (err) {
    console.error('Error in /api/users:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get logged-in user's own info
router.get('/me', authenticateToken, (req, res) => {
  try {
    const userInfo = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      dob: req.user.dob,
      job_title: req.user.job_title,
      role: req.user.role
    };
    res.json(userInfo);
  } catch (err) {
    console.error('Error in /users/me:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Deactivate a user account
router.put('/deactivate', authenticateToken, authorizeAdmin, (req, res) => {
  const { email } = req.body;
  
  if (!email) return res.status(400).json({ message: 'Email is required' });

  if (email === req.user.email) {
    return res.status(403).json({ message: 'You cannot deactivate your own account.' });
  }

  const result = db.prepare(`UPDATE users SET is_active = 0 WHERE email = ?`).run(email);
  
  if (result.changes === 0) {
    return res.status(404).json({ message: 'User not found or already inactive' });
  }

  res.json({ message: `User with email ${email} marked as inactive.` });
});

// Activate a user account
router.put('/activate', authenticateToken, authorizeAdmin, (req, res) => {
  const { email } = req.body;
  
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const result = db.prepare(`UPDATE users SET is_active = 1 WHERE email = ?`).run(email);
  
  if (result.changes === 0) {
    return res.status(404).json({ message: 'User not found or already inactive' });
  }

  res.json({ message: `User with email ${email} marked as inactive.` });
});


// Get a user by email
/* URI path is not ideal. email address has special chars which leads to URL encoding complexity
router.get('/user/:email', authenticateToken, authorizeAdmin, (req, res) => {
  const email = req.params.email;

  try {
    const user = db.prepare('SELECT id, name, email, dob, job_title, role FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user by email:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/

module.exports = router;