"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Article } from "@/types/articles";

type Props = {
  articles: Article[];
};

export function EditorChoiceCarousel({ articles }: Props) {
  const plugin = React.useRef(
    Autoplay({ delay: 2700, stopOnInteraction: false })
  );

  const handleMouseEnter = () => {
    if (plugin.current) {
      plugin.current.stop();
    }
  };

  const handleMouseLeave = () => {
    if (plugin.current) {
      plugin.current.play();
    }
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
      <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
        Redaktörens val
      </h2>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CarouselContent>
          {articles.map((article) => (
            <CarouselItem key={article.id}>
              <div className="flex flex-col md:flex-row gap-6">
                <Link
                  href={`/artiklar/${article.slug}`}
                  className="md:w-1/2 block rounded-lg overflow-hidden shadow-md relative"
                  aria-label={article.title}
                >
                  {article.premium ? (
                    <div className="absolute left-3 top-3 bg-foreground/70 text-secondary-foreground shadow px-2 py-0.5 rounded-md text-xs font-semibold">
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
                  <Link
                    href={`/artiklar/${article.slug}`}
                    className="mt-2 block"
                  >
                    <h3 className="text-3xl font-extrabold text-foreground leading-tight hover:text-primary cursor-pointer">
                      {article.title}
                    </h3>
                  </Link>
                  <div className="mt-4 text-muted-foreground line-clamp-6 prose prose-md max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {article.excerpt}
                    </ReactMarkdown>
                  </div>
                  <Link
                    href={`/artiklar/${article.slug}`}
                    className="mt-4 inline-flex items-center text-primary hover:text-primary/90 font-small"
                  >
                    Läs mer &rarr;
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
}

export default EditorChoiceCarousel;
