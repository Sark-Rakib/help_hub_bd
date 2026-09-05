"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  ClipboardList,
  Bookmark,
  UserRound,
} from "lucide-react";
import { SearchDropdown } from "@/components/layout/SearchDropdown";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getDashboardUrl } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

const buildItems = (role?: Role | string | null) => {
  const dashboard = getDashboardUrl(role);
  const tabHref = role ? (tab: string) => `${dashboard}?tab=${tab}` : () => "/login";
  const dashboardHref = role ? dashboard : "/login";
  const label = role === "admin" ? "Dashboard" : "Requests";

  return [
    { label: "Home", href: "/", icon: Home },
    { label, href: dashboardHref, icon: ClipboardList },
    { label: "Saved", href: tabHref("saved"), icon: Bookmark },
    { label: "Profile", href: tabHref("profile"), icon: UserRound },
  ];
};

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();
  const items = buildItems(user?.role);

  const shouldShow =
    pathname !== "/provider" &&
    !pathname.startsWith("/provider/") &&
    !pathname.startsWith("/admin");

  if (!shouldShow) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden"
      aria-label={t("Main navigation")}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active =
            item.href !== "/" && pathname.startsWith(item.href.split("#")[0]);
          const isHome = item.href === "/" && pathname === "/";
          return (
            <Fragment key={item.label}>
              <Link
                href={item.href}
                aria-label={t(item.label)}
                aria-current={active || isHome ? "page" : undefined}
                className={cn(
                  "flex min-w-14 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active || isHome
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className={cn(
                  "flex size-8 items-center justify-center rounded-full transition-colors",
                  (active || isHome) && "bg-primary/10"
                )}>
                  <Icon className={cn("size-5", item.label === "Requests")} />
                </span>
                {t(item.label)}
              </Link>
              {index === 0 && (
                <SearchDropdown
                  side="up"
                  trigger={({ open, toggle }) => (
                    <button
                      type="button"
                      aria-label={t("Search")}
                      onClick={toggle}
                      className={cn(
                        "flex min-w-14 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                        open
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className={cn(
                        "flex size-8 items-center justify-center rounded-full transition-colors",
                        open && "bg-primary/10"
                      )}>
                        <Search className="size-5" />
                      </span>
                      {t("Search")}
                    </button>
                  )}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
}