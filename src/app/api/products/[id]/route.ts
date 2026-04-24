import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/mappers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
  return NextResponse.json(toProductDTO(p));
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (typeof body.name === "string") data.name = body.name.trim();
  if (Array.isArray(body.images)) data.images = JSON.stringify(body.images.filter(Boolean));
  if (body.coverImage !== undefined) data.coverImage = body.coverImage;
  if (typeof body.category === "string") data.category = body.category;
  if (typeof body.condition === "string") data.condition = body.condition;
  if (typeof body.costPrice === "number") data.costPrice = Math.max(0, Math.round(body.costPrice));
  if (typeof body.sellingPrice === "number")
    data.sellingPrice = Math.max(0, Math.round(body.sellingPrice));
  if (body.note !== undefined) data.note = body.note?.trim() || null;

  if (typeof body.status === "string") {
    if (existing.status === "sold" && body.status !== "sold") {
      return NextResponse.json(
        { error: "สินค้าขายแล้ว ไม่สามารถเปลี่ยนสถานะได้" },
        { status: 400 }
      );
    }
    data.status = body.status;
  }

  const updated = await prisma.product.update({ where: { id }, data });
  return NextResponse.json(toProductDTO(updated));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { sales: true },
  });
  if (!existing) return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });

  if (existing.sales.length > 0) {
    return NextResponse.json(
      { error: "สินค้ามีประวัติการขายแล้ว ไม่สามารถลบได้" },
      { status: 400 }
    );
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
