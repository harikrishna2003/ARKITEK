import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  name: String,
  email: String,
  date: String,       // Format: "YYYY-MM-DD"
  time: String,       // Format: "HH:MM AM/PM"
  agenda: String,
  remarks: String
}, {
  timestamps: true
});

export default mongoose.model("Meeting", meetingSchema);
