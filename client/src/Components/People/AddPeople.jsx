import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AddPeople = ({ isOpen, onClose }) => {
  const { projectId } = useParams();
  const [search, setSearch] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const handleDone = async () => {
    const token = localStorage.getItem("token")
    
    try {
      const ids = selectedParticipants.map(p => p._id);

      const res = await axios.put(`http://localhost:3000/projects/${projectId}/participants`, {
        participants: ids
      },{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });

      alert(res.data.message || "Participants added successfully.");
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Error adding participants.");
      console.error("Add participants error:", error);
      onClose(); // Close the modal even if there's an error
    }
    setSelectedParticipants([]);
  };

  useEffect(() => {
     const token = localStorage.getItem("token")
    if (isOpen) {
      axios.get("http://localhost:3000/employees",{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        })// Make sure this endpoint exists
        .then(res => {
          setAllEmployees(res.data);
          setFilteredEmployees(res.data.slice(0, 3)); // initially show 3
        })
        .catch(err => console.error("Error fetching employees:", err));
    }
  }, [isOpen]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = allEmployees.filter(emp =>
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredEmployees(filtered.slice(0, 3));
  };

  const handleSelect = (emp) => {
    if (!selectedParticipants.find(p => p._id === emp._id)) {
      setSelectedParticipants([...selectedParticipants, emp]);
    }
    setSearch("");
    setFilteredEmployees([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#0d1b2a] text-white rounded-xl w-[550px] mx-10 my-10 shadow-lg p-8">
        {/* Header */}
        <h3 className="text-2xl font-mono">Add Participants</h3>

        {/* Search bar */}
        <div className="mb-4 relative">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Invite by name"
            className="w-full px-4 py-3 mt-3 bg-gray-700 text-white rounded-md focus:outline-none placeholder-gray-400"
          />
          {search && filteredEmployees.length > 0 && (
            <div className="absolute z-10 bg-gray-800 w-full mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {filteredEmployees.map(emp => (
                <div
                  key={emp._id}
                  className="p-3 hover:bg-gray-700 cursor-pointer flex items-center space-x-3"
                  onClick={() => handleSelect(emp)}
                >
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {emp.firstName[0]}
                  </div>
                  <div>
                    <div className="text-sm font-mono">{emp.firstName} {emp.lastName}</div>
                    <div className="text-xs text-gray-400">{emp.jobProfile}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Participants Label */}
        <div className="mb-2 text-sm text-gray-400">Participants</div>

        {/* Participants List */}
        {selectedParticipants.map(emp => (
          <div key={emp._id} className="flex items-center space-x-3 pb-2">
            <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {emp.firstName[0]}
            </div>
            <span className="text-base font-mono">{emp.firstName} {emp.lastName}</span>
          </div>
        ))}

        {/* Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-700">
          <span className="text-sm text-gray-400 font-mono">
            {selectedParticipants.length} User{selectedParticipants.length !== 1 ? "s" : ""} Selected
          </span>
          <button
            style={{ borderRadius: '10px' }}
            onClick={handleDone}
            className="bg-orange-500 px-8 py-2 rounded-full hover:bg-orange-600 text-white font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPeople;
