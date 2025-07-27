import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react'; // using Lucide for icon (optional)

function CreateProject({ isOpen, onClose }) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [employees, setEmployees] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [showUserList, setShowUserList] = useState(false);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get('http://localhost:3000/employees',{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
      setEmployees(res.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error.message);
    }
  };

  const handleAddUser = () => {
    setShowUserList(!showUserList);
    if (employees.length === 0) fetchEmployees();
  };

  const handleSelectUser = (user) => {
    const alreadyExists = participants.some(p => p._id === user._id);
    if (!alreadyExists) {
      setParticipants(prev => [...prev, user]);
    }
    setShowUserList(false);
  };

  const handleRemoveUser = (userId) => {
    setParticipants(prev => prev.filter(p => p._id !== userId));
  };

  const handleCancel = () => {
    setProjectName('');
    setDescription('');
    setParticipants([]);
    onClose();
  };

  const handleCreateProject = async () => {
    const data = {
      name: projectName,
      description,
      participants: participants.map(p => p._id),
    };

    try {
      const token = localStorage.getItem("token")
      const res = await axios.post('http://localhost:3000/projects', data,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
      console.log('Project created:', res.data);
      alert('Project created successfully!');
      handleCancel(); // Clear and close modal
      window.location.reload(); // Refresh the page to see the new project
    } catch (error) {
      console.error('Error creating project:', error.message);
      alert('Failed to create project.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-lg p-6 space-y-6 text-white">
        <h3 className="font-semibold mb-3 text-lg">Create Project</h3>
        <hr />

        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none"
        />

        <div className="flex mt-4 justify-between items-center text-sm">
          <span className="text-gray-300">Participants</span>
          <span className="text-orange-500 cursor-pointer" onClick={handleAddUser}>
            + Add User
          </span>
        </div>

        <div className="space-y-3">
          {participants.map((user) => (
            <div key={user._id} className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {user.firstName?.[0] || '?'}
                </div>
                <div>
                  <div className="font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-300">{user.jobProfile}</div>
                </div>
              </div>
              <button onClick={() => handleRemoveUser(user._id)} className="text-gray-300 hover:text-red-500">
                <X size={18} />
              </button>
            </div>
          ))}
        </div>

        {showUserList && (
          <div className="border border-gray-700 rounded-md p-3 mt-2 max-h-40 overflow-y-auto bg-gray-900 text-sm">
            {employees.map(emp => (
              <div
                key={emp._id}
                className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                onClick={() => handleSelectUser(emp)}
              >
                {emp.firstName} {emp.lastName} - {emp.jobProfile}
              </div>
            ))}
          </div>
        )}

        <textarea
          placeholder="Write here.."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-32 bg-transparent border border-gray-900 rounded-md p-2 text-sm placeholder-gray-500 resize-none"
        />

        <div className="flex justify-end mt-5">
          <button onClick={handleCancel} className="text-gray-400">Cancel</button>
          <button
            onClick={handleCreateProject}
            style={{ borderRadius: '10px', marginLeft: '2rem' }}
            className="bg-orange-500 text-white px-4 py-2"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;
