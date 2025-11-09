import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

export default function AboutPage(): React.ReactElement {
  return (
    <>
      <Navbar />
      <main className="flex grow pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Om Projektet
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              News Gamma är en modern nyhetsapplikation utvecklad som ett
              grupprojekt på Lexicon i Linköping. Projektet demonstrerar
              fullstack-utveckling med fokus på skalbarhet, typsäkerhet och
              användarvänlighet.
            </p>

            <div className="w-full flex justify-center mb-6">
              <Image
                src="/mockup-dagensdos.jpg"
                alt="Mockup - Dagens Dos"
                width={1200}
                height={700}
                className="w-full max-w-2xl rounded-lg shadow-md"
                priority
              />
            </div>

            <Separator className="my-8" />

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Teknisk Stack
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    Frontend
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Next.js 15 (App Router)</li>
                    <li>React 19 med TypeScript</li>
                    <li>Tailwind CSS 4</li>
                    <li>Radix UI komponenter</li>
                    <li>Next Themes (Dark/Light mode)</li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    Backend
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Next.js Server Actions</li>
                    <li>Prisma ORM</li>
                    <li>PostgreSQL databas</li>
                    <li>Better Auth</li>
                    <li>Zod validering</li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    Integrationer
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Stripe betalningar</li>
                    <li>Gemini AI (Google)</li>
                    <li>Nodemailer e-post</li>
                    <li>MDX Editor</li>
                    <li>Spotprices API</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Arkitektur och Funktionalitet
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Server-First Arkitektur
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Projektet använder genomgående Server Actions för
                    backend-logik, vilket ger optimerad prestanda, automatisk
                    caching och typsäker kommunikation mellan klient och server.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>Server Components som standard</li>
                    <li>Server Actions för datahantering</li>
                    <li>Typsäkerhet med TypeScript och Zod</li>
                    <li>SEO-optimerad rendering</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Användarfunktioner
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>Säker autentisering med e-postverifiering</li>
                    <li>Rollbaserad åtkomstkontroll (Admin, Editor, User)</li>
                    <li>Prenumerationssystem med Stripe</li>
                    <li>Premium innehåll med åtkomstkontroll</li>
                    <li>Kommentarsfunktion på artiklar</li>
                    <li>Sökfunktion med dynamiska slugs</li>
                    <li>Responsiv design med dark mode</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Admin-funktioner
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>CRUD-operationer för artiklar och kategorier</li>
                    <li>AI-assisterad artikelgenerering med Gemini</li>
                    <li>MDX-editor för rich text innehåll</li>
                    <li>Användarhantering och rollfördelning</li>
                    <li>Statistik-dashboard med visualiseringar</li>
                    <li>Premium- och Editor&apos;s Choice-markering</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Externa API-integrationer
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>Spotpriser för el i Sverige (SE1-SE4)</li>
                    <li>SMHI väderdata</li>
                    <li>Google Gemini AI för innehållsgenerering</li>
                    <li>Stripe för betalningshantering</li>
                    <li>SMTP för e-postkommunikation</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Teammedlemmar och Ansvarsområden
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="border border-border rounded-lg p-5">
                  <h3 className="font-semibold text-foreground mb-2 text-lg">
                    Magui
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    Backend och Betalningsintegration
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>CRUD-funktionalitet för artiklar och kategorier</li>
                    <li>Prenumerationsstatistik och Dashboard</li>
                    <li>Stripe-integration och betalflöde</li>
                    <li>GDPR-kompatibel Cookie Banner</li>
                    <li>Rollbaserad åtkomstkontroll i Admin</li>
                  </ul>
                </div>

                <div className="border border-border rounded-lg p-5">
                  <h3 className="font-semibold text-foreground mb-2 text-lg">
                    Ahmed
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    AI-integration och Externa API
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>Elpris-API med visualisering av spotpriser</li>
                    <li>Gemini AI-integration för artikelgenerering</li>
                    <li>Google Search-integration i AI-flöde</li>
                    <li>MDX Editor-implementation</li>
                    <li>Structured output med Zod-validering</li>
                  </ul>
                </div>

                <div className="border border-border rounded-lg p-5">
                  <h3 className="font-semibold text-foreground mb-2 text-lg">
                    Johan
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    E-postfunktionalitet och Verifiering
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>Better Auth e-postverifiering</li>
                    <li>Nodemailer-integration och SMTP-konfiguration</li>
                    <li>Kontaktformulär med e-postutskick</li>
                    <li>Custom email templates</li>
                    <li>Token-generering och säker validering</li>
                  </ul>
                </div>

                <div className="border border-border rounded-lg p-5">
                  <h3 className="font-semibold text-foreground mb-2 text-lg">
                    Josefine
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mb-2">
                    UX/UI, Autentisering och Innehållspresentation
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>UX/UI design och logotyp</li>
                    <li>Better Auth-implementation med Prisma</li>
                    <li>Rollhantering (Admin, Editor, User)</li>
                    <li>Mina Sidor och användarprofilhantering</li>
                    <li>Premium-flagga på artiklar</li>
                    <li>Sökfunktion och SLUG-system för SEO</li>
                    <li>Article rendering-komponenter</li>
                    <li>Editor&apos;s Choice Carousel</li>
                    <li>Projektledning</li>
                
                  </ul>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Projektinformation
              </h2>
              <div className="bg-muted/50 p-5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">
                    Institution:
                  </span>{" "}
                  Lexicon, Linköping
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">
                    Projektkurs:
                  </span>{" "}
                  Fullstack Webbutveckling
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Utvecklingsteam:
                  </span>{" "}
                  Magui, Johan, Josefine, Ahmed
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
