import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin } from "better-auth/plugins";
import { sendEmail } from "./actions/mail";

// Re-export a shared type for BetterAuth sessions so other modules can import
// it from the runtime auth module instead of a separate types file.
export type BetterAuthSession = {
  session: {
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined;
      userAgent?: string | null | undefined;
    };
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined;
    };
  } | null;
};

// Re-export validation schemas from schemas/auth (client-safe)
export {
  SignUpSchema,
  SignInSchema,
  PasswordResetSchema,
  PasswordResetRequestSchema,
  type SignUpInput,
  type SignInInput,
  type PasswordResetInput,
  type PasswordResetRequestInput,
} from "./schema/zod-auth";

// Kontrollera att secret finns (körs bara på server)
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    "Missing BETTER_AUTH_SECRET environment variable for better-auth."
  );
}

// Type for error context
type BetterAuthErrorContext = {
  path: string;
  error: Error;
};
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover", // Latest API version as of Stripe SDK v19
});

export const auth = betterAuth({
  // Hemlig nyckel för att signera tokens och annan känslig data
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    changeEmail: { enabled: true },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }) {
      if (!user?.email) {
        console.warn("sendResetPassword: missing user.email");
        return;
      }
      console.log(
        `[BetterAuth] Password reset requested for ${user.email}. Link: ${url}`
      );
      try {
        await sendEmail({
          to: user.email,
          subject: "Reset your password",
          text: `Reset your password: ${url}`,
          html: `Click to reset your password: <a href="${url}">Reset password</a>`,
        });
      } catch (err) {
        console.error("Failed to send reset email:", err);
        throw err;
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url, token: _token }) {
      console.log("[Auth] Sending verification email to:", user?.email);
      if (!user?.email) return;
      // token param is provided by the caller but not used here; mark it as used
      // to satisfy linter/no-unused-vars
      void _token;

      const subject = "Verifiera din e-postadress";
      const text = `Klicka här för att verifiera din e-postadress: ${url}`;
      const html = `
        <h2>Verifiera din e-postadress</h2>
        <p>Klicka på länken nedan för att verifiera:</p>
        <a href="${url}">Verifiera min e-postadress</a>
      `;

      try {
        await sendEmail({
          to: user.email,
          subject,
          text,
          html,
        });
        console.log("[Auth] Verification email sent successfully");
      } catch (err) {
        console.error("[Auth] Failed to send verification email:", err);
        throw err;
      }
    },
    resend: {
      enabled: true,
      maxAttempts: 3,
    },
  },
  plugins: [
    admin(),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "Premium",
            priceId: "price_1SNWrQFXkADrvOgmZWaUusth",
          },
        ],
      },
    }),
  ],
  //Felrapportering för att underlätta felsökning under utveckling
  onError: async (ctx: BetterAuthErrorContext) => {
    console.error("[BetterAuth] Error occurred:");
    console.error("  Path:", ctx.path);
    console.error("  Error:", ctx.error);
    console.error("  Stack:", ctx.error?.stack);
  },
});

// Server-only helpers moved to src/lib/server-auth.ts to avoid importing next/headers in client bundles.
