
import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, getTopExpenseCategories } from "@/lib/finance-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TopCategoriesCard = () => {
  const { selectedTimeframe, getTransactionsInTimeframe, categories } = useFinance();
  const transactions = getTransactionsInTimeframe(selectedTimeframe);
  
  const topCategories = getTopExpenseCategories(transactions, categories, 5);
  
  // Calculate max amount for progress bars
  const maxAmount = topCategories.length > 0 ? topCategories[0].amount : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {topCategories.length > 0 ? (
          <div className="space-y-4">
            {topCategories.map((item) => (
              <div key={item.category.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{item.category.name}</span>
                  <span>{formatCurrency(item.amount)}</span>
                </div>
                <Progress
                  value={(item.amount / maxAmount) * 100}
                  className="h-2"
                  indicatorClassName="bg-primary"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No expense data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopCategoriesCard;
