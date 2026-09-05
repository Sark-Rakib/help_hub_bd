export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { serviceRequestSchema } from "@/lib/validations";
import { requireUser } from "@/lib/auth";
import { rateLimit, ipKey } from "@/lib/rate-limit";
import ServiceRequest from "@/models/ServiceRequest";
import Provider from "@/models/Provider";
import Notification from "@/models/Notification";

export async function POST(req: Request) {
  const rl = rateLimit(ipKey(req), 30, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: "Please try again in a moment." },
      { status: 429 }
    );
  }

  try {
    const auth = await requireUser();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Please login to send a service request." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = serviceRequestSchema.safeParse(body);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please check your information.";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const { service, description, area, address, preferredDate, preferredTime, budget, phone, emergency } =
      parsed.data;

    const providerId = body.providerId as string | undefined;
    if (!providerId) {
      return NextResponse.json(
        { success: false, error: "Please select a provider." },
        { status: 400 }
      );
    }

    await dbConnect();

    const provider = await Provider.findById(providerId);
    if (!provider || provider.blocked) {
      return NextResponse.json(
        { success: false, error: "Provider could not be found." },
        { status: 404 }
      );
    }

    const request = await ServiceRequest.create({
      user: auth.user._id,
      provider: providerId,
      service,
      description,
      location: {
        district: "Sherpur",
        area,
        address: address || undefined,
      },
      preferredDate,
      preferredTime: preferredTime || undefined,
      budget: budget ? Number(budget) : undefined,
      phone,
      photos: Array.isArray(body.photos) ? body.photos : [],
      emergency: Boolean(emergency),
      status: "pending",
    });

    // Notify provider of the new request
    try {
      await Notification.create({
        user: provider.user,
        type: "new_request",
        title: emergency ? "🚨 Urgent service request" : "New service request",
        message: `${auth.user.name} sent a service request — ${service}`,
        link: `/provider?tab=requests`,
      });
    } catch {
      // Notification failure shouldn't break request creation
    }

    return NextResponse.json(
      { success: true, data: request },
      { status: 201 }
    );
  } catch (err) {
    console.error("[request create] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * GET current user's service requests (optionally filter by status).
 */
export async function GET(req: Request) {
  try {
    const auth = await requireUser();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Please login." },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 20));

    await dbConnect();

    const filter: Record<string, unknown> = { user: auth.user._id };
    if (status && status !== "all") filter.status = status;

    const total = await ServiceRequest.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);

    const requests = await ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * limit)
      .limit(limit)
      .populate("provider", "businessName slug avatar category verified location area startingPrice rating")
      .lean();

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: { page: safePage, limit, total, totalPages },
    });
  } catch (err) {
    console.error("[requests list] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}