import type { Role } from "@/types";

export function getDashboardUrl(role?: Role | string | null): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "provider":
      return "/provider";
    default:
      return "/dashboard";
  }
}

export function getBottomNavItems(userRole?: Role | string | null) {
  const dashboard = getDashboardUrl(userRole);
  const tabHref = userRole ? (tab: string) => `${dashboard}?tab=${tab}` : () => "/login";
  const dashboardHref = userRole ? dashboard : "/login";
  const label = userRole === "admin" ? "Dashboard" : "Requests";

  return [
    { label: "Home", href: "/", icon: "home" },
    { label, href: dashboardHref, icon: "clipboard" },
    { label: "Saved", href: tabHref("saved"), icon: "bookmark" },
    { label: "Profile", href: tabHref("profile"), icon: "user" },
  ];
}

export const isProviderRoute = (pathname: string) =>
  pathname.startsWith("/provider");

export const isAdminRoute = (pathname: string) => pathname.startsWith("/admin");

export const isDashboardRoute = (pathname: string) =>
  pathname.startsWith("/dashboard");