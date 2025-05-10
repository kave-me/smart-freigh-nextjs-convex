"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CompanyInfoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    taxId: "",
  });

  // For MVP, use the first user in the system
  const user = useQuery(api.myFunctions.getFirstUser);
  const convexUserId = user?._id;

  // Get user settings
  const userSettings = useQuery(
    api.userSettings.getUserSettings,
    convexUserId ? { userId: convexUserId } : "skip",
  );

  // Update user settings
  const updateSettings = useMutation(api.userSettings.updateUserSettings);

  // Loading state for data fetching
  const isLoadingData = user === undefined || userSettings === undefined;

  // Update form data when settings are loaded
  useEffect(() => {
    if (userSettings?.businessSettings) {
      setFormData({
        companyName: userSettings.businessSettings.companyName,
        companyAddress: userSettings.businessSettings.companyAddress,
        taxId: userSettings.businessSettings.taxId,
      });
    }
  }, [userSettings]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convexUserId || !userSettings) return;

    setIsLoading(true);

    try {
      await updateSettings({
        settingsId: userSettings._id,
        businessSettings: {
          companyName: formData.companyName,
          companyAddress: formData.companyAddress,
          taxId: formData.taxId,
        },
      });

      toast.success("Company Info Saved", {
        description: "Your company information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error", {
        description: "There was a problem saving your company information.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingData ? (
          // Loading skeletons
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-24 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex justify-end">
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Textarea
                id="companyAddress"
                name="companyAddress"
                placeholder="Enter your company address"
                value={formData.companyAddress}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / EIN</Label>
              <Input
                id="taxId"
                name="taxId"
                placeholder="Enter your tax ID or EIN"
                value={formData.taxId}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Company Info"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
