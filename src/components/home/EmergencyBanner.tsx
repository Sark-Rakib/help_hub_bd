"use client";

import Link from "next/link";
import { Siren, ArrowRight } from "lucide-react";
import { EMERGENCY_CATEGORIES, getCategoryIcon, getCategoryName } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export function EmergencyBanner() {
  const { t } = useLanguage();
  return (
    <section id="emergency" className="scroll-mt-20 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-red-50 ring-1 ring-red-100">
          <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-red-100/60 blur-2xl" aria-hidden />
          <div className="relative flex flex-col gap-6 p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white">
                <Siren className="size-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-red-900 sm:text-2xl">
                  {t("Emergency Service")}
                </h2>
                <p className="mt-1.5 max-w-md text-sm text-red-800/80">
                  {t("Power out, pipe leaking, AC not working, or car won't start? Send an urgent request. Available providers will respond as fast as they can.")}
                </p>
                <p className="mt-1 text-xs font-medium text-red-700/70">
                  {t("Note: Response depends on provider availability. We make no false promises.")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:max-w-sm">
              {EMERGENCY_CATEGORIES.map((cat) => {
                const Icon = getCategoryIcon(cat.slug);
                return (
                  <Link
                    key={cat.slug}
                    href={`/services/${cat.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-red-800 shadow-sm ring-1 ring-red-100 transition-colors hover:bg-red-600 hover:text-white"
                  >
                    <Icon className="size-4" />
                    {t(getCategoryName(cat.slug).split(" ")[0])}
                  </Link>
                );
              })}
              <Link
                href="/emergency"
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
              >
                {t("Emergency request")} <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}