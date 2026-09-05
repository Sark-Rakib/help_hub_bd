import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { CATEGORIES, getCategoryIcon } from "@/lib/constants";
import { getServerLanguage, ts } from "@/lib/i18n-server";
import { translate } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "All Services",
  description:
    "All service categories in Sherpur — electrician, plumber, AC technician, tutor, mechanic and many more trusted local services.",
};

export default async function ServicesPage() {
  const lang = await getServerLanguage();
  const title = await ts("All services");
  const subtitle = await ts(
    "Click any category to see verified providers of that service"
  );
  const cantFind = await ts("Can't find your category?");
  const cantFindSub = await ts(
    "Your required service isn't listed yet — tell us what you need."
  );
  const suggest = await ts("Suggest a service");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-muted/40 px-6 py-10 text-center sm:py-12">
        <h1 className="text-3xl font-bold text-balance sm:text-4xl">
          {title} <span className="text-primary">{translate("in Sherpur", lang)}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const Icon = getCategoryIcon(cat.slug);
          return (
            <Link
              key={cat.slug}
              href={`/services/${cat.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-snug">
                  {translate(cat.name, lang)}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {translate(cat.description, lang)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:p-8">
        <div>
          <h2 className="text-xl font-bold">{cantFind}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{cantFindSub}</p>
        </div>
        <Link
          href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@helphubbd.com"}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {suggest} <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}