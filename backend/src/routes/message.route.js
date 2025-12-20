import { Router } from "express";
import {
  getAllContents,
  getChatPartners,
  getMessageByUserId,
  sendMessage,
} from "../controllers/message.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { arcjetMiddleware } from "../middleware/arcjet.middleware.js";

const messageRouter = Router();
messageRouter.use(arcjetMiddleware, requireAuth); // Protect all message routes

messageRouter.get("/contacts", getAllContents);
messageRouter.get("/chat", getChatPartners);
messageRouter.get("/:id", getMessageByUserId);
messageRouter.post("/send/:id", sendMessage);

export default messageRouter;
