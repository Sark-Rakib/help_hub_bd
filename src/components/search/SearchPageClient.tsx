"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, SearchX, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { CATEGORIES, DISTRICTS, getCategoryIcon, prettyArea, SORT_OPTIONS } from "@/lib/constants";
import { ProviderCard, ProviderCardSkeleton } from "@/components/providers/ProviderCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCategories, useProviders } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function SearchPageClient({
  title,
  basePath = "/search",
  forceVerifiedOnly = false,
}: {
  title?: string;
  basePath?: string;
  forceVerifiedOnly?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();

  const { data: dbCategories } = useCategories();

  const allCategories = useMemo(() => {
    const map = new Map<
      string,
      { slug: string; name: string; nameBn?: string; popular?: boolean }
    >();
    for (const c of CATEGORIES) map.set(c.slug, c);
    for (const c of dbCategories ?? []) {
      if (!map.has(c.slug)) {
        map.set(c.slug, {
          slug: c.slug,
          name: c.name,
          nameBn: c.nameBn,
          popular: c.popular,
        });
      }
    }
    return Array.from(map.values());
  }, [dbCategories]);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "Sherpur");
  const [area, setArea] = useState(searchParams.get("area") ?? "");
  const [verifiedOnly, setVerifiedOnly] = useState(
    forceVerifiedOnly || searchParams.get("verifiedOnly") === "true"
  );
  const [availableOnly, setAvailableOnly] = useState(
    searchParams.get("availableOnly") === "true"
  );
  const [sort, setSort] = useState(searchParams.get("sort") ?? "recommended");
  const [priceRange, setPriceRange] = useState("");
  const [minRating, setMinRating] = useState("");

  const deferredSearch = useDeferredValue(search);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const buildQuery = useCallback(
    (pageNum: number) => {
      const [minP, maxP] = priceRange
        ? priceRange.split("-").map(Number)
        : [undefined, undefined];
      return {
        search: deferredSearch || undefined,
        category: category || undefined,
        location: location || undefined,
        area: area || undefined,
        verifiedOnly: forceVerifiedOnly || verifiedOnly,
        availableOnly,
        sort: sort as "recommended",
        page: pageNum,
        limit: 20,
        minRating: minRating ? Number(minRating) : undefined,
        ...(priceRange ? { minPrice: minP, maxPrice: maxP || undefined } : {}),
      };
    },
    [
      deferredSearch,
      category,
      location,
      area,
      verifiedOnly,
      availableOnly,
      sort,
      minRating,
      priceRange,
      forceVerifiedOnly,
    ]
  );

  const { data, isLoading, isError } = useProviders(buildQuery(page));

  // Sync URL with state
  useEffect(() => {
    const params = new URLSearchParams();
    if (deferredSearch) params.set("search", deferredSearch);
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    if (area) params.set("area", area);
    if (verifiedOnly && !forceVerifiedOnly) params.set("verifiedOnly", "true");
    if (availableOnly) params.set("availableOnly", "true");
    if (sort !== "recommended") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  }, [deferredSearch, category, location, area, verifiedOnly, availableOnly, sort, page, router, basePath, forceVerifiedOnly]);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("Sherpur");
    setArea("");
    setVerifiedOnly(forceVerifiedOnly ? true : false);
    setAvailableOnly(false);
    setSort("recommended");
    setPriceRange("");
    setMinRating("");
  };

  const activeFilters =
    Number(Boolean(category)) +
    Number(Boolean(area)) +
    Number(!forceVerifiedOnly && verifiedOnly) +
    Number(availableOnly) +
    Number(Boolean(priceRange)) +
    Number(Boolean(minRating));

  const districtsAreas = DISTRICTS.find((d) => d.name === location)?.areas ?? DISTRICTS[0].areas;

  const FiltersContent = (
    <div className="space-y-5 px-5 pb-4">
      <div className="space-y-2">
        <Label>{t("Service category")}</Label>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              category === "" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            <Search className="size-4" /> {t("All services")}
          </button>
          {allCategories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setCategory(cat.slug)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  category === cat.slug ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
              >
                <Icon className="size-4" /> {lang === "bn" ? (cat.nameBn || cat.name) : cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("Location")}</Label>
        <div className="flex gap-2">
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setArea("");
            }}
            aria-label={t("District")}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
          >
            {DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            aria-label={t("Area")}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">{t("All areas")}</option>
            {districtsAreas.map((a) => (
              <option key={a} value={a}>
                {prettyArea(a)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("Minimum rating")}</Label>
        <div className="grid grid-cols-5 gap-1.5">
          {["2", "3", "4", "4.5", "5"].map((r) => (
            <button
              key={r}
              type="button"
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

      <div className="space-y-2">
        <Label>{t("Banking / budget")}</Label>
        <div className="space-y-1">
          {[
            { label: "Under ৳500", value: "0-500" },
            { label: "৳500 – ৳1,000", value: "500-1000" },
            { label: "৳1,000 – ৳2,000", value: "1000-2000" },
            { label: "৳2,000 – ৳5,000", value: "2000-5000" },
            { label: "Above ৳5,000", value: "5000-" },
          ].map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setPriceRange(priceRange === r.value ? "" : r.value)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                priceRange === r.value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              {t(r.label)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 border-t border-border pt-4">
        {!forceVerifiedOnly && (
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="size-4 rounded border-input accent-primary"
            />
            {t("Verified only")}
          </label>
        )}
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="size-4 rounded border-input accent-primary"
          />
          {t("Available now")}
        </label>
      </div>

      <Button variant="outline" className="w-full" onClick={resetFilters}>
        {t("Reset filters")}
      </Button>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {title ?? t("Find Providers")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Find trusted service providers in Sherpur")}
        </p>
      </div>

      {/* Search top bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute inset-y-0 left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Search: AC, electrician, plumber...")}
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
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl px-0">
              <SheetHeader className="mb-4 px-5">
                <SheetTitle>{t("Filters")}</SheetTitle>
              </SheetHeader>
              {FiltersContent}
              <div className="mt-4 px-5 pb-6">
                <Button
                  className="w-full"
                  onClick={() => document.body.click()}
                >
                  {t("Show results")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Sort row */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {data ? (
            <>
              <span className="font-semibold text-foreground">{data.pagination.total}</span>{" "}
              {t("providers found")}
            </>
          ) : (
            t("Start searching")
          )}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground">{t("Sort by:")}</span>
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
          description={t("We hit a problem on our servers. Please try again in a moment.")}
          actionLabel={t("Try again")}
          actionOnClick={() => window.location.reload()}
        />
      )}

      {data && data.data.length === 0 && (
        <EmptyState
          icon={SearchX}
          title={t("No providers match your search.")}
          description={t("Try a different category or location.")}
          actionLabel={t("Search again")}
          actionOnClick={resetFilters}
        />
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.data.map((provider) => (
              <ProviderCard key={provider._id} provider={provider} />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: data.pagination.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => router.push(`/search?page=${i + 1}`)}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                    data.pagination.page === i + 1
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-muted"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}