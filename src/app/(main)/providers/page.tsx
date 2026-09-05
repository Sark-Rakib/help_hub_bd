import { Suspense } from "react";
import SearchPageClient from "@/components/search/SearchPageClient";
import { SearchPageSkeleton } from "@/components/search/SearchPageSkeleton";

export const metadata = {
  title: "All Providers | HelpHub BD",
  description:
    "A list of verified providers in Sherpur — checked with two or more reviews.",
};

export default function ProvidersBrowsePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchPageClient basePath="/providers" forceVerifiedOnly />
      </Suspense>
    </main>
  );
}