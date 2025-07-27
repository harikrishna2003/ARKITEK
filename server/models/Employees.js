import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    houseNumber: String,
    streetName: String,
    city: String,
    state: String,
    pin: String,
});

const employeeSchema = new mongoose.Schema({
    profileImage: { type: String }, // URL or filename for image
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: String },
    salary: { type: Number },

    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female'] },

    startDate: { type: Date },
    leaveDate: { type: Date },

    dateOfBirth: { type: Date },
    jobProfile: { type: String },
    totalExperience: { type: String },
    employeeId: { type: String, unique: true },
    email: { type: String, lowercase: true },

    address: addressSchema,
}, {
    timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;

