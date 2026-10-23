require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const filesRouter = require('./routes/files');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fileupload';
const maxMb = Number(process.env.MAX_FILE_SIZE_MB) || 10;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  exposedHeaders: ['Content-Disposition'],
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/files', filesRouter);

app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found.' }));

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: `File is too large. The limit is ${maxMb} MB per file.`,
      LIMIT_FILE_COUNT: 'Too many files. You can upload up to 10 at a time.',
      LIMIT_UNEXPECTED_FILE: 'Unexpected upload field. Use the "files" field.',
    };
    return res.status(400).json({ message: messages[err.code] || err.message });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    console.error('Start MongoDB, or set MONGO_URI in server/.env to an Atlas connection string.');
    process.exit(1);
  });
