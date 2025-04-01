
import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { Category, TransactionType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2Icon, PencilIcon } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";
import CategoryForm from "./CategoryForm";

interface CategoryListProps {
  type: TransactionType;
}

const CategoryList: React.FC<CategoryListProps> = ({ type }) => {
  const { categories, deleteCategory } = useFinance();
  const { formatCurrency } = useUserSettings();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | undefined>(undefined);

  // Filter categories by type
  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  if (filteredCategories.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredCategories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between p-3 bg-card rounded-lg border"
        >
          <div>
            <p className="font-medium">{category.name}</p>
            {category.limit !== undefined && (
              <p className="text-xs text-muted-foreground">
                Monthly Limit: {formatCurrency(category.limit)}
              </p>
            )}
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(category)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(category.id)}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={selectedCategory}
            onSubmit={() => setDialogOpen(false)}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryList;
