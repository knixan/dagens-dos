import LinkButton from "@/components/Buttons/LinkButton";
import type { Category } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import SearchForm from "@/components/Forms/SearchForm";
import { requireAdminOrEditor } from "@/lib/server-auth";
import DeleteButton from "../artiklar/ta-bort/delete-button";

// Next 15: searchParams is async in Server Components. Accept as Promise and await it.
export default async function AdminArtiklarPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {

  await requireAdminOrEditor();

  const params = await searchParams;
  const q = params?.q ?? "";
  const where = q
    ? {
      OR: [{ headline: { contains: q } }, { summary: { contains: q } }],
    }
    : undefined;

  const articles = await prisma.article.findMany({
    where,
    include: { category: true },
  });
  return (
    <>
      <Navbar />
      <main className="flex grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Admin: Artiklar</h1>
          <div className="flex gap-4 mb-6 items-center">
            <SearchForm
              defaultValue={q}
              placeholder="Sök artiklar..."
              className="flex gap-2"
            />
            <div className="ml-auto flex gap-2">
              <LinkButton href="/admin/artiklar/skapa" variant="primary">
                Skapa Artikel
              </LinkButton>
              <LinkButton
                href="/admin/artiklar-ai"
                variant="primary"
                className="hidden md:inline-flex"
              >
                Skapa AI Artikel
              </LinkButton>
            </div>
          </div>
          <ul className="space-y-4">
            {articles.map((a) => (
              <li key={a.id} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{a.headline}</div>
                  <div className="text-sm text-muted-foreground">
                    {Array.isArray(a.category)
                      ? (a.category as Category[]).map((c) => c.name).join(", ")
                      : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <LinkButton
                    href={`/admin/artiklar/redigera/${a.id}`}
                    variant="primary"
                  >
                    Redigera
                  </LinkButton>
                  <DeleteButton id={a.id} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
