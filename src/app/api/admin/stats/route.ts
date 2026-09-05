export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import User from "@/models/User";
import Provider from "@/models/Provider";
import ServiceRequest from "@/models/ServiceRequest";
import Review from "@/models/Review";
import Report from "@/models/Report";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/stats — platform overview for admin dashboard
 */
export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const [
      totalUsers,
      totalProviders,
      pendingProviders,
      verifiedProviders,
      totalRequests,
      pendingRequests,
      totalReviews,
      totalReports,
      pendingReports,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      Provider.countDocuments(),
      Provider.countDocuments({ applicationStatus: "pending" }),
      Provider.countDocuments({ verified: true, blocked: false }),
      ServiceRequest.countDocuments(),
      ServiceRequest.countDocuments({ status: "pending" }),
      Review.countDocuments(),
      Report.countDocuments(),
      Report.countDocuments({ status: "pending" }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalProviders,
        pendingProviders,
        verifiedProviders,
        totalRequests,
        pendingRequests,
        totalReviews,
        totalReports,
        pendingReports,
      },
    });
  } catch (err) {
    console.error("[admin stats] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}