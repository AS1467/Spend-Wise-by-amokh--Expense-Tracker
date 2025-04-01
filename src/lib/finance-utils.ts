
import { Transaction, Category, ChartData, NeedWantType } from "@/types";

export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

export const calculateBalance = (transactions: Transaction[]): number => {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

export const calculateCategoryTotals = (
  transactions: Transaction[],
  categories: Category[]
): Record<string, number> => {
  return transactions.reduce((totals: Record<string, number>, transaction) => {
    const categoryId = transaction.categoryId;
    if (!totals[categoryId]) totals[categoryId] = 0;
    totals[categoryId] += transaction.amount;
    return totals;
  }, {});
};

export const getCategoryExpenseData = (
  transactions: Transaction[],
  categories: Category[]
): ChartData => {
  // Filter expense transactions
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  // Calculate totals by category
  const categoryTotals = calculateCategoryTotals(expenseTransactions, categories);
  
  // Sort categories by total amount (descending)
  const sortedCategoryIds = Object.keys(categoryTotals).sort(
    (a, b) => categoryTotals[b] - categoryTotals[a]
  );
  
  // Get labels and data for chart
  const labels = sortedCategoryIds.map(
    id => categories.find(c => c.id === id)?.name || 'Unknown'
  );
  
  const data = sortedCategoryIds.map(id => categoryTotals[id]);
  
  // Generate random colors for chart
  const backgroundColor = sortedCategoryIds.map(() => 
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
  );
  
  return {
    labels,
    datasets: [
      {
        label: 'Expenses by Category',
        data,
        backgroundColor,
      },
    ],
  };
};

export const getNeedWantData = (transactions: Transaction[]): ChartData => {
  // Filter expense transactions
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  // Calculate totals for needs and wants
  const needTotal = expenseTransactions
    .filter(t => t.needWant === 'need')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const wantTotal = expenseTransactions
    .filter(t => t.needWant === 'want')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    labels: ['Need', 'Want'],
    datasets: [
      {
        label: 'Need vs Want',
        data: [needTotal, wantTotal],
        backgroundColor: ['hsl(252, 56%, 57%)', 'hsl(25, 95%, 53%)'],
      },
    ],
  };
};

export const getTopExpenseCategories = (
  transactions: Transaction[],
  categories: Category[],
  limit: number = 5
): { category: Category; amount: number }[] => {
  // Filter expense transactions
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  // Calculate totals by category
  const categoryTotals = calculateCategoryTotals(expenseTransactions, categories);
  
  // Map to array of { category, amount } and sort
  return Object.keys(categoryTotals)
    .map(id => ({
      category: categories.find(c => c.id === id) as Category,
      amount: categoryTotals[id],
    }))
    .filter(item => !!item.category) // Filter out any undefined categories
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};

export const checkCategoryLimits = (
  transactions: Transaction[],
  categories: Category[]
): { category: Category; amount: number; exceeded: boolean }[] => {
  // Filter expense transactions
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  // Calculate totals by category
  const categoryTotals = calculateCategoryTotals(expenseTransactions, categories);
  
  // Check which categories with limits have exceeded them
  return categories
    .filter(category => category.type === 'expense' && typeof category.limit === 'number')
    .map(category => ({
      category,
      amount: categoryTotals[category.id] || 0,
      exceeded: (categoryTotals[category.id] || 0) > (category.limit || 0),
    }));
};
