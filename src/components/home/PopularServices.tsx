"use client";

import Link from "next/link";
import { CATEGORIES, getCategoryIcon } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function PopularServices() {
  const { t } = useLanguage();
  return (
    <section id="services" className="scroll-mt-20 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-balance sm:text-3xl">
              {t("Popular Services")}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {t("Whatever the people of Sherpur need — it's all here")}
            </p>
          </div>
          <Link
            href="/services"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 sm:inline-flex"
          >
            {t("All services")} <ChevronRight className="size-4" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/services/${cat.slug}`}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-snug">
                    {t(cat.name)}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {t(cat.description)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <Link
          href="/services"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 sm:hidden"
        >
          {t("All services")} <ChevronRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}