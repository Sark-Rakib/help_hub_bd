import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { requireUser, getCurrentUser, toSafeUser } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validations";
import User from "@/models/User";
import Provider from "@/models/Provider";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: true, data: { user: null } });
  }
  return NextResponse.json({
    success: true,
    data: { user: toSafeUser(user as unknown as Record<string, unknown>) },
  });
}

export async function PUT(req: Request) {
  try {
    const auth = await requireUser();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Please login to update your profile." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please check your information.";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const { name, email, avatar, phone } = parsed.data;

    await dbConnect();

    if (phone && phone !== auth.user.phone) {
      const phoneClash = await User.findOne({
        phone,
        _id: { $ne: auth.user._id },
      });
      if (phoneClash) {
        return NextResponse.json(
          { success: false, error: "An account with this phone number already exists." },
          { status: 409 }
        );
      }
    }

    if (email) {
      const clash = await User.findOne({
        email,
        _id: { $ne: auth.user._id },
      });
      if (clash) {
        return NextResponse.json(
          { success: false, error: "An account with this email already exists." },
          { status: 409 }
        );
      }
    }

    const updates: Record<string, unknown> = {};
    if (name) updates.name = name.trim();
    if (email !== undefined) updates.email = email || undefined;
    if (avatar !== undefined) updates.avatar = avatar || undefined;
    if (phone) updates.phone = phone;

    const user = await User.findByIdAndUpdate(
      auth.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Account could not be found." },
        { status: 404 }
      );
    }

    if (phone && user.role === "provider") {
      await Provider.findOneAndUpdate(
        { user: user._id },
        { $set: { phone } },
        { new: true }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user: toSafeUser(user.toObject() as unknown as Record<string, unknown>) },
    });
  } catch (err) {
    console.error("[profile update] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}