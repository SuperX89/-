import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomBytes } from "crypto";

export const runtime = "nodejs";

// Vercel serverless body limit on Hobby is ~4.5MB per request,
// so we cap each file conservatively below that. Client compresses to ~1.5MB before upload.
const MAX_SIZE = 4 * 1024 * 1024; // 4MB per file
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  // iOS native formats — fallback if client-side conversion didn't run
  "image/heic",
  "image/heif",
]);

export async function POST(req: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "ยังไม่ได้ตั้งค่า BLOB_READ_WRITE_TOKEN — ดู DEPLOY.md",
      },
      { status: 500 }
    );
  }

  const form = await req.formData();
  const files = form.getAll("files");

  if (!files.length) {
    return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });
  }

  const saved: string[] = [];
  for (const entry of files) {
    if (!(entry instanceof File)) continue;
    if (entry.size === 0) continue;
    if (entry.size > MAX_SIZE)
      return NextResponse.json(
        { error: `ไฟล์ใหญ่เกิน ${Math.round(MAX_SIZE / 1024 / 1024)}MB` },
        { status: 400 }
      );
    if (!ALLOWED.has(entry.type))
      return NextResponse.json(
        { error: `รองรับเฉพาะรูปภาพ (พบ: ${entry.type || "ไม่ทราบรูปแบบ"})` },
        { status: 400 }
      );

    const ext = entry.type.split("/")[1] || "bin";
    const name = `products/${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;

    const blob = await put(name, entry, {
      access: "public",
      contentType: entry.type,
    });
    saved.push(blob.url);
  }

  return NextResponse.json({ paths: saved });
}
