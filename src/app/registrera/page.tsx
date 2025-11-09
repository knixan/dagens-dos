import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import SignUpForm from "@/components/Forms/SignUpForm";
import Aside from "@/components/layout/aside/aside";
import { prisma } from "@/lib/prisma";

export default async function RegisterPage(): Promise<React.ReactElement> {
  // Fetch data on the server
  const popularArticles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, headline: true },
  });

  const popularItems = popularArticles.map((article) => ({
    title: article.headline ?? "Untitled",
    href: `/artiklar/${(article.headline || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50)}-${String(article.id).slice(0, 6)}`,
  }));

  return (
    <div>
      <Navbar />
      <div className="bg-background text-foreground min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <section className="bg-card p-6 rounded-xl shadow border border-border">
                <h1 className="text-3xl font-extrabold text-foreground mb-2">
                  Registrera
                </h1>
                <p className="text-muted-foreground mb-6">
                  Fyll i dina uppgifter för att skapa ett konto och få tillgång
                  till premiummaterial.
                </p>
                <SignUpForm />
              </section>
            </div>

            <Aside popularItems={popularItems} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
