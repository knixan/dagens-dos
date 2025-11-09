"use client";

import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { CategorySchema, CategoryValues } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateCategoryForm() {
  const router = useRouter();

  // Typa om zodResolver till RHF:s Resolver<CategoryValues> så att
  // useForm generics och resolver-typen matchar
  const rhfResolver = zodResolver(CategorySchema) as Resolver<CategoryValues>;

  const form = useForm<CategoryValues>({
    resolver: rhfResolver,
    defaultValues: {
      name: "",
      showInNavbar: false,
    },
  });
  // hanteraring av formulärsändning
  async function onSubmit(values: CategoryValues) {
    try {
      const res = (await createCategory(values)) as {
        id: string;
        name: string;
      };
      toast.success(`Kategori skapad: ${res.name}`);
      form.reset();
      // uppdatera sidan eller navigera vid behov, den uppdateras inte atomatiskt.
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Kunde inte skapa kategori");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Namn: </FormLabel>
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

        <Button
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? "Loading..." : "Skapa kategori"}
        </Button>
      </form>
    </Form>
  );
}
