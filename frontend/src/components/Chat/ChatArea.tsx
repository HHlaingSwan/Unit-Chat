import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatArea = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatArea;
