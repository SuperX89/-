import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MONTH_LABELS_TH = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET() {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const start12 = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [sales, products] = await Promise.all([
    prisma.sale.findMany({
      where: { soldAt: { gte: start12 } },
      orderBy: { soldAt: "asc" },
    }),
    prisma.product.findMany({
      where: { status: { in: ["available", "reserved"] } },
    }),
  ]);

  // Build 12-month buckets (even if empty)
  const byMonth = new Map<
    string,
    {
      month: string;
      monthLabel: string;
      revenue: number;
      profit: number;
      shipping: number;
      cost: number;
      count: number;
    }
  >();

  for (let i = 0; i < 12; i++) {
    const d = new Date(start12.getFullYear(), start12.getMonth() + i, 1);
    const key = monthKey(d);
    byMonth.set(key, {
      month: key,
      monthLabel: MONTH_LABELS_TH[d.getMonth()],
      revenue: 0,
      profit: 0,
      shipping: 0,
      cost: 0,
      count: 0,
    });
  }

  for (const s of sales) {
    const key = monthKey(s.soldAt);
    const b = byMonth.get(key);
    if (!b) continue;
    b.revenue += s.actualSalePrice;
    b.profit += s.profit;
    b.shipping += s.shippingCost;
    b.cost += s.snapshotCostPrice;
    b.count += 1;
  }

  const months = Array.from(byMonth.values());
  const thisKey = monthKey(now);
  const lastKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const thisMonth = byMonth.get(thisKey)!;
  const lastMonth = byMonth.get(lastKey)!;

  // Best month + average (only count months with sales)
  const monthsWithSales = months.filter((m) => m.count > 0);
  const bestMonth = [...monthsWithSales].sort((a, b) => b.profit - a.profit)[0] ?? null;
  const avgProfit =
    monthsWithSales.length > 0
      ? Math.round(monthsWithSales.reduce((s, m) => s + m.profit, 0) / monthsWithSales.length)
      : 0;
  const avgRevenue =
    monthsWithSales.length > 0
      ? Math.round(monthsWithSales.reduce((s, m) => s + m.revenue, 0) / monthsWithSales.length)
      : 0;

  // Category breakdown (all-time from sales joined with current product category — fallback to snapshot)
  // Sales don't store category, so we re-query and look up
  const productCategories = new Map(
    products.map((p) => [p.id, p.category])
  );
  // For sold products, look up via productId in another query
  const productIds = Array.from(new Set(sales.map((s) => s.productId)));
  const soldProducts = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, category: true },
      })
    : [];
  for (const p of soldProducts) productCategories.set(p.id, p.category);

  const byCategory = new Map<string, { count: number; revenue: number; profit: number }>();
  for (const s of sales) {
    const cat = productCategories.get(s.productId) ?? "other";
    const b = byCategory.get(cat) ?? { count: 0, revenue: 0, profit: 0 };
    b.count += 1;
    b.revenue += s.actualSalePrice;
    b.profit += s.profit;
    byCategory.set(cat, b);
  }
  const categories = Array.from(byCategory.entries())
    .map(([category, v]) => ({ category, ...v }))
    .sort((a, b) => b.profit - a.profit);

  // Compare this vs last
  function pctChange(current: number, prev: number): number | null {
    if (prev === 0) return current > 0 ? 100 : null;
    return Math.round(((current - prev) / Math.abs(prev)) * 100);
  }

  return NextResponse.json({
    months,
    thisMonth: {
      ...thisMonth,
      label: `${MONTH_LABELS_TH[now.getMonth()]} ${now.getFullYear() + 543}`,
    },
    lastMonth,
    compare: {
      revenueChange: pctChange(thisMonth.revenue, lastMonth.revenue),
      profitChange: pctChange(thisMonth.profit, lastMonth.profit),
      countChange: pctChange(thisMonth.count, lastMonth.count),
    },
    bestMonth,
    avgProfit,
    avgRevenue,
    categories,
    totalAllMonths: {
      revenue: months.reduce((s, m) => s + m.revenue, 0),
      profit: months.reduce((s, m) => s + m.profit, 0),
      count: months.reduce((s, m) => s + m.count, 0),
    },
  });
}
