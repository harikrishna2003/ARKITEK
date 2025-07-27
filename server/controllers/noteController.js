import Note from '../models/Note.js';

// Save or update a note
export const saveNote = async (req, res) => {
  const { id, title, content } = req.body;
  const { projectId } = req.params;

  try {
    let note;
    if (id) {
      note = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
    } else {
      note = new Note({ title, content, project:projectId });
      await note.save();
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all notes
export const getNotes = async (req, res) => {
    const { projectId } = req.params;
  try {
    const notes = await Note.find({project:projectId}).sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNote = async (req, res) => {
  const { id, projectId } = req.params;
  const { title, content } = req.body;

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, project: projectId },
      { title, content },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found in this project.' });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  const { id, projectId } = req.params;

  try {
    const result = await Note.findOneAndDelete({ _id: id, project: projectId });
    if (!result) return res.status(404).json({ message: 'Note not found in this project.' });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

