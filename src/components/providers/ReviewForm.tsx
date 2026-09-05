"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingInput } from "@/components/shared/StarRating";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ReviewForm({
  slug,
  providerId,
}: {
  slug: string;
  providerId: string;
}) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-4 text-center text-sm text-muted-foreground">
        {t("Login to leave a review")}
      </div>
    );
  }

  const submit = async () => {
    if (!rating) {
      setError(t("Choose a rating (1-5)"));
      return;
    }
    if (text.trim().length < 3) {
      setError(t("Write a bit more to your review"));
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, rating, text }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(t(json.error ?? "Something went wrong. Please try again."));
        return;
      }
      toast.success(t("Thanks! Your review has been published."));
      setRating(0);
      setText("");
      void qc.invalidateQueries({ queryKey: ["reviews", slug] });
      void qc.invalidateQueries({ queryKey: ["provider", slug] });
    } catch {
      setError(t("Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {error && (
        <p className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <Star className="size-4 text-amber-400" />
        <span className="text-sm font-semibold">{t("Leave a review")}</span>
      </div>
      <div className="mt-2">
        <RatingInput value={rating} onChange={setRating} />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder={t("Share your experience with this provider...")}
        maxLength={1000}
        className="mt-3 w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary"
      />
      <div className={cn("mt-3 flex items-center justify-between")}>
        <span className="text-xs text-muted-foreground">
          {text.length}/1000
        </span>
        <Button size="sm" onClick={submit} disabled={submitting}>
          <Send className="size-3.5" />
          {submitting ? t("Submitting...") : t("Submit review")}
        </Button>
      </div>
    </div>
  );
}
