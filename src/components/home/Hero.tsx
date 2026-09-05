"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function Hero({ onSearch }: { onSearch?: (query: string) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (onSearch) {
      onSearch(q);
      return;
    }
    if (q) {
      router.push(`/search?search=${encodeURIComponent(q)}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute top-40 -right-24 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 pt-14 pb-16 text-center sm:px-6 sm:pt-20 sm:pb-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
            {t("Find the service you need in Sherpur,")}{" "}
            <span className="text-primary">{t("today.")}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            {t("Electrician, plumber, technician, mechanic, tutor and many more trusted providers, all in one place.")}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border bg-card p-2 shadow-sm"
        >
          <label htmlFor="hero-search" className="sr-only">
            {t("What service do you need?")}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute inset-y-0 left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="hero-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("AC technician, electrician, plumber...")}
                className="h-12 border-0 bg-transparent pl-11 pr-10 text-base shadow-none focus-visible:ring-0 focus-visible:border-0"
              />
              <Mic className="pointer-events-none absolute inset-y-0 right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60 sm:hidden" />
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-2.5 text-sm text-muted-foreground sm:h-12">
              <MapPin className="size-4 text-primary" />
              <span className="font-medium">{t("Sherpur")}</span>
            </div>
            <Button type="submit" size="lg" className="h-11 sm:h-12 px-6">
              {t("Search")}
            </Button>
          </div>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 text-xs text-muted-foreground"
        >
          {t("⚡ No registration needed to browse providers")}
        </motion.p>
      </div>
    </section>
  );
}