const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.param('id', (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user id.' });
  next();
});

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!User.ROLES.includes(role)) return res.status(400).json({ message: 'Invalid role.' });
    if (String(req.user._id) === req.params.id) {
      return res.status(400).json({ message: 'You cannot change your own role.' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.role = role;
    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (String(req.user._id) === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    await Post.deleteMany({ author: user._id });
    await user.deleteOne();
    res.json({ message: 'User and their posts deleted.', id: user._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
