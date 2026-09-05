"use client";

import { useRouter } from "next/navigation";
import { Bell, Loader2 } from "lucide-react";
import { useNotifications, useMarkNotificationsRead } from "@/hooks/useQueries";
import { getDashboardUrl } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function NotificationBell() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationsRead();
  const { t } = useLanguage();

  const items = data?.items ?? [];
  const unread = data?.unread ?? 0;

  const markAllRead = () => {
    if (unread === 0 || markRead.isPending) return;
    void markRead.mutate({ all: true });
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) markAllRead();
      }}
    >
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" className="relative" />}
      >
        <Bell className="size-[18px]" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-80">
        <div className="flex items-center justify-between px-1.5 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {t("Notifications")}
          </span>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unread === 0 || markRead.isPending}
            className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
          >
            {t("Mark all as read")}
          </button>
        </div>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            {t("You're all caught up.")}
          </div>
        ) : (
          items.map((n) => (
            <DropdownMenuItem
              key={n._id}
              className="flex-col items-start gap-0.5 py-2"
              onClick={() => {
                if (n.link) router.push(n.link);
              }}
            >
              <span className="text-sm font-medium text-foreground">
                {!n.read && (
                  <span
                    className="mr-1.5 inline-block size-1.5 rounded-full bg-brand-500 align-middle"
                    aria-label={t("Unread")}
                  />
                )}
                {n.title}
              </span>
              <span className="line-clamp-2 text-xs text-muted-foreground">
                {n.message}
              </span>
              <span className="text-[10px] text-muted-foreground/70">
                {timeAgo(n.createdAt)}
              </span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(getDashboardUrl(user?.role))}>
          {t("View all notifications")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}