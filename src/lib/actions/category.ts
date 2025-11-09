"use server";

import { prisma } from "@/lib/prisma";

/**
 * Get all categories that should be shown in navbar
 */
export async function getNavbarCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { showInNavbar: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return { ok: true, categories };
  } catch (error) {
    console.error("Failed to load categories", error);
    return { ok: false, error: "Could not load categories", categories: [] };
  }
}
