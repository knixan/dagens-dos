"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/client/auth-client";
import { toast } from "sonner";

export default function LoginForm(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams?.get("next");

  type FormData = { email: string; password: string };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { email: "", password: "" } });

  async function onSubmit(data: FormData) {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message || "Kunde inte logga in");
      return;
    }

    toast.success("Inloggad");
    router.refresh();
    // If a next param exists (e.g. checkout), go there. Otherwise go to account.
    if (nextParam) {
      // decode and navigate
      try {
        const decoded = decodeURIComponent(nextParam);
        router.push(decoded);
        return;
      } catch (e) {
        console.warn("Failed to decode next param", e);
      }
    }
    router.push("/mina-sidor");
  }

  return (
    <section className="bg-card p-6 rounded-xl shadow border border-border">
      <h1 className="text-3xl font-extrabold text-foreground mb-2">Logga in</h1>

      <p className="text-muted-foreground mb-6">
        Logga in för att hantera din prenumeration och dina inställningar.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            E-post
          </label>
          <Input
            type="email"
            {...register("email", {
              required: "E-post krävs",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Ogiltig e-post",
              },
            })}
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Lösenord
          </label>
          <Input
            type="password"
            {...register("password", {
              required: "Lösenord krävs",
              minLength: { value: 6, message: "Minst 6 tecken" },
            })}
          />
          {errors.password && (
            <p className="text-xs text-destructive mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            disabled={isSubmitting}
          >
            Avbryt
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loggar in..." : "Logga in"}
          </Button>
        </div>
      </form>
    </section>
  );
}
