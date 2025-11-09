"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";

export default function ElectricityPrices() {
  // Currently we don't fetch spot prices here; this component mirrors the
  // visual structure of WeatherAside and links to the full /el page.

  return (
    <section className="rounded-xl border bg-card text-card-foreground p-6 shadow">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Elpriser</h3>

      {/* Compact card similar to WeatherAside's current-card */}
      <div className="current-card flex items-center gap-4 p-3 bg-card rounded-lg border border-border shadow-sm mb-4">
  <div className="shrink-0">
          <Image
            src="/images/elpulsen.png"
            alt="Elpulsen"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        <div className="flex flex-col">
          <div style={{ fontSize: 18, fontWeight: 700 }} className="text-primary">
            Spotpriser för el
          </div>
          <div style={{ fontSize: 13, opacity: 0.85 }} className="text-foreground">
            Se timmpriser för hela Sverige
          </div>
        </div>
      </div>

      <div>
        <Button variant="secondary" asChild className="w-full">
          <Link href="/el">Visa Elpriser</Link>
        </Button>
      </div>
    </section>
  );
}
