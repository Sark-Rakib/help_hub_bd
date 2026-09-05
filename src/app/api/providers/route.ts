export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { providerSearchSchema } from "@/lib/validations";
import Provider from "@/models/Provider";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parsed = providerSearchSchema.safeParse(
      Object.fromEntries(url.searchParams)
    );

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid search parameters" },
        { status: 400 }
      );
    }

    const {
      search,
      category,
      location,
      area,
      minRating,
      minPrice,
      maxPrice,
      verifiedOnly,
      availableOnly,
      sort,
      page,
      limit,
    } = parsed.data;

    const filter: Record<string, unknown> = {
      blocked: false,
    };

    if (category) filter.category = category;
    if (location) filter["location.district"] = location;
    if (area) filter["location.area"] = area;

    if (minRating) filter.rating = { $gte: minRating };
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== undefined) priceFilter.$gte = minPrice;
      if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
      filter.startingPrice = priceFilter;
    }
if (verifiedOnly === "true") filter.verified = true;
if (availableOnly === "true") filter.availability = "available";

    if (search?.trim()) {
      filter.$text = { $search: search.trim() };
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      recommended: { featured: -1, verified: -1, rating: -1 },
      rating: { rating: -1 },
      reviews: { reviewCount: -1 },
      price: { startingPrice: 1 },
      nearest: { featured: -1, rating: -1 },
    };

    await dbConnect();

    const total = await Provider.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);

    const providers = await Provider.find(filter)
      .sort(sortMap[sort] ?? sortMap.recommended)
      .skip((safePage - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: providers,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err) {
    console.error("[providers] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}