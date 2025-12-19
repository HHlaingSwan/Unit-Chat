import { envConfig } from "../db/env.js";
import { generateToken } from "../db/util.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

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
      generateToken(newUser._id, res);
      // TODO: Save user
      const savedUser = await newUser.save();
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: savedUser,
      });
      // TODO: Send welcome email
      const clientUrl = envConfig.CLIENT_URL;
      await sendWelcomeEmail(savedUser.email, savedUser.fullName, clientUrl);
    }
  } catch (error) {
    console.log("Error in signUp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signIn = (req, res) => {
  res.send("Login route");
};

export const signOut = (req, res) => {
  res.send("Logout route");
};
