import { prisma } from "@/lib/prisma";
import { requireAdminOrEditor } from "@/lib/server-auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import CreateCategoryForm from "./skapa/form";
import type { Category } from "@/generated/prisma";
import DeleteButton from "./ta-bort/delete-button";

export default async function AdminKategorierPage() {
  // Require admin session for access to this page

  await requireAdminOrEditor();
  // NOTE: search is temporarily disabled to avoid App Router sync-dynamic-apis complexity.
  // We list all categories and provide inline edit/delete buttons per row.
  const categories: Category[] = await prisma.category.findMany();

  return (
    <>
      <Navbar />
      <main className="flex grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Admin: Kategorier</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start">
            <div className="flex gap-2">
              <input
                name="q"
                placeholder="Sök kategorier..."
                className="border-input rounded px-2 py-1"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded"
              >
                Sök
              </button>
            </div>
            <div>
              {/* Inline create form */}
              <CreateCategoryForm />
            </div>
          </div>

          <ul className="space-y-4">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{c.name}</div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/kategorier/redigera/${c.id}`}
                    className="text-primary"
                  >
                    Redigera
                  </Link>
                  {/* Inline client delete button that calls the admin delete API */}
                  <DeleteButton id={c.id} />
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
