const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');

// Base paths
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;