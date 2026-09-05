"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function ReviewDialog({
  open,
  onOpenChange,
  providerId,
  providerName,
  serviceRequestId,
  defaultService = "Service",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerId: string;
  providerName: string;
  serviceRequestId?: string;
  defaultService?: string;
}) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!text.trim()) {
      toast.error(t("Review should be at least 10 characters."));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          serviceRequestId,
          rating,
          text: text.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unable to send review.");
      toast.success(t("Review sent! The provider will value your feedback."));
      onOpenChange(false);
      setText("");
      setRating(5);
    } catch {
      toast.error(t("Something went wrong."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("Leave a review")} — {providerName}
          </DialogTitle>
          <DialogDescription>
            {t("How was the")} {defaultService}{" "}
            {t(
              "service? Your feedback helps the provider improve and respond better.",
            )}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
          className="space-y-4"
        >
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className=" p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "size-8",
                    (hover || rating) >= star
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted",
                  )}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm font-medium text-muted-foreground">
            {
              ["", t("Poor"), t("Okay"), t("Good"), t("Great"), t("Perfect!")][
                rating
              ]
            }
          </p>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t(
              "How was the service? The provider's work, behaviour, pricing...",
            )}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Star className="size-4" />
            )}
            {t("Send Review")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
