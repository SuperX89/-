import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toSaleDTO } from "@/lib/mappers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await prisma.sale.findUnique({ where: { id } });
  if (!s) return NextResponse.json({ error: "ไม่พบรายการขาย" }, { status: 404 });
  return NextResponse.json(toSaleDTO(s));
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.sale.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "ไม่พบรายการขาย" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.customerName !== undefined) data.customerName = body.customerName?.trim() || null;
  if (body.contact !== undefined) data.contact = body.contact?.trim() || null;
  if (body.trackingNumber !== undefined)
    data.trackingNumber = body.trackingNumber?.trim() || null;
  if (body.note !== undefined) data.note = body.note?.trim() || null;
  if (body.shippingProvider !== undefined)
    data.shippingProvider = body.shippingProvider?.trim() || null;

  if (typeof body.shippingStatus === "string") {
    data.shippingStatus = body.shippingStatus;
    // Auto-stamp timestamps when status advances
    if (body.shippingStatus === "shipped" && !existing.shippedAt) {
      data.shippedAt = new Date();
    }
    if (body.shippingStatus === "delivered") {
      if (!existing.shippedAt) data.shippedAt = new Date();
      data.deliveredAt = new Date();
    }
    if (body.shippingStatus === "pending") {
      data.shippedAt = null;
      data.deliveredAt = null;
    }
    if (body.shippingStatus === "no-shipping") {
      data.shippedAt = null;
      data.deliveredAt = null;
    }
  }

  const updated = await prisma.sale.update({ where: { id }, data });
  return NextResponse.json(toSaleDTO(updated));
}
