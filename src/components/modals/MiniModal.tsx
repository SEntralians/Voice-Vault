import React from "react";

interface ChatMessage {
  id: string;
  text: string;
}

interface MiniModalProps {
  chatMessage: ChatMessage;
  closeModal: () => void;
}

const MiniModal: React.FC<MiniModalProps> = ({ chatMessage, closeModal }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold">{chatMessage.text}</h2>
        {/* Additional details or content can be added here */}
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
