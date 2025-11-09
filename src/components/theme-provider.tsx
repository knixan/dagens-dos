"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import CookieConsent from "./cookie-consent";

import { setConsentCookie } from "@/app/admin/artiklar-ai/actions/cookieConsent";

export function Providers({ children }: { children: React.ReactNode }) {
  const handleAccept = async () => {
    await setConsentCookie("accepted");
    console.log("Cookie consent accepted");
  };

  const handleDecline = async () => {
    await setConsentCookie("declined");
    console.log("Cookie consent declined");
  };

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <CookieConsent
        variant="small"
        onAcceptCallback={handleAccept}
        onDeclineCallback={handleDecline}
      />
    </NextThemesProvider>
  );
}
