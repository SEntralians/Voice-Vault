/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";

interface StickyNote {
  id: string;
  text: string;
  position: { x: number; y: number };
}

const StickyNotes: React.FC = () => {
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
  const [newNoteText, setNewNoteText] = useState("");

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNoteText(event.target.value);
  };

  const handleNoteAdd = () => {
    const newNote: StickyNote = {
      id: Date.now().toString(),
      text: newNoteText,
      position: { x: 0, y: 0 },
    };

    setStickyNotes([...stickyNotes, newNote]);
    setNewNoteText("");
  };

  const handleNoteDrag = (
    index: number,
    newPosition: { x: number; y: number }
  ) => {
    const updatedStickyNotes = [...stickyNotes];
    (updatedStickyNotes[index] as StickyNote).position = newPosition;
    setStickyNotes(updatedStickyNotes);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <textarea
          className="w-full rounded border p-2"
          value={newNoteText}
          onChange={handleNoteChange}
          maxLength={700}
        />
        <button
          className="mt-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
          onClick={handleNoteAdd}
        >
          Add Note
        </button>
      </div>
      <div className="relative">
        {stickyNotes.map((note, index) => (
          <Draggable
            key={note.id}
            defaultPosition={note.position}
            onStop={(_event: DraggableEvent, data: DraggableData) =>
              handleNoteDrag(index, { x: data.x, y: data.y })
            }
          >
            <div className="max-h-xs max-w-xs overflow-auto rounded border border-yellow-500 bg-yellow-200 p-4 shadow-md">
              <div className="mb-2">{note.text}</div>
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default StickyNotes;
