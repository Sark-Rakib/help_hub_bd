"use client";

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  Provider,
  ProviderQuery,
  PaginatedResult,
  ServiceRequest,
  Review,
  Favorite,
  AppNotification,
} from "@/types";

const API = {
  providers: (params: Record<string, string | number | boolean | undefined>) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") qs.set(k, String(v));
    });
    return `/api/providers?${qs.toString()}`;
  },
};

export function useProviders(query: ProviderQuery, enabled = true) {
  return useQuery({
    queryKey: ["providers", query],
    enabled,
    queryFn: async () => {
      const res = await fetch(API.providers({
        search: query.search,
        category: query.category,
        location: query.location,
        area: query.area,
        minRating: query.minRating,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
        verifiedOnly: query.verifiedOnly,
        availableOnly: query.availableOnly,
        sort: query.sort,
        page: query.page,
        limit: query.limit,
      }));
      if (!res.ok) throw new Error("Unable to load providers.");
      const json = await res.json();
      return json as PaginatedResult<Provider>;
    },
    placeholderData: (prev) => prev,
  });
}

export function useProvider(slug: string | undefined) {
  return useQuery({
    queryKey: ["provider", slug],
    queryFn: async () => {
      const res = await fetch(`/api/providers/${slug}`);
      if (!res.ok) throw new Error("Unable to load the provider.");
      const json = await res.json();
      return json.data as {
        provider: Provider;
        recentReviews: Review[];
        activeRequestCount: number;
      };
    },
    enabled: Boolean(slug),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      const json = await res.json();
      return json.data as Array<{
        _id: string;
        slug: string;
        name: string;
        nameBn?: string;
        description?: string;
        icon?: string;
        active: boolean;
        popular: boolean;
        order: number;
      }>;
    },
  });
}

export function useReviews(
  slug: string | undefined,
  page = 1
) {
  return useQuery({
    queryKey: ["reviews", slug, page],
    queryFn: async () => {
      const res = await fetch(`/api/providers/${slug}/reviews?page=${page}&limit=10`);
      if (!res.ok) throw new Error("Unable to load reviews.");
      const json = await res.json();
      return json as PaginatedResult<Review>;
    },
    enabled: Boolean(slug),
  });
}

export function useUserRequests(status?: string) {
  return useQuery({
    queryKey: ["user-requests", status],
    queryFn: async () => {
      const res = await fetch(`/api/requests?status=${status ?? "all"}&limit=30`);
      if (!res.ok) throw new Error("Unable to load requests.");
      const json = await res.json();
      return json as PaginatedResult<ServiceRequest>;
    },
  });
}

export function useProviderRequests(status?: string) {
  return useQuery({
    queryKey: ["provider-requests", status],
    queryFn: async () => {
      const res = await fetch(`/api/requests/provider?status=${status ?? "all"}&limit=30`);
      if (!res.ok) throw new Error("Unable to load requests.");
      const json = await res.json();
      return json as PaginatedResult<ServiceRequest>;
    },
  });
}

export function useMyProvider() {
  return useQuery({
    queryKey: ["my-provider"],
    queryFn: async () => {
      const res = await fetch("/api/provider-me");
      if (!res.ok) throw new Error("Unable to load your provider profile.");
      const json = await res.json();
      return json.data as Provider | null;
    },
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites");
      if (!res.ok) throw new Error("Unable to load saved providers.");
      const json = await res.json();
      return json.data as Favorite[];
    },
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (providerId: string) => {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data as { saved: boolean };
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications?limit=20");
      if (!res.ok) throw new Error("Unable to load notifications.");
      const json = await res.json();
      return {
        items: json.data as AppNotification[],
        unread: (json.unread ?? 0) as number,
      };
    },
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id?: string; all?: boolean }) => {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Unable to update notifications.");
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useInfiniteProviders(query: Omit<ProviderQuery, "page">) {
  return useInfiniteQuery({
    queryKey: ["providers-infinite", query],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(API.providers({ ...query, page: pageParam, limit: 12 }));
      if (!res.ok) throw new Error("Unable to load providers.");
      const json = await res.json();
      return json as PaginatedResult<Provider>;
    },
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.totalPages
        ? last.pagination.page + 1
        : undefined,
  });
}