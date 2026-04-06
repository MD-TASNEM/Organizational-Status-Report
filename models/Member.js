import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: String,
    required: true,
    trim: true
  },
  improvement: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  decline: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  targetRole: {
    type: String,
    required: true,
    trim: true
  },
  circleRole: {
    type: String,
    required: true,
    trim: true
  },
  monova: {
    type: String,
    required: true,
    trim: true
  },
  remarks: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Member || mongoose.model('Member', memberSchema);
