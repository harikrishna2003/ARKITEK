import React, { useState, useEffect } from 'react';
import axios from 'axios';

function calculateDaysBetween(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInMs = end - start;
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function EmployeeLeaves() {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, index: null });
  const [members, setMembers] = useState([]);

  const employeeId = localStorage.getItem("employeeId")

  const handleContextMenu = (event, index) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.pageX, y: event.pageY, index });
  };





  useEffect(() => {
    if (!employeeId) return;
    
    const token = localStorage.getItem("token")
    axios.get(`http://localhost:3000/leaves/${employeeId}`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
      })
      .then((res) => {
        const now = new Date();
        const validLeaves = [];

        res.data.forEach(leave => {
          const endDate = new Date(leave.endDate);
          if (endDate > now) {
            validLeaves.push({
              id: leave._id,
              name: leave.name,
              role: leave.role,
              start: formatDate(leave.startDate),
              rawStart: leave.startDate,
              end: formatDate(leave.endDate),
              rawEnd: leave.endDate,
              days: calculateDaysBetween(leave.startDate, leave.endDate),
              remark: leave.remarks,
            });
          }
        });

        setMembers(validLeaves);
      })
      .catch((err) => {
        console.error("Error fetching employee leaves:", err);
      });
  }, [employeeId]);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu({ ...contextMenu, visible: false });
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [contextMenu]);

 

  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <h3 className="text-2xl font-semibold text-gray-300 mb-4 mt-5">
        Your Leave Records
      </h3>
       <hr />

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="text-gray-400 block w-full" style={{ minWidth: 700 }}>
            <tr className="border-b border-gray-700 flex w-full">
              <th className="p-4 w-20"> </th>
              <th className="p-4 w-60">Name</th>
              <th className="p-4 w-40">Start Date</th>
              <th className="p-4 w-40">End Date</th>
              <th className="p-4 w-32">Total Days</th>
              <th className="p-4 flex-1">Remarks</th>
            </tr>
          </thead>
          <tbody className="block w-full overflow-y-auto" style={{ maxHeight: "450px" }}>
            {members.map((member, index) => (
              <tr key={index} onContextMenu={(e) => handleContextMenu(e, index)} className="border-b border-gray-700 hover:bg-gray-800 flex w-full">
                <td className="p-4 w-20">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                </td>
                <td className="p-4 w-60">
                  <div className="text-white font-semibold">{member.name}</div>
                  <div className="text-sm text-gray-400">{member.role}</div>
                </td>
                <td className="p-4 w-40 text-orange-400 whitespace-nowrap">{member.start}</td>
                <td className="p-4 w-40 text-orange-400 whitespace-nowrap">{member.end}</td>
                <td className="p-4 w-32 text-gray-300 whitespace-nowrap">{member.days}</td>
                <td className="p-4 flex-1 text-gray-300">{member.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeLeaves;
