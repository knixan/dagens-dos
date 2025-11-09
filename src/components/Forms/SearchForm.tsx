"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Props = {
  defaultValue?: string;
  paramName?: string;
  placeholder?: string;
  className?: string;
};

export default function SearchForm({
  defaultValue = "",
  paramName = "q",
  placeholder = "Sök...",
  className = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { register, handleSubmit } = useForm<{ q: string }>({
    defaultValues: { q: defaultValue ?? searchParams?.get(paramName) ?? "" },
  });

  function onSubmit(values: { q: string }) {
    const params = new URLSearchParams(
      Array.from(searchParams?.entries() ?? [])
    );
    if (values.q) {
      params.set(paramName, values.q);
    } else {
      params.delete(paramName);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="flex items-center gap-2">
        <Input
          {...register("q")}
          defaultValue={defaultValue}
          placeholder={placeholder}
        />
        <Button type="submit">Sök</Button>
      </div>
    </form>
  );
}
