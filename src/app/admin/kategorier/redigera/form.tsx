"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// Importera typen från den genererade Prisma-klienten
import type { Category } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CategorySchema, CategoryValues } from "./schema";
import { editCategory } from "./actions";

export default function CategoryEditForm({ category }: { category: Category }) {
  // Typa om zodResolver till RHF:s Resolver<CategoryValues> så att
  // useForm generics och resolver-typen matchar
  const rhfResolver = zodResolver(CategorySchema) as Resolver<CategoryValues>;

  const form = useForm<CategoryValues>({
    resolver: rhfResolver,
    defaultValues: {
      id: category.id,
      name: category.name,
      // showInNavbar finns på Category-typen, använd direkt
      showInNavbar: category.showInNavbar ?? false,
    },
  });

  async function onSubmit(values: CategoryValues) {
    await editCategory(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="showInNavbar"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3">
              <FormControl>
                <input
                  type="checkbox"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4"
                />
              </FormControl>
              <div>
                <FormLabel className="!mb-0">Visa i navigering</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
