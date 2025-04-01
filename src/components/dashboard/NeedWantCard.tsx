
import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { getNeedWantData } from "@/lib/finance-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useUserSettings } from "@/hooks/useUserSettings";

const COLORS = ["hsl(252, 56%, 57%)", "hsl(25, 95%, 53%)"];
const LABELS = ["Need", "Want"];

const NeedWantCard = () => {
  const { selectedTimeframe, getTransactionsInTimeframe } = useFinance();
  const { formatCurrency } = useUserSettings();
  const transactions = getTransactionsInTimeframe(selectedTimeframe);
  
  const chartData = getNeedWantData(transactions).datasets[0].data.map((value, index) => ({
    name: LABELS[index],
    value,
  }));
  
  const totalNeeds = chartData[0]?.value || 0;
  const totalWants = chartData[1]?.value || 0;
  const totalExpenses = totalNeeds + totalWants;
  const needsPercentage = totalExpenses > 0 ? Math.round((totalNeeds / totalExpenses) * 100) : 0;
  const wantsPercentage = totalExpenses > 0 ? Math.round((totalWants / totalExpenses) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Needs vs Wants</CardTitle>
      </CardHeader>
      <CardContent>
        {totalExpenses > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatCurrency(value), "Amount"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-need font-medium">Needs</div>
                <div className="text-lg font-medium">{formatCurrency(totalNeeds)}</div>
                <div className="text-xs text-muted-foreground">{needsPercentage}% of expenses</div>
              </div>
              <div>
                <div className="text-want font-medium">Wants</div>
                <div className="text-lg font-medium">{formatCurrency(totalWants)}</div>
                <div className="text-xs text-muted-foreground">{wantsPercentage}% of expenses</div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">No expense data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NeedWantCard;
