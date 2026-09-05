import { NextResponse } from "next/server";
import Provider from "@/models/Provider";
import Notification from "@/models/Notification";
import Favorite from "@/models/Favorite";
import { requireAdmin } from "@/lib/auth";

/**
 * PATCH /api/admin/providers/[id]
 * Actions: verify, set applicationStatus (approve/reject), block/unblock, toggle featured
 */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await ctx.params;
    const body = await req.json();

    const provider = await Provider.findById(id);
    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Provider could not be found." },
        { status: 404 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (typeof body.verified === "boolean") {
      updates.verified = body.verified;
      // Notify provider about verification status
      if (body.verified) {
        await Notification.create({
          user: provider.user,
          type: "provider_verified",
          title: "You're now a verified provider! 🎉",
          message: "Your profile has been verified. Your badge is live!",
          link: "/provider",
        }).catch(() => {});
      }
    }

    if (body.applicationStatus === "approved") {
      updates.applicationStatus = "approved";
      updates.applicationNote = body.note || "";
      await Notification.create({
        user: provider.user,
        type: "provider_verified",
        title: "Provider application approved!",
        message: "Your profile is now visible to customers.",
        link: "/provider",
      }).catch(() => {});
    } else if (body.applicationStatus === "rejected") {
      updates.applicationStatus = "rejected";
      updates.applicationNote = body.note || "";
      await Notification.create({
        user: provider.user,
        type: "request_rejected",
        title: "Provider application rejected",
        message: body.note || "You can resubmit it, and we'll review it again.",
        link: "/become-provider",
      }).catch(() => {});
    }

    if (typeof body.blocked === "boolean") {
      updates.blocked = body.blocked;
      updates.blockedReason = body.blockedReason || (body.blocked ? "Admin action" : undefined);
      if (body.blocked) {
        updates.verified = false;
      }
    }

    if (typeof body.featured === "boolean") {
      updates.featured = body.featured;
      updates.featuredAt = body.featured ? new Date() : undefined;
    }

    const updated = await Provider.findByIdAndUpdate(id, updates, { new: true })
      .populate("user", "name phone")
      .lean();

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[admin provider update] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/providers/[id] — permanently delete a provider profile
 */
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await ctx.params;

    const provider = await Provider.findById(id);
    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Provider could not be found." },
        { status: 404 }
      );
    }

    await Provider.findByIdAndDelete(id);
    await Notification.deleteMany({ user: provider.user, type: "provider_verified" });
    await Favorite.deleteMany({ provider: id });

    return NextResponse.json({ success: true, message: "Provider deleted." });
  } catch (err) {
    console.error("[admin provider delete] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}