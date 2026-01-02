import { useState } from "react";
import useChatStore from "../../store/useChatStore";
import { Crown, ArrowLeft, ChessQueen } from "lucide-react";
import { formatLastSeen } from "../../lib/utils";

const ChatHeader = () => {
  const { selectedUser, unselectUser, onlineUsers, setViewedUserProfile } =
    useChatStore();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  return (
    <div className="border-b border-white/20 lg:p-4 p-2 flex items-center">
      <button
        onClick={unselectUser}
        className="lg:hidden p-2 rounded-full hover:bg-white/10 mr-4 active:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <ArrowLeft />
      </button>
      <button
        onClick={() => {
          // Only trigger profile view on mobile (screen width < lg breakpoint)
          if (window.innerWidth < 1024 && selectedUser) {
            setViewedUserProfile(selectedUser);
          }
        }}
        onMouseEnter={() => setIsPopoverVisible(true)}
        onMouseLeave={() => setIsPopoverVisible(false)}
        className="relative lg:w-14 lg:h-14 w-11 h-11 rounded-full mr-4 cursor-pointer active:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <img
          className="w-full h-full object-cover rounded-full"
          src={selectedUser?.profileImage || "none.png"}
          alt={selectedUser?.username}
        />
        {isPopoverVisible && (
          <div className="absolute lg:block hidden top-0 left-full ml-2 w-64 h-64 bg-gray-800 border border-white/20 rounded-md z-10">
            <img
              className="w-full h-full object-cover rounded-md"
              src={selectedUser?.profileImage || "none.png"}
              alt=""
            />
          </div>
        )}
      </button>
      <div>
        <h2 className="text-xl font-bold flex items-center">
          {selectedUser?.username}
          {selectedUser?._id === "694df5158cb375c4c160fa72" && (
            <span className="text-yellow-400 ml-2">
              <Crown className="inline-block w-6 h-6 " />
            </span>
          )}
          {selectedUser?._id === "694df3fbe6d1929abe5e2164" && (
            <span className="text-yellow-400 ml-2">
              <ChessQueen className="inline-block w-6 h-6 " />
            </span>
          )}
        </h2>
        <p className="text-xs text-gray-400">
          {isOnline ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Online
            </span>
          ) : (
            selectedUser && `Last seen ${formatLastSeen(selectedUser.lastSeen)}`
          )}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
