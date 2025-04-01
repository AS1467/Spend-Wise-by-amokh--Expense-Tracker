
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CategoryList from "@/components/category/CategoryList";
import CategoryForm from "@/components/category/CategoryForm";
import { useUserSettings } from "@/hooks/useUserSettings";

const Settings = () => {
  const { settings, updateName, updateCurrency } = useUserSettings();
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "INR", name: "Indian Rupee" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CNY", name: "Chinese Yuan" },
  ];

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-medium mb-2">User Settings</h2>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Your Name</Label>
                  <Input
                    id="user-name"
                    placeholder="Enter your name"
                    value={settings.name}
                    onChange={(e) => updateName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={settings.currency} 
                    onValueChange={updateCurrency}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
