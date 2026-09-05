import { NextResponse } from "next/server";
import User from "@/models/User";
import Provider from "@/models/Provider";
import Notification from "@/models/Notification";
import { requireAdmin } from "@/lib/auth";

/**
 * PUT /api/admin/users/[id] — block/unblock a user
 * Body: { blocked: boolean }
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

    if (typeof body.blocked !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Please provide a blocked value (true/false)." },
        { status: 400 }
      );
    }

    // Prevent blocking an admin
    const target = await User.findById(id);
    if (!target) {
      return NextResponse.json(
        { success: false, error: "User could not be found." },
        { status: 404 }
      );
    }
    if (target.role === "admin") {
      return NextResponse.json(
        { success: false, error: "Admins cannot be blocked." },
        { status: 400 }
      );
    }

    target.blocked = body.blocked;
    await target.save();

    return NextResponse.json({ success: true, data: target });
  } catch (err) {
    console.error("[admin user update] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id] — permanently delete a user
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

    const target = await User.findById(id);
    if (!target) {
      return NextResponse.json(
        { success: false, error: "User could not be found." },
        { status: 404 }
      );
    }
    if (target.role === "admin" || String(target._id) === String(auth.user._id)) {
      return NextResponse.json(
        { success: false, error: "Admins cannot be deleted." },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(id);
    await Provider.deleteMany({ user: id });
    await Notification.deleteMany({ user: id });

    return NextResponse.json({ success: true, message: "User deleted." });
  } catch (err) {
    console.error("[admin user delete] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}