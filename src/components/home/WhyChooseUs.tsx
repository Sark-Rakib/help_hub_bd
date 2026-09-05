"use client";

import { MapPinned, BadgeCheck, ClipboardCheck, Star, Smile } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const trustPoints = [
  {
    icon: MapPinned,
    title: "Local providers",
    description: "Skilled providers based right here in Sherpur.",
  },
  {
    icon: BadgeCheck,
    title: "Verified profiles",
    description: "Every provider is checked by our team.",
  },
  {
    icon: ClipboardCheck,
    title: "Easy service request",
    description: "Send a request in three simple steps.",
  },
  {
    icon: Star,
    title: "Transparent reviews",
    description: "Honest reviews from real customers.",
  },
  {
    icon: Smile,
    title: "Simple experience",
    description: "Nothing complicated — simple and clean.",
  },
];

export function WhyChooseUs() {
  const { t } = useLanguage();
  return (
    <section className="border-t border-border/60 bg-muted/30 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-balance sm:text-3xl">
            {t("Why HelpHub BD?")}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            {t("Built for you — warm, honest service and local expertise")}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <point.icon className="size-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{t(point.title)}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {t(point.description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}