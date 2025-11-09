"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, type SignUpInput } from "@/lib/schema/zod-auth";
import { authClient } from "@/lib/client/auth-client";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

type FormValues = SignUpInput;

export default function SignUpForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPass: "" },
  });

  async function onSubmit(values: FormValues) {
    console.log("[SignUp] Form submitted with:", {
      name: values.name,
      email: values.email,
    });

    setError(null); // Rensa tidigare fel
    setLoading(true);

    try {
      console.log("[SignUp] Calling authClient.signUp.email...");

      const res = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      console.log("[SignUp] response:", res);

      if (res.error) {
        console.error("[SignUp] Error:", res.error);

        // Hantera specifika felkoder
        if (
          res.error.code === "USER_ALREADY_EXISTS" ||
          res.error.message?.toLowerCase().includes("existing email") ||
          res.error.message?.toLowerCase().includes("already exists")
        ) {
          setError(
            "Denna e-postadress används redan. Vänligen använd en annan e-postadress eller logga in om du redan har ett konto."
          );
        } else {
          setError(res.error?.message || "Kunde inte skapa konto");
        }
        setLoading(false);
        return;
      }

      console.log("[SignUp] Success!");
      toast.success(
        "Konto skapat! Kontrollera din e-post för verifieringslänk.",
        {
          duration: 8000, // Visa i 8 sekunder (längre än standard)
          description:
            "Ett verifieringsmail har skickats till din e-postadress.",
        }
      );
      // Lägg till email-parametern så användaren ser sin email på login-sidan
      router.push(
        `/logga-in?message=check-email&email=${encodeURIComponent(
          values.email
        )}`
      );
      onSuccess?.();
    } catch (err) {
      console.error("[SignUp] Caught error:", err);
      setError("Ett oväntat fel inträffade. Försök igen.");
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Alert - Synlig felruta */}
        {error && (
          <Alert variant="destructive" className="border-2 shadow-lg">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-semibold text-lg">
              Registrering misslyckades
            </AlertTitle>
            <AlertDescription className="text-base mt-2">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Namn</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ditt namn"
                  {...field}
                  disabled={loading}
                  className="h-12 text-base border-2 rounded-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                E-postadress
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="din@email.se"
                  {...field}
                  disabled={loading}
                  className="h-12 text-base border-2 rounded-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Lösenord</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Minst 8 tecken"
                  {...field}
                  disabled={loading}
                  className="h-12 text-base border-2 rounded-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPass"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Bekräfta lösenord
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Upprepa lösenordet"
                  {...field}
                  disabled={loading}
                  className="h-12 text-base border-2 rounded-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base font-semibold rounded-xl"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Skapar konto...
            </>
          ) : (
            "Skapa konto"
          )}
        </Button>
      </form>
    </Form>
  );
}
