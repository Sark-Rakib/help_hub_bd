"use client";

import Link from "next/link";
import { Siren, PhoneCall, Clock, MessageCircle } from "lucide-react";
import { EMERGENCY_CATEGORIES, SUPPORT_PHONE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

const supportDigits =
  SUPPORT_PHONE.replace(/\D/g, "").replace(/^0/, "") || "8801800000000";
const waLink = `https://wa.me/${supportDigits}`;

export default function EmergencyContent() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700">
          <Siren className="size-4 animate-pulse" /> {t("24/7 Emergency Line")}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
          {t("In an emergency?")}{" "}
          <span className="text-red-600">{t("We're here to help")}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {t(
            "Power outage, gas leak, short circuit, burst pipe — call our hotline in any emergency. We connect you with available local providers as fast as we can."
          )}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={`tel:${SUPPORT_PHONE}`}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 text-base font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 sm:w-auto"
          >
            <PhoneCall className="size-4" /> {t("Call now")} ({SUPPORT_PHONE})
          </a>
          <Button
            variant="outline"
            className="rounded-full"
            render={<Link href={waLink} />}
          >
            <MessageCircle className="size-4" /> {t("WhatsApp")}
          </Button>
        </div>
      </header>

      <section className="mt-12">
        <h2 className="text-lg font-bold">{t("Emergency categories")}</h2>
        <p className="text-sm text-muted-foreground">
          {t(
            "If providers in these categories are currently available, connect with them right away:"
          )}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {EMERGENCY_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/search?category=${cat.slug}&availableOnly=true`}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition hover:border-red-200 hover:bg-red-50/40"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
                  {cat.icon}
                </span>
                <span>
                  <span className="font-semibold">{cat.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {cat.description}
                  </span>
                </span>
              </span>
              <Badge
                variant="outline"
                className={cat.availableNow ? "border-green-200 text-green-700" : ""}
              >
                {cat.availableNow ? t("Available") : t("On call")}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-amber-900">
          <Clock className="size-5" /> {t("How the emergency flow works")}
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-amber-900/90">
          <li>
            1. <strong>{t("Call")}</strong>{" "}
            {t("our hotline — we'll connect you with a provider who can help.")}
          </li>
          <li>
            2. <strong>{t("Send a Service Request")}</strong> —{" "}
            {t("available providers respond quickly for urgent cases.")}
          </li>
          <li>
            3.{" "}
            {t(
              "If no one responds within 30 minutes, we'll recommend an"
            )}{" "}
            <strong>{t("alternative provider")}</strong>{" "}
            {t("on this page.")}
          </li>
        </ol>
      </section>

      <section className="mt-8 rounded-2xl bg-primary p-6 text-center text-primary-foreground">
        <h2 className="text-lg font-bold">{t("What if a provider seems risky?")}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-primary-foreground/90">
          {t(
            "For urgent cases, we verify the provider's physical shop before recommending them, so you can trust who you hire."
          )}
        </p>
        <p className="mt-4 text-xs text-primary-foreground/70">
          {t("Helpline")}: {SUPPORT_PHONE} • {t("Available 24/7")}
        </p>
      </section>
    </main>
  );
}