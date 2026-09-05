"use client";

import { useDeferredValue, useState } from "react";
import { SearchX } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { ProviderCard, ProviderCardSkeleton } from "@/components/providers/ProviderCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useProviders } from "@/hooks/useQueries";
import { useLanguage } from "@/context/LanguageContext";

export function HomeSearchSection() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const active = deferredQuery.trim();
  const { t } = useLanguage();

  const { data, isLoading } = useProviders(
    {
      search: active || undefined,
      verifiedOnly: true,
      sort: "recommended",
      limit: 12,
      page: 1,
    },
    Boolean(active)
  );

  return (
    <>
      <Hero onSearch={setQuery} />
      {active && (
        <section className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold sm:text-2xl">{t("Search results")}</h2>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("Clear search")}
            </button>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProviderCardSkeleton key={i} />
              ))}
            </div>
          ) : data && data.data.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title={t("No providers found")}
              description={t(
                "No providers match your search. Try a different keyword or browse all providers."
              )}
              actionLabel={t("Browse all providers")}
              actionHref="/providers"
            />
          ) : data ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {data.pagination.total}
                </span>{" "}
                {t("providers found")}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.data.map((provider) => (
                  <ProviderCard key={provider._id} provider={provider} />
                ))}
              </div>
            </>
          ) : null}
        </section>
      )}
    </>
  );
}