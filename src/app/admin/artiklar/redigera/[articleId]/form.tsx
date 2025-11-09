"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  headingsPlugin,
  InsertTable,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { Button } from "@/components/ui/button";
import { ArticleEditSchema, ArticleEditValues } from "./schema";
import { editArticle } from "./actions";
import type { Article, Category } from "@/generated/prisma";

// Prisma Article has a single `category` relation (object). Some parts of the app
// previously expected an array; handle both shapes at runtime.
type ArticleWithCategories = Article & { category?: Category | Category[] };

export default function ArticleEditForm({
  article,
  categories,
}: {
  article: ArticleWithCategories;
  categories: Category[];
}) {
  const refSummary = React.useRef<MDXEditorMethods | null>(null);
  const refContent = React.useRef<MDXEditorMethods | null>(null);

  const form = useForm<ArticleEditValues>({
    resolver: zodResolver(ArticleEditSchema),
    defaultValues: {
      id: article.id,
      headline: article.headline,
      summary: article.summary,
      content: article.content,
      image_url: article.image_url,
      editorsChoice: !!article.editorsChoice,
      categoryIds: Array.isArray(article.category)
        ? (article.category as Category[]).map((c) => c.id)
        : article.category && (article.category as Category).id
        ? [(article.category as Category).id]
        : [],
    },
  });

  async function onSubmit(values: ArticleEditValues) {
    await editArticle(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="headline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headline</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <div className="text-white rounded-md border border-muted p-2 bg-surface">
                  <MDXEditor
                    ref={refSummary}
                    markdown={field.value ?? ""}
                    onChange={(md) => field.onChange(md)}
                    contentEditableClassName="prose prose-slate"
                    className="min-h-[120px] prose max-w-none text-foreground bg-transparent"
                    plugins={[
                      headingsPlugin(),
                      listsPlugin(),
                      quotePlugin(),
                      thematicBreakPlugin(),
                      linkPlugin(),
                      linkDialogPlugin(),
                      tablePlugin(),
                      toolbarPlugin({
                        toolbarContents: () => (
                          <>
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <BlockTypeSelect />
                            <ListsToggle />
                            <InsertTable />
                          </>
                        ),
                      }),
                    ]}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <div className="rounded-md border border-muted p-2 bg-surface">
                  <MDXEditor
                    ref={refContent}
                    markdown={field.value ?? ""}
                    onChange={(md) => field.onChange(md)}
                    className="min-h-[220px] prose max-w-none text-foreground bg-transparent"
                    plugins={[
                      headingsPlugin(),
                      listsPlugin(),
                      quotePlugin(),
                      thematicBreakPlugin(),
                      linkPlugin(),
                      linkDialogPlugin(),
                      tablePlugin(),
                      toolbarPlugin({
                        toolbarContents: () => (
                          <>
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <BlockTypeSelect />
                            <ListsToggle />
                            <InsertTable />
                          </>
                        ),
                      }),
                    ]}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="editorsChoice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Editors Choice</FormLabel>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategorier</FormLabel>
              <FormControl>
                <select
                  multiple
                  value={field.value ?? []}
                  onChange={(e) =>
                    field.onChange(
                      Array.from(e.currentTarget.selectedOptions).map(
                        (o) => o.value
                      )
                    )
                  }
                  className="w-full border rounded p-2"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sparar..." : "Spara förändringar"}
        </Button>
      </form>
    </Form>
  );
}
