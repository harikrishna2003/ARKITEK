import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import AddEmployee from './AddEmployee';

function Navbar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex justify-start border-b border-gray-700 items-center bg-gray-900 text-white px-6 py-4 w-full">
        <div className="flex items-center">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-orange-500 hover:bg-orange-600 rounded-md px-4 py-2"
            style={{ borderRadius: '0.375rem' }}
          >
            <FaPlus style={{ marginRight: '8px' }} />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Modal Component */}
      <AddEmployee isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

export default Navbar;
