import React, { useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import type { Message as MessageType } from "../../types";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { FiEdit, FiTrash } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { text, senderId, image, createdAt, seen } = message;
  const { authUser } = useAuthStore();
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);

  const isSender = senderId === authUser?._id;

  const bubbleClass = isSender
    ? "bg-blue-500 text-white rounded-l-xl rounded-t-xl"
    : "bg-gray-200 text-black rounded-r-xl rounded-t-xl";

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <div
        className={`mb-1 flex items-end gap-2 ${
          isSender ? "justify-end" : "justify-start"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isSender && (
          <div
            className={`text-xs text-gray-300 flex items-center gap-1 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <span>{formatTimestamp(createdAt)}</span>
            {seen ? (
              <FaCheckDouble size={12} className="text-blue-500" />
            ) : (
              <FaCheck size={12} className="text-gray-300" />
            )}
          </div>
        )}

        <div className="relative">
          <div
            className={`relative flex items-center gap-2 ${
              isSender ? "flex-row-reverse" : ""
            }`}
          >
            <div className={`p-3 max-w-lg ${bubbleClass}`}>
              {image ? (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <img
                      src={image}
                      alt="Chat"
                      className="rounded-lg max-w-xs cursor-pointer"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-4xl">
                    <img
                      src={image}
                      alt="Chat"
                      className="w-full h-full object-contain"
                    />
                  </DialogContent>
                </Dialog>
              ) : (
                <p>{text}</p>
              )}
            </div>

            {isHovered && (
              <div className="flex items-center gap-1">
                {/* <button className="text-gray-500 hover:text-gray-700">
                  <MdOutlineEmojiEmotions size={20} />
                </button> */}
                {isSender && (
                  <div className="relative group">
                    <button className="text-gray-500 hover:text-gray-700">
                      <BsThreeDots size={20} />
                    </button>
                    <div className="absolute top-  right-0  bg-white cursor-pointer border rounded-md shadow-lg z-10 hidden group-hover:block">
                      <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 rounded-md hover:bg-gray-100">
                        <FiEdit size={16} />
                        <span>Edit</span>
                      </button>
                      <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 rounded-md hover:bg-gray-100">
                        <FiTrash size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {!isSender && (
          <div
            className={`text-xs text-gray-300 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {formatTimestamp(createdAt)}
          </div>
        )}
      </div>
    </>
  );
};

export default Message;
