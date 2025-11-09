"use client";

import Link from "next/link";
import * as React from "react";

interface PopularItem {
  title: string;
  href?: string;
}

interface Props {
  popular?: PopularItem[];
}

export default function MostPopular({ popular }: Props) {
  // If no popular items are provided, render nothing
  if (!popular || popular.length === 0) return null;

  return (
    <section className="rounded-xl border bg-card text-card-foreground p-6 shadow">
      <h3 className="text-xl text-secondary font-bold mb-1 border-b pb-1">
        Mest Populärt
      </h3>
      <ul className="space-y-4">
        {popular.map((item, i) => {
          const numberColor =
            i === 0 ? "text-primary" : "text-muted-foreground";
          const borderColor = i === 0 ? "border-primary/60" : "border-muted";
          const content = (
            <>
              <span className={`font-bold mr-2 ${numberColor}`}>{i + 1}.</span>
              {item.title}
            </>
          );
          return (
            <li
              // Use a key that is unique for this list entry. Titles may be duplicated
              // (which caused the console warning), so append the index as a simple
              // fallback. Prefer a stable unique id if available from the data.
              key={`${item.title}-${i}`}
              className={`text-sm md:text-base leading-snug cursor-pointer border-l-4 ${borderColor} pl-3 hover:text-primary transition-colors`}
            >
              {item.href ? (
                <Link href={item.href} className="block">
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
