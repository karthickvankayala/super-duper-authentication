const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, '../keys/private.pem'));

// Login endpoint
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1').get(email);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      privateKey, 
      { 
        algorithm: 'RS256',
        expiresIn: '1h'
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,        // Set to true if using HTTPS
      sameSite: 'strict',
      maxAge: 1800000        // 1/2 hour
    });

    // console.log("JWT Secret Length:", process.env.JWT_SECRET.length);

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Register  endpoint
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, dob, job_title } = req.body;

    // exiting user check
    const userExists = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (userExists) return res.status(400).json({ message: 'Email already in use' });

    // basic date format check
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
      return res.status(400).json({ message: 'Invalid DOB format. Use dd/mm/yyyy' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO users (name, email, password, dob, job_title) VALUES (?, ?, ?, ?, ?)').run(name, email, hashedPassword, dob, job_title);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
