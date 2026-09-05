export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Provider from "@/models/Provider";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim() ?? "";

    if (q.length < 1) {
      return NextResponse.json({ success: true, data: { providers: [] } });
    }

    await dbConnect();

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const providers = await Provider.find({
      blocked: false,
      applicationStatus: "approved",
      verified: true,
      $or: [
        { businessName: regex },
        { category: regex },
        { "location.area": regex },
      ],
    })
      .sort({ featured: -1, verified: -1, rating: -1 })
      .limit(8)
      .select("businessName slug category photos avatar location rating")
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        providers: providers.map((p) => {
          const { location, photos, avatar, ...rest } = p as unknown as Record<string, unknown>;
          return {
            ...rest,
            area: (location as { area?: string } | undefined)?.area ?? "",
            photo: Array.isArray(photos) && photos.length > 0 ? photos[0] : avatar || "",
          };
        }),
      },
    });
  } catch (err) {
    console.error("[search] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}