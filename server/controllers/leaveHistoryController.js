import Leave from '../models/LeaveHistory.js';

// add new leave 

export const createLeaveHistory = async (req, res) => {
    try {
        const { name, role, startDate, endDate, remarks } = req.body;

        // Validate required fields
        if (!name || !role || !startDate || !endDate || !remarks) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newLeave = new Leave({ name, role, startDate, endDate, remarks });
        const savedLeave = await newLeave.save();
        res.status(201).json(savedLeave);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// get all leaves
export const getAllLeaveHistory = async (req, res) => {
    try {
        const leaves = await Leave.find();
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
