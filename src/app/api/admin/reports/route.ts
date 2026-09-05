import { NextResponse } from "next/server";
import Report from "@/models/Report";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/reports — list reports (user/provider/review)
 */
export async function GET(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "";
    const targetType = url.searchParams.get("targetType") || "";
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 20));

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (targetType) filter.targetType = targetType;

    const total = await Report.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * limit)
      .limit(limit)
      .populate("reporter", "name phone")
      .lean();

    return NextResponse.json({
      success: true,
      data: reports,
      pagination: { page: safePage, limit, total, totalPages },
    });
  } catch (err) {
    console.error("[admin reports] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}