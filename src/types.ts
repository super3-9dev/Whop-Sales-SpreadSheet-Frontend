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
