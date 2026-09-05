import { NextResponse } from "next/server";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/auth";

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
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category could not be found." },
        { status: 404 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.nameBn !== undefined) updates.nameBn = body.nameBn;
    if (body.description !== undefined) updates.description = body.description;
    if (body.icon !== undefined) updates.icon = body.icon;
    if (body.popular !== undefined) updates.popular = body.popular;
    if (body.active !== undefined) updates.active = body.active;
    if (body.order !== undefined) updates.order = Number(body.order);
    if (body.slug !== undefined) {
      const newSlug = String(body.slug)
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      const exists = await Category.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });
      if (exists) {
        return NextResponse.json(
          { success: false, error: "Another category already uses this slug." },
          { status: 409 }
        );
      }
      updates.slug = newSlug;
    }

    const updated = await Category.findByIdAndUpdate(id, updates, { new: true }).lean();
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[admin category update] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

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
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category could not be found." },
        { status: 404 }
      );
    }

    // Prevent deleting all categories — at least keep 1 active
    const count = await Category.countDocuments({ active: true });
    if (count <= 1 && category.active) {
      return NextResponse.json(
        {
          success: false,
          error:
            "At least one active category must remain. Please deactivate this category or add a new one first.",
        },
        { status: 400 }
      );
    }

    await category.deleteOne();
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (err) {
    console.error("[admin category delete] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}