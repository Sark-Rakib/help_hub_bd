import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import Provider from "@/models/Provider";
import { getCategoryName, prettyArea } from "@/lib/constants";
import ProviderProfileClient from "@/components/providers/ProviderProfileClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const provider = await Provider.findOne({ slug })
    .select("businessName category description rating reviewCount location")
    .lean();

  if (!provider) return { title: "Provider not found" };

  const name = provider.businessName;
  const category = getCategoryName(provider.category);
  return {
    title: `${name} — ${category} in ${prettyArea(provider.location?.area ?? "Sherpur")}`,
    description:
      provider.description?.slice(0, 155) ??
      `${name} — ${category} provider in Sherpur. Rating ${provider.rating}, ${provider.reviewCount} reviews.`,
    openGraph: {
      title: `${name} | HelpHub BD`,
      description:
        provider.description?.slice(0, 155) ?? `${category} provider in Sherpur.`,
      type: "profile",
    },
  };
}

export default async function ProviderProfilePage({ params }: Props) {
  const { slug } = await params;
  await dbConnect();
  const provider = await Provider.findOne({ slug, blocked: false }).lean();

  if (!provider) notFound();

  const serialized = JSON.parse(JSON.stringify(provider));

  return <ProviderProfileClient provider={serialized} />;
}