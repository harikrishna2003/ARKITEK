import Agency from '../models/Agency.js';

export const createAgency = async (req, res) => {
  try {
    const { projectId } = req.params;
    const agency = new Agency({ ...req.body, project: projectId });
    await agency.save();
    res.status(201).json(agency);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAgencies = async (req, res) => {
  try {
    const { projectId } = req.params;
    const agencies = await Agency.find({ project: projectId });
    res.status(200).json(agencies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAgency = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(agency);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteAgency = async (req, res) => {
  try {
    await Agency.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Agency deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
