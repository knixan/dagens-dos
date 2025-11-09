"use server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Typ för e-postdata
type EmailData = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};
// Funktion för att skicka e-post
export async function sendEmail({
  to,
  subject,
  text,
  html,
}: EmailData): Promise<void> {
  console.log("[Mail] Attempting to send email:", { to, subject });
  console.log("[Mail] Using transport config:", {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    secure: Number(process.env.EMAIL_PORT) === 465,
  });
  // Skicka e-post
  try {
    const info = await transporter.sendMail({
      from: `"News Gamma" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html ?? text,
    });
    // Logga resultat
    console.log("[Mail] Email sent successfully!");
    console.log("[Mail] Message ID:", info.messageId);
    console.log("[Mail] Preview URL:", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("[Mail] Failed to send email:", err);
    throw err;
  }
}
