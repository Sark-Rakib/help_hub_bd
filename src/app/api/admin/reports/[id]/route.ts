import { NextResponse } from "next/server";
import Report from "@/models/Report";
import { requireAdmin } from "@/lib/auth";

/**
 * PATCH /api/admin/reports/[id] — resolve or dismiss a report
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

    if (!["pending", "resolved", "dismissed"].includes(body.status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status." },
        { status: 400 }
      );
    }

    const report = await Report.findById(id);
    if (!report) {
      return NextResponse.json(
        { success: false, error: "The report could not be found." },
        { status: 404 }
      );
    }

    report.status = body.status;
    await report.save();

    return NextResponse.json({ success: true, data: report });
  } catch (err) {
    console.error("[admin report update] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}