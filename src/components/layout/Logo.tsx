import Link from "next/link";
import { Handshake } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2", className)}
      aria-label="HelpHub BD — Home"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Handshake className="size-5" />
      </span>
      {!compact && (
        <span className="text-lg font-semibold tracking-tight">
          HelpHub <span className="text-primary">BD</span>
        </span>
      )}
    </Link>
  );
}