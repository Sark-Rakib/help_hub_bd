import type { Metadata } from "next";
import ProviderDashboard from "@/components/dashboard/ProviderDashboardClient";

export const metadata: Metadata = {
  title: "Provider Dashboard | HelpHub BD",
  description: "Manage your incoming requests, profile and reviews",
};

export default function ProviderDashboardPage() {
  return <ProviderDashboard />;
}