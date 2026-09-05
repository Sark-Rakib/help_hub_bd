export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Review from "@/models/Review";
import Provider from "@/models/Provider";

/**
 * GET /api/providers/[slug]/reviews — paginated reviews for a provider.
 */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await ctx.params;
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(20, Math.max(1, Number(url.searchParams.get("limit")) || 10));

    await dbConnect();

    const provider = await Provider.findOne({ slug });
    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Provider could not be found." },
        { status: 404 }
      );
    }

    const total = await Review.countDocuments({ provider: provider._id });
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const reviews = await Review.find({ provider: provider._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "name avatar")
      .lean();

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: { page, limit, total, totalPages },
    });
  } catch (err) {
    console.error("[reviews list] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}