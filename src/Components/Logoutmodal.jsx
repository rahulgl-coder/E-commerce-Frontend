

import React from 'react';

const ConfirmLogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-[300px] text-center border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Logout</h2>
        <p className="mb-6 text-gray-600">Are you sure you want to log out?</p>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
