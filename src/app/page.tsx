import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";
import ArticlesSection from "@/components/articles/ArticlesSection.server";
import EditorChoiceCarousel from "@/components/articles/EditorChoiceCarousel";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import type { Article as LocalArticle } from "@/types/articles";

export default async function HomePage(): Promise<React.ReactElement> {
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

  // Fetch editor's choice articles
  type ArticleWithCategory = Prisma.ArticleGetPayload<{
    include: { category: true };
  }>;

  const editorChoiceArticles: ArticleWithCategory[] =
    await prisma.article.findMany({
      where: { editorsChoice: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

  const slugify = (s: string, id: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) +
    "-" +
    id.slice(0, 6);

  const editorChoiceFormatted: LocalArticle[] = editorChoiceArticles.map(
    (a) => ({
      id: String(a.id),
      slug: a.headline ? slugify(a.headline, String(a.id)) : String(a.id),
      title: a.headline ?? "",
      excerpt: a.summary ?? "",
      content: a.content ?? "",
      category: a.category?.name ?? "",
      image:
        a.image_url &&
        (a.image_url.startsWith("http") || a.image_url.startsWith("/"))
          ? a.image_url
          : undefined,
      date: a.createdAt
        ? new Date(a.createdAt).toISOString().slice(0, 10)
        : undefined,
      premium: (a as unknown as { premium?: boolean }).premium ?? false,
    })
  );

  return (
    <>
      <Navbar />

      <main className="flex grow pt-8 pb-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6  lg:px-8">
          <div className="grid grid-cols-1  lg:grid-cols-3  gap-10">
            <div className="lg:col-span-2 space-y-10 ">
              {editorChoiceFormatted.length > 0 && (
                <EditorChoiceCarousel articles={editorChoiceFormatted} />
              )}
              <ArticlesSection />
            </div>

            <Aside popularItems={popularItems} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
