"use server"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { requireAdminOrEditor } from "@/lib/server-auth";

export async function deleteCategory(id: string) {

    await requireAdminOrEditor();
    const deletedCategory = await prisma.category.delete({
        where: { id },
    })
    console.log("Deleted category with id:", deletedCategory.id)
    redirect("/admin/kategorier")
}
