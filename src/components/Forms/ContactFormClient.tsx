"use client";
// filepath: src/components/Forms/ContactFormClient.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { ContactFormData } from "@/lib/actions/contact-actions";

const contactSchema = z.object({
  name: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  email: z.string().email("Ogiltig e-postadress"),
  message: z.string().min(10, "Meddelandet måste vara minst 10 tecken"),
});

type FormData = z.infer<typeof contactSchema>;

interface Props {
  sendEmailAction: (data: ContactFormData) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export default function ContactFormClient({
  sendEmailAction,
}: Props): React.ReactElement {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);

    try {
      const result = await sendEmailAction(data);

      if (result.success) {
        toast.success("Meddelande skickat!", {
          description: "Vi återkommer så snart som möjligt.",
        });
        reset();
      } else {
        toast.error(result.error || "Kunde inte skicka meddelandet");
      }
    } catch (error) {
      console.error("[ContactForm] Submit error:", error);
      toast.error("Ett oväntat fel uppstod");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Namn */}
      <div>
        <Label htmlFor="name">Namn *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Ditt namn"
          {...register("name")}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">E-postadress *</Label>
        <Input
          id="email"
          type="email"
          placeholder="din@email.se"
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Meddelande */}
      <div>
        <Label htmlFor="message">Meddelande *</Label>
        <Textarea
          id="message"
          placeholder="Skriv ditt meddelande här..."
          rows={6}
          {...register("message")}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Submit button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Skickar..." : "Skicka meddelande"}
      </Button>
    </form>
  );
}
