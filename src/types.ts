
export type TransactionType = 'income' | 'expense';
export type NeedWantType = 'need' | 'want' | null; // null for income

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
  limit?: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string; // ISO date string
  needWant: NeedWantType;
  note?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type TimeframeType = 'day' | 'week' | 'month' | 'year' | 'custom';

export interface Timeframe {
  type: TimeframeType;
  label: string;
  dateRange: DateRange;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}
