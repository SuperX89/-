import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toProductDTO, toSaleDTO } from "@/lib/mappers";

export async function GET() {
  const [products, sales] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.sale.findMany({ orderBy: { soldAt: "desc" } }),
  ]);

  const available = products.filter((p) => p.status === "available");
  const reserved = products.filter((p) => p.status === "reserved");
  const sold = products.filter((p) => p.status === "sold");
  const draft = products.filter((p) => p.status === "draft");
  const inStock = [...available, ...reserved, ...sold];

  const totalRevenue = sales.reduce((s, x) => s + x.actualSalePrice, 0);
  const totalProfit = sales.reduce((s, x) => s + x.profit, 0);
  const unsold = [...available, ...reserved];
  const unsoldCostValue = unsold.reduce((s, p) => s + p.costPrice, 0);
  const draftCostValue = draft.reduce((s, p) => s + p.costPrice, 0);

  const recentSales = sales.slice(0, 5).map(toSaleDTO);
  const reservedProducts = reserved.map(toProductDTO);
  const recentAvailable = available.slice(0, 5).map(toProductDTO);
  const draftProducts = draft.slice(0, 8).map(toProductDTO);

  const pendingShipping = sales.filter((s) => s.shippingStatus === "pending").length;
  const shippedCount = sales.filter((s) => s.shippingStatus === "shipped").length;

  return NextResponse.json({
    totalProducts: inStock.length,
    available: available.length,
    reserved: reserved.length,
    sold: sold.length,
    draft: draft.length,
    totalRevenue,
    totalProfit,
    unsoldCostValue,
    unsoldCount: unsold.length,
    draftCostValue,
    pendingShipping,
    shippedCount,
    recentSales,
    reservedProducts,
    recentAvailable,
    draftProducts,
  });
}
