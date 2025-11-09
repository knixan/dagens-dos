"use server";

import { headers as nextHeaders } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type HeadersRecord = Record<string, string> | undefined;

async function getSessionFromHeaders(headersObj?: HeadersRecord) {
  if (headersObj) {
    return await auth.api.getSession({ headers: headersObj as unknown as Record<string, string> });
  }

  // server-action or server environment: use next/headers()
  const h = await nextHeaders();
  const headerEntries: Record<string, string> = {};
  for (const key of h.keys()) {
    const v = h.get(key);
    if (v !== null) headerEntries[key] = v;
  }

  return await auth.api.getSession({ headers: headerEntries as unknown as Record<string, string> });
}

export async function updateEmail(newEmail: string, headersObj?: HeadersRecord) {
  if (!newEmail) throw new Error("Email required");

  const session = await getSessionFromHeaders(headersObj);
  if (!session || !session.user) throw new Error("Not authenticated");

  // Uppdatera användarens e-post och markera som icke-verifierad
  await prisma.user.update({
    where: { id: session.user.id },
    data: { email: newEmail, emailVerified: false },
  });

  // Försök skicka verifieringsmejl via auth API (finns i projektet)
  try {
    await auth.api.sendVerificationEmail({ body: { email: newEmail } });
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }

  return { success: true };
}

export async function requestPasswordReset(headersObj?: HeadersRecord) {
  const session = await getSessionFromHeaders(headersObj);
  if (!session || !session.user) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.email) throw new Error("No email found for user");

  try {
    // @ts-expect-error may not exist on all versions
    if (typeof auth.api.sendResetPassword === "function") {
      // @ts-expect-error dynamic invocation
      await auth.api.sendResetPassword({ body: { email: user.email } });
      return { success: true };
    }

    throw new Error("Password-reset API not available on server");
  } catch (err) {
    console.error("Failed to request password reset:", err);
    throw err;
  }
}

// Note: do not export objects from a "use server" module — export only async functions

// Server-action helpers that accept FormData for use as <form action={...}>
export async function updateEmailForm(formData: FormData) {
  const email = formData.get("email")?.toString() || "";
  const confirmEmail = formData.get("confirmEmail")?.toString() || "";

  if (!email) throw new Error("Email required");
  if (email !== confirmEmail) throw new Error("E-post adresserna matchar inte");
  await updateEmail(email);
  return;
}

export async function requestPasswordResetForm() {
  // Trigger a password-reset email for the current session user
  await requestPasswordReset();
  return;
}
