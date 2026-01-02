import { create } from "zustand";
import fetcher from "../lib/fetch"; // Our custom fetch wrapper
import type { User, LoginData, SignupData } from "../types"; // Type definitions for User, LoginData, etc.
import { toast } from "react-hot-toast"; // For displaying nice notifications to the user
import useChatStore from "./useChatStore";

interface AuthStore {
  authUser: User | null;
  isCheckingAuth: boolean;
  isLoading: boolean;
  isKing: boolean;
  checkAuth: () => void; // This is now a synchronous function that checks localStorage first.
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (
    updatedUser: Partial<User>,
    profileImage?: File
  ) => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  // Initial state values
  authUser: null,
  isCheckingAuth: true,
  isLoading: false,
  isKing: false,

  /**
   * @description
   * Checks for a persisted user session in localStorage and validates its 7-day expiration.
   * This is called on app load to restore a user's session without needing an immediate backend call.
   */
  checkAuth: () => {
    set({ isCheckingAuth: true });
    try {
      const storedUser = localStorage.getItem("authUser");
      const storedTimestamp = localStorage.getItem("loginTimestamp");

      if (storedUser && storedTimestamp) {
        const user = JSON.parse(storedUser);
        // Check if the user is the king
        if (user && user._id === "694df5158cb375c4c160fa72") {
          set({ isKing: true });
        } else {
          set({ isKing: false });
        }

        const timestamp = JSON.parse(storedTimestamp);
        const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

        // Check if the session has expired
        if (Date.now() - timestamp > sevenDays) {
          toast.error("Your session has expired. Please log in again.");
          localStorage.removeItem("authUser");
          localStorage.removeItem("loginTimestamp");
          set({ authUser: null });
        } else {
          // Session is valid, restore it
          set({ authUser: user });
          useChatStore.getState().connectSocket();
        }
      }
    } catch (error) {
      // If there's any error parsing localStorage, clear it to be safe.
      localStorage.removeItem("authUser");
      localStorage.removeItem("loginTimestamp");
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  /**
   * @description
   * Handles user login. On success, it persists the user and timestamp to localStorage.
   */
  login: async (data: LoginData) => {
    set({ isLoading: true });
    try {
      const res = await fetcher.post<any>("/auth/login", data);
      console.log("res", res.user);

      if (res.success === false) {
        toast.error(res.message);
        set({ authUser: null });
        return;
      }

      set({ authUser: res.user });
      useChatStore.getState().connectSocket();

      // Persist user and timestamp to localStorage
      localStorage.setItem("authUser", JSON.stringify(res.user));
      localStorage.setItem("loginTimestamp", JSON.stringify(Date.now()));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      set({ authUser: null });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * @description
   * Handles user registration.
   * @returns `true` on success, `false` on failure.
   */
  signup: async (data: SignupData): Promise<boolean> => {
    set({ isLoading: true });
    try {
      await fetcher.post("/auth/signup", data);
      toast.success("Signed up successfully");
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Sign up failed");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * @description
   * Handles user logout. Clears the user session from the store and localStorage.
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await fetcher.post("/auth/logout", {});
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      useChatStore.getState().disconnectSocket();
      // Clear user from store and localStorage
      set({
        authUser: null,
        isLoading: false,
        isCheckingAuth: false,
        isKing: false,
      });
      localStorage.removeItem("authUser");
      localStorage.removeItem("loginTimestamp");
    }
  },

  updateUser: async (updatedUser: Partial<User>, profileImage?: File) => {
    try {
      const formData = new FormData();
      formData.append("user", JSON.stringify(updatedUser));
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
      const res = await fetcher.post<any>("/auth/profile", formData);
      if (res.success === false) {
        toast.error(res.message);
        return;
      }
      set({ authUser: res.user });
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  },
}));

export default useAuthStore;
