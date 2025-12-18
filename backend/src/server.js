import express from "express";
import dotenv from "dotenv";
import { connectingDB } from "./db/connectDB.js";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import path from "path";

dotenv.config();
const app = express();
// const __dirname = path.resolve();
const port = process.env.PORT || 3300;
const url = process.env.MONGODB_URI;

app.use(express.json()); // Parse JSON request bodies

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

// for production mode
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//   });
// }

app.listen(port, async () => {
  try {
    await connectingDB(url);
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
  console.log(`Server is running on port ${port}`);
});
