import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/articles";
import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";
import { prisma } from "@/lib/prisma";
import ArticleContent from "@/components/articles/ArticleContent";
import { getSession } from "@/lib/server-auth";
import CommentsSection from "@/components/articles/CommentsSection";

type Props = {
  params: { slug: string };
};

export default async function ArticlePage({
  params,
}: Props): Promise<React.ReactElement> {
  const { slug } = await params;

  // Extracta ID från sluggen (sista delen efter sista strecket)
  const idMatch = slug.match(/-([a-z0-9]+)$/);
  const articleId = idMatch ? idMatch[1] : null;

  if (!articleId) {
    notFound();
  }

  // Hitta artikeln i databasen
  const dbArticle = await prisma.article.findFirst({
    where: {
      id: {
        startsWith: articleId,
      },
    },
    include: { category: true },
  });

  if (!dbArticle) {
    notFound();
  }

  // If the article is premium, ensure the viewer has an active subscription
  if ((dbArticle as unknown as { premium?: boolean }).premium) {
    // Try to get session (does not force redirect)
    const session = await getSession();
    // If no session, redirect to login
    if (!session) {
      redirect(`/logga-in?next=/artiklar/${slug}`);
    }

    // Try to find a subscription for this user using stripeCustomerId
    const stripeCustomerId = (
      session.user as unknown as { stripeCustomerId?: string }
    )?.stripeCustomerId;
    const hasActive = stripeCustomerId
      ? await prisma.subscription.findFirst({
          where: {
            stripeCustomerId: stripeCustomerId,
            status: {
              in: ["active", "trialing"],
            },
          },
        })
      : null;

    if (!hasActive) {
      // Render a simple paywall message page
      return (
        <>
          <Navbar />
          <main className="flex grow pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-invert dark:prose-invert">
                <h1 className="text-3xl font-bold">Premiuminnehåll</h1>
                <p className="text-lg">
                  Den här artikeln är endast tillgänglig för prenumeranter.
                </p>
                <div className="mt-6">
                  <a
                    href="/prenumeration"
                    className="text-primary hover:underline"
                  >
                    Bli prenumerant
                  </a>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </>
      );
    }
  }
  // Mappa databasen till Article-typen
  const article: Article = {
    id: String(dbArticle.id),
    slug: slug,
    title: dbArticle.headline ?? "",
    excerpt: dbArticle.summary ?? "",
    content: dbArticle.content ?? "",
    category: dbArticle.category?.name ?? "",
    image:
      dbArticle.image_url &&
      (dbArticle.image_url.startsWith("http") ||
        dbArticle.image_url.startsWith("/"))
        ? dbArticle.image_url
        : undefined,
    date: dbArticle.createdAt
      ? new Date(dbArticle.createdAt).toISOString().slice(0, 10)
      : undefined,
  };

  // Hämta populära artiklar för Aside (samma som på startsidan)
  const popularArticles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, headline: true },
  });

  const popularItems = popularArticles.map((article) => {
    const slugPart = (article.headline || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 50);
    return {
      title: article.headline ?? "Untitled",
      href: `/artiklar/${slugPart}-${String(article.id).slice(0, 6)}`,
    };
  });

  return (
    <>
      <Navbar />

      <main className="flex grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <article className="prose prose-invert dark:prose-invert">
                <Link href="/" className="text-sm text-primary hover:underline">
                  ← Tillbaka
                </Link>

                <h1 className="mt-4 text-3xl text-foreground font-extrabold">
                  {article!.title}
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                  {article!.date} • {article!.category}
                </p>

                {article!.image && (
                  <div className="w-full mb-6 rounded-lg bg-gray-900 flex justify-center">
                    <Image
                      src={article!.image}
                      alt={article!.title}
                      width={800}
                      height={500}
                      className="object-center"
                    />
                  </div>
                )}

                <ArticleContent
                  markdown={article.content}
                  className="text-base text-muted-foreground leading-7 prose prose-slate dark:prose-invert max-w-none"
                />

                <div className="mt-8">
                  <Link href="/" className="text-primary hover:underline">
                    Tillbaka till startsidan
                  </Link>
                </div>

                {/* Comments section */}
                <CommentsSection articleId={article.id} />
              </article>
            </div>

            {/* Aside — visa samma som på startsidan */}
            <Aside popularItems={popularItems} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
