"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ClipboardList,
  User as UserIcon,
  Star,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Phone,
  MapPin,
  CalendarDays,
  Clock,
  Loader2,
  Heart,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/shared/EmptyState";
import { StarRating } from "@/components/shared/StarRating";
import { REQUEST_STATUSES, prettyArea } from "@/lib/constants";
import { useMyProvider, useProviderRequests } from "@/hooks/useQueries";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/upload";
import { SavedProviders } from "@/components/dashboard/SavedProviders";
import { UserMenu } from "@/components/layout/UserMenu";
import { timeAgo } from "@/lib/utils";
import type { Provider } from "@/types";

const DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

function to24h(value: string): string {
  const m = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return value;
  let h = Number(m[1]);
  const ap = (m[3] ?? "").toUpperCase();
  if (ap === "PM" && h < 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

const TABS = [
  { key: "requests", label: "Incoming Requests", icon: ClipboardList },
  { key: "saved", label: "Saved", icon: Heart },
  { key: "profile", label: "My Profile", icon: UserIcon },
  { key: "reviews", label: "Reviews", icon: Star },
] as const;

type ProviderTabKey = (typeof TABS)[number]["key"];

const isProviderTabKey = (value: string | null): value is ProviderTabKey =>
  value === "requests" || value === "saved" || value === "profile" || value === "reviews";

export default function ProviderDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get("tab");
  const tab: ProviderTabKey = isProviderTabKey(requested)
    ? requested
    : "requests";
  const selectTab = (key: ProviderTabKey) =>
    router.replace(`${pathname}?tab=${key}`, { scroll: false });
  const { t } = useLanguage();
  const { data: provider } = useMyProvider();

  if (!provider) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-14 text-center sm:px-6">
        <EmptyState
          title={t("No provider profile found")}
          description={t("Register for a provider account to find customers. We'll review and activate it.")}
          actionLabel={t("Become a provider")}
          actionHref="/become-provider"
          icon={UserIcon}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{provider.businessName}</h1>
          <p className="text-sm text-muted-foreground">
            {t("Provider dashboard — manage your incoming requests")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={provider.verified ? "default" : "outline"}
            className={provider.verified ? "bg-green-50 text-green-700" : ""}
          >
            {provider.verified ? t("Verified") : t("Pending verification")}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/providers/${provider.slug}`} />}
          >
            <ExternalLink className="size-3.5" /> {t("View public profile")}
          </Button>
          <UserMenu />
        </div>
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
        {tab === "profile" && <ProfileTab provider={provider} />}
        {tab === "reviews" && <ReviewsTab provider={provider} />}
      </div>
    </div>
  );
}

function RequestsTab() {
  const qc = useQueryClient();
  const { t } = useLanguage();
  const { data, isLoading } = useProviderRequests("all");
  const [actionId, setActionId] = useState<string | null>(null);

  const updateStatus = async (
    id: string,
    status: "accepted" | "rejected" | "completed"
  ) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unable to update.");
      toast.success(
        status === "accepted"
          ? t("Request accepted! We'll notify the customer now.")
          : status === "rejected"
            ? t("Request rejected.")
            : t("Request completed! The customer can now leave a review.")
      );
      await qc.invalidateQueries({ queryKey: ["provider-requests"] });
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
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  const requests = data?.data ?? [];

  if (requests.length === 0) {
    return (
      <EmptyState
        title={t("No incoming requests")}
        description={t("When customers send service requests, they'll appear here.")}
        icon={ClipboardList}
      />
    );
  }

  return (
    <div className="grid gap-3">
      {requests.map((req) => {
        const customer = typeof req.user !== "string" ? req.user : null;
        return (
          <Card key={req._id} className="overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{req.service}</p>
                    <Badge
                      variant="outline"
                      className={
                        req.status === "pending"
                          ? "border-amber-200 bg-amber-50 text-amber-800"
                          : req.status === "accepted"
                            ? "bg-green-50 text-green-700"
                            : req.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : req.status === "completed"
                                ? "bg-brand-50 text-brand-700"
                                : "bg-muted text-muted-foreground"
                      }
                    >
                      {t(
                        REQUEST_STATUSES.find((s) => s.value === req.status)?.label ??
                          req.status
                      )}
                    </Badge>
                    {req.status === "pending" && (
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(req.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{req.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" /> {req.location?.area && prettyArea(req.location.area)}
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
                      <span>{t("Budget:")} {formatBDT_short(req.budget)}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Avatar className="size-5">
                        <AvatarFallback className="bg-brand-50 text-[10px] font-semibold text-brand-700">
                          {customer?.name?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      {customer?.name ?? t("User")}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="size-3.5" /> {req.phone}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
                  {req.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => void updateStatus(req._id, "accepted")}
                        disabled={actionId === req._id}
                      >
                        {actionId === req._id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="size-3.5" />
                        )}
                        {t("Accept")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-destructive hover:text-white"
                        onClick={() => void updateStatus(req._id, "rejected")}
                        disabled={actionId === req._id}
                      >
                        <XCircle className="size-3.5" /> {t("Reject")}
                      </Button>
                    </>
                  )}
                  {req.status === "accepted" && (
                    <Button
                      size="sm"
                      onClick={() => void updateStatus(req._id, "completed")}
                      disabled={actionId === req._id}
                    >
                      <CheckCircle2 className="size-3.5" /> {t("Mark complete")}
                    </Button>
                  )}
                  {customer && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      render={<Link href={`tel:${req.phone}`} />}
                    >
                      <Phone className="size-3.5" /> {t("Call")}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function formatBDT_short(n: number) {
  return `৳${n.toLocaleString("en-US")}`;
}

function ProfileTab({ provider }: { provider: Provider }) {
  const qc = useQueryClient();
  const { t } = useLanguage();
  const { updateProfile, logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    phone: provider.phone || "",
    availability: provider.availability,
    about: provider.about || provider.description,
    startingPrice: String(provider.startingPrice ?? ""),
    services: (provider.services ?? [])
      .map((s) => `${s.name}|${s.price}|${s.priceType}`)
      .join("\n"),
  });
  const [hours, setHours] = useState<
    Array<{ day: string; open: string; close: string; isOpen: boolean }>
  >(() => {
    const existing = provider.workingHours ?? [];
    const rows = existing.map((wh) => ({
      day: wh.day,
      open: to24h(wh.open),
      close: to24h(wh.close),
      isOpen: true,
    }));
    for (const day of DAYS) {
      if (!rows.some((r) => r.day === day)) {
        rows.push({ day, open: "09:00", close: "18:00", isOpen: false });
      }
    }
    return rows;
  });

  const updateHours = (
    day: string,
    patch: Partial<{ open: string; close: string; isOpen: boolean }>
  ) =>
    setHours((hs) => hs.map((h) => (h.day === day ? { ...h, ...patch } : h)));

  const handleSave = async () => {
    setSaving(true);
    try {
      const services = form.services
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [name, priceRaw, priceType] = line.split("|");
          const pt = priceType as string;
          return {
            name,
            price: Number(priceRaw) || 0,
            priceType: ["fixed", "hourly", "negotiable"].includes(pt)
              ? (pt as "fixed" | "hourly" | "negotiable")
              : "fixed",
          };
        });
      let avatar = provider.avatar ?? "";
      if (avatarFile) {
        avatar = await uploadFile(avatarFile);
        await updateProfile({ avatar });
      }
      if (form.phone.trim() && form.phone.trim() !== (provider.phone || "")) {
        const pu = await updateProfile({ phone: form.phone.trim() });
        if (!pu.ok) throw new Error(pu.error || "Unable to update phone.");
      }
      const res = await fetch("/api/provider-me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availability: form.availability,
          about: form.about,
          startingPrice: form.startingPrice ? Number(form.startingPrice) : undefined,
          services,
          workingHours: hours
            .filter((h) => h.isOpen && h.open && h.close)
            .map((h) => ({ day: h.day, open: h.open, close: h.close })),
          avatar: avatar || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unable to save.");
      toast.success(t("Profile updated!"));
      setAvatarFile(null);
      setAvatarPreview(null);
      await qc.invalidateQueries({ queryKey: ["my-provider"] });
    } catch {
      toast.error(t("Something went wrong."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">{t("Profile picture")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage
                src={avatarPreview ?? provider.avatar}
                alt={provider.businessName}
              />
              <AvatarFallback className="bg-brand-50 text-xl font-bold text-brand-700">
                {provider.businessName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Label
                htmlFor="provider-avatar-upload"
                className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/50"
              >
                <input
                  id="provider-avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setAvatarFile(f);
                    setAvatarPreview(URL.createObjectURL(f));
                  }}
                />
                {avatarPreview ? t("Change photo") : t("Add a profile photo")}
              </Label>
              {avatarPreview ? (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(null);
                  }}
                  className="block text-xs text-muted-foreground hover:text-destructive"
                >
                  {t("Cancel")}
                </button>
              ) : (
                <p className="block text-xs text-muted-foreground">
                  {t("Shown on your public profile")}
                </p>
              )}
            </div>
          </div>
          {avatarPreview ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("Click Save changes/Save services/Save working hours to apply.")}
            </p>
          ) : null}
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("Service settings")}</CardTitle>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="provider-phone">{t("Phone number")}</Label>
            <Input
              id="provider-phone"
              type="tel"
              maxLength={14}
              placeholder="01XXXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              {t("This is your login number and how customers reach you.")}
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>{t("Availability")}</Label>
            <select
              className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
              value={form.availability}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  availability: e.target.value as "available" | "busy" | "offline",
                }))
              }
            >
              <option value="available">{t("Available — taking new requests!")}</option>
              <option value="busy">{t("Busy — a bit slow right now")}</option>
              <option value="offline">{t("Offline")}</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>{t("Starting price")} (৳)</Label>
            <Input
              type="number"
              min={0}
              value={form.startingPrice}
              onChange={(e) =>
                setForm((f) => ({ ...f, startingPrice: e.target.value }))
              }
              placeholder="e.g. 500"
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("About / description")}</Label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={form.about}
              onChange={(e) => setForm((f) => ({ ...f, about: e.target.value }))}
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : null} {t("Save changes")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("Services — price list")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {t("Write one service per line:")}{" "}
            <code className="rounded bg-muted px-1">Name|Price|type</code> — {t("type")}{" "}
            fixed/hourly/negotiable.
          </p>
          <textarea
            rows={8}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={form.services}
            onChange={(e) => setForm((f) => ({ ...f, services: e.target.value }))}
          />
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : null} {t("Save services")}
          </Button>
        </CardContent>
      </Card>
    </div>

    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="size-4 text-primary" /> {t("Working hours")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          {t("Set the days and hours customers can reach you. Saved hours appear on your public profile.")}
        </p>
        <div className="space-y-2">
          {hours.map((h) => (
            <div
              key={h.day}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-3 py-2"
            >
              <label className="flex w-32 shrink-0 cursor-pointer items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={h.isOpen}
                  onChange={(e) => updateHours(h.day, { isOpen: e.target.checked })}
                  className="size-4 shrink-0 accent-primary"
                />
                {t(h.day)}
              </label>
              {h.isOpen ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={h.open}
                    onChange={(e) => updateHours(h.day, { open: e.target.value })}
                    className="w-28"
                  />
                  <span className="text-sm text-muted-foreground">–</span>
                  <Input
                    type="time"
                    value={h.close}
                    onChange={(e) => updateHours(h.day, { close: e.target.value })}
                    className="w-28"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">{t("Closed")}</span>
              )}
            </div>
          ))}
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : null} {t("Save working hours")}
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">{t("Account details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">
            {t("Manage your login account from your profile settings.")}
          </p>
          <Button
            variant="outline"
            className="w-full text-destructive hover:bg-destructive hover:text-white"
            onClick={() => void logout()}
          >
            <LogOut className="size-4" /> {t("Log out")}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

function ReviewsTab({ provider }: { provider: Provider }) {
  const { t } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: ["provider-reviews", provider.slug],
    queryFn: async () => {
      const res = await fetch(`/api/providers/${provider.slug}/reviews?page=1&limit=20`);
      if (!res.ok) throw new Error(t("Unable to load reviews."));
      const json = (await res.json()) as {
        data: Array<{
          _id: string;
          user: { name: string; avatar?: string } | string;
          rating: number;
          text: string;
          createdAt: string;
        }>;
      };
      return json.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  const reviews = data ?? [];

  if (reviews.length === 0) {
    return (
      <EmptyState
        title={t("No reviews yet")}
        description={t("Once a request is completed, customers will leave a review here.")}
        icon={Star}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <StarRating rating={provider.rating} size="md" />
        <span className="text-sm text-muted-foreground">
          {provider.rating} {t("average from")} {provider.reviewCount} {t("reviews")}
        </span>
      </div>
      {reviews.map((r) => (
        <Card key={r._id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-brand-50 text-xs font-semibold text-brand-700">
                    {typeof r.user !== "string" ? r.user.name?.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">
                    {typeof r.user !== "string" ? r.user.name : t("User")}
                  </p>
                  <StarRating rating={r.rating} size="sm" showValue={false} />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{timeAgo(r.createdAt)}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}