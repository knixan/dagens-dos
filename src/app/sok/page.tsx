import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  let articles: Array<{
    id: string;
    headline: string;
    summary: string | null;
    image_url: string | null;
    createdAt: Date;
  }> = [];

  if (query.trim()) {
    // Sök i artiklar baserat på rubrik, sammanfattning eller innehåll
    articles = await prisma.article.findMany({
      where: {
        OR: [
          { headline: { contains: query, mode: "insensitive" } },
          { summary: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        headline: true,
        summary: true,
        image_url: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
  }

  return (
    <>
      <Navbar />
      <main className="flex grow pt-8 pb-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Sökresultat</h1>
          
          {query ? (
            <>
              <p className="text-muted-foreground mb-8">
                Sökning efter: <span className="font-semibold text-foreground">&quot;{query}&quot;</span>
              </p>

              {articles.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/artiklar/${article.id}`}
                      className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {article.image_url && (
                        <div className="relative w-full h-48">
                          <Image
                            src={article.image_url}
                            alt={article.headline}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h2 className="text-xl font-bold mb-2 line-clamp-2">
                          {article.headline}
                        </h2>
                        {article.summary && (
                          <p className="text-muted-foreground text-sm line-clamp-3">
                            {article.summary}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-3">
                          {new Date(article.createdAt).toLocaleDateString("sv-SE")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-card p-8 rounded-xl border border-border text-center">
                  <p className="text-lg text-muted-foreground">
                    Inga artiklar hittades för &quot;{query}&quot;
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Prova att söka med andra ord eller kontrollera stavningen.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-card p-8 rounded-xl border border-border text-center">
              <p className="text-lg text-muted-foreground">
                Skriv något i sökfältet för att hitta artiklar
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
