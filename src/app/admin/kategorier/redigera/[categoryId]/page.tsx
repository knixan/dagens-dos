import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { requireAdminOrEditor } from "@/lib/server-auth";
import EditForm from "../form";
import type { Category } from "@/generated/prisma";

export default async function AdminEditCategoryPage({ params }: { params: { categoryId: string } }) {

  await requireAdminOrEditor();
  const categoryId = params.categoryId;
  if (!categoryId) return notFound();

  const category: Category | null = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return notFound();

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Redigera kategori</h1>
          <EditForm category={category} />
        </div>
      </main>
      <Footer />
    </>
  );
}
