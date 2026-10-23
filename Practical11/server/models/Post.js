const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters.'],
      maxlength: [120, 'Title must be 120 characters or fewer.'],
    },
    content: {
      type: String,
      required: [true, 'Content is required.'],
      trim: true,
      minlength: [10, 'Content must be at least 10 characters.'],
    },
    excerpt: { type: String },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: { values: ['draft', 'published'], message: 'Status must be draft or published.' },
      default: 'published',
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

postSchema.pre('validate', function () {
  if (this.content) this.excerpt = this.content.replace(/\s+/g, ' ').slice(0, 180);
});

module.exports = mongoose.model('Post', postSchema);
