import { create } from "zustand";
import fetcher from "../lib/fetch"; // Our custom fetch wrapper
import type { User, LoginData, SignupData } from "../types"; // Type definitions for User, LoginData, etc.
import { toast } from "react-hot-toast"; // For displaying nice notifications to the user

/**
 * @description
 * This file sets up our authentication store using Zustand.
 * Zustand is a small, fast, and scalable bearbones state-management solution.
 * It's simpler than Redux and great for managing global application state like user authentication status.
 *
 * Why use a store?
 * - Centralized state: All authentication-related data and functions are in one place.
 * - Easy to access: Components can "subscribe" to parts of this store and re-render only when needed.
 * - Predictable state changes: All changes happen through defined actions, making debugging easier.
 */

// -----------------------------------------------------------------------------
// 1. State Definition: What kind of data does our authentication store hold?
// -----------------------------------------------------------------------------
interface State {
  authUser: User | null; // Stores the currently logged-in user's data, or null if not authenticated.
  isCheckingAuth: boolean; // True while the app is verifying the user's authentication status (e.g., on initial load).
  isLoading: boolean; // True when any auth-related API call (login, signup, logout) is in progress.
}

// -----------------------------------------------------------------------------
// 2. Actions Definition: What can we DO with our authentication store?
// -----------------------------------------------------------------------------
interface Actions {
  checkAuth: () => Promise<void>; // Function to check if a user is currently authenticated.
  login: (data: LoginData) => Promise<void>; // Function to handle user login.
  signup: (data: SignupData) => Promise<boolean>; // Function to handle user registration. Returns true on success, false on failure.
  logout: () => Promise<void>; // Function to handle user logout.
}

// -----------------------------------------------------------------------------
// 3. Combine State and Actions: The complete type for our authentication store.
// -----------------------------------------------------------------------------
type AuthStore = State & Actions;

// -----------------------------------------------------------------------------
// 4. Create the Zustand Store: This is where the magic happens!
// -----------------------------------------------------------------------------
const useAuthStore = create<AuthStore>((set) => ({
  // Initial state values
  authUser: null,
  isCheckingAuth: true, // We assume we need to check auth status when the app starts
  isLoading: false,

  /**
   * @description
   * Checks the user's authentication status. This is typically called once when the app loads
   * to see if there's an existing session (e.g., a valid cookie).
   */
  checkAuth: async () => {
    // Set loading states to true while the check is in progress
    set({ isLoading: true, isCheckingAuth: true });
    try {
      // Make a GET request to a protected endpoint.
      // The backend will respond with user data if authenticated, or an error if not.
      const res = await fetcher.get<any>("/auth/protected");

      // IMPORTANT: Backend response consistency check
      // The backend can send the user object in different ways (e.g., directly, nested under 'user', or nested under 'data.user').
      // This line tries to find the user object in any of these common structures.
      const user = res.data?.user || res.user || res;
      set({ authUser: user, isCheckingAuth: false });
    } catch (error: any) {
      // If an error occurs (e.g., 401 Unauthorized), display a toast and clear authUser.
      // `error.response?.data?.message` safely tries to access the error message from our fetcher wrapper.
      toast.error(error.response?.data?.message || "An error occurred");
      set({ authUser: null, isCheckingAuth: false });
    } finally {
      // This block always runs, regardless of success or failure.
      // It ensures that loading states are reset.
      set({ isLoading: false, isCheckingAuth: false });
    }
  },

  /**
   * @description
   * Handles user login. Sends user credentials to the backend.
   * @param data - An object containing user's email and password.
   */
  login: async (data: LoginData) => {
    set({ isLoading: true }); // Indicate that a login operation is in progress
    try {
      // Make a POST request to the login endpoint with user credentials.
      const res = await fetcher.post<any>("/auth/login", data);

      // IMPORTANT: Backend response consistency check
      // This part of the code expects `res.data?.success` and `res.data?.message` for error checking,
      // but then directly uses `res.user` and `res.message` for success.
      // This suggests potential inconsistency in backend response structures or
      // different expected success/error formats than in `checkAuth` or `signup`.
      // It might be safer to unify the response handling logic across all functions.
      if (res.data?.success === false) {
        toast.error(res.message); // Display specific error message if present
        set({ authUser: null }); // Ensure authUser is null on failed login
        return; // Stop execution
      }

      const user = res.user; // Assuming the user object is directly under `res.user` for successful login
      set({ authUser: user }); // Set the logged-in user in the store
      toast.success(res.message); // Display success message
    } catch (error: any) {
      // Catch any errors thrown by `fetcher.post` (e.g., network issues, non-2xx responses)
      toast.error(error.response?.message || "Login failed"); // Display error message
      set({ authUser: null }); // Clear authUser on error
    } finally {
      set({ isLoading: false }); // Reset loading state
    }
  },

  /**
   * @description
   * Handles user registration (signup). Sends new user details to the backend.
   * After successful signup, the user is NOT automatically logged in, but redirected to the login page.
   * @param data - An object containing new user's username, email, and password.
   * @returns `true` if signup was successful, `false` otherwise.
   */
  signup: async (data: SignupData): Promise<boolean> => {
    set({ isLoading: true }); // Indicate that a signup operation is in progress
    try {
      // Make a POST request to the signup endpoint.
      // We don't care about the response data here, only if it succeeded or failed.
      await fetcher.post("/auth/signup", data);
      toast.success("Signed up successfully"); // Display success message
      return true; // Indicate success
    } catch (error: any) {
      // Catch errors, display toast, and return false
      toast.error(error.response?.message || "Sign up failed");
      return false; // Indicate failure
    } finally {
      set({ isLoading: false }); // Reset loading state
    }
  },

  /**
   * @description
   * Handles user logout. Invalidates the user's session on the backend.
   */
  logout: async () => {
    set({ isLoading: true }); // Indicate that a logout operation is in progress
    try {
      // Make a POST request to the logout endpoint.
      const res = await fetcher.post<any>("/auth/logout", {});

      // IMPORTANT: Backend response consistency check
      // Similar to login, this checks `res.data?.success` for error,
      // but then uses `res.message` directly for success.
      // This also suggests potential inconsistency in backend response structures.
      if (res.data?.success === false) {
        toast.error(res.message); // Display specific error message if present
        set({ authUser: null }); // Clear authUser on failed logout (though usually logout itself shouldn't fail drastically)
        return;
      }
      set({ authUser: null }); // Clear the logged-in user from the store
      toast.success(res.message); // Display success message
    } catch (error: any) {
      // Catch errors and display toast
      toast.error(error.response?.message || "Logout failed");
    } finally {
      set({ isLoading: false }); // Reset loading state
    }
  },
}));

export default useAuthStore;
