import Client from '../models/Client.js';

// Create a new client under a project
export const createClient = async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log("projectId from params:", projectId);

    const newClient = new Client({
      ...req.body,
      project: projectId, // Attach project ID from the URL
    });

    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all clients for a project
export const getClientsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const clients = await Client.find({ project: projectId });
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a client
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClient = await Client.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedClient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a client
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    await Client.findByIdAndDelete(id);
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
