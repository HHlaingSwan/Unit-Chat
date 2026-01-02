import User from "../models/user.model.js";

export const acceptUser = async (req, res) => {
  try {
    const { id: userToAcceptId } = req.params;
    const { _id: loggedInUserId } = req.user;

    // Add userToAcceptId to loggedInUser's contacts
    await User.findByIdAndUpdate(loggedInUserId, {
      $addToSet: { contacts: userToAcceptId },
    });

    // Add loggedInUserId to userToAccept's contacts
    await User.findByIdAndUpdate(userToAcceptId, {
      $addToSet: { contacts: loggedInUserId },
    });

    res.status(200).json({ message: "User accepted successfully" });
  } catch (error) {
    console.error("Error in acceptUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { id: userToBlockId } = req.params;
    const { _id: loggedInUserId } = req.user;

    // Add userToBlockId to loggedInUser's blocked list
    await User.findByIdAndUpdate(loggedInUserId, {
      $addToSet: { blocked: userToBlockId },
      // also remove from contacts if they were there
      $pull: { contacts: userToBlockId },
    });

    // also remove from the other user's contacts
    await User.findByIdAndUpdate(userToBlockId, {
      $pull: { contacts: loggedInUserId },
    });

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Error in blockUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
