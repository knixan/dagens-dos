"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import Image from "next/image";
import ArticleContent from "@/components/articles/ArticleContent";
import { generateNews } from "./ai";
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
import { saveArticle } from "./actions/articles-ai";

export default function CreateArticle({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const refSummary = useRef<MDXEditorMethods>(null);
  const refContent = useRef<MDXEditorMethods>(null);

  const [topic, setTopic] = useState("");
  const [headLine, setHeadLine] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories?.[0]?.id ?? ""
  );
  const [isEditorsChoice, setIsEditorsChoice] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);

  return (
    <>
      <Card className="p-6 mb-8 bg-background  text-secondary-foreground shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary text-lg">
            Generera AI Artikel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label htmlFor="topic" className="sr-only">
                Ämne:
              </label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic..."
                className="bg-secondary/5 border border-secondary text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              className="ml-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-95"
              onClick={async () => {
                const article = await generateNews(topic);
                setHeadLine(article.headerLine);
                setSummary(article.summary);
                setContent(article.content);
                refSummary.current?.setMarkdown(article.summary);
                refContent.current?.setMarkdown(article.content);
                console.log(article);
              }}
            >
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 border border-border bg-background text-foreground">
        <CardHeader>
          <CardTitle>Artikel Detaljer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="header" className="text-sm text-muted-foreground">
              Rubrik
            </label>
            <Input
              id="header"
              value={headLine}
              onChange={(e) => setHeadLine(e.target.value)}
              className="bg-surface border border-muted text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm text-muted-foreground">
              Bild (URL)
            </label>
            <Input
              id="image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-surface border border-muted text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Kategori</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-input rounded-md px-3 py-2 bg-background"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="editorsChoice"
              type="checkbox"
              checked={isEditorsChoice}
              onChange={(e) => setIsEditorsChoice(e.target.checked)}
              className="w-5 h-5 rounded border-input cursor-pointer"
            />
            <label htmlFor="editorsChoice" className="text-sm">
              Redaktörens Val
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="premium"
              type="checkbox"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="w-5 h-5 rounded border-input cursor-pointer"
            />
            <label htmlFor="premium" className="text-sm">
              Premium (endast för prenumeranter)
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Samanfattning
            </label>
            <div className="text-white rounded-md border border-muted p-2 bg-surface">
              <MDXEditor
                ref={refSummary}
                markdown={summary}
                onChange={setSummary}
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
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Innehåll</label>
            <div className="rounded-md border border-muted p-2 bg-surface">
              <MDXEditor
                ref={refContent}
                markdown={content}
                onChange={setContent}
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
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border bg-background text-foreground">
        <CardHeader>
          <CardTitle>Förhandsgranskning</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold text-foreground">
            {headLine || "Ingen rubrik än"}
          </h2>
          <div className="mt-4 text-muted-foreground">
            {imageUrl ? (
              <div className="mb-4 relative w-full h-56">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover rounded border"
                  unoptimized
                />
              </div>
            ) : null}
            <h3 className="font-medium">Samanfattning</h3>
            <ArticleContent
              markdown={summary}
              className="prose prose-slate dark:prose-invert max-w-none"
            />
            <h3 className="mt-4 font-medium">Innehåll</h3>
            <ArticleContent
              markdown={content}
              className="prose prose-slate dark:prose-invert max-w-none"
            />
          </div>
          <div className="mt-6">
            <Button
              className="bg-primary text-primary-foreground"
              onClick={async () => {
                // Don't wrap in try-catch - redirect() throws NEXT_REDIRECT which is normal behavior
                await saveArticle({
                  headLine,
                  summary,
                  content,
                  category: selectedCategory || categories?.[0]?.id || "",
                  image_url: imageUrl,
                  editorsChoice: isEditorsChoice,
                  premium: isPremium,
                });
                // After redirect, this code won't execute
              }}
            >
              Save Article to Database
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
