import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireUser } from "@/lib/auth";
import { rateLimit, ipKey } from "@/lib/rate-limit";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const rl = rateLimit(ipKey(req), 30, 60_000);
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
        { success: false, error: "Please login." },
        { status: 401 }
      );
    }

    const apiKey = process.env.CLOUDINARY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Image upload is not available right now. Please try again in a moment.",
        },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Please select a photo." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Photo size cannot exceed 5MB." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "image/jpeg";
    const ext = mime.split("/")[1] || "jpg";

    const result = await new Promise<{ secure_url: string; public_id: string | null }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "help-hub-bd",
              transformation: [{ width: 1200, crop: "limit" }, { quality: "auto" }],
            },
            (err, res) => {
              if (err || !res) {
                reject(err ?? new Error("Upload failed"));
                return;
              }
              resolve({ secure_url: res.secure_url, public_id: res.public_id });
            }
          )
          .end(bytes);
      }
    );

    // NOTE: mime/ext retained for possible local fallback in dev
    void mime;
    void ext;

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (err) {
    console.error("[upload] error:", err);
    return NextResponse.json(
      { success: false, error: "Photo upload failed. Please try again." },
      { status: 500 }
    );
  }
}