"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  Store,
  ClipboardList,
  Flag,
  Star,
  FolderTree,
  Loader2,
  BadgeCheck,
  XCircle,
  TrendingUp,
  User as UserIcon,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { useLanguage } from "@/context/LanguageContext";
import { AccountProfile } from "@/components/dashboard/AccountProfile";
import { SavedProviders } from "@/components/dashboard/SavedProviders";
import { UserMenu } from "@/components/layout/UserMenu";
import { timeAgo } from "@/lib/utils";
import { getCategoryName } from "@/lib/constants";

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "providers", label: "Providers", icon: Store },
  { key: "users", label: "Users", icon: Users },
  { key: "requests", label: "Requests", icon: ClipboardList },
  { key: "categories", label: "Categories", icon: FolderTree },
  { key: "reports", label: "Reports", icon: Flag },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "profile", label: "Profile", icon: UserIcon },
  { key: "saved", label: "Saved", icon: Heart },
] as const;

type AdminTabKey = (typeof TABS)[number]["key"];

const isAdminTabKey = (value: string | null): value is AdminTabKey =>
  value === "overview" ||
  value === "providers" ||
  value === "users" ||
  value === "requests" ||
  value === "categories" ||
  value === "reports" ||
  value === "reviews" ||
  value === "profile" ||
  value === "saved";

interface AdminProviderRec {
  _id: string;
  businessName: string;
  phone: string;
  category: string;
  verified: boolean;
  blocked: boolean;
  featured: boolean;
  applicationStatus: string;
}
interface AdminUserRec {
  _id: string;
  name: string;
  phone: string;
  role: string;
  blocked: boolean;
  avatar?: string;
  createdAt: string;
}
interface AdminRequestRec {
  _id: string;
  service: string;
  phone: string;
  providerId?: string;
  preferredDate: string;
  status: string;
}
interface AdminCategoryRec {
  _id: string;
  name: string;
  slug: string;
  popular: boolean;
}
interface AdminReportRec {
  _id: string;
  targetType: string;
  reason: string;
  description?: string;
  reporter: { name?: string } | string;
  status: string;
}
interface AdminReviewRec {
  _id: string;
  text: string;
  rating: number;
  createdAt: string;
  user: { name?: string } | string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get("tab");
  const tab: AdminTabKey = isAdminTabKey(requested) ? requested : "overview";
  const selectTab = (key: AdminTabKey) =>
    router.replace(`${pathname}?tab=${key}`, { scroll: false });
  const { t } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{t("Admin Dashboard")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("Manage providers, users, requests, reviews and reports")}
          </p>
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
        {tab === "overview" && <OverviewTab />}
        {tab === "providers" && <ProvidersTab />}
        {tab === "users" && <UsersTab />}
        {tab === "requests" && <RequestsTab />}
        {tab === "categories" && <CategoriesTab />}
        {tab === "reports" && <ReportsTab />}
        {tab === "reviews" && <ReviewsTab />}
        {tab === "profile" && <AccountProfile />}
        {tab === "saved" && <SavedProviders />}
      </div>
    </div>
  );
}

function useApi<T>(key: string[], url: string) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Unable to load.");
      const json = await res.json();
      return {
        data: (json.data ?? json) as T,
        pagination: json.pagination,
      };
    },
  });
}

function OverviewTab() {
  const { t } = useLanguage();
  const { data, isLoading } = useApi<{
    totalUsers: number;
    totalProviders: number;
    pendingProviders: number;
    verifiedProviders: number;
    totalRequests: number;
    pendingRequests: number;
    totalReviews: number;
    totalReports: number;
    pendingReports: number;
  }>(["admin", "stats"], "/api/admin/stats");

  const stats = data?.data;
  const cards: Array<[string, number, typeof Users]> = stats
    ? [
        ["Total users", stats.totalUsers, Users],
        ["Total providers", stats.totalProviders, Store],
        ["Pending providers", stats.pendingProviders, XCircle],
        ["Verified providers", stats.verifiedProviders, BadgeCheck],
        ["Total requests", stats.totalRequests, ClipboardList],
        ["Pending requests", stats.pendingRequests, TrendingUp],
        ["Total reviews", stats.totalReviews, Star],
        ["Pending reports", stats.pendingReports, Flag],
      ]
    : [];

  if (isLoading || !stats) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(([label, value, Icon]) => (
        <Card key={label}>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">{t(label)}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
            <Icon className="size-6 text-primary/60" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdminActions({
  id,
  endpoint,
  actions,
  onDone,
}: {
  id: string;
  endpoint?: string;
  actions: Array<{
    label: string;
    variant?: "default" | "outline" | "destructive" | "secondary";
    method?: "PATCH" | "POST" | "DELETE" | "PUT";
    body?: Record<string, unknown>;
    className?: string;
  }>;
  onDone?: () => void;
}) {
  const qc = useQueryClient();
  const { t } = useLanguage();
  const [pending, setPending] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] =
    useState<(typeof actions)[number] | null>(null);

  const execute = async (action: (typeof actions)[number]) => {
    setPending(action.label);
    try {
      const res = await fetch(endpoint ?? `/api/admin/${id}`, {
        method: action.method ?? "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action.body ?? {}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Action fail.");
      toast.success(
        action.method === "DELETE" ? t("Deleted!") : json.message ?? t("Updated!")
      );
      await qc.invalidateQueries();
      onDone?.();
    } catch {
      toast.error(t("Something went wrong."));
    } finally {
      setPending(null);
    }
  };

  const run = async (action: (typeof actions)[number]) => {
    if (action.method === "DELETE") {
      setConfirmTarget(action);
      return;
    }
    await execute(action);
  };

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {actions.map((a) => (
          <Button
            key={a.label}
            size="sm"
            variant={a.variant ?? "outline"}
            className={a.className}
            disabled={Boolean(pending)}
            onClick={() => void run(a)}
          >
            {pending === a.label ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : null}
            {t(a.label)}
          </Button>
        ))}
      </div>
      <Dialog
        open={Boolean(confirmTarget)}
        onOpenChange={(open) => {
          if (!open) setConfirmTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <UserIcon className="size-5 text-destructive" />
              {t("Delete this permanently?")}
            </DialogTitle>
            <DialogDescription>
              {t("This action cannot be undone.")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={Boolean(pending)}
              onClick={() => setConfirmTarget(null)}
            >
              {t("Cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={Boolean(pending)}
              onClick={() => {
                if (confirmTarget) {
                  setConfirmTarget(null);
                  void execute(confirmTarget);
                }
              }}
            >
              {pending === confirmTarget?.label ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {t("Delete")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProvidersTab() {
  const { t } = useLanguage();
  const { data, isLoading } = useApi<AdminProviderRec[]>(
    ["admin", "providers"],
    "/api/admin/providers?limit=50"
  );
  const [search, setSearch] = useState("");
  const providers = (data?.data ?? []).filter((p) =>
    search
      ? (p.businessName ?? "").toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-base">{t("Providers")}</CardTitle>
        <Input
          className="w-56"
          placeholder={t("Search business...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Business")}</TableHead>
                  <TableHead>{t("Category")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>
                      <div className="font-medium">{p.businessName}</div>
                      <div className="text-xs text-muted-foreground">{p.phone}</div>
                    </TableCell>
                    <TableCell>{getCategoryName(p.category)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {p.verified && (
                          <Badge className="bg-green-50 text-green-700">{t("Verified")}</Badge>
                        )}
                        {p.blocked && <Badge variant="destructive">{t("Blocked")}</Badge>}
                        <Badge variant="outline">{p.applicationStatus}</Badge>
                        {p.featured && <Badge variant="secondary">{t("Featured")}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <AdminActions
                        id={p._id}
                        endpoint={`/api/admin/providers/${p._id}`}
                        actions={[
                          {
                            label: p.verified ? "Unverify" : "Verify",
                            body: { verified: !p.verified },
                            variant: p.verified ? "outline" : "default",
                          },
                          {
                            label: "Feature",
                            body: { featured: !p.featured },
                            variant: "secondary",
                          },
                          {
                            label: p.blocked ? "Unblock" : "Block",
                            body: { blocked: !p.blocked },
                            variant: "destructive",
                            className: "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700",
                          },
                          {
                            label: "Delete",
                            method: "DELETE" as const,
                            variant: "destructive",
                            className: "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700",
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UsersTab() {
  const { t } = useLanguage();
  const { data, isLoading } = useApi<AdminUserRec[]>(
    ["admin", "users"],
    "/api/admin/users?limit=50"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("Users")}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("User")}</TableHead>
                  <TableHead>{t("Role")}</TableHead>
                  <TableHead>{t("Joined")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.data ?? []).map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 shrink-0">
                          <AvatarImage src={u.avatar} alt={u.name} />
                          <AvatarFallback className="bg-brand-50 text-xs font-bold text-brand-700">
                            {u.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.phone}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.role === "admin" ? "destructive" : "outline"}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {timeAgo(u.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <AdminActions
                        id={u._id}
                        endpoint={`/api/admin/users/${u._id}`}
                        actions={[
                          {
                            label: u.blocked ? "Unblock" : "Block",
                            body: { blocked: !u.blocked },
                            variant: "destructive",
                            className: "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700",
                          },
                          ...(u.role !== "admin"
                            ? [
                                {
                                  label: "Delete",
                                  method: "DELETE" as const,
                                  variant: "destructive" as const,
                                  className:
                                    "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700",
                                },
                              ]
                            : []),
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RequestsTab() {
  const { t } = useLanguage();
  const { data, isLoading } = useApi<AdminRequestRec[]>(
    ["admin", "requests"],
    "/api/admin/requests?limit=50"
  );

  const requests = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("All Requests")}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="p-6">
            <EmptyState title={t("No requests")} icon={ClipboardList} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Service")}</TableHead>
                  <TableHead>{t("Customer phone")}</TableHead>
                  <TableHead>{t("Provider")}</TableHead>
                  <TableHead>{t("Date")}</TableHead>
                  <TableHead className="text-right">{t("Status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell className="font-medium">{r.service}</TableCell>
                    <TableCell className="text-xs">{r.phone}</TableCell>
                    <TableCell className="text-xs">{r.providerId ?? "—"}</TableCell>
                    <TableCell className="text-xs">{r.preferredDate}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{r.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CategoriesTab() {
  const qc = useQueryClient();
  const { t } = useLanguage();
  const { data, isLoading } = useApi<AdminCategoryRec[]>(["admin", "categories"], "/api/admin/categories");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [creating, setCreating] = useState(false);

  const create = async () => {
    if (!name || !slug) {
      toast.error(t("Name and slug are required."));
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, nameBn, description: "" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unable to create.");
      toast.success(t("Category created!"));
      setName("");
      setSlug("");
      setNameBn("");
      await qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    } catch {
      toast.error(t("Something went wrong."));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("Add new category")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder={t("Name (English)")} value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder={t("Slug (e.g. tutor)")} value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Input placeholder={t("Name (Bangla)")} value={nameBn} onChange={(e) => setNameBn(e.target.value)} />
          <Button onClick={create} disabled={creating} className="w-full">
            {creating ? <Loader2 className="size-4 animate-spin" /> : null} {t("Create")}
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">{t("Categories")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Name")}</TableHead>
                  <TableHead>{t("Slug")}</TableHead>
                  <TableHead>{t("Popular")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.data ?? []).map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-xs">{c.slug}</TableCell>
                    <TableCell>
                      {c.popular && <Badge variant="secondary">{t("Popular")}</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <AdminActions
                        id={c._id}
                        endpoint={`/api/admin/categories/${c._id}`}
                        actions={[
                          {
                            label: c.popular ? "Unpopular" : "Popular",
                            body: { popular: !c.popular },
                          },
                          {
                            label: "Delete",
                            method: "DELETE",
                            variant: "destructive",
                            className: "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700",
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsTab() {
  const { t } = useLanguage();
  const { data, isLoading } = useApi<AdminReportRec[]>(
    ["admin", "reports"],
    "/api/admin/reports?limit=50"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("Reports")}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (data?.data ?? []).length === 0 ? (
          <div className="p-6">
            <EmptyState title={t("No reports")} icon={Flag} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Type")}</TableHead>
                  <TableHead>{t("Reason")}</TableHead>
                  <TableHead>{t("Reporter")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.data ?? []).map((r) => (
                  <TableRow key={r._id}>
                    <TableCell>
                      <Badge variant="outline">{r.targetType}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{r.reason}</div>
                      {r.description && (
                        <div className="text-xs text-muted-foreground">{r.description}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {typeof r.reporter !== "string" ? r.reporter?.name ?? "—" : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={r.status === "pending" ? "destructive" : "secondary"}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <AdminActions
                        id={r._id}
                        endpoint={`/api/admin/reports/${r._id}`}
                        actions={[
                          {
                            label: "Resolve",
                            body: { status: "resolved" },
                            variant: "default",
                          },
                          {
                            label: "Dismiss",
                            body: { status: "dismissed" },
                            variant: "outline",
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReviewsTab() {
  const { t } = useLanguage();
  const { data, isLoading } = useApi<AdminReviewRec[]>(
    ["admin", "reviews"],
    "/api/admin/reviews?limit=50"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("Reviews")}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Review")}</TableHead>
                  <TableHead>{t("Rating")}</TableHead>
                  <TableHead>{t("By")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.data ?? []).map((r) => (
                  <TableRow key={r._id}>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm">{r.text}</div>
                      <div className="text-xs text-muted-foreground">{timeAgo(r.createdAt)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{"★".repeat(Math.round(r.rating))}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {typeof r.user !== "string" ? r.user?.name ?? "—" : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <AdminActions
                        id={r._id}
                        endpoint={`/api/admin/reviews/${r._id}`}
                        actions={[
                          {
                            label: "Delete",
                            method: "DELETE",
                            variant: "destructive",
                            className: "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700",
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}