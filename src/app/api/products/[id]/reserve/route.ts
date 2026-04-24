import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/mappers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { customerName, contact, reservedAt, note } = body as {
    customerName?: string;
    contact?: string;
    reservedAt?: string;
    note?: string;
  };

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
  if (existing.status === "sold")
    return NextResponse.json({ error: "สินค้าขายแล้ว ไม่สามารถจองได้" }, { status: 400 });
  if (existing.status === "reserved")
    return NextResponse.json({ error: "สินค้านี้ถูกจองแล้ว" }, { status: 400 });
  if (!customerName || !customerName.trim())
    return NextResponse.json({ error: "กรุณากรอกชื่อลูกค้า" }, { status: 400 });

  const updated = await prisma.product.update({
    where: { id },
    data: {
      status: "reserved",
      reservationCustomerName: customerName.trim(),
      reservationContact: contact?.trim() || null,
      reservationAt: reservedAt ? new Date(reservedAt) : new Date(),
      reservationNote: note?.trim() || null,
    },
  });

  return NextResponse.json(toProductDTO(updated));
}
