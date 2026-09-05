import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { requireProvider } from "@/lib/auth";
import ServiceRequest from "@/models/ServiceRequest";
import Provider from "@/models/Provider";
import Notification from "@/models/Notification";

const ALLOWED_STATUSES = new Set(["accepted", "rejected", "completed", "cancelled"]);

/**
 * Update request status — provider (owner) or admin.
 * Exported as both PATCH and PUT.
 */
const handleUpdate = async (
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) => {
  try {
    const auth = await requireProvider();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Please login as a provider." },
        { status: 401 }
      );
    }

    const { id } = await ctx.params;
    const body = await req.json();
    const { status } = body;

    if (!ALLOWED_STATUSES.has(status as string)) {
      return NextResponse.json(
        { success: false, error: "Invalid status." },
        { status: 400 }
      );
    }

    await dbConnect();

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return NextResponse.json(
        { success: false, error: "The request could not be found." },
        { status: 404 }
      );
    }

    if (auth.user.role !== "admin") {
      const provider = await Provider.findOne({ user: auth.user._id });
      if (!provider || provider._id.toString() !== request.provider.toString()) {
        return NextResponse.json(
          { success: false, error: "You do not have permission to handle this request." },
          { status: 403 }
        );
      }
    }

    request.status = status;
    await request.save();

    // Notify the customer
    try {
      const labels: Record<string, string> = {
        accepted: "Your service request has been accepted!",
        rejected: "This request could not be accepted by the provider.",
        completed: "Your service request is complete! Please leave a review.",
        cancelled: "Your service request has been cancelled.",
      };
      await Notification.create({
        user: request.user,
        type:
          status === "accepted"
            ? "request_accepted"
            : status === "completed"
              ? "request_completed"
              : status === "rejected"
                ? "request_rejected"
                : "request_accepted",
        title: labels[status as string],
        message: `Status updated by the provider: ${status}`,
        link: "/dashboard",
      });
    } catch {
      // Non-fatal
    }

    return NextResponse.json({ success: true, data: request });
  } catch (err) {
    console.error("[request status] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
};

export { handleUpdate as PATCH, handleUpdate as PUT };