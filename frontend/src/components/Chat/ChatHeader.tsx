import useChatStore from "../../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="border-b border-white/20 p-4 flex justify-between items-center">
      <h2 className="text-xl font-bold">{selectedUser?.username}</h2>
    </div>
  );
};

export default ChatHeader;
