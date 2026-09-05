import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { becomeProviderSchema } from "@/lib/validations";
import { rateLimit, ipKey } from "@/lib/rate-limit";
import { getCurrentUser, signToken, setAuthCookie } from "@/lib/auth";
import User from "@/models/User";
import Provider from "@/models/Provider";

/**
 * POST /api/become-provider
 * Users with an account upgrade role to provider and create a provider profile.
 * If no account yet, registers one (role=provider) using name/phone/password.
 */
export async function POST(req: Request) {
  const rl = rateLimit(ipKey(req), 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: "Please try again in a moment." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = becomeProviderSchema.safeParse(body);

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please check your information.";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const { businessName, category, description, phone, whatsapp, area, address, experience, startingPrice, workingHours } =
      parsed.data;

    await dbConnect();

    let user = await getCurrentUser();

    // New registration path
    if (!user) {
      const password = body.password as string | undefined;
      const name = body.name as string | undefined;
      if (!password || password.length < 6 || !name) {
        return NextResponse.json(
          {
            success: false,
            error:
              "New providers need a name and password (minimum 6 characters).",
          },
          { status: 400 }
        );
      }

      const existing = await User.findOne({ phone });
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            error: "An account with this phone number already exists. Please login and try again.",
          },
          { status: 409 }
        );
      }

      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      user = await User.create({
        name,
        phone,
        password: hash,
        role: "provider",
      });
    } else {
      // Promote existing user to provider role
      if ((user as unknown as { role: string }).role === "user") {
        await User.findByIdAndUpdate(user._id, { role: "provider" });
      }
    }

    // Refresh the session token so the role change applies immediately
    await setAuthCookie(
      signToken({ userId: String(user._id), role: "provider" })
    );

    // Ensure the user doesn't already have a provider profile
    const existingProfile = await Provider.findOne({ user: user._id });
    if (existingProfile) {
      return NextResponse.json({
        success: true,
        data: existingProfile,
        message: "You already have a provider profile.",
      });
    }

    const slugBase = businessName.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    let slug = slugBase.replace(/-+/g, "-");
    let index = 1;
    while (await Provider.findOne({ slug })) {
      slug = `${slugBase}-${index}`;
      index += 1;
    }

    const provider = await Provider.create({
      user: user._id,
      businessName,
      slug,
      category,
      description,
      experience: Number(experience) || 1,
      startingPrice: startingPrice ?? undefined,
      location: { district: "Sherpur", area, address: address || undefined },
      phone,
      whatsapp: whatsapp || undefined,
      applicationStatus: "pending",
      availability: "available",
      workingHours: workingHours ?? [],
    });

    const providerResponse = provider.toObject();

    return NextResponse.json(
      {
        success: true,
        data: providerResponse,
        message:
          "Application submitted! Our team will review it and once approved, it will be shown to customers.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[become-provider] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}