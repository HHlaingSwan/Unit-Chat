import { Router } from "express";
import { acceptUser, blockUser } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.use(requireAuth);

userRouter.post("/accept/:id", acceptUser);
userRouter.post("/block/:id", blockUser);

export default userRouter;
