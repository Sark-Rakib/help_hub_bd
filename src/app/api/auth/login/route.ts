import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { loginSchema } from "@/lib/validations";
import { comparePassword, signToken, setAuthCookie, toSafeUser } from "@/lib/auth";
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
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Please enter your phone/email and password." },
        { status: 400 }
      );
    }

    const { identifier, password } = parsed.data;

    await dbConnect();

    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: identifier.toLowerCase() }],
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json(
        { success: false, error: "Phone/email or password is incorrect." },
        { status: 401 }
      );
    }

    if (user.blocked) {
      return NextResponse.json(
        { success: false, error: "Your account is temporarily blocked. Please contact support." },
        { status: 403 }
      );
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });
    await setAuthCookie(token);

    return NextResponse.json(
      { success: true, data: { user: toSafeUser(user.toObject() as unknown as Record<string, unknown>) } },
      { status: 200 }
    );
  } catch (err) {
    console.error("[login] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}