import type { Metadata } from "next";
import { Suspense } from "react";
import UserDashboard from "@/components/dashboard/UserDashboardClient";

export const metadata: Metadata = {
  title: "My Dashboard | HelpHub BD",
  description: "Your service requests, saved providers and profile",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-10 w-56 animate-pulse rounded-lg bg-muted" />
          <div className="mt-6 h-12 animate-pulse rounded-xl bg-muted" />
        </div>
      }
    >
      <UserDashboard />
    </Suspense>
  );
}