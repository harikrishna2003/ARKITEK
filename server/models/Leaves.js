import mongoose, { mongo } from "mongoose";

const leaveSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Employee',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    remarks: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('Leave', leaveSchema);
