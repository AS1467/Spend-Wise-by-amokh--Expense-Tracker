
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, calculateTotalIncome, calculateTotalExpenses, calculateBalance } from "@/lib/finance-utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

const BalanceCard = () => {
  const { selectedTimeframe, getTransactionsInTimeframe } = useFinance();
  const transactions = getTransactionsInTimeframe(selectedTimeframe);
  
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const balance = calculateBalance(transactions);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Balance</CardTitle>
        <CardDescription>{selectedTimeframe.label}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="flex items-center text-success mb-1">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              Income
            </div>
            <div className="text-xl font-medium">{formatCurrency(totalIncome)}</div>
          </div>
          <div>
            <div className="flex items-center text-destructive mb-1">
              <ArrowDownIcon className="h-4 w-4 mr-1" />
              Expenses
            </div>
            <div className="text-xl font-medium">{formatCurrency(totalExpenses)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
