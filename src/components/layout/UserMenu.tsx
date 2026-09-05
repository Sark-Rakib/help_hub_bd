"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getDashboardUrl } from "@/lib/navigation";

export function UserMenu() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return <div className="size-9 animate-pulse rounded-full bg-muted" aria-hidden />;
  }

  if (!user) return null;

  const dashboardHref = getDashboardUrl(user.role);
  const initials = user.name?.trim().charAt(0)?.toUpperCase() ?? "?";

  return (
    <Link
      href={dashboardHref}
      aria-label={t("Dashboard")}
      title={t("Dashboard")}
      className="block rounded-full transition-opacity hover:opacity-80"
    >
      <Avatar className="size-9">
        {user.avatar ? (
          <AvatarImage src={user.avatar} alt={user.name ?? ""} />
        ) : (
          <AvatarFallback className="bg-brand-50 font-bold text-brand-700">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
}