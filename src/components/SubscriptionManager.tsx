"use client";

import React, { useEffect, useState } from "react";
import { useSession, authClient } from "@/lib/client/auth-client";
import { useRouter } from "next/navigation";

export default function SubscriptionManager(): React.ReactElement {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const router = useRouter();

  const [isSubscriber, setIsSubscriber] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchSubscriptions() {
      if (!session?.user?.id) {
        if (mounted) setIsSubscriber(false);
        return;
      }

      try {
        const res = await authClient.subscription.list();
        const subs = res?.data || [];
        const active = subs.find(
          (s: { status?: string }) =>
            s.status === "active" || s.status === "trialing"
        );
        if (mounted) setIsSubscriber(Boolean(active));
      } catch (err) {
        // If listing fails, assume not subscriber and allow user to go to checkout
        if (mounted) setIsSubscriber(false);
        console.error("Failed to fetch subscriptions", err);
      }
    }

    fetchSubscriptions();
    return () => {
      mounted = false;
    };
  }, [session?.user?.id]);

  function handleSubscribe() {
    // Send user to the prenumeration landing where checkout flow is handled
    router.push("/prenumeration");
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow border border-border">
      <h2 className="text-lg font-semibold">Prenumeration</h2>
      <p className="text-sm text-muted-foreground">
        {email
          ? `Hantera din prenumeration (${email}).`
          : "Logga in för att se och hantera din prenumeration."}
      </p>

      <div className="mt-4">
        {isSubscriber === null ? (
          <div className="text-sm text-muted-foreground">
            Läser prenumerationsstatus…
          </div>
        ) : isSubscriber ? (
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            ✓ Du är prenumerant
          </div>
        ) : (
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSubscribe}
          >
            Bli prenumerant
          </button>
        )}
      </div>
    </div>
  );
}
