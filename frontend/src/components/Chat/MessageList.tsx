import { useRef, useEffect } from "react";
import Message from "./Message";
import useChatStore from "../../store/useChatStore";

const MessageSkeleton = ({ isSender }: { isSender: boolean }) => {
  const skeletonWidths = ["w-48", "w-40", "w-32", "w-24"];
  const width1 =
    skeletonWidths[Math.floor(Math.random() * skeletonWidths.length)];
  const width2 =
    skeletonWidths[Math.floor(Math.random() * skeletonWidths.length)];

  return (
    <div
      className={`flex items-start gap-3 mb-4 ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      {!isSender && (
        <div className="skeleton w-10 h-10 rounded-full shrink-0" />
      )}
      <div
        className={`flex flex-col gap-2 ${
          isSender ? "items-end" : "items-start"
        }`}
      >
        <div className={`skeleton h-5 ${width1} rounded-md`} />
        <div className={`skeleton h-5 ${width2} rounded-md`} />
      </div>
      {isSender && <div className="skeleton w-10 h-10 rounded-full shrink-0" />}
    </div>
  );
};

const MessageList = () => {
  const { messages, isLoadingMessages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }, 0);
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto hide-scrollbar">
      {isLoadingMessages ? (
        <div className="flex flex-col gap-4">
          {[...Array(8)].map((_, i) => (
            <MessageSkeleton key={i} isSender={i % 2 === 0} />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full w-full text-center text-white/50  rounded-lg p-6">
          <p className=" text-2xl font-medium"> No Messages Yet</p>

          <img
            src="Empty.png"
            alt="empty chat"
            className="w-32 max-w-full h-auto  object-contain"
            style={{ minWidth: "420px" }}
          />
        </div>
      ) : (
        messages.map((message) => (
          <Message key={message._id} message={message} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
