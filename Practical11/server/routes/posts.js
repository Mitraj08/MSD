const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const { protect, optionalAuth, authorize } = require('../middleware/auth');

const router = express.Router();

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const checkId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid post id.' });
  }
  next();
};

const authorId = (post) => String(post.author?._id ?? post.author);
const canModify = (user, post) => user.role === 'admin' || authorId(post) === String(user._id);

const normalizeTags = (tags) => {
  const list = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',') : [];
  const cleaned = list.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
  return [...new Set(cleaned)].slice(0, 5);
};

// Public: published posts with search, tag filter and pagination
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 50);
    const search = (req.query.search || '').toString().trim();
    const tag = (req.query.tag || '').toString().trim().toLowerCase();

    const filter = { status: 'published' };
    if (tag) filter.tags = tag;
    if (search) {
      const rx = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ title: rx }, { content: rx }, { tags: rx }];
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .select('-content')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', 'name'),
      Post.countDocuments(filter),
    ]);
    res.json({ posts, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
  } catch (err) {
    next(err);
  }
});

// Author: own posts (all statuses). Admin: every post.
router.get('/manage', protect, authorize('author', 'admin'), async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { author: req.user._id };
    const posts = await Post.find(filter)
      .select('-content')
      .sort({ updatedAt: -1 })
      .limit(200)
      .populate('author', 'name');
    res.json({ posts });
  } catch (err) {
    next(err);
  }
});

// One post. Drafts are visible only to their author and admins.
router.get('/:id', checkId, optionalAuth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const canEdit = Boolean(req.user && canModify(req.user, post));
    if (post.status === 'draft' && !canEdit) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json({ post, canEdit });
  } catch (err) {
    next(err);
  }
});

router.post('/', protect, authorize('author', 'admin'), async (req, res, next) => {
  try {
    const { title, content, tags, status } = req.body;
    const post = await Post.create({
      title,
      content,
      status,
      tags: normalizeTags(tags),
      author: req.user._id,
    });
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', checkId, protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    if (!canModify(req.user, post)) {
      return res.status(403).json({ message: 'You can only edit your own posts.' });
    }
    const { title, content, tags, status } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (status !== undefined) post.status = status;
    if (tags !== undefined) post.tags = normalizeTags(tags);
    await post.save();
    res.json({ post });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', checkId, protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    if (!canModify(req.user, post)) {
      return res.status(403).json({ message: 'You can only delete your own posts.' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted.', id: post._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
