
import React, { createContext, useContext, useState, useEffect } from "react";
import { Category, Transaction, Timeframe, TimeframeType, DateRange } from "@/types";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subWeeks, subMonths, subYears } from "date-fns";

// Default categories
const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', type: 'income' },
  { id: 'business', name: 'Business', type: 'income' },
  { id: 'loan', name: 'Loan', type: 'income' },
  { id: 'gift', name: 'Gift', type: 'income' },
  { id: 'other-income', name: 'Other', type: 'income' }
];

const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'rent', name: 'Rent', type: 'expense' },
  { id: 'fees', name: 'Fees', type: 'expense' },
  { id: 'groceries', name: 'Groceries', type: 'expense' },
  { id: 'food', name: 'Food', type: 'expense' },
  { id: 'transport', name: 'Transport', type: 'expense' },
  { id: 'fuel', name: 'Fuel', type: 'expense' },
  { id: 'shopping', name: 'Shopping', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense' },
  { id: 'utilities', name: 'Utilities', type: 'expense' },
  { id: 'education', name: 'Education', type: 'expense' },
  { id: 'other-expense', name: 'Other', type: 'expense' }
];

const DEFAULT_CATEGORIES = [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES];

// Default timeframes
const getDefaultTimeframes = (): Record<TimeframeType, Timeframe> => {
  const now = new Date();
  
  return {
    day: {
      type: 'day',
      label: 'Today',
      dateRange: {
        start: startOfDay(now),
        end: endOfDay(now)
      }
    },
    week: {
      type: 'week',
      label: 'This Week',
      dateRange: {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 })
      }
    },
    month: {
      type: 'month',
      label: 'This Month',
      dateRange: {
        start: startOfMonth(now),
        end: endOfMonth(now)
      }
    },
    year: {
      type: 'year',
      label: 'This Year',
      dateRange: {
        start: startOfYear(now),
        end: endOfYear(now)
      }
    },
    custom: {
      type: 'custom',
      label: 'Custom',
      dateRange: {
        start: subDays(now, 30),
        end: now
      }
    }
  };
};

// Context interface
interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  selectedTimeframe: Timeframe;
  timeframes: Record<TimeframeType, Timeframe>;
  
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  
  setSelectedTimeframeType: (type: TimeframeType) => void;
  setCustomDateRange: (dateRange: DateRange) => void;
  
  getTransactionsInTimeframe: (timeframe: Timeframe) => Transaction[];
  getCategoryById: (id: string) => Category | undefined;
}

// Create context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Provider component
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  
  const [timeframes, setTimeframes] = useState(getDefaultTimeframes());
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>(timeframes.month);
  
  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);
  
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);
  
  // Helper function to generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);
  
  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: generateId() };
    setTransactions(prev => [...prev, newTransaction]);
  };
  
  const updateTransaction = (transaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
  };
  
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  // Category functions
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: generateId() };
    setCategories(prev => [...prev, newCategory]);
  };
  
  const updateCategory = (category: Category) => {
    setCategories(prev => prev.map(c => c.id === category.id ? category : c));
  };
  
  const deleteCategory = (id: string) => {
    // Check if there are transactions with this category
    const hasTransactions = transactions.some(t => t.categoryId === id);
    if (hasTransactions) {
      alert("Cannot delete category that is used in transactions");
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };
  
  // Timeframe functions
  const setSelectedTimeframeType = (type: TimeframeType) => {
    setSelectedTimeframe(timeframes[type]);
  };
  
  const setCustomDateRange = (dateRange: DateRange) => {
    const updatedTimeframes = {
      ...timeframes,
      custom: {
        ...timeframes.custom,
        dateRange
      }
    };
    setTimeframes(updatedTimeframes);
    setSelectedTimeframe(updatedTimeframes.custom);
  };
  
  // Helper functions
  const getTransactionsInTimeframe = (timeframe: Timeframe) => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= timeframe.dateRange.start && transactionDate <= timeframe.dateRange.end;
    });
  };
  
  const getCategoryById = (id: string) => {
    return categories.find(c => c.id === id);
  };
  
  const value = {
    transactions,
    categories,
    selectedTimeframe,
    timeframes,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    setSelectedTimeframeType,
    setCustomDateRange,
    getTransactionsInTimeframe,
    getCategoryById
  };
  
  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
