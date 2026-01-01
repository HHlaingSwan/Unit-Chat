import { useEffect } from "react";
import useChatStore from "../../store/useChatStore";
import useAuthStore from "../../store/useAuthStore";
import { formatLastSeen } from "../../lib/utils";
import { Crown } from "lucide-react";

const UserSkeleton = () => {
  return (
    <div className="flex items-center p-2 mb-2 rounded-lg">
      <div className="h-10 w-10 bg-slate-800 rounded-full mr-4 animate-pulse" />
      <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
    </div>
  );
};

const ChatsView = () => {
  const { users, selectUser, selectedUser, isUsersLoading, getUsers, onlineUsers } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Chats</h2>
      <ul className="flex-1 overflow-y-auto">
        {isUsersLoading
          ? [...Array(8)].map((_, i) => <UserSkeleton key={i} />)
          : users
              .filter((user) => user.username !== authUser?.username)
              .map((user) => {
                const isOnline = onlineUsers.includes(user._id);
                return (
                  <li
                    key={user._id}
                    className={`flex items-center p-3 mb-2 rounded-lg transition-colors active:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      selectedUser?._id === user._id
                        ? "bg-white/20 cursor-default"
                        : "hover:bg-white/10 cursor-pointer"
                    }`}
                    onClick={() =>
                      selectedUser?._id !== user._id && selectUser(user)
                    }
                  >
                    <div className="relative">
                      <img
                        src={user.profileImage || "/login.png"}
                        alt={user.username}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      {isOnline && (
                        <div className="absolute bottom-0 right-4 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold">
                        {user.username}
                        {user._id === "694df5158cb375c4c160fa72" && (
                          <span className="text-blue-700 ml-2">
                            <Crown className="inline-block w-6 h-6" />
                          </span>
                        )}
                      </span>
                      {!isOnline && user.lastSeen && (
                        <p className="text-xs text-gray-400">
                          {formatLastSeen(user.lastSeen)}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
      </ul>
    </div>
  );
};

export default ChatsView;
