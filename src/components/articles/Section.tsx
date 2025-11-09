import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({ title, children, className = "" }: Props) {
  return (
    <section className={cn("space-y-6", className)}>
      {title ? (
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

export default Section;
