import { FaPlus, FaTable, FaThLarge } from 'react-icons/fa';
import CreateTask from './CreateTask';
import { useState } from 'react';

function Navbar() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const role = localStorage.getItem("role")

  return (
    <>
      <div className="flex justify-start border-b border-gray-700 items-center bg-gray-900 text-white px-6 py-4 w-full">
        <div className="flex items-center">
        {role==="admin" && (
          <button 
            onClick={() => setShowTaskForm(true)}
            className="flex items-center bg-orange-500 hover:bg-orange-600 rounded-md px-4 py-2"
            style={{ borderRadius: '0.375rem' }}
          >
            <FaPlus style={{ marginRight: '8px' }} /> 
            <span>Add New</span>
          </button>
          )}

          {/* Margin between buttons */}
          <div style={{ width: '16px' }}></div>

          {/* View Toggle Buttons */}
          <div className="flex bg-gray-700 rounded-full overflow-hidden text-sm font-medium">
            <button className="flex items-center px-4 py-2 bg-gray-800">
              <FaTable style={{ marginRight: '8px' }} />
              <span>Table View</span>
            </button>
            <button className="flex items-center px-4 py-2 text-gray-300 hover:text-white">
              <FaThLarge style={{ marginRight: '8px' }} />
              <span>Kanban Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: CreateTask Form */}
      <CreateTask isOpen={showTaskForm} onClose={() => setShowTaskForm(false)} />
    </>
  );
}

export default Navbar;
