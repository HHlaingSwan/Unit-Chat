import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import useChatStore from "../../store/useChatStore";

const ChatArea = () => {
  const { selectedUser } = useChatStore();

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center w-3/4 h-full">
        <h2 className="text-2xl font-bold text-white/80">
          Select a conversation to start chatting
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-3/4">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatArea;
