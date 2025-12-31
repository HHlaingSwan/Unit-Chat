import cloudinary from "../db/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getAllContents = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    return res.status(200).json(filteredUser);
  } catch (error) {
    console.error("Error in getAllContents:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessageByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChat } = req.params;

    // Find messages between the logged-in user and the requested user.
    // Sorting by `createdAt: 1` returns messages in chronological order.
    // If you want sender/receiver details inline, add `.populate('senderId', 'fullName profileImage')`
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChat },
        { senderId: userToChat, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessageByUserId:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text: messageText } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let image = req.file;

    if (!messageText && !image) {
      return res.status(400).json({ message: "Message or image is required" });
    }
    if (senderId.toString() === receiverId) {
      return res
        .status(400)
        .json({ message: "You cannot send message to yourself" });
    }
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Upload image to Cloudinary if provided. `image` is expected to be a data URL
    // or a remote URL accepted by Cloudinary. Validate uploadResponse before using it.
    let imageUrl = null;
    if (image) {
      // Convert buffer to data URI
      const b64 = Buffer.from(image.buffer).toString("base64");
      let dataURI = "data:" + image.mimetype + ";base64," + b64;
      const uploadResponse = await cloudinary.uploader.upload(dataURI);
      if (!uploadResponse || !uploadResponse.secure_url) {
        return res.status(400).json({ message: "Image upload failed" });
      }
      imageUrl = uploadResponse.secure_url;
    }

    // NOTE: The Message schema stores the image URL in the `image` field.
    const newMessage = new Message({
      senderId,
      receiverId,
      text: messageText,
      image: imageUrl,
    });

    await newMessage.save();

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    // Get the logged-in user's id from `req.user` (set by `requireAuth` middleware)
    const loggedInUserId = req.user._id;

    // Find all messages where the logged-in user is either the sender or the receiver.
    // Rationale: collecting these messages gives us every conversation the user has participated in.
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    // Map each message to the *other* participant's id (the chat partner).
    // For messages where the logged-in user is the sender, the partner is `receiverId`.
    // For messages where the logged-in user is the receiver, the partner is `senderId`.
    // We convert ObjectIds to strings for reliable comparison.
    const partnerIds = messages.map((msg) =>
      msg.senderId.toString() === loggedInUserId.toString()
        ? msg.receiverId.toString()
        : msg.senderId.toString()
    );

    // Use a Set to remove duplicate partner ids so each chat partner appears only once.
    const uniquePartnerIds = [...new Set(partnerIds)];

    // Query the User collection for the partner documents and exclude sensitive fields like `password`.
    // Rationale: returning full user objects (name, email, profileImage) is more useful to the client
    // than returning raw ids.
    const chatPartners = await User.find({
      _id: { $in: uniquePartnerIds },
    }).select("-password");

    //send message in real-time using socket.io

    // Return the list of unique chat partners.
    return res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
