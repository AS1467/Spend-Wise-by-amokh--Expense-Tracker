
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useFinance } from "@/context/FinanceContext";
import { Transaction, Category, TransactionType, NeedWantType } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: () => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onCancel,
}) => {
  const { categories, addTransaction, updateTransaction } = useFinance();
  
  const [type, setType] = useState<TransactionType>(transaction?.type || "expense");
  const [amount, setAmount] = useState(transaction?.amount.toString() || "");
  const [categoryId, setCategoryId] = useState(transaction?.categoryId || "");
  const [date, setDate] = useState<Date>(transaction?.date ? new Date(transaction.date) : new Date());
  const [needWant, setNeedWant] = useState<NeedWantType>(transaction?.needWant || "need");
  const [note, setNote] = useState(transaction?.note || "");
  
  // Filter categories based on selected type
  const filteredCategories = categories.filter(
    (category) => category.type === type
  );
  
  // Set first category as default when type changes
  useEffect(() => {
    if (filteredCategories.length > 0 && !filteredCategories.some(c => c.id === categoryId)) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [type, filteredCategories, categoryId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      id: transaction?.id || "",
      amount: parseFloat(amount),
      type,
      categoryId,
      date: date.toISOString(),
      needWant: type === "income" ? null : needWant,
      note,
    };
    
    if (transaction?.id) {
      updateTransaction(transactionData as Transaction);
    } else {
      addTransaction(transactionData);
    }
    
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant={type === "expense" ? "default" : "outline"}
          onClick={() => setType("expense")}
          className="w-full"
        >
          Expense
        </Button>
        <Button
          type="button"
          variant={type === "income" ? "default" : "outline"}
          onClick={() => setType("income")}
          className="w-full"
        >
          Income
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="text-xl"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={categoryId}
          onValueChange={setCategoryId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {type === "expense" && (
        <div className="space-y-2">
          <Label>Type</Label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={needWant === "need" ? "default" : "outline"}
              onClick={() => setNeedWant("need")}
              className={cn(
                "w-full",
                needWant === "need" ? "bg-need text-need-foreground" : ""
              )}
            >
              Need
            </Button>
            <Button
              type="button"
              variant={needWant === "want" ? "default" : "outline"}
              onClick={() => setNeedWant("want")}
              className={cn(
                "w-full",
                needWant === "want" ? "bg-want text-want-foreground" : ""
              )}
            >
              Want
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="note">Note (Optional)</Label>
        <Textarea
          id="note"
          placeholder="Add a note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full"
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full">
          {transaction?.id ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
