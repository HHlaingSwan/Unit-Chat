import { create } from "zustand";
import fetcher from "../lib/fetch";
import type { User, Message, NewMessage } from "../types";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import useAuthStore from "./useAuthStore";

interface ChatState {
  socket: Socket | null;
  users: User[];
  selectedUser: User | null;
  messages: Message[];
  isLoadingMessages: boolean;
  isUsersLoading: boolean;
  isSendingMessage: boolean;
  onlineUsers: string[];
  viewingUserProfile: User | null;
  isContact: boolean;
  selectUser: (user: User) => void;
  unselectUser: () => void;
  setViewedUserProfile: (user: User | null) => void;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (message: NewMessage) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
  acceptContact: (userId: string) => Promise<void>;
  blockContact: (userId: string) => Promise<void>;
}

const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  users: [],
  isUsersLoading: false,
  isSendingMessage: false,
  onlineUsers: [],
  viewingUserProfile: null,
  isContact: false,
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
      const res = await fetcher.get<{
        messages: Message[];
        isContact: boolean;
      }>(`/message/${userId}`);
      set({ messages: res.messages, isContact: res.isContact });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ messages: [], isContact: false });
    } finally {
      set({ isLoadingMessages: false });
    }
  },
  selectUser: (user) => {
    set({ selectedUser: user, viewingUserProfile: null }); // Ensure profile view is closed when a new user is selected
    get().getMessages(user._id);
  },
  unselectUser: () => {
    set({ selectedUser: null, messages: [] });
  },
  setViewedUserProfile: (user) => {
    set({ viewingUserProfile: user });
  },
  sendMessage: (message) => {
    const { socket, selectedUser } = get();
    if (!socket || !selectedUser) return;
    const authUser = useAuthStore.getState().authUser;
    if (!authUser) return;

    socket.emit("sendMessage", {
      ...message,
      receiverId: selectedUser._id,
      senderId: authUser._id,
    });
  },
  acceptContact: async (userId: string) => {
    try {
      await fetcher.post(`/user/accept/${userId}`, {});
      set({ isContact: true });
      toast.success("User accepted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to accept user");
    }
  },
  blockContact: async (userId: string) => {
    try {
      await fetcher.post(`/user/block/${userId}`, {});
      set({ isContact: false }); // or handle as blocked
      toast.success("User blocked");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to block user");
    }
  },
  connectSocket: () => {
    const authUser = useAuthStore.getState().authUser;
    if (!authUser) return;

    const url =
      import.meta.env.MODE === "development"
        ? "http://localhost:5500"
        : import.meta.env.VITE_API_BASE_URL;

    const newSocket = io(url, {
      query: {
        userId: authUser._id,
      },
    });

    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    newSocket.on("newMessage", (message) => {
      const selectedUser = get().selectedUser;
      if (
        selectedUser &&
        (selectedUser._id === message.senderId ||
          selectedUser._id === message.receiverId)
      ) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      } else {
        toast.success(`New message received`);
      }
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

export default useChatStore;
