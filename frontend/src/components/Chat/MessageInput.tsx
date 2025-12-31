import React, { useState, type ChangeEvent } from "react";
import useChatStore from "../../store/useChatStore";
import { Link, Send, Loader } from "lucide-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { sendMessage, isSendingMessage } = useChatStore();

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text && !image) return;

    sendMessage({
      text,
      image,
    }).then(() => {
      // Reset form only after the message is sent
      setText("");
      setImage(null);
      setPreviewUrl(null);
    });
  };

  return (
    <div className="p-4 border-t border-white/20">
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
            disabled={isSendingMessage}
          >
            X
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center">
        <label htmlFor="file-upload" className="cursor-pointer mr-4">
          <Link className="h-6 w-6 text-gray-400 hover:text-white" />
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSendingMessage}
          />
        </label>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isSendingMessage}
        />
        <button
          type="submit"
          className="ml-4 px-4 py-2 bg-indigo-600 rounded-lg text-white font-semibold hover:bg-indigo-700 disabled:bg-indigo-400"
          disabled={isSendingMessage}
        >
          {isSendingMessage ? (
            <Loader className="animate-spin" />
          ) : (
            <Send />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
