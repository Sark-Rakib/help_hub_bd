export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Provider from "@/models/Provider";
import Review from "@/models/Review";
import ServiceRequest from "@/models/ServiceRequest";
import { requireProvider } from "@/lib/auth";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await ctx.params;
    await dbConnect();

    const provider = await Provider.findOne({
      slug,
      blocked: false,
    })
      .populate("user", "name avatar email role")
      .lean();

    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Provider could not be found." },
        { status: 404 }
      );
    }

    const [recentReviews, activeRequestCount] = await Promise.all([
      Review.find({ provider: provider._id })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("user", "name avatar")
        .lean(),
      ServiceRequest.countDocuments({ provider: provider._id, status: "accepted" }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        provider,
        recentReviews,
        activeRequestCount,
      },
    });
  } catch (err) {
    console.error("[provider detail] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Update provider profile — provider (owner) or admin only.
 */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await requireProvider();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Please login to your provider account." },
        { status: 401 }
      );
    }

    const { slug } = await ctx.params;
    await dbConnect();

    const provider = await Provider.findOne({ slug });
    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Provider could not be found." },
        { status: 404 }
      );
    }

    const isOwner = provider.user.toString() === auth.user._id.toString();
    const isAdmin = auth.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "You do not have permission to edit this profile." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (body.businessName !== undefined) {
      updates.businessName = body.businessName;
      updates.slug = body.businessName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }
    if (body.description !== undefined) updates.description = body.description;
    if (body.about !== undefined) updates.about = body.about;
    if (body.experience !== undefined) updates.experience = Number(body.experience);
    if (body.area !== undefined) updates["location.area"] = body.area;
    if (body.district !== undefined) updates["location.district"] = body.district;
    if (body.address !== undefined) updates["location.address"] = body.address;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.whatsapp !== undefined) updates.whatsapp = body.whatsapp;
    if (body.availability !== undefined) updates.availability = body.availability;
    if (body.startingPrice !== undefined)
      updates.startingPrice = Number(body.startingPrice);
    if (body.services !== undefined) updates.services = body.services;
    if (body.photos !== undefined) updates.photos = body.photos;
    if (body.avatar !== undefined) updates.avatar = body.avatar;
    if (body.category !== undefined) updates.category = body.category;
    if (body.workingHours !== undefined) updates.workingHours = body.workingHours;

    const updated = await Provider.findOneAndUpdate({ slug }, updates, {
      new: true,
    }).lean();

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[provider update] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}