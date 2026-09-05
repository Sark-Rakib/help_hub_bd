import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  size = "md",
  showValue = true,
  className,
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}) {
  const sizeCls = {
    sm: "size-3",
    md: "size-3.5",
    lg: "size-5",
  }[size];

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex items-center gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeCls,
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-sm font-semibold tabular-nums">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}

export function RatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star`}
          onClick={() => onChange(star)}
          className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Star
            className={cn(
              "size-7",
              star <= value ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
            )}
          />
        </button>
      ))}
    </div>
  );
}