"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { SearchDropdown } from "@/components/layout/SearchDropdown";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getDashboardUrl } from "@/lib/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  const dashboardHref = getDashboardUrl(user?.role);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = link.href !== "/" && pathname.startsWith(link.href.split("#")[0]);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {t(link.label)}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <SearchDropdown />
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" aria-hidden />
          ) : user ? (
            <>
              <NotificationBell />
              <Button size="sm" render={<Link href={dashboardHref} />}>
                {t("My Profile")}
              </Button>
            </>
          ) : (
            <Button size="sm" render={<Link href="/login" />}>
              {t("Login")}
            </Button>
          )}
          <LanguageSwitcher />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {!loading && user && <NotificationBell />}
          <SearchDropdown iconOnly />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={open ? t("Close menu") : t("Open menu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {t(link.label)}
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
            <div className="h-px bg-border" />
            {loading ? (
              <div className="h-10 animate-pulse rounded-lg bg-muted" aria-hidden />
            ) : user ? (
              <Link
                href={dashboardHref}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-primary hover:bg-muted"
              >
                {t("My Profile")}
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-primary hover:bg-muted"
              >
                {t("Login / Register")}
              </Link>
            )}
            <div className="pt-1">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}