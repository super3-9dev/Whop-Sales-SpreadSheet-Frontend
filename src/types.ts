// API Response Types
export interface DailySalesData {
  date: string;
  totalSales: number;
  totalCash: number;
  averagePerSale: number;
}

export interface SummaryStats {
  totalSales: number;
  totalPaidSales: number;
  totalCash: number;
  averageSaleAmount: number;
  statusBreakdown: Record<string, number>;
}

export interface ReportData {
  dailySales: DailySalesData[];
  summary: SummaryStats;
}

export interface GenerateReportResponse {
  success: boolean;
  message: string;
  data?: ReportData;
  file?: string;
}

// Workflow API Types
export interface Product {
  id: string;
  title: string;
  description?: string;
  visibility: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CheckoutLink {
  id: string;
  planId: string;
  internalName: string;
  title: string;
  price: string;
  currency: string;
  description?: string;
}

export interface TrackedReceipt {
  id: string;
  status: string;
  friendlyStatus: string;
  finalAmount: number;
  settledUsdAmount: number;
  currency: string;
  createdAt: number;
  paidAt?: number;
  plan: {
    id: string;
    title: string;
    formattedPrice: string;
  };
  member: {
    user: {
      id: string;
      username: string;
      name: string;
      email: string;
    };
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface CompleteWorkflowData {
  product: Product;
  checkoutLinks: CheckoutLink[];
  trackingSetup: boolean;
  internalNames: string[];
}

export interface ApiError {
  error: string;
  message?: string;
}

// Component Props Types
export interface DateRangeProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export interface QuickSelectProps {
  onSelect: (days: number) => void;
}

export interface ReportResultsProps {
  reportData: ReportData;
  filename: string;
  onDownload: () => void;
}

// Form Data Types
export interface ReportFormData {
  startDate: string;
  endDate: string;
}
