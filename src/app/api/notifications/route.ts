import { NextResponse } from "next/server";
import Notification from "@/models/Notification";
import { requireUser } from "@/lib/auth";

/**
 * GET /api/notifications — current user's notifications
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
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 20));

    const total = await Notification.countDocuments({ user: auth.user._id });
    const unread = await Notification.countDocuments({
      user: auth.user._id,
      read: false,
    });
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const notifications = await Notification.find({ user: auth.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: notifications,
      unread,
      pagination: { page, limit, total, totalPages },
    });
  } catch (err) {
    console.error("[notifications] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications — mark as read (body: { id?: string, all?: boolean })
 */
export async function POST(req: Request) {
  try {
    const auth = await requireUser();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Please login." },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (body.all) {
      await Notification.updateMany(
        { user: auth.user._id, read: false },
        { $set: { read: true } }
      );
    } else if (body.id) {
      await Notification.updateOne(
        { _id: body.id, user: auth.user._id },
        { $set: { read: true } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[notifications update] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}