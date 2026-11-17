import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/home/PrivacyPolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how HelpHub BD collects, uses and protects personal information across our local services marketplace.",
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
