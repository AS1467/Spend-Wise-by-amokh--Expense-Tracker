
import React from "react";
import Layout from "@/components/Layout";
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

const Transactions = () => {
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
          <h1 className="text-2xl font-bold">Transactions</h1>
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
        
        <div className="space-y-2">
          <TransactionList transactions={transactions} />
          
          {transactions.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No transactions found for this period.</p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Your First Transaction
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
