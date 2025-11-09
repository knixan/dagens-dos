import { requireAdminOrEditor } from "@/lib/server-auth";
import CreateCategoryForm from "./form";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function AdminSkapaKategoriPage() {

  await requireAdminOrEditor();
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Skapa kategori</h1>
          <CreateCategoryForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
