export type ProductDTO = {
  id: string;
  name: string;
  images: string[];
  coverImage: string | null;
  category: string;
  condition: string;
  costPrice: number;
  sellingPrice: number;
  status: string;
  note: string | null;
  reservation: {
    customerName: string;
    contact: string;
    reservedAt: string;
    note: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type SaleDTO = {
  id: string;
  productId: string;
  snapshotName: string;
  snapshotImage: string | null;
  snapshotCostPrice: number;
  actualSalePrice: number;
  shippingCost: number;
  profit: number;
  soldAt: string;
  customerName: string | null;
  contact: string | null;
  trackingNumber: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DashboardSummary = {
  totalProducts: number;
  available: number;
  reserved: number;
  sold: number;
  totalRevenue: number;
  totalProfit: number;
  unsoldCostValue: number;
  unsoldCount: number;
  recentSales: SaleDTO[];
  reservedProducts: ProductDTO[];
  recentAvailable: ProductDTO[];
};
