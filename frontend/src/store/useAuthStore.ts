import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  isLoading: false,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
}));

export default useAuthStore;
