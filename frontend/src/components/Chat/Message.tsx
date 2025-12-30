import React from "react";
import useAuthStore from "../../store/useAuthStore";

interface MessageProps {
  message: {
    _id: string;
    text?: string; // Text is now optional
    senderId: string;
    imageUrl?: string; // Add imageUrl property
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { text, senderId, imageUrl } = message;
  const { authUser } = useAuthStore();

  const isSender = senderId === authUser?._id;

  const messageClass = isSender
    ? "bg-indigo-600 self-end"
    : "bg-gray-700 self-start";
  const containerClass = isSender ? "flex justify-end" : "flex justify-start";

  return (
    <div className={`mb-4 ${containerClass}`}>
      <div
        className={`p-3 rounded-lg max-w-lg ${
          imageUrl ? "bg-transparent" : messageClass
        }`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Chat" className="rounded-lg" />
        ) : (
          <p>{text}</p>
        )}
      </div>
    </div>
  );
};

export default Message;
