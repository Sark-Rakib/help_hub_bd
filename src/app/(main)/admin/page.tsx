import type { Metadata } from "next";
import AdminDashboard from "@/components/dashboard/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard | HelpHub BD",
  description: "Manage providers, users, requests, reviews and reports",
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}