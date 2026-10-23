const express = require('express');
const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { upload, uploadDir } = require('../middleware/upload');

const router = express.Router();
router.use(protect);

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parseTags = (t) => {
  const arr = Array.isArray(t) ? t : String(t || '').split(',');
  return [...new Set(arr.map((x) => String(x).trim().toLowerCase()).filter(Boolean))].slice(0, 10);
};

const isAdmin = (u) => u.role === 'admin';
const idOf = (x) => String((x && x._id) || x);
const isOwner = (doc, user) => idOf(doc.owner) === String(user._id);
const canView = (doc, user) =>
  isAdmin(user) || isOwner(doc, user) || doc.sharedWith.some((u) => idOf(u) === String(user._id));
const canEdit = (doc, user) => isAdmin(user) || isOwner(doc, user);

const withPopulate = (q) => q.populate('owner', 'name email').populate('sharedWith', 'name email');

const removeFile = (fileName) => {
  if (!fileName) return;
  fs.unlink(path.join(uploadDir, fileName), () => {});
};

const accessFilter = (user, scope) => {
  const uid = user._id;
  if (scope === 'mine') return { owner: uid };
  if (scope === 'shared') return { sharedWith: uid };
  if (isAdmin(user)) return {};
  return { $or: [{ owner: uid }, { sharedWith: uid }] };
};

// ---------- Stats ----------
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const docs = await Document.find(accessFilter(req.user, 'all')).select(
      'category size owner sharedWith'
    );
    const byCategory = {};
    let totalSize = 0;
    let sharedWithMe = 0;
    let mine = 0;
    docs.forEach((d) => {
      byCategory[d.category] = (byCategory[d.category] || 0) + 1;
      totalSize += d.size || 0;
      if (isOwner(d, req.user)) mine += 1;
      else sharedWithMe += 1;
    });
    res.json({ total: docs.length, mine, sharedWithMe, totalSize, byCategory });
  })
);

// ---------- List ----------
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { search = '', category = '', scope = 'all' } = req.query;
    const conds = [accessFilter(req.user, scope)];

    if (category && Document.CATEGORIES.includes(category)) conds.push({ category });

    const term = String(search).trim();
    if (term) {
      const rx = new RegExp(escapeRegex(term), 'i');
      conds.push({
        $or: [{ title: rx }, { description: rx }, { originalName: rx }, { tags: rx }],
      });
    }

    const documents = await withPopulate(Document.find({ $and: conds }).sort({ updatedAt: -1 }));
    res.json({ documents });
  })
);

// ---------- Upload ----------
router.post(
  '/',
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    try {
      const { title, description, category, tags } = req.body;
      const doc = await Document.create({
        title: (title || '').trim() || req.file.originalname,
        description: description || '',
        category: Document.CATEGORIES.includes(category) ? category : 'General',
        tags: parseTags(tags),
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        currentVersion: 1,
        owner: req.user._id,
        versions: [
          {
            version: 1,
            fileName: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            uploadedBy: req.user._id,
          },
        ],
      });
      const populated = await withPopulate(Document.findById(doc._id));
      res.status(201).json({ document: populated });
    } catch (err) {
      removeFile(req.file.filename);
      throw err;
    }
  })
);

// ---------- Get one ----------
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const doc = await withPopulate(Document.findById(req.params.id));
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (!canView(doc, req.user)) return res.status(403).json({ message: 'Access denied' });
    res.json({ document: doc });
  })
);

// ---------- Update metadata ----------
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (!canEdit(doc, req.user)) return res.status(403).json({ message: 'Access denied' });

    const { title, description, category, tags } = req.body;
    if (title !== undefined) {
      if (!String(title).trim()) return res.status(400).json({ message: 'Title is required' });
      doc.title = String(title).trim();
    }
    if (description !== undefined) doc.description = description;
    if (category !== undefined && Document.CATEGORIES.includes(category)) doc.category = category;
    if (tags !== undefined) doc.tags = parseTags(tags);

    await doc.save();
    const populated = await withPopulate(Document.findById(doc._id));
    res.json({ document: populated });
  })
);

// ---------- New version ----------
router.post(
  '/:id/version',
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    const doc = await Document.findById(req.params.id);
    if (!doc) {
      removeFile(req.file.filename);
      return res.status(404).json({ message: 'Document not found' });
    }
    if (!canEdit(doc, req.user)) {
      removeFile(req.file.filename);
      return res.status(403).json({ message: 'Access denied' });
    }

    const next = doc.currentVersion + 1;
    doc.versions.push({
      version: next,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id,
    });
    doc.currentVersion = next;
    doc.originalName = req.file.originalname;
    doc.mimeType = req.file.mimetype;
    doc.size = req.file.size;
    await doc.save();

    const populated = await withPopulate(Document.findById(doc._id));
    res.json({ document: populated });
  })
);

// ---------- Download ----------
router.get(
  '/:id/download',
  asyncHandler(async (req, res) => {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (!canView(doc, req.user)) return res.status(403).json({ message: 'Access denied' });

    const wanted = parseInt(req.query.version, 10) || doc.currentVersion;
    const v = doc.versions.find((x) => x.version === wanted);
    if (!v) return res.status(404).json({ message: 'Version not found' });

    const full = path.join(uploadDir, v.fileName);
    if (!fs.existsSync(full)) return res.status(404).json({ message: 'File missing on server' });

    res.download(full, v.originalName);
  })
);

// ---------- Share ----------
router.post(
  '/:id/share',
  asyncHandler(async (req, res) => {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (!canEdit(doc, req.user)) return res.status(403).json({ message: 'Access denied' });

    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const target = await User.findOne({ email });
    if (!target) return res.status(404).json({ message: 'No user with that email' });
    if (idOf(doc.owner) === String(target._id)) {
      return res.status(400).json({ message: 'That user already owns this document' });
    }

    await Document.updateOne({ _id: doc._id }, { $addToSet: { sharedWith: target._id } });
    const populated = await withPopulate(Document.findById(doc._id));
    res.json({ document: populated });
  })
);

router.delete(
  '/:id/share/:userId',
  asyncHandler(async (req, res) => {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (!canEdit(doc, req.user)) return res.status(403).json({ message: 'Access denied' });

    await Document.updateOne({ _id: doc._id }, { $pull: { sharedWith: req.params.userId } });
    const populated = await withPopulate(Document.findById(doc._id));
    res.json({ document: populated });
  })
);

// ---------- Delete ----------
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (!canEdit(doc, req.user)) return res.status(403).json({ message: 'Access denied' });

    doc.versions.forEach((v) => removeFile(v.fileName));
    await doc.deleteOne();
    res.json({ message: 'Document deleted' });
  })
);

module.exports = router;
