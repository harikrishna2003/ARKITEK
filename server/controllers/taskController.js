import Task from '../models/Task.js';

// create a new task
export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;

    const task = new Task({
      ...req.body,
      project: projectId // explicitly attach project ID
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all tasks

export const getActiveTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId, status:"Active" }).populate('assignee', 'firstName lastName')
        res.status(200).json(tasks);
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getCompletedTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId, status:"completed" }).populate('assignee', 'firstName lastName')
        res.status(200).json(tasks);
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update task by id
export const updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignee'); // ✅ Ensure full assignee object is returned

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// delete task by id
export const deleteTask = async (req, res) => {
    try {
      
  console.log("🚨 Inside deleteTask controller");
  console.log("🧑‍💼 User:", req.user);
  console.log("🗑️ Task ID:", req.params.id);
 


        const deleted = await Task.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}