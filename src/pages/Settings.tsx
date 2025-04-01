
import React, { useState } from "react";
import Layout from "@/components/Layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CategoryList from "@/components/category/CategoryList";
import CategoryForm from "@/components/category/CategoryForm";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-medium mb-2">Appearance</h2>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <Switch
                    id="dark-mode"
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Categories</h2>
              <Dialog open={addCategoryDialogOpen} onOpenChange={setAddCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                  </DialogHeader>
                  <CategoryForm
                    onSubmit={() => setAddCategoryDialogOpen(false)}
                    onCancel={() => setAddCategoryDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <Tabs defaultValue="expense">
              <TabsList className="w-full">
                <TabsTrigger value="expense" className="flex-1">
                  Expenses
                </TabsTrigger>
                <TabsTrigger value="income" className="flex-1">
                  Income
                </TabsTrigger>
              </TabsList>
              <TabsContent value="expense" className="mt-2">
                <CategoryList type="expense" />
              </TabsContent>
              <TabsContent value="income" className="mt-2">
                <CategoryList type="income" />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    </Layout>
  );
};

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export default Settings;
