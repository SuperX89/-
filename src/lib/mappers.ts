import type { Product, Sale } from "@prisma/client";
import type { ProductDTO, SaleDTO } from "./types";

export function toProductDTO(p: Product): ProductDTO {
  let images: string[] = [];
  try {
    images = JSON.parse(p.images);
    if (!Array.isArray(images)) images = [];
  } catch {
    images = [];
  }

  return {
    id: p.id,
    name: p.name,
    images,
    coverImage: p.coverImage,
    category: p.category,
    condition: p.condition,
    costPrice: p.costPrice,
    sellingPrice: p.sellingPrice,
    status: p.status,
    note: p.note,
    reservation:
      p.reservationCustomerName && p.reservationAt
        ? {
            customerName: p.reservationCustomerName,
            contact: p.reservationContact ?? "",
            reservedAt: p.reservationAt.toISOString(),
            note: p.reservationNote,
          }
        : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export function toSaleDTO(s: Sale): SaleDTO {
  return {
    id: s.id,
    productId: s.productId,
    snapshotName: s.snapshotName,
    snapshotImage: s.snapshotImage,
    snapshotCostPrice: s.snapshotCostPrice,
    actualSalePrice: s.actualSalePrice,
    shippingCost: s.shippingCost,
    profit: s.profit,
    soldAt: s.soldAt.toISOString(),
    customerName: s.customerName,
    contact: s.contact,
    trackingNumber: s.trackingNumber,
    note: s.note,
    shippingStatus: s.shippingStatus,
    shippingProvider: s.shippingProvider,
    shippedAt: s.shippedAt ? s.shippedAt.toISOString() : null,
    deliveredAt: s.deliveredAt ? s.deliveredAt.toISOString() : null,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}
