import { resendClient, sender } from "../db/resend.js";
import { createWelcomeEmailTemplate } from "./emailTamplate.js";

export const sendWelcomeEmail = async (toEmail, userName, clientUrl) => {
  if (!toEmail || !userName || !clientUrl) {
    throw new Error("Missing parameters for sending welcome email");
  }
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: toEmail,
    subject: "Welcome to Unit-Chat!",
    html: createWelcomeEmailTemplate(userName, clientUrl),
    text: `Welcome to Unit-Chat, ${userName}! We're excited to have you on board. Visit us at ${clientUrl} to get started.`,
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome email sent successfully:", data);
  return data;
};
