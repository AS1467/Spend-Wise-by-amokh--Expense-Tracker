
import React from "react";
import { format } from "date-fns";
import { useFinance } from "@/context/FinanceContext";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2Icon, PencilIcon } from "lucide-react";
import TransactionForm from "./TransactionForm";

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const { getCategoryById, deleteTransaction } = useFinance();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | undefined>(undefined);

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = format(new Date(transaction.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-2">
          <h3 className="sticky top-0 bg-background py-2 text-sm font-medium">
            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
          </h3>
          <div className="space-y-2">
            {groupedTransactions[date].map((transaction) => {
              const category = getCategoryById(transaction.categoryId);
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-card rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-10 rounded-full ${transaction.type === 'income' ? 'bg-success' : transaction.needWant === 'need' ? 'bg-need' : 'bg-want'}`} />
                    <div>
                      <p className="font-medium">{category?.name}</p>
                      <p className="text-xs text-muted-foreground">{transaction.note || 'No note'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className={`font-medium mr-4 ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(transaction)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={selectedTransaction}
            onSubmit={() => setDialogOpen(false)}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionList;
