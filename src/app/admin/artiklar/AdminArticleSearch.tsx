"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminArticleSearch({
  onSearch,
}: {
  onSearch: (q: string) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<{ q: string }>({
    defaultValues: { q: searchParams.get("q") ?? "" },
  });

  useEffect(() => {
    setValue("q", searchParams.get("q") ?? "");
  }, [searchParams, setValue]);

  function onSubmit(values: { q: string }) {
    const q = values.q ?? "";
    const params = new URLSearchParams(
      Array.from(searchParams?.entries() ?? [])
    );
    if (q) params.set("q", q);
    else params.delete("q");
    const qs = params.toString();
    router.replace(qs ? `/admin/artiklar?${qs}` : "/admin/artiklar");
    onSearch(q);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <Input
        {...register("q")}
        className="border rounded px-2 py-1"
        placeholder="Sök artiklar..."
      />
      <Button type="submit" className="px-3 py-1">
        Sök
      </Button>
    </form>
  );
}
