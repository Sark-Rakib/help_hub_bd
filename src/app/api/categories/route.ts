export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Category from "@/models/Category";
import { CATEGORIES } from "@/lib/constants";

export async function GET() {
  try {
    await dbConnect();
    const dbCategories = await Category.find({ active: true })
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: dbCategories,
      // Fallback to static constants when DB is empty/seeding not run yet
      fallback: CATEGORIES,
    });
  } catch (err) {
    console.error("[categories] error:", err);
    return NextResponse.json({
      success: true,
      data: CATEGORIES,
    });
  }
}