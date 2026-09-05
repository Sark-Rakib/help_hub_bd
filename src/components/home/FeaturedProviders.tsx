"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ProviderCard, ProviderCardSkeleton } from "@/components/providers/ProviderCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import type { Provider } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

export function FeaturedProviders() {
  const { t } = useLanguage();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["featured-providers"],
    queryFn: async () => {
      const res = await fetch("/api/providers?limit=8&verifiedOnly=true&sort=recommended");
      if (!res.ok) throw new Error("Unable to load providers.");
      const json = await res.json();
      return json.data as Provider[];
    },
  });

  return (
    <section id="featured-providers" className="scroll-mt-20 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-balance sm:text-3xl">
            {t("Featured Trusted Providers")}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            {t("Hand-picked by our team — explore them")}
          </p>
        </div>

        <div className="mt-8">
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProviderCardSkeleton key={i} />
              ))}
            </div>
          )}

          {isError && (
            <EmptyState
              title={t("Unable to load providers.")}
              description={t("Please try again in a moment or refresh the page.")}
              actionLabel={t("Try again")}
              actionOnClick={() => window.location.reload()}
            />
          )}

          {data && data.length === 0 && (
            <EmptyState
              title={t("No providers found for this search.")}
              description={t("Try a different category or location.")}
              actionLabel={t("Browse services")}
              actionHref="/services"
            />
          )}

          {data && data.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.map((provider) => (
                <ProviderCard key={provider._id} provider={provider} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" render={<Link href="/providers">{t("View all providers")}</Link>} />
        </div>
      </div>
    </section>
  );
}