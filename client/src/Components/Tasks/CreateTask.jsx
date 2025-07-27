import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CreateTask({ isOpen, onClose }) {
  const { projectId } = useParams(); // to attach task to the correct project
  const user = localStorage.getItem('username'); // Get user ID from local storage
  const token = localStorage.getItem("token")
  const assignee = localStorage.getItem("employeeId")
  



  // State for form values
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'Active',
    priority: 'Low',
    scheduleDate: '',
    estimatedTime: '',
    dueDate: '',
  });

  // TEMP: Replace this with logged-in user ID when auth is implemented

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        assignee: assignee,
        project: projectId,
      };

      await axios.post(`http://localhost:3000/projects/${projectId}/tasks`, payload,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
      alert("Task created successfully!");
      onClose();
      window.location.reload(); // Optional: to refresh the task table
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-gray-300 rounded-lg shadow-lg w-full max-w-4xl flex font-mono overflow-hidden">
        {/* Left Panel */}
        <div className="w-full lg:w-2/3 p-6 border-r border-gray-600">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Task Name"
            className="w-full p-3 rounded-md bg-gray-700 mb-4 text-white placeholder-gray-400"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Task Description"
            rows="6"
            className="w-full p-3 rounded-md bg-gray-700 mb-4 text-white placeholder-gray-400"
          ></textarea>

          <div className="flex gap-4 mb-6">
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 text-sm">📎 Attach File</button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 text-sm">🖼️ Attach Image</button>
          </div>

          <div className="flex gap-4">
            <button className="text-gray-400 hover:underline text-sm" onClick={onClose}>Cancel</button>
            <button
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md text-sm shadow-lg"
            >
              Create Task
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/3 p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full bg-gray-900 text-white px-2 py-1 rounded-md">
              <option value="Active">🔴 Active</option>
              <option value="in-progress">🟠 In Progress</option>
              <option value="completed">🟢 completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="w-full bg-gray-900 text-white px-2 py-1 rounded-md">
              <option value="High">🔼 High</option>
              {/* <option value="Medium">⏺️ Medium</option> */}
              <option value="Low">🔽 Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Schedule Task</label>
            <input
              type="date"
              name="scheduleDate"
              value={form.scheduleDate}
              onChange={handleChange}
              className="w-full bg-gray-900 text-white px-2 py-1 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Estimated Time</label>
            <input
              type="time"
              step="60"
              name="estimatedTime"
              value={form.estimatedTime}
              onChange={handleChange}
              className="w-full bg-gray-900 text-white px-2 py-1 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full bg-gray-900 text-white px-2 py-1 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Assignee</label>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold">
                {user ? user.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-white">{user}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;
