import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
  port: process.env.PORT || 5500,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  RESEND_FROM_NAME: process.env.RESEND_FROM_NAME,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};
