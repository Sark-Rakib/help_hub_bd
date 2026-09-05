export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Review from "@/models/Review";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(req.url);
    const rating = url.searchParams.get("rating") || "";
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 20));

    const filter: Record<string, unknown> = {};
    if (rating) filter.rating = Number(rating);

    const total = await Review.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * limit)
      .limit(limit)
      .populate("user", "name phone")
      .populate("provider", "businessName slug")
      .lean();

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: { page: safePage, limit, total, totalPages },
    });
  } catch (err) {
    console.error("[admin reviews] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}