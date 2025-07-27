import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  startTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return this.endTime ? value < this.endTime : true;
      },
      message: 'Start time must be before end time'
    }
  },
  endTime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isAllDay: {
    type: Boolean,
    default: false,
  },
  recurrenceRule: {
    type: String,
    trim: true
  },
  recurrenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  recurrenceException: {
    type: String,
    trim: true
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for better query performance
eventSchema.index({ project: 1 });
eventSchema.index({ startTime: 1 });
eventSchema.index({ endTime: 1 });

export default mongoose.model('Event', eventSchema);