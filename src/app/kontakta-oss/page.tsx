import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ContactFormWrapper from "@/components/Forms/ContactFormWrapper";

export default function ContactPage(): React.ReactElement {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="bg-card p-6 rounded-xl shadow border border-border">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Kontakta oss
            </h1>

            <p className="text-muted-foreground mb-4">
              Kontakta gärna oss på <strong>noreplay@dagensdos.se</strong> eller
              fyll i det här formuläret. Vi svarar när vi hinner, eller när vi
              känner för det.
            </p>

            <ContactFormWrapper />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
