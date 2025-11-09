/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export async function saveArticle(data: {
  headLine: string;
  summary: string;
  content: string;
  category: string; // category id
  image_url?: string;
  editorsChoice?: boolean;
  premium?: boolean;
}) {
  // require admin session and use that user as author
  const session = await requireAdmin();

  if (!data.headLine || !data.summary || !data.content || !data.category) {
    throw new Error("All fields are required");
  }

  await prisma.article.create({
    // cast to any until prisma client is regenerated
    data: {
      headline: data.headLine,
      summary: data.summary,
      content: data.content,
      image_url: data.image_url ?? "",
      editorsChoice: data.editorsChoice ?? false,
      premium: data.premium ?? false,
      categoryId: data.category,
      authorId: session.user.id,
    } as any,
  });
  // After creating via AI flow, navigate the admin back to the articles list
  redirect(`/admin/artiklar`);
}
