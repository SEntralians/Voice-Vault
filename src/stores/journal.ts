import { create } from "zustand";

interface JournalState {
  id: string | null;
  setId: (id: string) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  id: null,
  setId: (id: string) => set({ id }),
}));
