import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryName } from "@/lib/constants";
import CategoryClient from "@/components/category/CategoryClient";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return { title: "Service not found" };

  const name = cat.name;
  return {
    title: `${name} in Sherpur`,
    description: `Trusted ${name} providers in Sherpur. View ratings, experience and pricing, and send a service request directly.`,
    openGraph: {
      title: `${name} in Sherpur | HelpHub BD`,
      description: `Find ${name.toLowerCase()} service providers in Sherpur.`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!CATEGORIES.some((c) => c.slug === category)) {
    notFound();
  }
  return <CategoryClient category={getCategoryName(category)} slug={category} />;
}