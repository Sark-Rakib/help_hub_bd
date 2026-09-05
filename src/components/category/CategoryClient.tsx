"use client";

import { useMemo, useState } from "react";
import { Search, SearchX, SlidersHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProviderCard, ProviderCardSkeleton } from "@/components/providers/ProviderCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { CategoryIcon } from "@/components/shared/CategoryIcon";
import { useProviders } from "@/hooks/useQueries";
import { DISTRICTS, SORT_OPTIONS, prettyArea } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function CategoryClient({
  slug,
  category,
}: {
  slug: string;
  category: string;
}) {

  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Sherpur");
  const [area, setArea] = useState("");
  const [sort, setSort] = useState("recommended");
  const [minRating, setMinRating] = useState("");

  const query = useMemo(
    () => ({
      category: slug,
      search: search || undefined,
      location: location || undefined,
      area: area || undefined,
      verifiedOnly: true,
      sort: sort as "recommended",
      page: 1,
      limit: 12,
      minRating: minRating ? Number(minRating) : undefined,
    }),
    [slug, search, location, area, sort, minRating]
  );

  const { data, isLoading, isError } = useProviders(query);

  const areas = DISTRICTS.find((d) => d.name === location)?.areas ?? [];
  const activeFilters = Number(Boolean(area)) + Number(Boolean(minRating));

  const clearFilters = () => {
    setSearch("");
    setArea("");
    setMinRating("");
    setSort("recommended");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Category header */}
      <div className="flex items-center gap-4 rounded-3xl bg-muted/40 px-6 py-8 sm:gap-5">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <CategoryIcon slug={slug} className="size-7" />
        </span>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{t(category)}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("Trusted")} {t(category)} {t("providers in Sherpur.")}
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute inset-y-0 left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${t("Find")} ${t(category)} ${t("providers in Sherpur...")}`}
            className="h-11 pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-11 items-center gap-1.5 rounded-lg border border-input bg-background px-3 text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary" />
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setArea("");
              }}
              aria-label={t("District")}
              className="h-full bg-transparent text-sm outline-none"
            >
              {DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" className="h-11" />}>
              <span className="relative flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                {t("Filters")}
                {activeFilters > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {activeFilters}
                  </span>
                )}
              </span>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="max-h-[85vh] overflow-y-auto rounded-t-3xl"
            >
              <SheetHeader className="mb-4 px-5">
                <SheetTitle>{t("Filters")}</SheetTitle>
              </SheetHeader>
              <div className="space-y-5 px-5 pb-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t("Area")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setArea("")}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm transition-colors",
                        area === ""
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:bg-muted"
                      )}
                    >
                      {t("All areas")}
                    </button>
                    {areas.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setArea(area === a ? "" : a)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm transition-colors",
                          area === a
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:bg-muted"
                        )}
                      >
                        {prettyArea(a)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">{t("Rating")}</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {["2", "3", "4", "4.5", "5"].map((r) => (
                      <button
                        key={r}
                        onClick={() => setMinRating(minRating === r ? "" : r)}
                        className={cn(
                          "rounded-lg border py-2 text-sm font-medium transition-colors",
                          minRating === r
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:bg-muted"
                        )}
                      >
                        {r}★
                      </button>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  {t("Reset filters")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Sort + count */}
      <div className="mb-4 mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {data ? (
            <>
              <span className="font-semibold text-foreground">
                {data.pagination.total}
              </span>{" "}
              {t("providers found")}
            </>
          ) : (
            t("Start searching")
          )}
        </p>
        <div className="flex flex-wrap gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                sort === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {t(opt.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProviderCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <EmptyState
          title={t("Something went wrong.")}
          description={t("Please try again in a moment.")}
          actionLabel={t("Try again")}
          actionOnClick={() => window.location.reload()}
        />
      )}

      {data && data.data.length === 0 && (
        <EmptyState
          icon={SearchX}
          title={t("No providers match your search.")}
          description={t("Try a different category or location. Once providers are added you'll find them here.")}
          actionLabel={t("Search again")}
          actionOnClick={clearFilters}
        />
      )}

      {data && data.data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.data.map((provider) => (
            <ProviderCard key={provider._id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
}