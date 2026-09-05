"use client";

import Link from "next/link";
import { MapPin, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/StarRating";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { getCategoryName, formatBDT, prettyArea } from "@/lib/constants";
import { CategoryIcon } from "@/components/shared/CategoryIcon";
import type { Provider } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

export function ProviderCard({
  provider,
  compact = false,
}: {
  provider: Provider;
  compact?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <Card
      size={compact ? "sm" : "default"}
      className="group/card h-full gap-0 hover:shadow-md hover:ring-primary/20 transition-all duration-200"
    >
      {/* Avatar / cover strip */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <Avatar className="size-12 rounded-xl ring-1 ring-border">
          {provider.avatar ? (
            <AvatarImage src={provider.avatar} alt={provider.businessName} />
          ) : (
            <AvatarFallback className="bg-brand-50 text-brand-700 text-sm font-semibold">
              {provider.businessName
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-start gap-1.5">
            <CategoryIcon slug={provider.category} className="size-4 shrink-0 text-primary" />
            <span className="truncate text-xs font-medium text-primary">
              {t(getCategoryName(provider.category))}
            </span>
          </div>
          <Link
            href={`/providers/${provider.slug}`}
            className="mt-0.5 block truncate text-base font-semibold hover:text-primary transition-colors"
          >
            {provider.businessName}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <StarRating rating={provider.rating} size="sm" />
            <span>({provider.reviewCount} {t("reviews")})</span>
            {provider.verified && <VerifiedBadge verified className="!px-0" label={t("Verified")} />}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Briefcase className="size-3.5" />
            {provider.experience} {t("yr experience")}
          </span>
          {provider.location?.area && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {prettyArea(provider.location.area)}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3 pb-0">
          <div>
            {provider.startingPrice ? (
              <p className="text-sm">
                <span className="font-semibold text-foreground">
                  {formatBDT(provider.startingPrice)}
                </span>{" "}
                <span className="text-xs text-muted-foreground">{t("starting from")}</span>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">{t("Price negotiable")}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {provider.availability !== "available" && (
              <span className="text-xs text-muted-foreground capitalize">
                {t(provider.availability)}
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              render={
                <Link href={`/providers/${provider.slug}`}>
                  {t("View Profile")}
                </Link>
              }
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

/* Skeleton loader for provider cards */
export function ProviderCardSkeleton() {
  return (
    <Card className="gap-0 p-4">
      <div className="flex items-start gap-3">
        <div className="size-12 animate-pulse rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-border/60 pt-3">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-28 animate-pulse rounded-lg bg-muted" />
      </div>
    </Card>
  );
}