export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { requireProvider } from "@/lib/auth";
import ServiceRequest from "@/models/ServiceRequest";

/**
 * Provider's incoming requests. Provider/admin can fetch.
 */
export async function GET(req: Request) {
  try {
    const auth = await requireProvider();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Please login as a provider." },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 20));

    await dbConnect();

    const filter: Record<string, unknown> = {};
    if (auth.user.role !== "admin") {
      const provider = await (await import("@/models/Provider")).default.findOne({
        user: auth.user._id,
      });
      if (!provider) {
        return NextResponse.json(
          { success: false, error: "Provider profile could not be found." },
          { status: 404 }
        );
      }
      filter.provider = provider._id;
    }
    if (status && status !== "all") filter.status = status;

    const total = await ServiceRequest.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);

    const requests = await ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * limit)
      .limit(limit)
      .populate("provider", "businessName slug avatar")
      .populate("user", "name phone avatar")
      .lean();

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: { page: safePage, limit, total, totalPages },
    });
  } catch (err) {
    console.error("[provider requests] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}