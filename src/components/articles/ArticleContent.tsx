"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  markdown?: string | null;
  className?: string;
};

export default function ArticleContent({ markdown, className }: Props) {
  if (!markdown) {
    return (
      <div className={className ?? ""}>
        <em>Inget innehåll</em>
      </div>
    );
  }

  return (
    <div
      className={className ?? "prose prose-slate dark:prose-invert max-w-none"}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
