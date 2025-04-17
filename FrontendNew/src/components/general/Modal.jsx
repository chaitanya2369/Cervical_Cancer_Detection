import React from "react";

const Modal = ({ isOpen, onClose, onSave, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-md shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-teal-400">
          <h2 className="text-2xl font-semibold text-black">{title || "Edit Details"}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors focus:outline-none text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-gray-50">
          {children}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-2 p-4 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2 rounded-lg bg-blue-400 text-white hover:bg-gray-600 font-medium transition-colors text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;