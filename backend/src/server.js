import express from "express";
import { connectingDB } from "./db/connectDB.js";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import path from "path";
import cookieParser from "cookie-parser";
import { envConfig } from "./db/env.js";

const app = express();
// const __dirname = path.resolve();
const port = envConfig.port || 3300;
const url = envConfig.MONGODB_URI;

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.static("public")); // Serve static files from the "public" directory
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

// for production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(port, async () => {
  try {
    await connectingDB(url);
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
  console.log(`Server is running on port ${port}`);
});
