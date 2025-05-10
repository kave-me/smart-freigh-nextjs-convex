"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Pencil, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";

// Define our types
export type BusinessRule = {
  _id: Id<"businessRules">;
  name: string;
  categoryId: Id<"businessRuleCategories">;
  enabled: boolean;
  fileId?: Id<"_storage">;
  userId: Id<"users">;
};

interface CurrentRuleForm {
  id?: Id<"businessRules">;
  name: string;
  categoryId: Id<"businessRuleCategories"> | "";
  file: File | null;
}

// Skeleton loading component for a category card
function CategoryCardSkeleton() {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex flex-row items-start justify-between p-2">
        <div className="w-3/4">
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton loading for rules list
function RulesSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}

// Component to display business rules for a category
function CategoryRules({
  categoryId,
}: {
  categoryId: Id<"businessRuleCategories">;
}) {
  const rules = useQuery(api.businessRules.getBusinessRulesByCategory, {
    categoryId,
  });
  const deleteRule = useMutation(api.businessRules.deleteBusinessRule);
  const toggleRule = useMutation(api.businessRules.toggleBusinessRule);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteRule = async (ruleId: Id<"businessRules">) => {
    setIsLoading(true);
    try {
      await deleteRule({ ruleId });
      toast.success("Rule deleted successfully");
    } catch (error) {
      toast.error("Failed to delete rule");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRule = async (ruleId: Id<"businessRules">) => {
    setIsLoading(true);
    try {
      await toggleRule({ ruleId });
      toast.success("Rule activated successfully");
    } catch (error) {
      toast.error("Failed to activate rule");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show skeleton while loading rules
  if (rules === undefined) {
    return <RulesSkeleton />;
  }

  if (rules.length === 0) {
    return <p className="text-xs text-muted-foreground">No rules defined</p>;
  }

  return (
    <div className="space-y-2 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-50 rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      {rules.map((rule) => (
        <div
          key={rule._id}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <span className="text-sm">{rule.name}</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteRule(rule._id)}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
            <Switch
              checked={rule.enabled}
              onCheckedChange={() => handleToggleRule(rule._id)}
              disabled={isLoading}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Main component
export default function BusinessRulesTab() {
  // Get categories from Convex
  const categories = useQuery(api.businessRules.getBusinessRuleCategories);
  const isLoadingCategories = categories === undefined;

  // Mutations
  const createCategory = useMutation(
    api.businessRules.createBusinessRuleCategory,
  );
  const updateCategory = useMutation(
    api.businessRules.updateBusinessRuleCategory,
  );
  const deleteCategory = useMutation(
    api.businessRules.deleteBusinessRuleCategory,
  );
  const createRule = useMutation(api.businessRules.createBusinessRule);
  const generateUploadUrl = useMutation(api.businessRules.generateUploadUrl);

  // UI state
  const [editingCategory, setEditingCategory] =
    useState<Id<"businessRuleCategories"> | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [isAddRuleDialogOpen, setIsAddRuleDialogOpen] = useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [currentRule, setCurrentRule] = useState<CurrentRuleForm>({
    name: "",
    categoryId: "",
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddRule = () => {
    setCurrentRule({
      name: "",
      categoryId: "",
      file: null,
    });
    setIsAddRuleDialogOpen(true);
  };

  const handleAddCategory = () => {
    setNewCategory("");
    setIsAddCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (newCategory.trim()) {
      setIsLoading(true);
      try {
        await createCategory({ name: newCategory });
        setIsAddCategoryDialogOpen(false);
        toast.success("Category created successfully");
      } catch (error) {
        toast.error("Failed to create category");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteCategory = async (
    categoryId: Id<"businessRuleCategories">,
  ) => {
    setIsLoading(true);
    try {
      await deleteCategory({ categoryId });
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = (categoryId: Id<"businessRuleCategories">) => {
    const category = categories?.find((cat) => cat._id === categoryId);
    if (category) {
      setEditedCategoryName(category.name);
      setEditingCategory(categoryId);
    }
  };

  const handleSaveEditedCategory = async () => {
    if (editedCategoryName.trim() && editingCategory) {
      setIsLoading(true);
      try {
        await updateCategory({
          categoryId: editingCategory,
          name: editedCategoryName,
        });
        setEditingCategory(null);
        toast.success("Category updated successfully");
      } catch (error) {
        toast.error("Failed to update category");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveRule = async () => {
    if (!currentRule.name.trim() || !currentRule.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      let fileId: Id<"_storage"> | undefined = undefined;

      // Upload file if provided
      if (currentRule.file) {
        const uploadUrl = await generateUploadUrl();

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": currentRule.file.type },
          body: currentRule.file,
        });

        if (!result.ok) {
          throw new Error("Failed to upload file");
        }

        const { storageId } = await result.json();
        fileId = storageId;
      }

      await createRule({
        name: currentRule.name,
        categoryId: currentRule.categoryId,
        fileId,
      });

      setIsAddRuleDialogOpen(false);
      toast.success("Business rule created successfully");
    } catch (error) {
      toast.error("Failed to create business rule");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentRule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentRule((prev) => ({
      ...prev,
      file: e.target.files?.[0] || null,
    }));
  };

  const renderCategories = () => {
    if (isLoadingCategories) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (!categories || categories.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-center text-muted-foreground mb-6">
            No business categories defined
          </p>
          <Button onClick={handleAddCategory} variant="default">
            Add Business Category
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category._id} className="border border-gray-200">
            <CardHeader className="flex flex-row items-start justify-between p-2">
              <div>
                <CardTitle className="text-sm font-medium">
                  {category.name}
                </CardTitle>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCategory(category._id)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditCategory(category._id)}
                  disabled={isLoading}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <CategoryRules categoryId={category._id} />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Business Rules</CardTitle>
        <div className="flex space-x-2">
          <Button
            onClick={handleAddCategory}
            variant="outline"
            size="sm"
            disabled={isLoading || isLoadingCategories}
          >
            Add Business Category
          </Button>
          <Button
            onClick={handleAddRule}
            variant="default"
            size="sm"
            disabled={
              isLoading ||
              isLoadingCategories ||
              (categories && categories.length === 0)
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Business Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Please choose your business rules.
        </p>

        {isLoading && (
          <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 backdrop-blur-[1px]">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span>Processing...</span>
            </div>
          </div>
        )}

        {renderCategories()}

        {/* Add Rule Dialog */}
        <Dialog
          open={isAddRuleDialogOpen}
          onOpenChange={setIsAddRuleDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Business Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input
                  id="ruleName"
                  name="name"
                  placeholder="Enter Rule Name"
                  value={currentRule.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruleCategory">Rule Category</Label>
                <Select
                  onValueChange={(value: string) =>
                    setCurrentRule((prev) => ({
                      ...prev,
                      categoryId: value as Id<"businessRuleCategories">,
                    }))
                  }
                  value={currentRule.categoryId}
                  disabled={!categories || categories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rule category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories &&
                      categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Upload only xlsx files with a size less than 500KB
                </p>
                <div className="flex space-x-2">
                  <Label
                    htmlFor="file-upload"
                    className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-md cursor-pointer"
                  >
                    Upload File
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".xlsx"
                  />
                  {currentRule.file && (
                    <span className="text-sm">{currentRule.file.name}</span>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddRuleDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveRule} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog
          open={isAddCategoryDialogOpen}
          onOpenChange={setIsAddCategoryDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Business Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  placeholder="Enter Category Name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddCategoryDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveCategory} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Category Name</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editCategoryName">Category Name</Label>
                <Input
                  id="editCategoryName"
                  value={editedCategoryName}
                  onChange={(e) => setEditedCategoryName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingCategory(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEditedCategory} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
