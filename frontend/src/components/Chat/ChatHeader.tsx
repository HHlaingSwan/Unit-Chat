import { useState } from "react";
import useChatStore from "../../store/useChatStore";
import { Crown } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser } = useChatStore();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  return (
    <div className="border-b border-white/20 p-4 flex items-center">
      <div
        className="relative w-14 h-14 rounded-full mr-4"
        onMouseEnter={() => setIsPopoverVisible(true)}
        onMouseLeave={() => setIsPopoverVisible(false)}
      >
        <img
          className="w-full h-full rounded-full"
          src={selectedUser?.profileImage || "login.png"}
          alt=""
        />
        {isPopoverVisible && (
          <div className="absolute top-0 left-full ml-2 w-64 h-64 bg-gray-800 border border-white/20 rounded-md z-10">
            <img
              className="w-full h-full rounded-md"
              src={selectedUser?.profileImage || "login.png"}
              alt=""
            />
          </div>
        )}
      </div>
      <h2 className="text-xl font-bold">
        {selectedUser?.username}{" "}
        <span className="text-amber-400 ml-1">
          <Crown className="inline-block w-6 h-6 " />
        </span>
      </h2>
    </div>
  );
};

export default ChatHeader;
