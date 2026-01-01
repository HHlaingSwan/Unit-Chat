import { Server } from "socket.io";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { envConfig } from "../db/env.js";

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: envConfig.CLIENT_URL,
      credentials: true,
    },
  });

  const userSocketMap = {}; // {userId: socketId}

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on(
      "sendMessage",
      async ({ senderId, receiverId, text, image }) => {
        try {
          const receiverSocketId = userSocketMap[receiverId];
          const newMessage = new Message({
            senderId,
            receiverId,
            text: text,
            image: image || "",
          });

          await newMessage.save();

          if (receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
          }
          // also send to sender
          io.to(socket.id).emit("newMessage", newMessage);
        } catch (error) {
          console.log("Error in sendMessage event", error);
        }
      }
    );

    // socket.on() is used to listen to the events. can be used both on client and server side
    socket.on("disconnect", async () => {
      console.log("user disconnected", socket.id);
      delete userSocketMap[userId];
      try {
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
      } catch (error) {
        console.log("Error updating lastSeen on disconnect", error);
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
};

export default initializeSocket;
