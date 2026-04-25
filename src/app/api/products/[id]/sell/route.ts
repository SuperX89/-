import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toSaleDTO } from "@/lib/mappers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const {
    actualSalePrice,
    shippingCost,
    soldAt,
    customerName,
    contact,
    trackingNumber,
    note,
    shippingProvider,
    shippingStatus,
  } = body as {
    actualSalePrice?: number;
    shippingCost?: number;
    soldAt?: string;
    customerName?: string;
    contact?: string;
    trackingNumber?: string;
    note?: string;
    shippingProvider?: string;
    shippingStatus?: string;
  };

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
  if (product.status === "sold")
    return NextResponse.json({ error: "สินค้าถูกขายไปแล้ว" }, { status: 400 });

  const price = Number(actualSalePrice);
  if (!Number.isFinite(price) || price < 0)
    return NextResponse.json({ error: "ราคาขายจริงไม่ถูกต้อง" }, { status: 400 });

  const shipping = Number(shippingCost ?? 0);
  if (!Number.isFinite(shipping) || shipping < 0)
    return NextResponse.json({ error: "ค่าส่งไม่ถูกต้อง" }, { status: 400 });

  const profit = Math.round(price - product.costPrice - shipping);

  const [, sale] = await prisma.$transaction([
    prisma.product.update({
      where: { id },
      data: { status: "sold" },
    }),
    prisma.sale.create({
      data: {
        productId: id,
        snapshotName: product.name,
        snapshotImage: product.coverImage,
        snapshotCostPrice: product.costPrice,
        actualSalePrice: Math.round(price),
        shippingCost: Math.round(shipping),
        profit,
        soldAt: soldAt ? new Date(soldAt) : new Date(),
        customerName: customerName?.trim() || product.reservationCustomerName || null,
        contact: contact?.trim() || product.reservationContact || null,
        trackingNumber: trackingNumber?.trim() || null,
        note: note?.trim() || null,
        shippingStatus: shippingStatus || "pending",
        shippingProvider: shippingProvider?.trim() || null,
      },
    }),
  ]);

  return NextResponse.json(toSaleDTO(sale), { status: 201 });
}
