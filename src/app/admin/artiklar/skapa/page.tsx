import CreateArticleForm from "./form";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import type { Category } from "@/generated/prisma";
import { requireAdminOrEditor } from "@/lib/server-auth";

export default async function AdminSkapaArtikelPage() {

  await requireAdminOrEditor();
  const categories: Category[] = await prisma.category.findMany();
  return (
    <>
      <Navbar />
      <main className="flex grow pt-8 pb-16">
        <div className="w-3/5 max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Skapa artikel</h1>
          {/* Pass categories to client form */}
          <CreateArticleForm categories={categories} />
        </div>
      </main>
      <Footer />
    </>
  );
}
