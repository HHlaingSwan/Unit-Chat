import mongoose from "mongoose";

/*
  Message schema

  - `senderId` and `receiverId` store ObjectId values that reference documents
    in the `User` collection. The `ref: "User"` tells Mongoose which model/collection
    the ObjectId points to and enables the `populate()` helper to replace the
    stored id with the referenced document when querying.

  Example usage:
  - Store ids when creating a message:
      const msg = new Message({ senderId: user1._id, receiverId: user2._id, text: 'hi' })
  - Populate sender details when reading messages:
      Message.find().populate('senderId', 'fullName email profileImage')

  Note: The database actually stores ObjectId values. `ref` only affects how
  Mongoose treats those ids at the application level.
*/
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      // `ref: "User"` -> this ObjectId references the `User` model/collection
      // so you can call `.populate('senderId')` to fetch the full user doc.
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      // `ref: "User"` -> this ObjectId references the `User` model/collection
      // so you can call `.populate('receiverId')` to fetch the full user doc.
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxLength: 1000,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
