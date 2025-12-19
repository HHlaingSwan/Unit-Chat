import { Router } from "express";
import {
  signIn,
  signOut,
  signUp,
  updateProfile,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);
authRouter.post("/profile-update", requireAuth, updateProfile);
authRouter.get("/protected", requireAuth, (req, res) =>
  res
    .status(200)
    .json({ message: "Access granted to protected route", user: req.user })
);

export default authRouter;
