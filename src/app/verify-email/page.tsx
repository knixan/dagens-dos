"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/client/auth-client";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const result = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (result.ok) {
          setStatus("success");
          toast.success("E-postadress verifierad!");
          setTimeout(() => router.push("/mina-sidor"), 2000);
        } else {
          setStatus("error");
          toast.error("Kunde inte verifiera e-postadressen");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        toast.error("Ett fel uppstod vid verifiering");
      }
    }

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-card p-6 rounded-xl shadow text-center">
        {status === "verifying" && <p>Verifierar din e-postadress...</p>}
        {status === "success" && (
          <p className="text-green-600">
            Din e-postadress har verifierats! Omdirigerar...
          </p>
        )}
        {status === "error" && (
          <div>
            <p className="text-red-600">Kunde inte verifiera e-postadressen</p>
            <button
              onClick={() => router.push("/logga-in")}
              className="mt-4 px-4 py-2 bg-primary text-white rounded"
            >
              Gå till inloggning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
