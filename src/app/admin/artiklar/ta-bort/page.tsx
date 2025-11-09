import { prisma } from "@/lib/prisma";
import DeleteButton from "./delete-button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { requireAdminOrEditor } from "@/lib/server-auth";

export default async function AdminDeleteArticlesPage() {

  await requireAdminOrEditor();
  const articles = await prisma.article.findMany({ include: { category: true } });
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Ta bort artiklar</h1>
          <ul className="space-y-4">
            {articles.map((a) => (
              <li key={a.id} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{a.headline}</div>
                  <div className="text-sm text-muted-foreground">{Array.isArray(a.category) ? a.category.map((c) => c.name).join(', ') : ''}</div>
                </div>
                <DeleteButton id={a.id} />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
