const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const File = require('../models/File');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const maxMb = Number(process.env.MAX_FILE_SIZE_MB) || 10;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).slice(0, 15);
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: maxMb * 1024 * 1024, files: 10 },
});

// multer decodes names as latin1; convert back to utf8 so non-English names work
const fixName = (name) => Buffer.from(name, 'latin1').toString('utf8');

const removeFromDisk = (filePath) => {
  fs.unlink(filePath, () => {});
};

// Upload
router.post('/', upload.array('files', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No file received. Choose at least one file.' });
    }

    const docs = req.files.map((f) => ({
      originalName: fixName(f.originalname),
      storedName: f.filename,
      mimeType: f.mimetype,
      size: f.size,
      path: f.path,
    }));

    try {
      const saved = await File.insertMany(docs);
      res.status(201).json({ message: 'Upload complete', files: saved });
    } catch (dbErr) {
      req.files.forEach((f) => removeFromDisk(f.path));
      throw dbErr;
    }
  } catch (err) {
    next(err);
  }
});

// List
router.get('/', async (req, res, next) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    next(err);
  }
});

// Download
router.get('/:id/download', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid file id.' });
    }
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found.' });
    if (!fs.existsSync(file.path)) {
      return res.status(410).json({ message: 'File is missing from storage.' });
    }
    res.download(file.path, file.originalName);
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid file id.' });
    }
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found.' });
    removeFromDisk(file.path);
    res.json({ message: 'File deleted', id: file._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
