const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters.'],
      maxlength: [60, 'Name must be 60 characters or fewer.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address.'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits.'],
    },
    course: {
      type: String,
      required: [true, 'Course is required.'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required.'],
      min: [1, 'Year must be between 1 and 4.'],
      max: [4, 'Year must be between 1 and 4.'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
