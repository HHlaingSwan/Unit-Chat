import { useEffect } from "react";
import useChatStore from "../../store/useChatStore";
import useAuthStore from "../../store/useAuthStore";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

const UserSkeleton = () => {
  return (
    <div className="flex items-center p-2 mb-2 rounded-lg">
      <div className="h-10 w-10 bg-amber-800 rounded-full mr-4 animate-pulse" />
      <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
    </div>
  );
};

const Sidebar = () => {
  const { users, selectUser, selectedUser, isUsersLoading, getUsers } =
    useChatStore();
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="flex flex-col w-1/4 border-r border-white/20 p-4">
      {/* User Profile Section */}
      <div className="relative flex items-center gap-4 p-3 rounded-md ">
        <img
          src={authUser?.profileImage || "login.png"} // Use a default avatar if none is present
          alt={authUser?.username}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold truncate">
            {authUser?.username}
          </h3>
        </div>

        {/* Logout IconButton positioned at top-right of the profile card */}
        <button
          onClick={handleLogout}
          className="absolute right-3  cursor-pointer top-3 p-2 rounded-full hover:bg-white/10"
          title="Logout"
          aria-label="Logout"
        >
          <LogOut />
        </button>
      </div>
      <div className="border-b border-white/20 w-full  mb-4"></div>

      {/* Conversations List */}
      <h2 className="text-xl font-bold mb-4">Conversations</h2>
      <ul className="flex-1 overflow-y-auto">
        {isUsersLoading
          ? [...Array(5)].map((_, i) => <UserSkeleton key={i} />)
          : users
              .filter((user) => user.username !== authUser?.username) // Don't show the current user in the conversations list
              .map((user) => (
                <li
                  key={user._id}
                  className={`flex items-center p-2 mb-2 rounded-lg ${
                    selectedUser?._id === user._id
                      ? "bg-white/20 cursor-default"
                      : "hover:bg-white/10 cursor-pointer"
                  }`}
                  onClick={() =>
                    selectedUser?._id !== user._id && selectUser(user)
                  }
                >
                  <img
                    src={user.profileImage || "/login.png"} // Use a default avatar if none is present
                    alt={user.username}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <span>{user.username}</span>
                </li>
              ))}
      </ul>
    </div>
  );
};

export default Sidebar;
