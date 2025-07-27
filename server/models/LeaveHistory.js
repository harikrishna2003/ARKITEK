import mongoose from 'mongoose';
const historySchema = new mongoose.Schema({
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
export default mongoose.model('Leave History', historySchema); 