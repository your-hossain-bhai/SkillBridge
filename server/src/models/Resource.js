import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  relatedSkills: {
    type: [String],
    default: []
  },
  costType: {
    type: String,
    enum: ['Free', 'Paid'],
    default: 'Free'
  },
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: true
  }
});

export default mongoose.model('Resource', resourceSchema);

