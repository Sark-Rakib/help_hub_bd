"use client";

import { Search, UserRoundCheck, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find a service",
    description:
      "Search for the service you need. Tell us what you're looking for in a line and we'll show you providers.",
  },
  {
    number: "02",
    icon: UserRoundCheck,
    title: "View providers",
    description:
      "Browse nearby service providers' profiles, ratings, experience and service details.",
  },
  {
    number: "03",
    icon: Send,
    title: "Send a service request",
    description:
      "Send a service request directly to the provider you like. Done in just 10-20 seconds!",
  },
];

export function HowItWorks() {
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-border/60 bg-muted/30 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-balance sm:text-3xl">
            {t("Effortlessly simple")}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            {t("Three simple steps — find a service, view providers, send a request")}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              {i < steps.length - 1 && (
                <div
                  className="absolute top-1/2 left-full hidden h-px w-6 -translate-y-1/2 bg-border sm:block"
                  aria-hidden
                />
              )}
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <step.icon className="size-5" />
                </span>
                <span className="text-3xl font-bold text-muted-foreground/20">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{t(step.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(step.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}