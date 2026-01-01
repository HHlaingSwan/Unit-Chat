import React, { useState, useRef, useEffect } from "react";
import useAuthStore from "../../store/useAuthStore";
import type { Message as MessageType } from "../../types";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { FiEdit, FiTrash } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { text, senderId, image, createdAt, seen } = message;

  const { authUser } = useAuthStore();
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isSender = senderId === authUser?._id;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

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
              <FaCheck size={12} className="text-gray-500" />
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
              {image && (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <img
                      src={image}
                      alt="Chat"
                      className="rounded-lg max-w-xs cursor-pointer"
                    />
                  </DialogTrigger>
                  <DialogContent className="p-0 border-none bg-transparent max-w-[90vw] max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle className="sr-only">Image</DialogTitle>
                      <DialogDescription className="sr-only">
                        Full-screen image view
                      </DialogDescription>
                    </DialogHeader>
                    <img
                      src={image}
                      alt="Chat"
                      className="w-full h-full object-contain"
                    />
                  </DialogContent>
                </Dialog>
              )}
              {text && (
                <p
                  className={`py-1 px-2 ${
                    isSender ? "text-right" : "text-left"
                  }`}
                >
                  {text}
                </p>
              )}
            </div>

            {isHovered && isSender && (
              <div className="relative" ref={menuRef}>
                <button
                  className="text-gray-300 hover:text-gray-700"
                  onClick={() => setShowMenu((prev) => !prev)}
                >
                  <BsThreeDots size={20} />
                </button>
                {showMenu && (
                  <div className="absolute top-full right-0 bg-white border rounded-md shadow-lg z-10 flex flex-col">
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                      <FiEdit size={16} />
                      <span>Edit</span>
                    </button>
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100">
                      <FiTrash size={16} />
                      <span>Delete</span>
                    </button>
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
