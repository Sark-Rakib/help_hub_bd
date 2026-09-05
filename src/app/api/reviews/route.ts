import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { reviewSchema } from "@/lib/validations";
import { requireUser } from "@/lib/auth";
import { rateLimit, ipKey } from "@/lib/rate-limit";
import Review from "@/models/Review";
import Provider from "@/models/Provider";
import ServiceRequest from "@/models/ServiceRequest";
import Notification from "@/models/Notification";

export async function POST(req: Request) {
  const rl = rateLimit(ipKey(req), 20, 60_000);
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
        { success: false, error: "Please login to write a review." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please check your review.";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const { rating, text } = parsed.data;
    const providerId = body.providerId as string | undefined;
    const serviceRequestId = body.serviceRequestId as string | undefined;

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

    // Only allow review when there's a completed service request with this provider
    let completedRequest:
      | Awaited<ReturnType<typeof ServiceRequest.findOne>>
      | null = null;
    if (serviceRequestId) {
      completedRequest = await ServiceRequest.findOne({
        _id: serviceRequestId,
        user: auth.user._id,
        provider: providerId,
        status: "completed",
      });
    } else {
      completedRequest = await ServiceRequest.findOne({
        user: auth.user._id,
        provider: providerId,
        status: "completed",
      }).sort({ createdAt: -1 });
    }

    if (!completedRequest) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You can only review after a service has been completed. You have no completed requests with this provider.",
        },
        { status: 403 }
      );
    }

    // Prevent duplicate review for the same completed request
    const existing = await Review.findOne({
      serviceRequest: completedRequest._id,
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A review has already been submitted for this service." },
        { status: 409 }
      );
    }

    const review = await Review.create({
      user: auth.user._id,
      provider: providerId,
      serviceRequest: completedRequest._id,
      rating,
      text,
    });

    // Recalculate provider rating + review count
    const stats = await Review.aggregate([
      { $match: { provider: provider._id } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          total: { $count: {} },
        },
      },
    ]);

    const avg = stats[0]?.avg ?? rating;
    const total = stats[0]?.total ?? 1;
    provider.rating = Math.round(avg * 10) / 10;
    provider.reviewCount = total;
    await provider.save();

    // Notify provider
    try {
      await Notification.create({
        user: provider.user,
        type: "new_review",
        title: "New review!",
        message: `${auth.user.name} left a ${rating}-star review.`,
        link: `/providers/${provider.slug}`,
      });
    } catch {
      // Non-fatal
    }

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (err) {
    console.error("[review create] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}