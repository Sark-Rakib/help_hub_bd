import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPageClient from "@/components/search/SearchPageClient";
import { SearchPageSkeleton } from "@/components/search/SearchPageSkeleton";

export const metadata: Metadata = {
  title: "Provider Search | HelpHub BD",
  description:
    "Find service providers in Sherpur — AC, electrician, plumber, tutor and more.",
};

export default function SearchPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchPageClient forceVerifiedOnly />
      </Suspense>
    </main>
  );
}