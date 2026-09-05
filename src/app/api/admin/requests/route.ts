export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import ServiceRequest from "@/models/ServiceRequest";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/requests — platform-wide request monitoring
 */
export async function GET(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "";
    const emergency = url.searchParams.get("emergency") || "";
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 20));

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (emergency === "true") filter.emergency = true;

    const total = await ServiceRequest.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);

    const requests = await ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * limit)
      .limit(limit)
      .populate("user", "name phone")
      .populate("provider", "businessName slug category")
      .lean();

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: { page: safePage, limit, total, totalPages },
    });
  } catch (err) {
    console.error("[admin requests] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}