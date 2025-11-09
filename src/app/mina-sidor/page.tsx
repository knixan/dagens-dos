"use client";
import React from "react";
import { useSession } from "@/lib/client/auth-client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";
import SubscriptionManager from "@/components/SubscriptionManager";
import SettingsForm from "@/components/Forms/SettingsForm";

export default function MinaSidorPage() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <>
      <Navbar />
      <main className="flex grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <h1 className="text-2xl font-bold mb-6">
                {user ? `${user.name || user.email}s sida` : "Mina sidor"}
              </h1>
              <div className="space-y-8">
                <div className="bg-card p-6 rounded-lg shadow border border-border">
                  <SettingsForm user={user} />
                </div>
                <SubscriptionManager />
              </div>
            </div>
            <Aside />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
