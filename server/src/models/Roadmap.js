import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: {
    type: String,
    required: true,
    trim: true
  },
  timeframe: {
    type: String,
    required: true, // e.g., "3 months", "6 months", "1 year"
    trim: true
  },
  learningHoursPerWeek: {
    type: Number,
    default: 10
  },
  phases: [{
    phaseNumber: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true // e.g., "Week 1-2"
    },
    topics: [{
      type: String
    }],
    technologies: [{
      type: String
    }],
    projectIdeas: [{
      type: String
    }],
    learningResources: [{
      title: String,
      url: String,
      type: String // "Course", "Tutorial", "Documentation", etc.
    }],
    milestones: [{
      type: String
    }]
  }],
  currentPhase: {
    type: Number,
    default: 1
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
roadmapSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Roadmap', roadmapSchema);

