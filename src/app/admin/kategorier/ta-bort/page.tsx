import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import DeleteButton from "./delete-button";
import type { Category } from "@/generated/prisma";
import { requireAdminOrEditor } from "@/lib/server-auth";

export default async function AdminTaBortKategoriPage() {

  await requireAdminOrEditor();
  const categories: Category[] = await prisma.category.findMany();
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Ta bort kategori</h1>
          <ul className="space-y-4">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{c.name}</div>
                </div>
                <DeleteButton id={c.id} />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
