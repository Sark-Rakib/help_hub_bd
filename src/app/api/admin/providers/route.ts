export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Provider from "@/models/Provider";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/providers — list all provider applications
 */
export async function GET(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "";
    const appStatus = url.searchParams.get("application") || "";
    const search = url.searchParams.get("search") || "";
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 20));

    const filter: Record<string, unknown> = {};
    if (status) filter.blocked = status === "blocked";
    if (appStatus) filter.applicationStatus = appStatus;
    if (search) {
      filter.$or = [
        { businessName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Provider.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);

    const providers = await Provider.find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * limit)
      .limit(limit)
      .populate("user", "name phone email")
      .lean();

    return NextResponse.json({
      success: true,
      data: providers,
      pagination: { page: safePage, limit, total, totalPages },
    });
  } catch (err) {
    console.error("[admin providers] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}