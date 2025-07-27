import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    role: {
        type:String,
        enum: ['admin', 'employee'],
        default: 'employee'
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;