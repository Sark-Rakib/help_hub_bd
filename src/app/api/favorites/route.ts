export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { requireUser } from "@/lib/auth";
import Favorite from "@/models/Favorite";
import Provider from "@/models/Provider";

/**
 * POST /api/favorites — toggle favorite (body: { providerId })
 * GET  /api/favorites — list user's saved providers
 */
export async function POST(req: Request) {
  try {
    const auth = await requireUser();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Please login to save." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const providerId = body.providerId as string | undefined;
    if (!providerId) {
      return NextResponse.json(
        { success: false, error: "Please select a provider." },
        { status: 400 }
      );
    }

    await dbConnect();

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Provider could not be found." },
        { status: 404 }
      );
    }

    const existing = await Favorite.findOne({
      user: auth.user._id,
      provider: providerId,
    });

    if (existing) {
      await existing.deleteOne();
      return NextResponse.json({
        success: true,
        data: { saved: false },
      });
    }

    await Favorite.create({
      user: auth.user._id,
      provider: providerId,
    });
    return NextResponse.json({ success: true, data: { saved: true } });
  } catch (err) {
    console.error("[favorite toggle] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const auth = await requireUser();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Please login." },
        { status: 401 }
      );
    }

    await dbConnect();

    const favorites = await Favorite.find({ user: auth.user._id })
      .sort({ createdAt: -1 })
      .populate(
        "provider",
        "businessName slug avatar category verified rating reviewCount startingPrice location.area availability"
      )
      .lean();
    const existing = favorites.filter(
      (f) => f.provider && typeof f.provider === "object" && "_id" in f.provider
    );

    return NextResponse.json({ success: true, data: existing });
  } catch (err) {
    console.error("[favorites list] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}