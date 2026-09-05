import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { registerSchema } from "@/lib/validations";
import { hashPassword, signToken, setAuthCookie, toSafeUser } from "@/lib/auth";
import { rateLimit, ipKey } from "@/lib/rate-limit";
import User from "@/models/User";

export async function POST(req: Request) {
  const rl = rateLimit(ipKey(req), 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Please try again in a moment." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please check your information.";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const { name, phone, email, password, role, avatar } = parsed.data;

    await dbConnect();

    const existing = await User.findOne({
      $or: [{ phone }, ...(email ? [{ email }] : [])],
    });

    if (existing) {
      const message =
        existing.phone === phone
          ? "An account with this phone number already exists. Please login."
          : "An account with this email already exists. Please login.";
      return NextResponse.json({ success: false, error: message }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      phone,
      email: email || undefined,
      password: passwordHash,
      role,
      avatar: avatar || undefined,
    });

    const token = signToken({ userId: user._id.toString(), role: user.role });
    await setAuthCookie(token);

    return NextResponse.json(
      { success: true, data: { user: toSafeUser(user.toObject() as unknown as Record<string, unknown>) } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[register] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}