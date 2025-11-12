import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  education: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', 'Junior', 'Mid', 'Senior'],
    default: 'Fresher'
  },
  preferredTrack: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  cvText: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model('User', userSchema);

