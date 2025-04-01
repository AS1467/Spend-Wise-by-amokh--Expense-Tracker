
import React from "react";
import Layout from "@/components/Layout";
import { TimeframeSelector } from "@/components/ui/time-frame-selector";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  formatCurrency,
  getCategoryExpenseData,
  getNeedWantData,
  checkCategoryLimits,
} from "@/lib/finance-utils";
import { Progress } from "@/components/ui/progress";
import { AlertTriangleIcon } from "lucide-react";

const COLORS = [
  "#3498db",
  "#e74c3c",
  "#2ecc71",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#34495e",
];

const Insights = () => {
  const {
    selectedTimeframe,
    timeframes,
    setSelectedTimeframeType,
    setCustomDateRange,
    getTransactionsInTimeframe,
    categories,
  } = useFinance();

  const transactions = getTransactionsInTimeframe(selectedTimeframe);
  
  // Category expense data
  const categoryData = getCategoryExpenseData(transactions, categories);
  const formattedCategoryData = categoryData.labels.map((label, index) => ({
    name: label,
    value: categoryData.datasets[0].data[index],
  }));

  // Need vs want data
  const needWantData = getNeedWantData(transactions);
  const formattedNeedWantData = needWantData.labels.map((label, index) => ({
    name: label,
    value: needWantData.datasets[0].data[index],
    color: needWantData.datasets[0].backgroundColor[index],
  }));

  // Category limits
  const categoryLimits = checkCategoryLimits(transactions, categories);
  const exceededCategories = categoryLimits.filter((item) => item.exceeded);

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Insights</h1>
        
        <TimeframeSelector
          timeframes={timeframes}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframeType}
          onCustomDateChange={(start, end) => setCustomDateRange({ start, end })}
        />
        
        {transactions.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">
              No transaction data available for this period.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {formattedCategoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={formattedCategoryData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), "Amount"]} />
                      <Legend />
                      <Bar dataKey="value" fill="#3498db">
                        {formattedCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">No expense data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need vs Want Spending</CardTitle>
              </CardHeader>
              <CardContent>
                {formattedNeedWantData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={formattedNeedWantData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {formattedNeedWantData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(value as number), "Amount"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">No expense data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {exceededCategories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-destructive">
                    <AlertTriangleIcon className="h-5 w-5 mr-2" />
                    Budget Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exceededCategories.map((item) => (
                      <div key={item.category.id}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{item.category.name}</span>
                          <span>
                            {formatCurrency(item.amount)} / {formatCurrency(item.category.limit || 0)}
                          </span>
                        </div>
                        <Progress
                          value={((item.amount / (item.category.limit || 1)) * 100)}
                          className="h-2"
                          indicatorClassName="bg-destructive"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Insights;
