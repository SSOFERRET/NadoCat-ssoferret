import { create } from "zustand";

export type MessageType = "info" | "error";

interface AlertMessageItem {
  id: number;
  message: string;
  type: MessageType;
}

interface AlertMessageState {
  messages: AlertMessageItem[];
  addMessage: (message: string, type?: MessageType) => void;
  removeMessage: (id: number) => void;
}

const useAlertMessageStore = create<AlertMessageState>((set) => ({
  messages: [],
  addMessage: (message, type = "info") => {
    set((state) => ({
      messages: [...state.messages, { message, type, id: Date.now() }],
    }));
  },
  removeMessage: (id) => {
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    }));
  },
}));

export default useAlertMessageStore;
