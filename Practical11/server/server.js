require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'dev-only-secret-change-me';
  console.warn('JWT_SECRET is not set. Using an insecure development secret.');
}

const User = require('./models/User');
const Post = require('./models/Post');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog_mern';

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found.' }));

// Serve the built React app in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.entries(err.errors).forEach(([field, e]) => {
      errors[field] = e.message;
    });
    return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });
  }
  if (err.code === 11000) {
    return res.status(409).json({
      message: 'An account with this email already exists.',
      errors: { email: 'This email is already registered.' },
    });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for ${err.path}.` });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body is not valid JSON.' });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

// Create the default admin (and a couple of sample posts) on first run
const seed = async () => {
  const email = (process.env.ADMIN_EMAIL || 'admin@blog.com').toLowerCase();
  let admin = await User.findOne({ email });
  if (!admin) {
    admin = await User.create({
      name: 'Administrator',
      email,
      password: process.env.ADMIN_PASSWORD || 'Admin@1234',
      role: 'admin',
    });
    console.log(`Default admin created: ${email}`);
  }
  if ((await Post.countDocuments()) === 0) {
    await Post.create([
      {
        title: 'Welcome to the blog',
        content:
          'This is a sample post. Log in as an author or admin to write your own, edit posts, and manage drafts.\n\nReaders can browse and search published posts.',
        tags: ['welcome', 'news'],
        status: 'published',
        author: admin._id,
      },
      {
        title: 'How roles work here',
        content:
          'Readers can read. Authors can create and manage their own posts. Admins can manage every post and every user account.',
        tags: ['guide'],
        status: 'published',
        author: admin._id,
      },
    ]);
    console.log('Sample posts created.');
  }
};

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('MongoDB connected');
    await seed();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Startup failed:', err.message);
    console.error('Start MongoDB, or set MONGO_URI in server/.env to an Atlas connection string.');
    process.exit(1);
  });
