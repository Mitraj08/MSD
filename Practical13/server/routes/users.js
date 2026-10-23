const express = require('express');
const User = require('../models/User');
const Document = require('../models/Document');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(protect, adminOnly);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  })
);

router.put(
  '/:id/role',
  asyncHandler(async (req, res) => {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    if (String(req.user._id) === req.params.id) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (String(req.user._id) === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const owned = await Document.countDocuments({ owner: user._id });
    if (owned > 0) {
      return res
        .status(400)
        .json({ message: `User still owns ${owned} document(s). Delete them first.` });
    }
    await Document.updateMany({ sharedWith: user._id }, { $pull: { sharedWith: user._id } });
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  })
);

module.exports = router;
