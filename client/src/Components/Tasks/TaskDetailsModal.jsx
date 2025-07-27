// TaskDetailsModal.jsx
import React from 'react';

function TaskDetailsModal({ isOpen, onClose, task }) {
  const user = localStorage.getItem('username');

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-gray-300 rounded-lg shadow-lg w-full max-w-4xl flex font-mono overflow-hidden">
        {/* Left Panel */}
        <div className="w-full lg:w-2/3 p-6 border-r border-gray-600">
          <input
            type="text"
            value={task.name}
            disabled
            className="w-full p-3 rounded-md bg-gray-700 mb-4 text-white placeholder-gray-400 opacity-60 cursor-not-allowed"
          />

          <textarea
            value={task.description || ''}
            disabled
            rows="6"
            className="w-full p-3 rounded-md bg-gray-700 mb-4 text-white placeholder-gray-400 opacity-60 cursor-not-allowed"
          ></textarea>

          <div className="flex gap-4 mb-6">
            <button disabled className="bg-gray-700 px-4 py-2 text-sm opacity-40 cursor-not-allowed">📎 Attach File</button>
            <button disabled className="bg-gray-700 px-4 py-2 text-sm opacity-40 cursor-not-allowed">🖼️ Attach Image</button>
          </div>

          <div className="flex gap-4">
            <button
              className="text-gray-400 hover:underline text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/3 p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Status</label>
            <input
              value={task.status}
              disabled
              className="w-full bg-gray-900 text-white px-2 py-1 rounded-md opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Priority</label>
            <input
              value={task.priority}
              disabled
              className="w-full bg-gray-900 text-white px-2 py-1 rounded-md opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Schedule Task</label>
            <input
              type="date"
              value={task.scheduleDate ? task.scheduleDate.slice(0, 10) : ''}
              disabled
              className="w-full bg-gray-900 text-white px-2 py-1 rounded-md opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Estimated Time</label>
            <input
              type="time"
              value={task.estimatedTime || ''}
              disabled
              className="w-full bg-gray-900 text-white px-2 py-1 rounded-md opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Due Date</label>
            <input
              type="date"
              value={task.dueDate ? task.dueDate.slice(0, 10) : ''}
              disabled
              className="w-full bg-gray-900 text-white px-2 py-1 rounded-md opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Assignee</label>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold">
                {task.assignee?.firstName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-white">{task.assignee?.firstName} {task.assignee?.lastName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsModal;
