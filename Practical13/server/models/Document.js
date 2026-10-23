const mongoose = require('mongoose');

const CATEGORIES = ['General', 'Contract', 'Invoice', 'Report', 'Policy', 'Legal', 'HR', 'Other'];

const versionSchema = new mongoose.Schema(
  {
    version: { type: Number, required: true },
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, default: 'application/octet-stream' },
    size: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    category: { type: String, enum: CATEGORIES, default: 'General' },
    tags: [{ type: String, trim: true, lowercase: true }],
    originalName: { type: String, required: true },
    mimeType: { type: String, default: 'application/octet-stream' },
    size: { type: Number, default: 0 },
    currentVersion: { type: Number, default: 1 },
    versions: [versionSchema],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Document = mongoose.model('Document', documentSchema);
Document.CATEGORIES = CATEGORIES;
module.exports = Document;
