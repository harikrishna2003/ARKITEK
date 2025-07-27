import Meeting from "../models/Schedule.js";

export const createMeeting = async (req, res) => {
  try {
    const { projectId } = req.params;
    const meeting = new Meeting({ ...req.body, project: projectId });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMeetingsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const meetings = await Meeting.find({ project: projectId });
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// updateMeeting
export const updateMeeting = async (req, res) => {
  console.log('Update Request Params:', req.params); // Check { projectId, id }
  console.log('Update Request Body:', req.body); // Check incoming data
  try {
    const updated = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// deleteMeeting
export const deleteMeeting = async (req, res) => {
  console.log('Delete Request Params:', req.params); // Check { projectId, id }
  try {
    const deleted = await Meeting.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


