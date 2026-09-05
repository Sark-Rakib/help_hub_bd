export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { requireProvider } from "@/lib/auth";
import { providerUpdateSchema } from "@/lib/validations";
import Provider from "@/models/Provider";

/**
 * GET /api/provider-me — current user's provider profile
 */
export async function GET() {
  try {
    const auth = await requireProvider();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Please login as a provider." },
        { status: 401 }
      );
    }

    await dbConnect();

    const provider = await Provider.findOne({ user: auth.user._id }).lean();

    return NextResponse.json({
      success: true,
      data: provider,
      applicationStatus: provider?.applicationStatus ?? "none",
    });
  } catch (err) {
    console.error("[provider-me] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/provider-me — update the current user's provider profile
 */
export async function PUT(req: Request) {
  try {
    const auth = await requireProvider();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Please login as a provider." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = providerUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please check your information.";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    await dbConnect();

    const provider = await Provider.findOne({ user: auth.user._id });
    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Provider profile not found." },
        { status: 404 }
      );
    }

    const updates = parsed.data;
    const set: Record<string, unknown> = {};
    if (updates.businessName) set.businessName = updates.businessName;
    if (updates.description !== undefined) set.description = updates.description;
    if (updates.about !== undefined) set.about = updates.about;
    if (updates.experience !== undefined) set.experience = updates.experience;
    if (updates.area !== undefined) set["location.area"] = updates.area;
    if (updates.address !== undefined)
      set["location.address"] = updates.address || undefined;
    if (updates.phone) set.phone = updates.phone;
    if (updates.whatsapp !== undefined)
      set.whatsapp = updates.whatsapp || undefined;
    if (updates.availability) set.availability = updates.availability;
    if (updates.startingPrice !== undefined)
      set.startingPrice = updates.startingPrice;
    if (updates.services !== undefined) set.services = updates.services;
    if (updates.workingHours !== undefined)
      set.workingHours = updates.workingHours;
    if (updates.avatar !== undefined) set.avatar = updates.avatar || undefined;
    if (updates.photos !== undefined) set.photos = updates.photos;

    const updated = await Provider.findByIdAndUpdate(
      provider._id,
      { $set: set },
      { new: true }
    ).lean();

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[provider-me] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}