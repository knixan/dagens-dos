"use client";
import { Button } from "@/components/ui/button";

export function DeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {

    return (
        <Button
            className="bg-red-500 p-2 rounded-lg"
            onClick={async () => {
                if (confirm("Are you sure you want to delete this article?")) {
                    await onDelete();
                }
            }}
        >
            Delete article
        </Button>
    );
}
export default DeleteButton;
