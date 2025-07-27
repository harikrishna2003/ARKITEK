import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  Name: {
    type: String,
    required: true,
  },
  "Client Name": String,
  Address: String,
  Contact: String,
  "Site Manager": String,
  Location: String,
  Earning: String
}, { timestamps: true });

export default mongoose.model('Client', clientSchema);
