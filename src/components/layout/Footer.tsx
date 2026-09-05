"use client";

import Link from "next/link";
import {
  Zap,
  Droplets,
  Snowflake,
  Laptop,
  Smartphone,
  Wrench,
  GraduationCap,
  Paintbrush,
  Sparkles,
  Camera,
  PawPrint,
  Refrigerator,
  ArrowRight,
  Send,
  MessageCircle,
  Globe,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { SUPPORT_PHONE, SUPPORT_EMAIL, CATEGORIES } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

const categoryIcons: Record<string, typeof Zap> = {
  electrician: Zap,
  plumber: Droplets,
  "ac-fridge-technician": Snowflake,
  "computer-laptop": Laptop,
  "mobile-repair": Smartphone,
  "car-bike-mechanic": Wrench,
  tutor: GraduationCap,
  painter: Paintbrush,
  "cleaning-service": Sparkles,
  photographer: Camera,
  veterinary: PawPrint,
  "home-appliance-repair": Refrigerator,
};

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {t("A local services marketplace for Sherpur. Trusted providers, honest reviews, and an easy service request experience. Find the service you need, today.")}
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                href="#"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Send className="size-4" />
              </Link>
              <Link
                href="#"
                aria-label="WhatsApp"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <MessageCircle className="size-4" />
              </Link>
              <Link
                href="#"
                aria-label="Website"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Globe className="size-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("Services")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {CATEGORIES.slice(0, 6).map((c) => {
                const Icon = categoryIcons[c.slug] ?? Wrench;
                return (
                  <li key={c.slug}>
                    <Link
                      href={`/services/${c.slug}`}
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                    >
                      <Icon className="size-3.5" />
                      {t(c.name)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("For Providers")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/become-provider" className="transition-colors hover:text-foreground">
                  {t("Become a Provider")}
                </Link>
              </li>
              <li>
                <Link href="/become-provider" className="transition-colors hover:text-foreground">
                  {t("Provider Guidelines")}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="transition-colors hover:text-foreground">
                  {t("FAQ")}
                </Link>
              </li>
              <li>
                <Link href="/provider" className="transition-colors hover:text-foreground">
                  {t("Provider Dashboard")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("Help & Company")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#how-it-works" className="transition-colors hover:text-foreground">
                  {t("How It Works")}
                </Link>
              </li>
              <li>
                <Link href={`tel:${SUPPORT_PHONE}`} className="transition-colors hover:text-foreground">
                  {SUPPORT_PHONE}
                </Link>
              </li>
              <li>
                <Link href={`mailto:${SUPPORT_EMAIL}`} className="transition-colors hover:text-foreground">
                  {SUPPORT_EMAIL}
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  {t("Privacy Policy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  {t("Terms & Conditions")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} HelpHub BD. {t("Made with ❤️ for Sherpur.")}
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary/80"
          >
            {t("Explore all services")} <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}