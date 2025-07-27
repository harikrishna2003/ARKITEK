import React, { useEffect, useState } from 'react';

function EditTaskDialog({ isOpen, onClose, task, onUpdate }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (task) setFormData(task);
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onUpdate(formData);
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-gray-300 rounded-lg shadow-lg w-full max-w-4xl flex font-mono overflow-hidden">
        
        {/* Left Panel: Task Form */}
        <div className="w-full lg:w-2/3 p-6 border-r border-gray-600">
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="Task Name"
            className="w-full p-3 rounded-md bg-gray-700 mb-4 text-white placeholder-gray-400"
          />

          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Task Description"
            rows="6"
            className="w-full p-3 rounded-md bg-gray-700 mb-4 text-white placeholder-gray-400"
          ></textarea>

          <div className="flex gap-4 mb-6">
            <button style={{ borderRadius: '5px' }} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 text-sm flex items-center gap-2">
              📎 Attach File
            </button>
            <button style={{ borderRadius: '5px' }} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 text-sm flex items-center gap-2">
              🖼️ Attach Image
            </button>
          </div>

          <div className="flex gap-4">
            <button
              className="text-gray-400 hover:underline text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              style={{ borderRadius: '5px' }}
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md text-sm shadow-lg"
            >
              Update Task
            </button>
          </div>
        </div>

        {/* Right Panel: Info Inputs */}
        <div className="w-full lg:w-1/3 p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select
              name="status"
              value={formData.status || 'Active'}
              onChange={handleChange}
              className="w-full bg-gray-900 border-none text-white px-2 py-1 rounded-md focus:outline-none"
            >
              <option value="Active">🔴 Active</option>
              <option value="Inactive">🟢 Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority || 'Low'}
              onChange={handleChange}
              className="w-full bg-gray-900 border-none text-white px-2 py-1 rounded-md focus:outline-none"
            >
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
              value={formData.scheduleDate?.slice(0, 10) || ''}
              onChange={handleChange}
              className="w-full bg-gray-900 text-white px-2 py-1 rounded-md focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Estimated Time</label>
            <input
              type="text"
              name="estimatedTime"
              value={formData.estimatedTime || ''}
              onChange={handleChange}
              placeholder="e.g., 01 D : 02 H"
              className="w-full bg-gray-900 text-white px-2 py-1 rounded-md focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate?.slice(0, 10) || ''}
              onChange={handleChange}
              className="w-full bg-gray-900 text-white px-2 py-1 rounded-md focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Assignee</label>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold">
                {formData.assignee?.firstName?.[0] || 'A'}
              </div>
              <span className="text-white">
                {formData.assignee?.firstName} {formData.assignee?.lastName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTaskDialog;
