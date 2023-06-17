/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import { api } from "~/utils/api";
import toast, { Toaster } from "react-hot-toast";
import { withAuth } from "~/middlewares";

const PADDING = 500;

interface StickyNote {
  id: string;
  text: string;
  position: { x: number; y: number };
}

const StickyNotes: React.FC = () => {
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
  const [newNoteText, setNewNoteText] = useState("");

  const { data: notes, refetch: refetchNotes } =
    api.note.getAllNotes.useQuery();
  const { mutate: addNote } = api.note.createNote.useMutation({
    onSuccess: async () => {
      await refetchNotes();
      setNewNoteText("");
      toast.success("Note added!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNoteText(event.target.value);
  };

  const handleNoteAdd = () => {
    if (newNoteText === "") {
      toast.error("Note cannot be empty!");
      return;
    }

    addNote({ content: newNoteText });
  };

  const handleNoteDrag = (
    index: number,
    newPosition: { x: number; y: number }
  ) => {
    const updatedStickyNotes = [...stickyNotes];
    (updatedStickyNotes[index] as StickyNote).position = newPosition;
    setStickyNotes(updatedStickyNotes);
  };

  useEffect(() => {
    if (notes) {
      setStickyNotes(
        notes.map((note) => ({
          id: note.id,
          position: {
            x: Math.floor(Math.random() * (window.innerWidth - PADDING)),
            y: Math.floor(Math.random() * (window.innerHeight - PADDING)),
          },
          text: note.content,
        }))
      );
    }
  }, [notes]);

  if (!notes) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-center text-3xl font-bold text-white">
        Freedom Wall
      </h1>
      <div className="mb-4">
        <textarea
          className="w-full rounded border p-2"
          value={newNoteText}
          onChange={handleNoteChange}
          maxLength={700}
        />
        <button
          className="mt-2 w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
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
      <Toaster />
    </div>
  );
};

export default withAuth(StickyNotes);
