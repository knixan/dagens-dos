"use client";

import React from "react";
import { useRouter } from "next/navigation";
import authClient, { useSession } from "@/lib/client/auth-client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";
import { Button } from "@/components/ui/button";

type Plan = {
  id: string;
  name: string;
  priceNumber: number;
  priceLabel: string;
  features: string[];
};

const PLANS: Plan[] = [
  {
    id: "premium",
    name: "Premium",
    priceNumber: 199,
    priceLabel: "199 kr/månad",
    features: ["Full tillgång  till alla artiklar + arkiv"],
  },
];

export default function PrenumerationLanding(): React.ReactElement {
  const router = useRouter();
  const { data: session } = useSession();

  async function goToCheckout(planId: string) {
    // If user is signed in, start Stripe Checkout via authClient
    if (session?.user) {
      try {
        await authClient.subscription.upgrade({
          plan: "Premium",
          // use absolute URLs to be safe
          successUrl: window.location.origin + "/",
          cancelUrl: window.location.origin + "/",
        });
      } catch (err) {
        console.error("Failed to start checkout:", err);
        // Optionally handle fallback here (e.g., show toast). For now we do nothing.
      }
    } else {
      // Not signed in -> redirect to login and preserve next so the user returns to prenumeration
      const next = encodeURIComponent("/prenumeration");
      router.push(`/logga-in?next=${next}`);
    }
  }

  return (
    <>
      <Navbar />

      <main className="flex grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <section className="space-y-6">
                <h1 className="text-2xl font-bold">
                  Prenumerera för endast 199kr i månaden
                </h1>

                {/* Focused single-plan view */}
                {PLANS.length > 0 &&
                  (() => {
                    const plan = PLANS[0];
                    return (
                      <div className="flex justify-center">
                        <div className="w-full max-w-xl">
                          <div className="p-8 rounded-2xl border border-border bg-forground from-card/80 to-card shadow-lg">
                            <div className="flex items-start justify-between gap-6">
                              <div>
                                <h3 className="text-2xl font-extrabold mb-1">
                                  {plan.name}
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                  {plan.priceLabel} — månadsvis prenumeration
                                </p>
                                <div className="text-4xl font-extrabold text-primary mb-4">
                                  {plan.priceNumber} kr
                                </div>
                              </div>
                              <div className="text-right">
                                <Button
                                  onClick={() => void goToCheckout(plan.id)}
                                  className="px-6 py-3"
                                >
                                  Bli Premium
                                </Button>
                              </div>
                            </div>

                            <div className="mt-6 grid gap-3">
                              <h4 className="text-sm font-semibold">
                                I Premium ingår
                              </h4>
                              <ul className="text-sm text-muted-foreground space-y-2 mt-2">
                                {plan.features.map((f) => (
                                  <li
                                    key={f}
                                    className="flex items-start gap-3"
                                  >
                                    <span className="text-primary">✓</span>
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                              <p className="text-xs text-muted-foreground mt-4">
                                Återkommande betalning. Avsluta när som helst i
                                Mina sidor.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
              </section>
            </div>

            <Aside />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
