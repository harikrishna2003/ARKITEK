import React from "react";
import ProfileCard from "./ProfileCard";
import axios from "axios";
import { useEffect, useState } from "react";
import EmployeeDetailDialog from "./EmployeeDetailDialog";

function calculateDaysBetween(startDate, endDate) {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get difference in milliseconds
  const diffInMs = end - start;

  // Convert to days
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}


const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchEmployees = () => {
    const token = localStorage.getItem("token")
    axios.get("http://localhost:3000/employees", {
          headers: {
            Authorization:`Bearer ${token}`,
          }
      })
        
      .then((res) => {
        const formatted = res.data.map(emp => ({
          _id:emp._id,
          name: `${emp.firstName} ${emp.lastName}`,
          position : emp.jobProfile,
          workingDays: calculateDaysBetween(emp.startDate, emp.leaveDate),
          imageSrc:emp.profileImage
        }))
        setEmployees(formatted)
    })
      .catch((err) => {
        console.error("Error fetching employees:", err);
      })

  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleCardClick = async (employeeId) => {
    const token = localStorage.getItem("token")
    const { data } = await axios.get(`http://localhost:3000/employees/${employeeId}`, {
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        })
    setSelectedEmployee(data);
    setDialogOpen(true);
  };

  const handleDeleteComplete = () => {
    setDialogOpen(false);
    fetchEmployees(); // refresh list
  };

    return (
    <div className="bg-gray-900 text-white pt-8">
      <div className="flex flex-wrap gap-3">
        {employees.map((emp, idx) => (
          <div className="cursor-pointer" key={idx} onClick={() => handleCardClick(emp._id)}>
            <ProfileCard {...emp} />
          </div>
        ))}
      </div>
      <EmployeeDetailDialog
        isOpen={dialogOpen}
        employee={selectedEmployee}
        onClose={() => setDialogOpen(false)}
        onDelete={handleDeleteComplete}
      />
    </div>
  );
};

export default AllEmployees;
