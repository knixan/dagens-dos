"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArticleEditSchema, ArticleEditValues } from "./schema";
import { requireAdminOrEditor } from "@/lib/server-auth";

export async function editArticle(values: ArticleEditValues) {

  await requireAdminOrEditor();
  const data = await ArticleEditSchema.parseAsync(values);

  const categoryId = data.categoryIds?.[0];
  // Uppdatera artikeln med de nya värdena
  const updated = await prisma.article.update({
    where: { id: data.id },
    data: {
      headline: data.headline,
      summary: data.summary,
      content: data.content,
      image_url: data.image_url,
      editorsChoice: data.editorsChoice,
      // Enbart koppla kategorin om en categoryId finns
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
    },
  });
  // Efter uppdatering, omdirigera till admin artikelsidan
  redirect(`/admin/artiklar`);
}
