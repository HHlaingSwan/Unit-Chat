import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../../store/useAuthStore";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const localStorageAuthUser = localStorage.getItem("authUser");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCheckingAuth && !authUser && !localStorageAuthUser) {
      navigate("/login");
    }
  }, [authUser, isCheckingAuth, localStorageAuthUser]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        {/* You can replace this with a more sophisticated loading spinner */}
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return authUser ? children : null;
};

export default ProtectedRoute;
