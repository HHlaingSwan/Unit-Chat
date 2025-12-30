import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";

const ChatLayout = () => {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center">
      <img
        src="/bg.png"
        alt="background"
        className="absolute top-0 left-0 h-full w-full object-cover"
      />
      <div className="relative flex h-[90vh] w-[90vw] max-w-6xl rounded-2xl border border-white/20 bg-black/30 text-white shadow-2xl backdrop-blur-lg">
        <Sidebar />
        <ChatArea />
      </div>
    </div>
  );
};

export default ChatLayout;
