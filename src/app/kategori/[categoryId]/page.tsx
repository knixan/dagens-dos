import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/articles/ArticleCard";
import type { Article } from "@/types/articles";
import Link from "next/link";
import Aside from "@/components/layout/aside/aside";

type Props = { params: { categoryId: string } };

function slugifyTitle(title: string, id: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
  return `${slug}-${id.slice(0, 6)}`;
}

export default async function CategoryPage({ params }: Props) {
  const { categoryId } = params;

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { articles: true },
  });

  if (!category) {
    return (
      <>
        <Navbar />
        <main className="flex grow pt-8 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">Kategori hittades inte</h1>
            <p>Det gick inte att hitta den valda kategorin.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const articles: Article[] = category.articles.map((a) => ({
    id: a.id,
    slug: slugifyTitle(a.headline ?? a.id, a.id),
    title: a.headline ?? "",
    excerpt: a.summary ?? "",
    content: a.content ?? "",
    category: category.name,
    image: a.image_url ?? undefined,
    date: a.createdAt
      ? new Date(a.createdAt).toISOString().slice(0, 10)
      : undefined,
  }));

  // Hämta populära artiklar för Aside (samma som på startsidan)
  const popularArticles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, headline: true },
  });

  const popularItems = popularArticles.map((article) => {
    const slug = (article.headline || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 50);
    return {
      title: article.headline ?? "Untitled",
      href: `/artiklar/${slug}-${String(article.id).slice(0, 6)}`,
    };
  });

  return (
    <>
      <Navbar />
      <main className="flex grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold mb-4">{category.name}</h1>
              <div className="space-y-4">
                {articles.length === 0 ? (
                  <p>Inga artiklar i denna kategori ännu.</p>
                ) : (
                  articles.map((art) => (
                    <ArticleCard key={art.id} article={art} />
                  ))
                )}
              </div>
            </div>

            {/* Aside — samma struktur som på huvudsidan */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20 space-y-8">
                <Link href="/" className="text-primary hover:underline">
                  ← Tillbaka
                </Link>
                <Aside popularItems={popularItems} />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
