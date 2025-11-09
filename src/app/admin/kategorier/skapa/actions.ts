"use server";

import { prisma } from "@/lib/prisma";
import { CategorySchema, CategoryValues } from "./schema";
import { requireAdminOrEditor } from "@/lib/server-auth";
/* 
import {auth} from "@/lib/auth"
import {headers} from "next/headers"
*/
export async function createCategory(values: CategoryValues) {

  await requireAdminOrEditor();
  /* const session = await auth.api.getSession({
    headers : await headers(),
    }) 
    if (!session) {
    redirect("/sign-in")
    }
    */

  // Validera och transformera inkommande data med Zod-schemat
  const data = await CategorySchema.parseAsync(values);
  const category = await prisma.category.create({
    data: {
      name: data.name,
      showInNavbar: data.showInNavbar ?? false,
    },
  });

  // returnerar den skapade kategorin
  return {
    id: category.id,
    name: category.name,
    showInNavbar: category.showInNavbar,
  };
}
