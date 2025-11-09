"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/lib/actions/admin";

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("Är du säker på att du vill ta bort användaren?")) return;

    startTransition(async () => {
      try {
        const result = await deleteUser(id);

        if (result?.ok) {
          toast.success("Användaren togs bort");
          router.refresh();
          router.push("/admin/anvandare");
        } else {
          toast.error("Kunde inte ta bort: " + (result?.error ?? "okänt fel"));
        }
      } catch (err) {
        console.error(err);
        toast.error("Något gick fel");
      }
    });
  };

  return (
    <Button
      className="bg-red-600 p-2 rounded-lg text-white"
      disabled={isPending}
      onClick={handleDelete}
    >
      {isPending ? "Tar bort..." : "Ta bort"}
    </Button>
  );
}
