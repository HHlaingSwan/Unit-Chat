import cloudinary from "../db/cloudinary.js";
import { envConfig } from "../db/env.js";
import { generateToken } from "../db/util.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

/*
  Authentication controllers - token behavior summary:

  - After successful `signUp` or `signIn`, we generate a JWT access token using
    `generateToken(userId, res)`.
  - `generateToken` will set a `jwt` cookie when `res` is provided and will also
    return the token string. Returning the token allows clients that prefer an
    Authorization header to receive `accessToken` in the JSON response and set
    `Authorization: Bearer <accessToken>` themselves.
  - Responses intentionally omit the `password` field. The `user` object returned
    includes only safe, public fields.

  Client consumption options:
  - Cookie-based: Rely on the `jwt` cookie sent by the server; browser will include
    it automatically for same-site requests.
  - Header-based: Use the `accessToken` from JSON response and send `Authorization`
    header on subsequent requests. Header approach is useful for APIs and non-browser clients.
*/

export const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // TODO: Check if all fields are provided
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // TODO: Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // TODO: Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // TODO: Check if password is valid
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // TODO: Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // TODO: Create user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (!newUser) {
      return res.status(400).json({ message: "User not created" });
    } else {
      // Save user
      const savedUser = await newUser.save();
      // Generate token (also sets cookie)
      const token = generateToken(savedUser._id, res);
      res.status(201).json({
        success: true,
        message: "User created successfully",
        accessToken: token,
        // user: {
        //   _id: savedUser._id,
        //   fullName: savedUser.fullName,
        //   email: savedUser.email,
        //   profileImage: savedUser.profileImage,
        // },
      });
      // Send welcome email asynchronously and do NOT fail signup if email sending fails.
      // Many email providers (like Resend) may reject messages during development
      // if the `from` address or recipient isn't verified. We log failures but
      // keep user creation successful.
      const clientUrl = envConfig.CLIENT_URL;
      sendWelcomeEmail(savedUser.email, savedUser.fullName, clientUrl).catch(
        (err) => {
          console.error("Welcome email failed (non-fatal):", err);
        }
      );
    }
  } catch (error) {
    console.log("Error in signUp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // --- IGNORE ---
    // TODO: Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // TODO: Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate token (also sets cookie)
    const token = generateToken(user._id, res);
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      accessToken: token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Error in signIn:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signOut = (_, res) => {
  res.cookie("jwt", "", {
    httpOnly: true, // prevent XSS attacks
    sameSite: "strict", // prevent CSRF attacks
    maxAge: 0, // expire the cookie immediately
  });
  res
    .status(200)
    .json({ success: true, message: "User signed out successfully" });
};

export const updateProfile = async (req, res) => {
  const { profileImage } = req.body;
  try {
    if (!profileImage) {
      return res.status(400).json({ message: "Profile image is required!" });
    }
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user._id;
    const uploadResponse = await cloudinary.uploader.upload(profileImage);
    if (!uploadResponse || !uploadResponse.secure_url) {
      return res.status(400).json({ message: "Profile image upload failed!" });
    }
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: uploadResponse.secure_url },
      { new: true }
    ).select("-password");
    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user: updateUser,
    });
  } catch (error) {
    console.log("Error in updateProfile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
