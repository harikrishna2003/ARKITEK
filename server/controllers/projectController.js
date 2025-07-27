import Project from '../models/Project.js';
import Employee from '../models/Employees.js';


export const createProject = async (req, res) => {
  try {
    const { name, participants, description } = req.body;

    // Optional: validate if provided employee IDs actually exist
    const validParticipants = await Employee.find({ _id: { $in: participants } });
    if (validParticipants.length !== participants.length) {
      return res.status(400).json({ message: 'One or more participant IDs are invalid' });
    }

    const newProject = new Project({ name, participants, description });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('participants', 'firstName lastName email');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllActiveProjects = async (req, res) => {
  try {
    const projects = await Project.find({status:"active"}).populate('participants', 'firstName lastName email');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllCompletedProjects = async (req, res) => {
  try {
    const projects = await Project.find({status:"completed"}).populate('participants', 'firstName lastName email');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllProjectParticipants = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId).populate('participants');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json(project.participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
};

export const getUserAssignedProjects = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const projects = await Project.find({ participants: employeeId, status:'active' }).populate('participants', 'firstName lastName email');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export const getUserCompletedProjects = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const projects = await Project.find({ participants: employeeId, status:'completed' }).populate('participants', 'firstName lastName email');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



export const addParticipantsByIdList = async (req, res) => {
  const { projectId } = req.params;
  const { participants } = req.body;

  if (!Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ message: 'No participants provided' });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const alreadyExists = [];
    const newOnes = [];

    for (const id of participants) {
      if (project.participants.includes(id)) {
        alreadyExists.push(id);
      } else {
        newOnes.push(id);
      }
    }

    if (newOnes.length > 0) {
      project.participants.push(...newOnes);
      await project.save();
    }

    return res.status(200).json({
      message: `${newOnes.length} added. ${alreadyExists.length} already existed.`,
      added: newOnes,
      skipped: alreadyExists,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const closeProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { status: 'completed' },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({ message: 'Project marked as completed', project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




