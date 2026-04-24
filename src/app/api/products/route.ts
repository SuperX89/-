import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/mappers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (category && category !== "all") where.category = category;
  if (q) where.name = { contains: q };

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products.map(toProductDTO));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    name,
    images,
    coverImage,
    category,
    condition,
    costPrice,
    sellingPrice,
    note,
  } = body as {
    name?: string;
    images?: string[];
    coverImage?: string | null;
    category?: string;
    condition?: string;
    costPrice?: number;
    sellingPrice?: number;
    note?: string | null;
  };

  if (!name || name.trim().length === 0) {
    return NextResponse.json({ error: "กรุณากรอกชื่อสินค้า" }, { status: 400 });
  }
  if (sellingPrice == null || sellingPrice < 0) {
    return NextResponse.json({ error: "ราคาขายไม่ถูกต้อง" }, { status: 400 });
  }
  if (costPrice != null && costPrice < 0) {
    return NextResponse.json({ error: "ราคาทุนไม่ถูกต้อง" }, { status: 400 });
  }

  const imagesArr = Array.isArray(images) ? images.filter(Boolean) : [];
  const cover = coverImage || imagesArr[0] || null;

  const created = await prisma.product.create({
    data: {
      name: name.trim(),
      images: JSON.stringify(imagesArr),
      coverImage: cover,
      category: category || "other",
      condition: condition || "good",
      costPrice: Math.max(0, Math.round(costPrice ?? 0)),
      sellingPrice: Math.max(0, Math.round(sellingPrice)),
      note: note?.trim() || null,
      status: "available",
    },
  });

  return NextResponse.json(toProductDTO(created), { status: 201 });
}
