import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  requiredSkills: {
    type: [String],
    default: []
  },
  recommendedExperience: {
    type: String,
    default: ''
  },
  jobType: {
    type: String,
    enum: ['Internship', 'Part-time', 'Full-time', 'Freelance', 'Apprenticeship', 'Contract'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Job', jobSchema);

