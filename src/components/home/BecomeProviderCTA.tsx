"use client";

import Link from "next/link";
import { Store, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function BecomeProviderCTA() {
  const { t } = useLanguage();
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground">
          <div className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-primary-foreground/10 blur-2xl" aria-hidden />
          <div className="relative flex flex-col items-center gap-6 p-8 text-center sm:p-12">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <Store className="size-7" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-balance sm:text-3xl">
                {t("Do you provide a service?")}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
                {t("Create your service profile today and reach customers in Sherpur.")}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm text-primary-foreground/90">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4" /> {t("Free in MVP")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4" /> {t("Reach more customers")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4" /> {t("Verifiable biz")}
              </span>
            </div>
            <Button
              size="lg"
              className="mt-1 bg-white text-primary hover:bg-white/90"
              render={<Link href="/become-provider">{t("Join as a provider")}</Link>}
            >
              <span className="flex items-center gap-2">
                {t("Join as a provider")} <ArrowRight className="size-4" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}