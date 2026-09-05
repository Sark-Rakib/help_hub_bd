"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { getCategoryName, prettyArea } from "@/lib/constants";

interface SearchSuggestion {
  _id: string;
  businessName: string;
  slug: string;
  category: string;
  area?: string;
  photo?: string;
}

interface SearchDropdownProps {
  iconOnly?: boolean;
  side?: "down" | "up";
  trigger?: (ctx: { open: boolean; toggle: () => void }) => React.ReactNode;
}

export function SearchDropdown({
  iconOnly = false,
  side = "down",
  trigger,
}: SearchDropdownProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeSearch = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  const toggle = () => {
    if (open) closeSearch();
    else setOpen(true);
  };

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 1) return;
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        const json = await res.json();
        if (res.ok && ctrl.signal.aborted === false) {
          setResults(json.data?.providers ?? []);
        }
      } catch {
        // ignore aborted / failed requests
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  const goToProvider = (slug: string) => {
    closeSearch();
    router.push(`/providers/${slug}`);
  };

  const goToResults = () => {
    const q = query.trim();
    closeSearch();
    router.push(q ? `/search?search=${encodeURIComponent(q)}` : "/providers");
  };

  const showSuggestions = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className="relative">
      {trigger ? (
        trigger({ open, toggle })
      ) : (
        <Button
          variant="ghost"
          size={iconOnly ? "icon-sm" : "sm"}
          aria-label={t("Search")}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={toggle}
        >
          <span className="flex items-center gap-1.5">
            <Search className="size-4" />
            {!iconOnly && t("Search")}
          </span>
        </Button>
      )}

      {open && (
        <div
          className={cn(
            "absolute z-50 w-[300px] overflow-hidden rounded-2xl border border-border bg-popover shadow-lg md:w-[360px]",
            side === "up"
              ? "fixed bottom-20 left-1/2 -translate-x-1/2"
              : "top-11 end-0"
          )}
        >
          <div className="relative border-b border-border p-2">
            <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Search services, providers...")}
              className="h-10 pl-9 pr-8"
              role="searchbox"
            />
            {query && (
              <button
                type="button"
                aria-label={t("Clear search")}
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>

          {showSuggestions && (
            <ul
              role="listbox"
              className="max-h-72 overflow-y-auto p-1.5"
            >
              {loading && (
                <li className="space-y-1.5 p-1.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
                  ))}
                </li>
              )}
              {!loading && results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {t("No providers found")}
                </li>
              )}
              {!loading &&
                results.map((p) => (
                  <li key={p._id}>
                    <button
                      type="button"
                      onClick={() => goToProvider(p.slug)}
                      className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-start transition-colors hover:bg-muted"
                    >
                      <Avatar className="size-9 shrink-0">
                        {p.photo ? (
                          <AvatarImage src={p.photo} alt={p.businessName} />
                        ) : (
                          <AvatarFallback className="bg-brand-50 text-sm font-bold text-brand-700">
                            {p.businessName?.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {p.businessName}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {t(getCategoryName(p.category))}
                          {p.area ? ` · ${prettyArea(p.area)}` : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          )}

          <div className="border-t border-border p-1.5">
            <button
              type="button"
              onClick={goToResults}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted",
                !showSuggestions && "opacity-70"
              )}
            >
              <CornerDownLeft className="size-4" />
              {query.trim() ? t("See all results") : t("Browse all providers")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}