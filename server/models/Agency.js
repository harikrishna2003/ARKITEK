import mongoose from 'mongoose';

const agencySchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  agency: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  address: String,
  contact: String,
  location: String,
  expenditure: String, // You can also use Number if it's always numeric
}, { timestamps: true });

export default mongoose.model('Agency', agencySchema);
