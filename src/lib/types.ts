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
  shippingStatus: string;
  shippingProvider: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MonthlyBucket = {
  month: string;
  monthLabel: string;
  revenue: number;
  profit: number;
  shipping: number;
  cost: number;
  count: number;
};

export type TopSale = {
  id: string;
  productId: string;
  name: string;
  image: string | null;
  category: string;
  revenue: number;
  profit: number;
  cost: number;
  soldAt: string;
  daysToSell: number | null;
};

export type AnalyticsSummary = {
  months: MonthlyBucket[];
  thisMonth: MonthlyBucket & { label: string };
  lastMonth: MonthlyBucket;
  compare: {
    revenueChange: number | null;
    profitChange: number | null;
    countChange: number | null;
  };
  bestMonth: MonthlyBucket | null;
  avgProfit: number;
  avgRevenue: number;
  avgProfitPerItem: number;
  avgDaysToSell: number;
  fastestDays: number | null;
  slowestDays: number | null;
  overallMargin: number;
  thisMonthMargin: number;
  lastMonthMargin: number;
  topSales: TopSale[];
  categories: { category: string; count: number; revenue: number; profit: number }[];
  totalAllMonths: { revenue: number; profit: number; count: number };
};

export type DashboardSummary = {
  totalProducts: number;
  available: number;
  reserved: number;
  sold: number;
  draft: number;
  totalRevenue: number;
  totalProfit: number;
  unsoldCostValue: number;
  unsoldCount: number;
  draftCostValue: number;
  pendingShipping: number;
  shippedCount: number;
  recentSales: SaleDTO[];
  reservedProducts: ProductDTO[];
  recentAvailable: ProductDTO[];
  draftProducts: ProductDTO[];
};
