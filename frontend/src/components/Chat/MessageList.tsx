import Message from "./Message";
import useChatStore from "../../store/useChatStore";

const MessageSkeleton = ({ isSender }: { isSender: boolean }) => {
  return (
    <div
      className={`flex items-start gap-3 mb-4 ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      {!isSender && (
        <div className="h-10 w-10 bg-amber-800 rounded-full animate-pulse" />
      )}
      <div
        className={`flex flex-col gap-2 ${
          isSender ? "items-end" : "items-start"
        } flex-1`}
      >
        <div
          className={`h-4 ${
            isSender ? "w-2/3 bg-blue-800" : "w-3/4 bg-slate-800"
          } rounded-lg animate-pulse`}
        />
        <div
          className={`h-4 ${
            isSender ? "w-1/3 bg-blue-700" : "w-1/2 bg-slate-700"
          } rounded-lg animate-pulse`}
        />
      </div>
      {isSender && (
        <div className="h-10 w-10 bg-blue-800 rounded-full animate-pulse" />
      )}
    </div>
  );
};

const MessageList = () => {
  const { messages, isLoadingMessages } = useChatStore();

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {isLoadingMessages ? (
        // Alternate sender/receiver skeletons
        [...Array(3)].map((_, i) => (
          <MessageSkeleton key={i} isSender={i % 2 === 1} />
        ))
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full w-full text-center text-white/50  rounded-lg p-6">
          <img
            src="Empty.png"
            alt="empty chat"
            className="w-32 max-w-full h-auto  object-contain"
            style={{ minWidth: "420px" }}
          />
          <p className="mt-2 text-lg font-medium">opps! no messages yet</p>
        </div>
      ) : (
        messages.map((message) => (
          <Message key={message._id} message={message} />
        ))
      )}
    </div>
  );
};

export default MessageList;
