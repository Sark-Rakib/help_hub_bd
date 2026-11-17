import type { Metadata } from "next";
import { TermConditions } from "@/components/home/TermConditions";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms for using HelpHub BD, requesting local services and listing as a provider.",
};

export default function Page() {
  return <TermConditions />;
}
