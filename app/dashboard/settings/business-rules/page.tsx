'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Define interfaces for our data types
interface BusinessRule {
  id: string;
  name: string;
  enabled: boolean;
}

interface BusinessCategory {
  id: string;
  name: string;
  rules: BusinessRule[];
}

interface CurrentRuleForm {
  id: string;
  name: string;
  category: string;
  enabled?: boolean;
  file: File | null;
}

// Example initial rules
const initialCategories: BusinessCategory[] = [
  {
    id: '1',
    name: 'Warranty',
    rules: [
      { id: '101', name: 'Rule 2025', enabled: true },
      { id: '102', name: 'Rule 2023', enabled: false },
      { id: '103', name: 'Rule 2022', enabled: false }
    ]
  },
  {
    id: '2',
    name: 'Part and Labor',
    rules: [
      { id: '201', name: 'parts 2025', enabled: true }
    ]
  },
  {
    id: '3',
    name: 'ETC',
    rules: []
  }
];

export default function BusinessRulesTab() {
  // Use initialCategories as the default state
  const [categories, setCategories] = useState<BusinessCategory[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [isAddRuleDialogOpen, setIsAddRuleDialogOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<CurrentRuleForm>({
    id: '',
    name: '',
    category: '',
    enabled: true,
    file: null
  });
  const [newCategory, setNewCategory] = useState('');
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);

  const handleAddRule = () => {
    setCurrentRule({
      id: '',
      name: '',
      category: '',
      enabled: true,
      file: null
    });
    setIsAddRuleDialogOpen(true);
  };

  const handleAddCategory = () => {
    setNewCategory('');
    setIsAddCategoryDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (newCategory.trim()) {
      const newCat: BusinessCategory = {
        id: Date.now().toString(),
        name: newCategory,
        rules: []
      };
      setCategories([...categories, newCat]);
      setIsAddCategoryDialogOpen(false);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setEditedCategoryName(category.name);
      setEditingCategory(categoryId);
    }
  };

  const handleSaveEditedCategory = () => {
    if (editedCategoryName.trim() && editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory
          ? {...cat, name: editedCategoryName}
          : cat
      ));
      setEditingCategory(null);
    }
  };

  const handleSaveRule = () => {
    if (currentRule.name.trim() && currentRule.category) {
      const newRule: BusinessRule = {
        id: Date.now().toString(),
        name: currentRule.name,
        enabled: currentRule.enabled || false
      };
      
      setCategories(categories.map(cat => 
        cat.id === currentRule.category 
          ? {...cat, rules: [...cat.rules, newRule]} 
          : cat
      ));
      setIsAddRuleDialogOpen(false);
    }
  };

  const handleDeleteRule = (categoryId: string, ruleId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    if (category.rules.length === 1) {
      toast.error('Cannot delete the last rule in a category');
      return;
    }

    const deletedRule = category.rules.find(rule => rule.id === ruleId);
    const wasActive = deletedRule?.enabled;
    
    // Filter out deleted rule
    let newRules = category.rules.filter(rule => rule.id !== ruleId);

    // Activate most recent inactive rule if deleting active rule
    if (wasActive) {
      const sortedRules = [...newRules].sort((a, b) => parseInt(b.id) - parseInt(a.id));
      const ruleToActivate = sortedRules.find(rule => !rule.enabled) || sortedRules[0];
      
      if (ruleToActivate) {
        newRules = newRules.map(rule => 
          rule.id === ruleToActivate.id ? { ...rule, enabled: true } : rule
        );
        toast.success(`Activated ${ruleToActivate.name} as new active rule`);
      }
    }

    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, rules: newRules } : cat
    ));
  };

  const handleToggleRule = (categoryId: string, ruleId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? {
        ...cat,
        rules: cat.rules.map(rule => 
          rule.id === ruleId 
            ? {...rule, enabled: true} 
            : {...rule, enabled: false}
        )
      } : cat
    ));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentRule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentRule(prev => ({
      ...prev,
      file: e.target.files?.[0] || null
    }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Business Rules</CardTitle>
        <div className="flex space-x-2">
          <Button onClick={handleAddCategory} variant="outline" size="sm">
            Add Business Category
          </Button>
          <Button onClick={handleAddRule} variant="default" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Business Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">Please choose your business rules.</p>
        
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-center text-muted-foreground mb-6">No business categories defined</p>
            <Button onClick={handleAddCategory} variant="default">
              Add Business Category
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="border border-gray-200">
                <CardHeader className="flex flex-row items-start justify-between p-2">
                  <div>
                    <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditCategory(category.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  {category.rules.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No rules defined</p>
                  ) : (
                    <div className="space-y-2">
                      {category.rules.map((rule) => (
                        <div key={rule.id} className="flex items-center justify-between rounded-lg border p-3">
                          <span className="text-sm">{rule.name}</span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRule(category.id, rule.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            <Switch 
                              checked={rule.enabled} 
                              onCheckedChange={() => handleToggleRule(category.id, rule.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Rule Dialog */}
        <Dialog open={isAddRuleDialogOpen} onOpenChange={setIsAddRuleDialogOpen}>
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
                  onValueChange={(value: string) => setCurrentRule(prev => ({...prev, category: value}))}
                  value={currentRule.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rule category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Upload only xlsx files with a size less than 500KB</p>
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
              <Button variant="outline" onClick={() => setIsAddRuleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRule}>Save Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
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
              <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCategory}>Save Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
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
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEditedCategory}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}