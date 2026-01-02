import React, { useState, type ChangeEvent } from "react";
import useChatStore from "../../store/useChatStore";
import { Link, Send, Loader } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import toast from "react-hot-toast";

interface MessageInputProps {
  disabled?: boolean;
}

const MessageInput = ({ disabled }: MessageInputProps) => {
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { sendMessage, isSendingMessage, selectedUser } = useChatStore();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  // 694df3fbe6d1929abe5e2164 Sayy
  // 694df5158cb375c4c160fa72 me
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text && !image) return;
    if (
      selectedUser?._id === "694df3fbe6d1929abe5e2164" &&
      authUser?._id !== "694df5158cb375c4c160fa72"
    ) {
      toast.error(`You are not authorized to send messages to my girlfriend.`);
      return;
    }
    await sendMessage({
      text,
      image,
    });
    setText("");
    setImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="p-2 border-t  border-white/20">
      {previewUrl && (
        <div className="relative w-32 h-32 mb-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
            disabled={isSendingMessage || disabled}
          >
            X
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center">
        <label htmlFor="file-upload" className="cursor-pointer mr-2 md:mr-4">
          <Link
            className={`h-5 w-5 md:h-6 md:w-6 ${
              text || disabled
                ? "text-gray-600 cursor-not-allowed"
                : "text-gray-400 hover:text-white"
            }`}
          />
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSendingMessage || !!text || disabled}
          />
        </label>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 md:p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-800 disabled:cursor-not-allowed"
          disabled={isSendingMessage || !!image || disabled}
        />
        <button
          type="submit"
          className="ml-2 md:ml-4 px-3 py-2 bg-indigo-600 rounded-lg text-white font-semibold hover:bg-indigo-700 disabled:bg-indigo-400"
          disabled={isSendingMessage || (!text && !image) || disabled}
        >
          {isSendingMessage ? (
            <Loader className="h-5 w-5 md:h-6 md:w-6 animate-spin" />
          ) : (
            <Send className="h-5 w-5 md:h-6 md:w-6" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
