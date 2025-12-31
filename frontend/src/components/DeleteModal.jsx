// src/components/DeleteModal.jsx
import React, { createContext, useContext, useState } from 'react';

const DeleteContext = createContext();

export const DeleteProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [opportunityId, setOpportunityId] = useState(null);
  const [onDelete, setOnDelete] = useState(() => () => {});

  const openModal = (id, deleteHandler) => {
    setOpportunityId(id);
    setOnDelete(() => deleteHandler);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const confirmDelete = async () => {
    await onDelete(opportunityId);
    closeModal();
  };

  return (
    <DeleteContext.Provider value={{ openModal }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Opportunity?</h3>
              <p className="text-gray-600">This action cannot be undone. This will permanently delete the opportunity.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-xl hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition font-medium"
              >
                Delete Opportunity
              </button>
            </div>
          </div>
        </div>
      )}
    </DeleteContext.Provider>
  );
};

export const useDeleteModal = () => {
  const context = useContext(DeleteContext);
  if (!context) throw new Error('useDeleteModal must be used within DeleteProvider');
  return context;
};

// Usage in OpportunityCard: <DeleteButton opportunityId={opportunity._id} />
export const DeleteButton = ({ opportunityId }) => {
  const { openModal } = useDeleteModal();
  const handleDelete = async (id) => {
    // API call: await fetch(/api/opportunities/${id}, { method: 'DELETE' });
    console.log('Deleting:', id);
  };

  return (
    <button
      onClick={() => openModal(opportunityId, handleDelete)}
      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
    >
      Delete
    </button>
  );
};


// src/components/StatusBadge.jsx
const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
    status === 'Open' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }`}>
    {status}
  </span>
);
export default StatusBadge;