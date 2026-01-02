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
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  ARCJET_API_KEY: process.env.ARCJET_API_KEY,
  ARCJET_ENV: process.env.ARCJET_ENV,
};
// Validate required environment variables
const requiredInProd = [
  "MONGODB_URI",
  "JWT_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "RESEND_FROM_NAME",
  "CLIENT_URL",
];
if (envConfig.NODE_ENV === "production") {
  const mising = requiredInProd.filter((key) => !process.env[key]);
  if (mising.length > 0) {
    throw new Error(
      `Missing required environment variables in production: ${mising.join(
        ", "
      )}`
    );
  }
}
