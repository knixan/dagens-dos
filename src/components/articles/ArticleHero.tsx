import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Article } from "@/types/articles";

type Props = {
  article: Article;
  className?: string;
};

export function ArticleHero({ article, className = "" }: Props) {
  return (
    <article
      className={cn(
        "bg-card p-6 rounded-xl shadow-lg border border-border",
        className
      )}
    >
      <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
        Senaste
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        <Link
          href={`/artiklar/${article.slug}`}
          className="md:w-1/2 block rounded-lg overflow-hidden shadow-md relative"
          aria-label={article.title}
        >
          {article.premium ? (
            <div className="absolute left-3 top-3 bg-foreground/70 text-secondary-foreground shaddow px-2 py-0.5 rounded-md text-xs font-semibold">
              Premium Artikel
            </div>
          ) : null}
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            width={800}
            height={500}
            className="object-cover w-full h-full"
          />
        </Link>

        <div className="md:w-1/2">
          <p className="text-sm font-semibold text-primary uppercase">
            {article.category}
          </p>
          <Link href={`/artiklar/${article.slug}`} className="mt-2 block">
            <h3 className="text-3xl font-extrabold text-foreground leading-tight hover:text-primary cursor-pointer">
              {article.title}
            </h3>
          </Link>
          <div className="mt-4 text-muted-foreground line-clamp-8 prose prose-md max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.excerpt}
            </ReactMarkdown>
          </div>
          <Link
            href={`/artiklar/${article.slug}`}
            className="mt-4 inline-flex items-center text-primary hover:text-primary/90 font-medium"
          >
            Läs mer &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ArticleHero;
