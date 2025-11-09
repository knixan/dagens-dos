import CreateArticle from "./createArticle";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";

export default async function ArticleAIPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany();
  const simplified = categories.map((c) => ({ id: c.id, name: c.name }));
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {/* pass categories to client */}
      <CreateArticle categories={simplified} />
    </div>
  );
}
