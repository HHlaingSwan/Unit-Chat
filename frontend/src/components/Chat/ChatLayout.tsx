import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import useChatStore from "../../store/useChatStore";
import MobileLayout from "./MobileLayout";
import EmptyState from "./EmptyState";
import { cn } from "../../lib/utils";
import ProfileView from "./ProfileView";
import { ArrowLeft } from "lucide-react";
import bgImage from "../../assets/bg.png";

const ChatLayout = () => {
  const { selectedUser, viewingUserProfile, setViewedUserProfile } =
    useChatStore();

  return (
    <div className="relative flex h-screen w-screen items-center justify-center">
      <img
        src={bgImage}
        alt="background"
        className="absolute top-0 left-0 h-full w-full object-cover"
      />
      <div className="relative flex h-full w-full md:h-[90vh] md:w-[90vw] max-w-6xl lg:rounded-2xl border-white/20 bg-black/30 text-white shadow-2xl backdrop-blur-lg">
        {viewingUserProfile ? (
          <div className="w-full h-full flex flex-col">
            <div className="p-2 border-b border-white/20">
              <button
                onClick={() => setViewedUserProfile(null)}
                className="p-2 rounded-full hover:bg-white/10"
              >
                <ArrowLeft />
              </button>
            </div>
            <ProfileView user={viewingUserProfile} />
          </div>
        ) : (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:w-1/4">
              <Sidebar />
            </div>

            {/* Mobile Layout */}
            <div
              className={cn("w-full lg:hidden", {
                hidden: selectedUser,
              })}
            >
              <MobileLayout />
            </div>

            {/* Main Chat Area */}
            {selectedUser ? (
              <div className="w-full flex-col lg:flex-1 lg:flex">
                <ChatArea />
              </div>
            ) : (
              <div className="hidden lg:flex lg:flex-1">
                <EmptyState />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
