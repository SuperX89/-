import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toSaleDTO } from "@/lib/mappers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { snapshotName: { contains: q } },
      { customerName: { contains: q } },
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

  const sales = await prisma.sale.findMany({
    where,
    orderBy: { soldAt: "desc" },
  });

  const totalRevenue = sales.reduce((s, x) => s + x.actualSalePrice, 0);
  const totalProfit = sales.reduce((s, x) => s + x.profit, 0);
  const totalShipping = sales.reduce((s, x) => s + x.shippingCost, 0);

  return NextResponse.json({
    sales: sales.map(toSaleDTO),
    summary: {
      count: sales.length,
      totalRevenue,
      totalProfit,
      totalShipping,
    },
  });
}
