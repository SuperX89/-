import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/mappers";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
  if (existing.status !== "reserved")
    return NextResponse.json({ error: "สินค้านี้ยังไม่ได้ถูกจอง" }, { status: 400 });

  const updated = await prisma.product.update({
    where: { id },
    data: {
      status: "available",
      reservationCustomerName: null,
      reservationContact: null,
      reservationAt: null,
      reservationNote: null,
    },
  });

  return NextResponse.json(toProductDTO(updated));
}
