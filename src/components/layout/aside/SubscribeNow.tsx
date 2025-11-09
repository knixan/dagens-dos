"use client";

import ThemeLogo from "@/components/layout/ThemeLogo";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SubscribeNow() {
  return (
    <section className="rounded-xl border bg-card text-card-foreground p-6 shadow">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Prenumerera</h3>

      <div className="current-card flex items-center gap-4 p-3 bg-card rounded-lg border border-border shadow-sm mb-4">
        <div className="shrink-0">
          <ThemeLogo
            alt="Logotyp"
            width={48}
            height={48}
            className="object-contain"
            asset="icon"
          />
        </div>

        <div className="flex flex-col">
          <div
            style={{ fontSize: 16, fontWeight: 700 }}
            className="text-primary"
          >
            Få nyheter direkt i inkorgen
          </div>
          <div
            style={{ fontSize: 13, opacity: 0.85 }}
            className="text-foreground"
          >
            Prenumerera för att få exklusiva artiklar och dagliga
            sammanfattningar.
          </div>
        </div>
      </div>

      <div>
        <Button variant="secondary" asChild className="w-full">
          <Link href="/prenumeration">Prenumerera Nu</Link>
        </Button>
      </div>
    </section>
  );
}
