"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ClipboardList,
  Heart,
  User as UserIcon,
  MapPin,
  CalendarDays,
  Clock,
  ChevronRight,
  Phone,
  Star,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { ReviewDialog } from "@/components/requests/ReviewDialog";
import { REQUEST_STATUSES, formatBDT, prettyArea } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useUserRequests } from "@/hooks/useQueries";
import { SavedProviders } from "@/components/dashboard/SavedProviders";
import { AccountProfile } from "@/components/dashboard/AccountProfile";
import { UserMenu } from "@/components/layout/UserMenu";
import type { ServiceRequest } from "@/types";

const TABS = [
  { key: "requests", label: "My Requests", icon: ClipboardList },
  { key: "saved", label: "Saved", icon: Heart },
  { key: "profile", label: "Profile", icon: UserIcon },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const isTabKey = (value: string | null): value is TabKey =>
  value === "requests" || value === "saved" || value === "profile";

export default function UserDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get("tab");
  const tab: TabKey = isTabKey(requested) ? requested : "requests";
  const selectTab = (key: TabKey) =>
    router.replace(`${pathname}?tab=${key}`, { scroll: false });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            {user?.avatar ? (
              <AvatarImage src={user.avatar} alt={user?.name ?? t("User")} />
            ) : (
              <AvatarFallback className="bg-brand-50 text-lg font-bold text-brand-700">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">
              {t("Welcome")}, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-sm text-muted-foreground">{user?.phone}</p>
          </div>
        </div>
        <UserMenu />
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1 sm:gap-2">
        {TABS.map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => selectTab(tabItem.key)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === tabItem.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <tabItem.icon className="size-4" />
            {t(tabItem.label)}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "requests" && <RequestsTab />}
        {tab === "saved" && <SavedProviders />}
        {tab === "profile" && <AccountProfile />}
      </div>
    </div>
  );
}

function RequestsTab() {
  const qc = useQueryClient();
  const { t } = useLanguage();
  const { data, isLoading } = useUserRequests("all");
  const [actionId, setActionId] = useState<string | null>(null);
  const [reviewFor, setReviewFor] = useState<ServiceRequest | null>(null);

  const cancelRequest = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed.");
      toast.success(t("Request cancelled."));
      await qc.invalidateQueries({ queryKey: ["user-requests"] });
    } catch {
      toast.error(t("Something went wrong."));
    } finally {
      setActionId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  const requests = data?.data ?? [];

  if (requests.length === 0) {
    return (
      <EmptyState
        title={t("No requests yet")}
        description={t("Click 'Send Service Request' on a provider profile to get started.")}
        actionLabel={t("Find providers")}
        actionHref="/providers"
        icon={ClipboardList}
      />
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        {t("Total")} {(data?.pagination.total ?? 0)}{" "}
        {(data?.pagination.total ?? 0) === 1 ? t("request sent.") : t("requests sent.")}
      </p>
      <div className="grid gap-3">
        {requests.map((req) => {
          const statusMeta = REQUEST_STATUSES.find((s) => s.value === req.status);
          return (
            <Card key={req._id} className="overflow-hidden">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{req.service}</p>
                      <Badge
                        variant={
                          req.status === "completed"
                            ? "default"
                            : req.status === "accepted"
                              ? "secondary"
                              : req.status === "pending"
                                ? "outline"
                                : "destructive"
                        }
                        className={
                          req.status === "pending"
                            ? "border-amber-200 bg-amber-50 text-amber-800"
                            : req.status === "accepted"
                              ? "bg-green-50 text-green-700"
                              : ""
                        }
                      >
                        {t(statusMeta?.label ?? req.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {req.description.length > 140
                        ? req.description.slice(0, 140) + "..."
                        : req.description}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {req.location?.area && prettyArea(req.location.area)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="size-3.5" /> {req.preferredDate}
                      </span>
                      {req.preferredTime && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5" /> {req.preferredTime}
                        </span>
                      )}
                      {req.budget != null && (
                        <span>{t("Budget:")} {formatBDT(req.budget)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {typeof req.provider !== "string" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        render={<Link href={`/providers/${req.provider.slug}`} />}
                      >
                        {t("View provider")} <ChevronRight className="size-3.5" />
                      </Button>
                    )}
                    {req.status === "completed" && typeof req.provider !== "string" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                        onClick={() => setReviewFor(req)}
                      >
                        <Star className="size-3.5" /> {t("Leave review")}
                      </Button>
                    )}
                    {req.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={actionId === req._id}
                        className="text-xs text-destructive hover:bg-destructive hover:text-white"
                        onClick={() => void cancelRequest(req._id)}
                      >
                        {t("Cancel")}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Phone className="size-3.5" /> {req.phone} · {t("Sent")}{" "}
                    {timeAgo(req.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {reviewFor && typeof reviewFor.provider !== "string" && (
        <ReviewDialog
          open={Boolean(reviewFor)}
          onOpenChange={() => setReviewFor(null)}
          providerId={reviewFor.provider._id}
          providerName={reviewFor.provider.businessName}
          serviceRequestId={reviewFor._id}
          defaultService={reviewFor.service}
        />
      )}
    </div>
  );
}
