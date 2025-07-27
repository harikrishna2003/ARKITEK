import React, { useState, useEffect } from 'react';
import AddLeave from './AddLeave';
import axios from 'axios';

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




function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}



function LeaveTrack() {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, index: null });
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState([]);

  const handleContextMenu = (event, index) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.pageX, y: event.pageY, index });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleDeleteLeave = async () => {
    const leaveToDelete = members[contextMenu.index];
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:3000/leaves/${leaveToDelete.id}`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
      setMembers(members.filter((_, i) => i !== contextMenu.index));
    } catch (err) {
      console.error("Delete failed:", err);
    }
    handleCloseContextMenu();
  };

  const handleEditLeave = () => {
    setEditIndex(contextMenu.index);
    setShowModal(true);
    handleCloseContextMenu();
  };


  useEffect(() => {
    const token = localStorage.getItem("token")
    axios.get("http://localhost:3000/leaves",{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        })
      .then((res) => {
        const now = new Date();

        const validLeaves = [];
        const expiredLeaves = [];

        res.data.forEach(leave => {
          const endDate = new Date(leave.endDate);
          if (endDate <= now) {
            expiredLeaves.push(leave); // full leave object including _id
          } else {
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

        // Move expired leaves to history and then delete them
        expiredLeaves.forEach(leave => {
          const historyData = {
            name: leave.name,
            role: leave.role,
            startDate: leave.startDate,
            endDate: leave.endDate,
            remarks: leave.remarks,
          };

          // 1. POST to /leaveHistory
          axios.post("http://localhost:3000/leaveHistory", historyData,{
              headers: {
                Authorization:`Bearer ${token}`,
                'Content-Type':'application/json'
              }
            })
            .then(() => {
              console.log(`Leave ${leave._id} moved to history`);

              // 2. DELETE from /leaves after successful POST
              return axios.delete(`http://localhost:3000/leaves/${leave._id}`,{
                headers: {
                  Authorization:`Bearer ${token}`,
                  'Content-Type':'application/json'
                }
              });
            })
            .then(() => {
              console.log(`Leave ${leave._id} deleted from active leaves`);
            })
            .catch(err => {
              console.error(`Failed to process leave ${leave._id}:`, err);
            });
        });

        setMembers(validLeaves);
      })
      .catch((err) => {
        console.error("Error fetching leaves:", err);
      });
  }, []);


  useEffect(() => {
    const handleClickOutside = () => setContextMenu({ ...contextMenu, visible: false });
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [contextMenu]);




  const handleAdd = (newEntry) => {
    setMembers([...members, newEntry]);
  };

  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowModal(true)}
          style={{borderRadius: '10px'}}
          className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold"
        >
          + Add New
        </button>
      </div>
      <hr />

      <h3 className="text-2xl font-semibold text-gray-300 mb-4">All Member</h3>
      

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
          <tbody
            className="block w-full overflow-y-auto"
            style={{ maxHeight: "450px" }}
          >
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

      <AddLeave
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditIndex(null);
        }}
        onAdd={handleAdd}
        existing={editIndex !== null ? members[editIndex] : null}
      />

      {contextMenu.visible && (
        <ul
          className="absolute z-50 bg-gray-700 text-white rounded shadow-lg w-60"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={handleCloseContextMenu}
        >
          <li className="px-4 py-2 hover:text-red-600 cursor-pointer" onClick={handleEditLeave}>Update Leave</li>
          <li className="px-4 py-2 hover:text-red-600 cursor-pointer" onClick={handleDeleteLeave}>Delete Leave</li>
        </ul>
      )}

    </div>
  );
}

export default LeaveTrack;
