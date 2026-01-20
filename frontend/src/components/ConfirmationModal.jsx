
import { Dialog } from "@headlessui/react";

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this opportunity?",
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md mx-auto shadow-2xl dark:border dark:border-slate-700">
          <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-gray-600 dark:text-slate-400 mb-8">
            {message}
          </Dialog.Description>
          <div className="flex gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ConfirmationModal;