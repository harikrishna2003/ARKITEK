import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee', // reference to employees collection
    },
  ],
  description: {
    type: String,
  },

  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active',
  },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
