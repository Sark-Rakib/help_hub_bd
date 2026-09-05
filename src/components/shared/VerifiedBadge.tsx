import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({
  verified,
  className,
  label = "Verified Provider",
}: {
  verified: boolean;
  className?: string;
  label?: string;
}) {
  if (!verified) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700",
        className
      )}
    >
      <BadgeCheck className="size-3.5" />
      {label}
    </span>
  );
}