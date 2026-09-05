import { NextResponse } from "next/server";
import Review from "@/models/Review";
import Provider from "@/models/Provider";
import ServiceRequest from "@/models/ServiceRequest";
import { requireAdmin } from "@/lib/auth";

/**
 * DELETE /api/admin/reviews/[id] — remove a review and re-aggregate provider rating
 */
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await ctx.params;
    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review could not be found." },
        { status: 404 }
      );
    }

    const providerId = review.provider;
    await review.deleteOne();

    // Recalculate provider rating/reviewCount
    const provider = await Provider.findById(providerId);
    if (provider) {
      const stats = await Review.aggregate([
        { $match: { provider: provider._id } },
        {
          $group: {
            _id: null,
            avg: { $avg: "$rating" },
            total: { $count: {} },
          },
        },
      ]);
      provider.rating = Math.round((stats[0]?.avg ?? 0) * 10) / 10;
      provider.reviewCount = stats[0]?.total ?? 0;
      await provider.save();
    }

    // Allow customer to review again
    await ServiceRequest.updateOne(
      { _id: review.serviceRequest },
      { $set: { status: "completed" } }
    );

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (err) {
    console.error("[admin review delete] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}