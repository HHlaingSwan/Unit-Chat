import { resendClient, sender } from "../db/resend.js";
import { createWelcomeEmailTemplate } from "./emailTamplate.js";

export const sendWelcomeEmail = async (toEmail, userName, clientUrl) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: toEmail,
    subject: "Welcome to Unit-Chat!",
    html: createWelcomeEmailTemplate(userName, clientUrl),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome email sent successfully:", data);
  return data;
};
