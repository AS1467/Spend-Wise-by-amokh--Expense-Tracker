
import React from "react";
import Layout from "@/components/Layout";
import BalanceCard from "@/components/dashboard/BalanceCard";
import NeedWantCard from "@/components/dashboard/NeedWantCard";
import TopCategoriesCard from "@/components/dashboard/TopCategoriesCard";
import { TimeframeSelector } from "@/components/ui/time-frame-selector";
import { useFinance } from "@/context/FinanceContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import TransactionForm from "@/components/transaction/TransactionForm";
import TransactionList from "@/components/transaction/TransactionList";

const Index = () => {
  const { 
    selectedTimeframe,
    timeframes,
    setSelectedTimeframeType,
    setCustomDateRange,
    getTransactionsInTimeframe,
  } = useFinance();
  
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  
  const transactions = getTransactionsInTimeframe(selectedTimeframe);
  
  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
              </DialogHeader>
              <TransactionForm
                onSubmit={() => setAddDialogOpen(false)}
                onCancel={() => setAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <TimeframeSelector
          timeframes={timeframes}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframeType}
          onCustomDateChange={(start, end) => setCustomDateRange({ start, end })}
        />
        
        <BalanceCard />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NeedWantCard />
          <TopCategoriesCard />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <TransactionList transactions={transactions.slice(0, 5)} />
          
          {transactions.length > 5 && (
            <div className="text-center pt-2">
              <Button variant="link" asChild>
                <a href="/transactions">View all transactions</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
