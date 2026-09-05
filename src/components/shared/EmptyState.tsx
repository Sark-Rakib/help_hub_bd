import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
      {Icon && (
        <span className="flex size-14 items-center justify-center rounded-full bg-card ring-1 ring-border">
          <Icon className="size-7 text-muted-foreground" />
        </span>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      )}
      {actionHref ? (
        <Button render={<Link href={actionHref}>{actionLabel}</Link>} className="mt-1" />
      ) : actionLabel && actionOnClick ? (
        <Button onClick={actionOnClick} className="mt-1">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}