import { useState } from "react";
import { MessageSquare, User } from "lucide-react";
import ChatsView from "./ChatsView";
import ProfileView from "./ProfileView";
import { cn } from "../../lib/utils";

type View = "chats" | "profile";

const MobileLayout = () => {
  const [activeView, setActiveView] = useState<View>("chats");

  return (
    <div className="flex flex-col h-full w-full">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeView === "chats" && <ChatsView />}
        {activeView === "profile" && <ProfileView />}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center border-t border-white/20 bg-black/50 backdrop-blur-lg p-2">
        <button
          onClick={() => setActiveView("chats")}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors active:bg-white/10 focus:outline-none ",
            activeView === "chats"
              ? "text-indigo-400"
              : "text-gray-400 hover:text-white"
          )}
        >
          <MessageSquare />
          <span className="text-xs">Chats</span>
        </button>
        <button
          onClick={() => setActiveView("profile")}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors active:bg-white/10 focus:outline-none ",
            activeView === "profile"
              ? "text-indigo-400"
              : "text-gray-400 hover:text-white"
          )}
        >
          <User />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default MobileLayout;
