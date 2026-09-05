import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { reportSchema } from "@/lib/validations";
import { requireUser } from "@/lib/auth";
import { rateLimit, ipKey } from "@/lib/rate-limit";
import Report from "@/models/Report";

/**
 * POST /api/reports — file a report against user/provider/review
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
    const auth = await requireUser();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Please login to file a report." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = reportSchema.safeParse(body);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please check the report details.";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const { targetType, targetId, reason, description } = parsed.data;

    await dbConnect();

    // Prevent self-reports / duplicate pending reports
    const duplicate = await Report.findOne({
      reporter: auth.user._id,
      targetType,
      targetId,
      status: "pending",
    });
    if (duplicate) {
      return NextResponse.json({
        success: true,
        data: duplicate,
        message: "Your report is already pending. Our team will review it.",
      });
    }

    const report = await Report.create({
      reporter: auth.user._id,
      targetType,
      targetId,
      reason,
      description: description || undefined,
      status: "pending",
    });

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (err) {
    console.error("[report create] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}