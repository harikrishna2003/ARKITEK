import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
  title: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const Note = mongoose.model('Note', NoteSchema);
export default Note;
