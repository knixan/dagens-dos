"use server";
// filepath: src/lib/actions/email-actions.ts

import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/actions/mail";
import { prisma } from "@/lib/prisma";

export async function resendVerificationEmail(email: string) {
  try {
    if (!email) {
      return {
        success: false,
        error: "Email krävs",
      };
    }

    // Hämta användare
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: "Användare hittades inte",
      };
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: "E-postadressen är redan verifierad",
      };
    }

    // Skapa verification URL
    // Better Auth hanterar token generation automatiskt via /api/auth/verify-email
    const verificationUrl = `${
      process.env.BETTER_AUTH_URL
    }/api/auth/verify-email?email=${encodeURIComponent(email)}`;

    // Skicka mail
    await sendEmail({
      to: email,
      subject: "Verifiera din e-postadress - News Gamma",
      text: `Hej ${
        user.name || ""
      }!\n\nKlicka här för att verifiera din e-postadress: ${verificationUrl}\n\nOm du inte registrerade dig på News Gamma, ignorera detta mail.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Verifiera din e-postadress</h1>
          <p>Hej ${user.name || ""}!</p>
          <p>Klicka på knappen nedan för att verifiera din e-postadress:</p>
          <div style="margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verifiera e-postadress
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Eller kopiera denna länk till din webbläsare:<br>
            <a href="${verificationUrl}" style="color: #0066cc;">${verificationUrl}</a>
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">
            Om du inte registrerade dig på News Gamma, ignorera detta mail.
          </p>
        </div>
      `,
    });

    console.log("[ResendVerification] Email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("[ResendVerification] Error:", error);
    return {
      success: false,
      error: "Kunde inte skicka verifieringsmail. Försök igen senare.",
    };
  }
}
