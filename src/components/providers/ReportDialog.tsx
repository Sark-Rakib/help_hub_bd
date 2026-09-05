"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Flag, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import type { Provider } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

const REASONS = [
  "Spam or fake profile",
  "Misleading or false information",
  "Inappropriate behaviour or language",
  "Fake photos or reviews",
  "Other",
];

export function ReportDialog({
  open,
  onOpenChange,
  provider,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Pick<Provider, "_id" | "businessName">;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [reason, setReason] = useState(REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setReason(REASONS[0]);
      setCustomReason("");
      setDescription("");
    }
    onOpenChange(next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenChange(false);
      router.push("/login");
      return;
    }
    const finalReason = reason === "Other" ? customReason.trim() : reason;
    if (finalReason.length < 5) {
      toast.error(t("Please provide a reason (at least 5 characters)."));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "provider",
          targetId: provider._id,
          reason: finalReason,
          description: description.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unable to file the report.");
      toast.success(
        json.message || t("Report submitted. Our team will review it.")
      );
      onOpenChange(false);
    } catch {
      toast.error(t("Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="size-4 text-destructive" /> {t("Report this provider")}
          </DialogTitle>
          <DialogDescription>
            {t("Tell us what's wrong with")} <strong>{provider.businessName}</strong>. {t("Our team reviews every report.")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="report-reason"
              className="text-sm font-medium text-foreground"
            >
              {t("Reason for report")}
            </label>
            <select
              id="report-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {t(r)}
                </option>
              ))}
            </select>
          </div>
          {reason === "Other" && (
            <div className="space-y-1.5">
              <label
                htmlFor="report-custom"
                className="text-sm font-medium text-foreground"
              >
                {t("Your reason")}
              </label>
              <textarea
                id="report-custom"
                rows={2}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder={t("Describe the issue (at least 5 characters)")}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label
              htmlFor="report-description"
              className="text-sm font-medium text-foreground"
            >
              {t("Additional details")}{" "}
              <span className="text-muted-foreground">{t("(optional)")}</span>
            </label>
            <textarea
              id="report-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("Dates, quotes, links — anything that helps us investigate")}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Flag className="size-4" />
            )}
            {t("Submit report")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}