import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true},
    description: {
        type: String,
        required: true},
    attachments: {
        file: String, 
        image: String
    },
    status: {
        type: String,
        enum: ['Active', 'in-progress', 'completed'],
        default: 'Active'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    scheduleDate: {
        type: Date,
        required: true
    },
    estimatedTime: {
        type: String,
    },
    dueDate: {
        type: Date,
        required: true
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    project : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }

}, {timestamps: true});
const Task = mongoose.model('Task', taskSchema);
export default Task;