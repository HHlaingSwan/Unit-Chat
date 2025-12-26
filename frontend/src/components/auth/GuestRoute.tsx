import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../../store/useAuthStore";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCheckingAuth && authUser) {
      navigate("/");
    }
  }, [authUser, isCheckingAuth, navigate]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return !authUser ? children : null;
};

export default GuestRoute;
