import React, { useState } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import "./date-picker.css"
import axios from "axios";


const AddEmployee = ({ isOpen, onClose }) => {
  const [profileImg, setProfileImg] = useState(null);
  const [showAddress, setShowAddress] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "male",
    contact: "",
    salary: "",
    startDate: null,
    leaveDate: null,
    dob: null,
    jobProfile: "",
    experience: "",
    id: "",
    email: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pin: "",
  });

  const [formErrors, setFormErrors] = useState({});

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImg(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.age || isNaN(formData.age)) errors.age = "Valid age is required";
    if (!formData.contact || !/^\d{10}$/.test(formData.contact)) errors.contact = "Valid 10-digit contact required";
    if (!formData.salary || isNaN(formData.salary)) errors.salary = "Valid salary is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.dob) errors.dob = "Date of birth is required";
    if (!formData.jobProfile.trim()) errors.jobProfile = "Job profile is required";
    if (!formData.experience.trim()) errors.experience = "Experience is required";
    if (!formData.id.trim()) errors.id = "ID is required";
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Valid email is required";
    if (showAddress) {
      if (!formData.house.trim()) errors.house = "House number is required";
      if (!formData.street.trim()) errors.street = "Street name is required";
      if (!formData.city.trim()) errors.city = "City is required";
      if (!formData.state.trim()) errors.state = "State is required";
      if (!formData.pin || !/^\d{6}$/.test(formData.pin)) errors.pin = "Valid 6-digit pin is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Map frontend fields to backend schema
      const data = {
        profileImage: profileImg || "", // You may want to handle file upload separately
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contact,
        salary: formData.salary,
        age: formData.age,
        gender: formData.gender === "male" ? "Male" : "Female",
        startDate: formData.startDate,
        leaveDate: formData.leaveDate,
        dateOfBirth: formData.dob,
        jobProfile: formData.jobProfile,
        totalExperience: formData.experience,
        employeeId: formData.id,
        email: formData.email,
        address: {
          houseNumber: formData.house,
          streetName: formData.street,
          city: formData.city,
          state: formData.state,
          pin: formData.pin,
        },
      };

      try {
        const token = localStorage.getItem("token")
        await axios.post("http://localhost:3000/employees", data, {
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
        alert("Employee created successfully!");
        onClose();
        window.location.reload(); // Reload to see the new employee
      } catch (error) {
        alert("Failed to create employee. Please try again.");
        console.error(error);
      }
    }
  };

  

  const customDateInputStyle = {
    backgroundColor: "#1f2937",
    color: "#ffffff",
    border: "1px solid #4b5563",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    width: "100%",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-6xl max-h-full overflow-y-auto p-8">
        <div className="mb-8 border-b border-gray-700 pb-4">
          <h2 className="text-4xl font-bold font-mono text-white">Employee Detail</h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 rounded-xl border-2 border-gray-500 overflow-hidden mb-3 shadow-md">
                <img src={profileImg || "./image.png"} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <label className="text-sm text-gray-300 underline cursor-pointer">
                + Add Profile Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <div className="flex flex-col gap-3">
              <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="input-style" />
              {formErrors.firstName && <span className="text-red-400 text-sm">{formErrors.firstName}</span>}
              <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="input-style" />
              {formErrors.lastName && <span className="text-red-400 text-sm">{formErrors.lastName}</span>}
              <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="input-style" />
              {formErrors.age && <span className="text-red-400 text-sm">{formErrors.age}</span>}
              <div className="input-style flex items-center gap-4">
                <span>Gender:</span>
                <label className="flex items-center gap-1">
                  <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} className="accent-orange-500" /> Male
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} className="accent-orange-500" /> Female
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact No:" className="input-style" />
              {formErrors.contact && <span className="text-red-400 text-sm">{formErrors.contact}</span>}
              <input name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary" className="input-style" />
              {formErrors.salary && <span className="text-red-400 text-sm">{formErrors.salary}</span>}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <span className="bg-gray-800 px-3 py-1 rounded text-sm">2y</span>
                  <span className="bg-gray-800 px-3 py-1 rounded text-sm">3M</span>
                </div>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                  placeholderText="Start-date"
                  className="input-style-sm"
                  wrapperClassName="w-full"
                  popperPlacement="top"
                  calendarClassName="bg-gray-800 text-white"
                  customInput={<input style={customDateInputStyle} />}
                />
                {formErrors.startDate && <span className="text-red-400 text-sm">{formErrors.startDate}</span>}
                <span className="text-xs text-gray-300 text-center">AND</span>
                <DatePicker
                  selected={formData.leaveDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, leaveDate: date }))}
                  placeholderText="Leave Date"
                  className="input-style-sm"
                  wrapperClassName="w-full"
                  popperPlacement="top"
                  calendarClassName="bg-gray-800 text-white"
                  customInput={<input style={customDateInputStyle} />}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <DatePicker
              selected={formData.dob}
              onChange={(date) => setFormData(prev => ({ ...prev, dob: date }))}
              placeholderText="Date of Birth"
              className="input-style"
              wrapperClassName="w-full"
              popperPlacement="top"
              calendarClassName="bg-gray-800 text-white"
              customInput={<input style={customDateInputStyle} />}
            />
            {formErrors.dob && <span className="text-red-400 text-sm">{formErrors.dob}</span>}
            <input name="jobProfile" value={formData.jobProfile} onChange={handleChange} placeholder="Job Profile" className="input-style" />
            {formErrors.jobProfile && <span className="text-red-400 text-sm">{formErrors.jobProfile}</span>}
            <input name="experience" value={formData.experience} onChange={handleChange} placeholder="Total Experience" className="input-style" />
            {formErrors.experience && <span className="text-red-400 text-sm">{formErrors.experience}</span>}
            <input name="id" value={formData.id} onChange={handleChange} placeholder="ID" className="input-style" />
            {formErrors.id && <span className="text-red-400 text-sm">{formErrors.id}</span>}
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email ID" className="input-style col-span-2" />
            {formErrors.email && <span className="text-red-400 text-sm">{formErrors.email}</span>}
          </div>

          {/* Address Section */}
          <div className="border border-gray-600 rounded-lg p-5">
            <div className="flex justify-between items-center cursor-pointer text-white mb-3" onClick={() => setShowAddress(!showAddress)}>
              <span className="text-lg font-mono">Address</span>
              <span className="text-sm text-orange-400">{showAddress ? "Hide" : "Show"}</span>
            </div>

            {showAddress && (
              <>
                <input name="house" value={formData.house} onChange={handleChange} placeholder="House/Flat No" className="input-style mb-2 w-full" />
                {formErrors.house && <span className="text-red-400 text-sm">{formErrors.house}</span>}
                <input name="street" value={formData.street} onChange={handleChange} placeholder="Street Name" className="input-style mb-2 w-full" />
                {formErrors.street && <span className="text-red-400 text-sm">{formErrors.street}</span>}
                <div className="flex gap-4">
                  <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="input-style w-1/3" />
                  <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="input-style w-1/3" />
                  <input name="pin" value={formData.pin} onChange={handleChange} placeholder="Pin" className="input-style w-1/3" />
                </div>
                {(formErrors.city || formErrors.state || formErrors.pin) && (
                  <div className="text-red-400 text-sm mt-1">
                    {formErrors.city || formErrors.state || formErrors.pin}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <button type="button" className="text-gray-300 text-lg font-mono" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-mono text-lg rounded-xl px-8 py-2 shadow">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
