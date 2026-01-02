import express from "express";
import { connectingDB } from "./db/connectDB.js";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import userRouter from "./routes/user.route.js";
import path from "path";
import cookieParser from "cookie-parser";
import { envConfig } from "./db/env.js";
import cors from "cors";
import { createServer } from "http";
import initializeSocket from "./socket/socket.js";

const app = express();
const httpServer = createServer(app);
const __dirname = path.resolve(); // Get the absolute path of the current directory
const port = envConfig.port || 3300;
const url = envConfig.MONGODB_URI;

initializeSocket(httpServer);

app.use(express.json({ limit: "20mb" })); // Parse JSON request bodies
app.use(
  cors({
    origin: envConfig.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.static("public")); // Serve static files from the "public" directory
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);
app.get("/health", (req, res) => {
  res.send("Ok");
});

httpServer.listen(port, async () => {
  try {
    await connectingDB(url);
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
  console.log(`Server is running on port ${port}`);
});
