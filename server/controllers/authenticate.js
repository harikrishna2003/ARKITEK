import User from "../models/User.js";
import Employee from "../models/Employees.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";





export const authenticateUser = async (req, res) => {

    const SECRET_KEY = process.env.SECRET_KEY; // Use process.env.SECRET_KEY in production

    const { username, password } = req.body;
    try {
        const employee = await Employee.findOne({ email: username });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        let existingUser = await User.findOne({ username });

        if (existingUser) {
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }
        } else {
            // Create new user with default role: 'employee'
            let role = 'employee';
            const profile = employee.jobProfile?.toLowerCase() || '';
            if (profile.includes('admin'))  {
                role = 'admin';
            }
            existingUser = new User({
                username,
                password: await bcrypt.hash(password, 10),
                employee: employee._id,
                role
            });
            await existingUser.save();
        }

        // Create JWT with userId and role
        const token = jwt.sign(
            {
                id: existingUser._id,
                role: existingUser.role,
                username: existingUser.username
            },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "User authenticated successfully",
            token,
            userId: existingUser._id,
            employee: employee._id,
            role: existingUser.role
        });

    } catch (error) {
        console.error("Error during authentication:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getusernameFromId = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('employee', 'firstName lastName');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({employee: user.employee });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}