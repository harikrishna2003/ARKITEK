import Leave from '../models/Leaves.js';

// add new leave 

export const createLeave = async (req, res) => {
    try {
        const { employeeId, name, role, startDate, endDate, remarks } = req.body;

        // Validate required fields
        if (!employeeId || !name || !role || !startDate || !endDate || !remarks) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newLeave = new Leave({ employeeId, name, role, startDate, endDate, remarks });
        const savedLeave = await newLeave.save();
        res.status(201).json(savedLeave);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// get all leaves
export const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find();
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteLeave = async (req, res) => {
    try {
        const deletedLeave = await Leave.findByIdAndDelete(req.params.id);
        if (!deletedLeave) {
            return res.status(404).json({ message: "Leave not found" });
        }
        res.status(200).json({ message: "Leave deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateLeave = async (req, res) => {
    try {
        const { name, role, startDate, endDate, remarks } = req.body;

        // Validate required fields
        if (!name || !role || !startDate || !endDate || !remarks) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const updatedLeave = await Leave.findByIdAndUpdate(
            req.params.id,
            { name, role, startDate, endDate, remarks },
            { new: true }
        );

        if (!updatedLeave) {
            return res.status(404).json({ message: "Leave not found" });
        }

        res.status(200).json(updatedLeave);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

// Get leaves for a specific employee by employeeId
export const getLeavesByEmployeeId = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const leaves = await Leave.find({ employeeId });
        if (leaves.length === 0) {
            return res.status(404).json({ message: "No leaves found for this employee" });
        }
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
