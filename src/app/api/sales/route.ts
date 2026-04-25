import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toSaleDTO } from "@/lib/mappers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const shippingStatus = searchParams.get("shippingStatus");

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { snapshotName: { contains: q } },
      { customerName: { contains: q } },
      { trackingNumber: { contains: q } },
    ];
  }
  if (from || to) {
    const range: Record<string, Date> = {};
    if (from) range.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      range.lte = end;
    }
    where.soldAt = range;
  }
  if (shippingStatus && shippingStatus !== "all") {
    where.shippingStatus = shippingStatus;
  }

  const sales = await prisma.sale.findMany({
    where,
    orderBy: { soldAt: "desc" },
  });

  // Always compute counts across the full period (ignoring shippingStatus filter)
  const allWhere = { ...where } as Record<string, unknown>;
  delete allWhere.shippingStatus;
  const allSales =
    shippingStatus && shippingStatus !== "all"
      ? await prisma.sale.findMany({ where: allWhere })
      : sales;

  const totalRevenue = allSales.reduce((s, x) => s + x.actualSalePrice, 0);
  const totalProfit = allSales.reduce((s, x) => s + x.profit, 0);
  const totalShipping = allSales.reduce((s, x) => s + x.shippingCost, 0);

  const pendingCount = allSales.filter((x) => x.shippingStatus === "pending").length;
  const shippedCount = allSales.filter((x) => x.shippingStatus === "shipped").length;
  const deliveredCount = allSales.filter((x) => x.shippingStatus === "delivered").length;
  const noShippingCount = allSales.filter((x) => x.shippingStatus === "no-shipping").length;

  return NextResponse.json({
    sales: sales.map(toSaleDTO),
    summary: {
      count: allSales.length,
      totalRevenue,
      totalProfit,
      totalShipping,
      pendingCount,
      shippedCount,
      deliveredCount,
      noShippingCount,
    },
  });
}
