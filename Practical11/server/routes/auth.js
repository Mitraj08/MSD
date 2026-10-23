const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    // Self-registration can only create readers or authors, never admins
    const safeRole = role === 'author' ? 'author' : 'reader';
    const user = await User.create({ name, email, password, role: safeRole });
    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = (req.body.email || '').toString().trim().toLowerCase();
    const password = (req.body.password || '').toString();
    if (!email || !password) {
      return res.status(400).json({ message: 'Enter your email and password.' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    res.json({ token: signToken(user), user });
  } catch (err) {
    next(err);
  }
});

router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
