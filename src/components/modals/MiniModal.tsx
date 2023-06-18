import React from "react";

interface MiniModalProps {
  chatMessage: string;
  closeModal: () => void;
}

const MiniModal: React.FC<MiniModalProps> = ({ chatMessage, closeModal }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-96 cursor-pointer rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-sm font-bold">{chatMessage}</h2>
        <button
          className="inline-flex items-center rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MiniModal;
