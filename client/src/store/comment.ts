import { create } from "zustand";

interface CommentStore {
  selectedCommentId: number | null;
  setSelectedCommentId: (id: number | null) => void;
  clearSelectedCommentId: () => void;
}

const useCommentStore = create<CommentStore>((set) => ({
  selectedCommentId: null,
  setSelectedCommentId: (id) => set({ selectedCommentId: id }),
  clearSelectedCommentId: () => set({ selectedCommentId: null }),
}));

export default useCommentStore;
