"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Phone,
  MapPin,
  Briefcase,
  Clock,
  MessageSquarePlus,
  Heart,
  ShieldCheck,
  MessageCircle,
  Share2,
  Flag,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/shared/StarRating";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { CategoryIcon } from "@/components/shared/CategoryIcon";
import { ServiceRequestForm } from "@/components/requests/ServiceRequestForm";
import { ReviewForm } from "@/components/providers/ReviewForm";
import { getCategoryName, formatBDT, formatPhone, prettyArea } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { useFavorites, useToggleFavorite } from "@/hooks/useQueries";
import { ReportDialog } from "@/components/providers/ReportDialog";
import { toast } from "sonner";
import { timeAgo } from "@/lib/utils";
import type { Provider, Review } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

export default function ProviderProfileClient({
  provider: initialProvider,
}: {
  provider: Provider;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [requestOpen, setRequestOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // Favorites (requires login; returns empty or errors gracefully when logged out)
  const { data: favs = [] } = useFavorites();
  const toggleFav = useToggleFavorite();
  const savedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const f of favs) {
      const provider = f.provider as unknown as Provider;
      ids.add(provider?._id ?? (f.provider as string));
    }
    return ids;
  }, [favs]);
  const isSaved = savedIds.has(initialProvider._id);

  const { data } = useQuery({
    queryKey: ["provider", initialProvider.slug],
    queryFn: async () => {
      const res = await fetch(`/api/providers/${initialProvider.slug}`);
      const json = await res.json();
      return json.data as {
        provider: Provider;
        recentReviews: Review[];
        activeRequestCount: number;
      };
    },
    initialData: {
      provider: initialProvider,
      recentReviews: [],
      activeRequestCount: 0,
    },
  });

  const provider = data.provider;
  const reviewQuery = useQuery({
    queryKey: ["reviews", provider.slug, 1],
    queryFn: async () => {
      const res = await fetch(`/api/providers/${provider.slug}/reviews?page=1&limit=10`);
      const json = await res.json();
      return json.data as Review[];
    },
  });

  const samplePhotos = provider.photos ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
      {/* Header */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="h-24 bg-gradient-to-r from-brand-100 via-brand-50 to-brand-100 sm:h-32" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="size-20 rounded-2xl ring-4 ring-card sm:size-24">
                {provider.avatar ? (
                  <AvatarImage src={provider.avatar} alt={provider.businessName} />
                ) : (
                  <AvatarFallback className="bg-brand-100 text-brand-800 text-2xl font-bold">
                    {provider.businessName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold sm:text-2xl">{provider.businessName}</h1>
                  <VerifiedBadge verified={provider.verified} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-medium text-primary">
                    <CategoryIcon slug={provider.category} className="size-4" />
                    {t(getCategoryName(provider.category))}
                  </span>
                  <StarRating rating={provider.rating} />
                  <span>({provider.reviewCount} {t("reviews")})</span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="size-3.5" /> {provider.experience} {t("years experience")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {provider.location?.district}, {prettyArea(provider.location?.area ?? "")}
                  </span>
                  <Badge
                    variant={
                      provider.availability === "available" ? "secondary" : "outline"
                    }
                    className={
                      provider.availability === "available"
                        ? "bg-green-50 text-green-700"
                        : "text-muted-foreground"
                    }
                  >
                    {provider.availability === "available"
                      ? t("Available now")
                      : t(provider.availability)}
                  </Badge>
                </div>
              </div>
            </div>
            {provider.startingPrice ? (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{t("Starting from")}</p>
                <p className="text-2xl font-bold text-primary">
                  {formatBDT(provider.startingPrice)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("Price negotiable")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* About */}
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-lg font-bold">
              {t("About")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {provider.about || provider.description}
            </p>
          </section>

          {/* Services & pricing */}
          <section aria-labelledby="services-heading">
            <h2 id="services-heading" className="text-lg font-bold">
              {t("Services & Pricing")}
            </h2>
            <div className="mt-3 space-y-2">
              {[
                {
                  name: t("Basic Service"),
                  price: provider.startingPrice
                    ? formatBDT(provider.startingPrice)
                    : t("Negotiable"),
                },
                { name: t("Standard Service"), price: t("Negotiable") },
                { name: t("Premium Service"), price: t("Negotiable") },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3"
                >
                  <p className="text-sm font-medium">{tier.name}</p>
                  <p className="shrink-0 text-sm font-semibold">{tier.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery */}
          {samplePhotos.length > 0 && (
            <section aria-labelledby="gallery-heading">
              <h2 id="gallery-heading" className="text-lg font-bold">
                {t("Work Gallery")}
              </h2>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {samplePhotos.slice(0, 8).map((photo, i) => (
                  <Image
                    key={i}
                    src={photo}
                    alt={`${provider.businessName} ${t("work photo")} ${i + 1}`}
                    width={300}
                    height={200}
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section aria-labelledby="reviews-heading">
            <div className="flex items-center justify-between">
              <h2 id="reviews-heading" className="text-lg font-bold">
                {t("Reviews")} ({provider.reviewCount})
              </h2>
              <div className="flex items-center gap-2">
                <StarRating rating={provider.rating} size="sm" />
                <span className="text-sm text-muted-foreground">{t("total rating")}</span>
              </div>
            </div>
            <div className="mt-4">
              <ReviewForm slug={provider.slug} providerId={provider._id} />
            </div>
            <div className="mt-3 space-y-3">
              {reviewQuery.isLoading && (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              )}
              {!reviewQuery.isLoading && reviewQuery.data?.length === 0 && (
                <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                  {t("No reviews yet. Be the first to leave one!")}
                </p>
              )}
              {reviewQuery.data?.map((review) => (
                <article
                  key={review._id}
                  className="rounded-xl border border-border bg-card px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        {typeof review.user !== "string" && review.user.avatar ? (
                          <AvatarImage src={review.user.avatar} alt={review.user.name} />
                        ) : (
                          <AvatarFallback className="bg-brand-50 text-brand-700 text-xs font-semibold">
                            {typeof review.user !== "string"
                              ? review.user.name?.charAt(0)
                              : "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">
                          {typeof review.user !== "string" ? review.user.name : t("User")}
                        </p>
                        <StarRating rating={review.rating} size="sm" showValue={false} />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(review.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {review.text}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold">{t("Contact")}</h2>
            <div className="mt-3 space-y-2.5 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-4 text-primary" /> {formatPhone(provider.phone)}
              </p>
              {provider.whatsapp && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="size-4 text-green-600" /> {t("WhatsApp available")}
                </p>
              )}
            </div>
            <div className="mt-4 grid gap-2">
              <Button
                onClick={() => setRequestOpen(true)}
                size="lg"
                className="w-full text-sm"
              >
                <MessageSquarePlus className="size-4" />
                {t("Send Service Request")}
              </Button>
              <Button
                variant="outline"
                disabled={!user || toggleFav.isPending}
                onClick={() => {
                  if (!user) {
                    router.push("/login");
                    return;
                  }
                  toggleFav.mutate(initialProvider._id, {
                    onSuccess: ({ saved }) =>
                      toast.success(
                        saved
                          ? t("Provider saved.")
                          : t("Provider removed from saved list.")
                      ),
                  });
                }}
              >
                {isSaved ? (
                  <Heart className="size-4 fill-red-500 text-red-500" />
                ) : (
                  <Heart className="size-4" />
                )}
                {isSaved ? t("Saved") : t("Save provider")}
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    toast.success(t("Link copied to clipboard!"));
                  } catch {
                    toast.error(t("Unable to copy link."));
                  }
                }}
              >
                <Share2 className="size-4" /> {t("Share")}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold">{t("Service area")}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              {provider.location?.district} — {prettyArea(provider.location?.area ?? "")}
              {provider.location?.address ? ` (${provider.location.address})` : ""}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Clock className="size-4 text-primary" /> {t("Working hours")}
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {provider.workingHours?.length > 0 ? (
                provider.workingHours.map((wh) => (
                  <li key={wh.day} className="flex justify-between text-muted-foreground">
                    <span>{t(wh.day)}</span>
                    <span className="text-foreground">
                      {wh.open} – {wh.close}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">{t("Flexible hours")}</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-brand-800">
              <ShieldCheck className="size-4" /> {t("Trusted")}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-brand-800/80">
              {provider.verified
                ? t("This provider has been verified by our team. They are reliably safe to hire.")
                : t("This provider has not been verified yet. Please check their reviews before proceeding.")}
            </p>
            <Button
              variant="link"
              className="mt-2 h-auto p-0 text-xs font-medium text-destructive"
              onClick={() => setReportOpen(true)}
            >
              <Flag className="mr-1 size-3" /> {t("Report this provider")}
            </Button>
          </div>
        </aside>
      </div>

      {/* Desktop inline CTA */}
      <div className="mt-6 hidden lg:flex">
        <Button
          onClick={() => setRequestOpen(true)}
          size="lg"
          className="w-full text-base"
        >
          <MessageSquarePlus className="size-5" />
          {t("Send Service Request")} — {provider.businessName}
        </Button>
      </div>

      {/* Mobile sticky bottom CTA */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-md md:hidden">
        <Button
          onClick={() => setRequestOpen(true)}
          size="lg"
          className="w-full"
        >
          <MessageSquarePlus className="size-4" />
          {t("Send Service Request")}
        </Button>
      </div>

      <ServiceRequestForm
        provider={provider}
        open={requestOpen}
        onOpenChange={setRequestOpen}
      />
      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        provider={provider}
      />
    </div>
  );
}