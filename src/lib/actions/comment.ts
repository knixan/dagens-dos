"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type CommentWithUser = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

export async function getComments(
  articleId: string
): Promise<CommentWithUser[]> {
  try {
    const comments = await prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return comments;
  } catch (err) {
    console.error("Failed to fetch comments:", err);
    return [];
  }
}

export async function createComment(
  articleId: string,
  content: string
): Promise<{ success: boolean; comment?: CommentWithUser; error?: string }> {
  try {
    const hdrs = await headers();
    const session = await auth.api.getSession({
      headers: hdrs as unknown as Record<string, string>,
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: "Du måste vara inloggad för att kommentera",
      };
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return { success: false, error: "Kommentaren får inte vara tom" };
    }

    const created = await prisma.comment.create({
      data: {
        content: trimmedContent,
        userId: session.user.id,
        articleId,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return { success: true, comment: created };
  } catch (err) {
    console.error("Failed to create comment:", err);
    return { success: false, error: "Kunde inte skapa kommentar" };
  }
}
