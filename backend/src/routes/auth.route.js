import { Router } from "express";
import {
  signIn,
  signOut,
  signUp,
  updateProfile,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { arcjetMiddleware } from "../middleware/arcjet.middleware.js";

const authRouter = Router();

// authRouter.use(arcjetMiddleware);

authRouter.get("/test", arcjetMiddleware, (req, res) => {
  res.status(200).json({ message: "Arcjet middleware test passed." });
});

authRouter.post("/signup", signUp);
authRouter.post("/login", signIn);
authRouter.post("/logout", signOut);
authRouter.post("/profile-update", requireAuth, updateProfile);
authRouter.get("/protected", requireAuth, (req, res) =>
  res
    .status(200)
    .json({ message: "Access granted to protected route", user: req.user })
);

export default authRouter;
