"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";

export default function TipUs() {
  return (
    <section className="rounded-xl border bg-card text-card-foreground p-6 shadow">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Tipsa oss</h3>

      <div className="current-card flex items-center gap-4 p-3 bg-card rounded-lg border border-border shadow-sm mb-4">
    

        <div className="flex flex-col">
          <div className="text-primary text-base font-bold">Har du sett något helgalet?</div>
          <div className="text-foreground text-sm opacity-90 leading-snug mt-1">
            Tipsa oss! Vi tar emot allt från politiska avslöjanden till ‘katten
            fastnade i brevlådan’. Belöning kan utgå – beroende på nyhetsvärde,
            dramatik och hur bra du stavar.
          </div>
        </div>
      </div>

      <div>
        <Button variant="secondary" asChild className="w-full">
          <Link href="/kontakta-oss">Tipsa oss</Link>
        </Button>
      </div>
    </section>
  );
}
