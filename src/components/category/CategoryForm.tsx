
import React, { useState } from "react";
import { Category, TransactionType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinance } from "@/context/FinanceContext";

interface CategoryFormProps {
  category?: Category;
  onSubmit: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
}) => {
  const { addCategory, updateCategory } = useFinance();

  const [name, setName] = useState(category?.name || "");
  const [type, setType] = useState<TransactionType>(category?.type || "expense");
  const [limit, setLimit] = useState<string>(
    category?.limit ? category.limit.toString() : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const categoryData = {
      id: category?.id || "",
      name,
      type,
      limit: limit ? parseFloat(limit) : undefined,
    };

    if (category?.id) {
      updateCategory(categoryData as Category);
    } else {
      addCategory(categoryData);
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={(value) => setType(value as TransactionType)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {type === "expense" && (
        <div className="space-y-2">
          <Label htmlFor="limit">Monthly Limit (Optional)</Label>
          <Input
            id="limit"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full">
          Cancel
        </Button>
        <Button type="submit" className="w-full">
          {category?.id ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
