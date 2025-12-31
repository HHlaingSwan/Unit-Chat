import { create } from "zustand";
import fetcher from "../lib/fetch";
import type { User, Message, NewMessage } from "../types";
import toast from "react-hot-toast";

interface ChatState {
  users: User[];
  selectedUser: User | null;
  messages: Message[];
  isLoadingMessages: boolean;
  isUsersLoading: boolean;
  isSendingMessage: boolean;
  selectUser: (user: User) => void;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (message: NewMessage) => Promise<void>;
}

const useChatStore = create<ChatState>((set, get) => ({
  users: [],
  isUsersLoading: false,
  isSendingMessage: false,
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await fetcher.get<User[]>("/message/contacts");
      set({ users: res });
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  selectedUser: null,
  messages: [],
  isLoadingMessages: false,
  getMessages: async (userId) => {
    set({ isLoadingMessages: true });
    try {
      const res = await fetcher.get<Message[]>(`/message/${userId}`);
      set({ messages: res });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ messages: [] });
    } finally {
      set({ isLoadingMessages: false });
    }
  },
  selectUser: (user) => {
    set({ selectedUser: user });
    get().getMessages(user._id);
  },
  sendMessage: async (message) => {
    set({ isSendingMessage: true });
    try {
      const formData = new FormData();
      if (message.text) {
        formData.append("text", message.text);
      }
      if (message.image) {
        formData.append("image", message.image);
      }
      const res = await fetcher.post<Message>(
        `/message/send/${get().selectedUser?._id}`,
        formData
      );
      set((state) => ({
        messages: [...state.messages, res],
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      set({ isSendingMessage: false });
    }
  },
}));

export default useChatStore;
