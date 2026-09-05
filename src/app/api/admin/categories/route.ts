export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Category from "@/models/Category";
import { categorySchema } from "@/lib/validations";
import { generateSlug } from "@/lib/constants";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
    return NextResponse.json({ success: true, data: categories });
  } catch (err) {
    console.error("[admin categories] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }
    await dbConnect();
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please check the category information.";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const { name, nameBn, slug, description, icon } = parsed.data;

    const exists = await Category.findOne({ slug: generateSlug(slug) });
    if (exists) {
      return NextResponse.json(
        { success: false, error: "A category with this slug already exists." },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name,
      nameBn: nameBn || undefined,
      slug: generateSlug(slug),
      description: description || undefined,
      icon: icon || undefined,
      popular: false,
      order: (await Category.countDocuments()) + 1,
      active: true,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err) {
    console.error("[admin category create] error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}