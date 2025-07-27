// EmployeeDetailDialog.jsx
import React from "react";
import axios from "axios";

const EmployeeDetailDialog = ({ isOpen, employee, onClose, onDelete }) => {
  if (!isOpen || !employee) return null;

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this employee?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:3000/employees/${employee._id}`, {
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
      alert("Employee deleted successfully.");
      onDelete();
    } catch (error) {
      alert("Failed to delete employee.");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-full overflow-y-auto p-10 font-mono">
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-5">
          <h3 className="text-4xl font-bold text-white">Employee Information</h3>
          {/* <button onClick={onClose} className="text-white text-3xl font-bold hover:text-gray-400">&times;</button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div className="flex flex-col items-center text-center">
            <img
              src={employee.profileImage || "./image.png"}
              alt="Profile"
              className="w-40 h-40 object-cover rounded-xl border-2 border-gray-500 shadow-md"
            />
            <p className="text-gray-300 mt-3 text-sm italic">ID: {employee.employeeId}</p>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-x-6 gap-y-3 text-white text-sm">
            <p><span className="font-semibold text-orange-400">Name:</span> {employee.firstName} {employee.lastName}</p>
            <p><span className="font-semibold text-orange-400">Age:</span> {employee.age}</p>
            <p><span className="font-semibold text-orange-400">Gender:</span> {employee.gender}</p>
            <p><span className="font-semibold text-orange-400">Email:</span> {employee.email}</p>
            <p><span className="font-semibold text-orange-400">Contact:</span> {employee.contactNumber}</p>
            <p><span className="font-semibold text-orange-400">Job Profile:</span> {employee.jobProfile}</p>
            <p><span className="font-semibold text-orange-400">Experience:</span> {employee.totalExperience}</p>
            <p><span className="font-semibold text-orange-400">Salary:</span> ₹{employee.salary}</p>
            <p><span className="font-semibold text-orange-400">Date of Birth:</span> {new Date(employee.dateOfBirth).toLocaleDateString()}</p>
            <p><span className="font-semibold text-orange-400">Start Date:</span> {new Date(employee.startDate).toLocaleDateString()}</p>
            {employee.leaveDate && (
              <p><span className="font-semibold text-orange-400">Leave Date:</span> {new Date(employee.leaveDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6">
          <h3 className="text-2xl text-orange-400 mb-4">Address</h3>
          <p className="text-white text-sm leading-relaxed">
            {employee.address?.houseNumber}, {employee.address?.streetName},<br />
            {employee.address?.city}, {employee.address?.state} - {employee.address?.pin}
          </p>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-between border-t border-gray-700 pt-6 gap-4">
          <button style={{ borderRadius:"5px"}} onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow">Close</button>
          <button style={{ borderRadius:"5px"}} onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow">Delete Employee</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailDialog;