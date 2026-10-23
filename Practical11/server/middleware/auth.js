const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getToken = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
};

const userFromToken = async (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return User.findById(payload.id);
};

// Requires a valid login
const protect = async (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: 'Please log in to continue.' });
  try {
    const user = await userFromToken(token);
    if (!user) return res.status(401).json({ message: 'This account no longer exists.' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
};

// Attaches req.user when a valid token is present, but never blocks
const optionalAuth = async (req, res, next) => {
  const token = getToken(req);
  if (token) {
    try {
      req.user = await userFromToken(token);
    } catch (err) {
      /* ignore invalid token: treat as visitor */
    }
  }
  next();
};

// Role-based access control
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have permission to do that.' });
  }
  next();
};

module.exports = { protect, optionalAuth, authorize };
