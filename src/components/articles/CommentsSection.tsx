"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/client/auth-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getComments,
  createComment,
  type CommentWithUser,
} from "@/lib/actions/comment";

type CommentsSectionProps = {
  articleId: string;
};

export default function CommentsSection({ articleId }: CommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  async function load() {
    setIsLoading(true);
    try {
      const data = await getComments(articleId);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
      toast.error("Kunde inte ladda kommentarer");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Kommentaren får inte vara tom");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createComment(articleId, content);

      if (result.success && result.comment) {
        setComments((prev) => [result.comment!, ...prev]);
        setContent("");
        toast.success("Kommentar skapad!");
      } else {
        toast.error(result.error || "Kunde inte skapa kommentar");
      }
    } catch (err) {
      console.error("Failed to create comment:", err);
      toast.error("Kunde inte skapa kommentar");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="text-2xl font-bold mb-6">
        Kommentarer ({comments.length})
      </h2>

      {/* Comment form - only for logged in users */}
      {session?.user ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Skriv en kommentar..."
            rows={4}
            className="w-full"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Skickar..." : "Skicka kommentar"}
          </Button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-muted/30 rounded-lg border border-border">
          <p className="text-muted-foreground">
            Du måste vara{" "}
            <a href="/logga-in" className="text-primary hover:underline">
              inloggad
            </a>{" "}
            för att kommentera.
          </p>
        </div>
      )}

      {/* Comments list */}
      {isLoading ? (
        <p className="text-muted-foreground">Laddar kommentarer...</p>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground">
          Inga kommentarer än. Bli först att kommentera!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-border pb-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-semibold text-foreground">
                      {comment.user.name || comment.user.email}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString("sv-SE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
