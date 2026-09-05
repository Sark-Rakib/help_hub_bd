"use client";

import { Heart } from "lucide-react";
import { ProviderCard, ProviderCardSkeleton } from "@/components/providers/ProviderCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/hooks/useQueries";
import type { Provider } from "@/types";

export function SavedProviders() {
  const { t } = useLanguage();
  const { data, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProviderCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const favorites = (data ?? []).filter(
    (f): f is typeof f & { provider: Provider } =>
      Boolean(f.provider && typeof f.provider === "object")
  );

  if (favorites.length === 0) {
    return (
      <EmptyState
        title={t("No providers saved yet")}
        description={t("Tap the heart icon on a provider profile to save it here.")}
        actionLabel={t("Browse providers")}
        actionHref="/providers"
        icon={Heart}
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((f) => {
        const provider = f.provider as Provider;
        return <ProviderCard key={f._id} provider={provider} />;
      })}
    </div>
  );
}