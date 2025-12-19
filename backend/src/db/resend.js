import { Resend } from "resend";
import { envConfig } from "./env.js";

export const resendClient = new Resend(envConfig.RESEND_API_KEY);
export const sender = {
  email: envConfig.RESEND_FROM_EMAIL,
  name: envConfig.RESEND_FROM_NAME,
};
