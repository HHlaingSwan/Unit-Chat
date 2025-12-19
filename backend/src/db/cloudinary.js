import { v2 as cloudinary } from "cloudinary";
import { envConfig } from "./env.js";

cloudinary.config({
  cloud_name: envConfig.COLUDINARY_CLOUD_NAME,
  api_key: envConfig.COLUDINARY_API_KEY,
  api_secret: envConfig.COLUDINARY_API_SECRET,
});

export default cloudinary;
